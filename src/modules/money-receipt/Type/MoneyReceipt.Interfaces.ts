import { idType } from '../../../common/types/common.types';

export interface IAgentComReceipt {
  invoice_id: number;
  account_id: number;
  receipt_combclient: string;
  receipt_created_by: number;
  receipt_total_amount: number;
  receipt_payment_type: number;
  receipt_agent_id: number;
  receipt_agent_amount: number;
  receipt_total_discount: number;
  receipt_payment_date: string;
  receipt_money_receipt_no: string;
  receipt_note: string;
  cheque_bank_name?: string;
  cheque_number?: number;
  cheque_withdraw_date?: string;
  charge_amount: number;
  receipt_payment_to: 'OVERALL' | 'INVOICE';
  receipt_trxn_no: string;
}

export interface IMoneyReceiptDb {
  receipt_actransaction_id?: number | null;
  receipt_account_id: number;
  receipt_trnxtype_id: number;
  receipt_vouchar_no: string;
  receipt_client_id: number | null;
  receipt_combined_id: number | null;
  receipt_ctrxn_id?: idType | null;
  receipt_payment_to: 'INVOICE' | 'OVERALL' | 'TICKET' | 'AGENT_COMMISSION';
  receipt_invoice_id?: number;
  receipt_money_receipt_no?: string;
  receipt_payment_status: 'SUCCESS' | 'PENDING';
  receipt_total_amount: number;
  receipt_payment_type: number;
  receipt_agent_id?: number;
  receipt_agent_trxn_id?: number;
  receipt_agent_amount?: number;
  receipt_payment_date: string;
  receipt_note: string;
  receipt_created_by: number;
  receipt_total_discount?: number;
  receipt_trxn_charge: number;
  receipt_trxn_charge_id: number | null;
  receipt_trxn_no: string;
  receipt_walking_customer_name?: string;
  receipt_received_by: number | null;
}

export interface IPervMoneyReceipt {
  prevAccId: number;
  prevReceiptTotal: number;
  prevClientId: number | null;
  prevCombId: number | null;
  receipt_payment_type: number;
  prevCombClient: string;
  prevClTrxn: number;
  prevAccTrxnId: number;
  prevAgentId: number;
  prevAgentTrxnId: number;
  prevInvoiceId: number;
  receipt_trxn_charge_id: number;
  receipt_vouchar_no: string;
  receipt_trxn_charge: number;
}

export interface IUpdateMoneyReceipt
  extends Omit<
    IMoneyReceiptDb,
    'receipt_created_by' | 'receipt_vouchar_no' | 'receipt_trnxtype_id'
  > {
  receipt_updated_by: number;
}

export interface IMoneyReceiptReq {
  receipt_combclient: string;
  receipt_payment_to: 'INVOICE' | 'TICKET' | 'OVERALL';
  receipt_total_amount: number;
  receipt_money_receipt_no: string;
  receipt_payment_type: number;
  receipt_payment_date: string;
  receipt_note: string;
  account_id: number;
  cheque_number: number;
  cheque_withdraw_date: string;
  cheque_bank_name: string;
  receipt_created_by: number;
  trans_no: string;
  charge_amount: number;
  invoice_id: number;
  receipt_total_discount: number;
  receipt_walking_customer_name: string;
  received_by: number;
  tickets: {
    ticket_no: string;
    invoice_id: number;
    invoice_amount: number;
    discount: number;
  }[];

  invoices: {
    invoice_id: number;
    invoice_amount: number;
    discount: number;
  }[];
}

export interface IInvoiceClPay {
  invclientpayment_moneyreceipt_id: idType;
  invclientpayment_invoice_id: number | null;
  invclientpayment_client_id: number | null;
  invclientpayment_combined_id: number | null;
  invclientpayment_cltrxn_id: number;
  invclientpayment_amount: number;
  invclientpayment_date: string;
  invclientpayment_collected_by: number;
  invclientpayment_ticket_number?: string;
}

export interface IMoneyReceiptCheques {
  cheque_receipt_id?: idType;
  cheque_number: number;
  cheque_withdraw_date: string;
  cheque_bank_name: string;
  cheque_status: 'PENDING' | 'SUCCESS';
}

export interface IMoneyReceiptChequeStatusUpdate {
  cheque_deposit_date?: string;
  cheque_bounce_date?: string;
  cheque_return_date?: string;
  cheque_deposit_note?: string;
  cheque_bounce_note?: string;
  cheque_return_note?: string;
}

export interface IMoneyReceiptAdvanceReturn {
  advr_combclient: string;
  advr_payment_type: number;
  advr_account_id: number;
  advr_amount: number;
  advr_created_by: number;
  advr_payment_date: string;
  advr_note: string;
  cheque_number: string;
  cheque_withdraw_date: string;
  cheque_bank_name: string;
  advr_trxn_charge: number;
  advr_trxn_charge_id: number | null;
  advr_trxn_no: string;
}

export interface IAdvanceReturnDB
  extends Omit<
    IMoneyReceiptAdvanceReturn,
    | 'cheque_number'
    | 'cheque_withdraw_date'
    | 'cheque_bank_name'
    | 'advr_combclient'
  > {
  advr_combined_id: null | number;
  advr_client_id: null | number;
  advr_vouchar_no: string;
  advr_actransaction_id?: number;
  advr_ctrxn_id?: number;
}

export interface IAdvanceReturnUpdate
  extends Omit<
    IMoneyReceiptAdvanceReturn,
    | 'cheque_number'
    | 'cheque_withdraw_date'
    | 'cheque_bank_name'
    | 'advr_combclient'
    | 'advr_created_by'
  > {
  advr_combined_id: null | number;
  advr_client_id: null | number;
  advr_vouchar_no: string;
  advr_actransaction_id?: number;
  advr_ctrxn_id?: number;
  advr_updated_by: number;
}

export interface IAdvrChequesDB {
  cheque_advr_id: idType;
  cheque_number: string;
  cheque_withdraw_date: string;
  cheque_bank_name: string;
  cheque_status: 'SUCCESS' | 'PENDING';

  cheque_deposit_date?: string;
  cheque_bounce_date?: string;
  cheque_return_date?: string;
  cheque_bounce_note?: string;
  cheque_return_note?: string;
  cheque_deposit_note?: string;
}

export interface IMoneyReceiptChequeStatus {
  comb_client: string;
  receipt_total_amount: number;
  created_by: number;
  invoice_id: number;
  account_id: number;
  receipt_id: number;
  payment_date: string;
  cheque_status: 'DEPOSIT' | 'BOUNCE' | 'RETURN';
  cheque_note: string;
}
