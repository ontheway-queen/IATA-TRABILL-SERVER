import AbstractModels from '../../../../abstracts/abstract.models';

class PnrDetailsModels extends AbstractModels {
  public async airportIdByCode(airportCode: string) {
    const [data] = await this.query()
      .select('airline_id')
      .from('trabill_airports')
      .whereNot('airline_is_deleted', 1)
      .andWhere('airline_iata_code', airportCode);

    return data.airline_id;
  }

  public async airlineIdByCode(airlineCode: string) {
    const [data] = await this.query()
      .select('airline_id')
      .from('trabill_airlines')
      .whereNot('airline_is_deleted', 1)
      .andWhere('airline_code', airlineCode);

    return data.airline_id;
  }
}

export default PnrDetailsModels;
