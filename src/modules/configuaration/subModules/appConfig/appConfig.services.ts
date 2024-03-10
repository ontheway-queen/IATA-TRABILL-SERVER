import { Request } from 'express';
import AbstractServices from '../../../../abstracts/abstract.services';
import {
  CreateIOffices,
  EditIOffices,
  IAppConfig,
  ImagesTypes,
} from '../../types/configuration.interfaces';

class AppConfigServices extends AbstractServices {
  constructor() {
    super();
  }

  public getAllOffice = async (req: Request) => {
    const conn = this.models.configModel.appConfig(req);

    const data = await conn.getAllOffice();

    return { success: true, ...data };
  };

  public getAllClientByOffice = async (req: Request) => {
    const { page, size, search } = req.query as {
      page: string;
      size: string;
      search: string;
    };

    const { office_id } = req.params as { office_id: string };

    const conn = this.models.configModel.appConfig(req);

    const data = await conn.getAllClientByOffice(
      Number(page) || 1,
      Number(size) || 20,
      search,
      office_id
    );

    return { success: true, ...data };
  };

  public getAllOfficeForEdit = async (req: Request) => {
    const { office_id } = req.params as { office_id: string };

    const conn = this.models.configModel.appConfig(req);

    const data = await conn.getAllOfficeForEdit(office_id);

    return { success: true, data };
  };

  public viewAllOffice = async (req: Request) => {
    const conn = this.models.configModel.appConfig(req);

    const data = await conn.viewAllOffice();

    return { success: true, data };
  };

  public createOffice = async (req: Request) => {
    const body = req.body as CreateIOffices;

    const { office_created_by } = req.body as { office_created_by: number };

    const conn = this.models.configModel.appConfig(req);

    const data = await conn.createOffice(body);

    const message = 'Office has been created';
    await this.insertAudit(req, 'create', message, office_created_by, 'RCM');

    return { success: true, message: 'Office created successfully', data };
  };

  public editOffice = async (req: Request) => {
    const { office_id } = req.params as { office_id: string };

    const body = req.body as EditIOffices;

    const { office_updated_by } = req.body as { office_updated_by: number };

    const conn = this.models.configModel.appConfig(req);

    await conn.editOffice(body, office_id);

    const message = 'Office has been updated';
    await this.insertAudit(req, 'update', message, office_updated_by, 'RCM');

    return { success: true, message: 'Office updated successfully' };
  };

  public deleteOffice = async (req: Request) => {
    const { office_id } = req.params as { office_id: string };

    const { deleted_by } = req.body as { deleted_by: number };

    const conn = this.models.configModel.appConfig(req);

    await conn.deleteOffice(office_id);

    const message = 'Office has been deleted';
    await this.insertAudit(req, 'delete', message, deleted_by, 'RCM');

    return { success: true, message: 'Office deleted successfully' };
  };

  public getAppConfig = async (req: Request) => {
    const conn = this.models.configModel.appConfig(req);

    const data = await conn.getAppConfig();

    return { success: true, data };
  };

  public updateAppConfig = async (req: Request) => {
    const body = req.body as IAppConfig;

    const conn = this.models.configModel.appConfig(req);

    await conn.updateAppConfig(body);

    return { success: true, message: 'App configuration updated successfully' };
  };

  public updateAppConfigSignature = async (req: Request) => {
    const imageList = req.imgUrl as string[];

    const getImageWithURL: ImagesTypes = imageList.reduce(
      (acc, image) => Object.assign(acc, image),
      { tac_sig_url: '', tac_wtr_mark_url: '' }
    );

    const customBody: ImagesTypes = {};

    if (getImageWithURL.tac_sig_url) {
      customBody.tac_sig_url = getImageWithURL.tac_sig_url;
    }

    if (getImageWithURL.tac_wtr_mark_url) {
      customBody.tac_wtr_mark_url = getImageWithURL.tac_wtr_mark_url;
    }

    const conn = this.models.configModel.appConfig(req);

    await conn.updateAppConfigSignature(customBody);

    return { success: true, message: 'App configuration updated successfully' };
  };
}
export default AppConfigServices;
