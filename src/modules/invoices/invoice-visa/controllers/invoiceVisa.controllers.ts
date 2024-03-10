import { Request, Response } from 'express';
import AbstractController from '../../../../abstracts/abstract.controllers';
import InvoiceVisaServices from '../services/invoiceVisa.services';
import InvoiceVisaValidators from '../validators/invoiceVisa.validators.js';

class InvoiceVisa extends AbstractController {
  private services = new InvoiceVisaServices();
  private validator = new InvoiceVisaValidators();
  constructor() {
    super();
  }

  public addInvoiceVisa = this.assyncWrapper.wrap(
    this.validator.addInvoiceVisa,
    async (req: Request, res: Response) => {
      const data = await this.services.addInvoiceVisa(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        throw new Error('Thare was an error in invoice post');
      }
    }
  );

  public getAllInvoiceVisa = this.assyncWrapper.wrap(
    this.validator.readInvoiceVisa,
    async (req: Request, res: Response) => {
      const data = await this.services.getListOfInvoiceVisa(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public getForEdit = this.assyncWrapper.wrap(
    this.validator.readInvoiceVisa,
    async (req: Request, res: Response) => {
      const data = await this.services.getForEdit(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        throw new Error();
      }
    }
  );

  public updateBillingStatus = this.assyncWrapper.wrap(
    this.validator.readInvoiceVisa,
    async (req: Request, res: Response) => {
      const data = await this.services.updateBillingStatus(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public viewInvoiceVisa = this.assyncWrapper.wrap(
    this.validator.readInvoiceVisa,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.services.viewInvoiceVisa(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public editInvoiceVisa = this.assyncWrapper.wrap(
    this.validator.editInvoice,
    async (req: Request, res: Response) => {
      const data = await this.services.editInvoiceVisa(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        throw new Error();
      }
    }
  );

  public deleteInvoiceVisa = this.assyncWrapper.wrap(
    this.validator.deleteInvoiceVisa,
    async (req: Request, res: Response) => {
      const data = await this.services.deleteInvoiceVisa(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        throw new Error();
      }
    }
  );

  public voidInvoiceVisa = this.assyncWrapper.wrap(
    this.validator.deleteInvoiceVisa,
    async (req: Request, res: Response) => {
      const data = await this.services.voidInvoiceVisa(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        throw new Error();
      }
    }
  );
}

export default InvoiceVisa;
