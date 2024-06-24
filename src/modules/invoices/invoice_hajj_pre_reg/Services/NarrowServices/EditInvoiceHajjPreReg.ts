import { Request } from 'express';
import AbstractServices from '../../../../../abstracts/abstract.services';
import { separateCombClientToId } from '../../../../../common/helpers/common.helper';
import InvoiceHelpers, {
  getClientOrCombId,
  InvoiceClientAndVendorValidate,
} from '../../../../../common/helpers/invoice.helpers';
import Trxns from '../../../../../common/helpers/Trxns';
import { IVTrxn } from '../../../../../common/interfaces/Trxn.interfaces';
import { InvoiceHistory } from '../../../../../common/types/common.types';
import {
  InvoiceExtraAmount,
  IUpdateInvoiceInfoDb,
} from '../../../../../common/types/Invoice.common.interface';
import { IOtherBillingInfoDb } from '../../../invoice_other/types/invoiceOther.interface';
import { InvoiceUtils } from '../../../utils/invoice.utils';
import {
  IHajiInformationDb,
  IInvoiceHajiPreReg,
  IInvoiceHajjPreReg,
} from '../../Type/InvoiceHajjPreReg.Interfaces';

class EditInvoiceHajjpre extends AbstractServices {
  constructor() {
    super();
  }

  public editInvoiceHajjPre = async (req: Request) => {
    const {
      billing_information,
      haji_information,
      invoice_combclient_id,
      invoice_net_total,
      invoice_sales_date,
      invoice_due_date,
      invoice_sales_man_id,
      invoice_sub_total,
      invoice_vat,
      invoice_created_by,
      invoice_note,
      invoice_discount,
      invoice_haji_group_id,
      invoice_service_charge,
      invoice_agent_id,
      invoice_agent_com_amount,
      invoice_no,
      invoice_reference,
    } = req.body as IInvoiceHajjPreReg;

    // VALIDATE CLIENT AND VENDOR
    const { invoice_total_profit, invoice_total_vendor_price } =
      await InvoiceClientAndVendorValidate(
        billing_information,
        invoice_combclient_id
      );

    const { invoice_client_id, invoice_combined_id } = await getClientOrCombId(
      invoice_combclient_id
    );

    const invoice_id = Number(req.params.invoice_id);

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.invoiceHajjPre(req, trx);
      const common_conn = this.models.CommonInvoiceModel(req, trx);
      const trxns = new Trxns(req, trx);

      const { prevCtrxnId, prevClChargeTransId } =
        await common_conn.getPreviousInvoices(invoice_id);

      const productsIds = billing_information.map(
        (item) => item.billing_product_id
      );

      let note = '';

      if (productsIds.length) {
        note = await common_conn.getProductsName(productsIds);
      }

      // CLIENT TRANSACTIONS
      const utils = new InvoiceUtils(req.body, common_conn);
      const clientTransId = await utils.updateClientTrans(trxns, {
        prevClChargeTransId,
        prevCtrxnId,
        invoice_no,
        tr_type: 13,
        dis_tr_type: 14,
        note,
      });

      const invoice_information: IUpdateInvoiceInfoDb = {
        ...clientTransId,
        invoice_sub_total,
        invoice_sales_man_id,
        invoice_net_total,
        invoice_sales_date,
        invoice_due_date,
        invoice_updated_by: invoice_created_by,
        invoice_note,
        invoice_client_id,
        invoice_combined_id,
        invoice_haji_group_id,
        invoice_reference,
        invoice_total_profit,
        invoice_total_vendor_price,
      };

      await common_conn.updateInvoiceInformation(
        invoice_id,
        invoice_information
      );

      // AGENT TRANSACTION
      if (invoice_agent_id) {
        await InvoiceHelpers.invoiceAgentTransactions(
          this.models.agentProfileModel(req, trx),
          req.agency_id,
          invoice_agent_id,
          invoice_id,
          invoice_no,
          invoice_created_by,
          invoice_agent_com_amount,
          'UPDATE',
          103,
          'INVOICE HAJJ PRE REGISTRATION'
        );
      } else {
        await InvoiceHelpers.deleteAgentTransactions(
          this.models.agentProfileModel(req, trx),
          invoice_id,
          invoice_created_by
        );
      }

      const invoiceExtraAmount: InvoiceExtraAmount = {
        extra_amount_invoice_id: invoice_id,
        invoice_vat,
        invoice_discount,
        invoice_service_charge,
        invoice_agent_id,
        invoice_agent_com_amount,
      };
      await common_conn.updateInvoiceExtraAmount(
        invoiceExtraAmount,
        invoice_id
      );

      // ================== @Haji Information ==================
      for (const haji_info of haji_information) {
        const {
          hajiinfo_id,
          hajiinfo_dob,
          hajiinfo_gender,
          hajiinfo_mobile,
          hajiinfo_name,
          hajiinfo_nid,
          hajiinfo_serial,
          hajiinfo_tracking_number,
          haji_info_maharam,
          haji_info_possible_year,
          haji_info_reg_year,
          haji_info_vouchar_no,
          hajiinfo_is_deleted,
        } = haji_info;

        if (hajiinfo_is_deleted !== 1) {
          if (!hajiinfo_id) {
            const insertedHajiInfo: IHajiInformationDb = {
              hajiinfo_dob,
              hajiinfo_gender,
              hajiinfo_mobile,
              hajiinfo_name,
              hajiinfo_nid,
              hajiinfo_serial,
              hajiinfo_tracking_number,
              hajiinfo_created_by: invoice_created_by,
            };
            const haji_info_haji_id = await conn.insertHajiInfo(
              insertedHajiInfo
            );

            const invoiceHajjPreInfo: IInvoiceHajiPreReg = {
              haji_info_haji_id,
              haji_info_invoice_id: invoice_id,
              haji_info_maharam,
              haji_info_possible_year,
              haji_info_reg_year,
              haji_info_vouchar_no,
              haji_info_created_by: invoice_created_by,
            };

            await conn.insertHajiPreReg(invoiceHajjPreInfo);
          } else {
            const insertedHajiInfo: IHajiInformationDb = {
              hajiinfo_dob,
              hajiinfo_gender,
              hajiinfo_mobile,
              hajiinfo_name,
              hajiinfo_nid,
              hajiinfo_serial,
              hajiinfo_tracking_number,
              hajiinfo_created_by: invoice_created_by,
            };
            await conn.updateHajiInfo(insertedHajiInfo, hajiinfo_id);

            const invoiceHajjPreInfo: IInvoiceHajiPreReg = {
              haji_info_haji_id: hajiinfo_id,
              haji_info_invoice_id: invoice_id,
              haji_info_maharam,
              haji_info_possible_year,
              haji_info_reg_year,
              haji_info_vouchar_no,
              haji_info_created_by: invoice_created_by,
            };

            await conn.updateHajiPreReg(invoiceHajjPreInfo, hajiinfo_id);
          }
        } else {
          await conn.deleteHajiPreRegInfo(
            hajiinfo_id as number,
            invoice_created_by
          );
          await conn.deletePrevHajiInfo(
            hajiinfo_id as number,
            invoice_created_by
          );
        }
      }

      // BILLING
      for (const billingInfo of billing_information) {
        const {
          billing_id,
          billing_comvendor,
          billing_cost_price,
          billing_quantity,
          billing_product_id,
          billing_profit,
          billing_unit_price,
          pax_name,
          billing_description,
          is_deleted,
        } = billingInfo;

        const total_cost_price = Number(billing_cost_price) * billing_quantity;
        const billing_subtotal = billing_quantity * billing_unit_price;

        const { combined_id, vendor_id } =
          separateCombClientToId(billing_comvendor);

        const VTrxnBody: IVTrxn = {
          comb_vendor: billing_comvendor,
          vtrxn_amount: total_cost_price,
          vtrxn_created_at: invoice_sales_date,
          vtrxn_note: billing_description,
          vtrxn_particular_id: 13,
          vtrxn_pax: pax_name,
          vtrxn_type: combined_id ? 'CREDIT' : 'DEBIT',
          vtrxn_user_id: invoice_created_by,
          vtrxn_voucher: invoice_no,
        };
        if (is_deleted !== 1) {
          if (!billing_id) {
            const billing_vtrxn_id = await trxns.VTrxnInsert(VTrxnBody);

            const billingInfoData: IOtherBillingInfoDb = {
              billing_invoice_id: invoice_id,
              billing_sales_date: invoice_sales_date,
              billing_vendor_id: vendor_id,
              billing_combined_id: combined_id,
              billing_cost_price,
              billing_quantity,
              billing_remaining_quantity: billing_quantity,
              billing_subtotal,
              billing_product_id,
              billing_profit,
              billing_unit_price,
              pax_name,
              billing_description,
              billing_vtrxn_id,
            };
            await conn.insertHajiBillingInfo(billingInfoData);
          } else {
            const [{ prevTrxnId, prevComvendor }] =
              await conn.getPreRegBillingInfo(billing_id);

            await trxns.VTrxnUpdate({ ...VTrxnBody, trxn_id: prevTrxnId });

            const billingInfoData: IOtherBillingInfoDb = {
              billing_invoice_id: invoice_id,
              billing_sales_date: invoice_sales_date,
              billing_vendor_id: vendor_id,
              billing_combined_id: combined_id,
              billing_cost_price,
              billing_quantity,
              billing_remaining_quantity: billing_quantity,
              billing_subtotal,
              billing_product_id,
              billing_profit,
              billing_unit_price,
              pax_name,
              billing_description,
            };

            await conn.updateHajiBillingInfo(billingInfoData, billing_id);
          }
        } else {
          const previousBillingInfo = await conn.getPreRegBillingInfo(
            billing_id as number
          );

          await conn.deleteSingleHajiPreReg(
            billing_id as number,
            invoice_created_by
          );

          await trxns.deleteInvVTrxn(previousBillingInfo);
        }
      }

      // @Invoic History
      const history_data: InvoiceHistory = {
        history_activity_type: 'INVOICE_UPDATED',
        history_created_by: invoice_created_by,
        history_invoice_id: invoice_id,
        history_invoice_payment_amount: invoice_net_total,
        invoicelog_content: 'Invoice hajj pre registration has been updated',
      };
      await common_conn.insertInvoiceHistory(history_data);

      await this.insertAudit(
        req,
        'update',
        `Invoice hajj has been updated, Voucher - ${invoice_no}, Net - ${invoice_net_total}/-`,
        invoice_created_by,
        'INVOICES'
      );
      return {
        success: true,
        message: 'Invoice hajj pre registration has been updated',
      };
    });
  };
}

export default EditInvoiceHajjpre;
