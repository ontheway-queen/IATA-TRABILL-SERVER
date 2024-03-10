import { Request, Response } from 'express';

import AbstractController from '../../../../abstracts/abstract.controllers';
import InvoiceNonCommission from '../services/invoiceNonCommission.services';
import { voidInvoices } from '../validators/commonNonCommission.validator';
import InvoiceNonCommissionValidators from '../validators/invoiceNonCommission.validators';

class InvoiceNonCommissionController extends AbstractController {
  private services = new InvoiceNonCommission();
  private validator = new InvoiceNonCommissionValidators();

  constructor() {
    super();
  }

  // GET ALL INVOICE NON COMMISSION
  public getAllInvoices = this.assyncWrapper.wrap(
    this.validator.readInvoiceNonComission,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.services.getAllInvoices(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  // GET ALL INVOICE NON COMMISSION
  public voidNonCommission = this.assyncWrapper.wrap(
    voidInvoices,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.services.voidNonCommission(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  // VIEW NON COMMISSION DETAILS
  public viewNoncommissioinDetails = this.assyncWrapper.wrap(
    this.validator.readInvoiceNonComission,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.services.viewNonCommission(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public addInvoiceNonCommission = this.assyncWrapper.wrap(
    this.validator.addInvoiceNonCommission,
    async (req: Request, res: Response) => {
      const data = await this.services.addInvoiceNonCommission(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public getDataForEdit = this.assyncWrapper.wrap(
    this.validator.readInvoiceNonComission,
    async (req: Request, res: Response) => {
      const data = await this.services.getDataForEdit(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public editInvoiceNonCommission = this.assyncWrapper.wrap(
    this.validator.editInvoiceNonCommission,
    async (req: Request, res: Response) => {
      const data = await this.services.editInvoiceNonCommission(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public deleteNonComInvoice = this.assyncWrapper.wrap(
    this.validator.deleteInvoiceNonComission,
    async (req: Request, res: Response) => {
      const data = await this.services.deleteNonComInvoice(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
}

export default InvoiceNonCommissionController;
