import { TChequeStatus } from '../../cheques/types/cheques.interface';

export interface Icheque {
  account_id: number;
  client_id: number;
  vendor_id: number;
  amount: string;
  note: string;
  date: string;
  cheque_status: TChequeStatus;
  chequeTable:
    | 'EXPENSE'
    | 'ADVR'
    | 'LOAN_PAYMENT'
    | 'LOAN_RECEIVED'
    | 'LOAN_CHEQUE'
    | 'MONEY_RECEIPT'
    | 'CLIENT_REFUND'
    | 'VENDOR_REFUND'
    | 'VENDOR_ADVR'
    | 'VENDOR_PAYMENT'
    | 'PAYROLL';

  user_id: number;
  chequeId: number;
}

export interface IUpdateAdvrCheque {
  cheque_status: TChequeStatus;
  cheque_deposit_date?: string;
  cheque_deposit_note?: string;
  cheque_bounce_date?: string;
  cheque_bounce_note?: string;
  cheque_return_date?: string;
  cheque_return_note?: string;
}
export interface IUpdateRefundCheque {
  rcheque_status: TChequeStatus;
  rcheque_deposit_date?: string;
  rcheque_deposit_note?: string;
  rcheque_bounce_date?: string;
  rcheque_bounce_note?: string;
  rcheque_return_date?: string;
  rcheque_return_note?: string;
}

export interface IUpdateExpenceCheque {
  expcheque_status: TChequeStatus;
  expcheque_deposit_date?: string;
  expcheque_deposit_note?: string;
  expcheque_bounce_date?: string;
  expcheque_bounce_note?: string;
  expcheque_return_date?: string;
  expcheque_return_note?: string;
}
export interface IUpdateLPayCheque {
  lpcheque_status: TChequeStatus;
  lpcheque_deposit_date?: string;
  lpcheque_deposit_note?: string;
  lpcheque_bounce_date?: string;
  lpcheque_bounce_note?: string;
  lpcheque_return_date?: string;
  lpcheque_return_note?: string;
}

export interface InsertLPayCheque {
  lpcheque_amount: number;
  lpcheque_number: string;
  lpcheque_payment_id: number;
  lpcheque_bank_name: string;
  lpcheque_withdraw_date: string;
  lpcheque_status: string;
}

export interface InsertReceived {
  lrcheque_amount: number;
  lrcheque_number: string;
  lrcheque_received_id: number;
  lrcheque_bank_name: string;
  lrcheque_withdraw_date: string;
  lrcheque_status: string;
}

export interface IUpdateLReceiveCheque {
  lrcheque_status: TChequeStatus;
  lrcheque_deposit_date?: string;
  lrcheque_deposit_note?: string;
  lrcheque_bounce_date?: string;
  lrcheque_bounce_note?: string;
  lrcheque_return_date?: string;
  lrcheque_return_note?: string;
}
export interface IUpdateMoneyReceiptCheque {
  cheque_status: TChequeStatus;
  cheque_deposit_date?: string;
  cheque_deposit_note?: string;
  cheque_bounce_date?: string;
  cheque_bounce_note?: string;
  cheque_return_date?: string;
  cheque_return_note?: string;
}
