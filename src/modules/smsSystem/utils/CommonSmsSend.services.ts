import axios from 'axios';
import dayjs from 'dayjs';
import { Request } from 'express';
import { Knex } from 'knex';
import AbstractServices from '../../../abstracts/abstract.services';
import Lib from '../../../common/utils/libraries/lib';
import config from '../../../config/config';
import { ISms, SMSlog, smsInvoiceData } from '../types/sms.types';

class CommonSmsSendServices extends AbstractServices {
  public sendSms = async (
    req: Request,
    common_invoices: smsInvoiceData,
    trx: Knex.Transaction<any, any[]>
  ) => {
    const {
      invoice_client_id,
      invoice_combined_id,
      invoice_created_by,
      invoice_sales_date,
      invoice_message,
      invoice_id,
      receipt_id,
    } = common_invoices;

    return await this.models.db.transaction(async () => {
      const sms_conn = this.models.smsModel(req, trx);
      const client_conn = this.models.clientModel(req, trx);
      const app_config_conn = this.models.configModel.appConfig(req, trx);
      const common_conn = this.models.CommonInvoiceModel(req, trx);

      const config_info = await app_config_conn.getAppConfig();

      if (!config_info || config_info?.tac_auto_sms !== 1) {
        return;
      }

      let message: string = '';

      if (invoice_id) {
        const {
          invoice_no,
          org_owner_full_name,
          client_name,
          invoice_net_total,
          org_currency,
          invoice_sales_date,
        } = await common_conn.getSmsInvoiceInfo(invoice_id as number);

        message = `Dear Customer,
An invoice has been created on ${org_owner_full_name} Amount: ${invoice_net_total} ${org_currency.toUpperCase()} Invoice No: ${invoice_no} Please Contact With Us If You Have Any Query About This.
Thanks For Business With Us! ${dayjs(invoice_sales_date).format('DD-MM-YYYY')}`;
      }

      if (receipt_id) {
        const {
          receipt_total_amount,
          org_owner_full_name,
          org_currency,
          client_last_balance,
          client_name,
          receipt_payment_date,
        } = await common_conn.getSmsReceiptInfo(receipt_id);

        message = `Dear Customer,
Money Receipt has been Created on ${client_name} The Amount Is ${receipt_total_amount} ${org_currency.toUpperCase()} Last Balance ${client_last_balance} ${org_currency.toUpperCase()}.
Thanks For Being With Us! ${dayjs(receipt_payment_date).format('DD-MM-YYYY')}`;
      }

      const { category_id, mobile } = await client_conn.getCombClientMobile(
        invoice_client_id,
        invoice_combined_id
      );

      const regx = /^(\+?880)\d{10}$/;

      if (regx.test(mobile)) {
        const { org_sms_api_key, org_sms_client_id } =
          await sms_conn.getSmsApiAndClientID();

        const otpUrl = config.OTP_URL;

        if (org_sms_api_key && org_sms_client_id && otpUrl) {
          const url = `${otpUrl}Balance?ApiKey=${org_sms_api_key}&ClientId=${org_sms_client_id}`;
          const data = await axios.get(url);

          if (Number(data?.data?.Data[0]?.Credits?.replace('BDT', '')) > 1) {
            const smsInfo: ISms = {
              sms_client_catrgory_id: category_id,
              sms_client_id: invoice_client_id as number,
              sms_combine_id: invoice_combined_id as number,
              sms_client_mobile: mobile,
              sms_text_type: 'TEXT',
              sms_client_message:
                (invoice_message as string) || (message as string),
              sms_date: invoice_sales_date,
              sms_created_by: invoice_created_by,
            };

            await sms_conn.createSms(smsInfo);

            Lib.sendSms(
              String(mobile),
              (invoice_message as string) || (message as string),
              org_sms_api_key,
              org_sms_client_id
            );

            const smslogInfo: SMSlog = {
              smslog_for: 'OTHERS',
              smslog_mobile: 108,
              smslog_client_id: invoice_client_id as number,
              smslog_combine_id: invoice_combined_id as number,
              smslog_content:
                (invoice_message as string) || (message as string),
              smslog_delivery_status: 'DELIVERED',
            };

            await sms_conn.smsLog(smslogInfo);
          }
        }
      }
    });
  };
}

export default CommonSmsSendServices;
