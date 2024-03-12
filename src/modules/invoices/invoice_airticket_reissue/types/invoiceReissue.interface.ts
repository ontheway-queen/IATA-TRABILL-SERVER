import { InvoiceMoneyReceiptType } from '../../../../common/types/common.types';
import {
  IFlightDetail,
  InvoiceInfoType,
  IPaxPassport,
} from '../../invoice-air-ticket/types/invoiceAirticket.interface';

export interface IReissueTicketDetails {
  airticket_id?: number;
  airticket_ticket_no: string;
  airticket_client_price: number;
  airticket_purchase_price: number;
  airticket_comvendor: string;
  airticket_airline_id: number;
  airticket_extra_fee: number;
  airticket_issue_date: string;
  airticket_profit: number;
  airticket_route_or_sector: number[];
  airticket_pnr: string;
  airticket_journey_date: string;
  airticket_return_date: string;
  airticket_pax_name?: string;
  airticket_reissue_ticket_no?: string;
  airticket_classes: string;
  airticket_penalties?: number;
  airticket_commission_percent?: number;
  airticket_fare_difference?: number;
}

export interface IReissueTicketDetailsDb {
  airticket_client_id: number | null;
  airticket_combined_id: number | null;
  airticket_vendor_id: number | null;
  airticket_pnr?: string;
  airticket_pax_name?: string;
  airticket_vendor_combine_id: number | null;
  airticket_invoice_id: number;
  airticket_sales_date: string;
  airticket_profit: number;
  airticket_journey_date: string;
  airticket_return_date: string;
  airticket_purchase_price: number;
  airticket_client_price: number;
  airticket_ticket_no: string;
  airticket_vtrxn_id?: number | null;
  airticket_penalties: number;
  airticket_fare_difference: number;
  airticket_commission_percent: number;
  airticket_ait: string;
  airticket_issue_date: string;
  airticket_classes: string;
  airticket_existing_invoiceid: number;
  airticket_existing_airticket_id: number;
  airticket_after_reissue_client_price: number;
  airticket_after_reissue_purchase_price: number;
  airticket_after_reissue_profit: number;
  airticket_after_reissue_taxes: number;
  airticket_tax: number;
  airticket_extra_fee: number;
}

export interface ITicketInfo {
  ticket_details: IReissueTicketDetails;
  pax_passports: IPaxPassport[];
  flight_details: IFlightDetail[];
}

export interface InvoiceAirticketReissueReq {
  invoice_info: InvoiceInfoType;
  ticketInfo: ITicketInfo[];
  money_receipt: InvoiceMoneyReceiptType;
}

export interface IExistingReissueReq {
  invoice_combclient_id: string;
  invoice_sales_man_id: number;
  invoice_sales_date: string;
  invoice_due_date: string;
  airticket_ticket_no: string;
  airticket_penalties: number;
  airticket_fare_difference: number;
  airticket_commission_percent: number;
  airticket_ait: string;
  airticket_client_price: number;
  airticket_purchase_price: number;
  airticket_profit: number;
  airticket_issue_date: string;
  airticket_journey_date: string;
  airticket_return_date: string;
  airticket_classes: string;
  invoice_note: string;
  airticket_existing_airticket_id: number;
  airticket_existing_invoiceid: number;
  comb_vendor: string;
  invoice_no: string;
  airticket_tax: number;
  airticket_extra_fee: number;
}

export interface IReissueReturnBody {
  comb_client: string;
  invoice_id: number;
  ticket_info: IReissueRefundTicketInfo[];
  client_total_refund: number;
  vendor_refund_type: 'Adjust' | 'Return';
  total_vendor_refund: number;
  client_refund_type: 'Adjust' | 'Return';
  vendor_payment_method: number;
  vendor_payment_acc_id: number;
  client_payment_acc_id: number;
  client_payment_method: number;
  created_by: number;
  refund_date: string;
}

export interface IReissueRefundTicketInfo {
  airticket_id: number;
  airticket_client_price: number;
  airticket_purchase_price: number;
  comb_vendor: string;
  client_refund: number;
  vendor_refund: number;
  client_charge: number;
  vendor_charge: number;
}

export interface IReissueRefundDb {
  refund_org_agency: number;
  refund_client_id: number | null;
  refund_combined_id: number | null;
  refund_client_trx_id: number | null;
  refund_invoice_id: number;
  refund_client_total: number;
  refund_client_type: 'Adjust' | 'Return';
  refund_client_payment_method: number;
  refund_client_account_id: number;
  refund_client_account_trx_id: number | null;
  refund_vendor_total: number;
  refund_vendor_type: 'Adjust' | 'Return';
  refund_vendor_payment_method: number;
  refund_vendor_account_id: number;
  refund_vendor_account_trx_id: number | null;
  refund_created_by: number;
  refund_date: string;
  refund_voucher: string;
}
export interface IReissueRefundItemDb {
  ritem_refund_id: number;
  ritem_airticket_item_id: number;
  ritem_combined_id: number | null;
  ritem_vendor_id: number | null;
  ritem_vendor_trx_id: number | null;
  ritem_sales: number;
  ritem_client_charge: number;
  ritem_client_refund: number;
  ritem_purchase: number;
  ritem_vendor_charge: number;
  ritem_vendor_refund: number;
  ritem_is_deleted?: number;
}
