import AbstractModels from '../../../../abstracts/abstract.models';
import { idType } from '../../../../common/types/common.types';
import { AirportReqBody } from '../../types/configuration.interfaces';

class AirportsModel extends AbstractModels {
  public async createAirports(data: AirportReqBody[]) {
    const newData = data.map((item) => {
      return { ...item, airline_org_agency: this.org_agency };
    });

    const airport = await this.query().insert(newData).into('trabill_airports');

    return airport[0];
  }

  public async viewAirports(page: number, size: number) {
    const page_number = (page - 1) * size;

    return await this.query()
      .select(
        'airline_id',
        'airline_airport',
        'airline_iata_code',
        'airline_country_id',
        'airline_created_by',
        'airline_org_agency as agency_id',
        'country_name',
        'airline_is_deleted'
      )
      .from('trabill_airports')
      .whereNot('airline_is_deleted', 1)
      .andWhere('airline_org_agency', this.org_agency)
      .orWhere('airline_org_agency', null)
      .orderBy('airline_create_date', 'desc')
      .leftJoin('trabill_countries', {
        'trabill_countries.country_id': 'trabill_airports.airline_country_id',
      })
      .limit(size)
      .offset(page_number);
  }

  public async countAirportsDataRow() {
    const [count] = await this.query()
      .select(this.db.raw(`count(*) as row_count`))
      .from('trabill_airports')
      .where('airline_is_deleted', 0)
      .andWhere('airline_org_agency', null)
      .orWhere('airline_org_agency', this.org_agency);

    return count.row_count;
  }

  public async getAllAirports() {
    const by_clients = await this.query()
      .from('trabill_airports')
      .select(
        'airline_id',
        'airline_airport',
        'airline_iata_code',
        'airline_country_id',
        'airline_created_by',
        'airline_org_agency as agency_id',
        'country_name'
      )
      .leftJoin('trabill_countries', {
        'trabill_countries.country_id': 'trabill_airports.airline_country_id',
      })
      .where('airline_org_agency', this.org_agency)
      .andWhere('airline_is_deleted', 0)
      .orderBy('airline_airport');

    const by_default = await this.query()
      .from('trabill_airports')
      .select(
        'airline_id',
        'airline_airport',
        'airline_iata_code',
        'airline_country_id',
        'airline_created_by',
        'airline_org_agency as agency_id',
        'country_name'
      )
      .leftJoin('trabill_countries', {
        'trabill_countries.country_id': 'trabill_airports.airline_country_id',
      })
      .where('airline_org_agency', null)
      .andWhere('airline_is_deleted', 0)
      .orderBy('airline_airport');

    return [...by_clients, ...by_default];
  }

  public async getAirportById(id: idType) {
    const airport = await this.query()
      .select('airline_id', 'airline_airport', 'airline_iata_code')
      .from('trabill_airports')
      .where('trabill_airports.airline_id', id)
      .leftJoin('trabill_countries', {
        'trabill_countries.country_id': 'trabill_airports.airline_country_id',
      })
      .select('country_name');

    return airport[0];
  }

  public async deleteAirport(airline_id: idType, airline_deleted_by: idType) {
    return await this.query()
      .into('trabill_airports')
      .update({ airline_is_deleted: 1, airline_deleted_by })
      .where('airline_id', airline_id);
  }

  public async editAirport(body: AirportReqBody, id: idType) {
    return await this.query()
      .into('trabill_airports')
      .update(body)
      .where('airline_id', id);
  }

  public async getAllCountries() {
    return await this.query()
      .from('trabill_countries')
      .select('country_id', 'country_name', 'country_iso3', 'country_phonecode')
      .where('countries_org_agency', null)
      .orWhere('countries_org_agency', this.org_agency)
      .andWhereNot('country_is_deleted', 1)
      .orderBy('country_id', 'asc');
  }
}

export default AirportsModel;
