import { Request } from 'express';
import AbstractServices from '../../../../abstracts/abstract.services';
import CustomError from '../../../../common/utils/errors/customError';

class ServicesVisaTypes extends AbstractServices {
  constructor() {
    super();
  }

  public createVisaType = async (req: Request) => {
    const visaId = await this.models.configModel
      .visaTypeModel(req)
      .createVisaType(req.body);

    return {
      success: true,
      message: 'Visa type created successfully',
      data: { type_id: visaId },
    };
  };

  public viewVisaType = async (req: Request) => {
    const { page, size } = req.query as { page: string; size: string };

    const data = await this.models.configModel
      .visaTypeModel(req)
      .viewVisaType(page, size);

    const count = await this.models.configModel
      .visaTypeModel(req)
      .countVisaTypeDataRow();

    return { success: true, count, data: data };
  };
  public getAllVisaType = async (req: Request) => {
    const data = await this.models.configModel
      .visaTypeModel(req)
      .getAllVisaType();

    return { success: true, data: data };
  };

  public editVisaType = async (req: Request) => {
    const { id } = req.params;

    const visaTypes = await this.models.configModel
      .visaTypeModel(req)
      .editVisaType(req.body, id);

    if (visaTypes) {
      return {
        success: true,
        message: 'visa type updated successfully',
        data: visaTypes,
      };
    } else {
      throw new CustomError('Please provide a valid Id', 400, 'Bad request');
    }
  };

  public deleteVisaType = async (req: Request) => {
    const { type_id } = req.params;

    const data = await this.models.configModel
      .visaTypeModel(req)
      .deleteVisaType(type_id);

    return { success: true, data };
  };
}

export default ServicesVisaTypes;
