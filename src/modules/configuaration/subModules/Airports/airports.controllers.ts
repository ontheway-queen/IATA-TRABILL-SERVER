import { Request, Response } from 'express';

import AbstractController from '../../../../abstracts/abstract.controllers';
import ServicesAirpots from './airports.services';
import AirportsValidator from './airports.validators';

class ControllersAirports extends AbstractController {
  private servicesAirports = new ServicesAirpots();
  private validator = new AirportsValidator();

  constructor() {
    super();
  }

  public createAirports = this.assyncWrapper.wrap(
    this.validator.createAirports,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.servicesAirports.createAirports(req);

      if (data.success) {
        res.status(201).json(data);
      } else {
        this.error('create airports controller');
      }
    }
  );

  public viewAirports = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.servicesAirports.viewAirports(req);
      if (data.success) {
        res.status(200).json(data);
      } else this.error();
    }
  );
  public viewAllAirports = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.servicesAirports.getAllAirports(req);
      if (data.success) {
        res.status(200).json(data);
      } else this.error();
    }
  );

  public viewAirportsById = this.assyncWrapper.wrap(
    this.validator.readAirports,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.servicesAirports.getAirportById(req);
      if (data.success) {
        res.status(200).json(data);
      } else this.error();
    }
  );

  public deleteAirportsById = this.assyncWrapper.wrap(
    this.validator.deleteAirports,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.servicesAirports.deleteAirportsById(req);
      if (data.success) {
        res.status(200).json(data);
      } else this.error();
    }
  );

  public editAirportsById = this.assyncWrapper.wrap(
    this.validator.editAirports,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.servicesAirports.editAirportsById(req);

      if (data.success) {
        res.status(200).json(data);
      } else this.error();
    }
  );

  public viewAllCountries = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.servicesAirports.viewAllCountries(req);

      if (data.success) {
        res.status(200).json(data);
      } else this.error();
    }
  );
}

export default ControllersAirports;
