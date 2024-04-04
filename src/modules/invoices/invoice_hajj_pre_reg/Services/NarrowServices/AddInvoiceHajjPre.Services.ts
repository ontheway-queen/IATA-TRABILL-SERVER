import { Request } from 'express';
import AbstractServices from '../../../../../abstracts/abstract.services';
import { separateCombClientToId } from '../../../../../common/helpers/common.helper';
import InvoiceHelpers, {
  getClientOrCombId,
  InvoiceClientAndVendorValidate,
  MoneyReceiptAmountIsValid,
} from '../../../../../common/helpers/invoice.helpers';
import CommonAddMoneyReceipt from '../../../../../common/services/CommonAddMoneyReceipt';
import {
  ICommonMoneyReceiptInvoiceData,
  InvoiceHistory,
} from '../../../../../common/types/common.types';
import {
  IInvoiceInfoDb,
  InvoiceExtraAmount,
} from '../../../../../common/types/Invoice.common.interface';
import { IOtherBillingInfoDb } from '../../../invoice_other/types/invoiceOther.interface';
import { smsInvoiceData } from '../../../../smsSystem/types/sms.types';
import CommonSmsSendServices from '../../../../smsSystem/utils/CommonSmsSend.services';
import {
  IHajiInformationDb,
  IInvoiceHajiPreReg,
  IInvoiceHajjPreReg,
} from '../../Type/InvoiceHajjPreReg.Interfaces';
import {
  IClTrxnBody,
  IVTrxn,
} from '../../../../../common/interfaces/Trxn.interfaces';
import Trxns from '../../../../../common/helpers/Trxns';

class AddInvoiceHajjpre extends AbstractServices {
  constructor() {
    super();
  }

  public addInvoiceHajjPre = async (req: Request) => {
    const {
      billing_information,
      haji_information,
      invoice_combclient_id,
      invoice_net_total,
      invoice_sales_date,
      invoice_due_date,
      invoice_sales_man_id,
      invoice_sub_total,
      invoice_created_by,
      invoice_note,
      invoice_vat,
      invoice_discount,
      invoice_haji_group_id,
      invoice_agent_com_amount,
      invoice_agent_id,
      invoice_service_charge,
      invoice_reference,
      money_receipt,
    } = req.body as IInvoiceHajjPreReg;

    // VALIDATE CLIENT AND VENDOR
    const { invoice_total_profit, invoice_total_vendor_price } =
      await InvoiceClientAndVendorValidate(
        billing_information,
        invoice_combclient_id
      );

    // VALIDATE MONEY RECEIPT AMOUNT
    MoneyReceiptAmountIsValid(money_receipt, invoice_net_total);

    // CLIENT AND COMBINED CLIENT
    const { client_id: invoice_client_id, combined_id: invoice_combined_id } =
      separateCombClientToId(invoice_combclient_id);

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.invoiceHajjPre(req, trx);
      const common_conn = this.models.CommonInvoiceModel(req, trx);
      const trxns = new Trxns(req, trx);

      const invoice_no = await this.generateVoucher(req, 'IHP');

      const ctrxn_pax = billing_information
        .map((item) => item.pax_name)
        .join(' ,');

      // CLIENT COMBINE TRANSACTION
      const clTrxnBody: IClTrxnBody = {
        ctrxn_type: 'DEBIT',
        ctrxn_amount: invoice_net_total,
        ctrxn_cl: invoice_combclient_id,
        ctrxn_voucher: invoice_no,
        ctrxn_particular_id: 102,
        ctrxn_created_at: invoice_sales_date,
        ctrxn_note: invoice_note,
        ctrxn_particular_type: 'Invoice hajj pre reg create',
        ctrxn_pax,
      };

      const invoice_cltrxn_id = await trxns.clTrxnInsert(clTrxnBody);

      // ============= invoice inforamtion
      const invoice_information: IInvoiceInfoDb = {
        invoice_client_id,
        invoice_no: invoice_no as string,
        invoice_sub_total,
        invoice_category_id: 30,
        invoice_sales_man_id,
        invoice_net_total,
        invoice_combined_id,
        invoice_sales_date,
        invoice_due_date,
        invoice_created_by,
        invoice_note,
        invoice_haji_group_id,
        invoice_cltrxn_id,
        invoice_total_profit,
        invoice_total_vendor_price,
        invoice_reference,
      };

      const invoice_id = await common_conn.insertInvoicesInfo(
        invoice_information
      );

      // AGENT TRANSACTION
      await InvoiceHelpers.invoiceAgentTransactions(
        this.models.agentProfileModel(req, trx),
        req.agency_id,
        invoice_agent_id,
        invoice_id,
        invoice_no,
        invoice_created_by,
        invoice_agent_com_amount,
        'CREATE',
        102,
        'HAJJ PRE REGISTRATION'
      );

      const invoice_extra_ammount: InvoiceExtraAmount = {
        extra_amount_invoice_id: invoice_id,
        invoice_agent_com_amount,
        invoice_agent_id,
        invoice_service_charge,
        invoice_discount,
        invoice_vat,
      };
      await common_conn.insertInvoiceExtraAmount(invoice_extra_ammount);

      for (const haji_info of haji_information) {
        const insertedHajiInfo: IHajiInformationDb = {
          hajiinfo_dob: haji_info.hajiinfo_dob,
          hajiinfo_gender: haji_info.hajiinfo_gender,
          hajiinfo_mobile: haji_info.hajiinfo_mobile,
          hajiinfo_name: haji_info.hajiinfo_name,
          hajiinfo_nid: haji_info.hajiinfo_nid,
          hajiinfo_serial: haji_info.hajiinfo_serial,
          hajiinfo_tracking_number: haji_info.hajiinfo_tracking_number,
          hajiinfo_created_by: invoice_created_by,
        };
        const haji_info_haji_id = await conn.insertHajiInfo(insertedHajiInfo);

        const invoiceHajjPreInfo: IInvoiceHajiPreReg = {
          haji_info_haji_id,
          haji_info_invoice_id: invoice_id,
          haji_info_maharam: haji_info.haji_info_maharam,
          haji_info_possible_year: haji_info.haji_info_possible_year,
          haji_info_reg_year: haji_info.haji_info_reg_year,
          haji_info_vouchar_no: haji_info.haji_info_vouchar_no,
          haji_info_created_by: invoice_created_by,
        };
        await conn.insertHajiPreReg(invoiceHajjPreInfo);
      }

      // BILLING INFO AND INVOICE COST DETAILS
      for (const billingInfo of billing_information) {
        const {
          billing_comvendor,
          billing_cost_price,
          billing_quantity,
          billing_product_id,
          billing_profit,
          billing_unit_price,
          pax_name,
          billing_description,
        } = billingInfo;

        const total_cost_price = Number(billing_cost_price) * billing_quantity;

        // CHECK IS VENDOR OR COMBINED
        const { combined_id, vendor_id } =
          separateCombClientToId(billing_comvendor);

        const VTrxnBody: IVTrxn = {
          comb_vendor: billing_comvendor,
          vtrxn_amount: total_cost_price,
          vtrxn_created_at: invoice_sales_date,
          vtrxn_note: billing_description,
          vtrxn_particular_id: 150,
          vtrxn_particular_type: 'Invoice hajj pre reg Create',
          vtrxn_pax: pax_name,
          vtrxn_type: combined_id ? 'CREDIT' : 'DEBIT',
          vtrxn_user_id: invoice_created_by,
          vtrxn_voucher: invoice_no,
        };

        const billing_vtrxn_id = await trxns.VTrxnInsert(VTrxnBody);

        const billing_subtotal = billing_quantity * billing_unit_price;

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
      }

      // MOENY RECEIPT

      const moneyReceiptInvoice: ICommonMoneyReceiptInvoiceData = {
        invoice_client_id,
        invoice_combined_id,
        invoice_created_by,
        invoice_id,
      };
      await new CommonAddMoneyReceipt().commonAddMoneyReceipt(
        req,
        moneyReceiptInvoice,
        trx
      );

      // @Invoic History
      const history_data: InvoiceHistory = {
        history_activity_type: 'INVOICE_CREATED',
        history_created_by: invoice_created_by,
        history_invoice_id: invoice_id,
        history_invoice_payment_amount: invoice_net_total,
        invoicelog_content: 'Invoice hajj pre registration has been created',
      };
      await common_conn.insertInvoiceHistory(history_data);

      await this.updateVoucher(req, 'IHP');

      const smsInvoiceDate: smsInvoiceData = {
        invoice_client_id: invoice_client_id as number,
        invoice_combined_id: invoice_combined_id as number,
        invoice_sales_date,
        invoice_created_by,
        invoice_id,
      };

      await new CommonSmsSendServices().sendSms(req, smsInvoiceDate, trx);

      await this.insertAudit(
        req,
        'create',
        `Invoice hajj pre registration has been created, Voucher - ${invoice_no}, Net - ${invoice_net_total}/-`,
        invoice_created_by,
        'INVOICES'
      );
      return {
        success: true,
        message: 'Invoice hajj pre registration has been created',
        data: { invoice_id },
      };
    });
  };
}

export default AddInvoiceHajjpre;
