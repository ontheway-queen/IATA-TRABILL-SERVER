import AbstractModels from '../../../../abstracts/abstract.models';
import { idType } from '../../../../common/types/common.types';
import {
  IAppConfig,
  ISignatureDB,
  ImagesTypes,
} from '../../../configuaration/types/configuration.interfaces';

class AppConfigModels extends AbstractModels {
  public async getAppConfig() {
    const [data] = (await this.query()
      .select(
        `tac_org_id`,
        `tac_inv_cs`,
        `tac_inv_as`,
        `tac_inv_iw`,
        `tac_inv_in`,
        `tac_inv_sd`,
        `tac_inv_mob`,
        `tac_ait_cal`,
        `tac_wtr_mark`,
        `tac_sig_url`,
        `tac_wtr_mark_url`,
        `tac_signtr`,
        `tac_due_wtr_mark`,
        `tac_paid_wtr_mark`,
        `tac_auto_sms`,
        `tac_invoice_footer_note`,
        `tac_inv_curr_sym`,
        `tac_auto_email`,
        `tac_wk_day`
      )
      .from('trabill_app_config')
      .where('tac_org_id', this.org_agency)) as {
      tac_org_id: number;
      tac_inv_cs: string;
      tac_inv_as: string;
      tac_inv_iw: string;
      tac_inv_in: string;
      tac_inv_sd: string;
      tac_inv_mob: string;
      tac_ait_cal: string;
      tac_wtr_mark: 0 | 1;
      tac_sig_url: string;
      tac_wtr_mark_url: string;
      tac_signtr: 0 | 1;
      tac_due_wtr_mark: 0 | 1;
      tac_paid_wtr_mark: 0 | 1;
      tac_auto_sms: 0 | 1;
      tac_invoice_footer_note: string;
      tac_inv_curr_sym: string;
      tac_auto_email: 0 | 1;
      tac_wk_day: number;
    }[];

    return data;
  }

  public async updateAppConfig(data: IAppConfig) {
    const config = await this.db('trabill_app_config')
      .select('tac_org_id', 'tac_sig_url')
      .where('tac_org_id', this.org_agency);

    if (!config.length) {
      await this.db('trabill_app_config').insert({
        ...data,
        tac_org_id: this.org_agency,
      });
    } else {
      return await this.db('trabill_app_config')
        .update(data)
        .where('tac_org_id', this.org_agency);
    }
  }

  public async updateAppConfigSignature(data: ImagesTypes) {
    return await this.db('trabill_app_config')
      .update({ ...data })
      .where('tac_org_id', this.org_agency);
  }

  // SIGNATURE
  insertSignature = async (data: ISignatureDB) => {
    return await this.db('trabill_signature_info').insert(data);
  };

  checkSignatureTypeIsExist = async () => {
    const [{ count }] = (await this.db('trabill_signature_info')
      .count('* as count')
      .where('sig_type', 'AUTHORITY')
      .andWhere('sig_org_id', this.org_agency)) as { count: number }[];

    return count;
  };

  updateSignature = async (data: ISignatureDB, sig_id: idType) => {
    return await this.db('trabill_signature_info')
      .update(data)
      .where('sig_id', sig_id);
  };

  updateSignatureStatus = async (
    sig_status: 'ACTIVE' | 'INACTIVE',
    sig_id: idType
  ) => {
    return await this.db('trabill_signature_info')
      .update({ sig_status })
      .where('sig_id', sig_id);
  };

  previousSignature = async (sig_id: idType) => {
    const [data] = (await this.db('trabill_signature_info')
      .select('sig_signature')
      .where('sig_id', sig_id)) as { sig_signature: string }[];

    return data?.sig_signature;
  };

  selectSignature = async () => {
    const data = await this.db('trabill_signature_info')
      .select(
        'sig_id',
        'sig_employee_id',
        'employee_full_name',
        'sig_user_id',
        'pre_by.user_full_name as prepared_by',
        'sig_type',
        'sig_name_title',
        'sig_position',
        'sig_phone_no',
        'sig_company_name',
        'sig_address',
        'sig_city',
        'sig_state',
        'sig_zip_code',
        'sig_phone_number',
        'sig_email',
        'sig_signature',
        'sig_created_date as created_date',
        'sig_status',
        'created_by.user_full_name as created_by'
      )
      .where('sig_org_id', this.org_agency)
      .leftJoin('trabill_users as created_by', {
        'created_by.user_id': 'sig_created_by',
      })
      .leftJoin('trabill_users as pre_by', { 'pre_by.user_id': 'sig_user_id' })
      .leftJoin('trabill_employees', { employee_id: 'sig_employee_id' });

    const [{ count }] = (await this.db('trabill_signature_info').count(
      '* as count'
    )) as { count: number }[];

    return { data, count };
  };

  public async getAppConfigInfo() {
    const [data] = (await this.query()
      .select('tac_wtr_mark_url', 'tac_sig_url')
      .from('trabill_app_config')
      .where('tac_org_id', this.org_agency)) as {
      tac_wtr_mark_url: string;
      tac_sig_url: string;
    }[];

    return data;
  }
}
export default AppConfigModels;
