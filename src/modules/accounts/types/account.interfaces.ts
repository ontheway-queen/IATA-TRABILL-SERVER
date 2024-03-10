import { idType } from '../../../common/types/common.types';

export interface IAccountReqBody {
  account_acctype_id: number;
  account_name: string;
  account_number?: string;
  account_bank_name?: string;
  account_branch_name?: string;
  opening_balance: number;
  account_routing_no: string;
  account_created_by?: number;
  account_updated_by?: number;
}

export interface IUpdateAccountBalance {
  account_id: number;
  trxn_amount: number;
  trxn_type_id: number;
  trxn_data: string;
  trxn_type: 'DEBIT' | 'CREDIT';
  user_id: number;
}

export interface IAccounts {
  account_acctype_id: number;
  account_name: string;
  account_number?: string;
  account_bank_name?: string;
  account_branch_name?: string;
  account_created_by?: number;
  account_updated_by?: number;
  account_routing_no: string;
}

export interface IAccountsTransaction {
  actransaction_type: 'DEBIT' | 'CREDIT';
  actransaction_accounts_id: number;
  actransaction_transaction_type_id: number | undefined;
  actransaction_amount: number;
  actransaction_date?: string;
  actransaction_note?: string;
  actransaction_created_by: number;
}
export interface IOnlineTrxnCharge {
  charge_to_acc_id?: number;
  charge_from_acc_id?: number;
  charge_to_vendor_id?: number;
  charge_from_vendor_id?: number;
  charge_to_vcombined_id?: number;
  charge_from_vcombined_id?: number;
  charge_to_client_id?: number;
  charge_from_client_id?: number;
  charge_to_combined_id?: number;
  charge_from_ccombined_id?: number;
  charge_amount: number;
  charge_purpose: string;
  charge_note?: string;
}

export interface IAccountsLastBalance {
  accbalance_account_id: idType;
  accbalance_amount: number;
}

export interface IAccountOpeningBalanceReqBody {
  account_id: number;
  type_id: number;
  amount: number;
  date: string;
  note: string;
  account_created_by: number;
  transaction_type: 'DEBIT' | 'CREDIT';
}

export interface IClientOpeningBalanceReqBody {
  client_id: number;
  amount: number;
  date: string;
  transaction_created_by: number;
  opening_account_id?: number;
  transaction_type: 'DEBIT' | 'CREDIT';
  note: string;
}

export interface ICombineOpeningBalanceReqBody {
  combine_id: number;
  transaction_created_by: number;
  amount: number;
  date: string;
  note: string;
  transaction_type: 'DEBIT' | 'CREDIT';
}

export interface IVendorOpeningBalanceReqBody {
  vendor_id: number;
  amount: number;
  date: string;
  transaction_created_by: number;
  note: string;
  transaction_type: 'DEBIT' | 'CREDIT';
}

export interface IBalanceTransferReqBody {
  transfer_from_id: number;
  transfer_to_id: number;
  transfer_amount: number;
  transfer_created_by: number;
  transfer_charge?: number;
  transfer_date?: string;
  transfer_note?: string;
}

export interface IBalanceTransfer {
  btransfer_from_account_id: number;
  btransfer_to_account_id: number;
  btransfer_vouchar_no: string;
  btransfer_amount: number;
  btransfer_created_by: number;
  btransfer_charge?: number;
  btransfer_charge_id: number | null;
  btransfer_date: string;
  btransfer_note: string;
  btransfer_from_acc_trxn_id: number;
  btransfer_to_acc_trxn_id: number;
  btransfer_actransaction_id: number | null;
}

export interface IClientBillAdjustReqBody {
  bill_type: 'INCREASE' | 'DECREASE';
  bill_amount: number;
  bill_create_date?: string;
  bill_note?: string;
  bill_client_id: string;
  bill_created_by: number;
  bill_new_amount: number;
}

export interface IClientBillAdjust {
  cbilladjust_type: 'INCREASE' | 'DECREASE';
  cbilladjust_amount: number;
  cbilladjust_create_date?: string;
  cbilladjust_note?: string;
  cbilladjust_client_id: number | null;
  cbilladjust_combined_id: number | null;
  cbilladjust_ctrxn_id: number | null;
  cbilladjust_created_by: number;
  cbilladjust_vouchar_no?: string;
}

export interface IVendorBillAdjustReqBody {
  bill_type: 'INCREASE' | 'DECREASE';
  bill_amount: number;
  bill_create_date?: string;
  bill_note?: string;
  vendor_id: number;
  bill_created_by: number;
}

export interface IVendorBillAdjust {
  vbilladjust_type: 'INCREASE' | 'DECREASE';
  vbilladjust_amount: number;
  vbilladjust_create_date?: string;
  vbilladjust_note?: string;
  vbilladjust_vendor_id: number;
  vbilladjust_vtrxn_id?: number;
  vbilladjust_created_by: number;
  vbilladjust_vouchar_no?: string;
}

export interface INonInvoiceIncomeReqBody {
  company_id: number;
  type_id: number;
  account_id: number;
  noninvoice_created_by: number;
  cheque_no: string;
  receipt_no: string;
  amount: number;
  date: string;
  note: string;
}

export interface INonInvoiceIncome {
  nonincome_vouchar_no?: string;
  nonincome_actransaction_id: number;
  nonincome_amount: number;
  nonincome_company_id: number;
  nonincome_cheque_no: string;
  nonincome_created_by: number;
  nonincome_created_date: string;
  nonincome_receipt_no: string;
  nonincome_note: string;
}

export interface IInvestmentReqBody {
  company_id: number;
  type_id: number;
  account_id: number;
  investment_created_by: number;
  cheque_no: string;
  receipt_no: string;
  amount: number;
  date: string;
  note: string;
}

export interface IInvestments {
  investment_vouchar_no?: string;
  investment_actransaction_id: number;
  investment_company_id: number;
  investment_created_by?: number;
  investment_created_date?: string;
  investment_cheque_no: string;
  investment_receipt_no: string;
  investment_note: string;
}

export interface IIncentiveIncomeReqBody {
  vendor_id: number;
  comb_client: string;
  agent_id: number;
  adjust_with_bill: 'YES' | 'NO';
  type_id: number;
  account_id: number;
  amount: number;
  date: string;
  note: string;
  incentive_created_by: number;
}

export interface IVendorIncentiveIncomeReqBody
  extends Omit<IIncentiveIncomeReqBody, 'comb_client' | 'agent_id'> {}

export interface IIncentiveIncome {
  incentive_actransaction_id?: number;
  incentive_vendor_id: number;
  incentive_vtrxn_id?: number;
  incentive_adjust_bill: string;
  incentive_account_category_id?: number;
  incentive_account_id?: number;
  incentive_trnxtype_id: number;
  incentive_amount: number;
  incentive_note?: string;
  incentive_created_by: number;
  incentive_created_date?: string;
}

export interface IIncentiveIncomeDetails {
  incentive_vouchar_no?: string;
  incentive_actransaction_id?: number;
  incentive_trnxtype_id?: number;
  incentive_type: 'VENDOR' | 'COMB_CLIENT' | 'AGENT';
  incentive_client_id?: number;
  incentive_ctrxn_id?: number;
  incentive_vendor_id?: number;
  incentive_vtrxn_id?: number;
  incentive_combine_id?: number;
  incentive_agent_id?: number;
  incentive_agent_trxn_id?: number;
  incentive_adjust_bill?: 'YES' | 'NO';
  incentive_account_category_id: number;
  incentive_account_id: number;
  incentive_amount: number;
  incentive_date: string;
  incentive_note: string;
}

export interface SingleClientBill {
  cbilladjust_id: number;
  cbilladjust_client_id: number | null;
  cbilladjust_combined_id: number | null;
  client_name: string;
  cbilladjust_ctrxn_id: number;
  cbilladjust_vouchar_no: string;
  cbilladjust_type: 'INCREASE' | 'DECREASE';
  cbilladjust_amount: number;
  cbilladjust_note: string;
  cbilladjust_create_date: string;
  prevCombClient: string;
}

export interface SingleVendorBill {
  vbilladjust_id: number;
  vbilladjust_vendor_id: number;
  vendor_name: string;
  vbilladjust_vtrxn_id: number;
  vbilladjust_type: 'INCREASE' | 'DECREASE';
  vbilladjust_amount: string;
  vbilladjust_note: string;
  vbilladjust_create_date: string;
}

export interface IncentiveIncome {
  incentive_id: number;
  incentive_amount: string;
  incentive_vendor_id: number;
  incentive_adjust_bill: string;
  incentive_created_by: number;
  incentive_account_id: number;
  incentive_trnxtype_id: number;
  incentive_account_category_id: number;
  incentive_actransaction_id: number;
  incentive_vtrxn_id: number;
}

export interface ISingleBlTransfer {
  btransfer_amount: string;
  btransfer_from_account_id: number;
  btransfer_from_acc_trxn_id: number;
  btransfer_to_account_id: number;
  btransfer_to_acc_trxn_id: number;
  btransfer_charge?: number;
  user_full_name: string;
  btransfer_charge_id: number;
  btransfer_actransaction_id: number;
}

export interface IClientIncentiveIncomeReqBody
  extends Omit<IIncentiveIncomeReqBody, 'vendor_id' | 'agent_id'> {}

export interface IClientIncentiveIncome
  extends Omit<
    IIncentiveIncomeDetails,
    | 'incentive_vendor_id'
    | 'incentive_vtrxn_id'
    | 'incentive_agent_id'
    | 'incentive_agent_trxn_id'
  > {
  incentive_created_by: number;
}
export interface IVendorIncentiveIncome
  extends Omit<
    IIncentiveIncomeDetails,
    'incentive_combine_id' | 'incentive_agent_id' | 'incentive_agent_trxn_id'
  > {
  incentive_created_by: number;
}

export interface IOpeningBalance {
  op_amount: number;
  op_trxn_type: 'DEBIT' | 'CREDIT';
  op_acctype: 'ACCOUNT' | 'VENDOR' | 'COMBINED' | 'CLIENT';
  op_acc_id?: number;
  op_acctrxn_id?: number;
  op_cl_id?: number;
  op_cltrxn_id?: number;
  op_com_id?: number;
  op_comtrxn_id?: number;
  op_ven_id?: number;
  op_ventrxn_id?: number;
  op_note: string;
  op_date?: string;
}
