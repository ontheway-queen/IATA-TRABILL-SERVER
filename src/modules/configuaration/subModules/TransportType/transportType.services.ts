import { Request } from 'express';

import AbstractServices from '../../../../abstracts/abstract.services';

class TransportTypeServices extends AbstractServices {
  constructor() {
    super();
  }

  public createTransportType = async (req: Request) => {
    const id = await this.models.configModel
      .TransportTypeModel(req)
      .insertTransportType(req.body);

    return {
      success: true,
      message: 'Transport type created successfully',
      data: { id },
    };
  };

  public viewTransportTypes = async (req: Request) => {
    const { page, size } = req.query;

    const data = await this.models.configModel
      .TransportTypeModel(req)
      .viewTransportTypes(Number(page) || 1, Number(size) || 20);

    const count = await this.models.configModel
      .TransportTypeModel(req)
      .countTransportType();

    return { success: true, count, data };
  };
  public getAllTransportTypes = async (req: Request) => {
    const data = await this.models.configModel
      .TransportTypeModel(req)
      .getAllTransportTypes();

    return { success: true, data };
  };

  public updateTransportType = async (req: Request) => {
    const { id } = req.params;

    await this.models.configModel
      .TransportTypeModel(req)
      .updateTransportType(req.body, id);

    return {
      success: true,
      message: 'Transport type updated successfully',
    };
  };

  public deleteTransportType = async (req: Request) => {
    const { id } = req.params;

    const { deleted_by } = req.body as { deleted_by: number };

    await this.models.configModel
      .TransportTypeModel(req)
      .deleteTransportType(id, deleted_by);

    return { success: true, message: 'Transport type has been deleted' };
  };
}

export default TransportTypeServices;
