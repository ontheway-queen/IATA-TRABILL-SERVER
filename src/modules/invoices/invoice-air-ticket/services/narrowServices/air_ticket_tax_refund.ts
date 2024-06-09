import { Request } from 'express';
import AbstractServices from '../../../../../abstracts/abstract.services';
import Trxns from '../../../../../common/helpers/Trxns';
import { separateCombClientToId } from '../../../../../common/helpers/common.helper';
import { generateVoucherNumber } from '../../../../../common/helpers/invoice.helpers';
import {
  IAcTrxn,
  IClTrxnBody,
  IVTrxn,
} from '../../../../../common/interfaces/Trxn.interfaces';
import { getPaymentType } from '../../../../../common/utils/libraries/lib';
import {
  IAirTicketTaxRefund,
  IAirTicketTaxRefundBody,
  IAirTicketTaxRefundItem,
} from '../../types/invoiceAirticket.interface';

class AirTicketTaxRefund extends AbstractServices {
  constructor() {
    super();
  }

  addAirTicketTax = async (req: Request) => {
    const {
      refund_invoice_id,
      invoice_category_id,
      comb_client,
      ticket_info,
      client_refund_type,
      vendor_refund_type,
      client_pay_type,
      vendor_pay_type,
      client_account_id,
      vendor_account_id,
      client_total_tax_refund,
      vendor_total_tax_refund,
      refund_date,
    } = req.body as IAirTicketTaxRefundBody;

    const profit = vendor_total_tax_refund - client_total_tax_refund;

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.invoiceAirticketModel(req, trx);
      const trxns = new Trxns(req, trx);

      const { client_id, combined_id } = separateCombClientToId(comb_client);

      const refund_voucher = generateVoucherNumber(4, 'TRF');

      let refund_c_trxn_id = null;
      let client_account_trxn_id = null;
      let vendor_account_trxn_id = null;
      const clAccPayType = getPaymentType(client_pay_type);
      const VAccPayType = getPaymentType(vendor_pay_type);

      // CLIENT TRANSACTION
      if (client_refund_type === 'Adjust') {
        const clTrxnBody: IClTrxnBody = {
          ctrxn_type: 'CREDIT',
          ctrxn_amount: client_total_tax_refund,
          ctrxn_cl: comb_client,
          ctrxn_particular_id: 108,
          ctrxn_created_at: refund_date,
          ctrxn_note: '',
          ctrxn_particular_type: 'AIR TICKET TAX REFUND',
          ctrxn_pay_type: clAccPayType,
          ctrxn_voucher: refund_voucher,
        };

        refund_c_trxn_id = await trxns.clTrxnInsert(clTrxnBody);
      } else {
        const ACTrxnBody: IAcTrxn = {
          acctrxn_ac_id: client_account_id,
          acctrxn_type: 'DEBIT',
          acctrxn_amount: client_total_tax_refund,
          acctrxn_created_at: refund_date,
          acctrxn_created_by: req.user_id,
          acctrxn_note: 'Client Refund',
          acctrxn_particular_id: 108,
          acctrxn_particular_type: 'AIR TICKET TAX REFUND',
          acctrxn_pay_type: clAccPayType,
          acctrxn_voucher: refund_voucher,
        };

        client_account_trxn_id = await trxns.AccTrxnInsert(ACTrxnBody);

        const clTrxnBody: IClTrxnBody = {
          ctrxn_type: 'CREDIT',
          ctrxn_amount: 0,
          ctrxn_cl: comb_client,
          ctrxn_particular_id: 108,
          ctrxn_created_at: refund_date,
          ctrxn_note: `Money return : ${client_total_tax_refund}/-`,
          ctrxn_particular_type: 'AIR TICKET TAX REFUND',
          ctrxn_pay_type: clAccPayType,
          ctrxn_voucher: refund_voucher,
        };

        refund_c_trxn_id = await trxns.clTrxnInsert(clTrxnBody);
      }

      // ACCOUNT TRANSACTION FOR VENDOR
      if (vendor_refund_type === 'Return') {
        const ACTrxnBody: IAcTrxn = {
          acctrxn_ac_id: vendor_account_id,
          acctrxn_type: 'CREDIT',
          acctrxn_amount: vendor_total_tax_refund,
          acctrxn_created_at: refund_date,
          acctrxn_created_by: req.user_id,
          acctrxn_note: 'Vendor Refund',
          acctrxn_particular_id: 108,
          acctrxn_particular_type: 'AIR TICKET TAX REFUND',
          acctrxn_pay_type: VAccPayType,
          acctrxn_voucher: refund_voucher,
        };

        vendor_account_trxn_id = await trxns.AccTrxnInsert(ACTrxnBody);
      }

      const refundData: IAirTicketTaxRefund = {
        refund_date,
        refund_profit: profit,
        refund_invoice_id,
        refund_voucher,
        refund_agency_id: req.agency_id,
        refund_client_id: client_id,
        refund_combined_id: combined_id,
        refund_c_trxn_id,
        client_refund_type,
        vendor_refund_type,
        client_pay_type,
        vendor_pay_type,
        client_account_id,
        vendor_account_id,
        client_account_trxn_id,
        vendor_account_trxn_id,
        client_total_tax_refund,
        vendor_total_tax_refund,
      };

      const refund_id = await conn.insertAirTicketTaxRefund(refundData);

      // VENDOR TRANSACTION

      for (const item of ticket_info) {
        const { vendor_id, combined_id } = separateCombClientToId(
          item.comb_vendor
        );

        const VTrxnBody: IVTrxn = {
          comb_vendor: item.comb_vendor,
          vtrxn_created_at: refund_date,
          vtrxn_particular_id: 108,
          vtrxn_particular_type: 'AIR TICKET TAX REFUND',
          vtrxn_type: 'CREDIT',
          vtrxn_user_id: req.user_id,
          vtrxn_voucher: refund_voucher,
          vtrxn_airticket_no: item.airticket_ticket_no,
          vtrxn_amount:
            vendor_refund_type === 'Adjust' ? item.refund_tax_amount : 0,
          vtrxn_note:
            vendor_refund_type === 'Adjust'
              ? ''
              : `Money return : ${item.refund_tax_amount}/-`,
        };

        const refund_v_trxn_id = await trxns.VTrxnInsert(VTrxnBody);

        const refundItemData: IAirTicketTaxRefundItem = {
          refund_airticket_id: item.airticket_id,
          refund_combined_id: combined_id,
          refund_id,
          refund_tax_amount: item.refund_tax_amount,
          refund_vendor_id: vendor_id,
          refund_v_trxn_id,
          refund_inv_category_id: invoice_category_id,
        };

        await conn.insertAirTicketTaxRefundItem(refundItemData);

        // update air ticket refund
        await conn.updateAirTicketItemRefund(
          item.airticket_id,
          +invoice_category_id
        );
      }

      // UPDATE INVOICE REFUND
      await conn.updateInvoiceRefund(refund_invoice_id);

      return { success: true, msg: 'Invoice air ticket tax refunded!' };
    });
  };
}

export default AirTicketTaxRefund;
