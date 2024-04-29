import { Request } from 'express';
import AbstractServices from '../../abstracts/abstract.services';
import CustomError from '../../common/utils/errors/customError';

class DatabaseResetServices extends AbstractServices {
  constructor() {
    super();
  }

  resetDatabase = async (req: Request) => {
    const { agency_id } = req.params;
    const pass = req.query.pass;
    const { deleted_by } = req.body as { deleted_by: number };

    if (pass !== '668252') {
      throw new CustomError(
        'Please provide currect password',
        400,
        'Incorrect password'
      );
    }

    const conn = this.models.DatabaseResetModels(req);

    await conn.resetAllAgencyData(agency_id);

    return {
      success: true,
      message: 'Delete Agency Data Successfuly!',
    };
  };

  indexDatabase = async (req: Request) => {};
}

export default DatabaseResetServices;
