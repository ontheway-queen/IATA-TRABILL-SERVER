import {
  InvoiceMoneyReceiptType,
  idType,
} from '../../../../common/types/common.types';

export interface IInvoiceTourItem {
  itour_invoice_id: number;
  itour_group_id: number;
  itour_day: number;
  itour_night: number;
  itour_from_date: string;
  itour_to_date: string;
}

export interface ITourBilling {
  billing_id?: number;
  billing_cost_price: number;
  billing_product_id: number;
  billing_profit?: number;
  billing_pax_name: string;
  billing_country_id: number;
  billing_numof_room: number;
  billing_total_pax: number;
  billing_total_sales: number;
  billing_invoice_id: number;
  is_deleted?: number;
}

export interface ICommonBillingType {
  vendor_id: number;
  combined_id: number;
  prevTrxnId: number;
  prevCombvendor: string;
  prev_cost_price: number;
}

export interface ITourTransport {
  transport_id?: number;
  transport_itinerary_id: number;
  transport_description: string;
  transport_cost_price: number;
  transport_invoice_id: number;
  transport_comvendor_id: string;
  transport_type_id: idType;
  transport_picup_place: string;
  transport_picup_time: string;
  transport_dropoff_place: string;
  transport_dropoff_time: string;
  transport_is_deleted?: 0 | 1;
}

export interface ITourTransDB
  extends Omit<ITourTransport, 'transport_comvendor_id'> {
  transport_vendor_id: number | null;
  transport_combined_id: number | null;
  transport_vtrxnid?: number | null;
}

export interface ITourFood {
  food_id?: number;
  food_itinerary_id: number;
  food_description: string;
  food_cost_price: number;
  food_comvendor_id: string;
  food_menu: string;
  food_place: string;
  food_time: string;
  food_is_deleted?: 0 | 1;
}

export interface ITourFoodDB extends Omit<ITourFood, 'food_comvendor_id'> {
  food_invoice_id: number;
  food_vendor_id: number | null;
  food_combined_id: number | null;
  food_vtrxnid?: number | null;
}

export interface ITourAccm {
  accm_id?: number;
  accm_itinerary_id: number;
  accm_description: string;
  accm_cost_price: number;
  accm_comvendor_id: string;
  accm_room_type_id: number;
  accm_place: string;
  accm_num_of_room: number;
  accm_checkin_date: Date;
  accm_checkout_date: Date;
  accm_is_deleted?: 0 | 1;
}

export interface ITourAccmDB extends Omit<ITourAccm, 'accm_comvendor_id'> {
  accm_invoice_id: number;
  accm_vendor_id: number | null;
  accm_combined_id: number | null;
  accm_vtrxnid?: number | null;
}

export interface ITourOtherTran {
  other_trans_id?: number;
  other_trans_itinerary_id: number;
  other_trans_description: string;
  other_trans_cost_price: number;
  other_trans_comvendor_id: string;
  other_trans_is_deleted?: 0 | 1;
}

export interface ITourOtherTranDB
  extends Omit<ITourOtherTran, 'other_trans_comvendor_id'> {
  other_trans_invoice_id: number;
  other_trans_vendor_id: number | null;
  other_trans_combined_id: number | null;
  other_trans_vtrxnid?: number | null;
}

export interface ITourGuide {
  guide_id?: number;
  guide_itinerary_id: number;
  guide_comvendor_id: string;
  guide_cost_price: number;
  guide_description: string;
  guide_is_deleted?: number;
}

export interface ITourGuideDB extends Omit<ITourGuide, 'guide_comvendor_id'> {
  guide_invoice_id: number;
  guide_vendor_id: number | null;
  guide_combined_id: number | null;
  guide_vtrxnid?: number | null;
}

export interface ITourTicket {
  ticket_itinerary_id: number;
  ticket_comvendor_id: string;
  ticket_cost_price: number;
  ticket_description: string;
}
export interface ITourTicketDB
  extends Omit<ITourTicket, 'ticket_comvendor_id'> {
  ticket_invoice_id: number;
  ticket_vendor_id: number | null;
  ticket_airline_id: number;
  ticket_combined_id: number | null;
  ticket_vtrxnid?: number | null;

  ticket_no: string;
  ticket_route?: number[];
  ticket_pnr: string;
  ticket_journey_date: Date;
  ticket_return_date: Date;
}

export interface ITourRequest extends ITourTicket, ITourGuide {
  invoice_combclient_id: string;
  invoice_sales_man_id: number;
  invoice_sales_date: string;
  invoice_due_date: string;
  invoice_no: string;
  itour_group_id: number;
  itour_day: number;
  itour_night: number;
  invoice_agent_id: number;
  invoice_sub_total: number;
  invoice_discount: number;
  invoice_service_charge: number;
  invoice_vat: number;
  invoice_net_total: number;
  invoice_agent_com_amount: number;
  invoice_client_previous_due: number;
  client_present_balance: number;
  invoice_note: string;
  invoice_created_by: number;
  invoice_reference: string;
  itour_from_date: string;
  itour_to_date: string;

  ticket_id?: number;
  ticket_no: string;
  ticket_route: number[];
  ticket_airline_id: number;
  ticket_pnr: string;
  ticket_journey_date: Date;
  ticket_return_date: Date;
  ticket_is_deleted?: 0 | 1;

  tourBilling: ITourBilling[];
  tourTransports: ITourTransport[];
  tourFoods: ITourFood[];
  tourAccms: ITourAccm[];
  tourOtherTrans: ITourOtherTran[];
  money_receipt: InvoiceMoneyReceiptType;
}

export interface IAirticketroute {
  airoute_invoice_id: number;
  airoute_airticket_id?: number;
  airoute_route_sector_id: number;
}
