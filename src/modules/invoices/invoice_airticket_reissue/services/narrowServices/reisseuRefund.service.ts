import { Request } from 'express';
import AbstractServices from '../../../../../abstracts/abstract.services';
import Trxns from '../../../../../common/helpers/Trxns';
import { generateVoucherNumber } from '../../../../../common/helpers/invoice.helpers';
import {
  IAcTrxn,
  IClTrxnBody,
  IVTrxn,
} from '../../../../../common/interfaces/Trxn.interfaces';
import { InvoiceHistory } from '../../../../../common/types/common.types';
import { getPaymentType } from '../../../../../common/utils/libraries/lib';
import {
  IReissueRefundDb,
  IReissueRefundItemDb,
  IReissueReturnBody,
} from '../../types/invoiceReissue.interface';
import { separateCombClientToId } from './../../../../../common/helpers/common.helper';

class ReissueRefundService extends AbstractServices {
  constructor() {
    super();
  }

  public reissueRefund = async (req: Request) => {
    const {
      comb_client,
      invoice_id,
      client_total_refund,
      client_payment_method,
      vendor_refund_type,
      client_refund_type,
      total_vendor_refund,
      vendor_payment_method,
      vendor_payment_acc_id,
      client_payment_acc_id,
      created_by,
      ticket_info,
      refund_date,
    } = req.body as IReissueReturnBody;

    const { client_id, combined_id } = separateCombClientToId(comb_client);

    let totalSales = 0;
    let clientCharge = 0;
    let totalPurchase = 0;
    let vendorCharge = 0;

    for (const item of ticket_info) {
      totalSales += item.airticket_client_price || 0;
      clientCharge += item.client_charge || 0;
      totalPurchase += item.airticket_purchase_price || 0;
      vendorCharge += item.vendor_charge || 0;
    }

    const clientContent = `Total sales price: ${totalSales}/-, Refund charge: ${clientCharge}/-`;
    const vendorContent = `Total purchase price: ${totalPurchase}/-, Refund charge: ${vendorCharge}/-`;

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.reissueAirticket(req, trx);
      const common_conn = this.models.CommonInvoiceModel(req, trx);
      const trxns = new Trxns(req, trx);

      const voucher = generateVoucherNumber(6, 'R');

      // TRANSACTIONs
      let refund_client_trx_id = null;
      let refund_client_account_trx_id = null;
      let refund_vendor_account_trx_id = null;
      if (client_refund_type == 'Adjust') {
        // CLIENT TRANS
        const clTrxnBody: IClTrxnBody = {
          ctrxn_type: 'CREDIT',
          ctrxn_amount: client_total_refund,
          ctrxn_cl: comb_client,
          ctrxn_voucher: voucher,
          ctrxn_particular_id: 8, // refund to client
          ctrxn_created_at: refund_date,
          ctrxn_note: clientContent,
          ctrxn_particular_type: 'Reissue Refund ' + client_refund_type,
          ctrxn_user_id: created_by,
        };
        refund_client_trx_id = await trxns.clTrxnInsert(clTrxnBody);
      } else {
        // CLIENT ACCOUNT TRANS
        const AccTrxnBody: IAcTrxn = {
          acctrxn_ac_id: client_payment_acc_id,
          acctrxn_type: 'DEBIT',
          acctrxn_voucher: voucher,
          acctrxn_amount: client_total_refund,
          acctrxn_created_at: refund_date,
          acctrxn_created_by: created_by,
          acctrxn_note: clientContent,
          acctrxn_particular_id: 8,
          acctrxn_particular_type: 'Reissue Client Refund Return',
          acctrxn_pay_type: getPaymentType(client_payment_method),
        };

        refund_vendor_account_trx_id = await trxns.AccTrxnInsert(AccTrxnBody);
      }

      // VENDOR ACCOUNT TRANS
      if (vendor_refund_type === 'Return') {
        const AccTrxnBody: IAcTrxn = {
          acctrxn_ac_id: vendor_payment_acc_id,
          acctrxn_type: 'CREDIT',
          acctrxn_voucher: voucher,
          acctrxn_amount: total_vendor_refund,
          acctrxn_created_at: refund_date,
          acctrxn_created_by: created_by,
          acctrxn_note: vendorContent,
          acctrxn_particular_id: 7,
          acctrxn_particular_type: 'Vendor Refund Return',
          acctrxn_pay_type: getPaymentType(client_payment_method),
        };

        refund_client_account_trx_id = await trxns.AccTrxnInsert(AccTrxnBody);
      }

      // REISSUE REFUND
      const refundData: IReissueRefundDb = {
        refund_org_agency: req.agency_id,
        refund_client_id: client_id,
        refund_combined_id: combined_id,
        refund_client_trx_id,
        refund_invoice_id: invoice_id,
        refund_client_total: client_total_refund,
        refund_client_type: client_refund_type,
        refund_client_payment_method: client_payment_method,
        refund_client_account_id: client_payment_acc_id,
        refund_client_account_trx_id,
        refund_vendor_total: total_vendor_refund,
        refund_vendor_type: vendor_refund_type,
        refund_vendor_payment_method: vendor_payment_method,
        refund_vendor_account_id: vendor_payment_acc_id,
        refund_vendor_account_trx_id,
        refund_created_by: created_by,
        refund_voucher: voucher,
        refund_date,
      };

      const refund_id = await conn.insertReissueRefund(refundData);

      // REFUND ITEM
      const refundDateItems: IReissueRefundItemDb[] = [];

      for (const item of ticket_info) {
        const { combined_id: ritem_combined_id, vendor_id } =
          separateCombClientToId(item.comb_vendor);

        let ritem_vendor_trx_id = null;

        // VENDOR TRANSACTION
        if (vendor_refund_type === 'Adjust') {
          const VTrxnBody: IVTrxn = {
            comb_vendor: item.comb_vendor,
            vtrxn_amount: item.vendor_refund,
            vtrxn_created_at: refund_date,
            vtrxn_note: `Purchase price ${item.airticket_purchase_price}/-, Charge ${item.vendor_charge}/-`,
            vtrxn_particular_id: 7,
            vtrxn_particular_type: 'Vendor Reissue Refund Adjust',
            vtrxn_type: 'CREDIT',
            vtrxn_user_id: created_by,
            vtrxn_voucher: voucher,
          };

          ritem_vendor_trx_id = await trxns.VTrxnInsert(VTrxnBody);
        }

        const refundItem: IReissueRefundItemDb = {
          ritem_refund_id: refund_id as number,
          ritem_airticket_item_id: item.airticket_id,
          ritem_vendor_id: vendor_id,
          ritem_combined_id,
          ritem_vendor_trx_id,
          ritem_sales: item.airticket_client_price,
          ritem_client_charge: item.client_charge,
          ritem_client_refund: item.client_refund,
          ritem_purchase: item.airticket_purchase_price,
          ritem_vendor_charge: item.vendor_charge,
          ritem_vendor_refund: item.vendor_refund,
        };

        refundDateItems.push(refundItem);

        await conn.reissueItemRefundUpdate(item.airticket_id);
      }

      await conn.insertReissueRefundItem(refundDateItems);

      // UPDATE INVOICE IS REFUND
      await conn.updateInvoiceIsRefund(invoice_id);

      // INVOICE HISTORY INSERT
      const history_data: InvoiceHistory = {
        history_activity_type: 'INVOICE_REFUNDED',
        history_created_by: created_by,
        history_invoice_id: invoice_id,
        invoicelog_content: 'Invoice Reissue Refunded. Voucher:' + voucher,
      };

      await common_conn.insertInvoiceHistory(history_data);

      // AUDIT
      this.insertAudit(
        req,
        'create',
        'Invoice Reissue Refunded. Voucher:' + voucher,
        created_by,
        'REFUND'
      );

      return {
        success: true,
        message: 'Reissue Refund Created Successfully! Voucher:' + voucher,
      };
    });
  };

  getReissueRefundInfo = async (req: Request) => {
    const conn = this.models.reissueAirticket(req);

    const invoiceId = req.params.invoice_id;

    const refundData = await conn.getReissueRefundData(invoiceId);
    const refundItems = await conn.getReissueRefundItems(invoiceId);

    return {
      success: true,
      data: {
        refundData,
        refundItems,
      },
    };
  };
}

export default ReissueRefundService;
