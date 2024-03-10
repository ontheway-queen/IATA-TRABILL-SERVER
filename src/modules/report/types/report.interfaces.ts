export interface ITransaction {
  serial: number;
  ctrxn_id: number;
  trxntype_name: string;
  ctrxn_ledger_type: string;
  ctrxn_type: 'DEBIT' | 'CREDIT';
  ctrxn_amount: string;
}

export interface IAudit {
  audit_user_id: number;
  audit_success?: boolean;
  audit_action: actionType;

  audit_content: string;
  audit_invoice_id?: number;
  audit_moneyreceipt_id?: number;
  audit_module_type?:
    | 'INVOICES'
    | 'MONEY_RECEIPT'
    | 'VENDOR_PAYMENT'
    | 'REFUND'
    | 'OTHERS';
}

export type actionType = 'create' | 'update' | 'delete';
export type auditModuleType =
  | 'INVOICES'
  | 'MONEY_RECEIPT'
  | 'ACCOUNTS'
  | 'MONEY_RECEIPT_ADVANCE_RETURN'
  | 'VENDOR'
  | 'VENDOR_PAYMENT'
  | 'VENDOR_ADVANCE_RETURN'
  | 'HAJJ_MGT'
  | 'QUOTATION'
  | 'EXPENSE'
  | 'REFUND'
  | 'CHEQUE'
  | 'PASSPORT'
  | 'RCM'
  | 'LOAN'
  | 'OTHERS'
  | 'RCM_MR'
  | 'PAYROLL'
  | 'EMAIL'
  | 'SMS';
