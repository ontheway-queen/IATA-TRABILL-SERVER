/*
Invoice visa create update common service
@Author MD Sabbir <sabbir.m360ict@gmail.com>
*/
import { Request } from 'express';
import { Knex } from 'knex';
import AbstractServices from '../../../../../abstracts/abstract.services';
import { separateCombClientToId } from '../../../../../common/helpers/common.helper';
import { isNotEmpty } from '../../../../../common/helpers/invoice.helpers';
import Trxns from '../../../../../common/helpers/Trxns';
import { IVTrxn } from '../../../../../common/interfaces/Trxn.interfaces';
import {
  ICommonVisaData,
  InvoiceVisaReq,
  IVisaBillingDb,
  IVisaPassport,
} from '../../types/invoiceVisa.interface';

class InsertVisaBilling extends AbstractServices {
  constructor() {
    super();
  }

  public insertVisaBilling = async (
    req: Request,
    commonVisaData: ICommonVisaData,
    vtrxn_pax: string | null,
    trx: Knex.Transaction<any, any[]>
  ) => {
    const {
      passport_information,
      invoice_sales_date,
      billing_information,
      invoice_note,
      invoice_no,
    } = req.body as InvoiceVisaReq;

    const { invoice_created_by, invoice_id } = commonVisaData;

    return await this.models.db.transaction(async () => {
      const conn = this.models.invoiceVisaModel(req, trx);
      const trxns = new Trxns(req, trx);

      for (const billing_info of billing_information) {

        const {
          billing_id,
          billing_product_id,
          billing_visiting_country_id,
          billing_visa_type_id,
          billing_cost_price,
          billing_delivery_date,
          billing_profit,
          billing_quantity,
          billing_mofa_no,
          billing_okala_no,
          billing_visa_no,
          billing_status,
          billing_token,
          billing_unit_price,
          billing_comvendor,
          is_deleted,
        } = billing_info;

        let billing_vtrxn_id: number | null = null;
        const billing_subtotal = billing_unit_price * billing_quantity;
        const billingInfo: IVisaBillingDb = {
          billing_invoice_id: invoice_id,
          billing_sales_date: invoice_sales_date,
          billing_remaining_quantity: billing_quantity,
          billing_cost_price: Number(billing_cost_price || 0),
          billing_delivery_date,
          billing_mofa_no,
          billing_okala_no,
          billing_visa_no,
          billing_product_id,
          billing_profit,
          billing_quantity,
          billing_status,
          billing_subtotal,
          billing_token,
          billing_unit_price,
          billing_visa_type_id,
          billing_visiting_country_id,
        };

        const billingExist:
          | undefined
          | {
            billing_invoice_id: number;
            prevComvendor: string;
            prevTrxnId: number;
            billing_status: string;
          } = await conn.billingIsExist(billing_id as number);

        // IF VENDOR AND COST PRICE EXIST
        if (billing_cost_price && billing_comvendor) {
          const total_cost_price = billing_cost_price * billing_quantity;
          const { vendor_id, combined_id } = separateCombClientToId(
            billing_comvendor as string
          );

          billingInfo.billing_vendor_id = vendor_id;
          billingInfo.billing_combined_id = combined_id;

          const VTrxnBody: IVTrxn = {
            comb_vendor: billing_comvendor as string,
            vtrxn_amount: total_cost_price,
            vtrxn_created_at: invoice_sales_date,
            vtrxn_note: invoice_note,
            vtrxn_particular_id: 149,
            vtrxn_particular_type: 'Invoice visa update',
            vtrxn_type: combined_id ? 'CREDIT' : 'DEBIT',
            vtrxn_user_id: invoice_created_by,
            vtrxn_voucher: invoice_no,
            vtrxn_pax,
          };

          if (billing_status === 'Approved') {
            if (billingExist?.prevTrxnId) {
              await trxns.VTrxnUpdate({
                ...VTrxnBody,
                trxn_id: billingExist?.prevTrxnId,
              });

              billing_vtrxn_id = billingExist?.prevTrxnId;
            } else {
              billing_vtrxn_id = await trxns.VTrxnInsert(VTrxnBody);
            }
          }
        }

        if (is_deleted !== 1) {
          if (!billing_id) {
            await conn.insertVisaBilling({ ...billingInfo, billing_vtrxn_id });
          }
          // IF UPDATE BILLING TRANSACTION
          else if (billing_vtrxn_id && billing_id) {
            await conn.updateVisaBilling(
              { ...billingInfo, billing_vtrxn_id },
              billing_id as number
            );
          }
          // IF UPDATE BILLING BUT REMOVE TRANSACTION/VENDOR
          else if (!billing_vtrxn_id && billing_id) {
            // delete previous vendor transaction
            if (billingExist?.billing_status === 'Approved') {
              await trxns.deleteVTrxn(
                billingExist?.prevTrxnId,
                billingExist?.prevComvendor
              );
            }

            // billingInfo.billing_combined_id = null;
            // billingInfo.billing_vendor_id = null;
            // billingInfo.billing_vtrxn_id = null;
            // billingInfo.billing_cost_price = 0;

            // update billing information
            await conn.updateVisaBilling(billingInfo, billing_id as number);
          }
        }
        // DELETE BILLING
        else {
          await conn.deleteBillingSingleInfo(
            billing_id as number,
            invoice_created_by
          );

          if (billingExist?.billing_status === 'Approved') {
            await trxns.deleteVTrxn(
              billingExist?.prevTrxnId,
              billingExist?.prevComvendor
            );
          }
        }
      }

      if (passport_information.length && isNotEmpty(passport_information[0])) {
        for (const passports_info of passport_information) {
          const { passport_id, visapss_details_id, is_deleted } =
            passports_info;

          const visaPassInfo: IVisaPassport = {
            visapss_details_id,
            visapss_details_invoice_id: invoice_id,
            visapss_details_passport_id: passport_id as number,
          };
          if (is_deleted !== 1) {
            if (!visapss_details_id) {
              await conn.insertVisaPassport(visaPassInfo);
            } else {
              await conn.updateVisaPassport(visaPassInfo, visapss_details_id);
            }
          } else {
            await conn.deleteSignleVisaPassport(
              visapss_details_id as number,
              invoice_created_by
            );
          }
        }
      }
    });
  };
}

export default InsertVisaBilling;
