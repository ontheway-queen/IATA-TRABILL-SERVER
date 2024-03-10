import AbstractModels from '../../../../abstracts/abstract.models';
import CustomError from '../../../../common/utils/errors/customError';
import { VisaTypeReqBody } from '../../types/configuration.interfaces';

class VisaTypeModel extends AbstractModels {
  public async createVisaType(data: VisaTypeReqBody) {
    const visaType = await this.query()
      .insert({ ...data, type_org_agency: this.org_agency })
      .into('trabill_visa_types');

    return visaType[0];
  }

  public async editVisaType(data: VisaTypeReqBody, id: number | string) {
    const visaType = await this.query()
      .update(data)
      .into('trabill_visa_types')
      .where('trabill_visa_types.type_id', id)
      .whereNotNull('type_org_agency');

    if (visaType) {
      return visaType;
    } else {
      throw new CustomError(
        `You can't update this visa provide that id you was created`,
        400,
        'Bad ID'
      );
    }
  }

  public async viewVisaType(
    page: string | number = '1',
    size: string | number = '20'
  ) {
    page = Number(page);
    size = Number(size);
    const page_number = (page - 1) * size;

    const visaTypes = await this.query()
      .from('trabill_visa_types')
      .select(
        'type_id',
        'type_name',
        'type_created_by',
        'type_org_agency as agency_id'
      )
      .where('type_org_agency', null)
      .orWhere('type_org_agency', this.org_agency)
      .andWhere('type_is_deleted', 0)
      .orderBy('type_name')
      .limit(size)
      .offset(page_number);

    return visaTypes as {
      type_id: number;
      type_name: string;
      type_created_by: number;
    }[];
  }

  public async countVisaTypeDataRow() {
    const [count] = await this.query()
      .select(this.db.raw(`count(*) as row_count`))
      .from('trabill_visa_types')
      .where('type_org_agency', null)
      .orWhere('type_org_agency', this.org_agency)
      .andWhere('type_is_deleted', 0);

    return count.row_count;
  }

  public async getAllVisaType() {
    const by_clients = await this.query()
      .from('trabill_visa_types')
      .select(
        'type_id',
        'type_name',
        'type_created_by',
        'type_org_agency as agency_id'
      )
      .where('type_org_agency', this.org_agency)
      .andWhere('type_is_deleted', 0)
      .orderBy('type_name');

    const by_default = await this.query()
      .from('trabill_visa_types')
      .select(
        'type_id',
        'type_name',
        'type_created_by',
        'type_org_agency as agency_id'
      )
      .where('type_org_agency', null)
      .andWhere('type_is_deleted', 0)
      .orderBy('type_name');

    return [...by_clients, ...by_default];
  }

  public async deleteVisaType(type_id: number | string) {
    const visaTypes = await this.query()
      .from('trabill_visa_types')
      .update({ type_is_deleted: 1 })
      .where({ type_id })
      .whereNotNull('type_org_agency');

    if (visaTypes) {
      return visaTypes;
    } else {
      throw new CustomError(
        `You can't delete this visa provide that id you was created`,
        400,
        'Bad ID'
      );
    }
  }
}

export default VisaTypeModel;
