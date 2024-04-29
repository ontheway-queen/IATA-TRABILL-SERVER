import { Request, Response } from 'express';
import AbstractController from '../../../../abstracts/abstract.controllers';
import InvoiceAirticketService from '../../invoice-air-ticket/services/invoiceAirticket.services';
import InvoiceNonCommission from '../services/invoiceReissue.services';
import ReissueAirticket from '../validators/invoiceReissue.validators';

class ReIssueAirticket extends AbstractController {
  private services = new InvoiceNonCommission();
  private validator = new ReissueAirticket();
  private services_airticket = new InvoiceAirticketService();

  constructor() {
    super();
  }

  public addExistingClient = this.assyncWrapper.wrap(
    this.validator.addExistingClient,
    async (req: Request, res: Response) => {
      const data = await this.services.addExistingClient(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  // VIEW NON COMMISSION DETAILS
  public viewReissue = this.assyncWrapper.wrap(
    this.validator.readResissueAirticket,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.services.viewInvoiceReissue(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public getExistingClientAirticket = this.assyncWrapper.wrap(
    this.validator.readResissueAirticket,
    async (req: Request, res: Response) => {
      const data = await this.services.getExistingClientAirticket(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public editExistingCl = this.assyncWrapper.wrap(
    this.validator.addExistingClient,
    async (req: Request, res: Response) => {
      const data = await this.services.editExistingCl(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public addReissueAirticket = this.assyncWrapper.wrap(
    this.validator.addReissueAirticket,
    async (req: Request, res: Response) => {
      const data = await this.services.addReissueAirticket(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  // GET ALL INVOICE NON COMMISSION
  public getAllReissue = this.assyncWrapper.wrap(
    this.validator.readResissueAirticket,
    async (req: Request, res: Response) => {
      const data = await this.services.getAllInvoices(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public getDataForEdit = this.assyncWrapper.wrap(
    this.validator.readResissueAirticket,
    async (req: Request, res: Response) => {
      const data = await this.services.getDataForEdit(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public editReissueAirticket = this.assyncWrapper.wrap(
    this.validator.editReissueAirticket,
    async (req: Request, res: Response) => {
      const data = await this.services.editReissueAirticket(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public deleteReissue = this.assyncWrapper.wrap(
    this.validator.deleteResissueAirticket,
    async (req: Request, res: Response) => {
      const data = await this.services.deleteReissue(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public getReissueTicketInfo = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.services.getReissueTicketInfo(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public getReissueRefundInfo = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.services.getReissueRefundInfo(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public reissueRefund = this.assyncWrapper.wrap(
    this.validator.reissueRefundCreate,
    async (req: Request, res: Response) => {
      const data = await this.services.reissueRefund(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
}

export default ReIssueAirticket;
