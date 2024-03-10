export interface IExpense {
  expense_actransaction_id?: number | null;
  expense_payment_type: number;
  expense_accategory_id?: number;
  expense_accounts_id?: number;
  expense_total_amount: number;
  expense_cheque_no?: string | null;
  expense_date: string;
  expense_note?: string;
  expense_created_by: number;
  expense_acctrxn_id?: number;
  expense_vouchar_no?: string;
  expense_charge_amount: number;
  expense_charge_id: number | null;
}

export interface IExpenseDetails {
  expdetails_expense_id?: number | string;
  expdetails_head_id: number | string;
  expdetails_amount: number;
}

export interface IGetExpenseDetails {
  expdetails_head_id: number;
  head_name: string;
  expdetails_subhead_id: number;
  subhead_name: string;
  expdetails_amount: string;
}

export interface IExpenseReqBody
  extends IExpense,
    Omit<IExpenseChequeDetails, 'expcheque_expense_id'> {
  expense_details: IExpenseDetails[];
  charge_amount: number;
}

export interface IExpenseChequeDetails {
  expcheque_expense_id: number | string;
  expcheque_amount: number;
  expcheque_number: string;
  expcheque_bank_name: string;
  expcheque_withdraw_date: string;
}

export interface IGetSingleExpense {
  expense_id: number;
  expense_acctrxn_id: number;
  expense_vouchar_no: string;
  expense_payment_type: number;
  expense_cheque_no: string;
  expcheque_bank_name: string;
  expcheque_withdraw_date: string;
  expcheque_status: string;
  expense_accounts_id: number;
  account_id: number;
  account_name: string;
  acctype_id: number;
  acctype_name: string;
  expense_total_amount: string;
  expense_date: string;
  expense_note: string;
}
