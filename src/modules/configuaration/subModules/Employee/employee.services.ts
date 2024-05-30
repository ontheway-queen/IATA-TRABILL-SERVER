import { Request } from 'express';
import AbstractServices from '../../../../abstracts/abstract.services';
import CustomError from '../../../../common/utils/errors/customError';

class ServicesEmployee extends AbstractServices {
  constructor() {
    super();
  }

  public CreateEmployee = async (req: Request) => {
    const conn = this.models.configModel.employeeModel(req);
    await conn.getSineAndId(
      req.body.employee_creation_sign,
      req.body.employee_card_id
    );

    const data = await conn.createEmployee(req.body);

    return { success: true, data: { employee_id: data } };
  };

  public UpdateEmployee = async (req: Request) => {
    const { employee_id } = req.params;

    const data = await this.models.configModel
      .employeeModel(req)
      .updateEmployee(req.body, employee_id);

    if (data === 0) {
      throw new CustomError(
        'Please provide a valid Id to update',
        400,
        'Update failed'
      );
    }

    return { success: true, data };
  };

  public viewEmployees = async (req: Request) => {
    const { page, size } = req.query;

    const data = await this.models.configModel
      .employeeModel(req)
      .viewEmployees(Number(page) || 1, Number(size) || 20);

    return { success: true, ...data };
  };

  public getAllEmployees = async (req: Request) => {
    const { search } = req.query;

    const data = await this.models.configModel
      .employeeModel(req)
      .getAllEmployees(search as string);

    return { success: true, data };
  };

  public getEmployeeById = async (req: Request) => {
    const employeeId = req.params.id;

    const data = await this.models.configModel
      .employeeModel(req)
      .getEmployeeById(employeeId);

    return { success: true, data };
  };

  public DeleteEmployee = async (req: Request) => {
    const { employee_id } = req.params;
    const { deleted_by } = req.body as { deleted_by: number };

    const data = await this.models.configModel
      .employeeModel(req)
      .deleteEmployee(employee_id, deleted_by);

    return { success: true, data };
  };

  public readBloodGroup = async (req: Request) => {
    const data = await this.models.configModel
      .employeeModel(req)
      .getAllBloodGroups();

    return { success: true, data };
  };
}

export default ServicesEmployee;
