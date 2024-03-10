import { Request } from 'express';

import AbstractServices from '../../../../abstracts/abstract.services';
import CustomError from '../../../../common/utils/errors/customError';

class ServicesClientCategories extends AbstractServices {
  constructor() {
    super();
  }

  public createClientCategory = async (req: Request) => {
    const data = await this.models.configModel
      .clientCategoryModel(req)
      .createClientCategory(req.body);

    return { success: true, data: data };
  };

  public getAllClientCategories = async (req: Request) => {
    const data = await this.models.configModel
      .clientCategoryModel(req)
      .getAllClientCategories();

    return { success: true, data };
  };

  public getClientCategories = async (req: Request) => {
    const { page, size } = req.query;

    const data = await this.models.configModel
      .clientCategoryModel(req)
      .getClientCategories(Number(page) || 1, Number(size) || 20);

    const count = await this.models.configModel
      .clientCategoryModel(req)
      .countClientCategory();

    return { success: true, count, data };
  };

  public deleteClientCategoryById = async (req: Request) => {
    const { category_id } = req.params;
    const { deleted_by } = req.body as { deleted_by: number };

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.configModel.clientCategoryModel(req, trx);

      const clients = await conn.clients(category_id);

      if (clients.length) {
        throw new CustomError(
          'Category can not be deleted, there are clients with this category',
          400,
          'Bad request'
        );
      } else {
        await conn.deleteClientCategory(category_id, deleted_by);
      }

      return {
        success: true,
        message: `client category has been deleted`,
      };
    });
  };

  /**
   * edit client category by id
   */
  public editClientCategoryById = async (req: Request) => {
    const { category_id } = req.params;

    const data = await this.models.configModel
      .clientCategoryModel(req)
      .editClientCategory(req.body, category_id);

    if (data) {
      return {
        success: true,
        message: 'Client category updated successfully.',
        data,
      };
    } else {
      throw new CustomError('Please provide a valid Id', 400, 'Bad request');
    }
  };
}

export default ServicesClientCategories;
