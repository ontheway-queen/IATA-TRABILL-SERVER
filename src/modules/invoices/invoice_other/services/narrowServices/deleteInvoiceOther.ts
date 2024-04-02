import dayjs from 'dayjs';
import { Request } from 'express';
import { Knex } from 'knex';
import AbstractServices from '../../../../../abstracts/abstract.services';
import Trxns from '../../../../../common/helpers/Trxns';
import { IClTrxnBody } from '../../../../../common/interfaces/Trxn.interfaces';
import { IDeletePreviousVendor } from '../../../../../common/interfaces/commonInterfaces';
import CustomError from '../../../../../common/utils/errors/customError';

class DeleteInvoiceOtehr extends AbstractServices {
  constructor() {
    super();
  }

  public deleteInvoiceOther = async (
    req: Request,
    voidTran?: Knex.Transaction<any, any[]>
  ) => {
    const invoice_id = Number(req.params.invoice_id);
    const { invoice_has_deleted_by } = req.body;

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.invoiceOtherModel(req, voidTran || trx);
      const common_conn = this.models.CommonInvoiceModel(req, voidTran || trx);
      const trxns = new Trxns(req, voidTran || trx);

      //  PREVIOUS VENDORS TRANSACTION
      const previousBillingInfo = await conn.getPrevOtherBilling(invoice_id);

      const prevBillingInfo: IDeletePreviousVendor[] = previousBillingInfo?.map(
        (item) => {
          return {
            combined_id: item.billing_combined_id,
            vendor_id: item.billing_vendor_id,
            prev_cost_price: item.total_cost_price,
            prevTrxnId: item.prevTrxnId,
          };
        }
      );

      await trxns.deleteInvVTrxn(prevBillingInfo);

      // DELETE PREVIOUS OTHER  INFO

      await conn.deleteTicketInfo(invoice_id, invoice_has_deleted_by);
      await conn.deleteHotelInfo(invoice_id, invoice_has_deleted_by);
      await conn.deleteTransportInfo(invoice_id, invoice_has_deleted_by);
      await conn.deleteBillingInfo(invoice_id, invoice_has_deleted_by);
      await conn.deleteOtherPassport(invoice_id, invoice_has_deleted_by);
      await common_conn.deleteInvoices(invoice_id, invoice_has_deleted_by);

      await this.insertAudit(
        req,
        'delete',
        `Invoice other has been deleted, id-${invoice_id}`,
        invoice_has_deleted_by,
        'INVOICES'
      );

      return {
        success: true,
        message: 'Invoice has been deleted',
      };
    });
  };

  public voidInvoiceOther = async (req: Request) => {
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
        ctrxn_particular_type: 'reissue void charge',
        ctrxn_user_id: invoice_has_deleted_by,
      };

      await trxns.clTrxnInsert(clTrxnBody);

      await this.deleteInvoiceOther(req, trx);

      await this.insertAudit(
        req,
        'delete',
        'Invoice other has been voided',
        invoice_has_deleted_by,
        'INVOICES'
      );
      return { success: true, message: 'Invoice other has been voided' };
    });
  };
}

export default DeleteInvoiceOtehr;
