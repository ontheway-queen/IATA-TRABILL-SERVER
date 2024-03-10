import { TLedgerTypes } from '../../../../common/interfaces/commonInterfaces';
import { idType } from '../../../../common/types/common.types';

export interface ICombineClientsCreateReqBody {
  combine_category_id: number;
  combine_name: string;
  combine_company_name: string;
  combine_gender: string;
  combine_email: string;
  combine_designation?: string;
  combine_mobile: string;
  combine_address: string;
  combine_opening_balance: number;
  combine_balance_type?: string;
  opening_balance_type?: 'due' | 'advance';
  combine_create_by?: number;
  combine_client_status?: number;
  combine_commission_rate: number;
  cproduct_product_id?: number[];
  combine_credit_limit?: number;
}
export interface ICombineClientsEditReqBody
  extends Omit<ICombineClientsCreateReqBody, 'combine_create_by'> {
  combine_update_by: number;
}

export interface ICombineClient
  extends Omit<ICombineClientsCreateReqBody, 'cproduct_product_id'> {
  combine_entry_id: string;
}

export interface ICombineProducts {
  cproduct_combine_id: number;
  cproduct_product_id: idType;
  cproduct_commission_rate: number;
}

export interface IDeleteCombineInfo {
  combine_is_deleted: idType;
  combine_deleted_by: idType;
}

export interface ICombineClientLastBalance {
  clbalance_combine_id: idType;
  clbalance_amount: number;
}

export interface ICombinedTransaction {
  comtransaction_ledger_type: TLedgerTypes;
  comtransaction_type: 'DEBIT' | 'CREDIT';
  comtransaction_combine_id: idType;
  comtransaction_trnxtype_id: idType | undefined;
  comtransaction_amount: number;
  comtransaction_created_by: number;
  comtransaction_pay_date?: string;
  comtransaction_invoice_id?: number;
  comtransaction_note?: string;
}
export interface IUpdateCombinedTransaction {
  comtransaction_ledger_type?: TLedgerTypes;
  comtransaction_type: 'DEBIT' | 'CREDIT';
  comtransaction_combine_id?: idType;
  comtransaction_trnxtype_id?: idType | undefined;
  comtransaction_amount: number;
  comtransaction_created_by: number;
  comtransaction_pay_date?: string;
  comtransaction_invoice_id?: number;
}
