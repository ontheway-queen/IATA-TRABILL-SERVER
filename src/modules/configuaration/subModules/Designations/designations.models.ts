import AbstractModels from '../../../../abstracts/abstract.models';
import { idType } from '../../../../common/types/common.types';
import { DesignationReqBody } from '../../types/configuration.interfaces';

class DesignationModel extends AbstractModels {
  public async createDesignation(data: DesignationReqBody) {
    const designation = await this.query()
      .insert({ ...data, designation_org_agency: this.org_agency })
      .into('trabill_designations');

    return designation[0];
  }

  public async viewDesignations(page: number, size: number) {
    const page_number = (page - 1) * size;

    return await this.query()
      .select(
        'designation_id',
        'designation_name',
        'designation_create_date',
        'designation_created_by',
        'designation_is_deleted',
        'designation_org_agency as agency_id'
      )
      .from('trabill_designations')
      .where('designation_org_agency', null)
      .orWhere('designation_org_agency', this.org_agency)
      .andWhereNot('designation_is_deleted', 1)
      .orderBy('designation_name')
      .limit(size)
      .offset(page_number);
  }

  public async countDesignationsDataRow() {
    const [count] = await this.query()
      .select(this.db.raw(`count(*) as row_count`))
      .from('trabill_designations')
      .where('designation_org_agency', null)
      .orWhere('designation_org_agency', this.org_agency)
      .andWhereNot('designation_is_deleted', 1);

    return count.row_count;
  }

  public async getAllDesignations() {
    const by_clients = await this.query()
      .select(
        'designation_id',
        'designation_name',
        'designation_create_date',
        'designation_created_by',
        'designation_is_deleted',
        'designation_org_agency as agency_id'
      )
      .from('trabill_designations')
      .whereNot('designation_is_deleted', 1)
      .where('designation_org_agency', this.org_agency)
      .orderBy('designation_name');

    const by_default = await this.query()
      .select(
        'designation_id',
        'designation_name',
        'designation_create_date',
        'designation_created_by',
        'designation_is_deleted',
        'designation_org_agency as agency_id'
      )
      .from('trabill_designations')
      .whereNot('designation_is_deleted', 1)
      .andWhere('designation_org_agency', null)
      .orderBy('designation_name');

    return [...by_clients, ...by_default];
  }

  public async deleteDesignation(id: idType, designation_deleted_by: idType) {
    return await this.query()
      .into('trabill_designations')
      .update({ designation_is_deleted: 1, designation_deleted_by })
      .where('designation_id', id);
  }

  public async editDesignation(data: DesignationReqBody, id: idType) {
    return await this.query()
      .into('trabill_designations')
      .update(data)
      .where('trabill_designations.designation_id', id)
      .whereNot('designation_is_deleted', 1);
  }
}

export default DesignationModel;
