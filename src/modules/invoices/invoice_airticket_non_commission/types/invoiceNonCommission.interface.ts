import { InvoiceMoneyReceiptType } from '../../../../common/types/common.types';
import {
  IFlightDetail,
  InvoiceInfoType,
  IPaxPassport,
} from '../../invoice-air-ticket/types/invoiceAirticket.interface';

export interface INonComTicketDetails {
  airticket_id?: number;
  airticket_ticket_no: string;
  airticket_client_price: number;
  airticket_purchase_price: number;
  airticket_comvendor: string;
  airticket_airline_id: number;
  airticket_extra_fee: number;
  airticket_route_or_sector: number[];
  airticket_pnr: string;
  airticket_issue_date: string;
  airticket_journey_date: string;
  airticket_return_date: string;
  airticket_profit: number;
  airticket_classes: string;
}

export interface INonComTicketDetailsDb
  extends Omit<
    INonComTicketDetails,
    'airticket_route_or_sector' | 'airticket_comvendor'
  > {
  airticket_invoice_id: number;
  airticket_client_id: number | null;
  airticket_combined_id: number | null;
  airticket_vendor_id: number | null;
  airticket_vendor_combine_id: number | null;
  airticket_sales_date: string;
  airticket_vtrxn_id: number | null;
}

export interface TicketInfo {
  ticket_details: INonComTicketDetails;
  pax_passports: IPaxPassport[];
  flight_details: IFlightDetail[];
}

export interface InvoiceNonComReq {
  invoice_info: InvoiceInfoType;
  ticketInfo: TicketInfo[];
  money_receipt: InvoiceMoneyReceiptType;
}
