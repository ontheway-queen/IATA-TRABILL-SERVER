export interface IPnrInvoiceBody {
  invoice_combclient_id: string;
  invoice_walking_customer_name: string;
  invoice_vat: number;
  invoice_service_charge: number;
  invoice_discount: number;
  invoice_pnr: string;
}

export interface IPnrDetails {
  pax_passports: PaxPassport[];
  ticket_details: TicketDetail[];
  flight_details: FlightDetail[];
  invoice_sales_date: string;
  creation_sign: string;
  invoice_sales_man_id: number;
  route_sectors: string[];
  route_or_sector: number[];
}

export interface PaxPassport {
  passport_name: string;
  passport_person_type: string;
  passport_mobile_no: any;
  passport_email: any;
}

export interface TicketDetail {
  airticket_comvendor: string;
  airticket_gds_id: string;
  airticket_ticket_no: string;
  airticket_issue_date: string;
  airticket_base_fare: number;
  airticket_gross_fare: number;
  airticket_classes: string;
  cabin_type: string;
  airticket_tax: number;
  currency: string;
  airticket_segment: number;
  airticket_journey_date: string;
  airticket_commission_percent_total: number;
  airticket_commission_percent: number;
  airticket_route_or_sector: number[];
  airticket_airline_id: number;
  airticket_ait: number;
  airticket_client_price: number;
  airticket_purchase_price: number;
  airticket_net_commssion: number;
  airticket_profit: number;
  BD: number;
  UT: number;
  OW: number;
  E5: number;
  AU: number;
  WG: number;
  WY: number;
  YQ: number;
  P8: number;
  P7: number;
}

export interface FlightDetail {
  fltdetails_from_airport_id: number;
  fltdetails_to_airport_id: number;
  fltdetails_flight_no: number;
  fltdetails_fly_date: string;
  fltdetails_departure_time: string;
  fltdetails_arrival_time: string;
  fltdetails_airline_id: number;
}
