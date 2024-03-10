import { Request } from 'express';

import AbstractServices from '../../../../abstracts/abstract.services';
import CustomError from '../../../../common/utils/errors/customError';

class ServicesDesignations extends AbstractServices {
  constructor() {
    super();
  }

  public createDesignation = async (req: Request) => {
    const data = await this.models.configModel
      .designationModel(req)
      .createDesignation(req.body);

    return {
      success: true,
      data: { designation_id: data },
    };
  };

  public viewDesignations = async (req: Request) => {
    const { page, size } = req.query;

    const data = await this.models.configModel
      .designationModel(req)
      .viewDesignations(Number(page) || 0, Number(size) || 20);

    const count = await this.models.configModel
      .designationModel(req)
      .countDesignationsDataRow();

    return { success: true, count, data };
  };

  public getAllDesignations = async (req: Request) => {
    const data = await this.models.configModel
      .designationModel(req)
      .getAllDesignations();

    return { success: true, data };
  };

  public deleteDesignation = async (req: Request) => {
    const { id } = req.params;

    const { deleted_by } = req.body as { deleted_by: number };

    const data = await this.models.configModel
      .designationModel(req)
      .deleteDesignation(id, deleted_by);

    return { success: true, data };
  };

  /**
   * edit designation by id
   */
  public editDesignation = async (req: Request) => {
    const { id } = req.params;

    const data = await this.models.configModel
      .designationModel(req)
      .editDesignation(req.body, id);

    if (data) {
      return {
        success: true,
        data,
      };
    } else {
      throw new CustomError('Please provide a valid Id', 400, 'Bad request');
    }
  };
}

export default ServicesDesignations;
