import AbstractModels from '../../../abstracts/abstract.models';
import { idType, IPassportDb } from '../../../common/types/common.types';
import CustomError from '../../../common/utils/errors/customError';
import {
  ChangePassport,
  IEditPassport,
  PassportScanCopy,
  SMSlog,
} from '../types/passport.interfaces';

class PassportModel extends AbstractModels {
  public async addPassport(data: IPassportDb[] | IPassportDb) {
    const passport = await this.query()
      .insert({ ...data, passport_org_agency: this.org_agency })
      .into('trabill_passport_details');

    return passport[0];
  }

  getPassIdByPassNo = async (pass_no: string) => {
    const [passport] = await this.query()
      .select('passport_id')
      .from('trabill_passport_details')
      .where('passport_org_agency', this.org_agency)
      .andWhere('passport_passport_no', pass_no)
      .andWhereNot('passport_is_deleted', 1);

    return passport?.passport_id;
  };

  updatePassport = async (data: IEditPassport) => {
    const [passport_id] = await this.query()
      .insert({ ...data, passport_org_agency: this.org_agency })
      .into('trabill_passport_details')
      .onConflict('passport_id')
      .merge(data);

    return passport_id;
  };

  public async editPassport(data: IEditPassport, passport_id: idType) {
    const passport = await this.query()
      .update(data)
      .into('trabill_passport_details')
      .where('passport_id', passport_id);

    return passport;
  }

  public async viewPassports(
    page: number,
    size: number,
    search_text: string,
    from_date: string,
    to_date: string,
    client_id?: number | null,
    combined_id?: number | null
  ) {
    search_text && search_text.toLocaleLowerCase();
    const page_number = (page - 1) * size;

    const data = await this.query()
      .select(
        'passport_org_agency',
        'passport_id',
        'pstatus_name',
        'passport_client_id',
        'client_name',
        'client_mobile',
        'passport_name',
        'passport_passport_no',
        'passport_mobile_no',
        'passport_date_of_birth',
        'passport_date_of_issue',
        'passport_date_of_expire',
        'passport_create_date',
        'passport_email',
        'passport_scan_copy',
        'passport_upload_photo',
        'passport_upload_others'
      )
      .from('trabill_passport_details')
      .leftJoin('trabill_clients', { client_id: 'passport_client_id' })
      .leftJoin('trabill_combined_clients', {
        combine_id: 'passport_combined_id',
      })
      .leftJoin(
        this.db.raw(
          `trabill_passport_status ON pstatus_id = passport_status_id AND pstatus_is_deleted = 0`
        )
      )
      .where('passport_is_deleted', 0)
      .andWhere((builder) => {
        builder.andWhere('passport_org_agency', this.org_agency).modify((e) => {
          if (from_date && to_date) {
            e.andWhereRaw(
              `DATE_FORMAT(passport_create_date, '%Y-%m-%d') BETWEEN ? AND ?`,
              [from_date, to_date]
            );
          }

          if (search_text) {
            e.andWhereRaw(`LOWER(passport_name) LIKE ?`, [`%${search_text}%`])
              .orWhereRaw(`LOWER(passport_passport_no) LIKE ?`, [
                `%${search_text}%`,
              ])
              .orWhereRaw(`LOWER(passport_mobile_no) LIKE ?`, [
                `%${search_text}%`,
              ]);
          }

          if (client_id !== null) {
            e.andWhere('passport_client_id', client_id);
          }

          if (combined_id !== null) {
            e.andWhere('passport_combined_id', combined_id);
          }
        });
      })
      .andWhere('passport_org_agency', this.org_agency)
      .orderBy('passport_create_date', 'desc')
      .limit(size)
      .offset(page_number);

    const [{ row_count }] = await this.query()
      .select(this.db.raw(`count(*) as row_count`))
      .where('passport_is_deleted', 0)
      .andWhere((builder) => {
        builder.andWhere('passport_org_agency', this.org_agency).modify((e) => {
          if (from_date && to_date) {
            e.andWhereRaw(
              `DATE_FORMAT(passport_create_date, '%Y-%m-%d') BETWEEN ? AND ?`,
              [from_date, to_date]
            );
          }

          if (search_text) {
            e.andWhereRaw(`LOWER(passport_name) LIKE ?`, [`%${search_text}%`])
              .orWhereRaw(`LOWER(passport_passport_no) LIKE ?`, [
                `%${search_text}%`,
              ])
              .orWhereRaw(`LOWER(passport_mobile_no) LIKE ?`, [
                `%${search_text}%`,
              ]);
          }

          if (client_id !== null) {
            e.andWhere('passport_client_id', client_id);
          }

          if (combined_id !== null) {
            e.andWhere('passport_combined_id', combined_id);
          }
        });
      })
      .from('trabill_passport_details')
      .where('passport_is_deleted', 0)
      .andWhere('passport_org_agency', this.org_agency);

    return { count: row_count, data };
  }

  public async getPassportsForSelect(search: idType) {
    const passports = await this.query()
      .select('passport_id', 'passport_name', 'passport_passport_no')
      .from('trabill_passport_details')
      .whereNot('passport_is_deleted', 1)
      .whereNotNull('passport_passport_no')
      .andWhere('passport_org_agency', this.org_agency)
      .orderBy('passport_create_date', 'desc')
      .modify((event) => {
        if (search) {
          event
            .where('passport_passport_no', 'like', `%${search}%`)
            .orWhere('passport_name', 'like', `%${search}%`);
        }
      })
      .orderBy('passport_passport_no');

    return passports;
  }

  public async getAllPassports() {
    const passports = await this.query()
      .select(
        'passport_id',
        'passport_client_id',
        'client_name',
        'client_mobile',
        'passport_name',
        'passport_passport_no',
        'passport_mobile_no',
        'passport_date_of_birth',
        'passport_date_of_issue',
        'passport_date_of_expire',
        'passport_email',
        'passport_scan_copy'
      )
      .leftJoin('trabill_clients', { client_id: 'passport_client_id' })
      .from('trabill_passport_details')
      .whereNot('passport_is_deleted', 1)
      .andWhere('passport_org_agency', this.org_agency)
      .orderBy('passport_create_date', 'desc');

    return passports;
  }

  public async singlePassport(passport_id: number | string) {
    const [passport] = await this.query()
      .select(
        this.db.raw(
          "CASE WHEN passport_client_id IS NOT NULL THEN CONCAT('client-',passport_client_id) ELSE CONCAT('combined-',passport_combined_id) END AS client_id"
        ),
        'passport_person_type',
        'passport_id',
        'passport_name as name',
        'passport_passport_no as passport_no',
        'passport_nid_no',
        'passport_mobile_no as mobile_no',
        'passport_date_of_birth as date_of_birth',
        'passport_date_of_issue as date_of_issue',
        'passport_date_of_expire as date_of_expire',
        'passport_email as email',
        'passport_scan_copy',
        'passport_nid_no as nid',
        'passport_upload_photo',
        'passport_upload_others'
      )
      .from('trabill_passport_details')
      .leftJoin('trabill_clients', { client_id: 'passport_client_id' })
      .where('passport_id', passport_id)
      .andWhereNot('passport_is_deleted', 1);

    return passport;
  }

  public async passportScanCopy(passport_id: idType) {
    const [passports] = await this.query()
      .select(
        'passport_scan_copy',
        'passport_upload_photo',
        'passport_upload_others'
      )
      .from('trabill_passport_details')
      .where('passport_id', passport_id)
      .andWhereNot('passport_is_deleted', 1)
      .orderBy('passport_create_date', 'desc');

    return passports as PassportScanCopy | undefined;
  }

  public async changePassportSts(
    passport_status_id: number,
    passport_id: idType
  ) {
    const status = await this.query()
      .update({ passport_status_id })
      .into('trabill_passport_details')
      .where({ passport_id: passport_id });

    return status;
  }

  public async statusPassport(data: ChangePassport, passport_id: idType) {
    const passport = await this.query()
      .update(data)
      .into('trabill_passport_details')
      .where('passport_id', passport_id);

    return passport;
  }

  public async smsLog(data: SMSlog) {
    const sms = await this.query()
      .insert({ ...data, smslog_org_agency: this.org_agency })
      .into('trabill_sms_logs');

    return sms[0];
  }

  public async getPassportStatus(passport_id: number | string) {
    const status = await this.query()
      .select(
        'pstatus_name AS status_title',
        'passport_client_id as client_id',
        'passport_id',
        'passport_name as name',
        'passport_passport_no as passport_no',
        'passport_mobile_no as mobile_no',
        'passport_date_of_birth as date_of_birth',
        'passport_date_of_issue as date_of_issue',
        'passport_date_of_expire as date_of_expire',
        'passport_email as email'
      )

      .from('trabill_passport_details')
      .where('passport_id', passport_id);

    return status;
  }

  public async updatePstatusId(status_id: idType, pass_id: idType) {
    await this.query()
      .update({ passport_status_id: status_id })
      .into('trabill_passport_details')
      .where('passport_id', pass_id);
  }

  passportNumberIsUnique = async (passport_no: idType) => {
    const [passport] = await this.query()
      .from('trabill_passport_details')
      .select(this.db.raw('COUNT(*) as total'))
      .where('passport_org_agency', this.org_agency)
      .andWhere('passport_passport_no', passport_no)
      .andWhereNot('passport_is_deleted', 1);

    return passport.total;
  };

  deletePassport = async (passport_id: idType, passport_deleted_by: idType) => {
    await this.query()
      .update({ passport_is_deleted: 1, passport_deleted_by })
      .into('trabill_passport_details')
      .where('passport_id', passport_id);
  };

  public async viewPassportDetails(passport_id: idType) {
    const [data] = (await this.query()
      .select('passport_passport_no', 'passport_mobile_no', 'passport_email')
      .from('trabill_passport_details')
      .whereNot('passport_is_deleted', 1)
      .andWhere('passport_org_agency', this.org_agency)
      .andWhere('passport_id', passport_id)) as {
      passport_passport_no: string;
      passport_mobile_no: string;
      passport_email: string;
    }[];

    if (!data) {
      throw new CustomError('Please provide a valid id', 404, 'Bad request');
    }

    return data;
  }

  public async getSingleStatus(status_id: idType) {
    const [data] = (await this.query()
      .select('pstatus_name')
      .from('trabill_passport_status')
      .where({ pstatus_id: status_id })) as { pstatus_name: string }[];

    return data;
  }

  public async getOrganizationInfo() {
    const [data] = (await this.query()
      .select(
        'org_owner_full_name',
        'org_owner_email',
        'org_mobile_number',
        'org_address1',
        'org_name',
        'org_logo'
      )
      .from('trabill_agency_organization_information')
      .where('org_id', this.org_agency)) as {
      org_owner_full_name: string;
      org_owner_email: string;
      org_mobile_number: string;
      org_address1: string;
      org_name: string;
      org_logo: string;
    }[];

    return data;
  }
}

export default PassportModel;
