import { idType } from './common.types';

export interface IInvoiceInfoReq {
  invoice_combclient_id: string;
  invoice_created_by: number;
  invoice_haji_group_id?: number;
  invoice_net_total: number;
  invoice_no: string;
  invoice_note: string;
  invoice_sales_man_id: number;
  invoice_sales_date: string;
  invoice_due_date: string;
  invoice_sub_total: number;
  invoice_total_profit?: number;
  invoice_total_vendor_price?: number;
  invoice_hajj_session?: string;
  invoice_vat?: number;
  invoice_agent_id: number;
  invoice_agent_com_amount: number;
  invoice_service_charge?: number;
  invoice_discount?: number;
  invoice_show_prev_due?: 0 | 1;
  invoice_show_passport_details?: 0 | 1;
  invoice_reference: string;
}

export interface IInvoiceVisaReq
  extends Omit<IInvoiceInfoReq, 'invoice_created_by'> { }

export interface IExistingInvoiceEdit {
  invoice_client_id?: number;
  invoice_sales_date: string;
  invoice_sales_man_id: idType;
  invoice_sub_total: number;
  invoice_net_total: number;
  invoice_note?: string;
  invoice_updated_by?: number;
}

export interface IInvoiceInfoDb {
  invoice_note: string;
  invoice_no: string;
  invoice_sales_date: string;
  invoice_due_date: string;
  invoice_client_id: number | null;
  invoice_combined_id: number | null;
  invoice_sales_man_id: number;
  invoice_sub_total: number;
  invoice_net_total: number;
  invoice_client_previous_due?: number;
  invoice_created_by: number;
  invoice_total_profit?: number;
  invoice_category_id: number;
  invoice_reissue_client_type?: 'NEW' | 'EXISTING';
  invoice_hajj_session?: string | number;
  invoice_haji_group_id?: number;
  invoice_total_vendor_price?: number;
  invoice_cltrxn_id: number | null;
  invoice_walking_customer_name?: string;
  invoice_reference?: string;

}

export interface IUpdateInvoiceInfoDb
  extends Omit<
    IInvoiceInfoDb,
    | 'invoice_created_by'
    | 'invoice_category_id'
    | 'invoice_reissue_client_type'
    | 'invoice_no'
    | 'invoice_cltrxn_id'
  > {
  invoice_updated_by: number;
}

export interface InvoicePasDetails {
  invpassport_invoice_id: idType;
  invpassport_client_id: idType;
  invpassport_airticket_id?: idType;
  invpassport_visiting_country?: idType;
}

export interface ITicketInfoReq {
  ticket_no: string;
  ticket_pnr: string;
  ticket_airline_id: number;
  ticket_reference_no: string;
  ticket_journey_date: string;
  ticket_return_date?: string;
  ticket_id?: number;
  ticket_route: string;
  ticket_is_deleted?: 0 | 1;
}

export interface ITicketInfo extends Omit<ITicketInfoReq, 'ticket_route'> {
  ticket_invoice_id: number;
  ticket_route: string;
}

export interface IHotelInfo {
  hotel_id: number;
  is_deleted: number;
  hotel_name: string;
  hotel_check_in_date: string;
  hotel_check_out_date: string;
  hotel_room_type_id: idType;
  hotel_reference_no: string;
}

export interface IHotelInfoDB
  extends Omit<IHotelInfo, 'hotel_id' | 'is_deleted'> {
  hotel_invoice_id: idType;
}

export interface ITransportInfo {
  transport_id?: number;
  is_deleted?: number;
  transport_type_id: number;
  transport_pickup_place: string;
  transport_pickup_time: string;
  transport_dropoff_place: string;
  transport_dropoff_time: string;
  transport_reference_no: string;
  transport_other_invoice_id?: number;
}
export interface ITransportInfoDB
  extends Omit<ITransportInfo, 'transport_reference_no'> {
  transport_invoice_id: number;
}

export interface IOtherInvoiceLogs {
  log_invoice_id: number;
  log_content: string;
  log_status: 'UPDATED' | 'CREATED' | 'DELETED' | 'RESTORED';
  log_created_by: number;
}

export interface InvoiceExtraAmount {
  extra_amount_invoice_id: number;
  invoice_vat?: number;
  invoice_service_charge?: number;
  invoice_discount?: number;
  invoice_agent_id?: number;
  invoice_agent_com_amount?: number;
  hajj_total_pax?: number;
}

export interface IInvoiceVoidInfo {
  invoice_id: number;
  invoice_org_agency: number;
  invoice_client_id: number;
  invoice_combined_id: number;
  invoice_cltrxn_id: number;
  invoice_reissue_client_type: string;
  invoice_no: string;
  invoice_hajj_session: string;
  invoice_sales_man_id: number;
  invoice_category_id: number;
  invoice_sub_total: string;
  invoice_net_total: string;
  invoice_client_previous_due: string;
  invoice_total_profit: string;
  invoice_total_vendor_price: string;
  invoice_sales_date: string;
  invoice_haji_group_id: string;
  invoice_note: string;
  invoice_created_by: string;
  invoice_create_date: string;
}
