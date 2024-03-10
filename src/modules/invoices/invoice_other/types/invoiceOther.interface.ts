import {
  idType,
  InvoiceMoneyReceiptType,
  IPassportInvoice,
} from '../../../../common/types/common.types';
import {
  IHotelInfo,
  ITicketInfoReq,
} from '../../../../common/types/Invoice.common.interface';

export interface IOtherInvoicePass {
  other_pass_passport_id: number;
  other_pass_invoice_id: number;
}

// NEW TYPE ====================================

export interface IOtherHotelInformation {
  hotel_name: string;
  hotel_reference_no: string;
  hotel_check_out_date: string;
  hotel_check_in_date: string;
  hotel_room_type_id: number;
}

export interface IOtherTransportInformation {
  transport_id?: number;
  transport_type_id: number;
  transport_reference_no: string;
  transport_pickup_place: string;
  transport_pickup_time: string;
  transport_dropoff_place: string;
  transport_dropoff_time: string;
  transport_is_deleted?: 0 | 1;
}

export interface IOtherBillingInformation {
  billing_profit: number;
  billing_product_id: number;
  pax_name: string;
  billing_description: string;
  billing_quantity: number;
  billing_unit_price: number;
  billing_cost_price?: number;
  billing_comvendor: string;
  billing_id?: number;
  is_deleted?: 0 | 1;
}

export interface IOtherBillingInfoDb
  extends Omit<IOtherBillingInformation, 'billing_comvendor'> {
  billing_invoice_id: number;
  billing_remaining_quantity: number;
  billing_combined_id?: number | null;
  billing_vendor_id?: number | null;
  billing_sales_date: string;
  billing_subtotal: number;
  billing_vtrxn_id?: number | null;
}

export interface IOtherInvoiceReq {
  invoice_combclient_id: string;
  invoice_sales_man_id: number;
  invoice_no: string;
  invoice_sales_date: string;
  invoice_due_date: string;
  invoice_agent_id: number;
  passport_information: IPassportInvoice[];
  ticketInfo: ITicketInfoReq[];
  hotel_information: Omit<IHotelInfo, 'hotel_invoice_id'>[];
  transport_information: IOtherTransportInformation[];
  billing_information: IOtherBillingInformation[];
  money_receipt: InvoiceMoneyReceiptType;
  invoice_sub_total: number;
  invoice_discount: number;
  invoice_service_charge: number;
  invoice_vat: number;
  invoice_net_total: number;
  invoice_agent_com_amount: number;
  invoice_reference: string;
  invoice_note: string;
  invoice_created_by: number;
}

export interface IQuotationInvoiceReq
  extends Omit<
    IOtherInvoiceReq,
    | 'hotel_information'
    | 'ticketInfo'
    | 'transport_information'
    | 'passport_information'
  > {}
