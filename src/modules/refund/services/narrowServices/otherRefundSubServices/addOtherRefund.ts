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
import { IAdvanceMrInsert } from '../../../../../common/model/interfaces';
import { InvoiceHistory } from '../../../../../common/types/common.types';
import {
  getPaymentType,
  numRound,
} from '../../../../../common/utils/libraries/lib';
import { IOnlineTrxnCharge } from '../../../../accounts/types/account.interfaces';
import {
  IOtherRefundReqBody,
  IRefundOther,
  IRefundOtherClient,
  IRefundOtherVendor,
} from '../../../types/refund.interfaces';

class AddOtherRefund extends AbstractServices {
  constructor() {
    super();
  }

  public add = async (req: Request) => {
    const {
      comb_client,
      vendor_refund_info,
      client_refund_info,
      date,
      note,
      created_by,
      invoice_id,
    } = req.body as IOtherRefundReqBody;

    const {
      crefund_payment_type,
      payment_type_id,
      trxn_charge_amount,
      account_id,
      total_refund_amount,
      total_refund_charge,
    } = client_refund_info;

    const other_vouchar_number = generateVoucherNumber(4, 'ORF');

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.refundModel(req, trx);
      const vendor_conn = this.models.vendorModel(req, trx);
      const mr_conn = this.models.MoneyReceiptModels(req, trx);
      const common_conn = this.models.CommonInvoiceModel(req, trx);
      const trxns = new Trxns(req, trx);

      const { invoice_payment } = await conn.getInvoiceDuePayment(invoice_id);

      const { client_id, combined_id } = separateCombClientToId(comb_client);

      const { pax_name, airticket_route, ticket_no, ticket_pnr } =
        await conn.getOthrRefundInfo(invoice_id);

      let refund_charge_id = null;
      if (payment_type_id === 3 && trxn_charge_amount) {
        const online_charge_trxn: IOnlineTrxnCharge = {
          charge_from_acc_id: account_id,
          charge_to_client_id: client_id as number,
          charge_to_combined_id: combined_id as number,
          charge_amount: trxn_charge_amount,
          charge_purpose: `Invoice Other Refund Client`,
        };
        refund_charge_id = await vendor_conn.insertOnlineTrxnCharge(
          online_charge_trxn
        );
      }

      const refundInfo: IRefundOther = {
        refund_client_id: client_id as number,
        refund_combined_id: combined_id as number,
        refund_invoice_id: invoice_id,
        refund_vouchar_number: other_vouchar_number,
        refund_created_by: created_by,
        refund_status: 1,
        refund_date: date,
        refund_charge_amount: trxn_charge_amount,
        refund_charge_id,
        refund_note: note,
      };
      const refund_id = await conn.refundOther(refundInfo);

      let crefund_ctrxnid = null;
      let crefund_charge_ctrxnid = null;
      let crefund_actransaction_id = null;
      const cl_return_amount =
        numRound(total_refund_amount) - numRound(total_refund_charge);

      if (crefund_payment_type === 'ADJUST') {
        const ctrxn_note = `REFUND TOTAL ${total_refund_amount}/- \nREFUND CHARGE ${total_refund_charge}\nRETURN AMOUNT ${cl_return_amount}/-`;

        const clTrxnBody: IClTrxnBody = {
          ctrxn_type: 'CREDIT',
          ctrxn_amount: total_refund_amount,
          ctrxn_cl: comb_client,
          ctrxn_voucher: other_vouchar_number,
          ctrxn_particular_id: 25,
          ctrxn_created_at: date,
          ctrxn_note,
          ctrxn_airticket_no: ticket_no,
          ctrxn_pax: pax_name,
          ctrxn_pnr: ticket_pnr,
          ctrxn_route: airticket_route,
        };
        const clChargeTrxnBody: IClTrxnBody = {
          ctrxn_type: 'DEBIT',
          ctrxn_amount: total_refund_charge,
          ctrxn_cl: comb_client,
          ctrxn_voucher: other_vouchar_number,
          ctrxn_particular_id: 47,
          ctrxn_created_at: date,
          ctrxn_note: 'CHARGE',
          ctrxn_airticket_no: ticket_no,
          ctrxn_pax: pax_name,
          ctrxn_pnr: ticket_pnr,
          ctrxn_route: airticket_route,
        };

        crefund_ctrxnid = await trxns.clTrxnInsert(clTrxnBody);

        if (total_refund_charge > 0) {
          crefund_charge_ctrxnid = await trxns.clTrxnInsert(clChargeTrxnBody);
        }

        // INVOICE PAYMENT
        const cl_due = await mr_conn.getInvoicesIdAndAmount(
          client_id,
          combined_id
        );

        let paidAmountNow: number = 0;
        for (const item of cl_due) {
          const { invoice_id, total_due } = item;

          const availableAmount = cl_return_amount - paidAmountNow;

          const payment_amount =
            availableAmount >= total_due ? total_due : availableAmount;

          const invClPay: IAdvanceMrInsert = {
            invclientpayment_moneyreceipt_id: null,
            invclientpayment_amount: payment_amount,
            invclientpayment_invoice_id: invoice_id,
            invclientpayment_client_id: client_id,
            invclientpayment_combined_id: combined_id,
            invclientpayment_purpose: other_vouchar_number,
            invclientpayment_rf_type: 'OTHER',
            invclientpayment_rf_id: refund_id,
          };

          await common_conn.insertAdvanceMr(invClPay);

          paidAmountNow += payment_amount;
          if (total_due >= availableAmount) {
            break;
          } else {
            continue;
          }
        }
      }

      // MONEY RETURN
      else {
        if (payment_type_id !== 4) {
          let return_amount: number = 0;
          let client_adjust_amount: number = 0;

          if (invoice_payment >= total_refund_amount) {
            return_amount = cl_return_amount;
          } else if (invoice_payment < total_refund_amount) {
            return_amount = invoice_payment - total_refund_charge;
            client_adjust_amount = total_refund_amount - invoice_payment;
          }

          let accPayType = getPaymentType(payment_type_id);

          if (return_amount > 0) {
            const ACTrxnBody: IAcTrxn = {
              acctrxn_ac_id: account_id as number,
              acctrxn_type: 'DEBIT',
              acctrxn_amount: return_amount,
              acctrxn_voucher: other_vouchar_number,
              acctrxn_created_at: date,
              acctrxn_created_by: created_by,
              acctrxn_note: note,
              acctrxn_particular_id: 26,
              acctrxn_pay_type: accPayType,
            };

            crefund_actransaction_id = await trxns.AccTrxnInsert(ACTrxnBody);
          }

          let ctrxn_note = `REFUND TOTAL ${total_refund_amount}/- \nREFUND CHARGE ${total_refund_charge}\nRETURN AMOUNT ${return_amount}/-`;

          if (client_adjust_amount) {
            ctrxn_note += `\nAdjust amount : ${client_adjust_amount}/-`;
          }

          const clTrxnBody: IClTrxnBody = {
            ctrxn_type: 'CREDIT',
            ctrxn_amount: client_adjust_amount,
            ctrxn_cl: comb_client,
            ctrxn_voucher: other_vouchar_number,
            ctrxn_particular_id: 26,
            ctrxn_created_at: date,
            ctrxn_note,
            ctrxn_airticket_no: ticket_no,
            ctrxn_pax: pax_name,
            ctrxn_pnr: ticket_pnr,
            ctrxn_route: airticket_route,
            ctrxn_pay_type: accPayType,
          };

          crefund_ctrxnid = await trxns.clTrxnInsert(clTrxnBody);
        } else {
          // for cheque...
        }
      }
      // insert refund to client
      const refundOtherClient: IRefundOtherClient = {
        crefund_refund_id: refund_id,
        crefund_invoice_id: invoice_id,
        crefund_client_id: client_id as number,
        crefund_combined_id: combined_id as number,
        crefund_account_id: account_id as number,
        crefund_actransaction_id: crefund_actransaction_id as number,
        crefund_ctrxnid: crefund_ctrxnid as number,
        crefund_charge_ctrxnid: crefund_charge_ctrxnid,
        crefund_charge_amount: total_refund_charge,
        crefund_total_amount: total_refund_amount,
        crefund_return_amount: cl_return_amount,
        crefund_vouchar_number: other_vouchar_number,
        crefund_payment_type,
        crefund_moneyreturn_type: payment_type_id,
        crefund_moneyreturn_account_id: account_id,
        crefund_date: date,
      };
      await conn.refundOtherClient(refundOtherClient);

      const otherClientRefund: IRefundOtherVendor[] = [];
      for (const item of vendor_refund_info) {
        const {
          vrefund_bill_id,
          comb_vendor_id,
          vrefund_product_id,
          vrefund_quantity,
          billing_remaining_quantity,
          vrefund_charge,
          payment_method,
          vrefund_account_id,
          vrefund_amount,
          vrefund_return_amount,
          vrefund_payment_type,
          vrefund_invoice_category_id,
          vrefund_date,
        } = item;

        if (!vrefund_quantity) {
          continue;
        }

        await conn.updateAirticketItemIsRefund(vrefund_bill_id, 4, 1);

        const { vendor_id, combined_id: combinedId } =
          separateCombClientToId(comb_vendor_id);

        let vrefund_vtrxn_id = null;
        let vrefund_acctrxn_id = null;

        if (vrefund_payment_type === 'ADJUST') {
          let vendorRefundTrxnNote = `TOTAL FARE ${vrefund_amount}/- 
          REFUND CHARGE ${vrefund_charge}/-
          ADJUST AMOUNT ${vrefund_return_amount}/-`;

          const VTrxnBody: IVTrxn = {
            comb_vendor: comb_vendor_id,
            vtrxn_amount: vrefund_return_amount,
            vtrxn_created_at: date,
            vtrxn_note: vendorRefundTrxnNote,
            vtrxn_particular_id: 25,
            vtrxn_type: 'CREDIT',
            vtrxn_user_id: created_by,
            vtrxn_voucher: other_vouchar_number,
            vtrxn_airticket_no: ticket_no,
            vtrxn_pax: pax_name,
            vtrxn_pnr: ticket_pnr,
            vtrxn_route: airticket_route,
          };

          vrefund_vtrxn_id = await trxns.VTrxnInsert(VTrxnBody);
        } else {
          if (payment_method !== 4) {
            let accPayType = getPaymentType(payment_method);

            const ACTrxnBody: IAcTrxn = {
              acctrxn_ac_id: vrefund_account_id as number,
              acctrxn_type: 'CREDIT',
              acctrxn_amount: vrefund_return_amount,
              acctrxn_created_at: date,
              acctrxn_voucher: other_vouchar_number,
              acctrxn_created_by: created_by,
              acctrxn_note: note,
              acctrxn_particular_id: 26,
              acctrxn_pay_type: accPayType,
            };

            vrefund_acctrxn_id = await trxns.AccTrxnInsert(ACTrxnBody);

            let vendorRefundTrxnNote = `Net total : ${vrefund_amount}/- 
            Return amount : ${vrefund_return_amount}/-
            Refund charge : ${vrefund_charge}/-`;

            const VTrxnBody: IVTrxn = {
              comb_vendor: comb_vendor_id,
              vtrxn_amount: vrefund_return_amount,
              vtrxn_created_at: date,
              vtrxn_note: vendorRefundTrxnNote,
              vtrxn_particular_id: 26,
              vtrxn_type: 'CREDIT',
              vtrxn_user_id: created_by,
              vtrxn_voucher: other_vouchar_number,
              vtrxn_airticket_no: ticket_no,
              vtrxn_pax: pax_name,
              vtrxn_pnr: ticket_pnr,
              vtrxn_route: airticket_route,
            };

            vrefund_vtrxn_id = await trxns.VTrxnInsert(VTrxnBody);
          } else {
            // for cheque...
          }
        }

        const remaining_quantity =
          billing_remaining_quantity - vrefund_quantity;

        await conn.updateRemainingQty(
          invoice_id,
          vrefund_invoice_category_id,
          remaining_quantity
        );

        const refundOtherVendor: IRefundOtherVendor = {
          vrefund_refund_id: refund_id,
          ...(vendor_id && { vrefund_vendor_id: vendor_id }),
          ...(combined_id && {
            vrefund_vendor_combined_id: combinedId as number,
          }),
          vrefund_vtrxn_id: vrefund_vtrxn_id as number,
          // vrefund_charge_vtrxn_id: vrefund_charge_vtrxn_id as number,
          vrefund_payment_type,
          vrefund_account_id: vrefund_account_id,
          vrefund_acctrxn_id: vrefund_acctrxn_id as number,
          vrefund_moneyreturn_type: payment_method as number,
          vrefund_moneyreturn_account_id: account_id,
          vrefund_invoice_id: invoice_id,
          vrefund_product_id: vrefund_product_id,
          vrefund_quantity: vrefund_quantity,
          vrefund_charge: vrefund_charge,
          vrefund_amount: vrefund_amount,
          vrefund_return_amount,
          vrefund_client_refund_amount: total_refund_amount,
          vrefund_client_refund_charge: total_refund_charge,
          vrefund_vouchar_number: other_vouchar_number,
          vrefund_bill_id,
          vrefund_invoice_category_id,
          vrefund_date,
        };
        otherClientRefund.push(refundOtherVendor);
      }

      if (otherClientRefund.length) {
        await conn.refundOtherVendor(otherClientRefund);
      }

      const history_data: InvoiceHistory = {
        history_activity_type: 'INVOICE_REFUNDED',
        history_invoice_id: invoice_id,
        history_created_by: req.user_id,
        invoicelog_content: `REFUND INVOICE VOUCHER ${other_vouchar_number} RETURN BDT ${cl_return_amount}/-`,
      };

      await common_conn.insertInvoiceHistory(history_data);

      await conn.updateInvoiceIsRefund(invoice_id, 1);

      await this.insertAudit(
        req,
        'delete',
        `REFUNDED INVOICE OTHER, VOUCHER ${other_vouchar_number}, BDT ${total_refund_amount}/-, RETURN BDT ${cl_return_amount}/-`,
        created_by,
        'REFUND'
      );

      return {
        success: true,
        message: 'Other refund has been created successfully',
        refund_id,
      };
    });
  };
}

export default AddOtherRefund;
