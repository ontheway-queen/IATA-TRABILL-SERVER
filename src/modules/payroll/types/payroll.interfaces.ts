export interface IPayrollReqBody {
  payroll_employee_id: number;
  payroll_account_id: number;
  payroll_acctrxn_id?: number;
  payroll_pay_type: number;
  payroll_salary: number;
  payroll_transection_no?: number;
  payroll_transection_charge?: number;
  payroll_mobile_bill: number;
  payroll_food_bill: number;
  payroll_bonus: number;
  payroll_commission: number;
  payroll_fastival_bonus: number;
  payroll_ta: number;
  payroll_advance: number;
  payroll_net_amount: number;
  payroll_cheque_no?: number;
  payroll_bank_name?: string;
  cheque_withdraw_date?: string;
  payroll_date?: string;
  payroll_note?: string;
  payroll_created_by?: number;
  payroll_updated_by?: number;
  payroll_provident?: number;
  payroll_health?: number;
  payroll_incentive?: number;
  payroll_accommodation?: number;
  payroll_attendance?: number;
  gross_salary?: number;
  daily_salary?: number;
  payroll_profit_share?: number;
  payment_month: string;
  payroll_other1: string;
  payroll_other2: string;
  payroll_other3: string;
  payroll_deductions: string;
}

export interface IPayrollEditReqBody
  extends Omit<IPayrollReqBody, 'payroll_deductions'> {
  payroll_deductions: string;
}

export interface IEditPayrollDeduction extends IPayrollDeductions {
  pd_id: number;
  is_deleted: 0 | 1;
}

export interface IPayrollDeductions {
  pd_payroll_id: number;
  pd_amount: number;
  pd_reason: string;
}

export interface ICreatePayroll
  extends Omit<
    IPayrollReqBody,
    'payroll_deductions' | 'payroll_deduction_reason'
  > {
  payroll_acctrxn_id?: number;
  payroll_vouchar_no?: string;
  payroll_charge_id: number | null;
  payroll_image_url: string;
}

export interface IDeletePayroll {
  payroll_deleted_by: number;
  payroll_id_deleted: number;
}

export interface IPayrollCheque {
  pcheque_payroll_id: number;
  pcheque_amount: number;
  pcheque_number: number;
  pcheque_bank_name: string;
  pcheque_withdraw_date: string;
  pcheque_status: 'PENDING' | 'UPDATED' | 'DELETED' | 'RESTORED';
}
