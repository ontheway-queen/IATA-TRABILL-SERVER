import { Request } from 'express';
import AbstractServices from '../../../../../abstracts/abstract.services';
import Trxns from '../../../../../common/helpers/Trxns';
import { separateCombClientToId } from '../../../../../common/helpers/common.helper';
import { getClientOrCombId } from '../../../../../common/helpers/invoice.helpers';
import {
  IClTrxnBody,
  IVTrxn,
} from '../../../../../common/interfaces/Trxn.interfaces';
import {
  IInvoiceInfoDb,
  InvoiceExtraAmount,
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
      airticket_client_charge,
      airticket_journey_date,
      airticket_return_date,
      airticket_profit,
      airticket_service_charge,
      airticket_vendor_charge,
      invoice_combclient_id,
      invoice_created_by,
      invoice_sales_date,
      invoice_due_date,
      invoice_sales_man_id,
      invoice_note,
      airticket_comvendor,
      airticket_ticket_no,
      airticket_existing_invoiceid,
      invoice_reference,
    } = req.body as IExistingReissueReq;




    // CLIENT AND COMBINED CLIENT
    const { invoice_client_id, invoice_combined_id } = await getClientOrCombId(
      invoice_combclient_id
    );

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.reissueAirticket(req, trx);
      const trxns = new Trxns(req, trx);
      const common_conn = this.models.CommonInvoiceModel(req, trx);
      const combined_conn = this.models.combineClientModel(req, trx);

      const invoice_no = await this.generateVoucher(req, 'ARI');

      const invoice_client_previous_due =
        await combined_conn.getClientLastBalanceById(
          invoice_client_id as number,
          invoice_combined_id as number
        );

      const invoice_net_total =
        (airticket_client_charge | 0) + (airticket_service_charge | 0);

      // CLIENT COMBINED TRANSACTIONS

      const clTrxnBody: IClTrxnBody = {
        ctrxn_type: 'DEBIT',
        ctrxn_amount: invoice_net_total,
        ctrxn_cl: invoice_combclient_id,
        ctrxn_voucher: invoice_no,
        ctrxn_particular_id: 94,
        ctrxn_created_at: invoice_sales_date,
        ctrxn_note: invoice_note as string,
        ctrxn_particular_type: 'invoice reissue',
        ctrxn_user_id: invoice_created_by,
      };

      const invoice_cltrxn_id = await trxns.clTrxnInsert(clTrxnBody);

      const invoice_information: IInvoiceInfoDb = {
        invoice_combined_id,
        invoice_client_id,
        invoice_created_by,
        invoice_net_total,
        invoice_sales_date,
        invoice_due_date,
        invoice_sales_man_id,
        invoice_sub_total: airticket_client_charge,
        invoice_note,
        invoice_category_id: 3,
        invoice_no: invoice_no as string,
        invoice_reissue_client_type: 'EXISTING',
        invoice_cltrxn_id,
        invoice_client_previous_due,
        invoice_reference,
        invoice_total_profit: airticket_profit,
        // invoice_total_vendor_price,
      };
      const invoice_id = await common_conn.insertInvoicesInfo(
        invoice_information
      );

      let airticket_vendor_combine_id = null;
      let airticket_vendor_id = null;

      if (airticket_comvendor) {
        const { combined_id, vendor_id } =
          separateCombClientToId(airticket_comvendor);

        airticket_vendor_combine_id = combined_id;
        airticket_vendor_id = vendor_id;
      }

      // VENDOR TRANSACTIONS

      const VTrxnBody: IVTrxn = {
        comb_vendor: airticket_comvendor,
        vtrxn_amount: airticket_vendor_charge,
        vtrxn_created_at: invoice_sales_date,
        vtrxn_note: invoice_note,
        vtrxn_particular_id: 148,
        vtrxn_particular_type: 'invoice reissue airticket',
        vtrxn_type: airticket_vendor_combine_id ? 'CREDIT' : 'DEBIT',
        vtrxn_user_id: invoice_created_by,
        vtrxn_voucher: invoice_no,
      };
      const airticket_vtrxn_id = await trxns.VTrxnInsert(VTrxnBody);

      const reissueAirTicketItem = {
        airticket_client_id: invoice_client_id,
        airticket_combined_id: invoice_combined_id,
        airticket_vendor_id,
        airticket_vendor_combine_id,
        airticket_invoice_id: invoice_id,
        airticket_sales_date: invoice_sales_date,
        airticket_profit,
        airticket_journey_date,
        airticket_return_date,
        airticket_purchase_price: airticket_vendor_charge,
        airticket_client_price: airticket_client_charge,
        airticket_ticket_no,
        airticket_vtrxn_id,
        airticket_existing_invoiceid,
      };

      await conn.insertReissueAirticketItems(
        reissueAirTicketItem as IReissueTicketDetailsDb
      );

      const invoiceExtraAmount: InvoiceExtraAmount = {
        extra_amount_invoice_id: invoice_id,
        invoice_service_charge: airticket_service_charge,
      };
      await common_conn.insertInvoiceExtraAmount(invoiceExtraAmount);

      const history_data: InvoiceHistory = {
        history_activity_type: 'INVOICE_CREATED',
        history_created_by: invoice_created_by,
        history_invoice_id: invoice_id,
        history_invoice_payment_amount: invoice_net_total,
        invoicelog_content:
          'Existing invoice airticket reissue has been created',
      };

      await common_conn.insertInvoiceHistory(history_data);

      await this.updateVoucher(req, 'ARI');

      const content = `Existing client invoice reissue has been created, Voucher - ${invoice_no}, Net - ${invoice_net_total}/-`;

      this.insertAudit(req, 'create', content, invoice_created_by, 'INVOICES');

      return {
        success: true,
        message: content,
        data: { invoice_id },
      };
    });
  };
}

export default AddExistingClient;
