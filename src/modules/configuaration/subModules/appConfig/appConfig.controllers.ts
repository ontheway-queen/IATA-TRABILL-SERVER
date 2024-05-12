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

  public addSignature = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.services.addSignature(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('');
      }
    }
  );

  public updateSignature = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.services.updateSignature(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('');
      }
    }
  );

  public updateSignatureStatus = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.services.updateSignatureStatus(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('');
      }
    }
  );

  public getSignatures = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.services.getSignatures(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('');
      }
    }
  );
}
export default AppConfigControllers;
