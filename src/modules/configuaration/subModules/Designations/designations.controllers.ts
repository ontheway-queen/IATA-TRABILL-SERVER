import { Request, Response } from 'express';

import AbstractController from '../../../../abstracts/abstract.controllers';
import ServicesDesignations from './designations.services';
import DesignationsValidator from './designations.validators';

class ControllersDesignations extends AbstractController {
  private servicesDesignations = new ServicesDesignations();
  private validator = new DesignationsValidator();

  constructor() {
    super();
  }

  public createDesignation = this.assyncWrapper.wrap(
    this.validator.createDesignation,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.servicesDesignations.createDesignation(req);

      if (data.success) {
        res.status(201).json(data);
      } else {
        this.error('create designation controller');
      }
    }
  );

  public viewDesignations = this.assyncWrapper.wrap(
    this.validator.readDesignation,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.servicesDesignations.viewDesignations(req);

      if (data.success) {
        res.status(200).json(data);
      }
    }
  );
  public getAllDesignations = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.servicesDesignations.getAllDesignations(req);

      if (data.success) {
        res.status(200).json(data);
      }
    }
  );

  public deleteDesignation = this.assyncWrapper.wrap(
    this.validator.deleteDesignation,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.servicesDesignations.deleteDesignation(req);

      if (data.success) {
        res.status(200).json(data);
      } else this.error();
    }
  );

  public editDesignation = this.assyncWrapper.wrap(
    this.validator.editDesignation,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.servicesDesignations.editDesignation(req);

      if (data.success) {
        res.status(200).json(data);
      }
    }
  );
}

export default ControllersDesignations;
