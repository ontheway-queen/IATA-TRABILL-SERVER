import { Request, Response } from 'express';
import AbstractController from '../../../../abstracts/abstract.controllers';
import ServicesAgency from './agency.services';
import AgencyValidator from './agency.validator';

class ControllersAgency extends AbstractController {
  private servicesAgency = new ServicesAgency();
  private validator = new AgencyValidator();

  public createControllerAgency = this.assyncWrapper.wrap(
    this.validator.createAgency,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.servicesAgency.createAgency(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public updateControllerAgency = this.assyncWrapper.wrap(
    this.validator.updateAgency,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.servicesAgency.updateAgency(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public viewAgencies = this.assyncWrapper.wrap(
    this.validator.getAllAgencies,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.servicesAgency.viewAgencies(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public getAgencies = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.servicesAgency.getAgencies(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public deleteControllerAgency = this.assyncWrapper.wrap(
    this.validator.deleteAgency,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.servicesAgency.deleteAgency(req);
      if (data.success) {
        res.status(200).json(data);
      } else this.error();
    }
  );

  constructor() {
    super();
  }
}

export default ControllersAgency;
