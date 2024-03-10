import { Request } from 'express';
import AbstractServices from '../../../../../abstracts/abstract.services';
import Trxns from '../../../../../common/helpers/Trxns';
import InvoiceHelpers, {
  InvoiceClientAndVendorValidate,
  MoneyReceiptAmountIsValid,
  getClientOrCombId,
} from '../../../../../common/helpers/invoice.helpers';
import { IClTrxnBody } from '../../../../../common/interfaces/Trxn.interfaces';
import CommonAddMoneyReceipt from '../../../../../common/services/CommonAddMoneyReceipt';
import {
  IInvoiceInfoDb,
  InvoiceExtraAmount,
} from '../../../../../common/types/Invoice.common.interface';
import {
  ICommonMoneyReceiptInvoiceData,
  InvoiceHistory,
} from '../../../../../common/types/common.types';
import { smsInvoiceData } from '../../../../smsSystem/types/sms.types';
import CommonSmsSendServices from '../../../../smsSystem/utils/CommonSmsSend.services';
import { IInvoiceHajjReq } from '../../Type/InvoiceHajj.Interfaces';
import CommonHajjDetailsInsert from '../commonServices/CommonHajjDetailsInsert';

class AddInvoiceHajjServices extends AbstractServices {
  constructor() {
    super();
  }

  public addInvoiceHajjServices = async (req: Request) => {
    const {
      invoice_combclient_id,
      invoice_agent_id,
      invoice_net_total,
      invoice_sales_date,
      invoice_due_date,
      invoice_sales_man_id,
      invoice_sub_total,
      invoice_created_by,
      invoice_note,
      invoice_hajj_session,
      invoice_haji_group_id,
      invoice_service_charge,
      invoice_discount,
      invoice_agent_com_amount,
      invoice_client_previous_due,
      invoice_vat,
      hajj_total_pax,
      billing_information,
      invoice_hajj_routes,
      pilgrims_information,
      money_receipt,
      invoice_reference,
    } = req.body as IInvoiceHajjReq;

    // VALIDATE CLIENT AND VENDOR
    const { invoice_total_profit, invoice_total_vendor_price } =
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
      const common_conn = this.models.CommonInvoiceModel(req, trx);
      const trxns = new Trxns(req, trx);
      const invoice_no = await this.generateVoucher(req, 'IH');

      // CLIENT COMBINED TRANSACTIONS

      const ctrxn_pax =
        billing_information[0] &&
        billing_information.map((item) => item.pax_name).join(' ,');

      const ctrxn_pnr =
        pilgrims_information[0] &&
        pilgrims_information.map((item) => item.ticket_pnr).join(', ');

      const ctrnx_ticket_no =
        pilgrims_information[0] &&
        pilgrims_information.map((item) => item.ticket_no).join(', ');

      const routes =
        pilgrims_information &&
        pilgrims_information.map((item) => item.ticket_route as number[]);
      const flattenedRoutes = ([] as number[]).concat(...routes);

      let ctrxn_route;
      if (flattenedRoutes.length > 0) {
        ctrxn_route = await common_conn.getRoutesInfo(flattenedRoutes);
      }

      const clTrxnBody: IClTrxnBody = {
        ctrxn_type: 'DEBIT',
        ctrxn_amount: invoice_net_total,
        ctrxn_cl: invoice_combclient_id,
        ctrxn_voucher: invoice_no,
        ctrxn_particular_id: 104,
        ctrxn_created_at: invoice_sales_date,
        ctrxn_note: invoice_note,
        ctrxn_particular_type: 'Invoice hajj create',
        ctrxn_pax,
        ctrxn_pnr,
        ctrxn_airticket_no: ctrnx_ticket_no,
        ctrxn_route,
        ctrxn_user_id: invoice_created_by,
      };

      const invoice_cltrxn_id = await trxns.clTrxnInsert(clTrxnBody);

      const invoice_information: IInvoiceInfoDb = {
        invoice_client_id,
        invoice_no: invoice_no as string,
        invoice_sub_total,
        invoice_category_id: 31,
        invoice_sales_man_id,
        invoice_net_total,
        invoice_client_previous_due,
        invoice_haji_group_id,
        invoice_sales_date,
        invoice_due_date,
        invoice_created_by,
        invoice_hajj_session: new Date(invoice_hajj_session).getFullYear(),
        invoice_note,
        invoice_combined_id,
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
        104,
        'INVOICE HAJJ'
      );

      const invoiceExtraAmount: InvoiceExtraAmount = {
        extra_amount_invoice_id: invoice_id,
        invoice_vat,
        invoice_service_charge,
        invoice_discount,
        invoice_agent_id,
        invoice_agent_com_amount,
        hajj_total_pax,
      };
      await common_conn.insertInvoiceExtraAmount(invoiceExtraAmount);

      // airticket routes insert
      if (invoice_hajj_routes?.length) {
        const airticketRoutes = invoice_hajj_routes.map(
          (airoute_route_sector_id) => {
            return {
              airoute_invoice_id: invoice_id,
              airoute_route_sector_id,
            };
          }
        );

        await common_conn.insertAirticketRoute(airticketRoutes);
      }

      await new CommonHajjDetailsInsert().CommonHajjDetailsInsert(
        req,
        invoice_id,
        trx
      );

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
        invoicelog_content: 'Invoice hajji has been created',
      };
      await common_conn.insertInvoiceHistory(history_data);

      await this.updateVoucher(req, 'IH');

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
        `Invoice hajj has been created, Voucher - ${invoice_no}, Net - ${invoice_net_total}/-`,
        invoice_created_by,
        'INVOICES'
      );
      return {
        success: true,
        message: 'Invoice hajj has been created',
        data: { invoice_id },
      };
    });
  };
}

export default AddInvoiceHajjServices;
