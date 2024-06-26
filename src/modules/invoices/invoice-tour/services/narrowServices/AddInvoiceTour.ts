import { Request } from 'express';
import AbstractServices from '../../../../../abstracts/abstract.services';
import InvoiceHelpers, {
  getClientOrCombId,
  MoneyReceiptAmountIsValid,
} from '../../../../../common/helpers/invoice.helpers';
import Trxns from '../../../../../common/helpers/Trxns';
import CommonAddMoneyReceipt from '../../../../../common/services/CommonAddMoneyReceipt';
import {
  ICommonMoneyReceiptInvoiceData,
  InvoiceHistory,
} from '../../../../../common/types/common.types';
import {
  IInvoiceInfoDb,
  InvoiceExtraAmount,
} from '../../../../../common/types/Invoice.common.interface';
import { smsInvoiceData } from '../../../../smsSystem/types/sms.types';
import CommonSmsSendServices from '../../../../smsSystem/utils/CommonSmsSend.services';
import { InvoiceUtils } from '../../../utils/invoice.utils';
import {
  IInvoiceTourItem,
  ITourRequest,
} from '../../types/invouceTour.interfaces';
import InvoiceTourHelpers from '../../utils/invoicetour.helpers';

class AddInvoiceTour extends AbstractServices {
  constructor() {
    super();
  }

  public addInvoiceTour = async (req: Request) => {
    const {
      invoice_net_total,
      invoice_sub_total,
      invoice_combclient_id,
      itour_day,
      itour_from_date,
      itour_to_date,
      itour_group_id,
      itour_night,
      invoice_sales_date,
      invoice_due_date,
      invoice_sales_man_id,
      invoice_vat,
      invoice_discount,
      invoice_agent_com_amount,
      invoice_agent_id,
      invoice_service_charge,
      invoice_created_by,
      invoice_note,
      tourBilling,
      invoice_reference,
      ticket_no,
      ticket_pnr,
      ticket_route,
      money_receipt,
    } = req.body as ITourRequest;

    MoneyReceiptAmountIsValid(money_receipt, invoice_net_total);

    const { invoice_client_id, invoice_combined_id } = await getClientOrCombId(
      invoice_combclient_id
    );

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.invoiceTourModels(req, trx);
      const common_conn = this.models.CommonInvoiceModel(req, trx);
      const trxns = new Trxns(req, trx);

      const invoice_no = await this.generateVoucher(req, 'ITP');

      const invoice_client_previous_due = await this.models
        .MoneyReceiptModels(req)
        .invoiceDueByClient(invoice_client_id, invoice_combined_id);

      let ctrxn_route;

      if (ticket_route) {
        ctrxn_route = await common_conn.getRoutesInfo(ticket_route);
      }

      const productsIds = tourBilling.map((item) => item.billing_product_id);

      let note = '';

      if (productsIds.length) {
        note = await common_conn.getProductsName(productsIds);
      }

      // CLIENT TRANSACTIONS
      const utils = new InvoiceUtils(req.body, common_conn);
      const clientTransId = await utils.clientTrans(trxns, {
        invoice_no,
        ctrxn_pnr: ticket_pnr,
        ctrxn_route,
        tr_type: 17,
        dis_tr_type: 18,
        ticket_no,
        note,
      });

      const { totalProfit, totalCost } = tourBilling.reduce(
        (acc, billing) => {
          const { totalCost, totalSales, totalProfit } = acc;
          return {
            totalCost: totalCost + billing.billing_cost_price,
            totalSales: totalSales + billing.billing_total_sales,
            totalProfit: totalProfit + (billing.billing_profit ?? 0),
          };
        },
        { totalCost: 0, totalSales: 0, totalProfit: 0 }
      );

      const invoiceData: IInvoiceInfoDb = {
        ...clientTransId,
        invoice_client_id,
        invoice_combined_id,
        invoice_sales_man_id,
        invoice_sales_date,
        invoice_due_date,
        invoice_no: invoice_no as string,
        invoice_total_profit: totalProfit,
        invoice_created_by,
        invoice_client_previous_due,
        invoice_category_id: 4,
        invoice_net_total,
        invoice_sub_total,
        invoice_note,
        invoice_reference,
        invoice_total_vendor_price: totalCost,
      };

      const invoice_id = await common_conn.insertInvoicesInfo(invoiceData);

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
        100,
        'TOUR PACKAGE'
      );

      // TOUR VENDOR COST BILLING INSERT
      await InvoiceTourHelpers.addVendorCostBilling(req, conn, invoice_id, trx);

      const invoiceExtraAmount: InvoiceExtraAmount = {
        extra_amount_invoice_id: invoice_id,
        invoice_vat,
        invoice_service_charge,
        invoice_discount,
        invoice_agent_id,
        invoice_agent_com_amount,
      };
      await common_conn.insertInvoiceExtraAmount(invoiceExtraAmount);

      const invoiceTourItemData: IInvoiceTourItem = {
        itour_day,
        itour_from_date,
        itour_to_date,
        itour_group_id,
        itour_night,
        itour_invoice_id: invoice_id,
      };

      await conn.insertInvoiceTourItem(invoiceTourItemData);

      // @HISTORY
      const history_data: InvoiceHistory = {
        history_activity_type: 'INVOICE_CREATED',
        history_invoice_id: invoice_id,
        history_created_by: invoice_created_by,
        invoicelog_content: `Invoice tour has been created`,
      };

      await common_conn.insertInvoiceHistory(history_data);

      await this.updateVoucher(req, 'ITP');

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
        `Invoice tour has been created, Voucher - ${invoice_no}, Net - ${invoice_net_total}/-`,
        invoice_created_by,
        'INVOICES'
      );

      return {
        success: true,
        message: 'Invoice tour package has been created',
        data: { invoice_id },
      };
    });
  };
}

export default AddInvoiceTour;
