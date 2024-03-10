import { Request } from 'express';
import AbstractServices from '../../../../../abstracts/abstract.services';
import Trxns from '../../../../../common/helpers/Trxns';
import { Knex } from 'knex';
class DeleteTourPackRefund extends AbstractServices {
  constructor() {
    super();
  }

  public delete = async (
    req: Request,
    voidTrx?: Knex.Transaction<any, any[]>
  ) => {
    const { refund_id } = req.params;

    const { refund_deleted_by } = req.body as { refund_deleted_by: number };

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.refundModel(req, voidTrx || trx);
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

      for (const item of tourRefundClient) {
        const {
          crefund_ctrxnid,
          crefund_charge_ctrxnid,
          crefund_actransaction_id,
        } = item;

        if (crefund_ctrxnid) {
          await trxns.deleteClTrxn(crefund_ctrxnid, item.comb_client);
        }
        if (crefund_charge_ctrxnid) {
          await trxns.deleteClTrxn(crefund_charge_ctrxnid, item.comb_client);
        }
        if (crefund_actransaction_id) {
          await trxns.deleteAccTrxn(crefund_actransaction_id);
        }
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

      const message = 'Tour refund has been deleted';

      await this.insertAudit(req, 'update', message, req.user_id, 'INVOICES');
      return {
        success: true,
        message,
      };
    });
  };
}

export default DeleteTourPackRefund;
