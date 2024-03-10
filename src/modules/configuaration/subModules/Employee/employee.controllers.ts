import { Request, Response } from 'express';
import AbstractController from '../../../../abstracts/abstract.controllers';
import ServicesEmployee from './employee.services';
import EmployeeValidator from './employee.validators';

class ControllersEmployee extends AbstractController {
  private servicesEmployee = new ServicesEmployee();
  private validator = new EmployeeValidator();

  constructor() {
    super();
  }

  public createControllerEmployee = this.assyncWrapper.wrap(
    this.validator.createEmployee,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.servicesEmployee.CreateEmployee(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public updateControllerEmployee = this.assyncWrapper.wrap(
    this.validator.eidtEmployee,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.servicesEmployee.UpdateEmployee(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public viewEmployees = this.assyncWrapper.wrap(
    this.validator.readEmployee,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.servicesEmployee.viewEmployees(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public getAllEmployees = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.servicesEmployee.getAllEmployees(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public getEmployeeById = this.assyncWrapper.wrap(
    this.validator.readEmployee,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.servicesEmployee.getEmployeeById(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public deleteControllerEmployee = this.assyncWrapper.wrap(
    this.validator.deleteEmployee,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.servicesEmployee.DeleteEmployee(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public readControllerBloodGroup = this.assyncWrapper.wrap(
    this.validator.readEmployee,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.servicesEmployee.readBloodGroup(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
}

export default ControllersEmployee;
