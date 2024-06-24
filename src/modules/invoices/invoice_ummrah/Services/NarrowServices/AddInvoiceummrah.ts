import { Request } from 'express';
import AbstractServices from '../../../../../abstracts/abstract.services';
import { separateCombClientToId } from '../../../../../common/helpers/common.helper';
import InvoiceHelpers, {
  getClientOrCombId,
  InvoiceClientAndVendorValidate,
  isNotEmpty,
  MoneyReceiptAmountIsValid,
} from '../../../../../common/helpers/invoice.helpers';
import Trxns from '../../../../../common/helpers/Trxns';
import { IVTrxn } from '../../../../../common/interfaces/Trxn.interfaces';
import CommonAddMoneyReceipt from '../../../../../common/services/CommonAddMoneyReceipt';
import {
  ICommonMoneyReceiptInvoiceData,
  InvoiceHistory,
} from '../../../../../common/types/common.types';
import {
  IHotelInfoDB,
  IInvoiceInfoDb,
  InvoiceExtraAmount,
} from '../../../../../common/types/Invoice.common.interface';
import { smsInvoiceData } from '../../../../smsSystem/types/sms.types';
import CommonSmsSendServices from '../../../../smsSystem/utils/CommonSmsSend.services';
import { IOtherBillingInfoDb } from '../../../invoice_other/types/invoiceOther.interface';
import { InvoiceUtils } from '../../../utils/invoice.utils';
import {
  IInvoiceUmmrahReq,
  IUmmrahPassenger,
} from '../../Type/invoiceUmmrah.Interfaces';

class AddInvoiceUmmrah extends AbstractServices {
  constructor() {
    super();
  }
  public postInvoiceUmmrah = async (req: Request) => {
    const {
      billing_information,
      invoice_combclient_id,
      invoice_net_total,
      invoice_sales_date,
      invoice_due_date,
      invoice_sales_man_id,
      invoice_sub_total,
      invoice_created_by,
      invoice_note,
      invoice_discount,
      invoice_haji_group_id,
      hotel_information,
      passenget_info,
      invoice_service_charge,
      invoice_client_previous_due,
      invoice_vat,
      invoice_agent_com_amount,
      invoice_agent_id,
      money_receipt,
      invoice_reference,
    } = req.body as IInvoiceUmmrahReq;

    // VALIDATE CLIENT AND VENDOR
    const { invoice_total_profit, invoice_total_vendor_price } =
      await InvoiceClientAndVendorValidate(
        billing_information,
        invoice_combclient_id
      );

    // VALIDATE MONEY RECEIPT AMOUNT
    MoneyReceiptAmountIsValid(money_receipt, invoice_net_total);

    // CLIENT AND COMBINED CLIENT
    const { invoice_client_id, invoice_combined_id } = await getClientOrCombId(
      invoice_combclient_id
    );

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.InvoiceUmmarhModels(req, trx);
      const common_conn = this.models.CommonInvoiceModel(req, trx);
      const trxns = new Trxns(req, trx);

      const invoice_no = await this.generateVoucher(req, 'IU');

      const ctrxn_pnr =
        passenget_info[0] &&
        passenget_info.map((item) => item.ticket_pnr).join(', ');

      const tickets_no = passenget_info
        .map((item) => item.ticket_no)
        .join(', ');

      const routes =
        passenget_info &&
        passenget_info.map((item) => item.ticket_route as number[]);
      const flattenedRoutes = ([] as number[]).concat(...routes);

      let ctrxn_route;
      if (flattenedRoutes.length > 0) {
        ctrxn_route = await common_conn.getRoutesInfo(flattenedRoutes);
      }

      const productsIds = billing_information.map(
        (item) => item.billing_product_id
      );

      let note = '';

      if (productsIds.length) {
        note = await common_conn.getProductsName(productsIds);
      }

      // CLIENT TRANSACTIONS
      const utils = new InvoiceUtils(req.body, common_conn);
      const clientTransId = await utils.clientTrans(trxns, {
        invoice_no,
        ctrxn_pnr,
        ctrxn_route,
        tr_type: 15,
        dis_tr_type: 16,
        note,
        ticket_no: tickets_no,
      });

      const invoice_information: IInvoiceInfoDb = {
        ...clientTransId,
        invoice_client_id,
        invoice_combined_id,
        invoice_no: invoice_no as string,
        invoice_sub_total,
        invoice_category_id: 26,
        invoice_sales_man_id,
        invoice_net_total,
        invoice_client_previous_due,
        invoice_haji_group_id,
        invoice_sales_date,
        invoice_due_date,
        invoice_created_by,
        invoice_note,
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
        106,
        'INVOICE UMMRAH'
      );

      const invoice_extra_ammount: InvoiceExtraAmount = {
        extra_amount_invoice_id: invoice_id,
        invoice_discount,
        invoice_vat,
        invoice_agent_com_amount,
        invoice_agent_id,
        invoice_service_charge,
      };
      await common_conn.insertInvoiceExtraAmount(invoice_extra_ammount);

      if (
        isNotEmpty(passenget_info) &&
        passenget_info?.length &&
        isNotEmpty(passenget_info[0])
      ) {
        for (const item of passenget_info) {
          const ummrahPassengerData: IUmmrahPassenger = {
            passenger_invoice_id: invoice_id,
            passenger_passport_id: item.passenger_passport_id,
            passenger_tracking_number: item.passenger_tracking_number,
            ticket_pnr: item.ticket_pnr,
            ticket_airline_id: item.ticket_airline_id,
            ticket_no: item.ticket_no,
            ticket_reference_no: item.ticket_reference_no,
            ticket_journey_date: item.ticket_journey_date,
            ticket_return_date: item.ticket_return_date,
          };

          const passenger_id = await conn.insertUmmrahPassengerInfo(
            ummrahPassengerData
          );

          const ummrahPassengerRoutes = item?.ticket_route?.map((item) => {
            return { iu_passenger_id: passenger_id, iu_airport_id: item };
          });

          if (ummrahPassengerRoutes) {
            await conn.insertUmmrahPassengerRoutes(ummrahPassengerRoutes);
          }
        }
      }

      if (isNotEmpty(hotel_information)) {
        const IUHotelInfos: IHotelInfoDB[] = hotel_information?.map((item) => {
          return {
            ...item,
            hotel_invoice_id: invoice_id,
          };
        });

        await conn.insertIUHotelInfos(IUHotelInfos);
      }

      for (const item of billing_information) {
        const {
          billing_comvendor,
          billing_cost_price,
          billing_quantity,
          billing_product_id,
          billing_profit,
          billing_unit_price,
          pax_name,
          billing_description,
        } = item;

        const billing_subtotal = billing_quantity * billing_unit_price;

        const billingInfoData: IOtherBillingInfoDb = {
          billing_invoice_id: invoice_id,
          billing_sales_date: invoice_sales_date,
          billing_remaining_quantity: billing_quantity,
          billing_cost_price,
          billing_quantity,
          billing_subtotal,
          billing_product_id,
          billing_profit,
          billing_unit_price,
          pax_name,
          billing_description,
        };

        if (billing_cost_price && billing_comvendor) {
          const billing_total_cost = billing_cost_price * billing_quantity;
          const { combined_id, vendor_id } =
            separateCombClientToId(billing_comvendor);

          billingInfoData.billing_combined_id = combined_id;
          billingInfoData.billing_vendor_id = vendor_id;

          const VTrxnBody: IVTrxn = {
            comb_vendor: billing_comvendor,
            vtrxn_amount: billing_total_cost,
            vtrxn_created_at: invoice_sales_date,
            vtrxn_note: billing_description,
            vtrxn_particular_id: 15,
            vtrxn_pax: pax_name,
            vtrxn_type: combined_id ? 'CREDIT' : 'DEBIT',
            vtrxn_user_id: invoice_created_by,
            vtrxn_voucher: invoice_no,
            vtrxn_airticket_no: tickets_no,
            vtrxn_pnr: ctrxn_pnr,
            vtrxn_route: ctrxn_route,
          };
          billingInfoData.billing_vtrxn_id = await trxns.VTrxnInsert(VTrxnBody);
        }

        await conn.insertIUBillingInfos(billingInfoData);
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

      // @Invoic History
      const history_data: InvoiceHistory = {
        history_activity_type: 'INVOICE_CREATED',
        history_created_by: invoice_created_by,
        history_invoice_id: invoice_id,
        history_invoice_payment_amount: invoice_net_total,
        invoicelog_content: 'Invoice ummrah has been created',
      };
      await common_conn.insertInvoiceHistory(history_data);

      await this.updateVoucher(req, 'IU');

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
        `Invoice ummrah has been created, Voucher - ${invoice_no}, Net - ${invoice_net_total}/-`,
        invoice_created_by,
        'INVOICES'
      );
      return {
        success: true,
        message: 'Invoice ummrah has been created',
        data: { invoice_id },
      };
    });
  };
}

export default AddInvoiceUmmrah;
