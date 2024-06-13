import { Request } from 'express';
import AbstractServices from '../../../../abstracts/abstract.services';

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
import { getPaymentType } from '../../../../common/utils/libraries/lib';
import { IOnlineTrxnCharge } from '../../../accounts/types/account.interfaces';
import { smsInvoiceData } from '../../../smsSystem/types/sms.types';
import CommonSmsSendServices from '../../../smsSystem/utils/CommonSmsSend.services';
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
      received_by,
    } = req.body as IMoneyReceiptReq;

    const { client_id, combined_id } =
      separateCombClientToId(receipt_combclient);

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.MoneyReceiptModels(req, trx);
      const common_conn = this.models.CommonInvoiceModel(req, trx);
      const trxns = new Trxns(req, trx);

      const cheque_status = receipt_payment_type === 4 ? 'PENDING' : 'SUCCESS';
      const voucher_no = await this.generateVoucher(req, 'MR');

      // @RECEIPT_ID
      let receipt_actransaction_id;
      let client_trxn_id: null | number = null;
      let online_charge_purpuse: string = 'Money receipt';

      const amount_after_discount =
        Number(receipt_total_amount) - Number(receipt_total_discount) || 0;

      const accPayType = getPaymentType(+receipt_payment_type);

      if (receipt_payment_type !== 4) {
        const AccTrxnBody: IAcTrxn = {
          acctrxn_ac_id: account_id,
          acctrxn_type: 'CREDIT',
          acctrxn_voucher: voucher_no,
          acctrxn_amount: amount_after_discount,
          acctrxn_created_at: receipt_payment_date,
          acctrxn_created_by: receipt_created_by,
          acctrxn_note: receipt_note,
          acctrxn_particular_id: 2,
          acctrxn_particular_type: 'Money receipt',
          acctrxn_pay_type: accPayType,
        };

        receipt_actransaction_id = await trxns.AccTrxnInsert(AccTrxnBody);

        const clTrxnBody: IClTrxnBody = {
          ctrxn_type: 'CREDIT',
          ctrxn_amount: receipt_total_amount,
          ctrxn_cl: receipt_combclient,
          ctrxn_voucher: voucher_no,
          ctrxn_particular_id: 114,
          ctrxn_created_at: receipt_payment_date,
          ctrxn_note: receipt_note,
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
        receipt_vouchar_no: voucher_no,
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
        receipt_payment_status: cheque_status,
        receipt_trxn_charge: charge_amount,
        receipt_trxn_charge_id,
        receipt_trxn_no: trans_no,
        receipt_walking_customer_name,
        receipt_received_by: received_by,
      };

      const receipt_id = await conn.insertMoneyReceipt(receiptInfo);

      if (receipt_payment_type === 4) {
        const moneyReceiptChequeData: IMoneyReceiptCheques = {
          cheque_receipt_id: receipt_id,
          cheque_number,
          cheque_withdraw_date,
          cheque_bank_name,
          cheque_status,
        };
        await conn.insertMoneyReceiptChequeInfo(moneyReceiptChequeData);
      }

      const commonInvInfo: {
        invoice_id: number;
        pay_amount: number;
        ticket_no?: string;
      }[] = [];

      if (receipt_payment_to === 'INVOICE') {
        for (const invoice of invoices) {
          commonInvInfo.push({
            invoice_id: invoice.invoice_id,
            pay_amount: invoice.invoice_amount,
          });
        }
      } else if (receipt_payment_to === 'TICKET') {
        for (const ticket of tickets) {
          commonInvInfo.push({
            invoice_id: ticket.invoice_id,
            pay_amount: ticket.invoice_amount,
            ticket_no: ticket.ticket_no,
          });
        }
      } else {
        const cl_due = await conn.getInvoicesIdAndAmount(
          client_id,
          combined_id
        );

        let paidAmountNow: number = 0;

        for (const { invoice_id, total_due } of cl_due) {
          const availableAmount = Number(receipt_total_amount) - paidAmountNow;
          const payment_amount = Math.min(availableAmount, total_due);

          commonInvInfo.push({
            invoice_id: invoice_id,
            pay_amount: payment_amount,
          });

          paidAmountNow += payment_amount;
          if (total_due >= availableAmount) break;
        }
      }

      let invClPayments: IInvoiceClPay[] = [];
      let history_data = [];

      for (const item of commonInvInfo) {
        invClPayments.push({
          invclientpayment_moneyreceipt_id: receipt_id,
          invclientpayment_invoice_id: item.invoice_id,
          invclientpayment_client_id: client_id,
          invclientpayment_combined_id: combined_id,
          invclientpayment_amount: item.pay_amount,
          invclientpayment_date: receipt_payment_date,
          invclientpayment_collected_by: receipt_created_by,
          invclientpayment_ticket_number: item?.ticket_no,
          invclientpayment_cltrxn_id: client_trxn_id,
        });

        history_data.push({
          history_activity_type: 'INVOICE_PAYMENT_CREATED',
          history_invoice_id: item.invoice_id,
          history_created_by: receipt_created_by,
          history_invoice_payment_amount: item.pay_amount,
          invoicelog_content: 'Money receipt has been deleted',
          history_org_agency: req.agency_id,
        });
      }

      await conn.insertInvoiceClPay(invClPayments);
      await common_conn.insertInvHistory(history_data);

      // update voucher, sms send & audit history
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
        `ADDED MONEY RECEIPT ,VOUCHER ${voucher_no}, BDT ${receipt_total_amount}/- `,
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
