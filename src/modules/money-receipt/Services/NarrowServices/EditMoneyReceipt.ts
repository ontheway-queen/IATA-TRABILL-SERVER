import { Request } from 'express';
import AbstractServices from '../../../../abstracts/abstract.services';
import { separateCombClientToId } from '../../../../common/helpers/common.helper';
import { InvoiceHistory } from '../../../../common/types/common.types';
import {
  IInvoiceClPay,
  IMoneyReceiptCheques,
  IMoneyReceiptReq,
  IUpdateMoneyReceipt,
} from '../../Type/MoneyReceipt.Interfaces';
import Trxns from '../../../../common/helpers/Trxns';
import {
  IAcTrxnUpdate,
  IClTrxnUpdate,
} from '../../../../common/interfaces/Trxn.interfaces';
import { IOnlineTrxnCharge } from '../../../accounts/types/account.interfaces';
import { getPaymentType } from '../../../../common/utils/libraries/lib';

class EditMoneyReceipt extends AbstractServices {
  constructor() {
    super();
  }

  public editMoneyReceipt = async (req: Request) => {
    const receipt_id = req.params.id;
    const {
      receipt_combclient,
      receipt_payment_to,
      receipt_total_amount,
      receipt_total_discount,
      receipt_money_receipt_no,
      receipt_payment_type,
      receipt_payment_date,
      receipt_note,
      cheque_number,
      cheque_withdraw_date,
      cheque_bank_name,
      account_id,
      receipt_created_by,
      invoices,
      tickets,
      charge_amount,
      trans_no,
      receipt_walking_customer_name,
      received_by,
    } = req.body as IMoneyReceiptReq;

    const { client_id, combined_id } =
      separateCombClientToId(receipt_combclient);

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.MoneyReceiptModels(req, trx);
      const common_conn = this.models.CommonInvoiceModel(req, trx);
      const vendor_conn = this.models.vendorModel(req, trx);
      const trxns = new Trxns(req, trx);

      const previousBillingData = await conn.getPreviousPaidAmount(receipt_id);

      const receipt_payment_status =
        receipt_payment_type === 4 ? 'PENDING' : 'SUCCESS';

      let acc_trxn_id;
      let acc_transaction_amount = Number(receipt_total_amount);
      let client_trxn_id;

      const amount_after_discount =
        Number(receipt_total_amount) - Number(receipt_total_discount) || 0;

      const note = receipt_total_discount
        ? `Paid ${receipt_total_amount} discount ${receipt_total_discount}, ${
            receipt_note || ''
          }`
        : receipt_note || '';

      if (receipt_payment_type !== 4) {
        let accPayType = getPaymentType(receipt_payment_type);

        const AccTrxnBody: IAcTrxnUpdate = {
          acctrxn_ac_id: account_id,
          acctrxn_type: 'CREDIT',
          acctrxn_amount: amount_after_discount,
          acctrxn_created_at: receipt_payment_date,
          acctrxn_created_by: receipt_created_by,
          acctrxn_note: note,
          acctrxn_particular_id: 2,
          acctrxn_particular_type: 'Money receipt',
          acctrxn_pay_type: accPayType,
          trxn_id: previousBillingData?.prevAccTrxnId as number,
        };

        acc_trxn_id = await trxns.AccTrxnUpdate(AccTrxnBody);

        const clTrxnBody: IClTrxnUpdate = {
          ctrxn_type: 'CREDIT',
          ctrxn_amount: receipt_total_amount,
          ctrxn_cl: receipt_combclient,
          ctrxn_voucher: previousBillingData?.receipt_vouchar_no as string,
          ctrxn_particular_id: 14,
          ctrxn_created_at: receipt_payment_date,
          ctrxn_note: note,
          ctrxn_particular_type: 'Money Receipt Update',
          ctrxn_trxn_id: previousBillingData?.prevClTrxn as number,
          ctrxn_pay_type: accPayType,
        };

        client_trxn_id = await trxns.clTrxnUpdate(clTrxnBody);
      }

      let receipt_trxn_charge_id: number | null = null;
      if (receipt_payment_type === 3 && charge_amount) {
        if (previousBillingData?.receipt_trxn_charge_id) {
          const online_charge_trxn: IOnlineTrxnCharge = {
            charge_to_acc_id: account_id,
            charge_from_client_id: client_id as number,
            charge_from_ccombined_id: combined_id as number,
            charge_amount: charge_amount,
            charge_purpose: 'Invoice money receipt update',
            charge_note: receipt_note,
          };

          await vendor_conn.updateOnlineTrxnCharge(
            online_charge_trxn,
            previousBillingData.receipt_trxn_charge_id
          );
        } else {
          const online_charge_trxn: IOnlineTrxnCharge = {
            charge_to_acc_id: account_id,
            charge_from_client_id: client_id as number,
            charge_from_ccombined_id: combined_id as number,
            charge_amount: charge_amount,
            charge_purpose: 'Invoice money receipt',
            charge_note: receipt_note,
          };

          receipt_trxn_charge_id = await vendor_conn.insertOnlineTrxnCharge(
            online_charge_trxn
          );
        }
      } else if (
        previousBillingData?.receipt_payment_type === 3 &&
        receipt_payment_type !== 3 &&
        previousBillingData.receipt_trxn_charge_id
      ) {
        await vendor_conn.deleteOnlineTrxnCharge(
          previousBillingData.receipt_trxn_charge_id
        );
      }

      // @RECEIPT_INFO
      const receiptInfo: IUpdateMoneyReceipt = {
        receipt_client_id: client_id,
        receipt_combined_id: combined_id,
        receipt_actransaction_id: acc_trxn_id,
        receipt_payment_to,
        receipt_total_amount: acc_transaction_amount,
        receipt_total_discount,
        receipt_money_receipt_no,
        receipt_payment_type,
        receipt_payment_date,
        receipt_ctrxn_id: client_trxn_id,
        receipt_note,
        receipt_updated_by: receipt_created_by,
        receipt_payment_status,
        receipt_trxn_charge: charge_amount,
        receipt_trxn_no: trans_no,
        receipt_trxn_charge_id,
        receipt_walking_customer_name,
        receipt_account_id: account_id,
        receipt_received_by: received_by,
      };
      await conn.updateMoneyReceipt(receiptInfo, receipt_id);

      // DELETE PREVIOUS INVOCIE CLIENT PAYMENT
      await conn.deletePrevInvoiceClPay(receipt_id, receipt_created_by);

      await conn.deletePrevMoneyReceiptChequeInfo(
        receipt_id,
        receipt_created_by
      );

      // @PAYMENT_TO_INVOICE
      if (receipt_payment_to === 'INVOICE') {
        for (const invoice of invoices) {
          const invoiceClientPaymentInfo: IInvoiceClPay = {
            invclientpayment_moneyreceipt_id: receipt_id,
            invclientpayment_invoice_id: invoice.invoice_id,
            invclientpayment_client_id: client_id,
            invclientpayment_combined_id: combined_id,
            invclientpayment_cltrxn_id: client_trxn_id as number,
            invclientpayment_amount: invoice.invoice_amount,
            invclientpayment_date: receipt_payment_date,
            invclientpayment_collected_by: receipt_created_by,
          };
          await conn.insertInvoiceClPay(invoiceClientPaymentInfo);

          // @HISTORY
          const history_data: InvoiceHistory = {
            history_activity_type: 'INVOICE_PAYMENT_CREATED',
            history_invoice_id: invoice.invoice_id,
            history_created_by: receipt_created_by,
            history_invoice_payment_amount: invoice.invoice_amount,
            invoicelog_content: `Payment added to Invoice (Amount = ${invoice.invoice_amount})/-`,
          };

          await common_conn.insertInvoiceHistory(history_data);
        }
      }

      // @PAYMENT_TO_TICKET
      if (receipt_payment_to === 'TICKET') {
        for (const ticket of tickets) {
          const { invoice_amount, invoice_id, ticket_no } = ticket;

          // @INVOICE_CLIENT_PAY
          const invoiceClientPaymentInfo: IInvoiceClPay = {
            invclientpayment_moneyreceipt_id: receipt_id,
            invclientpayment_invoice_id: invoice_id,
            invclientpayment_client_id: client_id,
            invclientpayment_combined_id: combined_id,
            invclientpayment_cltrxn_id: client_trxn_id as number,
            invclientpayment_amount: invoice_amount,
            invclientpayment_date: receipt_payment_date,
            invclientpayment_collected_by: receipt_created_by,
            invclientpayment_ticket_number: ticket_no,
          };
          await conn.insertInvoiceClPay(invoiceClientPaymentInfo);

          // @HISTORY
          const history_data: InvoiceHistory = {
            history_activity_type: 'INVOICE_PAYMENT_CREATED',
            history_invoice_id: invoice_id,
            history_created_by: receipt_created_by,
            history_invoice_payment_amount: invoice_amount,
            invoicelog_content: 'Money receipt hass been deleted',
          };

          await common_conn.insertInvoiceHistory(history_data);
        }
      }

      // @OVERALL_PAYMENT
      if (receipt_payment_to === 'OVERALL') {
        const cl_duew = await conn.getInvoicesIdAndAmount(
          client_id,
          combined_id
        );

        let paidAmountNow: number = 0;
        for (const item of cl_duew) {
          const { invoice_id, total_due } = item;

          const availabeAmount = Number(receipt_total_amount) - paidAmountNow;

          const peyment_amount =
            availabeAmount >= total_due ? total_due : availabeAmount;

          // @INVOICE_CLIENT_PAY
          const invoiceClientPaymentInfo: IInvoiceClPay = {
            invclientpayment_moneyreceipt_id: receipt_id,
            invclientpayment_invoice_id: invoice_id,
            invclientpayment_client_id: client_id,
            invclientpayment_cltrxn_id: client_trxn_id as number,
            invclientpayment_amount: peyment_amount,
            invclientpayment_date: receipt_payment_date,
            invclientpayment_collected_by: receipt_created_by,
            invclientpayment_combined_id: combined_id,
          };

          await conn.insertInvoiceClPay(invoiceClientPaymentInfo);

          // @HISTORY
          const history_data: InvoiceHistory = {
            history_activity_type: 'INVOICE_PAYMENT_CREATED',
            history_invoice_id: invoice_id,
            history_created_by: receipt_created_by,
            history_invoice_payment_amount: peyment_amount,
            invoicelog_content: 'Money receipt hass been deleted',
          };

          await common_conn.insertInvoiceHistory(history_data);

          paidAmountNow += peyment_amount;
          if (total_due >= availabeAmount) {
            break;
          } else {
            continue;
          }
        }
      }

      // @MONEY_RECEIPTS_CHEQUE_DETAILS
      if (receipt_payment_type === 4) {
        const moneyReceiptChequeData: IMoneyReceiptCheques = {
          cheque_receipt_id: receipt_id,
          cheque_number,
          cheque_withdraw_date,
          cheque_bank_name,
          cheque_status: receipt_payment_status,
        };
        await conn.insertMoneyReceiptChequeInfo(moneyReceiptChequeData);
      }

      await this.insertAudit(
        req,
        'create',
        `Money receipt has been updated, Voucher - ${receipt_payment_to}, Net - ${receipt_total_amount}/-`,
        receipt_created_by,
        'MONEY_RECEIPT'
      );

      return {
        success: true,
        data: 'Money receipt updated successfully...',
      };
    });
  };
}

export default EditMoneyReceipt;
