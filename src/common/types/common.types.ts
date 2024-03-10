import { Knex } from 'knex';
export type TDB = Knex | Knex.Transaction;
export type QDB = Knex.QueryBuilder<any, unknown[]> | Knex.Transaction;

export interface InvoiceHistory {
  history_activity_type:
  | 'INVOICE_AGENT_COMMISSION'
  | 'INVOICE_CREATED'
  | 'INVOICE_RESTORED'
  | 'INVOICE_UPDATED'
  | 'INVOICE_REFUNDED'
  | 'INVOICE_DELETED'
  | 'INVOICE_PAYMENT_CREATED'
  | 'INVOICE_PAYMENT_RESTORED'
  | 'INVOICE_PAYMENT_UPDATED'
  | 'INVOICE_PAYMENT_DELETED';
  history_invoice_id: idType;
  history_created_by?: number;
  history_invoice_payment_amount?: number;
  invoicelog_content: string;
}

export type billingTableType =
  | 'trabill_invoice_umrah_billing_infos'
  | 'trabill_invoice_visa_billing_infos'
  | 'trabill_invoice_hajj_billing_infos';

export type ClientComType = 'client' | 'combined' | 'vendor';
export type VendorComType = 'vendor' | 'combined';

export interface IClientPayableData {
  payable_client_id?: idType;
  payable_invoice_id?: idType;
  payable_amount?: number;
  payable_create_date?: string;
  payable_created_by?: number;
  payable_updated_by?: number;
  payable_is_deleted?: 0 | 1;
  payable_deleted_by?: number;
}

export interface IBillInfo {
  billing_product_id: number;
  billing_quotation_id: number;
  billing_description: string;
  billing_quantity: number;
  billing_unit_price: number;

  billing_product_total_price: number;
}

export interface InvoiceMoneyReceiptType {
  receipt_total_amount: number;
  receipt_payment_type: number;
  account_id: number;
  charge_amount: number;
  cheque_bank_name: string;
  cheque_number: number;
  cheque_withdraw_date: string;
  receipt_money_receipt_no: string;
  receipt_note: string;
  trans_no: string;
  receipt_payment_date: string;
  receipt_total_discount: number;
  receipt_trxn_no: string;
}

export interface ICommonMoneyReceiptInvoiceData {
  invoice_client_id: number | null;
  invoice_combined_id: number | null;
  invoice_created_by: number;
  invoice_id: number;
}

export interface IPassportInvoice {
  passport_passport_no: string;
  passport_name: string;
  passport_mobile_no: string;
  passport_email: string;
  passport_date_of_birth?: string;
  passport_date_of_issue?: string;
  passport_date_of_expire?: string;
  passport_visiting_country?: number;
  passport_nid_no?: string;
  passport_id?: number;
  other_pass_id?: number;
  other_pass_is_deleted?: number;
  is_deleted?: number;
  visapss_details_id?: number;
}

export interface IPassportDb extends IPassportInvoice {
  passport_client_id?: number | null;
  passport_rec_cl_id?: string | null;
  passport_combined_id?: number | null;
  passport_created_by?: number;
  passport_scan_copy?: string;
  passport_upload_photo?: string;
  passport_upload_others?: string;
  passport_person_type: 'Infant' | 'Child' | 'Adult';
}

export enum Resources {
  invoice_airticket = 'invoice_airticket',
  invoice_non_commission = 'invoice_non_commission',
  invoice_reissue = 'invoice_reissue',
  invoice_other = 'invoice_other',
  invoice_visa = 'invoice_visa',
  invoice_tour_package = 'invoice_tour_package',
  invoice_hajj_pre_reg = 'invoice_hajj_pre_reg',
  invoice_hajj = 'invoice_hajj',
  invoice_ummrah = 'invoice_ummrah',
  hajji_management = 'hajji_management',
  hajji_management_client_to_client = 'hajji_management_client_to_client',
  hajji_management_group_to_group = 'hajji_management_group_to_group',
  hajji_management_transfer_inout = 'hajji_management_transfer_inout',
  hajji_management_cancel_pre_reg = 'hajji_management_cancel_pre_reg',
  refund_module = 'refund_module',
  refund_airticket = 'refund_airticket',
  refund_other_invoice = 'refund_other_invoice',
  refund_tour_package = 'refund_tour_package',
  money_receipt = 'money_receipt',
  money_receipt_advr = 'money_receipt_advr',
  accounts_module = 'accounts_module',
  account_opening_balance = 'account_opening_balance',
  account_balance_transfer = 'account_balance_transfer',
  account_non_invoice_income = 'account_non_invoice_income',
  account_investments = 'account_investments',
  account_bill_adjustment = 'account_bill_adjustment',
  cheque_management = 'cheque_management',
  payroll = 'payroll',
  expense = 'expense',
  loan_management_module = 'loan_management_module',
  loan_management_authority = 'loan_management_authority',
  loan_management_loan = 'loan_management_loan',
  loan_management_payment = 'loan_management_payment',
  loan_management_receive = 'loan_management_receive',
  sms_system = 'sms_system',
  clients = 'clients',
  combined_clients = 'combined_clients',
  vendors = 'vendors',
  vendors_payment = 'vendors_payment',
  vendor_advr = 'vendor_advr',
  agents = 'agents',
  quotation = 'quotation',
  passport_management = 'passport_management',
  report_module = 'report_module',
  report_ledgers = 'report_ledgers',
  report_total_due_advance = 'report_total_due_advance',
  sales_report = 'sales_report',
  profit_loss_report = 'profit_loss_report',
  expense_report = 'expense_report',
  passport_report = 'passport_report',
  passenger_list_report = 'passenger_list_report',
  vendor_wise_purchase_payment = 'vendor_wise_purchase_payment',
  client_discount = 'client_discount',
  journey_date_wise_report = 'journey_date_wise_report',
  ait_report = 'ait_report',
  accounts_report = 'accounts_report',
  refund_report = 'refund_report',
  summary = 'summary',
  country_wise_report = 'country_wise_report',
  trash_list = 'trash_list',
  user_login_history = 'user_login_history',
  audit_trail = 'audit_trail',
  configuration_module = 'configuration_module',
  client_category = 'client_category',
  airports = 'airports',
  products = 'products',
  visa_type = 'visa_type',
  departments = 'departments',
  room_types = 'room_types',
  transport_types = 'transport_types',
  designations = 'designations',
  employee = 'employee',
  users_role = 'users_role',
  tour_itinerary = 'tour_itinerary',
  passport_status = 'passport_status',
  groups = 'groups',
  maharam = 'maharam',
  agency = 'agency',
  airline = 'airline',
  expense_head = 'expense_head',
  companies = 'companies',
  database = 'database',
  database_backup = 'database_backup',
  database_reset = 'database_reset',
  jobs = 'jobs',
  office = 'office',
}

export type idType = number | string;

export type VoucherType =
  | 'AIT'
  | 'ANC'
  | 'ARI'
  | 'ITP'
  | 'IO'
  | 'IV'
  | 'IHP'
  | 'IH'
  | 'IU'
  | 'MR'
  | 'VPY'
  | 'QT'
  | 'EXP'
  | 'ATR'
  | 'OTR'
  | 'TPR'
  | 'RCM'
  | 'CL'
  | 'BT'
  | 'NII'
  | 'IVT'
  | 'ICI'
  | 'LN'
  | 'LNR'
  | 'LNP'
  | 'ADR'
  | 'AGP'
  | 'ADVR';
