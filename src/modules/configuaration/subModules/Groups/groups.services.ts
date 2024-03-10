import { Request } from 'express';
import AbstractServices from '../../../../abstracts/abstract.services';
import CustomError from '../../../../common/utils/errors/customError';

class ServicesGroups extends AbstractServices {
  constructor() {
    super();
  }

  public T_createGroups = async (req: Request) => {
    const data = await this.models.configModel
      .groupModel(req)
      .createGroup(req.body);

    return { success: true, data: { group_id: data } };
  };

  public T_updateGroups = async (req: Request) => {
    const { group_id } = req.params;

    const data = await this.models.configModel
      .groupModel(req)
      .updateGroup(req.body, group_id);

    if (data === 0) {
      throw new CustomError(
        'Please provide a valid Id to update',
        400,
        'Update failed'
      );
    }
    return { success: true, data };
  };

  public viewGroups = async (req: Request) => {
    const { page, size } = req.query;

    const data = await this.models.configModel
      .groupModel(req)
      .viewGroups(Number(page) || 1, Number(size) || 20);

    const count = await this.models.configModel
      .groupModel(req)
      .countGroupsDataRow();

    return { success: true, count, data };
  };

  public getAllGroups = async (req: Request) => {
    const data = await this.models.configModel.groupModel(req).getAllGroups();

    return { success: true, data };
  };

  public T_deleteGroups = async (req: Request) => {
    const { group_id } = req.params;
    const { deleted_by } = req.body as { deleted_by: number };

    const data = await this.models.configModel
      .groupModel(req)
      .deleteGroups(group_id, deleted_by);

    return { success: true, data };
  };
}

export default ServicesGroups;
