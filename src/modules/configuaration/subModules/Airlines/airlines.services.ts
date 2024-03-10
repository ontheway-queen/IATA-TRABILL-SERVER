import { Request } from 'express';
import AbstractServices from '../../../../abstracts/abstract.services';
import CustomError from '../../../../common/utils/errors/customError';

class ServicesAirlines extends AbstractServices {
  constructor() {
    super();
  }

  public createAirlines = async (req: Request) => {
    const data = await this.models.configModel
      .airlineModel(req)
      .createAirlines(req.body);

    return { success: true, data: { airline_id: data } };
  };

  public updateAirline = async (req: Request) => {
    const { airline_id } = req.params;

    const data = await this.models.configModel
      .airlineModel(req)
      .updateAirlines(req.body, airline_id);

    if (data === 0) {
      throw new CustomError(
        'Please provide a valid Id to update',
        400,
        'Update failed'
      );
    }
    return { success: true, data };
  };

  public deleteAirLines = async (req: Request) => {
    const { airline_id } = req.params;
    const { deleted_by } = req.body as { deleted_by: number };

    const data = await this.models.configModel
      .airlineModel(req)
      .deleteAirline(airline_id, deleted_by);

    return { success: true, data };
  };

  public viewAirlines = async (req: Request) => {
    const { page, size } = req.query;

    const data = await this.models.configModel
      .airlineModel(req)
      .viewAirlines(Number(page) || 1, Number(size) || 20);

    const count = await this.models.configModel
      .airlineModel(req)
      .countAirliensDataRow();

    return { success: true, count, data };
  };
  public getAirlines = async (req: Request) => {
    const data = await this.models.configModel.airlineModel(req).getAirlines();

    return { success: true, data };
  };
}
export default ServicesAirlines;
