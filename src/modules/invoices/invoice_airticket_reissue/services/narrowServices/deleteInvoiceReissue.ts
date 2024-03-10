import { Request } from 'express';
import AbstractServices from '../../../../../abstracts/abstract.services';
import { IClTrxnBody } from '../../../../../common/interfaces/Trxn.interfaces';
import dayjs from 'dayjs';
import Trxns from '../../../../../common/helpers/Trxns';
import { Knex } from 'knex';
import CustomError from '../../../../../common/utils/errors/customError';

class DeleteReissue extends AbstractServices {
  constructor() {
    super();
  }

  public deleteReissue = async (
    req: Request,
    voidTran?: Knex.Transaction<any, any[]>
  ) => {
    const invoice_id = Number(req.params.invoice_id);
    const { invoice_has_deleted_by } = req.body;

    return await this.models.db.transaction(async (trx) => {
      const common_conn = this.models.CommonInvoiceModel(req, voidTran || trx);
      const conn = this.models.reissueAirticket(req, voidTran || trx);

      const previousVendorBilling = await conn.getReissuePrevVendors(
        invoice_id
      );

      await conn.deleteReissueFlightDetails(invoice_id, req.user_id);
      await conn.deleteAirticketReissue(invoice_id, req.user_id);
      await new Trxns(req, voidTran || trx).deleteInvVTrxn(
        previousVendorBilling
      );
      await common_conn.deleteInvoices(invoice_id, req.user_id);

      await this.insertAudit(
        req,
        'delete',
        `Invoice air ticket reissue has been deleted`,
        req.user_id,
        'INVOICES'
      );

      return {
        success: true,
        data: 'Invoice deleted successfully',
      };
    });
  };

  public voidReissue = async (
    req: Request,
    voidTrx?: Knex.Transaction<any, any[]>
  ) => {
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
      const trxns = new Trxns(req, voidTrx || trx);
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

      await this.deleteReissue(req, voidTrx || trx);

      await common_conn.transferInvoiceInfoToVoid(invoice_id, void_charge);
      await this.insertAudit(
        req,
        'delete',
        'Invoice reissue has been voided',
        invoice_has_deleted_by,
        'INVOICES'
      );

      return { success: true, message: 'Invoice reissue has been voided' };
    });
  };
}

export default DeleteReissue;
