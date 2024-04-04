import dayjs from 'dayjs';
import { Request } from 'express';

import { Knex } from 'knex';
import AbstractServices from '../../../../../abstracts/abstract.services';
import Trxns from '../../../../../common/helpers/Trxns';
import CustomError from '../../../../../common/utils/errors/customError';
import { IClTrxnBody } from '../../../../../common/interfaces/Trxn.interfaces';

class DeleteInvoiceHajj extends AbstractServices {
  constructor() {
    super();
  }

  public deleteInvoiceHajj = async (
    req: Request,
    voidTran?: Knex.Transaction<any, any[]>
  ) => {
    const invoice_id = Number(req.params.invoice_id);
    const { invoice_has_deleted_by } = req.body;

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.InvoiceHajjModels(req, voidTran || trx);
      const common_conn = this.models.CommonInvoiceModel(req, voidTran || trx);
      const conn_hajj_pre = this.models.invoiceHajjPre(req, voidTran || trx);
      const trxns = new Trxns(req, voidTran || trx);

      const previousData = await conn.getInvoiceHajjInfos(invoice_id);
      const previousBillingInfo = await conn.getHajiBillingInfo(invoice_id);

      // delete_previous_data
      await common_conn.deleteAirticketRoute(invoice_id, req.user_id);
      await conn.deleteInBillingInfos(invoice_id, req.user_id);

      await conn.deleteHajjiPassport(invoice_id, req.user_id);

      await conn.deleteInvoiceHajjHotelInfos(invoice_id, req.user_id);
      await conn.deleteInTransportInfos(invoice_id, req.user_id);

      await common_conn.deleteInvoices(invoice_id, req.user_id);

      await trxns.deleteInvVTrxn(previousBillingInfo);

      for (const item of previousData) {
        await conn_hajj_pre.deletePrevHajiInfo(
          item.haji_info_haji_id,
          req.user_id
        );
      }

      await this.insertAudit(
        req,
        'delete',
        `Invoice hajj has been deleted`,
        req.user_id,
        'INVOICES'
      );
      return {
        success: true,
        data: 'Invoice deleted successfully...',
      };
    });
  };

  public voidInvoiceHajj = async (req: Request) => {
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
      };

      await trxns.clTrxnInsert(clTrxnBody);
      await this.deleteInvoiceHajj(req, trx);

      await this.insertAudit(
        req,
        'delete',
        `Invoice hajj has been voided, inv-id:${invoice_id}`,
        invoice_has_deleted_by,
        'INVOICES'
      );

      return { success: true, message: 'Invoice hajj has been voided' };
    });
  };
}

export default DeleteInvoiceHajj;
