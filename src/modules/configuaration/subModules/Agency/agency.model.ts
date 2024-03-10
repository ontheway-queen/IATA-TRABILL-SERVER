import AbstractModels from '../../../../abstracts/abstract.models';
import { idType } from '../../../../common/types/common.types';
import { AgencyReqBody } from '../../types/configuration.interfaces';

class AgencyModel extends AbstractModels {
  public async createAgency(data: AgencyReqBody) {
    const agency = await this.query()
      .insert({ ...data, agency_org_agency: this.org_agency })
      .into('trabill_agency');

    return agency[0];
  }

  public async updateAgency(body: { agency_name: string }, agency_id: idType) {
    const agency = await this.query()
      .into('trabill_agency')
      .update(body)
      .where('agency_id', agency_id);

    return agency;
  }

  public async viewAgencies(page: number, size: number) {
    const page_number = (page - 1) * size;

    return (await this.query()
      .from('trabill_agency')
      .select('agency_id', 'agency_name')
      .orderBy('agency_create_date', 'desc')
      .where('agency_is_deleted', 0)
      .andWhere('agency_org_agency', this.org_agency)
      .limit(size)
      .offset(page_number)) as {
      agency_id: number;
      agency_name: string;
    }[];
  }

  public async countAgencysDataRow() {
    const [count] = await this.query()
      .select(this.db.raw(`COUNT(*) as row_count`))
      .from('trabill_agency')
      .where('agency_is_deleted', 0)
      .andWhere('agency_org_agency', this.org_agency);

    return count.row_count;
  }

  public async getAgencies() {
    return await this.query()
      .from('trabill_agency')
      .select('agency_id', 'agency_name')
      .orderBy('agency_create_date', 'desc')
      .where('agency_is_deleted', 0)
      .andWhere('agency_org_agency', this.org_agency);
  }

  public async deleteAgencies(agency_id: idType, agency_deleted_by: idType) {
    return await this.query()
      .into('trabill_agency')
      .update({ agency_is_deleted: 1, agency_deleted_by })
      .where('agency_id', agency_id);
  }
}

export default AgencyModel;
