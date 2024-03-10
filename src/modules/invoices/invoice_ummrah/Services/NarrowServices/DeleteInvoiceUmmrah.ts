import dayjs from 'dayjs';
import { Request } from 'express';
import { Knex } from 'knex';
import AbstractServices from '../../../../../abstracts/abstract.services';
import Trxns from '../../../../../common/helpers/Trxns';
import { IClTrxnBody } from '../../../../../common/interfaces/Trxn.interfaces';
import CustomError from '../../../../../common/utils/errors/customError';

class DeleteInvoiceUmmrah extends AbstractServices {
  constructor() {
    super();
  }

  public deleteInvoiceUmmrah = async (
    req: Request,
    voidTran?: Knex.Transaction<any, any[]>
  ) => {
    const invoice_id = Number(req.params.invoice_id);
    const { invoice_has_deleted_by } = req.body;

    return await this.models.db.transaction(async (trx) => {
      const common_conn = this.models.CommonInvoiceModel(req, voidTran || trx);
      const conn = this.models.InvoiceUmmarhModels(req, voidTran || trx);
      const trxns = new Trxns(req, voidTran || trx);

      const previousBillingInfo = await conn.getPrevIUBilling(invoice_id);

      await conn.deleteUmmrahRoutesByInvoiceId(invoice_id, req.user_id);

      await conn.deleteIUHotelInfosByInvoiceId(invoice_id, req.user_id);
      await conn.deleteIUBillingInfos(invoice_id, req.user_id);
      await conn.deletePassengerInfo(invoice_id, req.user_id);

      await common_conn.deleteInvoices(invoice_id, req.user_id);

      await trxns.deleteInvVTrxn(previousBillingInfo);

      await this.insertAudit(
        req,
        'delete',
        `Invoice ummrah has been deleted`,
        req.user_id,
        'INVOICES'
      );
      return {
        success: true,
        data: 'Invoice deleted successfully...',
      };
    });
  };

  public voidInvoiceUmmrah = async (req: Request) => {
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
        ctrxn_particular_id: 161,
        ctrxn_created_at: dayjs().format('YYYY-MM-DD'),
        ctrxn_note: '',
        ctrxn_particular_type: 'reissue void',
        ctrxn_user_id: invoice_has_deleted_by,
      };

      await trxns.clTrxnInsert(clTrxnBody);

      await this.deleteInvoiceUmmrah(req, trx);
      await common_conn.transferInvoiceInfoToVoid(invoice_id, void_charge);

      await this.insertAudit(
        req,
        'delete',
        `Invoice airticket has been voided, inv-id:${invoice_id}`,
        invoice_has_deleted_by,
        'INVOICES'
      );

      return { success: true, message: 'Invoice airticket has been voided' };
    });
  };
}

export default DeleteInvoiceUmmrah;
