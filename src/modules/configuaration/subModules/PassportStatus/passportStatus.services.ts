import { Request } from 'express';
import AbstractServices from '../../../../abstracts/abstract.services';
import CustomError from '../../../../common/utils/errors/customError';
class ServicesPassportStatus extends AbstractServices {
  constructor() {
    super();
  }

  // comment
  public T_createPassportStatus = async (req: Request) => {
    const data = await this.models.configModel
      .passportStatusModel(req)
      .createPassportStatus(req.body);

    return { success: true, data: { pstatus_id: data } };
  };

  public viewPassports = async (req: Request) => {
    const { page, size, search, from_date, to_date } = req.query as {
      page: string;
      size: string;
      search: string;
      from_date: string;
      to_date: string;
    };

    const { client_id, combined_id } = req.body as {
      client_id: number;
      combined_id: number;
    };

    const conn = this.models.passportModel(req);

    const data = await conn.viewPassports(
      Number(page) || 1,
      Number(size) || 20,
      search,
      from_date,
      to_date,
      client_id,
      combined_id
    );

    return { success: true, ...data };
  };
  public getAllPassports = async (req: Request) => {
    const conn = this.models.passportModel(req);

    const data = await conn.getAllPassports();

    return { success: true, data };
  };

  public T_updatePassportStatus = async (req: Request) => {
    const { status_id } = req.params;

    const data = await this.models.configModel
      .passportStatusModel(req)
      .updatePassportStatus(req.body, status_id);

    if (data === 0) {
      throw new CustomError(
        'Please provide a valid Id to update',
        400,
        'Update failed'
      );
    }

    return { success: true, data };
  };

  public T_readPassportStatus = async (req: Request) => {
    const data = await this.models.configModel
      .passportStatusModel(req)
      .getAllPassportStatus();

    return { success: true, data };
  };

  public T_deletePassportStatus = async (req: Request) => {
    const { status_id } = req.params;
    const { deleted_by } = req.body as { deleted_by: number };

    const data = await this.models.configModel
      .passportStatusModel(req)
      .deletePassportStatus(status_id, deleted_by);

    return { success: true, data };
  };
}

export default ServicesPassportStatus;
