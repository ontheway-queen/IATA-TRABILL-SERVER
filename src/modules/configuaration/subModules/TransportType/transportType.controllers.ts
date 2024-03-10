import { Request, Response } from 'express';

import AbstractController from '../../../../abstracts/abstract.controllers';
import TransportTypeServices from './transportType.services';
import TransportTypeValidator from './transportType.validators';

class TransportTypeControllers extends AbstractController {
  private services = new TransportTypeServices();
  private validator = new TransportTypeValidator();

  constructor() {
    super();
  }

  public createTransportType = this.assyncWrapper.wrap(
    this.validator.createTransportType,
    async (req: Request, res: Response) => {
      const data = await this.services.createTransportType(req);

      if (data.success) {
        res.status(201).json(data);
      } else {
        this.error('create room type controller');
      }
    }
  );

  public viewTransportTypes = this.assyncWrapper.wrap(
    this.validator.readTransportType,
    async (req: Request, res: Response) => {
      const data = await this.services.viewTransportTypes(req);

      if (data.success) {
        res.status(200).json(data);
      }
    }
  );

  public getAllTransportTypes = this.assyncWrapper.wrap(
    this.validator.readTransportType,
    async (req: Request, res: Response) => {
      const data = await this.services.getAllTransportTypes(req);

      if (data.success) {
        res.status(200).json(data);
      }
    }
  );

  public deleteTransportType = this.assyncWrapper.wrap(
    this.validator.deleteTransportType,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.services.deleteTransportType(req);

      if (data.success) {
        res.status(200).json(data);
      } else this.error();
    }
  );

  public updateTransportType = this.assyncWrapper.wrap(
    this.validator.editTransportType,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.services.updateTransportType(req);

      if (data.success) {
        res.status(200).json(data);
      }
    }
  );
}

export default TransportTypeControllers;
