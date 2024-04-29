import { Request } from 'express';
import { Knex } from 'knex';
import AbstractServices from '../../../../../abstracts/abstract.services';
import Trxns from '../../../../../common/helpers/Trxns';
import { IDeletePreviousVendor } from '../../../../../common/interfaces/commonInterfaces';

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

  public voidInvoiceOther = async (
    req: Request,
    voidTran?: Knex.Transaction<any, any[]>
  ) => {
    const invoice_id = Number(req.params.invoice_id);

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.invoiceOtherModel(req, voidTran || trx);

      // DELETE PREVIOUS OTHER  INFO
      await conn.deleteTicketInfo(invoice_id, req.user_id);
      await conn.deleteHotelInfo(invoice_id, req.user_id);
      await conn.deleteTransportInfo(invoice_id, req.user_id);
      await conn.deleteBillingInfo(invoice_id, req.user_id);
      await conn.deleteOtherPassport(invoice_id, req.user_id);

      return;
    });
  };
}

export default DeleteInvoiceOtehr;
