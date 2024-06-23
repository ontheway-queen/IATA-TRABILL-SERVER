import dayjs from 'dayjs';
import { Request } from 'express';
import AbstractServices from '../../../abstracts/abstract.services';
import { getClientOrCombId } from '../../../common/helpers/invoice.helpers';
import SendEmailHelper from '../../../common/helpers/sendEmail.helper';
import {
  completePassportStatus,
  createPassport,
  updatePassportStatus,
} from '../../../common/templates/passportEmail.templates';
import { IPassportDb } from '../../../common/types/common.types';
import CustomError from '../../../common/utils/errors/customError';
import Lib from '../../../common/utils/libraries/lib';
import {
  ChangePassport,
  IEditPassport,
  IPassportEditReqBody,
  IPassportReqBody,
  IPassport_info,
  SMSlog,
} from '../types/passport.interfaces';

class PassportServices extends AbstractServices {
  constructor() {
    super();
  }

  /**
   * Add/ Upload Passport
   */
  public addPassport = async (req: Request) => {
    const { client_id, passport_info, passport_created_by } =
      req.body as IPassportReqBody;

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.passportModel(req, trx);
      const app_config_conn = this.models.configModel.appConfig(req, trx);

      const passportParseInfo: IPassport_info = JSON.parse(passport_info);

      const files = req.files as Express.Multer.File[] | [];

      const {
        org_name,
        org_address1,
        org_mobile_number,
        org_owner_email,
        org_logo,
      } = await conn.getOrganizationInfo();

      const appConfig = await app_config_conn.getAppConfig();

      const PassportData: IPassportDb = {
        passport_person_type: passportParseInfo.passport_person_type,
        passport_passport_no: passportParseInfo.passport_no,
        passport_name: passportParseInfo.name,
        passport_mobile_no: passportParseInfo.mobile_no,
        passport_date_of_birth:
          passportParseInfo.date_of_birth &&
          dayjs(passportParseInfo.date_of_birth).format(
            'YYYY-MM-DD HH:mm:ss.SSS'
          ),
        passport_date_of_issue:
          passportParseInfo.date_of_issue &&
          dayjs(passportParseInfo.date_of_issue).format(
            'YYYY-MM-DD HH:mm:ss.SSS'
          ),
        passport_date_of_expire:
          passportParseInfo.date_of_expire &&
          dayjs(passportParseInfo.date_of_expire).format(
            'YYYY-MM-DD HH:mm:ss.SSS'
          ),
        passport_email: passportParseInfo.email as string,
        passport_nid_no: passportParseInfo.nid as string,
        passport_created_by: passport_created_by,
      };

      if (files) {
        files.map((item) => {
          if (item.fieldname === 'passport_scan_copy')
            PassportData.passport_scan_copy = item.filename;
          if (item.fieldname === 'passport_upload_photo')
            PassportData.passport_upload_photo = item.filename;
          if (item.fieldname === 'passport_upload_others')
            PassportData.passport_upload_others = item.filename;
        });
      }

      const { email } = passportParseInfo;
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (appConfig?.tac_auto_email === 1 && email && regex.test(email)) {
        await SendEmailHelper.sendEmail({
          to: email,
          subject: 'Your Passport',
          html: createPassport(
            passportParseInfo.passport_no,
            org_name,
            org_owner_email,
            org_mobile_number,
            org_logo,
            org_address1
          ),
        });
      }

      // // CLIENT AND COMBINED CLIENT
      if (client_id) {
        const { invoice_client_id, invoice_combined_id } =
          getClientOrCombId(client_id);

        PassportData.passport_client_id = invoice_client_id;
        PassportData.passport_combined_id = invoice_combined_id;
      }

      const passport_id = await conn.addPassport(PassportData);

      // insert audit
      const message = `ADDED PASSPORT, PASSPORT NO ${passportParseInfo.passport_no}`;
      await this.insertAudit(
        req,
        'create',
        message,
        passport_created_by,
        'PASSPORT'
      );
      return {
        success: true,
        message: 'Passport added successfully',
        data: passport_id,
      };
    });
  };

  /**
   * Edit Passport
   */
  public editPassport = async (req: Request) => {
    const {
      passport_no,
      name,
      mobile_no,
      date_of_birth,
      date_of_issue,
      date_of_expire,
      email,
      nid,
      passport_created_by,
      passport_person_type,
    } = req.body as IPassportEditReqBody;

    const { passport_id } = req.params;

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.passportModel(req, trx);

      const files = req.files as Express.Multer.File[] | [];
      const {
        passport_scan_copy,
        passport_upload_others,
        passport_upload_photo,
      } = await conn.getPassportInfo(passport_id);

      const passportInfo: IEditPassport = {
        passport_passport_no: passport_no,
        passport_name: name,
        passport_mobile_no: mobile_no,
        passport_date_of_birth: date_of_birth,
        passport_date_of_issue: date_of_issue,
        passport_date_of_expire: date_of_expire,
        passport_email: email,
        passport_nid_no: nid,
        passport_person_type,
      };

      if (files) {
        files.map((item) => {
          if (item.fieldname === 'passport_scan_copy') {
            passportInfo.passport_scan_copy = item.filename;
            if (passport_scan_copy)
              this.manageFile.deleteFromCloud([passport_scan_copy]);
          }
          if (item.fieldname === 'passport_upload_photo') {
            passportInfo.passport_upload_photo = item.filename;
            if (passport_upload_photo)
              this.manageFile.deleteFromCloud([passport_upload_photo]);
          }
          if (item.fieldname === 'passport_upload_others') {
            passportInfo.passport_upload_others = item.filename;
            if (passport_upload_others)
              this.manageFile.deleteFromCloud([passport_upload_others]);
          }
        });
      }

      const passport_ids = await conn.editPassport(passportInfo, passport_id);

      // insert audit
      const message = `Passport updated successfully`;
      await this.insertAudit(
        req,
        'update',
        message,
        passport_created_by,
        'PASSPORT'
      );
      return {
        success: true,
        message: 'Passport edited successfully',
        data: passport_ids,
      };
    });
  };

  public allPassports = async (req: Request) => {
    let {
      page,
      size,
      search,
      from_date,
      to_date,
      filter: client_id,
    } = req.query as {
      page: string;
      size: string;
      search: string;
      from_date: string;
      to_date: string;
      filter: string;
    };

    let client: number | null = null;
    let combined: number | null = null;

    client_id = client_id === 'undefined' ? '' : client_id;

    if (client_id) {
      const { invoice_client_id, invoice_combined_id } =
        getClientOrCombId(client_id);

      client = invoice_client_id;
      combined = invoice_combined_id;
    }

    const conn = this.models.passportModel(req);

    const data = await conn.viewPassports(
      Number(page) || 1,
      Number(size) || 20,
      search,
      from_date,
      to_date,
      client,
      combined
    );

    return { success: true, ...data };
  };
  public getPassportsForSelect = async (req: Request) => {
    const { search } = req.query as { search: string };

    const conn = this.models.passportModel(req);

    const data = await conn.getPassportsForSelect(search);

    return { success: true, data };
  };

  public singlePassport = async (req: Request) => {
    const { passport_id } = req.params;

    const conn = this.models.passportModel(req);

    const data = await conn.singlePassport(passport_id);

    return { success: true, data };
  };

  public changePassportSts = async (req: Request) => {
    const {
      status_pstatus_id,
      status_create_date,
      status_created_by,
      status_sms_content,
      status_sms_content_client,
      passport_holder_number,
      client_number,
    } = req.body;

    const { passport_id } = req.params;

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.passportModel(req, trx);
      const sms_conn = this.models.smsModel(req, trx);
      const app_config_conn = this.models.configModel.appConfig(req, trx);

      const { tac_auto_email } = await app_config_conn.getAppConfig();

      const { passport_email, passport_passport_no } =
        await conn.viewPassportDetails(passport_id);

      const { org_sms_api_key, org_sms_client_id } =
        await sms_conn.getSmsApiAndClientID();

      const { pstatus_name } = await conn.getSingleStatus(status_pstatus_id);

      const {
        org_name,
        org_address1,
        org_mobile_number,
        org_owner_email,
        org_logo,
      } = await conn.getOrganizationInfo();

      const smsInfo: SMSlog = {
        smslog_for: 'PASSPORT_STATUS_CHANGE',
        smslog_passport_id: passport_id,
        smslog_delivery_status: 'DELIVERED',
      };

      if (passport_holder_number && org_sms_api_key && org_sms_client_id) {
        Lib.sendSms(
          passport_holder_number as string,
          status_sms_content as string,
          org_sms_api_key,
          org_sms_client_id
        );

        smsInfo.smslog_mobile = passport_holder_number;
        smsInfo.smslog_content = status_sms_content;
      }

      if (client_number && org_sms_api_key && org_sms_client_id) {
        Lib.sendSms(
          client_number as string,
          status_sms_content_client as string,
          org_sms_api_key,
          org_sms_client_id
        );

        smsInfo.smslog_mobile = client_number;
        smsInfo.smslog_content = status_sms_content_client;
      }

      const statusId = await conn.changePassportSts(
        status_pstatus_id,
        passport_id
      );

      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (
        pstatus_name.toLowerCase() === 'delhi' ||
        pstatus_name.toLowerCase() === 'approved'
      ) {
        if (
          tac_auto_email === 1 &&
          passport_email &&
          regex.test(passport_email)
        ) {
          await SendEmailHelper.sendEmail({
            to: passport_email,
            subject: 'Your Passport',
            html:
              pstatus_name.toLowerCase() === 'delhi'
                ? updatePassportStatus(
                    passport_passport_no,
                    org_name,
                    org_owner_email,
                    org_mobile_number,
                    org_logo,
                    org_address1
                  )
                : completePassportStatus(
                    passport_passport_no,
                    org_name,
                    org_owner_email,
                    org_mobile_number,
                    org_logo,
                    org_address1
                  ),
          });
        }
      }

      // ======================
      const passporStatusUpdateInfo: ChangePassport = {
        passport_status_id: statusId,
        passport_status_change_date: status_create_date,
      };

      await conn.statusPassport(passporStatusUpdateInfo, passport_id);

      await conn.smsLog(smsInfo);

      await conn.updatePstatusId(status_pstatus_id, passport_id);

      const message = `UPDATED PASSPORT STATUS`;
      await this.insertAudit(
        req,
        'update',
        message,
        status_created_by,
        'PASSPORT'
      );
      return {
        success: true,
        message: 'Passport status changed successfully',
        data: statusId,
      };
    });
  };

  /**
   * Passport status
   */
  public getStatus = async (req: Request) => {
    const { passport_id } = req.params;

    const conn = this.models.passportModel(req);

    const data = await conn.getPassportStatus(passport_id);

    return { success: true, data };
  };
  /**
   * Passport status
   */
  public passportNumberIsUnique = async (req: Request) => {
    const { passport_no } = req.params;

    if (!passport_no) {
      throw new CustomError('Please provide a passport_no', 400, 'Empty data');
    }

    const conn = this.models.passportModel(req);

    const data = await conn.passportNumberIsUnique(passport_no);

    if (data > 0) {
      return {
        success: true,
        data: false,
        message: 'Passport no. is exists',
      };
    } else {
      return {
        success: true,
        data: true,
        message: 'Passport no. is unique',
      };
    }
  };
  public deletePassport = async (req: Request) => {
    const { passport_id } = req.params;

    const { deleted_by } = req.body;

    const conn = this.models.passportModel(req);
    const prev_files = await conn.getPassportFiles(passport_id);

    prev_files.length && (await this.manageFile.deleteFromCloud(prev_files));

    await conn.deletePassport(passport_id, deleted_by);

    return {
      success: true,
      data: true,
      message: 'Passport no. is unique',
    };
  };
}

export default PassportServices;
