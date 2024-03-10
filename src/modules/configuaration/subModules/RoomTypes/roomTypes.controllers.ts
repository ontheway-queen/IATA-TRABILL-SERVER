import { Request, Response } from 'express';

import AbstractController from '../../../../abstracts/abstract.controllers';
import ServicesRoomTypes from './roomTypes.services';
import RoomTypesValidator from './roomTypes.validators';

class ControllersRoomTypes extends AbstractController {
  private servicesRoomTypes = new ServicesRoomTypes();
  private validator = new RoomTypesValidator();

  constructor() {
    super();
  }

  public createRoomType = this.assyncWrapper.wrap(
    this.validator.createRoomTypes,
    async (req: Request, res: Response) => {
      const data = await this.servicesRoomTypes.createRoomType(req);

      if (data.success) {
        res.status(201).json(data);
      } else {
        this.error('create room type controller');
      }
    }
  );

  public viewRoomTypes = this.assyncWrapper.wrap(
    this.validator.readRoomTypes,
    async (req: Request, res: Response) => {
      const data = await this.servicesRoomTypes.viewRoomTypes(req);

      if (data.success) {
        res.status(200).json(data);
      }
    }
  );

  public getAllRoomTypes = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.servicesRoomTypes.getAllRoomTypes(req);

      if (data.success) {
        res.status(200).json(data);
      }
    }
  );

  public deleteRoomType = this.assyncWrapper.wrap(
    this.validator.deleteRoomTypes,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.servicesRoomTypes.deleteRoomType(req);

      if (data.success) {
        res.status(200).json(data);
      } else this.error();
    }
  );

  public editRoomType = this.assyncWrapper.wrap(
    this.validator.editRoomTypes,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.servicesRoomTypes.editRoomType(req);

      if (data.success) {
        res.status(200).json(data);
      }
    }
  );
}

export default ControllersRoomTypes;
