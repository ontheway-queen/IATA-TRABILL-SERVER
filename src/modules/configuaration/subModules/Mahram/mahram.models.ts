import AbstractModels from '../../../../abstracts/abstract.models';
import { idType } from '../../../../common/types/common.types';
import { MahramReqBody } from '../../types/configuration.interfaces';

class MahramModel extends AbstractModels {
  public async createMahram(data: MahramReqBody) {
    const mahram = await this.query()
      .insert({ ...data, maharam_org_agency: this.org_agency })
      .into('trabill_maharams');

    return mahram[0];
  }

  public async updateMahram(data: MahramReqBody, maharam_id: string | number) {
    return await this.query()
      .into('trabill_maharams')
      .update(data)
      .where('maharam_id', maharam_id)
      .whereNot('maharam_is_deleted', 1);
  }

  public async viewMahrams(page: number, size: number) {
    const page_number = (page - 1) * size;

    return await this.query()
      .from('trabill_maharams')
      .select('maharam_id', 'maharam_name', 'maharam_org_agency as agency_id')
      .where('maharam_org_agency', null)
      .orWhere('maharam_org_agency', this.org_agency)
      .andWhereNot('maharam_is_deleted', 1)
      .orderBy('maharam_create_date', 'desc')
      .limit(size)
      .offset(page_number);
  }

  public async countMahramsDataRow() {
    const [count] = await this.query()
      .select(this.db.raw(`COUNT(*) as row_count`))
      .from('trabill_maharams')
      .whereNot('maharam_is_deleted', 1)
      .andWhere('maharam_org_agency', null)
      .orWhere('maharam_org_agency', this.org_agency);

    return count.row_count;
  }

  public async getAllMahrams() {
    const by_clients = await this.query()
      .from('trabill_maharams')
      .select('maharam_id', 'maharam_name', 'maharam_org_agency as agency_id')
      .where('maharam_org_agency', this.org_agency)
      .andWhereNot('maharam_is_deleted', 1)
      .orderBy('maharam_create_date', 'desc');

    const by_default = await this.query()
      .from('trabill_maharams')
      .select('maharam_id', 'maharam_name', 'maharam_org_agency as agency_id')
      .where('maharam_org_agency', null)
      .andWhereNot('maharam_is_deleted', 1)
      .orderBy('maharam_create_date', 'desc');

    return [...by_clients, ...by_default];
  }

  public async deleteMahram(maharam_id: idType, maharam_deleted_by: idType) {
    return await this.query()
      .into('trabill_maharams')
      .update({ maharam_is_deleted: 1, maharam_deleted_by })
      .where('maharam_id', maharam_id)
      .whereNot('maharam_is_deleted', 1);
  }
}

export default MahramModel;
