import { Request } from 'express';
import AbstractServices from '../../../../../abstracts/abstract.services';
import Trxns from '../../../../../common/helpers/Trxns';
import { separateCombClientToId } from '../../../../../common/helpers/common.helper';
import {
  IClTrxnBody,
  IVTrxn,
} from '../../../../../common/interfaces/Trxn.interfaces';
import DeleteInvoiceOtehr from '../../../invoice_other/services/narrowServices/deleteInvoiceOther';
import { IVoidReqBody } from '../../types/invoiceAirticket.interface';

class VoidInvoice extends AbstractServices {
  constructor() {
    super();
  }

  // VOID INVOICES
  public voidInvoice = async (req: Request) => {
    const invoice_id = Number(req.params.invoice_id);

    const body = req.body as IVoidReqBody;

    return await this.models.db.transaction(async (trx) => {
      const common_conn = this.models.CommonInvoiceModel(req, trx);
      const trxns = new Trxns(req, trx);

      const { invoice_category_id } = await common_conn.getPreviousInvoices(
        invoice_id
      );

      const content = `FARE BDT ${body.net_total}/- \nCHARGE BDT ${
        body.client_charge || 0
      }/-`;

      const ticket_nos = body.invoice_vendors
        .map((item) => item.airticket_ticket_no)
        .join(',');

      // CLIENT TRANSACTION
      const clientNetTotalTrans: IClTrxnBody = {
        ctrxn_type: 'CREDIT',
        ctrxn_amount: body.net_total,
        ctrxn_cl: body.comb_client,
        ctrxn_voucher: body.invoice_no,
        ctrxn_particular_id: 114,
        ctrxn_created_at: body.invoice_void_date,
        ctrxn_note: content,
        ctrxn_particular_type: 'TKT VOID',
        ctrxn_airticket_no: ticket_nos,
      };

      await trxns.clTrxnInsert(clientNetTotalTrans);

      let void_charge_ctrxn_id = null;

      if (body.client_charge) {
        const voidChargeClTrans: IClTrxnBody = {
          ctrxn_type: 'DEBIT',
          ctrxn_amount: body.client_charge,
          ctrxn_cl: body.comb_client,
          ctrxn_voucher: body.invoice_no,
          ctrxn_particular_id: 161,
          ctrxn_created_at: body.invoice_void_date,
          ctrxn_note: '',
          ctrxn_particular_type: 'TKT VOID CHARGE',
          ctrxn_airticket_no: ticket_nos,
        };
        void_charge_ctrxn_id = await trxns.clTrxnInsert(voidChargeClTrans);
      }

      // delete invoice;
      if (invoice_category_id === 1) {
        // air ticket
        await this.models
          .invoiceAirticketModel(req, trx)
          .deleteAirticketItems(invoice_id, req.user_id);
      } else if (invoice_category_id === 2) {
        // non commission
        await this.models
          .invoiceNonCommission(req, trx)
          .deleteNonCommissionItems(invoice_id, req.user_id);
      } else if (invoice_category_id === 3) {
        // reissue
        await this.models
          .reissueAirticket(req, trx)
          .deleteAirticketReissueItems(invoice_id, req.user_id);
      } else if (invoice_category_id === 5) {
        // others
        new DeleteInvoiceOtehr().voidInvoiceOther(req, trx);
      }

      // UPDATED VOID INFORMATION
      await common_conn.updateIsVoid(
        invoice_id,
        body.client_charge || 0,
        void_charge_ctrxn_id,
        body.invoice_void_date
      );

      //   VENDOR TRANSACTIONS
      for (const item of body.invoice_vendors) {
        const { vendor_id } = separateCombClientToId(item.comb_vendor);

        const vendorPurchaseVoidTrans: IVTrxn = {
          comb_vendor: item.comb_vendor,
          vtrxn_amount: item.cost_price,
          vtrxn_created_at: body.invoice_void_date,
          vtrxn_note: `BDT ${item.cost_price}/- \nCHARGE BDT ${item.vendor_charge}/-`,
          vtrxn_particular_id: 1,
          vtrxn_particular_type: 'TKT VOID',
          vtrxn_type: vendor_id ? 'CREDIT' : 'DEBIT',
          vtrxn_user_id: req.user_id,
          vtrxn_voucher: body.invoice_no,
          vtrxn_airticket_no: item.airticket_ticket_no,
        };

        await trxns.VTrxnInsert(vendorPurchaseVoidTrans);

        if (item.vendor_charge) {
          const vendorVoidCharge: IVTrxn = {
            comb_vendor: item.comb_vendor,
            vtrxn_amount: item.vendor_charge,
            vtrxn_created_at: body.invoice_void_date,
            vtrxn_note: ``,
            vtrxn_particular_id: 1,
            vtrxn_particular_type: 'TKT VOID CHARGE',
            vtrxn_type: vendor_id ? 'DEBIT' : 'CREDIT',
            vtrxn_user_id: req.user_id,
            vtrxn_airticket_no: item.airticket_ticket_no,
            vtrxn_voucher: body.invoice_no,
          };

          await trxns.VTrxnInsert(vendorVoidCharge);
        }
      }

      await this.insertAudit(req, 'delete', content, req.user_id, 'INVOICES');

      return { success: true, message: content };
    });
  };
}

export default VoidInvoice;
