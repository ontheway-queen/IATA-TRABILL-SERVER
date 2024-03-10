import AbstractModels from '../../../abstracts/abstract.models';
import { idType } from '../../../common/types/common.types';
import { ISms, SMSlog } from '../types/sms.types';

class SmsModel extends AbstractModels {
  getSmsApiAndClientID = async () => {
    const [data] = await this.query()
      .select('org_sms_api_key', 'org_sms_client_id')
      .from('trabill_agency_organization_information')
      .where('org_id', this.org_agency);

    return data as { org_sms_api_key: string; org_sms_client_id: string };
  };

  public async createSms(data: ISms) {
    const sms = await this.query()
      .insert({ ...data, sms_org_agency: this.org_agency })
      .into('trabill_sending_sms');

    return sms[0];
  }

  public async smsLog(data: SMSlog) {
    const log = await this.query()
      .insert({ ...data, smslog_org_agency: this.org_agency })
      .into('trabill_sms_logs');

    return log[0];
  }

  public async createSmsArr(data: ISms[]) {
    const insertedValue = data.map((item) => {
      return { ...item, sms_org_agency: this.org_agency };
    });

    const sms = await this.query()
      .insert(insertedValue)
      .into('trabill_sending_sms');

    return sms[0];
  }

  public async smsLogArr(data: SMSlog[]) {
    const insertedValue = data.map((item) => {
      return { ...item, smslog_org_agency: this.org_agency };
    });

    const log = await this.query()
      .insert(insertedValue)
      .into('trabill_sms_logs');

    return log[0];
  }

  public async getSms(
    from_date: idType,
    to_date: idType,
    page: number,
    size: number
  ) {
    const page_number = (page - 1) * size;

    const sms = await this.query()
      .select(
        'smslog_create_date',
        'client_name',
        'smslog_for',
        'smslog_client_id',
        'smslog_mobile',
        'smslog_content',
        'smslog_delivery_status'
      )
      .from('trabill_sms_logs')
      .leftJoin(
        'trabill_clients',
        'trabill_clients.client_id',
        'trabill_sms_logs.smslog_client_id'
      )
      .where('smslog_org_agency', this.org_agency)
      .andWhereNot('smslog_is_deleted', 1)
      .andWhereRaw('Date(smslog_create_date) BETWEEN ? AND ?', [
        from_date,
        to_date,
      ])
      .orderBy('smslog_create_date', 'desc')
      .limit(size)
      .offset(page_number);

    return sms;
  }

  public async countSmsDataRow() {
    const [count] = await this.query()
      .select(this.db.raw(`count(*) as row_count`))
      .from('trabill_sms_logs')
      .where('smslog_org_agency', this.org_agency)
      .andWhereNot('smslog_is_deleted', 1);

    return count.row_count;
  }
}

export default SmsModel;
