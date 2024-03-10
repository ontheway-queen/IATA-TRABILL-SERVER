import { Request, Response } from 'express';
import AbstractController from '../../../../abstracts/abstract.controllers';
import ServicesExpenseHead from './expenseHead.sevices';
import ExpenseHeadValidator from './expenseHead.validators';

class ControllersExpenseHead extends AbstractController {
  private servicesExpenseHead = new ServicesExpenseHead();
  private validator = new ExpenseHeadValidator();
  constructor() {
    super();
  }

  public createControllerExpenseHead = this.assyncWrapper.wrap(
    this.validator.createExpenseHead,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.servicesExpenseHead.CreateExpenseHead(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public updateControllerExpenseHead = this.assyncWrapper.wrap(
    this.validator.editExpenseHead,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.servicesExpenseHead.UpdateExpenseHead(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public viewExpenseHeads = this.assyncWrapper.wrap(
    this.validator.readExpenseHead,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.servicesExpenseHead.viewExpenseHeads(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public getAllExpenseHeads = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.servicesExpenseHead.getAllExpenseHeads(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public deleteControllerExpenseHead = this.assyncWrapper.wrap(
    this.validator.deleteExpenseHead,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.servicesExpenseHead.DeleteExpenseHead(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
}

export default ControllersExpenseHead;
