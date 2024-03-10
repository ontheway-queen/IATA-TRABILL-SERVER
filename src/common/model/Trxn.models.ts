import moment from 'moment';
import AbstractModels from '../../abstracts/abstract.models';
import {
  IAcTrxn,
  IClTrxn,
  IComTrxn,
  IUpdateAccTrxn,
  IUpdateCTrxn,
  IUpdateCombTrxn,
  IUpdateVTrxn,
  IVTrxnDb,
} from '../interfaces/Trxn.interfaces';
import { idType } from '../types/common.types';

class TrxnModels extends AbstractModels {
  public async insertVTrxn(body: IVTrxnDb) {
    const [id] = await this.query()
      .insert({ ...body, vtrxn_agency_id: this.org_agency })
      .into('trxn.vendor_trxn');

    return id;
  }

  public async updateVTrxn(b: IUpdateVTrxn) {
    await this.db.raw('CALL trxn.UpdateVTrxn(?,?,?,?,?,?,?,?,?,?,?,?,?)', [
      b.p_trxn_id,
      b.vtrxn_v_id,
      b.vtrxn_airticket_no || '',
      b.vtrxn_pax || '',
      b.vtrxn_pnr || '',
      b.vtrxn_route || '',
      b.vtrxn_type,
      b.vtrxn_particular_type || '',
      b.vtrxn_amount,
      b.vtrxn_particular_id,
      b.vtrxn_note || '',
      b.vtrxn_created_at,
      b.vtrxn_pay_type || '',
    ]);
  }

  public async deleteVTrxn(trxn_id: number) {
    await this.db.raw('CALL trxn.DeleteVTrxn(?)', [trxn_id]);
  }

  public async insertClTrxn(body: IClTrxn) {
    const [id] = await this.query()
      .insert({ ...body, ctrxn_agency_id: this.org_agency })
      .into(`trxn.client_trxn`);

    return id;
  }

  public async updateClTrxn(b: IUpdateCTrxn) {
    await this.db.raw('CALL trxn.UpdateClTrxn(?,?,?,?,?,?,?,?,?,?,?,?,?)', [
      b.p_trxn_id,
      b.p_client_id,
      b.p_airticket_no || '',
      b.p_route || '',
      b.p_pax || '',
      b.p_pnr || '',
      b.p_type,
      b.p_amount,
      b.p_particular_id,
      b.p_particular_type || '',
      b.p_note || '',
      b.p_created_at,
      b.p_pay_type || '',
    ]);
  }

  public async deleteClTrxn(trxn_id: number) {
    await this.db.raw('CALL trxn.DeleteClTrxn(?)', [trxn_id]);
  }

  public async getClTrans(
    client_id: idType,
    from_date: string,
    to_date: string,
    page: number,
    size: number
  ) {
    const offset = (page - 1) * size;
    from_date = moment(new Date(from_date)).format('YYYY-MM-DD');
    to_date = moment(new Date(to_date)).format('YYYY-MM-DD');

    const ledgers = await this.query()
      .select('*')
      .from('trxn.v_cl_trxn')
      .where('ctrxn_cl_id', client_id)
      .andWhere('ctrxn_agency_id', this.org_agency)
      .andWhereRaw(
        `DATE_FORMAT(ctrxn_created_at, '%Y-%m-%d') BETWEEN ? AND ?`,
        [from_date, to_date]
      )
      .limit(size)
      .offset(offset);

    const [count] = (await this.query()
      .count('* as total')
      .from('trxn.v_cl_trxn')
      .where('ctrxn_cl_id', client_id)
      .andWhere('ctrxn_agency_id', this.org_agency)
      .andWhereRaw(
        `DATE_FORMAT(ctrxn_created_at, '%Y-%m-%d') BETWEEN ? AND ?`,
        [from_date, to_date]
      )) as { total: number }[];

    return { ledgers, count: count.total };
  }

  public async getVenTrxns(
    vendor_id: idType,
    from_date: string,
    to_date: string,
    page: number,
    size: number
  ) {
    const offset = (page - 1) * size;
    from_date = moment(new Date(from_date)).format('YYYY-MM-DD');
    to_date = moment(new Date(to_date)).format('YYYY-MM-DD');

    const ledgers = await this.query()
      .select('*')
      .from('trxn.v_ven_trxn')
      .where('vtrxn_v_id', vendor_id)
      .andWhere('vtrxn_agency_id', this.org_agency)
      .andWhereRaw(
        `DATE_FORMAT(vtrxn_created_at, '%Y-%m-%d') BETWEEN ? AND ?`,
        [from_date, to_date]
      )
      .offset(offset)
      .limit(size);

    const [count] = (await this.query()
      .count('* as total')
      .from('trxn.v_ven_trxn')
      .where('vtrxn_v_id', vendor_id)
      .andWhere('vtrxn_agency_id', this.org_agency)
      .andWhereRaw(
        `DATE_FORMAT(vtrxn_created_at, '%Y-%m-%d') BETWEEN ? AND ?`,
        [from_date, to_date]
      )) as { total: number }[];

    return { ledgers, count: count.total };
  }

  public async getComTrxn(
    combine_id: idType,
    from_date: string,
    to_date: string,
    page: number,
    size: number
  ) {
    const offset = (page - 1) * size;
    from_date = moment(new Date(from_date)).format('YYYY-MM-DD');
    to_date = moment(new Date(to_date)).format('YYYY-MM-DD');

    const data = await this.query()
      .select('*')
      .from('trxn.v_com_trxn')
      .where('comtrxn_comb_id', combine_id)
      .andWhere('comtrxn_agency_id', this.org_agency)
      .andWhereRaw(
        `DATE_FORMAT(comtrxn_create_at, '%Y-%m-%d') BETWEEN ? AND ?`,
        [from_date, to_date]
      )
      .offset(offset)
      .limit(size);

    const [count] = (await this.query()
      .count('* as total')
      .from('trxn.v_com_trxn')
      .where('comtrxn_comb_id', combine_id)
      .andWhere('comtrxn_agency_id', this.org_agency)
      .andWhereRaw(
        `DATE_FORMAT(comtrxn_create_at, '%Y-%m-%d') BETWEEN ? AND ?`,
        [from_date, to_date]
      )) as { total: number }[];

    return { count: count.total, data };
  }

  public async insertComTrxn(body: IComTrxn) {
    const [id] = await this.query()
      .insert({ ...body, comtrxn_agency_id: this.org_agency })
      .into('trxn.comb_trxn');

    return id;
  }

  public async updateComTrxn(body: IUpdateCombTrxn) {
    await this.db.raw(`CALL trxn.UpdateComTrxn(?,?,?,?,?,?,?,?,?,?,?,?,?)`, [
      body.p_trxn_id,
      body.p_airticket_no || '',
      body.p_route || '',
      body.p_pnr || '',
      body.p_pax || '',
      body.p_type,
      body.p_comb_id,
      body.p_particular_id,
      body.p_particular_type || '',
      body.p_amount,
      body.p_note || '',
      body.p_create_at,
      body.p_pay_type || '',
    ]);
  }

  public deleteComTrxn = async (trxn_id: idType) => {
    await this.db.raw(`CALL trxn.DeleteComTrxn(?)`, [trxn_id]);
  };

  getAccTrxn = async (account_id: idType) => {
    const [ledgers] = await this.query()
      .select('*')
      .from('trxn.v_acc_trxn')
      .where('acctrxn_ac_id', account_id)
      .andWhere('acctrxn_agency_id', this.org_agency);

    const [count] = (await this.query()
      .count('* as total')
      .from('trxn.v_acc_trxn')
      .where('acctrxn_ac_id', account_id)
      .andWhere('acctrxn_agency_id', this.org_agency)) as { total: number }[];

    return { ledgers, count: count.total };
  };

  insertAccTrxn = async (data: IAcTrxn) => {
    const [id] = await this.query()
      .insert({ ...data, acctrxn_agency_id: this.org_agency })
      .into('trxn.acc_trxn');

    return id;
  };

  updateAccTrxn = async (data: IUpdateAccTrxn) => {
    await this.db.raw(`CALL trxn.UpdateACTrxn(?,?,?,?,?,?,?,?,?)`, [
      data.p_trxn_id,
      data.p_ac_id,
      data.p_pay_type,
      data.p_particular_id,
      data.p_particular_type || null,
      data.p_type,
      data.p_amount || 0,
      data.p_note || null,
      data.p_created_at,
    ]);
  };

  deleteAccTrxn = async (trxn_id: idType) => {
    await this.db.raw(`CALL trxn.DeleteACTrxn(?)`, [trxn_id]);
  };
}

export default TrxnModels;
