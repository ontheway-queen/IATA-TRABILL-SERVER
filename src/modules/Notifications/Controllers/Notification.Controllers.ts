import { Request, Response } from 'express';
import AbstractController from '../../../abstracts/abstract.controllers';
import NotificationValidators from '../Notification.Validators';
import NotificationServices from '../Services/Notification.Services';

class NotificationControllers extends AbstractController {
  private services = new NotificationServices();
  private validator = new NotificationValidators();
  constructor() {
    super();
  }

  public chequeCollectionStatusUpdate = this.assyncWrapper.wrap(
    this.validator.updateCollectionCheque,
    async (req: Request, res: Response) => {
      const data = await this.services.chequeCollectionStatusUpdate(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public uploadPDF = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      await this.services.uploadPDF(req, res);
    }
  );

  public getExpirePassport = this.assyncWrapper.wrap(
    this.validator.readPassport,
    async (req: Request, res: Response) => {
      const data = await this.services.getExpirePassport(req);

      if (data.success) {
        res.status(200).json(data);
      }
    }
  );

  public getCollectionCheque = this.assyncWrapper.wrap(
    this.validator.collectionCheque,
    async (req: Request, res: Response) => {
      const data = await this.services.getCollectionCheque(req);

      if (data.success) {
        res.status(200).json(data);
      }
    }
  );

  public getPendingPaymentCheque = this.assyncWrapper.wrap(
    this.validator.collectionCheque,
    async (req: Request, res: Response) => {
      const data = await this.services.getPendingPaymentCheque(req);

      if (data.success) {
        res.status(200).json(data);
      }
    }
  );

  public getDueInvoiceData = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.services.getDueInvoiceData(req);

      if (data.success) {
        res.status(200).json(data);
      }
    }
  );

  public getVisaDeliveryData = this.assyncWrapper.wrap(
    this.validator.readVisa,
    async (req: Request, res: Response) => {
      const data = await this.services.getVisaDeliveryData(req);

      if (data.success) {
        res.status(200).json(data);
      }
    }
  );

  public getNextExpirePassport = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.services.getNextExpirePassport(req);

      if (data.success) {
        res.status(200).json(data);
      }
    }
  );
}

export default NotificationControllers;
