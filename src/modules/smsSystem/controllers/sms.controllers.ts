import { Request, Response } from 'express';
import AbstractController from '../../../abstracts/abstract.controllers';
import SmsServices from '../services/sms.services';
import SmsValidator from '../validators/sms.validator';

class SmsControllers extends AbstractController {
  private services = new SmsServices();
  private validator = new SmsValidator();

  constructor() {
    super();
  }

  public createSms = this.assyncWrapper.wrap(
    this.validator.createSms,
    async (req: Request, res: Response) => {
      const data = await this.services.createSms(req);

      if (data.success) {
        res.status(201).json(data);
      } else {
        this.error('SMS ...');
      }
    }
  );

  public getSms = this.assyncWrapper.wrap(
    this.validator.readSms,
    async (req: Request, res: Response) => {
      const data = await this.services.getSms(req);

      if (data.success) {
        res.status(201).json(data);
      } else {
        this.error('get SMS ...');
      }
    }
  );

  public getSmsBalance = this.assyncWrapper.wrap(
    this.validator.readSms,
    async (req: Request, res: Response) => {
      const data = await this.services.getSmsBalance(req);

      if (data.success) {
        res.status(201).json(data?.data?.data);
      } else {
        this.error('get SMS Balance');
      }
    }
  );
}

export default SmsControllers;
