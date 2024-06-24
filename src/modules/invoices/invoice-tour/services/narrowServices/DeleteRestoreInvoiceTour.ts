import dayjs from 'dayjs';
import { Request } from 'express';
import AbstractServices from '../../../../../abstracts/abstract.services';
import Trxns from '../../../../../common/helpers/Trxns';
import { IClTrxnBody } from '../../../../../common/interfaces/Trxn.interfaces';
import { Knex } from 'knex';

class DeleteResetInvoiceTour extends AbstractServices {
  constructor() {
    super();
  }

  public deleteResetInvoiceTour = async (
    req: Request,
    voidTran?: Knex.Transaction<any, any[]>
  ) => {
    const invoice_id = Number(req.params.invoice_id);
    const { invoice_has_deleted_by } = req.body;

    return await this.models.db.transaction(async (trx) => {
      const common_conn = this.models.CommonInvoiceModel(req, voidTran || trx);
      const conn = this.models.invoiceTourModels(req, voidTran || trx);
      const trxns = new Trxns(req, voidTran || trx);

      const previousBilling = await conn.getPrevBillingCost(invoice_id);

      await conn.deletePrevBillingCost(invoice_id, invoice_has_deleted_by);

      await common_conn.deleteInvoices(invoice_id, invoice_has_deleted_by);

      await trxns.deleteInvVTrxn(previousBilling);

      const content = `Invoice tour has been deleted, inv-id:${invoice_id}`;
      await this.insertAudit(
        req,
        'create',
        content,
        invoice_has_deleted_by,
        'INVOICES'
      );
      return {
        success: true,
        data: 'Invoice cost has been deleted',
      };
    });
  };

  public voidInvoiceTour = async (req: Request) => {
    const common_conn = this.models.CommonInvoiceModel(req);
    const invoice_id = Number(req.params.invoice_id);

    const { void_charge, invoice_has_deleted_by } = req.body as {
      void_charge: number;
      invoice_has_deleted_by: number;
    };

    return await this.models.db.transaction(async (trx) => {
      const trxns = new Trxns(req, trx);
      const { comb_client, prevInvoiceNo } =
        await common_conn.getPreviousInvoices(invoice_id);

      const clTrxnBody: IClTrxnBody = {
        ctrxn_type: 'DEBIT',
        ctrxn_amount: void_charge,
        ctrxn_cl: comb_client,
        ctrxn_voucher: prevInvoiceNo,
        ctrxn_particular_id: 56,
        ctrxn_created_at: dayjs().format('YYYY-MM-DD'),
        ctrxn_note: '',
      };

      await trxns.clTrxnInsert(clTrxnBody);

      await this.deleteResetInvoiceTour(req, trx);

      await this.insertAudit(
        req,
        'delete',
        'Invoice tour pakckage has been voided',
        invoice_has_deleted_by,
        'INVOICES'
      );

      return {
        success: true,
        message: 'Invoice tour pakckage has been voided',
      };
    });
  };
}

export default DeleteResetInvoiceTour;
