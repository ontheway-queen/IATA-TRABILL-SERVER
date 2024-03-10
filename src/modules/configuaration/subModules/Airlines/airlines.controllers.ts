import { Request, Response } from 'express';
import AbstractController from '../../../../abstracts/abstract.controllers';
import ServicesAirlines from './airlines.services';
import AirlineValidator from './airlines.validators';

class ControllersAirlines extends AbstractController {
  private servicesAirlines = new ServicesAirlines();
  private validator = new AirlineValidator();
  constructor() {
    super();
  }
  public createControllerAirlines = this.assyncWrapper.wrap(
    this.validator.validatorAirlineCreate,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.servicesAirlines.createAirlines(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public updateControllerAirline = this.assyncWrapper.wrap(
    this.validator.validatorAirlineUpdate,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.servicesAirlines.updateAirline(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public viewAirlines = this.assyncWrapper.wrap(
    this.validator.readAirline,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.servicesAirlines.viewAirlines(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public readControllerAirline = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.servicesAirlines.getAirlines(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public deleteControllerAirLines = this.assyncWrapper.wrap(
    this.validator.deleteAirline,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.servicesAirlines.deleteAirLines(req);
      if (data.success) {
        res.status(200).json(data);
      } else this.error();
    }
  );
}

export default ControllersAirlines;
