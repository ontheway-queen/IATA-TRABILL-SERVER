import AbstractModels from '../../../../abstracts/abstract.models';
import { idType } from '../../../../common/types/common.types';
import { ClientCategoryReqBody } from '../../types/configuration.interfaces';

class ClientCategoryModel extends AbstractModels {
  public async createClientCategory(data: ClientCategoryReqBody) {
    const clientCategory = await this.query()
      .insert({ ...data, category_org_agency: this.org_agency })
      .into('trabill_client_categories');

    return clientCategory[0];
  }

  public async getAllClientCategories() {
    const by_clients = await this.query()
      .select(
        'category_id',
        'category_title',
        'category_prefix',
        'category_org_agency as agency_id'
      )
      .from('trabill_client_categories')
      .where('category_org_agency', this.org_agency)
      .where('category_is_deleted', 0);

    const by_default = await this.query()
      .select(
        'category_id',
        'category_title',
        'category_prefix',
        'category_org_agency as agency_id'
      )
      .from('trabill_client_categories')
      .where('category_org_agency', null)
      .where('category_is_deleted', 0);

    return [...by_clients, ...by_default];
  }

  public async getClientCategories(page: number, size: number) {
    const page_number = (page - 1) * size;

    const getData = (agency: null | idType) => {
      return this.query()
        .select(
          'category_id',
          'category_title',
          'category_prefix',
          'category_org_agency as agency_id',
          'category_is_deleted'
        )
        .from('trabill_client_categories')
        .where('category_is_deleted', 0)
        .andWhere('category_org_agency', agency)
        .limit(size)
        .offset(page_number);
    };

    const defaultData = await getData(null);
    const agencyData = await getData(this.org_agency);

    return [...agencyData, ...defaultData];
  }

  public async countClientCategory() {
    const [count] = await this.query()
      .select(this.db.raw(`count(*) as row_count`))
      .from('trabill_client_categories')
      .where('category_org_agency', null)
      .orWhere('category_org_agency', this.org_agency)
      .where('category_is_deleted', 0);

    return count.row_count;
  }

  public async clients(category_id: string | number) {
    return await this.query()
      .select('client_id')
      .from('trabill_clients')
      .where('client_category_id', category_id)
      .andWhereNot('client_is_deleted', 1);
  }

  public async deleteClientCategory(
    category_id: idType,
    category_deleted_by: idType
  ) {
    return await this.query()
      .into('trabill_client_categories')
      .update({ category_is_deleted: 1, category_deleted_by })
      .where('category_id', category_id);
  }

  public async editClientCategory(data: ClientCategoryReqBody, id: idType) {
    return await this.query()
      .into('trabill_client_categories')
      .update(data)
      .where('trabill_client_categories.category_id', id);
  }
}

export default ClientCategoryModel;
