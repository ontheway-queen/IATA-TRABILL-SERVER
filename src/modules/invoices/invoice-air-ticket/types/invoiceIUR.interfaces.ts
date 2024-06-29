export interface IInvoiceIURBody {
  creation_sign: string;
  issue_date: string;
  client_ref: string;
  ticketInfo: TicketInfo[];
}

export interface TicketInfo {
  ticket_details: TicketDetails;
  flight_details: FlightDetail[];
  pax_passports: PaxPassport[];
}

export interface TicketDetails {
  airticket_ticket_no: string;
  airticket_gross_fare: number;
  airticket_base_fare: number;
  airticket_commission_percent: number;
  airticket_commission_percent_total: number;
  airticket_client_price: number;
  airticket_classes: string;
  airticket_pnr: string;
  airticket_bd_charge: number;
  airticket_ut_charge: number;
  airticket_e5_charge: number;
  airticket_es_charge: number;
  airticket_issue_date: string;
  airticket_journey_date: string;
  airticket_return_date: string;
  airline_name: string;
  airticket_routes: string;
  airticket_ait: number;
  airticket_segment: number;
  yq: number;
  yr: number;
}

export interface FlightDetail {
  fltdetails_from_airport: string;
  fltdetails_to_airport: string;
  fltdetails_airline: string;
  fltdetails_flight_no: string;
  fltdetails_fly_date: string;
  fltdetails_departure_time: string;
  fltdetails_arrival_time: string;
}

export interface PaxPassport {
  passport_name: string;
  passport_person_type: string;
  passport_passport_no: string;
  passport_mobile_no: string;
  passport_email: string;
  passport_date_of_birth: string;
  passport_date_of_issue: string;
  passport_date_of_expire: string;
}
