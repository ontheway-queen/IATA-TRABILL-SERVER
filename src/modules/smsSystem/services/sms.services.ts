import axios from 'axios';
import { Request } from 'express';
import AbstractServices from '../../../abstracts/abstract.services';
import config from '../../../config/config';
import { separateCombClientToId } from '../../../common/helpers/common.helper';
import Lib from '../../../common/utils/libraries/lib';
import { ISms, ISmsReqBodyArray, SMSlog } from '../types/sms.types';

class SmsServices extends AbstractServices {
  constructor() {
    super();
  }

  /**
   * create sms
   */
  public createSms = async (req: Request) => {
    const smsInfoArr: ISmsReqBodyArray = req.body;

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.smsModel(req, trx);

      const transformedData = smsInfoArr.map(
        ({
          client_id,
          client_category_id,
          text_type,
          message,
          client_mobile,
          created_by,
          date,
        }) => {
          const { client_id: inv_client_id, combined_id } =
            separateCombClientToId(client_id as string);

          const smsInfo: ISms = {
            sms_client_catrgory_id: client_category_id,
            sms_client_id: inv_client_id as number,
            sms_combine_id: combined_id as number,
            sms_client_mobile: client_mobile,
            sms_text_type: text_type,
            sms_client_message: message,
            sms_date: date,
            sms_created_by: created_by,
          };

          return smsInfo;
        }
      );

      const phoneNoString = smsInfoArr
        .map((obj) => obj.client_mobile)
        .join(',');

      const message = smsInfoArr[0].message;

      const { org_sms_api_key, org_sms_client_id } =
        await conn.getSmsApiAndClientID();

      const smsId = await conn.createSmsArr(transformedData);

      Lib.sendSms(
        phoneNoString,
        message as string,
        org_sms_api_key,
        org_sms_client_id
      );

      const smsLogInfoArray = smsInfoArr.map(
        ({ client_id, client_mobile, message }) => {
          const { client_id: inv_client_id, combined_id } =
            separateCombClientToId(client_id as string);

          const smslogInfo: SMSlog = {
            smslog_for: 'OTHERS',
            smslog_mobile: client_mobile,
            smslog_client_id: inv_client_id !== 0 ? inv_client_id : null,
            smslog_combine_id: combined_id !== 0 ? combined_id : null,
            smslog_content: message,
            smslog_delivery_status: 'DELIVERED',
          };

          return smslogInfo;
        }
      );

      await conn.smsLogArr(smsLogInfoArray);

      // insert audit

      await this.insertAudit(
        req,
        'update',
        message,
        smsInfoArr[0].created_by,
        'SMS'
      );
      return {
        success: true,
        message,
        data: smsId,
      };
    });
  };

  public getSms = async (req: Request) => {
    const { from_date, to_date, page, size } = req.query;

    const conn = this.models.smsModel(req);

    const data = await conn.getSms(
      String(from_date),
      String(to_date),
      Number(page) || 1,
      Number(size) || 20
    );

    const count = await conn.countSmsDataRow();

    return { success: true, count, data };
  };

  public getSmsBalance = async (req: Request) => {
    const conn = this.models.smsModel(req);

    const { org_sms_api_key, org_sms_client_id } =
      await conn.getSmsApiAndClientID();

    const otpUrl = config.OTP_URL;

    if (org_sms_api_key && org_sms_client_id && otpUrl) {
      const url = `${otpUrl}Balance?ApiKey=${org_sms_api_key}&ClientId=${org_sms_client_id}`;
      const data = await axios.get(url);

      return { success: true, data };
    }

    return {
      success: true,
      message: "You don't have api key or client id",
      status: 404,
    };
  };
}

export default SmsServices;
