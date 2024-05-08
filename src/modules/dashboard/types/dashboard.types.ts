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
};
