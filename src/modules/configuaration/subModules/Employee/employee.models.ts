import AbstractModels from '../../../../abstracts/abstract.models';
import { idType } from '../../../../common/types/common.types';
import CustomError from '../../../../common/utils/errors/customError';
import { EmployeeReqBody } from '../../types/configuration.interfaces';

class EmployeeModel extends AbstractModels {
  public async createEmployee(data: EmployeeReqBody) {
    const employee = await this.query()
      .insert({ ...data, employee_org_agency: this.org_agency })
      .into('trabill_employees');

    return employee[0];
  }
  public async getSineAndId(sine: string, id: string) {
    const [{ count }] = await this.query()
      .count('* as count')
      .from('trabill_employees')
      .where('employee_org_agency', this.org_agency)
      .modify((builder) => {
        builder
          .where('employee_creation_sign', sine)
          .orWhere('employee_card_id', id);
      });

    if (count > 0) {
      throw new CustomError(
        'Employee ID card number or creation sine already exists!',
        400,
        'Invalid input'
      );
    }
  }

  public async updateEmployee(data: EmployeeReqBody, employee_id: idType) {
    return await this.query()
      .into('trabill_employees')
      .update(data)
      .where('employee_id', employee_id);
  }

  public async deleteEmployee(
    employee_id: idType,
    employee_deleted_by: idType
  ) {
    return await this.query()
      .into('trabill_employees')
      .update({ employee_is_deleted: 1, employee_deleted_by })
      .where('employee_id', employee_id);
  }

  public async getAllBloodGroups() {
    return await this.query().select('*').from('trabill_blood_groups');
  }

  public async getEmployeeById(employeeId: idType) {
    const [data] = await this.query()
      .from('trabill_employees')
      .select(
        'employee_full_name',
        'employee_creation_sign',
        'employee_email',
        'employee_mobile',
        'employee_commission',
        this.db.raw(
          'CAST(employee_salary AS DECIMAL(15,2))  AS employee_salary'
        ),
        'employee_joining_date',
        'employee_address',
        'employee_status',
        'employee_status',
        'trabill_designations.designation_name',
        'trabill_blood_groups.group_name',
        'employee_birth_date',
        'employee_apppoint_date',
        'employee_card_id'
      )
      .leftJoin(
        'trabill_blood_groups',
        'trabill_blood_groups.group_id',
        'trabill_employees.employee_bloodgroup_id'
      )
      .leftJoin(
        'trabill_designations',
        'trabill_designations.designation_id',
        'trabill_employees.employee_designation_id'
      )
      .where('employee_id', employeeId);

    return data;
  }

  public async viewEmployees(page: number, size: number) {
    const page_number = (page - 1) * size;

    const data = await this.query()
      .from('trabill_employees')
      .select(
        'employee_id',
        'employee_creation_sign',
        'employee_card_id',
        'employee_full_name',
        'trabill_departments.department_id',
        'trabill_departments.department_name',
        'trabill_designations.designation_id',
        'trabill_designations.designation_name',
        'trabill_blood_groups.group_id',
        'trabill_blood_groups.group_name',
        'employee_email',
        'employee_mobile',
        'employee_salary',
        'employee_commission',
        'employee_birth_date',
        'employee_apppoint_date',
        'employee_joining_date',
        'employee_address',
        'employee_status',
        'employee_org_agency as agency_id'
      )
      .leftJoin(
        'trabill_departments',

        'trabill_departments.department_id',
        'trabill_employees.employee_department_id'
      )
      .leftJoin(
        'trabill_designations',
        'trabill_designations.designation_id',
        'trabill_employees.employee_designation_id'
      )
      .leftJoin(
        'trabill_blood_groups',
        'trabill_blood_groups.group_id',
        'trabill_employees.employee_bloodgroup_id'
      )
      .whereNot('employee_is_deleted', 1)
      .andWhere('employee_org_agency', this.org_agency)
      .orderBy('employee_create_date', 'desc')
      .limit(size)
      .offset(page_number);

    const [{ row_count }] = await this.query()
      .select(this.db.raw(`count(*) as row_count`))
      .from('trabill_employees')
      .whereNot('employee_is_deleted', 1)
      .andWhere('employee_org_agency', this.org_agency);

    return { count: row_count, data };
  }

  public async getAllEmployees(string: string) {
    return await this.query()
      .from('trabill_employees')
      .select(
        'employee_id',
        'employee_creation_sign',
        'employee_full_name',
        'employee_birth_date',
        'employee_card_id',
        'trabill_departments.department_id',
        'trabill_departments.department_name',
        'trabill_designations.designation_id',
        'trabill_designations.designation_name',
        'trabill_blood_groups.group_id',
        'trabill_blood_groups.group_name',
        'employee_email',
        'employee_mobile',
        'employee_salary',
        'employee_commission',
        'employee_apppoint_date',
        'employee_joining_date',
        'employee_address',
        'employee_status',
        'employee_org_agency as agency_id'
      )
      .leftJoin(
        'trabill_departments',

        'trabill_departments.department_id',
        'trabill_employees.employee_department_id'
      )
      .leftJoin(
        'trabill_designations',
        'trabill_designations.designation_id',
        'trabill_employees.employee_designation_id'
      )
      .leftJoin(
        'trabill_blood_groups',
        'trabill_blood_groups.group_id',
        'trabill_employees.employee_bloodgroup_id'
      )
      .whereNot('employee_is_deleted', 1)
      .andWhere('employee_org_agency', this.org_agency)
      .orderBy('employee_full_name');
  }
}

export default EmployeeModel;
