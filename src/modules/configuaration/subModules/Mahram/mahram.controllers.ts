import { Request, Response } from 'express';
import AbstractController from '../../../../abstracts/abstract.controllers';
import ServicesMahram from './mahram.services';
import MahramValidator from './mahram.validators';

class ControllersMahram extends AbstractController {
  private servicesMahram = new ServicesMahram();
  private validator = new MahramValidator();

  public createControllerMahram = this.assyncWrapper.wrap(
    this.validator.createMahram,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.servicesMahram.T_createMahram(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public updateControllerMahram = this.assyncWrapper.wrap(
    this.validator.editMahram,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.servicesMahram.T_updateMahram(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public viewMahrams = this.assyncWrapper.wrap(
    this.validator.readMahram,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.servicesMahram.viewMahrams(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public getAllMahrams = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.servicesMahram.getAllMahrams(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public deleteControllerMahram = this.assyncWrapper.wrap(
    this.validator.deleteMahram,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.servicesMahram.T_deleteMahram(req);
      if (data.success) {
        res.status(200).json(data);
      } else this.error();
    }
  );
}

export default ControllersMahram;
