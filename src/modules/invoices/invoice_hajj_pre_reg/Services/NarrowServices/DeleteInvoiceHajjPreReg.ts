import dayjs from 'dayjs';
import { Request } from 'express';
import AbstractServices from '../../../../../abstracts/abstract.services';
import Trxns from '../../../../../common/helpers/Trxns';
import { IClTrxnBody } from '../../../../../common/interfaces/Trxn.interfaces';
import { Knex } from 'knex';

class DeleteInvoiceHajjPreReg extends AbstractServices {
  constructor() {
    super();
  }

  public deleteInvoiceHajjPre = async (
    req: Request,
    voidTran?: Knex.Transaction<any, any[]>
  ) => {
    const invoice_id = Number(req.params.invoice_id);
    const { invoice_has_deleted_by } = req.body;

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.invoiceHajjPre(req, voidTran || trx);
      const common_conn = this.models.CommonInvoiceModel(req, voidTran || trx);
      const trxns = new Trxns(req, voidTran || trx);

      await conn.deleteInvoiceHajiPreReg(invoice_id, req.user_id);

      await common_conn.deleteInvoices(invoice_id, req.user_id);

      const previousBillingInfo = await conn.getHajiBillingInfo(invoice_id);

      await trxns.deleteInvVTrxn(previousBillingInfo);

      await conn.deleteHajiBillingInfo(invoice_id, req.user_id);

      const previous_info = await conn.getPreviousHajiInfo(invoice_id);

      await conn.deleteInvoiceHajiPreReg(invoice_id, req.user_id);

      for (const prevInfo of previous_info) {
        await conn.deletePrevHajiInfo(prevInfo.haji_info_id, req.user_id);
      }

      await this.insertAudit(
        req,
        'delete',
        `Invoice hajj pre registration has been deleted`,
        req.user_id,
        'INVOICES'
      );
      return {
        success: true,
        message: 'Invoice deleted successfully...',
      };
    });
  };

  public voidHajjPreReg = async (req: Request) => {
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

      await this.deleteInvoiceHajjPre(req, trx);

      await this.insertAudit(
        req,
        'delete',
        `Invoice hajj pre reg has been voided, inv-id:${invoice_id}`,
        invoice_has_deleted_by,
        'INVOICES'
      );

      return { success: true, message: 'Invoice hajj pre reg has been voided' };
    });
  };
}

export default DeleteInvoiceHajjPreReg;
