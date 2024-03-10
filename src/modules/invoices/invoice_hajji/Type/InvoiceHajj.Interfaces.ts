import {
  IHotelInfo,
  ITransportInfo,
} from '../../../../common/types/Invoice.common.interface';
import { InvoiceMoneyReceiptType } from '../../../../common/types/common.types';

export interface BillingInformation {
  billing_id: number;
  is_deleted: number;
  billing_profit: number;
  billing_total_cost_price: number;
  billing_product_id: number;
  pax_name: string;
  billing_description: string;
  billing_quantity: number;
  billing_unit_price: number;
  billing_cost_price: number;
  billing_comvendor: string;
}

export interface IInvoiceHajjReq {
  invoice_sales_man_id: number;
  invoice_haji_group_id: number;
  invoice_no: string;
  invoice_sales_date: string;
  invoice_due_date: string;
  invoice_hajj_session: string;
  invoice_no_passenger: number;
  routeOrSector: number;
  invoice_sub_total: number;
  invoice_discount: number;
  invoice_service_charge: number;
  invoice_vat: number;
  hajj_total_pax?: number;
  invoice_net_total: number;
  invoice_combclient_id: string;
  invoice_agent_id: number;
  invoice_agent_com_amount: number;
  invoice_client_previous_due: number;
  invoice_note: string;
  invoice_reference: string;
  invoice_created_by: number;
  pilgrims_information: IHajiPilgrims[];
  hotel_information: Omit<
    IHotelInfo,
    'hotel_invoice_id' | 'hotel_created_by'
  >[];
  transport_info: ITransportInfo[];
  billing_information: BillingInformation[];
  invoice_hajj_routes?: number[];
  money_receipt: InvoiceMoneyReceiptType;
}

export interface IHajiPilgrims {
  haji_info_id: number;
  is_deleted: number;
  haji_info_passport_id: number;
  hajiinfo_tracking_number: string;
  hajiinfo_serial: string;
  hajiinfo_gender: string;
  ticket_route: number[];
  ticket_no: string;
  ticket_pnr: string;
  ticket_airline_id: number;
  ticket_reference_no: string;
  ticket_journey_date: string;
  ticket_return_date: string;
}

export interface IHajiPilgrimsDB
  extends Omit<IHajiPilgrims, 'ticket_route' | 'is_deleted' | 'haji_info_id'> {
  haji_info_invoice_id: number;
  haji_info_vouchar_no: string;
}

export interface IHajjRefundReqBody {
  comb_client: string;
  invoice_id: number;
  client_total_refund: number;
  client_refund_type: 'Adjust' | 'Return';
  vendor_total_refund: number;
  vendor_refund_type: 'Adjust' | 'Return';
  refund_date: string;
  created_by: number;
  client_payment_acc_id: number;
  client_payment_method: number;
  vendor_payment_acc_id: number;
  vendor_payment_method: number;
  billing_info: IHajjBilling[];
}

export interface IHajjBilling {
  billing_id: number;
  billing_unit_price: number;
  billing_cost_price: number;
  comb_vendor: string;
  refund_quantity: number;
  client_refund: number;
  vendor_refund: number;
  client_charge: number;
  vendor_charge: number;
}

export interface IHajjRefund {
  refund_org_agency: number;
  refund_voucher_no: string;
  refund_invoice_id: number;
  refund_client_id: number | null;
  refund_combine_id: number | null;
  refund_ctrxn_id: number | null;
  refund_client_total: number;
  refund_client_type: 'Adjust' | 'Return';
  refund_client_payment_method: number;
  refund_client_acc_id: number;
  refund_client_acc_trxn_id: number | null;
  refund_vendor_total: number;
  refund_vendor_type: 'Adjust' | 'Return';
  refund_vendor_payment_method: number;
  refund_vendor_acc_id: number;
  refund_vendor_acc_trxn_id: number | null;
  refund_date: string;
  refund_created_by: number;
}

export interface IHajjRefundItems {
  ritem_refund_id: number;
  ritem_billing_id: number;
  ritem_vendor_id: number | null;
  ritem_combine_id: number | null;
  ritem_vtrx_id: number | null;
  ritem_quantity: number;
  ritem_unit_price: number;
  ritem_client_charge: number;
  ritem_client_refund: number;
  ritem_cost_price: number;
  ritem_vendor_charge: number;
  ritem_vendor_refund: number;
}
