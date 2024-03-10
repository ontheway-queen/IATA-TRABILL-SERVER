import { Request, Response } from 'express';
import AbstractController from '../../../abstracts/abstract.controllers';
import PayrollServices from '../services/payroll.services';
import PayrollValidator from '../validators/payroll.validators';

class PayrollControllers extends AbstractController {
  private services = new PayrollServices();
  private validator = new PayrollValidator();

  constructor() {
    super();
  }

  public createPayroll = this.assyncWrapper.wrap(
    this.validator.createPayroll,
    async (req: Request, res: Response) => {
      const data = await this.services.createPayrolls(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Create Payroll...');
      }
    }
  );

  // get all payroll
  public getAllPayroll = this.assyncWrapper.wrap(
    this.validator.readPayroll,
    async (req: Request, res: Response) => {
      const data = await this.services.getAllPayrolls(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Get all payroll...');
      }
    }
  );

  // get payroll by id
  public getPayrollById = this.assyncWrapper.wrap(
    this.validator.readPayroll,
    async (req: Request, res: Response) => {
      const data = await this.services.getPayrollsById(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Get payroll by id...');
      }
    }
  );

  // update payroll
  public editPayroll = this.assyncWrapper.wrap(
    this.validator.updatePayroll,
    async (req: Request, res: Response) => {
      const data = await this.services.editPayrolls(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Update payroll...');
      }
    }
  );

  // delete payroll
  public deletePayroll = this.assyncWrapper.wrap(
    this.validator.deletePayroll,
    async (req: Request, res: Response) => {
      const data = await this.services.deletePayrolls(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Delete payroll...');
      }
    }
  );

  public viewEmployeeCommission = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.services.viewEmployeeCommission(req);

      if (data.success) {
        res.status(200).json(data);
      }
    }
  );
}
export default PayrollControllers;
