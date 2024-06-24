import { Request } from 'express';
import AbstractServices from '../../../../../abstracts/abstract.services';
import Trxns from '../../../../../common/helpers/Trxns';
import { separateCombClientToId } from '../../../../../common/helpers/common.helper';
import { addAdvanceMr } from '../../../../../common/helpers/invoice.helpers';
import {
  IClTrxnBody,
  IVTrxn,
} from '../../../../../common/interfaces/Trxn.interfaces';
import { IInvoiceInfoDb } from '../../../../../common/types/Invoice.common.interface';
import { InvoiceHistory } from '../../../../../common/types/common.types';
import {
  IExistingReissueReq,
  IReissueTicketDetailsDb,
} from '../../types/invoiceReissue.interface';

class AddExistingClient extends AbstractServices {
  constructor() {
    super();
  }

  public addExistingClient = async (req: Request) => {
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
      airticket_client_price,
      airticket_purchase_price,
      airticket_profit,
      airticket_journey_date,
      airticket_return_date,
      invoice_note,
      airticket_existing_airticket_id,
      comb_vendor,
      airticket_existing_invoiceid,
      airticket_tax,
      airticket_extra_fee,
    } = req.body as IExistingReissueReq;

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.reissueAirticket(req, trx);
      const trxns = new Trxns(req, trx);
      const common_conn = this.models.CommonInvoiceModel(req, trx);
      const combined_conn = this.models.combineClientModel(req, trx);
      const invoice_no = await this.generateVoucher(req, 'ARI');

      const { client_id, combined_id } = separateCombClientToId(
        invoice_combclient_id
      );

      const invoice_client_previous_due =
        await combined_conn.getClientLastBalanceById(
          client_id as number,
          combined_id as number
        );

      // TOOLS
      const prevInvCateId = await conn.getExistingInvCateId(
        airticket_existing_invoiceid
      );

      const previousData = await conn.getPreviousAirTicketData(
        prevInvCateId,
        airticket_existing_airticket_id
      );

      // CLIENT COMBINED TRANSACTIONS
      const clTrxnBody: IClTrxnBody = {
        ctrxn_type: 'DEBIT',
        ctrxn_amount: airticket_client_price,
        ctrxn_cl: invoice_combclient_id,
        ctrxn_voucher: invoice_no,
        ctrxn_particular_id: 5,
        ctrxn_created_at: invoice_sales_date,
        ctrxn_note: invoice_note as string,
        ctrxn_airticket_no: airticket_ticket_no,
      };

      const invoice_cltrxn_id = await trxns.clTrxnInsert(clTrxnBody);

      const invoice_information: IInvoiceInfoDb = {
        invoice_combined_id: combined_id,
        invoice_client_id: client_id,
        invoice_created_by: req.user_id,
        invoice_net_total: airticket_client_price,
        invoice_sales_date,
        invoice_due_date,
        invoice_sales_man_id,
        invoice_sub_total: airticket_client_price,
        invoice_note,
        invoice_category_id: 3,
        invoice_no,
        invoice_reissue_client_type: 'EXISTING',
        invoice_cltrxn_id,
        invoice_total_profit: airticket_profit,
        invoice_total_vendor_price: airticket_purchase_price,
        invoice_client_previous_due,
      };

      const invoice_id = await common_conn.insertInvoicesInfo(
        invoice_information
      );

      // ADVANCE MR
      if (invoice_client_previous_due > 0) {
        await addAdvanceMr(
          common_conn,
          invoice_id,
          client_id,
          combined_id,
          airticket_client_price,
          invoice_client_previous_due
        );
      }

      const {
        combined_id: airticket_vendor_combine_id,
        vendor_id: airticket_vendor_id,
      } = separateCombClientToId(comb_vendor);

      // VENDOR TRANSACTIONS
      const VTrxnBody: IVTrxn = {
        comb_vendor: comb_vendor,
        vtrxn_amount: airticket_purchase_price,
        vtrxn_created_at: invoice_sales_date,
        vtrxn_note: invoice_note,
        vtrxn_particular_id: 5,
        vtrxn_type: 'DEBIT',
        vtrxn_user_id: req.user_id,
        vtrxn_voucher: invoice_no,
        vtrxn_airticket_no: airticket_ticket_no,
      };
      const airticket_vtrxn_id = await trxns.VTrxnInsert(VTrxnBody);

      const reissueAirTicketItem: IReissueTicketDetailsDb = {
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
        airticket_vtrxn_id,
        airticket_existing_invoiceid,
        airticket_penalties,
        airticket_fare_difference,
        airticket_commission_percent,
        airticket_ait,
        airticket_issue_date,
        airticket_classes,
        airticket_existing_airticket_id,
        airticket_tax,
        airticket_extra_fee,

        airticket_after_reissue_client_price:
          Number(airticket_client_price || 0) +
          Number(previousData.cl_price || 0) -
          Number(airticket_penalties || 0),

        airticket_after_reissue_purchase_price:
          Number(airticket_purchase_price || 0) +
          Number(previousData.purchase || 0) -
          Number(airticket_penalties || 0),

        airticket_after_reissue_taxes:
          Number(airticket_tax || 0) + Number(previousData.taxes || 0),

        airticket_after_reissue_profit:
          Number(airticket_profit || 0) +
          Number(previousData.airticket_profit || 0),
      };

      await conn.insertReissueAirTicketItems(reissueAirTicketItem);

      // UPDATE IS REISSUED
      await conn.updateInvoiceIsReissued(airticket_existing_invoiceid, 1);
      await conn.updateAirTicketIsReissued(
        prevInvCateId,
        airticket_existing_airticket_id,
        1
      );

      // NEW HISTORY
      const new_history_data: InvoiceHistory = {
        history_activity_type: 'INVOICE_CREATED',
        history_created_by: req.user_id,
        history_invoice_id: invoice_id,
        invoicelog_content: 'Existing Air Ticket Reissued!',
        history_invoice_payment_amount: airticket_client_price,
      };

      await common_conn.insertInvoiceHistory(new_history_data);

      // EXISTING HISTORY
      const existing_history_data: InvoiceHistory = {
        history_invoice_payment_amount: airticket_client_price,
        history_activity_type: 'INVOICE_CREATED',
        history_created_by: req.user_id,
        history_invoice_id: airticket_existing_invoiceid,
        invoicelog_content: 'Air Ticket Reissued!',
      };

      await common_conn.insertInvoiceHistory(existing_history_data);

      await this.updateVoucher(req, 'ARI');

      const content = `Existing client invoice reissue has been created, Voucher - ${invoice_no}, Net - ${airticket_client_price}/-`;

      this.insertAudit(req, 'create', content, req.user_id, 'INVOICES');

      return {
        success: true,
        message: content,
        data: { invoice_id },
      };
    });
  };
}

export default AddExistingClient;
