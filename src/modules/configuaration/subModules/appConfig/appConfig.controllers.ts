import { Request, Response } from 'express';
import AbstractController from '../../../../abstracts/abstract.controllers';
import AppConfigServices from './appConfig.services';
import AppConfigValidators from './appConfig.validators';

class AppConfigControllers extends AbstractController {
  private services = new AppConfigServices();
  private validator = new AppConfigValidators();

  constructor() {
    super();
  }

  public getAllOffice = this.assyncWrapper.wrap(
    this.validator.readOffice,
    async (req: Request, res: Response) => {
      const data = await this.services.getAllOffice(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('');
      }
    }
  );

  public getAllOfficeForEdit = this.assyncWrapper.wrap(
    this.validator.readOffice,
    async (req: Request, res: Response) => {
      const data = await this.services.getAllOfficeForEdit(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('');
      }
    }
  );

  public getAllClientByOffice = this.assyncWrapper.wrap(
    this.validator.readOffice,
    async (req: Request, res: Response) => {
      const data = await this.services.getAllClientByOffice(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('');
      }
    }
  );

  public viewAllOffice = this.assyncWrapper.wrap(
    this.validator.readOffice,
    async (req: Request, res: Response) => {
      const data = await this.services.viewAllOffice(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('');
      }
    }
  );

  public createOffice = this.assyncWrapper.wrap(
    this.validator.createOffice,
    async (req: Request, res: Response) => {
      const data = await this.services.createOffice(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('');
      }
    }
  );

  public editOffice = this.assyncWrapper.wrap(
    this.validator.editOffice,
    async (req: Request, res: Response) => {
      const data = await this.services.editOffice(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('');
      }
    }
  );

  public deleteOffice = this.assyncWrapper.wrap(
    this.validator.deleteOffice,
    async (req: Request, res: Response) => {
      const data = await this.services.deleteOffice(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('');
      }
    }
  );

  public getAppConfig = this.assyncWrapper.wrap(
    this.validator.readAppConfig,
    async (req: Request, res: Response) => {
      const data = await this.services.getAppConfig(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('');
      }
    }
  );

  public updateAppConfig = this.assyncWrapper.wrap(
    this.validator.readAppConfig,
    async (req: Request, res: Response) => {
      const data = await this.services.updateAppConfig(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('');
      }
    }
  );

  public updateAppConfigSignature = this.assyncWrapper.wrap(
    this.validator.readAppConfig,
    async (req: Request, res: Response) => {
      const data = await this.services.updateAppConfigSignature(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('');
      }
    }
  );
}
export default AppConfigControllers;
