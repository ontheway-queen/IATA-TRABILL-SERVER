export interface ILoanAuthorityReqBody {
  name: string;
  contact: string;
  address: string;
  created_by: number;
}

export interface ILoanAuthority {
  authority_name: string;
  authority_mobile: string;
  authority_address: string;
  authority_created_by?: number;
  authority_updated_by?: number;
}

export interface ILoansReqBody {
  authority_id: number;
  name: string;
  type: 'GIVING' | 'TAKING' | 'ALREADY_TAKEN' | 'ALREADY_GIVEN';
  amount: string;
  interest_percent?: string;
  pay_amount?: number;
  receive_amount?: number;
  installment: 'YES' | 'NO';
  installment_type: 'MONTHLY' | 'DAILY';
  installment_duration?: number;
  installment_per_month?: number;
  installment_per_day?: number;
  payment_type: 1 | 2 | 3 | 4;
  charge_amount: number;
  cheque_no?: string;
  withdraw_date?: string;
  bank_name?: string;
  accategory_id?: number;
  account_id: number;
  date?: string;
  note?: string;
  loan_created_by: number;
}

export interface ILoans {
  loan_vouchar_no?: string;
  loan_authority_id: number;
  loan_actransaction_id?: number;
  loan_name: string;
  loan_type: string;
  loan_amount: number;
  loan_due_amount: number | undefined;
  loan_interest_percent?: string;
  loan_payable_amount?: number;
  loan_receivable_amount?: number;
  loan_installment?: string;
  loan_installment_type?: string;
  loan_installment_duration?: number;
  loan_installment_per_month?: number;
  loan_installment_per_day?: number;
  loan_payment_type: 1 | 2 | 3 | 4;
  loan_cheque_no?: string;
  loan_withdraw_date?: string;
  loan_bank_name?: string;
  loan_accategory_id?: number;
  loan_account_id?: number;
  loan_date?: string;
  loan_note?: string;
  loan_created_by: number;
  loan_vouchar?: string;
  loan_charge_amount: number;
  loan_charge_id: number | null;
}

export interface IGetLoans {
  loan_id: number;
  loan_account_id: number;
  loan_actransaction_id: number;
  authority_name: string;
  loan_name: string;
  loan_type: string;
  loan_payment_type: string;
  loan_payable_amount: string;
  loan_receivable_amount: string;
  loan_due_amount: string;
  loan_interest_percent: string;
  loan_installment: string;
  loan_date: string;
  loan_note: string;
}

export interface ILoanPaymentReqBody {
  authority_id: number;
  loan_id: number;
  accategory_id: number;
  account_id: number;
  payment_type: 1 | 2 | 3 | 4;
  charge_amount: number;
  amount: number;
  cheque_no: string;
  withdraw_date: string;
  bank_name: string;
  created_by: number;
  payment_date: string;
  payment_note: string;
}

export interface ILoanPayment {
  payment_vouchar_no?: string;
  payment_authority_id: number;
  payment_actransaction_id?: number;
  payment_loan_id: number;
  payment_type: 1 | 2 | 3 | 4;
  payment_accategory_id?: number;
  payment_account_id?: number;
  payment_amount: number;
  payment_created_by: number;
  payment_cheque_no?: string;
  payment_withdraw_date?: string;
  payment_bank_name?: string;
  payment_date: string;
  payment_note?: string;
  payment_charge_amount: number;
  payment_charge_id: number | null;
}

export interface ILoanReceiveReqBody {
  authority_id: number;
  loan_id: number;
  accategory_id: number;
  account_id: number;
  payment_type: 1 | 2 | 3 | 4;
  charge_amount: number;
  amount: number;
  cheque_no: string;
  withdraw_date: string;
  bank_name: string;
  created_by: number;
  received_date: string;
  received_note: string;
}

export interface ILoanReceive {
  received_vouchar_no?: string;
  received_authority_id: number;
  received_actransaction_id?: number;
  received_loan_id: number;
  received_payment_type: 1 | 2 | 3 | 4;
  received_accategory_id?: number;
  received_account_id?: number;
  received_amount: number;
  received_created_by: number;
  received_cheque_no?: string;
  received_withdraw_date?: string;
  received_bank_name?: string;
  received_date: string;
  received_note: string;
  received_charge_amount: number;
  received_charge_id: number | null;
}
