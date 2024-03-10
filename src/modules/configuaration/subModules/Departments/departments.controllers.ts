import { Request, Response } from 'express';

import AbstractController from '../../../../abstracts/abstract.controllers';
import ServicesDepartments from './departments.services';
import DepartmentsValidator from './departments.validators';

class ControllersDepartments extends AbstractController {
  private servicesDepartments = new ServicesDepartments();
  private validator = new DepartmentsValidator();

  constructor() {
    super();
  }

  public createDepartment = this.assyncWrapper.wrap(
    this.validator.createDepartment,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.servicesDepartments.createDepartment(req);

      if (data.success) {
        res.status(201).json(data);
      } else {
        this.error();
      }
    }
  );

  public viewDepartment = this.assyncWrapper.wrap(
    this.validator.readDepartment,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.servicesDepartments.viewDepartment(req);

      if (data.success) {
        res.status(200).json(data);
      }
    }
  );

  public getAllDepartments = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.servicesDepartments.getAllDepartments(req);

      if (data.success) {
        res.status(200).json(data);
      }
    }
  );

  public editDepartment = this.assyncWrapper.wrap(
    this.validator.updateDepartment,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.servicesDepartments.editDepartment(req);

      if (data.success) {
        res.status(200).json(data);
      } else this.error();
    }
  );

  public deleteDepartment = this.assyncWrapper.wrap(
    this.validator.deleteDepartment,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.servicesDepartments.deleteDepartment(req);

      if (data.success) {
        res.status(200).json(data);
      } else this.error();
    }
  );
}

export default ControllersDepartments;
