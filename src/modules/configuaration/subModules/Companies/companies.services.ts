import { Request } from 'express';
import AbstractServices from '../../../../abstracts/abstract.services';
import CustomError from '../../../../common/utils/errors/customError';

class ServicesCompanies extends AbstractServices {
  constructor() {
    super();
  }

  public CreateCompanies = async (req: Request) => {
    const data = await this.models.configModel
      .companyModel(req)
      .createCompany(req.body);

    return { success: true, data: { company_id: data } };
  };

  public UpdateCompanies = async (req: Request) => {
    const { company_id } = req.params;

    const data = await this.models.configModel
      .companyModel(req)
      .updateCompany(req.body, company_id);

    if (data === 0) {
      throw new CustomError(
        'Please provide a valid Id to update',
        400,
        'Update failed'
      );
    }
    return { success: true, data };
  };

  public DeleteCompanies = async (req: Request) => {
    const { company_id } = req.params;
    const { deleted_by } = req.body as { deleted_by: number };

    const data = await this.models.configModel
      .companyModel(req)
      .deleteCompany(company_id, deleted_by);

    return { success: true, data };
  };

  public viewCompanies = async (req: Request) => {
    const { page, size } = req.query;

    const data = await this.models.configModel
      .companyModel(req)
      .viewCompanies(Number(page) || 1, Number(size) || 20);

    return { success: true, ...data };
  };

  public getAllCompanies = async (req: Request) => {
    const data = await this.models.configModel
      .companyModel(req)
      .getAllCompanies();

    return { success: true, data };
  };
}
export default ServicesCompanies;
