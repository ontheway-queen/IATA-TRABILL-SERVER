import { Request, Response } from 'express';
import AbstractController from '../../../../abstracts/abstract.controllers';
import InivoiceOther from '../services/invoiceOther.services';
import InvoiceOtherValidators from '../validators/invoiceOther.validators.js';

class InvoiceOther extends AbstractController {
  private services = new InivoiceOther();
  private validator = new InvoiceOtherValidators();
  constructor() {
    super();
  }

  // GET ALL INVOICE NON COMMISSION
  public getAllInvoiceOther = this.assyncWrapper.wrap(
    this.validator.readInvoiceOthers,
    async (req: Request, res: Response) => {
      const data = await this.services.getAllInvoiceOther(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  // VIEW NON COMMISSION DETAILS
  public viewInvoiceOther = this.assyncWrapper.wrap(
    this.validator.readInvoiceOthers,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.services.viewInvoiceOther(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public postInvoiceOther = this.assyncWrapper.wrap(
    this.validator.addInvoiceOthers,
    async (req: Request, res: Response) => {
      const data = await this.services.postInvoiceOther(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        throw new Error();
      }
    }
  );

  public editInvoiceOther = this.assyncWrapper.wrap(
    this.validator.editInviceOthers,
    async (req: Request, res: Response) => {
      const data = await this.services.editInvoiceOther(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        throw new Error();
      }
    }
  );

  public deleteInvoiceOther = this.assyncWrapper.wrap(
    this.validator.deleteInvoiceOthers,
    async (req: Request, res: Response) => {
      const data = await this.services.deleteInvoiceOther(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        throw new Error();
      }
    }
  );

  public voidInvoiceOther = this.assyncWrapper.wrap(
    this.validator.deleteInvoiceOthers,
    async (req: Request, res: Response) => {
      const data = await this.services.voidInvoiceOther(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        throw new Error();
      }
    }
  );

  // ============== @View ==================
  public getForEdit = this.assyncWrapper.wrap(
    this.validator.readInvoiceOthers,
    async (req: Request, res: Response) => {
      const data = await this.services.getForEdit(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        throw new Error();
      }
    }
  );

  public getAllInvoiceOthersByClientId = this.assyncWrapper.wrap(
    this.validator.readInvoiceOthers,
    async (req: Request, res: Response) => {
      const data = await this.services.getAllInvoiceOthersByClientId(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        throw new Error();
      }
    }
  );

  public getTransportType = this.assyncWrapper.wrap(
    this.validator.readInvoiceOthers,
    async (req: Request, res: Response) => {
      const data = await this.services.getTransportType(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        throw new Error();
      }
    }
  );
}

export default InvoiceOther;
