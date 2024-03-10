import { Request, Response } from 'express';
import AbstractController from '../../../abstracts/abstract.controllers';
import PassportServices from '../services/passport.services';
import PassportValidator from '../validators/passport.validator';

class PassportControllers extends AbstractController {
  private services = new PassportServices();
  private validator = new PassportValidator();

  constructor() {
    super();
  }

  /**
   * add/ upload passport
   */
  public addPassport = this.assyncWrapper.wrap(
    this.validator.addPassport,
    async (req: Request, res: Response) => {
      const data = await this.services.addPassport(req);

      // throw new Error('error');

      if (data.success) {
        res.status(201).json(data);
      } else {
        this.error('Add/ upload passport');
      }
    }
  );
  public deletePassport = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.services.deletePassport(req);

      // throw new Error('error');

      if (data.success) {
        res.status(201).json(data);
      } else {
        this.error('Add/ upload passport');
      }
    }
  );

  public editPassport = this.assyncWrapper.wrap(
    this.validator.editPassport,
    async (req: Request, res: Response) => {
      const data = await this.services.editPassport(req);

      if (data.success) {
        res.status(201).json(data);
      } else {
        this.error('Edit passport');
      }
    }
  );

  public allPassports = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.services.allPassports(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('All created passports');
      }
    }
  );
  public getPassportsForSelect = this.assyncWrapper.wrap(
    this.validator.readPassport,
    async (req: Request, res: Response) => {
      const data = await this.services.getPassportsForSelect(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('All created passports');
      }
    }
  );

  public singlePassport = this.assyncWrapper.wrap(
    this.validator.readPassport,
    async (req: Request, res: Response) => {
      const data = await this.services.singlePassport(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('All created passports');
      }
    }
  );

  public changeStatus = this.assyncWrapper.wrap(
    this.validator.changePassport,
    async (req: Request, res: Response) => {
      const data = await this.services.changePassportSts(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Change passport status');
      }
    }
  );

  public getStatus = this.assyncWrapper.wrap(
    this.validator.readPassportStatus,
    async (req: Request, res: Response) => {
      const data = await this.services.getStatus(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Get passport status');
      }
    }
  );

  public passportNumberIsUnique = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.services.passportNumberIsUnique(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Get passport status');
      }
    }
  );
}

export default PassportControllers;
