import { Request } from 'express';
import { Knex } from 'knex';
import AbstractServices from '../../abstracts/abstract.services';
import { IOnlineTrxnCharge } from '../../modules/accounts/types/account.interfaces';
import {
  IInvoiceClPay,
  IMoneyReceiptCheques,
  IMoneyReceiptDb,
} from '../../modules/money-receipt/Type/MoneyReceipt.Interfaces';
import Trxns from '../helpers/Trxns';
import { isEmpty } from '../helpers/invoice.helpers';
import { IAcTrxn, IClTrxnBody } from '../interfaces/Trxn.interfaces';
import {
  ICommonMoneyReceiptInvoiceData,
  InvoiceHistory,
  InvoiceMoneyReceiptType,
} from '../types/common.types';

class CommonAddMoneyReceipt extends AbstractServices {
  constructor() {
    super();
  }

  public commonAddMoneyReceipt = async (
    req: Request,
    invoices: ICommonMoneyReceiptInvoiceData,
    trx: Knex.Transaction<any, any[]>
  ) => {
    const { money_receipt } = req.body as {
      money_receipt: InvoiceMoneyReceiptType;
    };

    if (isEmpty(money_receipt) || !money_receipt?.receipt_total_amount) {
      return;
    }

    const {
      invoice_client_id,
      invoice_combined_id,
      invoice_created_by,
      invoice_id,
    } = invoices;

    const combClient = invoice_client_id
      ? 'client-' + invoice_client_id
      : 'combined-' + invoice_combined_id;

    const {
      receipt_total_amount,
      receipt_payment_type,
      account_id,
      receipt_money_receipt_no,
      receipt_note,
      receipt_payment_date,
      cheque_number,
      cheque_withdraw_date,
      cheque_bank_name,
      charge_amount,
      receipt_total_discount,
      receipt_trxn_no,
    } = money_receipt;

    return await this.models.db.transaction(async () => {
      const conn = this.models.MoneyReceiptModels(req, trx);
      const common_conn = this.models.CommonInvoiceModel(req, trx);
      const trxns = new Trxns(req, trx);

      const receipt_vouchar_no = await this.generateVoucher(req, 'MR');

      const receipt_payment_status =
        receipt_payment_type === 4 ? 'PENDING' : 'SUCCESS';

      // @RECEIPT_ID
      let receipt_actransaction_id;
      let client_trxn_id: null | number = null;

      const amount_after_discount =
        Number(receipt_total_amount) - (Number(receipt_total_discount) || 0);

      const note = receipt_total_discount
        ? `Paid ${receipt_total_amount} discount ${receipt_total_discount}, ${
            receipt_note || ''
          }`
        : receipt_note || '';

      if (receipt_payment_type !== 4) {
        let accPayType: 'CASH' | 'BANK' | 'MOBILE BANKING';
        if (receipt_payment_type === 1) {
          accPayType = 'CASH';
        } else if (receipt_payment_type === 2) {
          accPayType = 'BANK';
        } else if (receipt_payment_type === 3) {
          accPayType = 'MOBILE BANKING';
        } else {
          accPayType = 'CASH';
        }

        const AccTrxnBody: IAcTrxn = {
          acctrxn_ac_id: account_id,
          acctrxn_type: 'CREDIT',
          acctrxn_voucher: receipt_vouchar_no,
          acctrxn_amount: amount_after_discount,
          acctrxn_created_at: receipt_payment_date,
          acctrxn_created_by: invoice_created_by,
          acctrxn_note: note,
          acctrxn_particular_id: 2,
          acctrxn_particular_type: 'Money receipt',
          acctrxn_pay_type: accPayType,
        };

        receipt_actransaction_id = await trxns.AccTrxnInsert(AccTrxnBody);

        const clTrxnBody: IClTrxnBody = {
          ctrxn_type: 'CREDIT',
          ctrxn_amount: receipt_total_amount,
          ctrxn_cl: combClient,
          ctrxn_voucher: receipt_vouchar_no,
          ctrxn_particular_id: 29,
          ctrxn_created_at: receipt_payment_date,
          ctrxn_note: note,
          ctrxn_particular_type: 'Money Receipt',
        };

        client_trxn_id = await trxns.clTrxnInsert(clTrxnBody);
      }

      let receipt_trxn_charge_id: number | null = null;
      if (receipt_payment_type === 3 && charge_amount) {
        const online_charge_trxn: IOnlineTrxnCharge = {
          charge_to_acc_id: account_id,
          charge_from_client_id: invoice_client_id as number,
          charge_from_ccombined_id: invoice_combined_id as number,
          charge_amount: charge_amount,
          charge_purpose: 'Invoice money receipt',
          charge_note: receipt_note,
        };

        receipt_trxn_charge_id = await this.models
          .vendorModel(req, trx)
          .insertOnlineTrxnCharge(online_charge_trxn);
      }

      const receiptInfo: IMoneyReceiptDb = {
        receipt_trnxtype_id: 2,
        receipt_vouchar_no,
        receipt_client_id: invoice_client_id,
        receipt_combined_id: invoice_combined_id,
        receipt_actransaction_id,
        receipt_payment_to: 'INVOICE',
        receipt_invoice_id: invoice_id,
        receipt_total_amount: Number(receipt_total_amount),
        receipt_total_discount,
        receipt_money_receipt_no,
        receipt_payment_type,
        receipt_payment_date,
        receipt_ctrxn_id: client_trxn_id,
        receipt_note,
        receipt_created_by: invoice_created_by,
        receipt_payment_status,
        receipt_trxn_charge: charge_amount,
        receipt_trxn_charge_id,
        receipt_account_id: account_id,
        receipt_trxn_no,
      };

      const receipt_id = await conn.insertMoneyReceipt(receiptInfo);

      if (receipt_payment_type === 4) {
        const moneyReceiptChequeData: IMoneyReceiptCheques = {
          cheque_receipt_id: receipt_id,
          cheque_number,
          cheque_withdraw_date,
          cheque_bank_name,
          cheque_status: receipt_payment_status,
        };
        await conn.insertMoneyReceiptChequeInfo(moneyReceiptChequeData);
      } else {
        const invoiceClientPaymentInfo: IInvoiceClPay = {
          invclientpayment_moneyreceipt_id: receipt_id,
          invclientpayment_invoice_id: invoice_id,
          invclientpayment_client_id: invoice_client_id,
          invclientpayment_combined_id: invoice_combined_id,
          invclientpayment_cltrxn_id: client_trxn_id as number,
          invclientpayment_amount: receipt_total_amount,
          invclientpayment_date: receipt_payment_date,
          invclientpayment_collected_by: invoice_created_by as number,
        };
        await conn.insertInvoiceClPay(invoiceClientPaymentInfo);
      }

      const history_data: InvoiceHistory = {
        history_activity_type: 'INVOICE_PAYMENT_CREATED',
        history_invoice_id: invoice_id,
        history_created_by: invoice_created_by,
        history_invoice_payment_amount: receipt_total_amount,
        invoicelog_content: `Payment added to Invoice (Amount = ${receipt_total_amount})/-`,
      };

      await common_conn.insertInvoiceHistory(history_data);

      const audit_content = `Payment added to Invoice (Amount = ${receipt_total_amount})/-`;

      await this.insertAudit(
        req,
        'update',
        audit_content,
        invoice_created_by,
        'MONEY_RECEIPT'
      );

      await this.updateVoucher(req, 'MR');

      return receipt_id;
    });
  };
}

export default CommonAddMoneyReceipt;
