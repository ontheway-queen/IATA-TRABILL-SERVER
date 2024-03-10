import AbstractModels from '../../../../abstracts/abstract.models';
import { idType } from '../../../../common/types/common.types';
import {
  CreateIOffices,
  EditIOffices,
  IAppConfig,
  ImagesTypes,
} from '../../../configuaration/types/configuration.interfaces';

class AppConfigModels extends AbstractModels {
  public async getAllOffice() {
    const data = await this.query()
      .select(
        `office_id`,
        `office_name`,
        `office_address`,
        `office_email`,
        `office_created_date`,
        this.db.raw(
          `concat(trabill_users.user_first_name,' ',trabill_users.user_last_name) as created_by`
        )
      )
      .from(`rcm.rcm_office as ro`)
      .leftJoin(`${this.database}.trabill_users`, {
        'trabill_users.user_id': 'ro.office_created_by',
      })
      .where('ro.office_org_agency', this.org_agency);

    const [{ row_count }] = await this.db(`rcm.rcm_office as ro`)
      .count('* as row_count')
      .where('ro.office_org_agency', this.org_agency);

    return { count: row_count, data };
  }

  public async getAllClientByOffice(
    page: number,
    size: number,
    search: string,
    office_id: string
  ) {
    const offset = (page - 1) * size;
    const data = await this.query()
      .select(
        `rc.rclient_id`,
        `rc.rclient_name`,
        `rc.rclient_created_date`,
        `rc.rclient_phone`,
        `rc.rclient_email`,
        `rc.rclient_nid_no`,
        `rc.rclient_image`,

        `rclient_present_age`
      )
      .from(`rcm.rcm_office as ro`)
      .where(`ro.office_id`, office_id)
      .where('ro.office_org_agency', this.org_agency)

      .leftJoin(`rcm.rcm_manpowers as rm`, {
        'rm.manpower_office_id': 'ro.office_id',
      })

      .leftJoin(`rcm.rcm_clients as rc`, {
        'rc.rclient_id': 'rm.manpower_client_id',
      })

      .modify((e) => {
        if (search) {
          e.whereRaw(`LOWER(rc.rclient_name) LIKE ? `, [`%${search}%`]);
        }
      })

      .limit(size)
      .offset(offset);

    const [office_name] = await this.db(`rcm.rcm_office as ro`)
      .select('ro.office_name')
      .where(`ro.office_id`, office_id);

    const [{ row_count }] = await this.db(`rcm.rcm_office as ro`)
      .count('* as row_count')
      .where(`ro.office_id`, office_id)

      .leftJoin(`rcm.rcm_manpowers as rm`, {
        'rm.manpower_office_id': 'ro.office_id',
      })

      .leftJoin(`rcm.rcm_clients as rc`, {
        'rc.rclient_id': 'rm.manpower_client_id',
      })

      .modify((e) => {
        if (search) {
          e.whereRaw(`LOWER(rc.rclient_name) LIKE ? `, [`%${search}%`]);
        }
      })
      .where('ro.office_org_agency', this.org_agency);

    return { row_count, data: { ...office_name, data } };
  }

  public async getAllOfficeForEdit(office_id: idType) {
    const data = await this.query()
      .select(
        `office_id`,
        `office_name`,
        `office_address`,
        `office_email`,
        `office_created_date`,
        this.db.raw(
          `concat(trabill_users.user_first_name,' ',trabill_users.user_last_name) as created_by`
        )
      )
      .from(`rcm.rcm_office as ro`)
      .leftJoin(`${this.database}.trabill_users`, {
        'trabill_users.user_id': 'ro.office_created_by',
      })
      .where('ro.office_org_agency', this.org_agency)
      .andWhere('office_id', office_id);

    return data;
  }

  public async viewAllOffice() {
    const data = await this.query()
      .select(
        `office_id`,
        `office_name`,
        `office_address`,
        `office_email`,
        `office_created_date`,
        this.db.raw(
          `concat(trabill_users.user_first_name,' ',trabill_users.user_last_name) as created_by`
        )
      )
      .from(`rcm.rcm_office as ro`)
      .leftJoin(`${this.database}.trabill_users`, {
        'trabill_users.user_id': 'ro.office_created_by',
      })
      .where('ro.office_org_agency', this.org_agency);

    return data;
  }

  public async createOffice(data: CreateIOffices) {
    const [id] = await this.db(`rcm.rcm_office`).insert({
      ...data,
      office_org_agency: this.org_agency,
    });

    return id;
  }

  public async editOffice(data: EditIOffices, office_id: idType) {
    return await this.db(`rcm.rcm_office as ro`)
      .update(data)
      .where('ro.office_id', office_id)
      .andWhere('ro.office_org_agency', this.org_agency);
  }

  public async deleteOffice(office_id: idType) {
    return await this.db(`rcm.rcm_office as ro`)
      .delete()
      .where('ro.office_id', office_id)
      .andWhere('ro.office_org_agency', this.org_agency);
  }

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
        'tac_airticket_type',
        `tac_sig_url`,
        `tac_wtr_mark_url`,
        `tac_signtr`,
        `tac_due_wtr_mark`,
        `tac_paid_wtr_mark`,
        `tac_auto_sms`,
        `tac_invoice_footer_note`,
        `tac_inv_curr_sym`,
        `tac_auto_email`
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
      tac_airticket_type: 'IATA' | 'NON_IATA';
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
}
export default AppConfigModels;
