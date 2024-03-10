import { Request, Response } from 'express';
import AbstractController from '../../../../abstracts/abstract.controllers';
import ClientServices from '../services/client.services';
import ClientValidator from '../validators/client.validator';

class ClientControllers extends AbstractController {
  private validator = new ClientValidator();
  private services = new ClientServices();

  constructor() {
    super();
  }

  // CREATE CLIENT
  public addClient = this.assyncWrapper.wrap(
    this.validator.addEditClient,
    async (req: Request, res: Response) => {
      const data = await this.services.addClient(req);
      if (data.success) {
        res.status(201).json(data);
      } else {
        this.error('add client controller');
      }
    }
  );

  // UPDATE CLIENT STATUS
  public updateClientStatus = this.assyncWrapper.wrap(
    this.validator.activeStatus,
    async (req: Request, res: Response) => {
      const data = await this.services.updateClientStatus(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('client activate controller');
      }
    }
  );

  // UPDATE CLIENT
  public editClient = this.assyncWrapper.wrap(
    this.validator.addEditClient,
    async (req: Request, res: Response) => {
      const data = await this.services.editClient(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Edit Client');
      }
    }
  );

  public getAllClientAndCombined = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.services.getAllClientAndCombined(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public checkCreditLimit = this.assyncWrapper.wrap(
    this.validator.checkCreditLimit,
    async (req: Request, res: Response) => {
      const data = await this.services.checkCreditLimit(req);
      if (data.success) {
        res.status(201).json(data);
      } else {
        this.error('add client controller');
      }
    }
  );

  public getClLastBalanceById = this.assyncWrapper.wrap(
    this.validator.readClient,
    async (req: Request, res: Response) => {
      const data = await this.services.getClLastBalanceById(req);
      if (data.success) {
        res.status(201).json(data);
      } else {
        this.error('add client controller');
      }
    }
  );

  public getCombClientLBalance = this.assyncWrapper.wrap(
    this.validator.readClient,
    async (req: Request, res: Response) => {
      const data = await this.services.getCombClientLBalance(req);
      if (data.success) {
        res.status(201).json(data);
      } else {
        this.error('add client controller');
      }
    }
  );

  public deleteClient = this.assyncWrapper.wrap(
    this.validator.deleteClient,
    async (req: Request, res: Response) => {
      const data = await this.services.deleteClient(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Delete client');
      }
    }
  );

  public generateExcelReport = this.assyncWrapper.wrap(
    this.validator.readClient,
    async (req: Request, res: Response) => {
      const data = await this.services.generateExcelReport(req);
      if (data.success) {
        res.status(200).send(data);
      } else {
        this.error('Client excel report');
      }
    }
  );

  public getAllClients = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.services.getAllClients(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('view clients controller');
      }
    }
  );

  public viewAllClient = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.services.viewAllClient(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('');
      }
    }
  );

  public getSingleClient = this.assyncWrapper.wrap(
    this.validator.readClient,
    async (req: Request, res: Response) => {
      const data = await this.services.getSingleClient(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('view clients controller');
      }
    }
  );

  /**
   * view client all invoices
   */
  public clientAllInvoices = this.assyncWrapper.wrap(
    this.validator.readClientAllInvoices,
    async (req: Request, res: Response) => {
      const data = await this.services.clientAllInvoices(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('View Client Invoices...');
      }
    }
  );

  /**
   * view client all money receipts
   */
  public clientAllMoneyReceipts = this.assyncWrapper.wrap(
    this.validator.readClientAllMoneyReceipt,
    async (req: Request, res: Response) => {
      const data = await this.services.clientAllMoneyReceipts(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('View Client Money Receipts...');
      }
    }
  );

  /**
   * view client all quotations
   */
  public clientAllQuotations = this.assyncWrapper.wrap(
    this.validator.readClientAllQuotations,
    async (req: Request, res: Response) => {
      const data = await this.services.clientAllQuotations(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('View Client Quotations...');
      }
    }
  );

  /**
   * client all refund
   */
  public clientAllRefund = this.assyncWrapper.wrap(
    this.validator.readClientAllRefunds,
    async (req: Request, res: Response) => {
      const data = await this.services.clientAllRefund(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('View Client Refund...');
      }
    }
  );

  public clientAllPassport = this.assyncWrapper.wrap(
    this.validator.readClientAllPassport,
    async (req: Request, res: Response) => {
      const data = await this.services.clientAllPassport(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('View Client Passport...');
      }
    }
  );

  public sendEmailToClinet = this.assyncWrapper.wrap(
    [
      // send email
    ],
    async (req: Request, res: Response) => {
      const data = await this.services.sendEmailToClinet(req);
      if (data.success) {
        res.status(200).send(data);
      } else {
        this.error('');
      }
    }
  );

  public addIncentiveIncomeClient = this.assyncWrapper.wrap(
    this.validator.createCombClientIncentive,
    async (req: Request, res: Response) => {
      const data = await this.services.addIncentiveIncomeClient(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('');
      }
    }
  );

  public getClientCombinedIncentiveIncome = this.assyncWrapper.wrap(
    this.validator.readCombClientIncentive,
    async (req: Request, res: Response) => {
      const data = await this.services.getClientCombinedIncentiveIncome(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('');
      }
    }
  );

  public getSingleClientCombinedIncentiveIncome = this.assyncWrapper.wrap(
    this.validator.readCombClientIncentive,
    async (req: Request, res: Response) => {
      const data = await this.services.getSingleClientCombinedIncentiveIncome(
        req
      );

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('');
      }
    }
  );

  public editIncentiveIncomeCombClient = this.assyncWrapper.wrap(
    this.validator.editCombClientIncentive,
    async (req: Request, res: Response) => {
      const data = await this.services.editIncentiveIncomeCombClient(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('');
      }
    }
  );

  public deleteIncentiveIncomeCombClient = this.assyncWrapper.wrap(
    this.validator.deleteCombClientIncentive,
    async (req: Request, res: Response) => {
      const data = await this.services.deleteIncentiveIncomeCombClient(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('');
      }
    }
  );
}

export default ClientControllers;
