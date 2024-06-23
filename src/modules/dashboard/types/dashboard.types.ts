export interface IAirTicketSummary {
  date_range: string;
  sales_amount: number;
  purchase_amount: number;
  tax_amount: number;
  profit_amount: number;
  payment_amount: number;
}

export type BspBillingSummaryQueryType = {
  billingType: 'previous' | 'upcoming';
  week: 'previous' | 'previous_next' | 'first' | 'second' | 'third' | 'fourth';
  from_date: string | Date | 'Invalid Date';
  to_date: string | Date | 'Invalid Date';
};

export type BspBillingQueryType = {
  billingType: 'previous' | 'upcoming';
  from_date: string | Date | 'Invalid Date';
  to_date: string | Date | 'Invalid Date';
};

export interface IBspDocs {
  bsp_agency_id: number;
  bsp_file_url: string;
  bsp_file_name: string;
  bsp_bill_date: Date;
  bsp_created_by: number;
}
