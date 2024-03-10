import { idType } from '../../../common/types/common.types';

// ============= common type ===============
type dateType = string;
type CRUD_BY = number;

export interface IAddVendorReqBody extends IVendors {
  dailCode: string;
  number: string;
  vendor_opening_balance: number;
  vendor_opening_balance_pay_type: 'Due' | 'Advance';
  opening_payment_type?: number;
  opening_account_id?: number;
  vendor_commission_rate: number;
  vendor_products_id: number[];
}

export interface IVPayPassport {
  vpaypass_id: number;
  vpaypass_vpay_id: number;
  vpaypass_passport_id: number;
}

export interface IVendors {
  vendor_name: string;
  vendor_email: string;
  vendor_mobile?: string;
  vendor_address: string;
  vendor_registration_date: dateType;
  vendor_created_by: CRUD_BY;
  vendor_fixed_advance: number;
  vendor_credit_limit: number;
  vendor_bank_guarantee: number;
  vendor_start_date: string;
  vendor_end_date: string;
}

export interface IVendorProduct {
  vproduct_vendor_id: number;
  vproduct_product_id: number;
  vproduct_commission_rate?: number;
}

export interface IVendorLastBalance {
  lbalance_vendor_id: number;
  lbalance_amount: number;
}

export interface IEditVendorReqBody extends IEditVendors {
  dailCode: string;
  vendor_opening_balance: number;
  vendor_opening_balance_pay_type: 'due' | 'advance';
  number: string;
  vendor_company: string;
  vendor_commission_rate: number;
  vendor_products_id: [];
  vendor_bank_guarantee: number;
  vendor_start_date: string;
  vendor_end_date: string;
}

export interface IEditVendors {
  vendor_name: string;
  vendor_email: string | null;
  vendor_mobile?: string | null;
  vendor_address: string;
  vendor_registration_date: dateType;
  vendor_updated_by: CRUD_BY;
  vendor_fixed_advance: number;
  vendor_credit_limit: number;
  vendor_bank_guarantee: number;
  vendor_start_date: string;
  vendor_end_date: string;
}

export interface IVendorPaymentPassport {
  vpaypass_vpay_id: number;
  vpaypass_passport_id: number;
}

export interface IAddVendorPayReqBody {
  account_id: number;
  created_by: CRUD_BY;
  cheque_no: number;
  has_refer_passport: 'YES' | 'NO';
  note: string;
  payment_date: dateType;
  payment_method_id: number;
  payment_amount: number;
  vpay_creadit_card_no: number;
  vpay_receipt?: number;
  updated_by: CRUD_BY;
  vpaypass_passport_id: number;
  vpcheque_withdraw_date: string;
  vpcheque_bank_name: string;
  online_charge: number;
  vendor_ait: number;
  invoice_id: number;
  vpay_payment_to: 'INVOICE' | 'VENDOR';
  com_vendor: string;
  specific_inv_vendors: specific_inv_vendors[];
}

export interface specific_inv_vendors {
  comb_vendor_specific_invoice: string;
  specific_inv_amount: number;
}

export interface IAddVendorPayment {
  vpay_payment_to: 'INVOICE' | 'VENDOR';
  vpay_account_id: number;
  vpay_acctrxn_id: number | null;
  vpay_invoice_id: number;
  created_by: CRUD_BY;
  has_refer_passport: 'YES' | 'NO';
  note: string;
  payment_amount: number;
  vpay_creadit_card_no: number;
  payment_date: dateType;
  payment_method_id: number;
  updated_by?: CRUD_BY;
  vouchar_no?: string;
  vpay_receipt_no?: idType;
  vendor_ait: number;
  online_charge: number;
  online_charge_id: number | null;
  vpay_vendor_id?: number | null;
  vpay_combined_id?: number | null;
  vpay_vtrxn_id?: number | null;
}

export interface IUpdateVendorPayment
  extends Omit<IAddVendorPayment, 'vpay_acctrxn_id'> {}

export interface IVpayChackDetails {
  vpcheque_id?: number;
  vpcheque_vpay_id: number;
  vpcheque_vendor_id: number | null;
  vpcheque_combined_id: number | null;
  vpcheque_cheque_no: number;
  vpcheque_bank_name: string;
  vpcheque_receipt_no?: number;
  vpcheque_amount: number;
  vpcheque_withdraw_date: dateType;
  vpcheque_return_note?: string;
}

// ================ advance return
export interface IVendorAdvanceReturn {
  advance_amount: string;
  account_id: number;
  cheque_no: number;
  comb_vendor: string;
  date: dateType;
  note: string;
  bank_name: string;
  advr_created_by: number;
  advr_payment_type: number;
  trans_no: number;
  transaction_charge: number;
  advr_updated_by?: number;
  advr_id?: number;
  vpcheque_withdraw_date: string;
}

export interface IAddvanceReturn {
  advr_id?: number;
  advr_vouchar_no: string;
  advr_vendor_id: number | null;
  advr_combined_id: number | null;
  advr_vtrxn_id: number | null;
  advr_actransaction_id: number | null;
  advr_amount: number;
  advr_payment_date: string;
  advr_note: string;
  advr_created_by: number;
  advr_payment_type: number;
  transaction_charge: number;
  transaction_charge_id: number | null;
  trans_no: number;
  advr_account_id?: number | null;
}

export interface IEditVendorAdvanceReturn
  extends Omit<IAddvanceReturn, 'advr_created_by' | 'advr_vouchar_no'> {
  advr_updated_by: number;
}

export interface IAdvanceReturnCheque {
  cheque_advr_id: number;
  cheque_vendor_id: number;
  cheque_number: number;
  cheque_return_note: string;
  cheque_bank_name: string;
  cheque_deposit_date?: string;
  cheque_withdraw_date?: string;
  cheque_status: 'PENDING';
}

export interface getVedorInvoicePayment {
  vpay_id: number;
  vouchar_no: string;
  vendor_name: string;
  payment_amount: number;
  account_name: string;
  vpay_creadit_card_no: number;
  online_charge: number;
  vendor_ait: number;
  payment_date: string;
  note: string;
}
