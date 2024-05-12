import { Request } from 'express';
import AbstractServices from '../../../../abstracts/abstract.services';
import {
  IAppConfig,
  ISignatureDB,
  ISignatureReqBody,
  ImagesTypes,
} from '../../types/configuration.interfaces';

class AppConfigServices extends AbstractServices {
  constructor() {
    super();
  }

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

  // SIGNATURE
  public addSignature = async (req: Request) => {
    const conn = this.models.configModel.appConfig(req);
    const body = req.body as ISignatureReqBody;

    const imageList = req.imgUrl;

    const imageUrlObj: {
      sig_signature: string;
    } = Object.assign({}, ...imageList);

    const sig_data: ISignatureDB = {
      sig_employee_id: body.sig_employee_id,
      sig_user_id: body.sig_user_id,
      sig_type: body.sig_type,
      sig_name_title: body.sig_name_title,
      sig_position: body.sig_position,
      sig_company_name: body.sig_company_name,
      sig_address: body.sig_address,
      sig_city: body.sig_city,
      sig_state: body.sig_state,
      sig_zip_code: body.sig_zip_code,
      sig_email: body.sig_email,
      sig_signature: imageUrlObj.sig_signature,
      sig_org_id: req.agency_id,
      sig_created_by: req.user_id,
    };

    await conn.insertSignature(sig_data);

    return { success: true, imageUrlObj };
  };

  public updateSignature = async (req: Request) => {
    const sig_id = req.params.sig_id;
    const conn = this.models.configModel.appConfig(req);
    const body = req.body as ISignatureReqBody;

    const imageList = req.imgUrl;

    const imageUrlObj: {
      sig_signature: string;
    } = Object.assign({}, ...imageList);

    const sig_data: ISignatureDB = {
      sig_employee_id: body.sig_employee_id,
      sig_user_id: body.sig_user_id,
      sig_type: body.sig_type,
      sig_name_title: body.sig_name_title,
      sig_position: body.sig_position,
      sig_company_name: body.sig_company_name,
      sig_address: body.sig_address,
      sig_city: body.sig_city,
      sig_state: body.sig_state,
      sig_zip_code: body.sig_zip_code,
      sig_email: body.sig_email,
      sig_signature: body?.sig_signature || imageUrlObj?.sig_signature || null,
      sig_org_id: req.agency_id,
      sig_created_by: req.user_id,
    };

    await conn.updateSignature(sig_data, sig_id);

    // DELETE PREVIOUS SIGNATURE
    if (!body?.sig_signature) {
      const signature = await conn.previousSignature(sig_id);

      await this.deleteFile.delete_image(signature);
    }

    return { success: true, imageUrlObj };
  };

  public updateSignatureStatus = async (req: Request) => {
    const sig_id = req.params.sig_id;
    const conn = this.models.configModel.appConfig(req);

    const { status } = req.body as { status: 'ACTIVE' | 'INACTIVE' };

    await conn.updateSignatureStatus(status, sig_id);

    return { success: true };
  };

  public getSignatures = async (req: Request) => {
    const conn = this.models.configModel.appConfig(req);

    const data = await conn.selectSignature();

    return { success: true, ...data };
  };
}
export default AppConfigServices;
