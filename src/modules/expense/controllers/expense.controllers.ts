import { Request, Response } from 'express';
import AbstractController from '../../../abstracts/abstract.controllers';
import ExpneseService from '../services/expense.services';
import ExpenseValidator from '../validators/expense.validator';

class ExpenseContorller extends AbstractController {
  private services = new ExpneseService();
  private validator = new ExpenseValidator();

  constructor() {
    super();
  }

  public createExpense = this.assyncWrapper.wrap(
    this.validator.createExpense,
    async (req: Request, res: Response) => {
      const data = await this.services.addExpense(req);

      if (data.success) {
        res.status(201).json(data);
      } else {
        this.error('Create Expense');
      }
    }
  );

  public allExpenses = this.assyncWrapper.wrap(
    this.validator.readExpense,
    async (req: Request, res: Response) => {
      const data = await this.services.allExpenses(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('All expenses');
      }
    }
  );

  public deleteExpense = this.assyncWrapper.wrap(
    this.validator.deleteExpense,
    async (req: Request, res: Response) => {
      const data = await this.services.deleteExpense(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Delete expense failed');
      }
    }
  );

  public singleExpenses = this.assyncWrapper.wrap(
    this.validator.readExpense,
    async (req: Request, res: Response) => {
      const data = await this.services.singleExpenses(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Single expenses');
      }
    }
  );

  public editExpense = this.assyncWrapper.wrap(
    this.validator.updateExpense,
    async (req: Request, res: Response) => {
      const data = await this.services.editExpense(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Edit expense');
      }
    }
  );

  public expenseInfos = this.assyncWrapper.wrap(
    this.validator.readExpense,
    async (req: Request, res: Response) => {
      const data = await this.services.expenseInfos(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('expense infos');
      }
    }
  );

  public expenseCheques = this.assyncWrapper.wrap(
    this.validator.readExpense,
    async (req: Request, res: Response) => {
      const data = await this.services.expenseCheques(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('expense infos');
      }
    }
  );
}

export default ExpenseContorller;
