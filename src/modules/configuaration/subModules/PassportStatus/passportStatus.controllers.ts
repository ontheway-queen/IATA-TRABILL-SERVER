import { Request, Response } from 'express';
import AbstractController from '../../../../abstracts/abstract.controllers';
import ServicesPassportStatus from './passportStatus.services';
import PassportStatusValidator from './passportStatus.validators';

class ControllerPassportStatus extends AbstractController {
  private servicesPassportStatus = new ServicesPassportStatus();
  private validator = new PassportStatusValidator();

  constructor() {
    super();
  }

  public createControllerPassportStatus = this.assyncWrapper.wrap(
    this.validator.createPassportStatus,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.servicesPassportStatus.T_createPassportStatus(
        req
      );
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public viewPassports = this.assyncWrapper.wrap(
    this.validator.readPassportStatus,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.servicesPassportStatus.viewPassports(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public getAllPassports = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.servicesPassportStatus.getAllPassports(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public updateControllerPassportStatus = this.assyncWrapper.wrap(
    this.validator.editPassportStatus,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.servicesPassportStatus.T_updatePassportStatus(
        req
      );
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public readControllerPassportStatus = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.servicesPassportStatus.T_readPassportStatus(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public deleteControllerPassportStatus = this.assyncWrapper.wrap(
    this.validator.deletePassportStatus,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.servicesPassportStatus.T_deletePassportStatus(
        req
      );
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
}

export default ControllerPassportStatus;
