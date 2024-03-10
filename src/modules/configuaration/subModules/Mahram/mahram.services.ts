import { Request } from 'express';
import AbstractServices from '../../../../abstracts/abstract.services';
import CustomError from '../../../../common/utils/errors/customError';

class ServicesMahram extends AbstractServices {
  constructor() {
    super();
  }

  public T_createMahram = async (req: Request) => {
    const data = await this.models.configModel
      .mahramModel(req)
      .createMahram(req.body);

    return { success: true, data: { maharam_id: data } };
  };

  public T_updateMahram = async (req: Request) => {
    const { maharam_id } = req.params;

    const data = await this.models.configModel
      .mahramModel(req)
      .updateMahram(req.body, maharam_id);

    if (data === 0) {
      throw new CustomError(
        'Please provide a valid Id to update',
        400,
        'Update failed'
      );
    }
    return { success: true, data };
  };

  public viewMahrams = async (req: Request) => {
    const { page, size } = req.query;

    const data = await this.models.configModel
      .mahramModel(req)
      .viewMahrams(Number(page) || 1, Number(size) || 20);

    const count = await this.models.configModel
      .mahramModel(req)
      .countMahramsDataRow();

    return { success: true, count, data };
  };

  public getAllMahrams = async (req: Request) => {
    const data = await this.models.configModel.mahramModel(req).getAllMahrams();

    return { success: true, data };
  };

  public T_deleteMahram = async (req: Request) => {
    const { maharam_id } = req.params;
    const { deleted_by } = req.body as { deleted_by: number };

    const data = await this.models.configModel
      .mahramModel(req)
      .deleteMahram(maharam_id, deleted_by);

    return { success: true, data };
  };
}

export default ServicesMahram;
