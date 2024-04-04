import { Request } from 'express';
import AbstractServices from '../../../../../abstracts/abstract.services';
import Trxns from '../../../../../common/helpers/Trxns';
import { separateCombClientToId } from '../../../../../common/helpers/common.helper';
import InvoiceHelpers, {
  InvoiceClientAndVendorValidate,
  MoneyReceiptAmountIsValid,
  getClientOrCombId,
  isNotEmpty,
} from '../../../../../common/helpers/invoice.helpers';
import { IVTrxn } from '../../../../../common/interfaces/Trxn.interfaces';
import CommonAddMoneyReceipt from '../../../../../common/services/CommonAddMoneyReceipt';
import {
  IInvoiceInfoDb,
  ITicketInfo,
  InvoiceExtraAmount,
} from '../../../../../common/types/Invoice.common.interface';
import {
  ICommonMoneyReceiptInvoiceData,
  InvoiceHistory,
} from '../../../../../common/types/common.types';
import { smsInvoiceData } from '../../../../smsSystem/types/sms.types';
import CommonSmsSendServices from '../../../../smsSystem/utils/CommonSmsSend.services';
import { InvoiceUtils } from '../../../utils/invoice.utils';
import {
  IOtherBillingInfoDb,
  IOtherInvoiceReq,
} from '../../types/invoiceOther.interface';

class AddInvoiceOther extends AbstractServices {
  constructor() {
    super();
  }

  public addInvoiceOtehr = async (req: Request) => {
    const {
      invoice_net_total,
      invoice_combclient_id,
      invoice_created_by,
      invoice_note,
      invoice_sales_date,
      invoice_due_date,
      invoice_sales_man_id,
      invoice_sub_total,
      invoice_vat,
      invoice_service_charge,
      invoice_discount,
      invoice_agent_id,
      invoice_agent_com_amount,
      money_receipt,
      billing_information,
      hotel_information,
      ticketInfo,
      transport_information,
      passport_information,
      invoice_reference,
    } = req.body as IOtherInvoiceReq;

    // VALIDATE CLIENT AND VENDOR
    const { invoice_total_profit, invoice_total_vendor_price, pax_name } =
      await InvoiceClientAndVendorValidate(
        billing_information,
        invoice_combclient_id
      );

    // VALIDATE MONEY RECEIPT AMOUNT
    MoneyReceiptAmountIsValid(money_receipt, invoice_net_total);

    // CLIENT AND COMBINED CLIENT
    const { invoice_client_id, invoice_combined_id } = getClientOrCombId(
      invoice_combclient_id
    );

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.invoiceOtherModel(req, trx);
      const common_conn = this.models.CommonInvoiceModel(req, trx);

      const trxns = new Trxns(req, trx);

      const productsIds = billing_information.map(
        (item) => item.billing_product_id
      );

      let productName = '';

      if (productsIds.length) {
        productName = await conn.getProductsName(productsIds);
      }

      const invoice_no = await this.generateVoucher(req, 'IO');

      const ctrxn_ticket =
        ticketInfo.length > 0 &&
        ticketInfo.map((item) => item.ticket_no).join(' ,');

      const ctrxn_pnr = ticketInfo.map((item) => item.ticket_pnr).join(', ');

      const utils = new InvoiceUtils(req.body, common_conn);
      // CLIENT TRANSACTIONS
      const clientTransId = await utils.clientTrans(
        trxns,
        invoice_no,
        ctrxn_pnr as string,
        ticketInfo[0]?.ticket_route as string,
        ctrxn_ticket as string,
        productName
      );

      const invoieInfo: IInvoiceInfoDb = {
        ...clientTransId,
        invoice_client_id,
        invoice_combined_id,
        invoice_created_by,
        invoice_net_total,
        invoice_no: invoice_no as string,
        invoice_note,
        invoice_category_id: 5,
        invoice_sales_date,
        invoice_due_date,
        invoice_sales_man_id,
        invoice_sub_total,
        invoice_total_profit,
        invoice_total_vendor_price,
        invoice_reference,
      };

      const invoice_id = await common_conn.insertInvoicesInfo(invoieInfo);

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
        98,
        'INVOICE OTHER'
      );

      const invoiceExtraAmount: InvoiceExtraAmount = {
        extra_amount_invoice_id: invoice_id,
        invoice_vat,
        invoice_service_charge,
        invoice_discount,
        invoice_agent_id,
        invoice_agent_com_amount,
      };

      await common_conn.insertInvoiceExtraAmount(invoiceExtraAmount);

      // PASSPORT INFORMATION
      if (passport_information && isNotEmpty(passport_information[0])) {
        for (const passInfo of passport_information) {
          const { passport_id } = passInfo;

          await conn.insertOtherInvoicePass({
            other_pass_passport_id: passport_id as number,
            other_pass_invoice_id: invoice_id,
          });
        }
      }

      // TICKET INFO
      if (ticketInfo && isNotEmpty(ticketInfo[0])) {
        const ticketsInfo: ITicketInfo[] = await Promise.all(
          ticketInfo?.map(async (item) => {
            return {
              ...item,
              ticket_invoice_id: invoice_id,
            };
          })
        );

        await conn.insertTicketInfo(ticketsInfo);
      }

      // HOTEL INFORMATION
      if (isNotEmpty(hotel_information) && hotel_information.length) {
        const hotelInfo = hotel_information?.map((item) => {
          return {
            ...item,
            hotel_check_in_date:
              item.hotel_check_in_date && item?.hotel_check_in_date,
            hotel_check_out_date:
              item.hotel_check_in_date && item?.hotel_check_out_date,
            hotel_invoice_id: invoice_id,
          };
        });

        await conn.insertHotelInfo(hotelInfo);
      }

      // TRANSPORT INFORMATION
      if (isNotEmpty(transport_information) && transport_information.length) {
        const transportsData = transport_information?.map((item) => {
          return { ...item, transport_other_invoice_id: invoice_id };
        });

        await conn.insertTransportInfo(transportsData);
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

        const billing_subtotal = billing_unit_price * billing_quantity;

        const billingInfoData: IOtherBillingInfoDb = {
          billing_invoice_id: invoice_id,
          billing_sales_date: invoice_sales_date,
          billing_remaining_quantity: billing_quantity,
          billing_quantity,
          billing_subtotal,
          billing_product_id,
          billing_profit,
          billing_unit_price,
          pax_name,
          billing_description,
        };

        if (billing_comvendor && billing_cost_price) {
          const total_cost_price = billing_cost_price * billing_quantity;
          const { combined_id, vendor_id } =
            separateCombClientToId(billing_comvendor);

          billingInfoData.billing_cost_price = billing_cost_price;
          billingInfoData.billing_combined_id = combined_id;
          billingInfoData.billing_vendor_id = vendor_id;

          const productName = await common_conn.getProductById(
            billingInfo.billing_product_id
          );

          let vtrxn_particular_type = `Invoice other (${productName}). \n`;

          // VENDOR TRANSACTIONS
          const VTrxnBody: IVTrxn = {
            comb_vendor: billing_comvendor,
            vtrxn_amount: total_cost_price,
            vtrxn_created_at: invoice_sales_date,
            vtrxn_note: billing_description,
            vtrxn_particular_id: 150,
            vtrxn_particular_type: vtrxn_particular_type,
            vtrxn_pax: pax_name,
            vtrxn_type: combined_id ? 'CREDIT' : 'DEBIT',
            vtrxn_user_id: invoice_created_by,
            vtrxn_voucher: invoice_no,
            vtrxn_pnr: ctrxn_pnr,
            vtrxn_airticket_no: ctrxn_ticket as string,
          };

          billingInfoData.billing_vtrxn_id = await trxns.VTrxnInsert(VTrxnBody);
        }

        await conn.insertBillingInfo(billingInfoData);
      }

      // MONEY RECEIPT
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
      const history_data: InvoiceHistory = {
        history_activity_type: 'INVOICE_CREATED',
        history_created_by: invoice_created_by,
        history_invoice_id: invoice_id,
        history_invoice_payment_amount: invoice_net_total,
        invoicelog_content: 'Invoice other has been created',
      };
      await common_conn.insertInvoiceHistory(history_data);

      await this.updateVoucher(req, 'IO');

      const smsInvoiceDate: smsInvoiceData = {
        invoice_client_id: invoice_client_id as number,
        invoice_combined_id: invoice_combined_id as number,
        invoice_sales_date,
        invoice_created_by,
        invoice_id,
      };

      await new CommonSmsSendServices().sendSms(req, smsInvoiceDate, trx);

      const message = `Invoice other has been created, Voucher - ${invoice_no}, Net - ${invoice_net_total}/-`;

      await this.insertAudit(
        req,
        'create',
        message,
        invoice_created_by,
        'INVOICES'
      );

      return {
        success: true,
        message,
        data: { invoice_id },
      };
    });
  };
}

export default AddInvoiceOther;
