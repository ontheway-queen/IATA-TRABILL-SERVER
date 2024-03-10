import { Request, Response } from 'express';
import AbstractController from '../../../../abstracts/abstract.controllers';
import InvoiceHajjServices from '../Services/InvoiceUmmrah.Services';
import InvoiceHajjValidators from '../Validators/InvoiceUmmrah.Validators';

class InvoiceUmmrahControllers extends AbstractController {
  private services = new InvoiceHajjServices();
  private validator = new InvoiceHajjValidators();
  constructor() {
    super();
  }
  public getAllInvoiceUmmrah = this.assyncWrapper.wrap(
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
  // VIEW NON COMMISSION DETAILS
  public viewInvoiceUmmrah = this.assyncWrapper.wrap(
    this.validator.commonRead,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.services.viewInvoiceUmmah(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  // @ADD_INVOICE_HAJJ
  public postInvoiceUmmrah = this.assyncWrapper.wrap(
    this.validator.postInvoiceUmmrah,
    async (req: Request, res: Response) => {
      const data = await this.services.postInvoiceUmmrah(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  // @EDIT_INVOICE_HAJJ
  public editInvoiceUmmrah = this.assyncWrapper.wrap(
    this.validator.updateInvoiceUmmrah,
    async (req: Request, res: Response) => {
      const data = await this.services.editInvoiceUmmrah(req);
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

  public deleteInvoiceUmmrah = this.assyncWrapper.wrap(
    this.validator.commonDelete,
    async (req: Request, res: Response) => {
      const data = await this.services.deleteInvoiceUmmrah(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public voidInvoiceUmmrah = this.assyncWrapper.wrap(
    this.validator.commonDelete,
    async (req: Request, res: Response) => {
      const data = await this.services.voidInvoiceUmmrah(req);
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

  public getBillingInfo = this.assyncWrapper.wrap(
    this.validator.commonRead,
    async (req: Request, res: Response) => {
      const data = await this.services.getBillingInfo(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public createUmmrahRefund = this.assyncWrapper.wrap(
    this.validator.createUmmrahRefund,
    async (req: Request, res: Response) => {
      const data = await this.services.createUmmrahRefund(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public getUmmrahRefund = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.services.getUmmrahRefund(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
}

export default InvoiceUmmrahControllers;
