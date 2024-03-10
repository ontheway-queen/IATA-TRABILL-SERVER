import { Request, Response } from 'express';
import AbstractController from '../abstracts/abstract.controllers';
import CustomError from '../common/utils/errors/customError';
import AdminPanelValidators from '../modules/adminPanel/Validators/adminPanel.validators';
import AdminAuthServices from './admin_auth.services';

class AdminAuthControllers extends AbstractController {
  private services = new AdminAuthServices();
  private validator = new AdminPanelValidators();

  constructor() {
    super();
  }

  public loginUser = this.assyncWrapper.wrap(
    this.validator.loginUser,
    async (req: Request, res: Response) => {
      const data = await this.services.loginUser(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('login controller');
      }
    }
  );

  public loginAdmin = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.services.loginAdmin(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('login controller');
      }
    }
  );

  public logoutUser = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.services.logoutUser(req);

      if (data.success) {
        res.status(204).json(data);
      } else {
        this.error('login controller');
      }
    }
  );

  public getStartupToken = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.services.getStartupToken(req);

      if (data?.success) {
        res.status(200).json(data);
      } else {
        this.error('getToken controller');
      }
    }
  );

  public getRefreshToken = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.services.getRefreshToken(req);

      if (data instanceof CustomError) {
        res.status(400).json({ success: false, ...data });
      } else if (data?.success) {
        res.status(200).json(data);
      } else {
        this.error('getToken controller');
      }
    }
  );

  public forgotPasswordOrUsername = this.assyncWrapper.wrap(
    this.validator.forgotUsernameOrPass,
    async (req: Request, res: Response) => {
      const data = await this.services.forgotPasswordOrUsername(req);

      if (data?.success) {
        res.status(200).json(data);
      } else {
        this.error('getToken controller');
      }
    }
  );

  public varifyOTPandChangeUsernamePassword = this.assyncWrapper.wrap(
    this.validator.verifyOtpChangeUsernamePass,
    async (req: Request, res: Response) => {
      const data = await this.services.varifyOTPandChangeUsernamePassword(req);

      if (data?.success) {
        res.status(200).json(data);
      } else {
        this.error('getToken controller');
      }
    }
  );

  public _updateUserAndPassword = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.services._updateUserAndPassword(req);

      if (data?.success) {
        res.status(200).json(data);
      } else {
        this.error('getToken controller');
      }
    }
  );
}

export default AdminAuthControllers;
