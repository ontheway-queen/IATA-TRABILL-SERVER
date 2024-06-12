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
  tbd_agency_id: number;
  tbd_doc: string;
  tbd_date: string;
}
