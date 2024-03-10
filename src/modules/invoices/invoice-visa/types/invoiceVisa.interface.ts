import {
  InvoiceMoneyReceiptType,
  IPassportInvoice,
} from '../../../../common/types/common.types';

export interface IVisaPassport {
  visapss_details_invoice_id: number;
  visapss_details_passport_id: number;
  visapss_details_id?: number;
}

export interface ICommonVisaData {
  invoice_created_by: number;
  invoice_id: number;
  invoice_client_id: number | null;
  invoice_combined_id: number | null;
}

// ==================== INVOICE VISA REQUEST DATA

export interface IVisaBillingDb {
  billing_id?: number;
  billing_sales_date: string;
  billing_invoice_id: number;
  billing_product_id: number;
  billing_visiting_country_id: number;
  billing_visa_type_id: number;
  billing_token: string;
  billing_delivery_date: string;
  billing_visa_no: string;
  billing_mofa_no: string;
  billing_okala_no: string;
  billing_quantity: number;
  billing_unit_price: number;
  billing_subtotal: number;
  billing_cost_price: number;
  billing_profit: number;
  billing_vendor_id?: number | null;
  billing_combined_id?: number | null;
  billing_status: 'Approved' | 'Pending' | 'Rejected';
  billing_remaining_quantity: number;
  billing_vtrxn_id?: number | null;
  billing_comvendor?: string;
  is_deleted?: number;
}

export interface InvoiceVisaReq {
  invoice_combclient_id: string;
  invoice_sales_man_id: number;
  billing_comvendor: string;
  invoice_note: string;
  invoice_no: string;
  invoice_sales_date: string;
  invoice_due_date: string;
  invoice_agent_id: number;
  invoice_sub_total: number;
  invoice_discount: number;
  invoice_service_charge: number;
  invoice_vat: number;
  invoice_net_total: number;
  invoice_agent_com_amount: number;
  invoice_client_previous_due: number;
  client_present_balance: number;
  receipt_payment_type: number;
  account_id: number;
  receipt_total_amount: number;
  receipt_payment_date: Date;
  trans_no: string;
  passport_information: IPassportInvoice[];
  invoice_created_by: number;
  money_receipt: InvoiceMoneyReceiptType;
  billing_information: IVisaBillingDb[];
  billing_status: 'Pending' | 'Approved' | 'Rejected';
  billing_deleted: [string];
  invoice_reference: string;
}
