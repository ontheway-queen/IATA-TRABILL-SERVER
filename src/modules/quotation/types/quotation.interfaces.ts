export interface IReqBillInfo {
  product_id: number;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  billing_country_id: number;
}

export interface IQuotationReqBody {
  client_id: string;
  q_number: number;
  date: string;
  bill_info: IReqBillInfo[];
  note: string;
  discount: number;
  sub_total: number;
  net_total: number;
  created_by?: number;
  updated_by?: number;
}

export interface IQuotation {
  quotation_type: 'QUOTATION' | 'ACCUMULATE';
  quotation_client_id?: number;
  quotation_combined_id?: number;
  quotation_no: number;
  quotation_inv_payment?: number;
  quotation_net_total?: number;
  quotation_discount_total: number;
  quotation_date: string;
  quotation_note?: string;
  quotation_created_by?: number;
  quotation_updated_by?: number;
  quotation_update_date?: string;
  quotation_deleted_by?: string;
}

export interface IAccumulateBody {
  q_number: number;
  sales_date: string;
  discount: number;
  payment: number;
  invoices: { invoices_id: number; category_id: number }[];
}
