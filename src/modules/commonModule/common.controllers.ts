import { Request, Response } from 'express';
import AbstractController from '../../abstracts/abstract.controllers';
import AdminPanelServices from '../adminPanel/Services/adminPanel.services';
import UserValidator from '../configuaration/subModules/User/user.validator';

class CommonControllers extends AbstractController {
  private services = new AdminPanelServices();
  private validator = new UserValidator();

  constructor() {
    super();
  }

  public generateVoucher = this.assyncWrapper.wrap(
    this.validator.commonModule,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.services.generateVouchers(req);

      if (data.success) {
        res.status(200).json(data);
      }
    }
  );
}

export default CommonControllers;
