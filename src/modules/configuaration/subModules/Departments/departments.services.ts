import { Request } from 'express';

import AbstractServices from '../../../../abstracts/abstract.services';
import CustomError from '../../../../common/utils/errors/customError';

class ServicesDepartments extends AbstractServices {
  constructor() {
    super();
  }

  public createDepartment = async (req: Request) => {
    const data = await this.models.configModel
      .departmentsModel(req)
      .createDepartment(req.body);

    return {
      success: true,
      data: { department_id: data },
    };
  };

  public viewDepartment = async (req: Request) => {
    const { page, size } = req.query;

    const data = await this.models.configModel
      .departmentsModel(req)
      .viewDepartments(Number(page) || 1, Number(size) || 20);

    const count = await this.models.configModel
      .departmentsModel(req)
      .countDepartmentDataRow();

    return { success: true, count, data };
  };

  public getAllDepartments = async (req: Request) => {
    const data = await this.models.configModel
      .departmentsModel(req)
      .getAllDepartments();

    return { success: true, data };
  };

  public editDepartment = async (req: Request) => {
    const { id } = req.params;

    const data = await this.models.configModel
      .departmentsModel(req)
      .editDepartment(req.body, id);

    if (data === 0) {
      throw new CustomError('Please provide a valid Id', 400, 'Update failed');
    }

    return {
      success: true,
      message: 'Department updated successfully',
      data,
    };
  };

  public deleteDepartment = async (req: Request) => {
    const { id } = req.params;

    const { deleted_by } = req.body as { deleted_by: number };

    const data = await this.models.configModel
      .departmentsModel(req)
      .deleteDepartment(id, deleted_by);

    return { success: true, data };
  };
}

export default ServicesDepartments;
