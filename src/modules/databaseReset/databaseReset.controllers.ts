import { Request, Response } from 'express';
import AbstractController from '../../abstracts/abstract.controllers';
import DatabaseResetValidators from './databaseReset.Validators';
import DatabaseResetServices from './databaseReset.services';

class DatabaseResetControllers extends AbstractController {
  private validator = new DatabaseResetValidators();
  private services = new DatabaseResetServices();

  constructor() {
    super();
  }

  public databaseReset = this.assyncWrapper.wrap(
    this.validator.database,
    async (req: Request, res: Response) => {
      const data = await this.services.resetDatabase(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        throw new Error('Thare was an error in invoice post');
      }
    }
  );
}

export default DatabaseResetControllers;
