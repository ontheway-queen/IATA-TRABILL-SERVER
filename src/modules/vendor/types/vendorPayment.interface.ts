import { TChequeStatus } from '../../cheques/types/cheques.interface';

export interface IVPayStatusUpdate {
  vpcheque_return_note?: string;
  vpcheque_return_date?: string;
  vpcheque_status: TChequeStatus;

  vpcheque_bounce_note?: string;
  vpcheque_bounce_date?: string;

  vpcheque_deposit_note?: string;
  vpcheque_deposit_date?: string;
}

export interface IInvoiceVendorPayment {
  invendorpay_vpay_id: number;
  invendorpay_invoice_id: number;
  invendorpay_vendor_id: number | null;
  invendorpay_vtrxn_id: number;
  invendorpay_combined_id: number | null;
  invendorpay_amount: number;
  invendorpay_created_by: number;
}
