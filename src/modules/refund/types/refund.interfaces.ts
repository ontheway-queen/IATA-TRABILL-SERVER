export interface IAirTicketRefundReqBody {
  invoice_id: number;
  comb_client: string;
  created_by: number;
  date: string;
  profit: number;
  client_refund_info: IClientRefundInfo;
  vendor_refund_info: IVendorRefundReq[];
  note: string;
}

type paymentType = 'MONEY_RETURN' | 'ADJUST';

export interface IClientRefundInfo {
  crefund_payment_type: paymentType;
  crefund_total_amount: number;
  crefund_charge_amount: number;
  crefund_return_amount: number;
  payment_method: number;
  crefund_account_id: number;
  crefund_note: string;
  trxn_charge_amount: number;
  withdraw_date: string;
}

export interface IAirticketClientRefund {
  crefund_client_id: number | null;
  crefund_combined_id: number | null;
  crefund_ctrxnid: number | null;
  crefund_charge_ctrxnid: number | null;
  crefund_refund_id: number;
  crefund_total_amount: number;
  crefund_charge_amount: number;
  crefund_profit?: number;
  crefund_return_amount: number;
  crefund_date: string;
  crefund_payment_type: paymentType;
  crefund_account_id: number;
  crefund_actransaction_id: number | null;
}

export interface IVendorRefundReq {
  vrefund_account_id: number;
  payment_method: number;
  trxn_charge_amount: number;
  invoice_category_id: number;
  airticket_ticket_no: string;
  airticket_id: number;
  airticket_combvendor: string;
  vrefund_total_amount: number;
  vrefund_charge_amount: number;
  vrefund_return_amount: number;
  vrefund_payment_type: paymentType;
  withdraw_date: string;
  vrefund_note: string;
}

export interface IVendorRefundInfo {
  vrefund_payment_type: paymentType;
  vrefund_refund_id: number;
  vrefund_airticket_id: number;
  vrefund_category_id: number;
  vrefund_vendor_id: number | null;
  vrefund_vendor_combined_id: number | null;
  vrefund_vtrxn_id: number | null;
  vrefund_charge_vtrxn_id: number | null;
  vrefund_total_amount: number;
  vrefund_charge_amount: number;
  vrefund_return_amount: number;
  vrefund_date: string;
  vrefund_created_by: number;
  vrefund_account_id: number;
  vrefund_acctrxn_id: number | null;
}

export interface IAirTicketRefund {
  atrefund_vouchar_number: string;
  atrefund_invoice_id: number;
  atrefund_client_id: number | null;
  atrefund_combined_id: number | null;
  atrefund_created_by: number;
  atrefund_date: string;
  atrefund_trxn_charge: number;
  atrefund_trxn_charge_id: number | null;
  atrefund_note: string;
}

export interface IGetCleintRefund {
  comb_client: string;
  crefund_total_amount: string;
  crefund_charge_amount: string;
  crefund_return_amount: string;
  crefund_date: string;
  crefund_payment_type: 'ADJUST' | 'MONEY_RETURN';
  crefund_moneyreturn_type: 1 | 2 | 3 | 4 | null;
  crefund_account_id: number | null;
  crefund_actransaction_id: number | null;
  crefund_charge_ctrxnid: number | null;
  crefund_ctrxnid: number | null;
}

export interface IGetVendorRefund {
  comb_vendor: string;
  vrefund_vtrxn_id: number;
  vrefund_invoice_id: number;
  vrefund_charge_vtrxn_id: number;
  vrefund_account_id: number;
  vrefund_acctrxn_id: number;
  vrefund_total_amount: number;
  vrefund_charge_amount: number;
  vrefund_return_amount: number;
  vrefund_payment_type: 'ADJUST' | 'MONEY_RETURN';
  vrefund_moneyreturn_type: 1 | 2 | 3 | 4;
}

export interface IClientRefundReqBody {
  client_id: string;
  total_refund_amount: number;
  total_refund_charge: number;
  total_return_amount: number;
  return_amount?: number;
  crefund_payment_type: 'MONEY_RETURN' | 'ADJUST';
  account_id?: number;
  cheque_no?: string;
  payment_type_id: number;
  trxn_charge_amount: number;
  crefund_date: string;
  bank_name?: string;
  withdraw_date?: string;
}

export interface IVendorRefundReqBody {
  date: string;
  account_id?: number;
  cheque_no?: string;
  bank_name?: string;
  withdraw_date?: string;
  vrefund_bill_id: number;
  comb_vendor_id: string;
  vrefund_product_id: number;
  vrefund_quantity: number;
  billing_remaining_quantity: number;
  vrefund_charge: number;
  vendor_type: string;
  payment_method: number;
  trxn_charge_amount: number;
  vrefund_account_id?: number;
  vrefund_amount: number;
  vrefund_return_amount: number;
  vrefund_vouchar_number: number;
  vrefund_payment_type: 'MONEY_RETURN' | 'ADJUST';
  vrefund_invoice_category_id: number;
  vrefund_date: string;
}

export interface IOtherRefundReqBody {
  comb_client: string;
  created_by: number;
  invoice_id: number;
  date: string;
  note: string;
  client_refund_info: IClientRefundReqBody;
  vendor_refund_info: IVendorRefundReqBody[];
}

export interface ITourClientRefundReqBody {
  payment_method: number;
  trxn_charge_amount: number;
  crefund_total_amount: number;
  crefund_charge_amount: number;
  crefund_account_id: number;
  crefund_return_amount: number;
  crefund_payment_type: 'MONEY_RETURN' | 'ADJUST';
  money_return_type?: number;
  account_id?: number;
  cheque_no?: string;
  date: string;
  bank_name?: string;
  withdraw_date?: string;
}

export interface IRefundTourPack {
  refund_invoice_id: number;
  refund_vouchar_number: string;
  refund_created_by: number;
  refund_note: string;
  refund_date: string;
  refund_charge_amount: number;
  refund_charge_id: number | null;
}

export interface IPersialRefundReqBody {
  vendor_refund_info: IPershialRefundVendorReqInfo[];
  invoice_id: number;
  created_by: number;
  date: string;
  note: string;
  comb_client: string;
  prfnd_total_amount: number;
  prfnd_charge_amount: number;
  prfnd_profit_amount: number;
  prfnd_return_amount: number;
  prfnd_payment_type: 'MONEY_RETURN' | 'ADJUST';
  prfnd_payment_method: 1 | 2 | 3 | 4;
  prfnd_account_id: number;
}

export interface IPershialRefund {
  prfnd_invoice_id: number;
  prfnd_vouchar_number: string;
  prfnd_note: string;
  prfnd_date: string;
  prfnd_client_id: number;
  prfnd_combine_id: number;
  prfnd_trxn_id: number | null;
  prfnd_charge_trxn_id: number | null;
  prfnd_account_id: number;
  prfnd_actrxn_id: number | null;
  prfnd_payment_type: 'MONEY_RETURN' | 'ADJUST';
  prfnd_total_amount: number;
  prfnd_charge_amount: number;
  prfnd_return_amount: number;
  prfnd_profit_amount: number;
  prfnd_created_by: number;
  prfnd_payment_method: number;
}

export interface IpersialRefundVendorInfo {
  vprfnd_refund_id: number;
  vprfnd_airticket_id: number;
  vprfnd_vendor_id: number;
  vprfnd_combine_id: number;
  vprfnd_trxn_id: number;
  vprfnd_charge_trxn_id: number | null;
  vprfnd_account_id: number;
  vprfnd_actrxn_id: number;
  vprfnd_payment_type: 'MONEY_RETURN' | 'ADJUST';
  vprfnd_total_amount: number;
  vprfnd_charge_amount: number;
  vprfnd_return_amount: number;
  vprfnd_payment_method: number;
}

export interface IPershialRefundVendorReqInfo {
  vprfnd_airticket_id: number;
  comb_vendor: string;
  vprfnd_account_id: number;
  vprfnd_payment_type: 'MONEY_RETURN' | 'ADJUST';
  vprfnd_total_amount: number;
  vprfnd_charge_amount: number;
  vprfnd_return_amount: number;
  vprfnd_payment_method: 1 | 2 | 3 | 4;
}

export interface TourRefundGeneric {
  comb_vendor_id: string;
  vrefund_account_id: number;
  vrefund_return_amount: number;
  vrefund_charge_amount: number;
  vrefund_total_amount: number;
  vrefund_payment_type: 'ADJUST' | 'MONEY_RETURN';
  vrefund_moneyreturn_type?: 1 | 2 | 3 | 4;
  trxn_charge_amount: number;
  bank_name: string;
  cheque_no: string;
  withdraw_date: string;
  date: string;
}

export type Itineraries =
  | 'accm'
  | 'food'
  | 'guide'
  | 'other_trans'
  | 'ticket'
  | 'transport';

export interface ITourRefundReqBody {
  comb_client: string;
  created_by: number;
  invoice_id: number;
  invoice_category_id: number;
  voucher_no: string;
  note: string;
  date: string;
  client_refund_info: ITourClientRefundReqBody;
  itineraries: [Itineraries, TourRefundGeneric[]][];
}

export interface IRefundOther {
  refund_invoice_id: number;
  refund_client_id?: number;
  refund_combined_id?: number;
  refund_vouchar_number: string;
  refund_created_by: number;
  refund_status: number;
  refund_date: string;
  refund_note: string;
  refund_charge_amount: number;
  refund_charge_id: number | null;
}

export interface IRefundOtherClient {
  crefund_refund_id: number;
  crefund_invoice_id: number;
  crefund_client_id?: number;
  crefund_combined_id?: number;
  crefund_charge_amount: number;
  crefund_account_id: number;
  crefund_actransaction_id: number;
  crefund_ctrxnid?: number;
  crefund_charge_ctrxnid: number | null;
  crefund_total_amount: number;
  crefund_return_amount: number;
  crefund_vouchar_number: string;
  crefund_payment_type: 'ADJUST' | 'MONEY_RETURN';
  crefund_moneyreturn_type?: number;
  crefund_moneyreturn_account_id?: number;
  crefund_date: string;
}

export interface IRefundOtherVendor {
  vrefund_cheque_id?: number;
  vrefund_refund_id: number;
  vrefund_vtrxn_id: number;
  vrefund_charge_vtrxn_id?: number;
  vrefund_acctrxn_id: number;
  vrefund_invoice_id: number;
  vrefund_vendor_id?: number;
  vrefund_vendor_combined_id?: number;
  vrefund_product_id: number;
  vrefund_quantity: number;
  vrefund_charge: number;
  vendor_type?: string;
  payment_method?: number;
  vrefund_account_id?: number;
  vrefund_amount: number;
  vrefund_return_amount: number;
  vrefund_client_refund_amount: number;
  vrefund_client_refund_charge: number;
  vrefund_vouchar_number: string;
  vrefund_payment_type: 'ADJUST' | 'MONEY_RETURN';
  vrefund_moneyreturn_type?: number;
  vrefund_moneyreturn_account_id?: number;
  vrefund_bill_id: number;
  vrefund_invoice_category_id: number;
  vrefund_date: string;
}

export interface otherVendorRefundInfo {
  comb_vendor: string;
  vrefund_invoice_id: number;
  vrefund_amount: number;
  vrefund_charge: number;
  vrefund_return_amount: number;
  vrefund_payment_type: 'ADJUST' | 'MONEY_RECEIPT';
  vrefund_account_id: number;
  vrefund_acctrxn_id: number;
  vrefund_vtrxn_id: number;
  vrefund_charge_vtrxn_id: number;
}

export interface IRefundTourClient {
  crefund_refund_id: number;
  crefund_invoice_id: number;
  crefund_client_id?: number;
  crefund_combined_id?: number;
  crefund_charge_amount: number;
  crefund_ctrxnid?: number;
  crefund_charge_ctrxnid?: number;
  crefund_total_amount: number;
  crefund_return_amount: number;
  crefund_vouchar_number: string;
  crefund_payment_type: 'ADJUST' | 'MONEY_RETURN';
  crefund_moneyreturn_type?: number;
  crefund_account_id: number;
  crefund_actransaction_id: number;
  crefund_date: string;
}

export interface IRefundTourVendor {
  vrefund_refund_id: number;
  vrefund_invoice_id: number;
  vrefund_vendor_id: number;
  vrefund_vendor_combined_id: number;
  vrefund_trxn_type: Itineraries;
  vrefund_vtrxn_id: number;
  vrefund_charge_vtrxn_id: number;
  vrefund_account_id: number;
  vrefund_acctrxn_id: number;
  vrefund_total_amount: number;
  vrefund_charge_amount: number;
  vrefund_return_amount: number;
  vrefund_vouchar_number: string;
  vrefund_payment_type: 'ADJUST' | 'MONEY_RETURN';
  vrefund_moneyreturn_type?: number;
  vrefund_actransaction_id?: number;
  vrefund_cheque_id?: number;
  vrefund_ctrxn_id?: number;
  vrefund_created_by: number;
  vrefund_status?: number;
}
