import dayjs from 'dayjs';
import { Request } from 'express';
import { Knex } from 'knex';
import AbstractServices from '../../../../../abstracts/abstract.services';
import Trxns from '../../../../../common/helpers/Trxns';
import { IClTrxnBody } from '../../../../../common/interfaces/Trxn.interfaces';
import { IDeletePreviousVendor } from '../../../../../common/interfaces/commonInterfaces';
import CustomError from '../../../../../common/utils/errors/customError';

class DeleteInvoiceVisa extends AbstractServices {
  constructor() {
    super();
  }

  public deleteInvoiceVisa = async (
    req: Request,
    voidTran?: Knex.Transaction<any, any[]>
  ) => {
    const invoice_id = req.params.invoice_id;
    const { invoice_has_deleted_by } = req.body;

    return await this.models.db.transaction(async (trx) => {
      const common_conn = this.models.CommonInvoiceModel(req, voidTran || trx);

      const conn = this.models.invoiceVisaModel(req, voidTran || trx);
      const trxns = new Trxns(req, voidTran || trx);

      const previousBillingInfo = await conn.getPrevVisaBilling(invoice_id);

      if (previousBillingInfo[0].prevTrxnId) {
        const prevBillingInfo: IDeletePreviousVendor[] =
          previousBillingInfo?.map((item) => {
            return {
              combined_id: item.billing_combined_id,
              vendor_id: item.billing_vendor_id,
              prev_cost_price: item.total_cost_price,
              prevTrxnId: item.prevTrxnId,
            };
          });

        await trxns.deleteInvVTrxn(prevBillingInfo);
      }

      await conn.deleteBillingInfo(invoice_id, req.user_id);
      await conn.deleteVisaPassport(invoice_id, req.user_id);
      await common_conn.deleteInvoices(invoice_id, req.user_id);

      await this.insertAudit(
        req,
        'delete',
        `Invoice visa has been deleted, inv-id: ${invoice_id}`,
        req.user_id,
        'INVOICES'
      );

      return {
        success: true,
        message: 'Invoice visa has been deleted...',
      };
    });
  };

  public voidInvoiceVisa = async (req: Request) => {
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

    const { void_charge, invoice_has_deleted_by, vendor_charge } = req.body as {
      void_charge: number;
      invoice_has_deleted_by: number;
      vendor_charge: number;
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

      await this.deleteInvoiceVisa(req, trx);

      await this.insertAudit(
        req,
        'delete',
        'Invoice visa has been voided',
        invoice_has_deleted_by,
        'INVOICES'
      );

      return { success: true, message: 'Invoice visa has been voided' };
    });
  };
}

export default DeleteInvoiceVisa;
