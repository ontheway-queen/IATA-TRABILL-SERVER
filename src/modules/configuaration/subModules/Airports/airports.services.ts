import { Request } from 'express';

import AbstractServices from '../../../../abstracts/abstract.services';
import CustomError from '../../../../common/utils/errors/customError';
import { AirportReqBody } from '../../types/configuration.interfaces';

class ServicesAirports extends AbstractServices {
  constructor() {
    super();
  }

  public createAirports = async (req: Request) => {
    const insertBody = [] as AirportReqBody[];

    for (let i = 0; i < req.body.airport_info.length; i++) {
      insertBody.push({
        ...req.body.airport_info[i],
        airline_country_id: req.body.airline_country_id,
        airline_created_by: req.body.airline_created_by,
      });
    }

    const data = await this.models.configModel
      .airportsModel(req)
      .createAirports(insertBody);

    return { success: true, data: data };
  };

  public viewAirports = async (req: Request) => {
    const { page, size } = req.query;

    const data = await this.models.configModel
      .airportsModel(req)
      .viewAirports(Number(page) || 1, Number(size) || 20);

    const count = await this.models.configModel
      .airportsModel(req)
      .countAirportsDataRow();

    return { success: true, count, data };
  };

  public getAllAirports = async (req: Request) => {
    const data = await this.models.configModel
      .airportsModel(req)
      .getAllAirports();

    return { success: true, data };
  };

  public getAirportById = async (req: Request) => {
    const { id } = req.params;
    const data = await this.models.configModel
      .airportsModel(req)
      .getAirportById(id);

    return { success: true, data: data };
  };

  public deleteAirportsById = async (req: Request) => {
    const { airline_id } = req.params;
    const { deleted_by } = req.body as { deleted_by: number };

    const data = await this.models.configModel
      .airportsModel(req)
      .deleteAirport(airline_id, deleted_by);

    return { success: true, data };
  };

  public editAirportsById = async (req: Request) => {
    const { id } = req.params;

    const data = await this.models.configModel
      .airportsModel(req)
      .editAirport(req.body, id);

    if (data === 0) {
      throw new CustomError(
        'Please provide a valid Id to update',
        400,
        'Update failed'
      );
    }

    return { success: true, data };
  };

  public viewAllCountries = async (req: Request) => {
    const data = await this.models.configModel
      .airportsModel(req)
      .getAllCountries();

    return { success: true, data };
  };
}

export default ServicesAirports;
