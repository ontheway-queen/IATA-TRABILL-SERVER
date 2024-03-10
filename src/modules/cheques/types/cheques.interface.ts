export type TChequeStatus = 'PENDING' | 'DEPOSIT' | 'BOUNCE' | 'RETURN';

export interface IChequeStatusBody {
  cheque_id: number;
  account_id: number;
  comb_vendor: string;
  comb_client: string;
  cheque_type:
    | 'MR_ADVR'
    | 'EXPENSE'
    | 'LOAN'
    | 'LOAN_PAYMENT'
    | 'LOAN_RECEIVED'
    | 'MONEY_RECEIPT'
    | 'PAYROLL'
    | 'VENDOR_ADVR'
    | 'VENDOR_PAYMENT';
  cheque_status: TChequeStatus;
  cheque_amount: number;
  cheque_note: string;
  date: string;
  user_id: number;
}

export interface IUpdateLoanCheque {
  lcheque_status: TChequeStatus;
  lcheque_deposit_date?: string;
  lcheque_deposit_note?: string;
  lcheque_bounce_date?: string;
  lcheque_bounce_note?: string;
  lcheque_return_date?: string;
  lcheque_return_note?: string;
}

export interface InsertLCheque {
  lcheque_amount: number;
  lcheque_bank_name: string | undefined;
  lcheque_loan_id: number;
  lcheque_number: string | undefined;
  lcheque_withdraw_date: string | undefined;
  lcheque_status: string;
  lcheque_create_date: string | undefined;
}

export interface InserLoanPayCheque {
  lpcheque_amount: number;
  lpcheque_number: string;
  lpcheque_payment_id: number;
  lpcheque_bank_name: string;
  lpcheque_withdraw_date: string;
  lpcheque_status: string;
}

export interface IPayrollChequeStatus {
  pcheque_return_note?: string;
  pcheque_return_date?: string;
  pcheque_status: TChequeStatus;
  pcheque_bounce_note?: string;
  pcheque_bounce_date?: string;
  pcheque_deposit_note?: string;
  pcheque_deposit_date?: string;
}
export interface IVendorAdvrCheque {
  cheque_status: TChequeStatus;
  cheque_deposit_date?: string;
  cheque_bounce_date?: string;
  cheque_return_date?: string;
  cheque_deposit_note?: string;
  cheque_bounce_note?: string;
  cheque_return_note?: string;
}
export interface IVendorPayCheque {
  vpcheque_status: TChequeStatus;
  vpcheque_deposit_date?: string;
  vpcheque_bounce_date?: string;
  vpcheque_return_date?: string;
  vpcheque_deposit_note?: string;
  vpcheque_bounce_note?: string;
  vpcheque_return_note?: string;
}
export interface IUpdateAdvrAccountClinetInfo {
  advr_account_id: number;
  advr_actransaction_id: number;
  advr_ctrxn_id: number;
}
