import AbstractModels from '../../../../abstracts/abstract.models';
import { idType } from '../../../../common/types/common.types';
import { PassportStatusReqBody } from '../../types/configuration.interfaces';

class PassportStatusModel extends AbstractModels {
  public async createPassportStatus(data: PassportStatusReqBody) {
    const passportStatus = await this.query()
      .insert({ ...data, pstatus_org_agency: this.org_agency })
      .into('trabill_passport_status');

    return passportStatus[0];
  }

  public async updatePassportStatus(
    data: PassportStatusReqBody,
    status_id: number | string
  ) {
    return await this.query()
      .into('trabill_passport_status')
      .update(data)
      .where('pstatus_id', status_id);
  }

  public async getAllPassportStatus() {
    const by_clients = await this.query()
      .from('trabill_passport_status')
      .select(
        'pstatus_id',
        'pstatus_name',
        'pstatus_create_date',
        'pstatus_org_agency as agency_id'
      )
      .where('pstatus_org_agency', this.org_agency)
      .andWhere('pstatus_is_deleted', 0)
      .orderBy('pstatus_create_date', 'desc');

    const by_default = await this.query()
      .from('trabill_passport_status')
      .select(
        'pstatus_id',
        'pstatus_name',
        'pstatus_create_date',
        'pstatus_org_agency as agency_id'
      )
      .where('pstatus_org_agency', null)
      .andWhere('pstatus_is_deleted', 0)
      .orderBy('pstatus_create_date', 'desc');

    return [...by_clients, ...by_default];
  }

  public async deletePassportStatus(
    status_id: idType,
    pstatus_deleted_by: idType
  ) {
    return await this.query()
      .into('trabill_passport_status')
      .update({ pstatus_is_deleted: 1, pstatus_deleted_by })
      .where('pstatus_id', status_id);
  }
}

export default PassportStatusModel;
