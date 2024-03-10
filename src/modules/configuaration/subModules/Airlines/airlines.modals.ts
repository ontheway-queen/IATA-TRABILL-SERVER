import AbstractModels from '../../../../abstracts/abstract.models';
import { idType } from '../../../../common/types/common.types';

class AirlineModel extends AbstractModels {
  public async createAirlines(data: { airline_name: string }) {
    const airline = await this.query()
      .insert({ ...data, airline_org_agency: this.org_agency })
      .into('trabill_airlines');

    return airline[0];
  }

  public async updateAirlines(
    data: { airline_name: string },
    airline_id: idType
  ) {
    return await this.query()
      .into('trabill_airlines')
      .update(data)
      .where('airline_id', airline_id)
      .where('airline_is_deleted', 0);
  }

  public async deleteAirline(airline_id: idType, airline_deleted_by: idType) {
    return await this.query()
      .into('trabill_airlines')
      .update({ airline_is_deleted: 1, airline_deleted_by })
      .where('airline_id', airline_id);
  }

  public async viewAirlines(page: number, size: number) {
    const page_number = (page - 1) * size;

    return (await this.query()
      .from('trabill_airlines')
      .select(
        'airline_id',
        'airline_name',
        'airline_org_agency as agency_id',
        'airline_create_date'
      )
      .where('airline_is_deleted', 0)
      .andWhere('airline_org_agency', this.org_agency)
      .union(
        this.query()
          .from('trabill_airlines')
          .select(
            'airline_id',
            'airline_name',
            'airline_org_agency as agency_id',
            'airline_create_date'
          )
          .where('airline_is_deleted', 0)
          .andWhere('airline_org_agency', null)
      )
      .orderBy('airline_create_date', 'desc')
      .limit(size)
      .offset(page_number)) as {
      airline_id: number;
      airline_name: string;
    }[];
  }

  public async countAirliensDataRow() {
    const [count] = await this.query()
      .select(this.db.raw('COUNT(*) as row_count'))
      .from('trabill_airlines')
      .where('airline_is_deleted', 0)
      .andWhere('airline_org_agency', null)
      .orWhere('airline_org_agency', this.org_agency);

    return count.row_count;
  }

  public async getAirlines() {
    const by_clients = await this.query()
      .from('trabill_airlines')
      .select('airline_id', 'airline_name', 'airline_org_agency as agency_id')
      .where('airline_is_deleted', 0)
      .orderBy('airline_create_date', 'desc')
      .andWhere('airline_org_agency', this.org_agency);

    const by_default = await this.query()
      .from('trabill_airlines')
      .select('airline_id', 'airline_name', 'airline_org_agency as agency_id')
      .where('airline_is_deleted', 0)
      .orderBy('airline_create_date', 'desc')
      .andWhere('airline_org_agency', null);

    return [...by_clients, ...by_default];
  }
}

export default AirlineModel;
