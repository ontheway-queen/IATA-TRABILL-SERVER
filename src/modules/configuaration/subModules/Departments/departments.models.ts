import AbstractModels from '../../../../abstracts/abstract.models';
import { idType } from '../../../../common/types/common.types';
import { DepartmentsReqBody } from '../../types/configuration.interfaces';

class DepartmentsModel extends AbstractModels {
  public async createDepartment(data: DepartmentsReqBody) {
    const visaType = await this.query()
      .insert({ ...data, department_org_agency: this.org_agency })
      .into('trabill_departments');

    return visaType[0];
  }

  public async viewDepartments(page: number, size: number) {
    const page_number = (page - 1) * size;

    return await this.query()
      .from('trabill_departments')
      .select(
        'department_id',
        'department_name',
        'department_create_date',
        'department_org_agency as agency_id'
      )
      .whereNot('department_is_deleted', 1)
      .andWhere((builder) => {
        builder.where('department_org_agency', null);
        builder.orWhere('department_org_agency', this.org_agency);
      })
      .orderBy('department_name')
      .limit(size)
      .offset(page_number);
  }

  public async countDepartmentDataRow() {
    const [count] = await this.query()
      .select(this.db.raw(`count(*) as row_count`))
      .from('trabill_departments')
      .whereNot('department_is_deleted', 1)
      .andWhere('department_org_agency', null)
      .orWhere('department_org_agency', this.org_agency);

    return count.row_count;
  }

  public async getAllDepartments() {
    const by_clients = await this.query()
      .from('trabill_departments')
      .select(
        'department_id',
        'department_name',
        'department_create_date',
        'department_org_agency as agency_id'
      )
      .where('department_org_agency', this.org_agency)
      .andWhereNot('department_is_deleted', 1)
      .orderBy('department_name');

    const by_default = await this.query()
      .from('trabill_departments')
      .select(
        'department_id',
        'department_name',
        'department_create_date',
        'department_org_agency as agency_id'
      )
      .where('department_org_agency', null)
      .andWhereNot('department_is_deleted', 1)
      .orderBy('department_name');

    return [...by_clients, ...by_default];
  }

  public async editDepartment(data: DepartmentsReqBody, id: idType) {
    return await this.query()
      .into('trabill_departments')
      .update(data)
      .where('trabill_departments.department_id', id);
  }

  public async deleteDepartment(id: idType, department_deleted_by: idType) {
    return await this.query()
      .into('trabill_departments')
      .update({ department_is_deleted: 1, department_deleted_by })
      .where('trabill_departments.department_id', id);
  }
}

export default DepartmentsModel;
