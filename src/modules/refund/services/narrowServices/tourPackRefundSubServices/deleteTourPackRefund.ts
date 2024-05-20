import { Request } from 'express';
import { Knex } from 'knex';
import AbstractServices from '../../../../../abstracts/abstract.services';
import Trxns from '../../../../../common/helpers/Trxns';
import { InvoiceHistory } from '../../../../../common/types/common.types';
class DeleteTourPackRefund extends AbstractServices {
  constructor() {
    super();
  }

  public delete = async (
    req: Request,
    voidTrx?: Knex.Transaction<any, any[]>
  ) => {
    const { refund_id } = req.params;

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.refundModel(req, voidTrx || trx);
      const common_conn = this.models.CommonInvoiceModel(req, trx);
      const mr_conn = this.models.MoneyReceiptModels(req, trx);
      const vendor_conn = this.models.vendorModel(req, voidTrx || trx);
      const trxns = new Trxns(req, voidTrx || trx);

      const { refund_invoice_id, refund_charge_id } = await conn.getTourRefund(
        refund_id
      );

      await conn.updateInvoiceIsRefund(refund_invoice_id, 0);

      const tourRefundClient = await conn.getTourClientRefund(refund_id);

      const vendorRefundInfo = await conn.getTourVendorRefund(refund_id);

      if (refund_charge_id) {
        await vendor_conn.deleteOnlineTrxnCharge(refund_charge_id);
      }

      await conn.deleteRefundTour(refund_id, req.user_id);

      const {
        crefund_ctrxnid,
        crefund_charge_ctrxnid,
        crefund_actransaction_id,
      } = tourRefundClient;

      if (crefund_ctrxnid) {
        await trxns.deleteClTrxn(crefund_ctrxnid, tourRefundClient.comb_client);
      }
      if (crefund_charge_ctrxnid) {
        await trxns.deleteClTrxn(
          crefund_charge_ctrxnid,
          tourRefundClient.comb_client
        );
      }
      if (crefund_actransaction_id) {
        await trxns.deleteAccTrxn(crefund_actransaction_id);
      }

      for (const item of vendorRefundInfo) {
        const {
          vrefund_vtrxn_id,
          vrefund_charge_vtrxn_id,
          vrefund_acctrxn_id,
        } = item;

        await conn.updateAirticketItemIsRefund(refund_invoice_id, 5, 0);

        if (vrefund_vtrxn_id) {
          await trxns.deleteVTrxn(vrefund_vtrxn_id, item.comb_vendor);
        }
        if (vrefund_charge_vtrxn_id) {
          await trxns.deleteVTrxn(vrefund_charge_vtrxn_id, item.comb_vendor);
        }
        if (vrefund_acctrxn_id) {
          await trxns.deleteAccTrxn(vrefund_acctrxn_id);
        }
      }

      const message = `DELETED REFUND TOUR PACKAGE/:${refund_id}`;

      // delete inv cl pay
      await mr_conn.deleteInvClPayByRfId(
        'TOUR',
        +refund_id,
        tourRefundClient.crefund_client_id,
        tourRefundClient.crefund_combined_id
      );

      const history_data: InvoiceHistory = {
        history_activity_type: 'INVOICE_REFUNDED',
        history_invoice_id: refund_invoice_id,
        history_created_by: req.user_id,
        invoicelog_content: `DELETE INVOICE REFUND`,
      };

      await common_conn.insertInvoiceHistory(history_data);

      await this.insertAudit(req, 'update', message, req.user_id, 'INVOICES');
      return {
        success: true,
        message,
      };
    });
  };
}

export default DeleteTourPackRefund;
