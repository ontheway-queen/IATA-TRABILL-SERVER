import { Request } from 'express';
import AbstractServices from '../../../../abstracts/abstract.services';
import { InvoiceHistory } from '../../../../common/types/common.types';

import {
  IInvoiceClPay,
  IMoneyReceiptCheques,
  IMoneyReceiptDb,
  IMoneyReceiptReq,
} from '../../Type/MoneyReceipt.Interfaces';

import Trxns from '../../../../common/helpers/Trxns';
import { separateCombClientToId } from '../../../../common/helpers/common.helper';
import {
  IAcTrxn,
  IClTrxnBody,
} from '../../../../common/interfaces/Trxn.interfaces';
import { IOnlineTrxnCharge } from '../../../accounts/types/account.interfaces';
import { smsInvoiceData } from '../../../smsSystem/types/sms.types';
import CommonSmsSendServices from '../../../smsSystem/utils/CommonSmsSend.services';
import { getPaymentType } from '../../../../common/utils/libraries/lib';
class AddMoneyReceipt extends AbstractServices {
  constructor() {
    super();
  }

  public addMoneyReceipt = async (req: Request) => {
    const {
      receipt_combclient,
      receipt_payment_to,
      receipt_total_amount,
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
      receipt_total_discount,
      trans_no,
      receipt_walking_customer_name,
    } = req.body as IMoneyReceiptReq;

    const { client_id, combined_id } =
      separateCombClientToId(receipt_combclient);

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.MoneyReceiptModels(req, trx);
      const common_conn = this.models.CommonInvoiceModel(req, trx);
      const trxns = new Trxns(req, trx);

      const receipt_vouchar_no = await this.generateVoucher(req, 'MR');

      const receipt_payment_status =
        receipt_payment_type === 4 ? 'PENDING' : 'SUCCESS';

      // @RECEIPT_ID
      let receipt_actransaction_id;
      let client_trxn_id: null | number = null;
      let online_charge_purpuse: string = 'Money receipt';

      const amount_after_discount =
        Number(receipt_total_amount) - Number(receipt_total_discount) || 0;

      const note = receipt_total_discount
        ? `Paid ${receipt_total_amount} discount ${receipt_total_discount}, ${
            receipt_note || ''
          }`
        : receipt_note || '';

      const accPayType = getPaymentType(+receipt_payment_type);

      if (receipt_payment_type !== 4) {
        const AccTrxnBody: IAcTrxn = {
          acctrxn_ac_id: account_id,
          acctrxn_type: 'CREDIT',
          acctrxn_voucher: receipt_vouchar_no,
          acctrxn_amount: amount_after_discount,
          acctrxn_created_at: receipt_payment_date,
          acctrxn_created_by: receipt_created_by,
          acctrxn_note: note,
          acctrxn_particular_id: 2,
          acctrxn_particular_type: 'Money receipt',
          acctrxn_pay_type: accPayType,
        };

        receipt_actransaction_id = await trxns.AccTrxnInsert(AccTrxnBody);

        const clTrxnBody: IClTrxnBody = {
          ctrxn_type: 'CREDIT',
          ctrxn_amount: receipt_total_amount,
          ctrxn_cl: receipt_combclient,
          ctrxn_voucher: receipt_vouchar_no,
          ctrxn_particular_id: 114,
          ctrxn_created_at: receipt_payment_date,
          ctrxn_note: note,
          ctrxn_particular_type: 'Money Receipt',
          ctrxn_pay_type: accPayType,
        };

        client_trxn_id = await trxns.clTrxnInsert(clTrxnBody);
      }

      let receipt_trxn_charge_id: number | null = null;
      if (receipt_payment_type === 3 && charge_amount) {
        const online_charge_trxn: IOnlineTrxnCharge = {
          charge_to_acc_id: account_id,
          charge_from_client_id: client_id as number,
          charge_from_ccombined_id: combined_id as number,
          charge_amount: charge_amount,
          charge_purpose: online_charge_purpuse,
          charge_note: receipt_note,
        };

        receipt_trxn_charge_id = await this.models
          .vendorModel(req, trx)
          .insertOnlineTrxnCharge(online_charge_trxn);
      }

      const receiptInfo: IMoneyReceiptDb = {
        receipt_trnxtype_id: 2,
        receipt_vouchar_no,
        receipt_client_id: client_id,
        receipt_combined_id: combined_id,
        receipt_actransaction_id,
        receipt_payment_to,
        receipt_total_amount: Number(receipt_total_amount),
        receipt_total_discount,
        receipt_money_receipt_no,
        receipt_payment_type,
        receipt_payment_date,
        receipt_ctrxn_id: client_trxn_id,
        receipt_note,
        receipt_account_id: account_id,
        receipt_created_by,
        receipt_payment_status,
        receipt_trxn_charge: charge_amount,
        receipt_trxn_charge_id,
        receipt_trxn_no: trans_no,
        receipt_walking_customer_name,
      };

      const receipt_id = await conn.insertMoneyReceipt(receiptInfo);

      // money receipt to invoice
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

          const history_data: InvoiceHistory = {
            history_activity_type: 'INVOICE_PAYMENT_CREATED',
            history_invoice_id: invoice.invoice_id,
            history_created_by: receipt_created_by,
            history_invoice_payment_amount: invoice.invoice_amount,
            invoicelog_content: `Payment added to Invoice (Amount = ${invoice.invoice_amount})/-`,
          };

          await common_conn.insertInvoiceHistory(history_data);

          online_charge_purpuse = 'Money receipt to specific invoice';
        }
      }

      // money receipt to ticket
      else if (receipt_payment_to === 'TICKET') {
        for (const ticket of tickets) {
          const { invoice_amount, invoice_id, ticket_no } = ticket;

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

          const history_data: InvoiceHistory = {
            history_activity_type: 'INVOICE_PAYMENT_CREATED',
            history_invoice_id: invoice_id,
            history_created_by: receipt_created_by,
            history_invoice_payment_amount: invoice_amount,
            invoicelog_content: 'Money receipt hass been deleted',
          };

          await common_conn.insertInvoiceHistory(history_data);

          online_charge_purpuse = 'Money receipt to specific ticket';
        }
      }

      // money receipt to overall
      else if (receipt_payment_to === 'OVERALL') {
        const cl_due = await conn.getInvoicesIdAndAmount(
          client_id,
          combined_id
        );

        let paidAmountNow: number = 0;
        for (const item of cl_due) {
          const { invoice_id, total_due } = item;

          const availableAmount = Number(receipt_total_amount) - paidAmountNow;

          const payment_amount =
            availableAmount >= total_due ? total_due : availableAmount;

          const invoiceClientPaymentInfo: IInvoiceClPay = {
            invclientpayment_moneyreceipt_id: receipt_id,
            invclientpayment_invoice_id: invoice_id,
            invclientpayment_client_id: client_id,
            invclientpayment_cltrxn_id: client_trxn_id as number,
            invclientpayment_amount: payment_amount,
            invclientpayment_date: receipt_payment_date,
            invclientpayment_collected_by: receipt_created_by,
            invclientpayment_combined_id: combined_id,
          };

          await conn.insertInvoiceClPay(invoiceClientPaymentInfo);

          const history_data: InvoiceHistory = {
            history_activity_type: 'INVOICE_PAYMENT_CREATED',
            history_invoice_id: invoice_id,
            history_created_by: receipt_created_by,
            history_invoice_payment_amount: payment_amount,
            invoicelog_content: `CLIENT PAYMENT FOR OVERALL BDT ${payment_amount}/-`,
          };

          await common_conn.insertInvoiceHistory(history_data);

          paidAmountNow += payment_amount;
          if (total_due >= availableAmount) {
            break;
          } else {
            continue;
          }
        }

        online_charge_purpuse = 'Money receipt to overall';
      }

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

      const smsInvoiceDate: smsInvoiceData = {
        invoice_client_id: client_id as number,
        invoice_combined_id: combined_id as number,
        invoice_sales_date: receipt_payment_date,
        invoice_created_by: receipt_created_by,
        receipt_id,
      };

      await new CommonSmsSendServices().sendSms(req, smsInvoiceDate, trx);

      await this.insertAudit(
        req,
        'create',
        `ADDED MONEY RECEIPT ,VOUCHER ${receipt_vouchar_no}, BDT ${receipt_total_amount}/- `,
        receipt_created_by,
        'MONEY_RECEIPT'
      );

      await this.updateVoucher(req, 'MR');
      return {
        success: true,
        data: {
          message: 'Money Receipt Added Successfully...',
          receipt_id,
        },
      };
    });
  };
}

export default AddMoneyReceipt;
