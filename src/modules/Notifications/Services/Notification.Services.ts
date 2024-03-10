import { Request, Response } from 'express';
import AbstractServices from '../../../abstracts/abstract.services';
import ChequeCollectionStatusUpdate from './NarrowServices/ChequeCollectionStatusUpdate';
const pdfParse = require('pdf-parse');
class NotificationServices extends AbstractServices {
  constructor() {
    super();
  }

  public uploadPDF = async (req: Request, res: Response) => {
    if (!req.files || !('pdf' in req.files)) {
      res.status(400);
      res.end();
    } else {
      const camelCaseRegex = /([a-z,0-9])([A-Z])/g;
      pdfParse((req.files as { pdf: any[] }).pdf[0])
        .then((result: any) => {
          const newText = result.text.replace(camelCaseRegex, '$1 $2');
          res.send(newText);
        })
        .catch((error: any) => {
          console.error('Error reading file:', error);
          res.status(500).send('Internal Server Error');
        });
    }
  };

  getExpirePassport = async (req: Request) => {
    const today = new Date();
    const priorDate = new Date(new Date().setDate(today.getDate() + 30));
    const conn = this.models.NotificationModals(req);

    const data = await conn.getExpirePassport(today, priorDate);

    return { success: true, data };
  };

  getCollectionCheque = async (req: Request) => {
    const chequeStatus = (req.query.status as string) || 'PENDING';

    const conn = this.models.NotificationModals(req);

    const data = await conn.getCollectionCheque(chequeStatus);
    const count = await conn.getCollectionChequeCount(chequeStatus);

    return { success: true, data: { count, data } };
  };

  getPendingPaymentCheque = async (req: Request) => {
    const chequeStatus = (req.query.status as string) || 'PENDING';

    const conn = this.models.NotificationModals(req);

    const data = await conn.getPendingPaymentCheque(chequeStatus);
    const count = await conn.getPendingPaymentChequeCount(chequeStatus);

    return { success: true, data: { count, data } };
  };

  getDueInvoiceData = async (req: Request) => {
    const { page, size } = req.query as any;
    const conn = this.models.NotificationModals(req);

    const data = await conn.getDueInvoiceData(page, size);

    return { success: true, ...data };
  };

  getVisaDeliveryData = async (req: Request) => {
    const today = new Date();

    const conn = this.models.NotificationModals(req);

    const data = await conn.getVisaDeliveryData(today);

    return { success: true, data };
  };

  getNextExpirePassport = async (req: Request) => {
    const { page, size } = req.query as { page: string; size: string };

    const conn = this.models.NotificationModals(req);

    const data = await conn.getNextExpirePassport(
      Number(page) || 1,
      Number(size) || 20
    );

    return { success: true, ...data };
  };

  public chequeCollectionStatusUpdate = new ChequeCollectionStatusUpdate()
    .chequeCollectionStatusUpdate;
}

export default NotificationServices;
