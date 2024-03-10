import { Request } from 'express';
import AbstractServices from '../../../../abstracts/abstract.services';
import CustomError from '../../../../common/utils/errors/customError';

class ServicesAgency extends AbstractServices {
  constructor() {
    super();
  }

  public createAgency = async (req: Request) => {
    const agency_id = await this.models.configModel
      .agencyModel(req)
      .createAgency(req.body);

    return { success: true, data: { agency_id } };
  };

  public updateAgency = async (req: Request) => {
    const { agency_id } = req.params;

    const data = await this.models.configModel
      .agencyModel(req)
      .updateAgency(req.body, agency_id);

    if (data === 0) {
      throw new CustomError(
        'Please provide a valid Id to update',
        400,
        'Update failed'
      );
    }

    return { success: true, data };
  };

  public viewAgencies = async (req: Request) => {
    const { page, size } = req.query;

    const data = await this.models.configModel
      .agencyModel(req)
      .viewAgencies(Number(page) || 1, Number(size) || 20);

    const count = await this.models.configModel
      .agencyModel(req)
      .countAgencysDataRow();

    return { success: true, count, data };
  };
  public getAgencies = async (req: Request) => {
    const data = await this.models.configModel.agencyModel(req).getAgencies();

    return { success: true, data };
  };

  public deleteAgency = async (req: Request) => {
    const { agency_id } = req.params;
    const { delete_by } = req.body as { delete_by: number };

    const data = await this.models.configModel
      .agencyModel(req)
      .deleteAgencies(agency_id, delete_by);

    return { success: true, data };
  };
}

export default ServicesAgency;
