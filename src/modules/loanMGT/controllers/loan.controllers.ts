import { Request, Response } from 'express';
import AbstractController from '../../../abstracts/abstract.controllers';
import LoanServices from '../services/loan.services';
import LoanValidator from '../validators/loan.validator';

class LoanControllers extends AbstractController {
  private services = new LoanServices();
  private validator = new LoanValidator();

  constructor() {
    super();
  }

  public addLoanAuthority = this.assyncWrapper.wrap(
    this.validator.addLoanAuthority,
    async (req: Request, res: Response) => {
      const data = await this.services.addLoanAuthrity(req);

      if (data.success) {
        res.status(201).json(data);
      } else {
        this.error('Add Loan Authority');
      }
    }
  );

  public editLoanAuhtority = this.assyncWrapper.wrap(
    this.validator.editLoanAuthority,
    async (req: Request, res: Response) => {
      const data = await this.services.editLoanAuthority(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Edit Loan Auhtority');
      }
    }
  );

  public deleteLoanAuthority = this.assyncWrapper.wrap(
    this.validator.deleteLoan,
    async (req: Request, res: Response) => {
      const data = await this.services.deleteAuthority(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Delete authority');
      }
    }
  );

  public getLoanAuthorities = this.assyncWrapper.wrap(
    this.validator.readLoan,
    async (req: Request, res: Response) => {
      const data = await this.services.getLoanAuthorities(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Get all loan authorities');
      }
    }
  );
  public getALLLoanAuthority = this.assyncWrapper.wrap(
    this.validator.readLoan,
    async (req: Request, res: Response) => {
      const data = await this.services.getALLLoanAuthority(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Get all loan authorities');
      }
    }
  );

  public addLoan = this.assyncWrapper.wrap(
    this.validator.addLoan,
    async (req: Request, res: Response) => {
      const data = await this.services.addLoan(req);

      if (data.success) {
        res.status(201).json(data);
      } else {
        this.error('Add Loan');
      }
    }
  );

  public getLoans = this.assyncWrapper.wrap(
    this.validator.readLoan,
    async (req: Request, res: Response) => {
      const data = await this.services.getLoans(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('All Loans');
      }
    }
  );

  public getLoan = this.assyncWrapper.wrap(
    this.validator.readLoan,
    async (req: Request, res: Response) => {
      const data = await this.services.getLoan(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Single Loan');
      }
    }
  );

  public editLoan = this.assyncWrapper.wrap(
    this.validator.editLoan,
    async (req: Request, res: Response) => {
      const data = await this.services.editLoan(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Edit Loan');
      }
    }
  );

  public deleteLoan = this.assyncWrapper.wrap(
    this.validator.deleteLoan,
    async (req: Request, res: Response) => {
      const data = await this.services.deleteLoan(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Delete Loan');
      }
    }
  );

  /**
   * get loans by loan_type: taking, already_taken
   */
  public loansForPayment = this.assyncWrapper.wrap(
    this.validator.readLoan,
    async (req: Request, res: Response) => {
      const data = await this.services.loansForPayment(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('get loan by type: taking, already_taken');
      }
    }
  );

  public addPayment = this.assyncWrapper.wrap(
    this.validator.addPayment,
    async (req: Request, res: Response) => {
      const data = await this.services.addPayment(req);

      if (data.success) {
        res.status(201).json(data);
      } else {
        this.error('Add Payment');
      }
    }
  );

  public allPayments = this.assyncWrapper.wrap(
    this.validator.readLoan,
    async (req: Request, res: Response) => {
      const data = await this.services.getPayments(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('All payments');
      }
    }
  );

  public singlePayment = this.assyncWrapper.wrap(
    this.validator.readLoan,
    async (req: Request, res: Response) => {
      const data = await this.services.getPayment(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Single payment');
      }
    }
  );

  public editPayment = this.assyncWrapper.wrap(
    this.validator.editPayment,
    async (req: Request, res: Response) => {
      const data = await this.services.editPayment(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Edit payment');
      }
    }
  );

  public deletePayment = this.assyncWrapper.wrap(
    this.validator.deleteLoan,
    async (req: Request, res: Response) => {
      const data = await this.services.deletePayment(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Delete payment');
      }
    }
  );

  public loansForReceive = this.assyncWrapper.wrap(
    this.validator.readLoan,
    async (req: Request, res: Response) => {
      const data = await this.services.loansForReceive(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('get loan by type: giving, already_given');
      }
    }
  );

  public addReceived = this.assyncWrapper.wrap(
    this.validator.addReceived,
    async (req: Request, res: Response) => {
      const data = await this.services.addRecieved(req);

      if (data.success) {
        res.status(201).json(data);
      } else {
        this.error('Add Received');
      }
    }
  );

  public allReceived = this.assyncWrapper.wrap(
    this.validator.readLoan,
    async (req: Request, res: Response) => {
      const data = await this.services.getReceived(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('All Received');
      }
    }
  );

  public singleReceived = this.assyncWrapper.wrap(
    this.validator.readLoan,
    async (req: Request, res: Response) => {
      const data = await this.services.getSingleReceived(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Single Received');
      }
    }
  );

  public editReceived = this.assyncWrapper.wrap(
    this.validator.editReceived,
    async (req: Request, res: Response) => {
      const data = await this.services.editRecieved(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Edit Received');
      }
    }
  );

  public deleteReceived = this.assyncWrapper.wrap(
    this.validator.deleteLoan,
    async (req: Request, res: Response) => {
      const data = await this.services.deleteReceived(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Delete Received');
      }
    }
  );
}

export default LoanControllers;
