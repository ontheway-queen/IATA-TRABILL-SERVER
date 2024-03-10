import { Request, Response } from 'express';
import AbstractController from '../../../../abstracts/abstract.controllers';
import ServicesCompanies from './companies.services';
import CompaniesValidator from './companies.validators';

class ControllersCompanies extends AbstractController {
  private servicesCompanies = new ServicesCompanies();
  private validator = new CompaniesValidator();

  constructor() {
    super();
  }

  public createControllerCompanies = this.assyncWrapper.wrap(
    this.validator.createCompanies,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.servicesCompanies.CreateCompanies(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public updateControllerCompanies = this.assyncWrapper.wrap(
    this.validator.editCompanies,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.servicesCompanies.UpdateCompanies(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public deleteControllerCompanies = this.assyncWrapper.wrap(
    this.validator.deleleCompanies,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.servicesCompanies.DeleteCompanies(req);
      if (data.success) {
        res.status(200).json(data);
      } else this.error();
    }
  );

  public viewCompanies = this.assyncWrapper.wrap(
    this.validator.readCompanies,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.servicesCompanies.viewCompanies(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public getAllCompanies = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.servicesCompanies.getAllCompanies(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
}

export default ControllersCompanies;
