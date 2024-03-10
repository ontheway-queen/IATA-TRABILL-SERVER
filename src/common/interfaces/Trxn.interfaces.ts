import { idType } from '../types/common.types';

export interface IClTrxnBody {
  ctrxn_cl: string;
  ctrxn_voucher?: string;
  ctrxn_airticket_no?: string;
  ctrxn_route?: string;
  ctrxn_pax?: string | null;
  ctrxn_pnr?: string;
  ctrxn_pay_type?: string;
  ctrxn_type: 'DEBIT' | 'CREDIT';
  ctrxn_amount: number;
  ctrxn_particular_id: number;
  ctrxn_particular_type: string;
  ctrxn_note: string;
  ctrxn_created_at: string;
  ctrxn_user_id: idType;
  ctrxn_pass_id?: number;
}

export interface IComTrxn {
  comtrxn_invoice_id?: number;
  comtrxn_airticket_no?: string;
  comtrxn_route?: string;
  comtrxn_pax?: string;
  comtrxn_pnr?: string;
  comtrxn_voucher_no?: string;
  comtrxn_type: string;
  comtrxn_comb_id: number;
  comtrxn_particular_id: number;
  comtrxn_particular_type: string;
  comtrxn_amount: number;
  comtrxn_note: string;
  comtrxn_create_at: string;
  comtrxn_user_id: idType;
  comtrxn_pay_type?: string;
}

export interface IClTrxn extends Omit<IClTrxnBody, 'ctrxn_cl'> {
  ctrxn_cl_id: number;
}
export interface IClTrxnUpdate extends Omit<IClTrxnBody, 'ctrxn_user_id'> {
  ctrxn_trxn_id: number;
}

export interface IUpdateCTrxn {
  p_trxn_id: number;
  p_client_id: number;
  p_voucher?: string;
  p_airticket_no: string;
  p_route?: string;
  p_pax?: string | null;
  p_pnr?: string;
  p_type: 'DEBIT' | 'CREDIT';
  p_amount: number;
  p_particular_id: number;
  p_particular_type: string;
  p_note: string;
  p_pay_type: string;
  p_created_at: string;
}

export interface IVTrxnDb {
  vtrxn_v_id: number;
  vtrxn_voucher?: string;
  vtrxn_airticket_no?: string;
  vtrxn_pax?: string | null;
  vtrxn_route?: string;
  vtrxn_pnr?: string;
  vtrxn_type: 'CREDIT' | 'DEBIT';
  vtrxn_particular_type: string;
  vtrxn_amount: number;
  vtrxn_particular_id: number;
  vtrxn_note: string;
  vtrxn_user_id: idType;
  vtrxn_created_at: string;
  vtrxn_pay_type?: string;
}

export interface IUpdateVTrxn extends IVTrxnDb {
  p_trxn_id: number;
}

export interface IVTrxn extends Omit<IVTrxnDb, 'vtrxn_v_id'> {
  comb_vendor: string;
}

export interface IVTrxnUpdate extends IVTrxn {
  trxn_id: number;
}

export interface IUpdateCombTrxn {
  p_trxn_id: number;
  p_airticket_no?: string;
  p_voucher_no?: string;
  p_pnr?: string;
  p_route?: string;
  p_type: 'DEBIT' | 'CREDIT';
  p_comb_id: number;
  p_particular_id: number;
  p_particular_type: string;
  p_amount: number;
  p_note: string;
  p_create_at: string;
  p_pax: string;
  p_pay_type: string;
}

export interface IAccTrxn {
  acctrxn_ac_id: number;
  acctrxn_pay_type: 'CASH' | 'BANK' | 'MOBILE BANKING';
  acctrxn_particular_id: number;
  acctrxn_particular_type: string;
  acctrxn_type: 'DEBIT' | 'CREDIT';
  acctrxn_amount: number;
  acctrxn_lbalance: number;
  acctrxn_note?: string;
  acctrxn_created_at: string;
  acctrxn_created_by: idType;
}

export interface IAcTrxn extends Omit<IAccTrxn, 'acctrxn_lbalance'> {
  acctrxn_voucher?: string;
}
export interface IAcTrxnUpdate extends IAcTrxn {
  trxn_id: number;
}

export interface IUpdateAccTrxn {
  p_trxn_id: number;
  p_ac_id: number;
  p_pay_type: 'CASH' | 'BANK' | 'MOBILE BANKING';
  p_particular_id: number;
  p_particular_type: string;
  p_type: 'DEBIT' | 'CREDIT';
  p_amount: number;
  p_note: string;
  p_created_at: string;
}
