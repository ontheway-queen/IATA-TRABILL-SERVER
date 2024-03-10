export interface ISmsReqBody {
  client_category_id: number;
  client_id?: string;
  client_mobile: string;
  text_type: 'TEXT' | 'UNICODE';
  message: string;
  date: string;
  created_by: number;
}
export interface ISmsReqBodyArray extends Array<ISmsReqBody> {}

export interface ISms {
  sms_client_catrgory_id: number;
  sms_client_id?: number;
  sms_combine_id?: number;
  sms_client_mobile: string;
  sms_text_type: 'TEXT' | 'UNICODE';
  sms_client_message: string;
  sms_date: string;
  sms_created_by: number;
}

export interface SMSlog {
  smslog_for: string;
  smslog_client_id?: number | null;
  smslog_combine_id?: number | null;
  smslog_mobile: number | string | undefined;
  smslog_content: string | undefined;
  smslog_delivery_status: 'DELIVERED' | 'NOT DELIVERED';
}

export interface smsInvoiceData {
  invoice_client_id: number;
  invoice_combined_id: number;
  invoice_sales_date: string;
  invoice_created_by: number;
  invoice_message?: string;
  invoice_id?: number;
  receipt_id?: number;
}
