import { Request, Response } from 'express';

import AbstractController from '../../../../abstracts/abstract.controllers';
import ServicesVisaTypes from './visaTypes.services';
import VisaTypesValidator from './visaTypes.validators';

class ControllersVisaTypes extends AbstractController {
  private servicesVisaTypes = new ServicesVisaTypes();
  private validator = new VisaTypesValidator();

  constructor() {
    super();
  }

  public createVisaType = this.assyncWrapper.wrap(
    this.validator.createVisaTypes,
    async (req: Request, res: Response) => {
      const data = await this.servicesVisaTypes.createVisaType(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('create visa type controller');
      }
    }
  );

  public viewVisaType = this.assyncWrapper.wrap(
    this.validator.readVisaTypes,
    async (req: Request, res: Response) => {
      const data = await this.servicesVisaTypes.viewVisaType(req);

      if (data.success) {
        res.status(200).json(data);
      } else this.error();
    }
  );
  public getAllVisaType = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.servicesVisaTypes.getAllVisaType(req);

      if (data.success) {
        res.status(200).json(data);
      } else this.error();
    }
  );

  public editVisaType = this.assyncWrapper.wrap(
    this.validator.editVisaTypes,
    async (req: Request, res: Response) => {
      const data = await this.servicesVisaTypes.editVisaType(req);

      if (data.success) {
        res.status(200).json(data);
      } else this.error();
    }
  );

  public deleteVisaType = this.assyncWrapper.wrap(
    this.validator.deleteVisaTypes,
    async (req: Request, res: Response) => {
      const data = await this.servicesVisaTypes.deleteVisaType(req);

      if (data.success) {
        res.status(200).json(data);
      } else this.error();
    }
  );
}

export default ControllersVisaTypes;
