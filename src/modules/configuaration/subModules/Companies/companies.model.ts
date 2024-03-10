import AbstractModels from '../../../../abstracts/abstract.models';
import { idType } from '../../../../common/types/common.types';
import { CompanyReqBody } from '../../types/configuration.interfaces';

class CompanyModel extends AbstractModels {
  public async createCompany(data: CompanyReqBody) {
    const visaType = await this.query()
      .insert({ ...data, company_org_agency: this.org_agency })
      .into('trabill_companies');

    return visaType[0];
  }

  public async updateCompany(data: CompanyReqBody, company_id: idType) {
    return await this.query()
      .into('trabill_companies')
      .update(data)
      .where('company_id', company_id);
  }

  public async deleteCompany(company_id: idType, company_deleted_by: idType) {
    return await this.query()
      .into('trabill_companies')
      .update({ company_is_deleted: 1, company_deleted_by })
      .where('company_id', company_id);
  }

  public async viewCompanies(page: number, size: number) {
    const page_number = (page - 1) * size;

    const data = await this.query()
      .select(
        'company_id',
        'company_name',
        'company_contact_person',
        'company_designation',
        'company_phone',
        'company_create_date',
        'company_address',
        'company_org_agency as agency_id'
      )
      .from('trabill_companies')
      .where('company_is_deleted', 0)
      .andWhere('company_org_agency', this.org_agency)
      .orderBy('company_id', 'desc')
      .limit(size)
      .offset(page_number);

    const [{ row_count }] = await this.query()
      .select(this.db.raw('COUNT(*) as row_count'))
      .from('trabill_companies')
      .where('company_is_deleted', 0)
      .andWhere('company_org_agency', this.org_agency);

    return { count: row_count, data };
  }

  public async getAllCompanies() {
    return await this.query()
      .select(
        'company_id',
        'company_name',
        'company_contact_person',
        'company_designation',
        'company_phone',
        'company_create_date',
        'company_address',
        'company_org_agency as agency_id'
      )
      .from('trabill_companies')
      .where('company_is_deleted', 0)
      .andWhere('company_org_agency', this.org_agency)
      .orderBy('company_id', 'desc');
  }
}

export default CompanyModel;
