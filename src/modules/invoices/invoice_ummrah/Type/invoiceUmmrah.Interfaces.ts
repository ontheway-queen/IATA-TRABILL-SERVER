import { InvoiceMoneyReceiptType } from '../../../../common/types/common.types';
import { IHotelInfo } from '../../../../common/types/Invoice.common.interface';
import { BillingInformation } from '../../../invoices/invoice_hajji/Type/InvoiceHajj.Interfaces';

export interface PassengetInfo {
  passenger_id?: number;
  is_delete: number;
  passenger_passport_id: number;
  passenger_tracking_number: string;
  ticket_no: string;
  ticket_pnr: string;
  ticket_airline_id: number;
  ticket_reference_no: string;
  ticket_journey_date: string;
  ticket_return_date: string;
  ticket_route?: number[];
}

export interface TaxBreakdown {
  [key: string]: number;
}

export interface IInvoiceUmmrahReq {
  invoice_vat: number;
  invoice_agent_com_amount: number;
  invoice_agent_id: number;
  invoice_combclient_id: string;
  invoice_sales_man_id: number;
  invoice_haji_group_id: number;
  invoice_no: string;
  invoice_sales_date: string;
  invoice_due_date: string;
  invoice_no_passenger: number;
  routeOrSector: number;
  invoice_sub_total: number;
  invoice_discount: number;
  invoice_service_charge: number;
  invoice_net_total: number;
  invoice_client_previous_due: number;
  client_present_balance: number;
  invoice_note: string;
  invoice_created_by: number;
  invoice_reference: string;
  passenget_info: PassengetInfo[];
  hotel_information: Omit<IHotelInfo, 'hotel_invoice_id'>[];
  billing_information: BillingInformation[];
  money_receipt: InvoiceMoneyReceiptType;
}

export interface IUmmrahPassenger
  extends Omit<PassengetInfo, 'passenger_id' | 'is_delete'> {
  passenger_invoice_id: number;
}

export interface IUmmrahRefundReqBody {
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
  billing_info: IUmmrahBilling[];
}

export interface IUmmrahBilling {
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

export interface IUmmrahRefund {
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

export interface IUmmrahRefundItems {
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
