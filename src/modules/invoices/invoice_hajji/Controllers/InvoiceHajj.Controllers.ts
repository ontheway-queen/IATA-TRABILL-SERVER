import { Request, Response } from 'express';
import InvoiceHajjServices from '../Services/InvoiceHajj.Services';
import InvoiceHajjValidators from '../Validators/InvoiceHajj.Validators';
import AbstractController from '../../../../abstracts/abstract.controllers';

class InvoiceHajjControllers extends AbstractController {
  private services = new InvoiceHajjServices();
  private validator = new InvoiceHajjValidators();
  constructor() {
    super();
  }
  // =================== InvoiceHajjPreReg Controllers ==================

  // GET ALL INVOICE NON COMMISSION
  public getAllInvoiceHajj = this.assyncWrapper.wrap(
    this.validator.commonRead,
    async (req: Request, res: Response) => {
      const data = await this.services.getAllInvoices(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public viewInvoiceHajj = this.assyncWrapper.wrap(
    this.validator.commonRead,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.services.viewInvoiceHajj(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  // @ADD_INVOICE_HAJJ
  public postInvoiceHajj = this.assyncWrapper.wrap(
    this.validator.postInvoiceHajj,
    async (req: Request, res: Response) => {
      const data = await this.services.addInvoiceHajjServices(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  // @EDIT_INVOICE_HAJJ
  public editInvoiceHajj = this.assyncWrapper.wrap(
    this.validator.postInvoiceHajj,
    async (req: Request, res: Response) => {
      const data = await this.services.editInvoiceHajj(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public getPreRegistrationReports = this.assyncWrapper.wrap(
    this.validator.commonRead,
    async (req: Request, res: Response) => {
      const data = await this.services.getPreRegistrationReports(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public deleteInvoiceHajj = this.assyncWrapper.wrap(
    this.validator.commonDelete,
    async (req: Request, res: Response) => {
      const data = await this.services.deleteInvoiceHajj(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public voidInvoiceHajj = this.assyncWrapper.wrap(
    this.validator.commonDelete,
    async (req: Request, res: Response) => {
      const data = await this.services.voidInvoiceHajj(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public getDataForEdit = this.assyncWrapper.wrap(
    this.validator.commonRead,
    async (req: Request, res: Response) => {
      const data = await this.services.getDataForEdit(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public getHajjInfo = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.services.getHajjInfo(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public createHajjRefund = this.assyncWrapper.wrap(
    this.validator.createHajjRefund,
    async (req: Request, res: Response) => {
      const data = await this.services.createHajjRefund(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public getHajjInvoiceRefund = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.services.getHajjInvoiceRefund(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
}

export default InvoiceHajjControllers;
