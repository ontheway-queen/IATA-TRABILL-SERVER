import { Request, Response } from 'express';
import AbstractController from '../../../../abstracts/abstract.controllers';
import ServicesGroups from './groups.services';
import GroupsValidator from './groups.validators';

class ControllersGroups extends AbstractController {
  private service_groups = new ServicesGroups();
  private validator = new GroupsValidator();

  constructor() {
    super();
  }

  public createControllerGroups = this.assyncWrapper.wrap(
    this.validator.createGroup,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.service_groups.T_createGroups(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public updateControllerGroups = this.assyncWrapper.wrap(
    this.validator.editGroup,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.service_groups.T_updateGroups(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public viewGroups = this.assyncWrapper.wrap(
    this.validator.readGroup,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.service_groups.viewGroups(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
  public getAllGroups = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.service_groups.getAllGroups(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public deleteControllerGroups = this.assyncWrapper.wrap(
    this.validator.deleteGroup,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.service_groups.T_deleteGroups(req);
      if (data.success) {
        res.status(200).json(data);
      } else this.error();
    }
  );
}

export default ControllersGroups;
