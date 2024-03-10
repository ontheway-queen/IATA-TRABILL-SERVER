import { Request } from 'express';

import AbstractServices from '../../../../abstracts/abstract.services';
import CustomError from '../../../../common/utils/errors/customError';

class ServicesRoomTypes extends AbstractServices {
  constructor() {
    super();
  }

  public createRoomType = async (req: Request) => {
    const data = await this.models.configModel
      .roomTypeModel(req)
      .createRoomType(req.body);

    return {
      success: true,
      data: { rtype_id: data },
    };
  };

  public viewRoomTypes = async (req: Request) => {
    const { page, size } = req.query;

    const data = await this.models.configModel
      .roomTypeModel(req)
      .viewRoomTypes(Number(page), Number(size) || 20);

    const count = await this.models.configModel
      .roomTypeModel(req)
      .countRoomTypeDataRow();

    return { success: true, count, data };
  };

  public getAllRoomTypes = async (req: Request) => {
    const data = await this.models.configModel
      .roomTypeModel(req)
      .getAllRoomTypes();

    return { success: true, data };
  };

  public editRoomType = async (req: Request) => {
    const { id } = req.params;

    const data = await this.models.configModel
      .roomTypeModel(req)
      .editRoomType(req.body, id);

    if (data) {
      return {
        success: true,
        data,
      };
    } else {
      throw new CustomError('Please provide a valid Id', 400, 'Bad request');
    }
  };

  public deleteRoomType = async (req: Request) => {
    const { id } = req.params;
    const data = await this.models.configModel
      .roomTypeModel(req)
      .deleteRoomType(id);

    return { success: true, data };
  };
}

export default ServicesRoomTypes;
