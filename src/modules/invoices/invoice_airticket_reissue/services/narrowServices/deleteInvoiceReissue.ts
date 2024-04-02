import dayjs from 'dayjs';
import { Request } from 'express';
import { Knex } from 'knex';
import AbstractServices from '../../../../../abstracts/abstract.services';
import Trxns from '../../../../../common/helpers/Trxns';
import { IClTrxnBody } from '../../../../../common/interfaces/Trxn.interfaces';
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
    return await this.models.db.transaction(async (trx) => {
      const common_conn = this.models.CommonInvoiceModel(req, voidTran || trx);
      const conn = this.models.reissueAirticket(req, voidTran || trx);

      const previousVendorBilling = await conn.getReissuePrevVendors(
        invoice_id
      );

      await conn.deleteReissueFlightDetails(invoice_id, req.user_id);
      await conn.deleteAirticketReissue(invoice_id, req.user_id);
      await common_conn.deleteInvoices(invoice_id, req.user_id);
      await new Trxns(req, voidTran || trx).deleteInvVTrxn(
        previousVendorBilling
      );

      // UPDATE PREVIOUS INVOICE IS NOT REISSUED
      for (const item of previousVendorBilling) {
        const prevInvCateId = await conn.getExistingInvCateId(item.ex_inv_id);

        await conn.updateInvoiceIsReissued(item.ex_inv_id, 0);
        await conn.updateAirTicketIsReissued(
          prevInvCateId,
          item.ex_airticket_id,
          0
        );
      }

      await this.insertAudit(
        req,
        'delete',
        `Air ticket reissue has been deleted!`,
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
