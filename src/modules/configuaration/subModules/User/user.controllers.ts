import { Request, Response } from 'express';

import AbstractController from '../../../../abstracts/abstract.controllers';
import UserServices from './user.services';
import UserValidator from './user.validator';

class UserControllers extends AbstractController {
  private userServices = new UserServices();
  private validator = new UserValidator();

  constructor() {
    super();
  }

  public viewRoles = this.assyncWrapper.wrap(
    this.validator.readRole,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.userServices.viewRoles(req);

      if (data.success) {
        res.status(200).json(data);
      }
    }
  );
  public getRoleById = this.assyncWrapper.wrap(
    this.validator.readRole,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.userServices.getRoleById(req);

      if (data.success) {
        res.status(200).json(data);
      }
    }
  );
  public deleteRole = this.assyncWrapper.wrap(
    this.validator.readRole,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.userServices.deleteRole(req);

      if (data.success) {
        res.status(200).json(data);
      }
    }
  );

  public createUser = this.assyncWrapper.wrap(
    this.validator.createUser,
    async (req: Request, res: Response) => {
      const data = await this.userServices.createUser(req);

      if (data?.success) {
        res.status(200).json(data);
      } else {
        this.error('create user');
      }
    }
  );
  public updateUser = this.assyncWrapper.wrap(
    this.validator.updateUser,
    async (req: Request, res: Response) => {
      const data = await this.userServices.updateUser(req);

      if (data?.success) {
        res.status(200).json(data);
      } else {
        this.error('create user');
      }
    }
  );
  public deleteUser = this.assyncWrapper.wrap(
    this.validator.deleteUser,
    async (req: Request, res: Response) => {
      const data = await this.userServices.deleteUser(req);

      if (data?.success) {
        res.status(200).json(data);
      } else {
        this.error('create user');
      }
    }
  );

  public resetUserPassword = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.userServices.resetUserPassword(req);

      if (data?.success) {
        res.status(200).json(data);
      } else {
        this.error('create user');
      }
    }
  );
  public changePassword = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.userServices.changePassword(req);

      if (data?.success) {
        res.status(200).json(data);
      } else {
        this.error('create user');
      }
    }
  );

  public viewUsers = this.assyncWrapper.wrap(
    this.validator.readRole,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.userServices.viewUsers(req);

      if (data.success) {
        res.status(200).json(data);
      }
    }
  );

  public getAllUsers = this.assyncWrapper.wrap(
    this.validator.readRole,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.userServices.getAllUsers(req);

      if (data.success) {
        res.status(200).json(data);
      }
    }
  );
  public getUserById = this.assyncWrapper.wrap(
    this.validator.readRole,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.userServices.getUserById(req);

      if (data.success) {
        res.status(200).json(data);
      }
    }
  );

  public addRole = this.assyncWrapper.wrap(
    this.validator.createRole,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.userServices.addRole(req);

      if (data.success) {
        res.status(200).json(data);
      }
    }
  );

  public checkUserRoleIsExist = this.assyncWrapper.wrap(
    this.validator.readRole,
    async (req: Request, res: Response) => {
      const data = await this.userServices.checkUserRoleIsExist(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
}

export default UserControllers;
