import { Request, Response } from 'express';
import AbstractController from '../../../../abstracts/abstract.controllers';
import invoiceTourServices from '../services/invoiceTour.services';
import InvoiceTourValidator from '../validators/InvoiceTour.validators';

class InvoiceTourController extends AbstractController {
  private services = new invoiceTourServices();
  private validator = new InvoiceTourValidator();
  constructor() {
    super();
  }

  public getAllInvoiceTour = this.assyncWrapper.wrap(
    this.validator.readInvoiceTour,
    async (req: Request, res: Response) => {
      const data = await this.services.getAllTourInvoices(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Get all invoice tour ');
      }
    }
  );

  public getForEdit = this.assyncWrapper.wrap(
    this.validator.readInvoiceTour,
    async (req: Request, res: Response) => {
      const data = await this.services.getForEdit(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Get for edit invoice tour ');
      }
    }
  );

  // VIEW INVOICE TOUR PACKAGE
  public viewITourPackage = this.assyncWrapper.wrap(
    this.validator.readInvoiceTour,
    async (req: Request, res: Response) => {
      const data = await this.services.viewITourPackage(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Get view invoice tour ');
      }
    }
  );

  public getTourBillingInfo = this.assyncWrapper.wrap(
    this.validator.readInvoiceTour,
    async (req: Request, res: Response) => {
      const data = await this.services.getTourBillingInfo(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Get view invoice tour ');
      }
    }
  );

  // UPDATE
  public editInvoiceTour = this.assyncWrapper.wrap(
    this.validator.updateTourPackage,
    async (req: Request, res: Response) => {
      const data = await this.services.editInvoiceTour(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Get for edit invoice tour ');
      }
    }
  );

  // CREATE
  public createInvoiceTour = this.assyncWrapper.wrap(
    this.validator.createTourPackage,
    async (req: Request, res: Response) => {
      const data = await this.services.addInvoiceTour(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        throw new Error();
      }
    }
  );

  // ADD COSTING
  public addCostingTourPackage = this.assyncWrapper.wrap(
    this.validator.addCostingTour,
    async (req: Request, res: Response) => {
      const data = await this.services.addCostingTourPackage(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        throw new Error();
      }
    }
  );

  public deleteResetInvoiceTour = this.assyncWrapper.wrap(
    this.validator.deleteInvoiceTour,
    async (req: Request, res: Response) => {
      const data = await this.services.deleteResetInvoiceTour(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        throw new Error();
      }
    }
  );

  public voidInvoiceTour = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.services.voidInvoiceTour(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        throw new Error();
      }
    }
  );
}

export default InvoiceTourController;
