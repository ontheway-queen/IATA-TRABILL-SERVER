import { Request, Response } from 'express';
import AbstractController from '../../../abstracts/abstract.controllers';
import QuotationServices from '../services/quotation.services';
import QuotationValidator from '../validators/quotation.validator';

class QuotationControllers extends AbstractController {
  private services = new QuotationServices();
  private validator = new QuotationValidator();

  constructor() {
    super();
  }

  public products = this.assyncWrapper.wrap(
    this.validator.productCategory,
    async (req: Request, res: Response) => {
      const data = await this.services.products(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Get all product categories');
      }
    }
  );

  public createQuotation = this.assyncWrapper.wrap(
    this.validator.createQuotation,
    async (req: Request, res: Response) => {
      const data = await this.services.addQuotation(req);

      if (data.success) {
        res.status(201).json(data);
      } else {
        this.error('Create quotation');
      }
    }
  );

  public allQuotations = this.assyncWrapper.wrap(
    this.validator.quotations,
    async (req: Request, res: Response) => {
      const data = await this.services.allQuotations(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('All quotations');
      }
    }
  );

  public postQuotationOnConfirm = this.assyncWrapper.wrap(
    this.validator.confirmationQuotation,
    async (req: Request, res: Response) => {
      const data = await this.services.confirmationQuotation(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Single quotation');
      }
    }
  );

  public singleQuotation = this.assyncWrapper.wrap(
    this.validator.quotations,
    async (req: Request, res: Response) => {
      const data = await this.services.singleQuotation(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Single quotation');
      }
    }
  );

  public billInfos = this.assyncWrapper.wrap(
    this.validator.quotations,
    async (req: Request, res: Response) => {
      const data = await this.services.billInfos(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Bill infos');
      }
    }
  );

  public editQuotation = this.assyncWrapper.wrap(
    this.validator.editQuotation,
    async (req: Request, res: Response) => {
      const data = await this.services.editQuotation(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Edit quotation');
      }
    }
  );

  public deleteQuotation = this.assyncWrapper.wrap(
    this.validator.deleteQuotation,
    async (req: Request, res: Response) => {
      const data = await this.services.deleteQuotation(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Delete Quotation');
      }
    }
  );

  public getInvoiceByCl = this.assyncWrapper.wrap(
    this.validator.quotations,
    async (req: Request, res: Response) => {
      const data = await this.services.getInvoiceByCl(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Delete Quotation');
      }
    }
  );

  public getInvoiceBilling = this.assyncWrapper.wrap(
    this.validator.quotations,
    async (req: Request, res: Response) => {
      const data = await this.services.getInvoiceBilling(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Delete Quotation');
      }
    }
  );
}

export default QuotationControllers;
