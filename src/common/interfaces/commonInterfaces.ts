import AccountsModel from '../../modules/accounts/models/accounts.models';
import AgentProfileModels from '../../modules/clients/agents_profile/Models/agent_profile.models';
import ClientModel from '../../modules/clients/client/models/client.models';
import CombineClientsModels from '../../modules/clients/combined_clients/models/combineClients.models';
import VendorModel from '../../modules/vendor/models/VendorModel';
import { idType } from '../types/common.types';

export type TLedgerTypes =
  | 'INVOICE'
  | 'MONEY_RECEIPT'
  | 'CLIENT_BILL_ADJUSTMENT'
  | 'AIRTICKET_REFUND'
  | 'OTHER_REFUND'
  | 'TOUR_REFUND'
  | 'ADVANCE_RETURN'
  | 'BILL_ADJUSTMENT'
  | 'OPENING_BALANCE'
  | 'VENDOR_PAYMENT'
  | 'AIRTICKET_HALF_REFUND'
  | 'VENDOR_BILL_ADJUSTMENT'
  | 'INVOICE_COST'
  | 'PERSIAL_REFUND';

export interface ICreateUpdateVendorTrxn {
  vendor_conn: VendorModel;
  combined_conn: CombineClientsModels;
  comb_vendor: string;
  trxn_amount: number;
  trxn_type: 'DEBIT' | 'CREDIT';
  vtrxn_trnxtype_id: number;
  vtrxn_ledger_type: TLedgerTypes;
  user_id: number;
  prev_trxn_id?: number;
  prev_comb_vendor?: string;
  vtrxn_date: string;
  note?: string;
}
export interface IClientTrxnHelpers {
  client_conn: ClientModel;
  combined_conn: CombineClientsModels;
  comb_client: string;
  trxn_amount: number;
  trxn_type: 'DEBIT' | 'CREDIT';
  trxn_ledger_type: TLedgerTypes;
  user_id: number;
  trxn_trnxtype_id: number;
  ctrxn_payment_date?: string;
  note?: any;
}
export interface IClientTrxnHelpersEdit extends IClientTrxnHelpers {
  prev_trxn_id: number;
  prev_comb_client: string;
}
export interface IAgentTrxnHelpers {
  agent_conn: AgentProfileModels;
  agent_id: number;
  trxn_amount: number;
  trxn_type: 'DEBIT' | 'CREDIT';
  trxn_ledger_type: TLedgerTypes;
  user_id: number;
  trxn_particular?: string;
  trxn_trnxtype_id?: number;
  prev_trxn_id?: number;
  prev_agent_id?: string;
}
export interface IAccountTrxnHelpers {
  account_conn: AccountsModel;
  account_id: number;
  trxn_amount: number;
  trxn_type: 'DEBIT' | 'CREDIT';
  trxn_trnxtype_id: number;
  user_id: number;
  prev_trxn_id?: number;
  prev_account_id?: number;
  actransaction_date?: string;
  note?: any;
}

export interface IVendorTransactions {
  vtrxn_type: 'DEBIT' | 'CREDIT';
  vtrxn_vendor_id: idType;
  vtrxn_trnxtype_id: number;
  vtrxn_amount: number;
  opening_balance_type?: 'ADVANCE' | 'DUE';
  vtrxn_note?: string;
  vtrxn_created_by: number;
  vtrxn_ledger_type: TLedgerTypes;
  vtrxn_date?: string;
}
export interface IUpdateVendorTransactions {
  vtrxn_type?: 'DEBIT' | 'CREDIT';
  vtrxn_vendor_id?: idType;
  vtrxn_trnxtype_id?: number;
  vtrxn_amount: number;
  opening_balance_type?: 'ADVANCE' | 'DUE';
  vtrxn_note?: string;
  vtrxn_created_by: number;
  vtrxn_ledger_type?: TLedgerTypes;
  vtrxn_date?: string;
}

export interface IDeletePreviousVendor {
  vendor_id: number | null;
  combined_id: number | null;
  prev_cost_price?: number;
  prevTrxnId: number;
  prevComvendor?: string;
}

export interface IVendorLastBalance {
  lbalance_vendor_id: number;
  lbalance_amount: number;
}

export interface IVendorsOpeningBalance {
  opening_vendor_id: number;
  opening_balance_type: 'ADVANCE' | 'DUE';
  opening_amount: number;
  opening_created_by: number;
}

export interface IEditAdvanceReturn {
  cheque_bank_name?: string;
  cheque_status?: string;

  cheque_deposit_date?: string;
  cheque_deposit_note?: string;

  cheque_bounce_date?: string;
  cheque_bounce_note?: string;

  cheque_return_date?: string;
  cheque_return_note?: string;
}

export interface IAddvanceReturnCheque extends IEditAdvanceReturn {
  cheque_advr_id: number;
  cheque_vendor_id: number;
  cheque_number: number;
  cheque_withdraw_date: string;
  cheque_return_date: string;
}

export interface IInvoiceVoidDetails {
  void_invoice_id: number;
  void_client_id: number;
  void_combine_id: number;
  void_charge_ctrxn_id: number;
  void_vendor_id: number;
  void_vendor_combine_id: number;
  void_charge_vtrxn_id: number;
  void_client_charge: number;
  void_vendor_charge: number;
}
