import { Request } from 'express';
import AbstractServices from '../../../../../abstracts/abstract.services';
import Trxns from '../../../../../common/helpers/Trxns';
import { separateCombClientToId } from '../../../../../common/helpers/common.helper';
import {
  IClTrxnBody,
  IVTrxn,
} from '../../../../../common/interfaces/Trxn.interfaces';
import {
  IInvoiceInfoDb
} from '../../../../../common/types/Invoice.common.interface';
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
      airticket_existing_airticket_id,
      airticket_client_price,
      airticket_purchase_price,
      airticket_profit,
      airticket_journey_date,
      airticket_return_date,
      invoice_note,
      comb_vendor, airticket_existing_invoiceid
    } = req.body as IExistingReissueReq;




    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.reissueAirticket(req, trx);
      const trxns = new Trxns(req, trx);
      const common_conn = this.models.CommonInvoiceModel(req, trx);
      const invoice_no = await this.generateVoucher(req, 'ARI');

      // CLIENT COMBINED TRANSACTIONS
      const clTrxnBody: IClTrxnBody = {
        ctrxn_type: 'DEBIT',
        ctrxn_amount: airticket_client_price,
        ctrxn_cl: invoice_combclient_id,
        ctrxn_voucher: invoice_no,
        ctrxn_particular_id: 94,
        ctrxn_created_at: invoice_sales_date,
        ctrxn_note: invoice_note as string,
        ctrxn_particular_type: 'Reissue Air Ticket',
        ctrxn_user_id: req.user_id,
      };

      const invoice_cltrxn_id = await trxns.clTrxnInsert(clTrxnBody);

      const { client_id, combined_id } = separateCombClientToId(invoice_combclient_id)

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
        invoice_total_vendor_price: airticket_purchase_price
      };
      const invoice_id = await common_conn.insertInvoicesInfo(
        invoice_information
      );

      const { combined_id: airticket_vendor_combine_id, vendor_id: airticket_vendor_id } =
        separateCombClientToId(comb_vendor);

      // VENDOR TRANSACTIONS
      const VTrxnBody: IVTrxn = {
        comb_vendor: comb_vendor,
        vtrxn_amount: airticket_purchase_price,
        vtrxn_created_at: invoice_sales_date,
        vtrxn_note: invoice_note,
        vtrxn_particular_id: 148,
        vtrxn_particular_type: 'Reissue Existing Air Ticket',
        vtrxn_type: 'DEBIT',
        vtrxn_user_id: req.user_id,
        vtrxn_voucher: invoice_no,
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

      };

      await conn.insertReissueAirTicketItems(
        reissueAirTicketItem
      );


      // NEW HISTORY
      const new_history_data: InvoiceHistory = {
        history_activity_type: 'INVOICE_CREATED',
        history_created_by: req.user_id,
        history_invoice_id: invoice_id,
        invoicelog_content:
          'Existing Air Ticket Reissued!',
        history_invoice_payment_amount: airticket_client_price

      };

      await common_conn.insertInvoiceHistory(new_history_data);

      // EXISTING HISTORY
      const existing_history_data: InvoiceHistory = {
        history_invoice_payment_amount: airticket_client_price,
        history_activity_type: 'INVOICE_CREATED',
        history_created_by: req.user_id,
        history_invoice_id: airticket_existing_invoiceid,
        invoicelog_content:
          'Air Ticket Reissued!'
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
