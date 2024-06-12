import { Request } from 'express';
import AbstractServices from '../../../../abstracts/abstract.services';
import CustomError from '../../../../common/utils/errors/customError';
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
    const files = req.files as Express.Multer.File[] | [];

    const customBody: ImagesTypes = {};

    const conn = this.models.configModel.appConfig(req);
    const { tac_sig_url, tac_wtr_mark_url } = await conn.getAppConfigInfo();

    if (files) {
      files.map((item) => {
        if (item.fieldname === 'tac_sig_url') {
          customBody.tac_sig_url = item.filename;
          if (tac_sig_url) this.manageFile.deleteFromCloud([tac_sig_url]);
        }
        if (item.fieldname === 'tac_wtr_mark_url') {
          customBody.tac_wtr_mark_url = item.filename;
          if (tac_wtr_mark_url)
            this.manageFile.deleteFromCloud([tac_wtr_mark_url]);
        }
      });
    }

    await conn.updateAppConfigSignature(customBody);

    return { success: true, message: 'App configuration updated successfully' };
  };

  // SIGNATURE
  public addSignature = async (req: Request) => {
    const conn = this.models.configModel.appConfig(req);
    const body = req.body as ISignatureReqBody;

    const files = req.files as Express.Multer.File[] | [];

    if (body.sig_type === 'AUTHORITY') {
      const count = await conn.checkSignatureTypeIsExist();

      if (count) {
        await this.manageFile.deleteFromCloud([files[0].filename]);
        throw new CustomError(
          'An authority signature already exists!',
          400,
          'Authority exists'
        );
      }
    }

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
      sig_signature: files[0].filename,
      sig_org_id: req.agency_id,
      sig_created_by: req.user_id,
      sig_phone_no: body.sig_phone_no,
    };

    await conn.insertSignature(sig_data);

    return { success: true, imageUrlObj: files[0].filename };
  };

  public updateSignature = async (req: Request) => {
    const sig_id = req.params.sig_id;
    const conn = this.models.configModel.appConfig(req);
    const body = req.body as ISignatureReqBody;

    const files = req.files as Express.Multer.File[] | [];

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
      sig_org_id: req.agency_id,
      sig_created_by: req.user_id,
      sig_phone_no: body.sig_phone_no,
    };

    if (files[0].filename) sig_data.sig_signature = files[0].filename;

    await conn.updateSignature(sig_data, sig_id);

    // DELETE PREVIOUS SIGNATURE
    if (files[0].filename) {
      const signature = await conn.previousSignature(sig_id);

      signature && (await this.manageFile.deleteFromCloud([signature]));
    }

    return { success: true, imageUrlObj: files[0].filename };
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
