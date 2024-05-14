import { InvoiceMoneyReceiptType } from '../../../../common/types/common.types';

// ============= INVOICE AIR TICKET INTERFACE

export interface IAirTicketTaxRefund {
  refund_invoice_id: number;
  refund_date: string;
  refund_voucher: String;
  refund_agency_id: number;
  refund_client_id: number | null;
  refund_combined_id: number | null;
  refund_c_trxn_id: number | null;
  client_refund_type: string;
  vendor_refund_type: string;
  client_pay_type: number;
  vendor_pay_type: number;
  client_account_id: number;
  vendor_account_id: number;
  client_account_trxn_id: number | null;
  vendor_account_trxn_id: number | null;
  client_total_tax_refund: number;
  vendor_total_tax_refund: number;
  refund_profit: number;
}
export interface IAirTicketTaxRefundItem {
  refund_id: number;
  refund_airticket_id: number;
  refund_vendor_id: number | null;
  refund_combined_id: number | null;
  refund_v_trxn_id: number | null;
  refund_tax_amount: number;
  refund_inv_category_id: number;
}

export interface IAirTicketTaxRefundBody {
  refund_invoice_id: number;
  invoice_category_id: number;
  comb_client: string;
  refund_date: string;
  ticket_info: {
    airticket_id: number;
    comb_vendor: string;
    refund_tax_amount: number;
    airticket_ticket_no: string;
  }[];
  client_refund_type: 'Adjust' | 'Return';
  vendor_refund_type: 'Adjust' | 'Return';
  client_pay_type: number;
  vendor_pay_type: number;
  client_account_id: number;
  vendor_account_id: number;
  client_total_tax_refund: number;
  vendor_total_tax_refund: number;
}

export interface InvoiceAirticketPreType {
  airticket_invoice_id: number;
  invoice_show_discount?: 0 | 1;
  invoice_show_passport_details?: 0 | 1;
  invoice_show_prev_due: 0 | 1;
  invoice_show_unit?: 0 | 1;
}
export interface InvoiceInfoType
  extends Omit<InvoiceAirticketPreType, 'airticket_invoice_id'> {
  invoice_combclient_id: string;
  invoice_sales_man_id: number;
  invoice_no: string;
  invoice_sales_date: string;
  invoice_due_date: string;
  invoice_note: string;
  invoice_agent_com_amount: number;
  invoice_sub_total: number;
  invoice_net_total: number;
  invoice_service_charge: number;
  invoice_total_profit: number;
  invoice_total_vendor_price: number;
  invoice_created_by: number;
  invoice_client_previous_due: number;
  invoice_vat: number;
  invoice_discount: number;
  invoice_agent_id: number;
  invoice_walking_customer_name: string;
  invoice_reference: string;
}

export interface IPaxPassport {
  passport_id?: number;
  is_deleted?: number;
  passport_name: string;
  passport_person_type: 'Adult' | 'Child' | 'Infant';
  passport_passport_no: string;
  passport_mobile_no: string;
  passport_email: string;
  passport_nid_no: string;
  passport_date_of_birth: string;
  passport_date_of_issue: string;
  passport_date_of_expire: string;
}

export interface ITicketDetails {
  airticket_id?: number;
  is_deleted?: number;
  airticket_ticket_type: string;

  airticket_ticket_no: string;
  airticket_gross_fare: number;
  airticket_base_fare: number;
  airticket_comvendor: string;
  airticket_airline_id: number;
  airticket_commission_percent: number;
  airticket_ait: number;
  airticket_ait_from: string;
  airticket_tax: number;
  airticket_commission_percent_total: number;
  airticket_discount_type: string;
  airticket_discount_total: number;
  airticket_extra_fee: number;
  airticket_other_bonus_total: number;
  airticket_other_bonus_type: string;
  airticket_other_expense: number;
  airticket_vat: number;
  airticket_client_price: number;
  airticket_purchase_price: number;
  airticket_profit: number;
  airticket_journey_date: string;
  airticket_return_date: string;
  airticket_gds_id: string;
  airticket_issue_date: string;
  airticket_segment: number;
  airticket_net_commssion: string;
  airticket_route_or_sector: number[];
  airticket_pnr: string;
  airticket_bd_charge: number;
  airticket_es_charge: number;
  airticket_ut_charge: number;
  airticket_xt_charge: number;
  airticket_classes: string;
  airticket_tax1: number;
  airticket_g4_charge: number;
  airticket_e5_charge: number;
  airticket_p7_charge: number;
  airticket_p8_charge: number;
  airticket_r9_charge: number;
  airticket_ow_charge: number;
  airticket_pz_charge: number;
  airticket_qa_charge: number;
}

export interface IAirticketRoutes {
  airoute_invoice_id: number;
  airoute_airticket_id?: number;
  airoute_route_sector_id: number;
}

export interface IAirTicketDb
  extends Omit<
    ITicketDetails,
    'airticket_route_or_sector' | 'airticket_comvendor'
  > {
  airticket_invoice_id: number;
  airticket_client_id: number | null;
  airticket_combined_id: number | null;
  airticket_vendor_id: number | null;
  airticket_vendor_combine_id: number | null;
  airticket_sales_date: string;
  airticket_vtrxn_id?: number | null;
  airticket_total_taxes_commission: number;
}

export interface IFlightDetail {
  fltdetails_id?: number;
  is_deleted?: number;
  fltdetails_from_airport_id: number;
  fltdetails_to_airport_id: number;
  fltdetails_airline_id: number;
  fltdetails_flight_no: number;
  fltdetails_fly_date: string;
  fltdetails_departure_time: string;
  fltdetails_arrival_time: string;
}

export interface IFlightDetailsDb extends IFlightDetail {
  fltdetails_airticket_id: number;
  fltdetails_invoice_id: number;
}

export interface ITaxesCommission {
  airline_taxes: number;
  airline_commission: number;
  airline_tax_type: string;
}

export interface ITaxesCommissionDB extends ITaxesCommission {
  airline_airticket_id: number;
  airline_invoice_id: number;
}
[];

export interface ITicketInfo {
  pax_passports: IPaxPassport[];
  ticket_details: ITicketDetails;
  flight_details: IFlightDetail[];
  taxes_commission: ITaxesCommission[];
  total_taxes_commission: number;
}

export interface InvoiceAirTicketReqType {
  invoice_info: InvoiceInfoType;
  ticketInfo: ITicketInfo[];
  money_receipt: InvoiceMoneyReceiptType;
}

export interface IVoidReqBody {
  client_charge: number;
  invoice_void_date: string;
  invoice_no: string;
  net_total: number;
  comb_client: string;
  invoice_vendors: {
    comb_vendor: string;
    vendor_charge: number;
    airticket_ticket_no: string;
    cost_price: number;
  }[];
}

export interface IFakeInvoiceReqBody
  extends Omit<IFakeInvoiceInfo, 'ti_org_agency' | 'ti_created_by'> {
  infos: Omit<
    IFakeInvoiceInfoItems[],
    'tii_org_agency' | 'tii_ti_id' | 'tii_created_by' | 'tii_invoice_id'
  >;
}

export interface IFakeInvoiceInfo {
  ti_org_agency: number;
  ti_invoice_id: number;
  ti_sub_total: number;
  ti_total_discount: number;
  ti_net_total: number;
  ti_total_payment: number;
  ti_invoice_total_due: number;
  ti_created_by: number;
}

export interface IFakeInvoiceInfoItems {
  tii_ti_id: number;
  tii_org_agency: number;
  tii_invoice_id: number;
  tii_billing_id: number;
  tii_airticket_id: number;
  tii_airticket_no: string;
  tii_airticket_discount: number;
  tii_airticket_class: string;
  tii_airticket_class_type: string;
  tii_airticket_pnr: string;
  tii_airticket_route: string;
  tii_total_discount: number;
  tii_product_name: string;
  tii_pax_name: string;
  tii_quantity: number;
  tii_unit_price: number;
  tii_sub_total: number;
  tii_visiting_country: string;
  tii_visa_type: string;
  tii_token_no: string;
  tii_status: string;
  tii_journey_date: string;
  tii_total_room: number;
  tii_created_by: number;
}
