import { Request, Response } from 'express';

import AbstractController from '../../../../abstracts/abstract.controllers';
import ServicesClientCategories from './clientCategories.services';
import ClientCategoryValidator from './clientCategories.validators';

class ControllersClientCategories extends AbstractController {
  private servicesClientCategories = new ServicesClientCategories();
  private validator = new ClientCategoryValidator();

  constructor() {
    super();
  }

  /**
   * create client categories
   */
  public createClientCategory = this.assyncWrapper.wrap(
    this.validator.createClientCategory,
    async (req: Request, res: Response) => {
      const data = await this.servicesClientCategories.createClientCategory(
        req
      );

      if (data.success) {
        res.status(201).json(data);
      } else {
        this.error('create client categories controller');
      }
    }
  );

  public getAllClientCategories = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.servicesClientCategories.getAllClientCategories(
        req
      );

      if (data.success) {
        res.status(200).json(data);
      } else this.error();
    }
  );
  public getClientCategories = this.assyncWrapper.wrap(
    this.validator.readClientCategory,
    async (req: Request, res: Response) => {
      const data = await this.servicesClientCategories.getClientCategories(req);

      if (data.success) {
        res.status(200).json(data);
      } else this.error();
    }
  );

  public deleteClientCategoryById = this.assyncWrapper.wrap(
    this.validator.deleteClientCategory,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.servicesClientCategories.deleteClientCategoryById(
        req
      );
      if (data.success) {
        res.status(200).json(data);
      } else this.error();
    }
  );

  public editClientCategoryById = this.assyncWrapper.wrap(
    this.validator.editClientCategory,
    async (req: Request, res: Response) => {
      const data = await this.servicesClientCategories.editClientCategoryById(
        req
      );

      if (data.success) {
        res.status(200).json(data);
      }
    }
  );
}

export default ControllersClientCategories;
