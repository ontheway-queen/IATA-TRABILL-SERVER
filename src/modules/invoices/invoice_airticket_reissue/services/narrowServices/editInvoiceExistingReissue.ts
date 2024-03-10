import { Request } from 'express';
import AbstractServices from '../../../../../abstracts/abstract.services';
import { separateCombClientToId } from '../../../../../common/helpers/common.helper';
import { getClientOrCombId } from '../../../../../common/helpers/invoice.helpers';
import { IUpdateInvoiceInfoDb } from '../../../../../common/types/Invoice.common.interface';
import { InvoiceHistory } from '../../../../../common/types/common.types';
import {
  IExistingReissueReq,
  IReissueTicketDetailsDb,
} from '../../types/invoiceReissue.interface';
import {
  IClTrxnUpdate,
  IVTrxn,
} from '../../../../../common/interfaces/Trxn.interfaces';
import Trxns from '../../../../../common/helpers/Trxns';

class EditExistingCl extends AbstractServices {
  constructor() {
    super();
  }

  public editExistingCl = async (req: Request) => {
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
      invoice_no,
      invoice_reference,
    } = req.body as IExistingReissueReq;

    // CLIENT AND COMBINED CLIENT
    const { invoice_client_id, invoice_combined_id } = await getClientOrCombId(
      invoice_combclient_id
    );

    const invoice_id = Number(req.params.invoice_id);

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.reissueAirticket(req, trx);
      const common_conn = this.models.CommonInvoiceModel(req, trx);
      const trxns = new Trxns(req, trx);

      const invoice_net_total =
        airticket_client_charge + airticket_service_charge;
      const { prevCtrxnId } = await common_conn.getPreviousInvoices(invoice_id);

      const clTrxnBody: IClTrxnUpdate = {
        ctrxn_type: 'DEBIT',
        ctrxn_amount: invoice_net_total,
        ctrxn_cl: invoice_combclient_id,
        ctrxn_voucher: invoice_no,
        ctrxn_particular_id: 91,
        ctrxn_created_at: invoice_sales_date,
        ctrxn_note: invoice_note,
        ctrxn_particular_type: 'Invoice reissue',
        ctrxn_trxn_id: prevCtrxnId,
        ctrxn_airticket_no: airticket_ticket_no,
      };

      await trxns.clTrxnUpdate(clTrxnBody);

      const invoice_information: IUpdateInvoiceInfoDb = {
        invoice_updated_by: invoice_created_by,
        invoice_net_total,
        invoice_sales_date,
        invoice_due_date,
        invoice_sales_man_id,
        invoice_sub_total: airticket_client_charge,
        invoice_note,
        invoice_client_id,
        invoice_combined_id,
        invoice_reference,
        invoice_total_profit: airticket_profit,
      };

      common_conn.updateInvoiceInformation(invoice_id, invoice_information);

      const previousVendorBilling = await conn.getReissuePrevVendors(
        invoice_id
      );

      await trxns.deleteInvVTrxn(previousVendorBilling);

      const {
        combined_id: airticket_vendor_combine_id,
        vendor_id: airticket_vendor_id,
      } = separateCombClientToId(airticket_comvendor);

      // VENDOR TRANSACTIIONS

      const VTrxnBody: IVTrxn = {
        comb_vendor: airticket_comvendor,
        vtrxn_amount: airticket_vendor_charge,
        vtrxn_created_at: invoice_sales_date,
        vtrxn_note: invoice_note,
        vtrxn_particular_id: 148,
        vtrxn_particular_type: 'invoice reissue',
        vtrxn_type: airticket_vendor_combine_id ? 'CREDIT' : 'DEBIT',
        vtrxn_user_id: invoice_created_by,
        vtrxn_voucher: invoice_no,
        vtrxn_airticket_no: airticket_ticket_no,
      };

      await trxns.VTrxnInsert(VTrxnBody);

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
      };

      await conn.updateInvoiceReissueAirticket(
        invoice_id,
        reissueAirTicketItem as IReissueTicketDetailsDb
      );

      const history_data: InvoiceHistory = {
        history_activity_type: 'INVOICE_UPDATED',
        history_created_by: invoice_created_by,
        history_invoice_id: invoice_id,
        history_invoice_payment_amount: invoice_net_total,
        invoicelog_content: 'Invoice airticket reissue has been updated',
      };

      await common_conn.insertInvoiceHistory(history_data);

      await this.insertAudit(
        req,
        'update',
        `Existing client invoice airticket reissue has been updated, Voucher - ${invoice_no}, Net - ${invoice_net_total}/-`,
        invoice_created_by,
        'INVOICES'
      );

      return {
        success: true,
        data: 'Invoice existing client updated successfully...',
      };
    });
  };
}

export default EditExistingCl;
