import AbstractModels from '../../../../abstracts/abstract.models';
import { idType } from '../../../../common/types/common.types';
import CustomError from '../../../../common/utils/errors/customError';
import { ITransportTypes } from './transportType.types';

class TransportTypeModels extends AbstractModels {
  public async insertTransportType(data: ITransportTypes) {
    const id = await this.query()
      .insert({ ...data, ttype_org_agency: this.org_agency })
      .into('trabill_transport_types');

    return id[0];
  }

  public async viewTransportTypes(page: number, size: number) {
    const page_number = (page - 1) * size;

    return await this.query()
      .from('trabill_transport_types')
      .select(
        'ttype_id',
        'ttype_name',
        'ttype_status',
        'ttype_create_date',
        'ttype_org_agency as agency_id'
      )
      .where('ttype_org_agency', null)
      .orWhere('ttype_org_agency', this.org_agency)
      .whereNot('ttype_has_deleted', 1)
      .orderBy('ttype_name')
      .limit(size)
      .offset(page_number);
  }

  public async countTransportType() {
    const [count] = await this.query()
      .select(this.db.raw(`count(*) as row_count`))
      .from('trabill_transport_types')
      .where('ttype_org_agency', null)
      .orWhere('ttype_org_agency', this.org_agency)
      .whereNot('ttype_has_deleted', 1);

    return count.row_count;
  }

  public async getAllTransportTypes() {
    const by_default = await this.query()
      .select(
        'ttype_id',
        'ttype_name',
        'ttype_status',
        'ttype_create_date',
        'ttype_org_agency as agency_id'
      )
      .andWhere('ttype_org_agency', null)
      .andWhereNot('ttype_has_deleted', 1)
      .orderBy('ttype_id', 'desc');

    const by_client = await this.query()
      .from('trabill_transport_types')
      .select(
        'ttype_id',
        'ttype_name',
        'ttype_status',
        'ttype_create_date',
        'ttype_org_agency as agency_id'
      )
      .andWhere('ttype_org_agency', this.org_agency)
      .whereNot('ttype_has_deleted', 1)
      .orderBy('ttype_id', 'desc');

    return [...by_client, ...by_default];
  }

  public async updateTransportType(data: ITransportTypes, id: idType) {
    const isSuccess = await this.query()
      .into('trabill_transport_types')
      .update(data)
      .whereNot('ttype_has_deleted', 1)
      .andWhere('ttype_id', id)
      .whereNotNull('ttype_org_agency');
    if (isSuccess === 0) {
      throw new CustomError('Please provide a valid Id', 400, 'Bad request');
    }
  }

  public async deleteTransportType(id: idType, ttype_deleted_by: idType) {
    const isSuccess = await this.query()
      .into('trabill_transport_types')
      .update({ ttype_has_deleted: 1, ttype_deleted_by })
      .where('ttype_id', id)
      .whereNotNull('ttype_org_agency')
      .andWhereNot('ttype_has_deleted', 1);

    if (isSuccess === 0) {
      throw new CustomError('Please provide valid id', 400, 'Bad request');
    }
  }
}

export default TransportTypeModels;
