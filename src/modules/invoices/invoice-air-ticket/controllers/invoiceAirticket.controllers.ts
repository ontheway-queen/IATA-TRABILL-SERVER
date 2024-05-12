import { Request, Response } from 'express';

import AbstractController from '../../../../abstracts/abstract.controllers';
import InvoiceAirticketService from '../services/invoiceAirticket.services';
import InvoiceAirticketValidators from '../validators/invoiceAirticket.validators';

class InvoiceAirticketController extends AbstractController {
  private services = new InvoiceAirticketService();
  private validator = new InvoiceAirticketValidators();

  constructor() {
    super();
  }

  // PNR DETAILS
  public pnrDetails = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.services.pnrDetails(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  /**
   * @API /api/v1/invoice-air-ticket
   * @Desc Invoice Airticket create
   * @Method POST
   */

  public postInvoiceAirticket = this.assyncWrapper.wrap(
    this.validator.postInvoiceAirticket,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.services.addInvoiceAirticket(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public getAllInvoices = this.assyncWrapper.wrap(
    this.validator.readInvoiceAirticket,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.services.getAllInvoices(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public getDataForEdit = this.assyncWrapper.wrap(
    this.validator.readInvoiceAirticket,
    async (req: Request, res: Response) => {
      const data = await this.services.getDataForEdit(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public eidtInvioceAirticket = this.assyncWrapper.wrap(
    this.validator.editInvoice,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.services.editInvoiceAirticket(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public deleteInvoiceAirTicket = this.assyncWrapper.wrap(
    this.validator.deleteInvoiceAirticket,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.services.deleteInvoiceAirTicket(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  viewCommonInvoiceDetails = this.assyncWrapper.wrap(
    this.validator.readInvoiceAirticket,
    async (req: Request, res: Response) => {
      const data = await this.services.viewCommonInvoiceDetails(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  voidInvoiceAirticket = this.assyncWrapper.wrap(
    this.validator.readInvoiceAirticket,
    async (req: Request, res: Response) => {
      const data = await this.services.voidInvoiceAirticket(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  // =================COMMON ===============

  public getAllInvoicesNumAndId = this.assyncWrapper.wrap(
    this.validator.readInvoiceAirticket,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.services.getAllInvoicesNumAndId(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public getClientDue = this.assyncWrapper.wrap(
    this.validator.readInvoiceAirticket,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.services.getClientDue(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public isTicketAlreadyExist = this.assyncWrapper.wrap(
    this.validator.readInvoiceAirticket,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.services.isTicketAlreadyExist(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public getInvoiceAcitivity = this.assyncWrapper.wrap(
    this.validator.readInvoiceAirticket,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.services.getInvoiceAcitivity(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public sendEmail = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.services.sendEmail(req);

      if (data.success) {
        res.status(200).json(data);
      }
    }
  );

  public airTicketCustomReport = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.services.airTicketCustomReport(req);

      if (data.success) {
        res.status(200).json(data);
      }
    }
  );

  // AIR TICKET TAX REFUND
  public selectAirTicketTax = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.services.selectAirTicketTax(req);

      if (data.success) {
        res.status(200).json(data);
      }
    }
  );
  public addAirTicketTax = this.assyncWrapper.wrap(
    this.validator.validateTaxRefund,
    async (req: Request, res: Response) => {
      const data = await this.services.addAirTicketTax(req);

      if (data.success) {
        res.status(200).json(data);
      }
    }
  );
  public getInvoiceInfoForVoid = this.assyncWrapper.wrap(
    this.validator.readInvoiceAirticket,
    async (req: Request, res: Response) => {
      const data = await this.services.getInvoiceInfoForVoid(req);

      if (data.success) {
        res.status(200).json(data);
      }
    }
  );
  public getInvoiceDiscount = this.assyncWrapper.wrap(
    this.validator.readInvoiceAirticket,
    async (req: Request, res: Response) => {
      const data = await this.services.getInvoiceDiscount(req);

      if (data.success) {
        res.status(200).json(data);
      }
    }
  );
  public getInvoiceClientPayment = this.assyncWrapper.wrap(
    this.validator.readInvoiceAirticket,
    async (req: Request, res: Response) => {
      const data = await this.services.getInvoiceClientPayment(req);

      if (data.success) {
        res.status(200).json(data);
      }
    }
  );
}

export default InvoiceAirticketController;
