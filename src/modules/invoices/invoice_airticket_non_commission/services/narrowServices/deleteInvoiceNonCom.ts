import dayjs from 'dayjs';
import { Request } from 'express';
import { Knex } from 'knex';
import AbstractServices from '../../../../../abstracts/abstract.services';
import Trxns from '../../../../../common/helpers/Trxns';
import { IClTrxnBody } from '../../../../../common/interfaces/Trxn.interfaces';
import CustomError from '../../../../../common/utils/errors/customError';

class DeleteNonComInvoice extends AbstractServices {
  constructor() {
    super();
  }

  public deleteNonComInvoice = async (
    req: Request,
    voidTran?: Knex.Transaction<any, any[]>
  ) => {
    const invoice_id = Number(req.params.invoice_id);
    const { invoice_has_deleted_by } = req.body;

    return await this.models.db.transaction(async (trx) => {
      const common_conn = this.models.CommonInvoiceModel(req, voidTran || trx);
      const conn = this.models.invoiceNonCommission(req, voidTran || trx);
      const trxns = new Trxns(req, voidTran || trx);

      const prevBillingInfo = await conn.getPrevNonComVendor(invoice_id);

      await trxns.deleteInvVTrxn(prevBillingInfo);

      await conn.deleteNonCommissionItems(invoice_id, req.user_id);

      await common_conn.deleteInvoices(invoice_id, req.user_id);

      await this.insertAudit(
        req,
        'delete',
        `Invoice air ticket non commission has been deleted`,
        req.user_id,
        'INVOICES'
      );
      return {
        success: true,
        message: 'Invoice air ticket non commission has been deleted',
      };
    });
  };

  public voidNonCommission = async (req: Request) => {
    const common_conn = this.models.CommonInvoiceModel(req);
    const invoice_id = Number(req.params.invoice_id);

    const invoiceHasMr = await common_conn.hasInvoiceMoneyReceipt(
      req.params.invoice_id
    );

    if (invoiceHasMr) {
      throw new CustomError(
        'Regrettably, we are unable to void this invoice at the moment due to client has already payment!',
        400,
        'Unable to void'
      );
    }

    const { void_charge, invoice_has_deleted_by } = req.body;

    return await this.models.db.transaction(async (trx) => {
      const trxns = new Trxns(req, trx);
      const { comb_client, prevInvoiceNo } =
        await common_conn.getPreviousInvoices(invoice_id);

      const clTrxnBody: IClTrxnBody = {
        ctrxn_type: 'DEBIT',
        ctrxn_amount: void_charge,
        ctrxn_cl: comb_client,
        ctrxn_voucher: prevInvoiceNo,
        ctrxn_particular_id: 161,
        ctrxn_created_at: dayjs().format('YYYY-MM-DD'),
        ctrxn_note: '',
        ctrxn_particular_type: 'Invoice void charge',
      };

      await trxns.clTrxnInsert(clTrxnBody);

      await this.deleteNonComInvoice(req, trx);

      return {
        success: true,
        message: 'Invoice air ticket non commission has been voided',
      };
    });
  };
}

export default DeleteNonComInvoice;
