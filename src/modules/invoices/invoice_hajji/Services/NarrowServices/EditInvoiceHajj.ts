import { Request } from 'express';

import AbstractServices from '../../../../../abstracts/abstract.services';
import Trxns from '../../../../../common/helpers/Trxns';
import InvoiceHelpers, {
  InvoiceClientAndVendorValidate,
  getClientOrCombId,
} from '../../../../../common/helpers/invoice.helpers';
import {
  IUpdateInvoiceInfoDb,
  InvoiceExtraAmount,
} from '../../../../../common/types/Invoice.common.interface';
import { InvoiceHistory } from '../../../../../common/types/common.types';
import { InvoiceUtils } from '../../../utils/invoice.utils';
import { IInvoiceHajjReq } from '../../Type/InvoiceHajj.Interfaces';
import CommonHajjDetailsInsert from '../commonServices/CommonHajjDetailsInsert';

class EditInvoiceHajj extends AbstractServices {
  constructor() {
    super();
  }

  public editInvoiceHajj = async (req: Request) => {
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
      invoice_hajj_routes,
      billing_information,
      pilgrims_information,
      invoice_no,
      invoice_reference,
    } = req.body as IInvoiceHajjReq;

    // VALIDATE CLIENT AND VENDOR
    const { invoice_total_profit, invoice_total_vendor_price } =
      await InvoiceClientAndVendorValidate(
        billing_information,
        invoice_combclient_id
      );

    // CLIENT AND COMBINED CLIENT
    const { invoice_client_id, invoice_combined_id } = await getClientOrCombId(
      invoice_combclient_id
    );

    const invoice_id = Number(req.params.id);

    return await this.models.db.transaction(async (trx) => {
      const common_conn = this.models.CommonInvoiceModel(req, trx);
      const trxns = new Trxns(req, trx);

      const { prevCtrxnId, prevClChargeTransId } =
        await common_conn.getPreviousInvoices(invoice_id);

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
        tr_type: 11,
        dis_tr_type: 12,
        invoice_no,
        ticket_no: ctrnx_ticket_no,
        ctrxn_pnr,
        ctrxn_route,
        note,
      });

      const invoice_information: IUpdateInvoiceInfoDb = {
        ...clientTransId,
        invoice_client_id,
        invoice_sub_total,
        invoice_sales_man_id,
        invoice_net_total,
        invoice_client_previous_due,
        invoice_haji_group_id,
        invoice_sales_date,
        invoice_due_date,
        invoice_updated_by: invoice_created_by,
        invoice_hajj_session: new Date(invoice_hajj_session).getFullYear(),
        invoice_note,
        invoice_combined_id,
        invoice_reference,
        invoice_total_profit,
        invoice_total_vendor_price,
      };
      await common_conn.updateInvoiceInformation(
        invoice_id,
        invoice_information
      );

      // AGENT TRANSACTIONS
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
          105,
          'INVOICE HAJJ'
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

      // air ticket routes insert
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

      // common_invoice_billing
      await new CommonHajjDetailsInsert().CommonHajjDetailsInsert(
        req,
        invoice_id,
        trx
      );

      // @Invoice History
      const history_data: InvoiceHistory = {
        history_activity_type: 'INVOICE_UPDATED',
        history_created_by: invoice_created_by,
        history_invoice_id: invoice_id,
        history_invoice_payment_amount: invoice_net_total,
        invoicelog_content: 'Invoice hajji has been updated',
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
        data: 'Invoice updated successfully...',
      };
    });
  };
}

export default EditInvoiceHajj;
