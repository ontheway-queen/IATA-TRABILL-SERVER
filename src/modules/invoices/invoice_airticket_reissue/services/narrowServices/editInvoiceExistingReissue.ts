import { Request } from 'express';
import AbstractServices from '../../../../../abstracts/abstract.services';
import Trxns from '../../../../../common/helpers/Trxns';
import { separateCombClientToId } from '../../../../../common/helpers/common.helper';
import {
  IClTrxnUpdate,
  IVTrxn,
} from '../../../../../common/interfaces/Trxn.interfaces';
import { IUpdateInvoiceInfoDb } from '../../../../../common/types/Invoice.common.interface';
import { InvoiceHistory } from '../../../../../common/types/common.types';
import {
  IExistingReissueReq,
  IReissueTicketDetailsDb,
} from '../../types/invoiceReissue.interface';

class EditExistingCl extends AbstractServices {
  constructor() {
    super();
  }

  public editExistingCl = async (req: Request) => {
    const {
      invoice_combclient_id,
      invoice_sales_man_id,
      invoice_sales_date,
      invoice_due_date,
      airticket_ticket_no,
      airticket_penalties,
      airticket_fare_difference,
      airticket_commission_percent,
      airticket_ait,
      airticket_issue_date,
      airticket_classes,
      airticket_existing_airticket_id,
      airticket_client_price,
      airticket_purchase_price,
      airticket_profit,
      airticket_journey_date,
      airticket_return_date,
      invoice_note,
      invoice_no,
      comb_vendor,
      airticket_existing_invoiceid,
      airticket_tax,
      airticket_extra_fee,
    } = req.body as IExistingReissueReq;

    const invoice_id = Number(req.params.invoice_id);

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.reissueAirticket(req, trx);
      const common_conn = this.models.CommonInvoiceModel(req, trx);
      const trxns = new Trxns(req, trx);

      // TOOLS
      const prevInvCateId = await conn.getExistingInvCateId(
        airticket_existing_invoiceid
      );

      const previousData = await conn.getPreviousAirTicketData(
        prevInvCateId,
        airticket_existing_airticket_id
      );

      const { prevCtrxnId } = await common_conn.getPreviousInvoices(invoice_id);

      const clTrxnBody: IClTrxnUpdate = {
        ctrxn_particular_id: 91,
        ctrxn_note: invoice_note,
        ctrxn_trxn_id: prevCtrxnId,
        ctrxn_airticket_no: airticket_ticket_no,
        ctrxn_type: 'DEBIT',
        ctrxn_amount: airticket_client_price,
        ctrxn_cl: invoice_combclient_id,
        ctrxn_voucher: invoice_no,
        ctrxn_created_at: invoice_sales_date,
        ctrxn_particular_type: 'Reissue Air Ticket',
      };

      await trxns.clTrxnUpdate(clTrxnBody);

      const { client_id, combined_id } = separateCombClientToId(
        invoice_combclient_id
      );
      const invoice_information: IUpdateInvoiceInfoDb = {
        invoice_updated_by: req.user_id,
        invoice_combined_id: combined_id,
        invoice_client_id: client_id,
        invoice_net_total: airticket_client_price,
        invoice_sales_date,
        invoice_due_date,
        invoice_sales_man_id,
        invoice_sub_total: airticket_client_price,
        invoice_note,
        invoice_total_profit: airticket_profit,
        invoice_total_vendor_price: airticket_purchase_price,
      };

      common_conn.updateInvoiceInformation(invoice_id, invoice_information);

      const previousVendorBilling = await conn.getReissuePrevVendors(
        invoice_id
      );

      await trxns.deleteInvVTrxn(previousVendorBilling);

      // VENDOR TRANSACTIONS

      const VTrxnBody: IVTrxn = {
        vtrxn_user_id: req.user_id,
        vtrxn_voucher: invoice_no,
        vtrxn_airticket_no: airticket_ticket_no,
        comb_vendor: comb_vendor,
        vtrxn_amount: airticket_purchase_price,
        vtrxn_created_at: invoice_sales_date,
        vtrxn_note: invoice_note,
        vtrxn_particular_id: 148,
        vtrxn_particular_type: 'Reissue Existing Air Ticket',
        vtrxn_type: 'DEBIT',
      };

      await trxns.VTrxnInsert(VTrxnBody);

      const {
        combined_id: airticket_vendor_combine_id,
        vendor_id: airticket_vendor_id,
      } = separateCombClientToId(comb_vendor);

      const reissueAirTicketItem: IReissueTicketDetailsDb = {
        airticket_tax,
        airticket_client_id: client_id,
        airticket_combined_id: combined_id,
        airticket_vendor_id,
        airticket_vendor_combine_id,
        airticket_invoice_id: invoice_id,
        airticket_sales_date: invoice_sales_date,
        airticket_profit,
        airticket_journey_date,
        airticket_return_date,
        airticket_purchase_price,
        airticket_client_price,
        airticket_ticket_no,
        airticket_existing_invoiceid,
        airticket_penalties,
        airticket_fare_difference,
        airticket_commission_percent,
        airticket_ait,
        airticket_issue_date,
        airticket_classes,
        airticket_existing_airticket_id,
        airticket_extra_fee,

        airticket_after_reissue_client_price:
          Number(airticket_client_price || 0) + previousData.cl_price,
        airticket_after_reissue_purchase_price:
          Number(airticket_purchase_price || 0) + previousData.purchase,
        airticket_after_reissue_taxes:
          Number(airticket_tax || 0) + previousData.taxes,
        airticket_after_reissue_profit:
          Number(airticket_profit || 0) + previousData.airticket_profit,
      };
      await conn.updateInvoiceReissueAirticket(
        invoice_id,
        reissueAirTicketItem
      );

      // UPDATE IS REISSUED
      await conn.updateInvoiceIsReissued(airticket_existing_invoiceid, 1);
      await conn.updateAirTicketIsReissued(
        prevInvCateId,
        airticket_existing_airticket_id,
        1
      );

      // NEW HISTORY
      const new_history_data: InvoiceHistory = {
        history_activity_type: 'INVOICE_UPDATED',
        history_created_by: req.user_id,
        history_invoice_id: invoice_id,
        invoicelog_content: 'Existing Air Ticket Reissued Updated!',
        history_invoice_payment_amount: airticket_client_price,
      };

      await common_conn.insertInvoiceHistory(new_history_data);

      // EXISTING HISTORY
      const existing_history_data: InvoiceHistory = {
        history_invoice_payment_amount: airticket_client_price,
        history_activity_type: 'INVOICE_UPDATED',
        history_created_by: req.user_id,
        history_invoice_id: airticket_existing_invoiceid,
        invoicelog_content: 'Reissue Updated!',
      };

      await common_conn.insertInvoiceHistory(existing_history_data);

      const content = `Existing client invoice reissue has been updated, Voucher - ${invoice_no}, Net - ${airticket_client_price}/-`;

      await this.insertAudit(req, 'update', content, req.user_id, 'INVOICES');

      return {
        success: true,
        data: 'Invoice existing client updated successfully...',
      };
    });
  };
}

export default EditExistingCl;
