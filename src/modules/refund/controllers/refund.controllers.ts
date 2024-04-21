import { Request, Response } from 'express';
import AbstractController from '../../../abstracts/abstract.controllers';
import RefundServices from '../services/refund.services';
import RefundValidator from '../validators/refund.validator';

class RefundController extends AbstractController {
  private validator = new RefundValidator();
  private services = new RefundServices();

  public getTicketNo = this.assyncWrapper.wrap(
    this.validator.readAirticket,
    async (req: Request, res: Response) => {
      const data = await this.services.getTicketNo(req);

      if (data.success) {
        res.status(201).json(data);
      } else {
        this.error('Get ticker number ...');
      }
    }
  );

  public airTicketInfos = this.assyncWrapper.wrap(
    this.validator.getAirTicketInfos,
    async (req: Request, res: Response) => {
      const data = await this.services.airTicketInfos(req);

      if (data.success) {
        res.status(201).json(data);
      } else {
        this.error('Air ticket infos ...');
      }
    }
  );

  public addAirTicketRefund = this.assyncWrapper.wrap(
    this.validator.addAirTicketRefund,
    async (req: Request, res: Response) => {
      const data = await this.services.addAirTicketRefund(req);

      if (data.success) {
        res.status(201).json(data);
      } else {
        this.error('Air ticket refund added');
      }
    }
  );

  public getAllAirTicketRefund = this.assyncWrapper.wrap(
    this.validator.readAirticket,
    async (req: Request, res: Response) => {
      const data = await this.services.getAllAirTicketRefund(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Get All air ticket refunds...');
      }
    }
  );

  public getRefundDescription = this.assyncWrapper.wrap(
    this.validator.readAirticket,
    async (req: Request, res: Response) => {
      const data = await this.services.getRefundDescription(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Get single air ticket refunds...');
      }
    }
  );

  public singleAirTicketRefund = this.assyncWrapper.wrap(
    this.validator.readAirticket,
    async (req: Request, res: Response) => {
      const data = await this.services.singleATRefund(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Get single air ticket refunds...');
      }
    }
  );

  public deleteAirTicketRefund = this.assyncWrapper.wrap(
    this.validator.deleteAirTicketRefund,
    async (req: Request, res: Response) => {
      const data = await this.services.deleteAirticketRefund(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Get single air ticket refunds...');
      }
    }
  );

  public invoiceOtherByClient = this.assyncWrapper.wrap(
    this.validator.readOtherClient,
    async (req: Request, res: Response) => {
      const data = await this.services.invoiceOtherByClient(req);

      if (data.success) {
        res.status(201).json(data);
      } else {
        this.error('Invoice other by client id... ');
      }
    }
  );

  public getBillingInfo = this.assyncWrapper.wrap(
    this.validator.readOtherClient,
    async (req: Request, res: Response) => {
      const data = await this.services.getBillingInfo(req);

      if (data.success) {
        res.status(201).json(data);
      } else {
        this.error('Get refund info...');
      }
    }
  );

  public getRefundInfoVendor = this.assyncWrapper.wrap(
    this.validator.readOtherVendor,
    async (req: Request, res: Response) => {
      const data = await this.services.getRefundInfoVendor(req);

      if (data.success) {
        res.status(201).json(data);
      } else {
        this.error('Get vendor refund info...');
      }
    }
  );

  public addOtherRefund = this.assyncWrapper.wrap(
    this.validator.addOtherRefund,
    async (req: Request, res: Response) => {
      const data = await this.services.addOtherRefund(req);

      if (data.success) {
        res.status(201).json(data);
      } else {
        this.error('Client refund added');
      }
    }
  );

  public getAllRefunds = this.assyncWrapper.wrap(
    this.validator.readOtherClient,
    async (req: Request, res: Response) => {
      const data = await this.services.getAllRefunds(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Get All refund other client...');
      }
    }
  );

  public singleOtherRefund = this.assyncWrapper.wrap(
    this.validator.readOtherClient,
    async (req: Request, res: Response) => {
      const data = await this.services.singleOtherRefund(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Get Single refund other client...');
      }
    }
  );

  public deleteOtherRefund = this.assyncWrapper.wrap(
    this.validator.deleteOtherRefund,
    async (req: Request, res: Response) => {
      const data = await this.services.deleteOtherRefund(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Restore other refunds...');
      }
    }
  );

  public invoiceOtherByVendor = this.assyncWrapper.wrap(
    this.validator.readOtherVendor,
    async (req: Request, res: Response) => {
      const data = await this.services.invoiceOtherByVendor(req);

      if (data.success) {
        res.status(201).json(data);
      } else {
        this.error('Invoice other by vendor id... ');
      }
    }
  );

  public getTourInvoice = this.assyncWrapper.wrap(
    this.validator.readTourPakageInfo,
    async (req: Request, res: Response) => {
      const data = await this.services.getTourInvoice(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('tour invoice');
      }
    }
  );

  public addTourPackRefund = this.assyncWrapper.wrap(
    this.validator.createTourPackRefund,
    async (req: Request, res: Response) => {
      const data = await this.services.addTourPackRefund(req);

      if (data.success) {
        res.status(201).json(data);
      } else {
        this.error('tour refund add');
      }
    }
  );

  public getAllTourPackRefund = this.assyncWrapper.wrap(
    this.validator.readTourPakageInfo,
    async (req: Request, res: Response) => {
      const data = await this.services.getAllTourPackRefund(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('get tour refund...');
      }
    }
  );
  public viewTourForEdit = this.assyncWrapper.wrap(
    this.validator.readTourPakageInfo,
    async (req: Request, res: Response) => {
      const data = await this.services.viewTourForEdit(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('view tour for edit...');
      }
    }
  );

  public deleteTourPackRefund = this.assyncWrapper.wrap(
    this.validator.deleteTourPackage,
    async (req: Request, res: Response) => {
      const data = await this.services.deleteTourPackRefund(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('tour refund delete');
      }
    }
  );
  public addPartialRefund = this.assyncWrapper.wrap(
    this.validator.addPartialRefund,
    async (req: Request, res: Response) => {
      const data = await this.services.addPartialRefund(req);

      if (data.success) {
        res.status(201).json(data);
      } else {
        this.error('tour refund delete');
      }
    }
  );
  public getPersialRefundTickets = this.assyncWrapper.wrap(
    this.validator.readAirticket,
    async (req: Request, res: Response) => {
      const data = await this.services.getPersialRefundTickets(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('tour refund delete');
      }
    }
  );

  public getPersialRefundTicketsByInvoice = this.assyncWrapper.wrap(
    this.validator.readAirticket,
    async (req: Request, res: Response) => {
      const data = await this.services.getPersialRefundTicketsByInvoice(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('tour refund delete');
      }
    }
  );

  public DeletePartialRefund = this.assyncWrapper.wrap(
    this.validator.DeletePartialRefund,
    async (req: Request, res: Response) => {
      const data = await this.services.DeletePartialRefund(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('tour refund delete');
      }
    }
  );
  public getPersialRefund = this.assyncWrapper.wrap(
    this.validator.readPersialRefund,
    async (req: Request, res: Response) => {
      const data = await this.services.getPersialRefund(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('tour refund delete');
      }
    }
  );

  public getSinglePersialRefund = this.assyncWrapper.wrap(
    this.validator.readPersialRefund,
    async (req: Request, res: Response) => {
      const data = await this.services.getSinglePersialRefund(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('tour refund delete');
      }
    }
  );
  public getPertialAirticketInfo = this.assyncWrapper.wrap(
    this.validator.readPersialRefund,
    async (req: Request, res: Response) => {
      const data = await this.services.getPertialAirticketInfo(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('tour refund delete');
      }
    }
  );
}

export default RefundController;
