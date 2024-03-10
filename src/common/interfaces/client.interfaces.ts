import { TLedgerTypes } from './commonInterfaces';

export interface IClientTransaction {
  ctrxn_type: 'DEBIT' | 'CREDIT';
  ctrxn_ledger_type: TLedgerTypes;
  ctrxn_client_id: number;
  ctrxn_created_by: number;
  ctrxn_trxntype_id: number | undefined;
  ctrxn_amount: number;
  ctrxn_payment_date?: string;
  ctrxn_note?: string;
}
