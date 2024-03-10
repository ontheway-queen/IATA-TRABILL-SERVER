import { Request } from 'express';
import AbstractServices from '../../../../../abstracts/abstract.services';
import {
  IHajjRefundItems,
  IHajjRefundReqBody,
} from '../../Type/InvoiceHajj.Interfaces';
import Trxns from '../../../../../common/helpers/Trxns';
import { getPaymentType } from '../../../../../common/utils/libraries/lib';
import { generateVoucherNumber } from '../../../../../common/helpers/invoice.helpers';
import { separateCombClientToId } from '../../../../../common/helpers/common.helper';
import { InvoiceHistory } from '../../../../../common/types/common.types';

class HajjRefundServices extends AbstractServices {
  constructor() {
    super();
  }

  public hajjRefund = async (req: Request) => {
    const {
      client_refund_type,
      client_total_refund,
      refund_date,
      invoice_id,
      comb_client,
      vendor_refund_type,
      vendor_total_refund,
      client_payment_acc_id,
      client_payment_method,
      vendor_payment_acc_id,
      vendor_payment_method,
      billing_info,
      created_by,
    } = req.body as IHajjRefundReqBody;

    let totalSales = 0;
    let clientCharge = 0;
    let totalPurchase = 0;
    let vendorCharge = 0;

    for (const item of billing_info) {
      totalSales += item.billing_unit_price || 0;
      clientCharge += item.client_charge || 0;
      totalPurchase += item.billing_cost_price || 0;
      vendorCharge += item.vendor_charge || 0;
    }

    const clientContent = `Total sales price: ${totalSales}/-, Refund charge: ${clientCharge}/-`;
    const vendorContent = `Total purchase price: ${totalPurchase}/-, Refund charge: ${vendorCharge}/-`;

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.InvoiceHajjModels(req, trx);
      const common_conn = this.models.CommonInvoiceModel(req, trx);
      const trxn = new Trxns(req, trx);
      const voucher_no = generateVoucherNumber(6, 'HR');

      const { combined_id, client_id } = separateCombClientToId(comb_client);

      let refund_client_acc_trxn_id = null;
      let refund_ctrxn_id = null;
      let refund_vendor_acc_trxn_id = null;
      if (client_refund_type === 'Adjust') {
        refund_ctrxn_id = await trxn.clTrxnInsert({
          ctrxn_amount: client_total_refund,
          ctrxn_cl: comb_client,
          ctrxn_created_at: refund_date,
          ctrxn_particular_id: 8,
          ctrxn_particular_type: 'Hajj Refund ' + client_refund_type,
          ctrxn_voucher: voucher_no,
          ctrxn_type: 'CREDIT',
          ctrxn_user_id: created_by,
          ctrxn_note: clientContent,
        });
      } else {
        refund_client_acc_trxn_id = await trxn.AccTrxnInsert({
          acctrxn_ac_id: client_payment_acc_id,
          acctrxn_amount: client_total_refund,
          acctrxn_created_at: refund_date,
          acctrxn_created_by: created_by,
          acctrxn_particular_id: 8,
          acctrxn_particular_type: 'Client Refund Return',
          acctrxn_pay_type: getPaymentType(client_payment_method),
          acctrxn_type: 'DEBIT',
          acctrxn_voucher: voucher_no,
          acctrxn_note: clientContent,
        });
      }

      if (vendor_refund_type === 'Return') {
        refund_vendor_acc_trxn_id = await trxn.AccTrxnInsert({
          acctrxn_ac_id: client_payment_acc_id,
          acctrxn_amount: client_total_refund,
          acctrxn_created_at: refund_date,
          acctrxn_created_by: created_by,
          acctrxn_particular_id: 7,
          acctrxn_particular_type: 'Vendor Refund Return',
          acctrxn_pay_type: getPaymentType(client_payment_method),
          acctrxn_type: 'CREDIT',
          acctrxn_voucher: voucher_no,
          acctrxn_note: vendorContent,
        });
      }

      const refund_id = await conn.createHajjRefund({
        refund_client_acc_id: client_payment_acc_id,
        refund_voucher_no: voucher_no,
        refund_client_acc_trxn_id,
        refund_client_id: client_id,
        refund_combine_id: combined_id,
        refund_client_payment_method: client_payment_method,
        refund_client_total: client_total_refund,
        refund_client_type: client_refund_type,
        refund_created_by: created_by,
        refund_ctrxn_id,
        refund_invoice_id: invoice_id,
        refund_org_agency: +req.agency_id,
        refund_vendor_acc_id: vendor_payment_acc_id,
        refund_vendor_acc_trxn_id,
        refund_vendor_payment_method: vendor_payment_method,
        refund_vendor_total: vendor_total_refund,
        refund_vendor_type: vendor_refund_type,
        refund_date,
      });

      const refundItemsInfo: IHajjRefundItems[] = [];
      for (const billing of billing_info) {
        const {
          refund_quantity,
          vendor_charge,
          vendor_refund,
          comb_vendor,
          client_charge,
          client_refund,
          billing_cost_price,
          billing_id,
          billing_unit_price,
        } = billing;

        const { vendor_id, combined_id } = separateCombClientToId(comb_vendor);

        let ritem_vtrx_id = null;
        if (vendor_refund_type === 'Adjust') {
          ritem_vtrx_id = await trxn.VTrxnInsert({
            vtrxn_amount: billing_cost_price,
            vtrxn_created_at: refund_date,
            vtrxn_particular_id: 7,
            vtrxn_particular_type: 'Hajj Refund ' + client_refund_type,
            vtrxn_type: 'CREDIT',
            vtrxn_user_id: created_by,
            vtrxn_voucher: voucher_no,
            comb_vendor,
            vtrxn_note: vendorContent,
          });
        }

        const refundItem: IHajjRefundItems = {
          ritem_billing_id: billing_id,
          ritem_client_charge: client_charge,
          ritem_client_refund: client_refund,
          ritem_combine_id: combined_id,
          ritem_vendor_id: vendor_id,
          ritem_quantity: refund_quantity,
          ritem_cost_price: billing_cost_price,
          ritem_unit_price: billing_unit_price,
          ritem_refund_id: refund_id,
          ritem_vendor_charge: vendor_charge,
          ritem_vendor_refund: vendor_refund,
          ritem_vtrx_id,
        };

        // update billing remaining quantity;
        await conn.updateHajjBillingRemainingQuantity(
          billing_id,
          refund_quantity
        );

        refundItemsInfo.push(refundItem);
      }

      if (refundItemsInfo.length)
        await conn.createHajjRefundItems(refundItemsInfo);

      const history_data: InvoiceHistory = {
        history_activity_type: 'INVOICE_REFUNDED',
        history_created_by: created_by,
        history_invoice_id: invoice_id,
        invoicelog_content: 'Invoice Reissue Refunded. Voucher:' + voucher_no,
      };

      await common_conn.insertInvoiceHistory(history_data);

      // update invoice is refund;
      await conn.updateHajjInvoiceIsRefund(invoice_id, 1);

      await this.insertAudit(
        req,
        'create',
        'Hajj refund has been created',
        created_by,
        'HAJJ_MGT'
      );

      return {
        success: true,
        message: 'Hajj Refund Created Successful!',
        data: refund_id,
      };
    });
  };
}
export default HajjRefundServices;
