import { Request } from 'express';
import AbstractServices from '../../../../../abstracts/abstract.services';
import InvoiceHelpers, {
  getClientOrCombId,
} from '../../../../../common/helpers/invoice.helpers';
import Trxns from '../../../../../common/helpers/Trxns';
import { InvoiceHistory } from '../../../../../common/types/common.types';
import {
  InvoiceExtraAmount,
  IUpdateInvoiceInfoDb,
} from '../../../../../common/types/Invoice.common.interface';
import { InvoiceUtils } from '../../../utils/invoice.utils';
import {
  IInvoiceTourItem,
  ITourRequest,
} from '../../types/invouceTour.interfaces';
import InvoiceTourHelpers from '../../utils/invoicetour.helpers';

class EditInvoiceTour extends AbstractServices {
  constructor() {
    super();
  }

  public editInvoiceTour = async (req: Request) => {
    const {
      invoice_net_total,
      invoice_reference,
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
      invoice_client_previous_due,
      invoice_vat,
      invoice_discount,
      invoice_agent_com_amount,
      invoice_agent_id,
      invoice_service_charge,
      invoice_created_by,
      invoice_note,
      tourBilling,
      invoice_no,
      ticket_route,
      ticket_pnr,
      ticket_no,
    } = req.body as ITourRequest;

    // CLIENT AND COMBINED CLIENT
    const { invoice_client_id, invoice_combined_id } = await getClientOrCombId(
      invoice_combclient_id
    );

    const invoice_id = Number(req.params.invoice_id);

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.invoiceTourModels(req, trx);
      const common_conn = this.models.CommonInvoiceModel(req, trx);
      const trxns = new Trxns(req, trx);

      const { prevCtrxnId, prevClChargeTransId } =
        await common_conn.getPreviousInvoices(invoice_id);

      const ctrxn_pax = tourBilling
        .map((item) => item.billing_pax_name)
        .join(' ,');

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
      const clientTransId = await utils.updateClientTrans(trxns, {
        prevClChargeTransId,
        prevCtrxnId,
        invoice_no,
        ctrxn_pnr: ticket_pnr,
        ctrxn_route,
        tr_type: 17,
        dis_tr_type: 18,
        ticket_no,
        note,
      });

      if (invoice_agent_id) {
        // AGENT TRANSACTION
        await InvoiceHelpers.invoiceAgentTransactions(
          this.models.agentProfileModel(req, trx),
          req.agency_id,
          invoice_agent_id,
          invoice_id,
          invoice_no,
          invoice_created_by,
          invoice_agent_com_amount,
          'UPDATE',
          101,
          'TOUR PACKAGE'
        );
      } else {
        await InvoiceHelpers.deleteAgentTransactions(
          this.models.agentProfileModel(req, trx),
          invoice_id,
          invoice_created_by
        );
      }

      // TOUR VENDOR COST BILLING INSERT
      await InvoiceTourHelpers.addVendorCostBilling(req, conn, invoice_id, trx);

      const { totalCost, totalSales, totalProfit } = tourBilling.reduce(
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

      // UPDATE TOUR INVOICES
      const invoiceData: IUpdateInvoiceInfoDb = {
        ...clientTransId,
        invoice_client_id,
        invoice_sales_man_id,
        invoice_sales_date,
        invoice_due_date,
        invoice_updated_by: invoice_created_by,
        invoice_net_total,
        invoice_sub_total,
        invoice_note,
        invoice_combined_id,
        invoice_total_profit: totalProfit,
        invoice_total_vendor_price: totalCost,
        invoice_client_previous_due,
        invoice_reference,
      };
      await common_conn.updateInvoiceInformation(invoice_id, invoiceData);

      const invoiceExtraAmount: InvoiceExtraAmount = {
        extra_amount_invoice_id: invoice_id,
        invoice_vat,
        invoice_service_charge,
        invoice_discount,
        invoice_agent_id,
        invoice_agent_com_amount,
      };
      await common_conn.updateInvoiceExtraAmount(
        invoiceExtraAmount,
        invoice_id
      );

      const invoiceTourItemData: IInvoiceTourItem = {
        itour_day,
        itour_from_date,
        itour_to_date,
        itour_group_id,
        itour_night,
        itour_invoice_id: invoice_id,
      };

      await conn.updateInvoiceTourItem(invoiceTourItemData, invoice_id);

      // @HISTORY
      const history_data: InvoiceHistory = {
        history_activity_type: 'INVOICE_UPDATED',
        history_invoice_id: invoice_id,
        history_created_by: invoice_created_by,
        invoicelog_content: `Invoice tour package has been updated`,
      };

      await common_conn.insertInvoiceHistory(history_data);

      await this.insertAudit(
        req,
        'update',
        `Invoice tour has been updated, Voucher - ${invoice_no}, Net - ${invoice_net_total}/-`,
        invoice_created_by,
        'INVOICES'
      );
      return {
        success: true,
        message: 'Invoice tour package has been updated',
      };
    });
  };
}

export default EditInvoiceTour;
