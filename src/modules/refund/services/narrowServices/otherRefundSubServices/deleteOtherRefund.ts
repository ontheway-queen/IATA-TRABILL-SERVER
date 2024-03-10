import { Request } from 'express';
import AbstractServices from '../../../../../abstracts/abstract.services';
import Trxns from '../../../../../common/helpers/Trxns';
import { Knex } from 'knex';

class DeleteOtherRefund extends AbstractServices {
  constructor() {
    super();
  }

  /**
   * Delete Client refund
   */
  public deleteOtherRefund = async (
    req: Request,
    voidTrx?: Knex.Transaction<any, any[]>
  ) => {
    const { refund_id } = req.params;

    const { refund_deleted_by } = req.body as { refund_deleted_by: number };

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.refundModel(req, voidTrx || trx);
      const vendor_conn = this.models.vendorModel(req, voidTrx || trx);
      const trxns = new Trxns(req, voidTrx || trx);

      const { refund_invoice_id, refund_charge_id } =
        await conn.getOtherRefundInvoice(refund_id);

      await conn.updateInvoiceIsRefund(refund_invoice_id, 0);

      if (refund_charge_id) {
        await vendor_conn.deleteOnlineTrxnCharge(refund_charge_id);
      }

      // client trxn delete
      const otherRefundClient = await conn.getOtherClientRefundInfo(refund_id);

      for (const item of otherRefundClient) {
        if (item.crefund_ctrxnid) {
          await trxns.deleteClTrxn(item.crefund_ctrxnid, item.comb_client);
        }
        if (item.crefund_charge_ctrxnid) {
          await trxns.deleteClTrxn(
            item.crefund_charge_ctrxnid,
            item.comb_client
          );
        }
        if (item.crefund_actransaction_id) {
          await trxns.deleteAccTrxn(item.crefund_actransaction_id);
        }
      }

      // delete vendor transaction
      const otherRefundVendor = await conn.getOtherVendorRefundInfo(refund_id);

      for (const item of otherRefundVendor) {
        await conn.updateAirticketItemIsRefund(item.vrefund_invoice_id, 4, 1);

        if (item.vrefund_vtrxn_id) {
          await trxns.deleteVTrxn(item.vrefund_vtrxn_id, item.comb_vendor);
        }

        if (item.vrefund_charge_vtrxn_id) {
          await trxns.deleteVTrxn(
            item.vrefund_charge_vtrxn_id,
            item.comb_vendor
          );
        }

        if (item.vrefund_acctrxn_id) {
          await trxns.deleteAccTrxn(item.vrefund_acctrxn_id);
        }
      }

      const { billing_remaining_quantity } = await conn.getReminingQuantity(
        refund_invoice_id
      );

      const vrefund_quantity = await conn.getOtherRefundQuantity(refund_id);
      const remaining_quantity = billing_remaining_quantity + vrefund_quantity;

      await conn.updateRemainingQty(refund_invoice_id, 1, remaining_quantity);

      await conn.deleteOtherRefund(refund_id, req.user_id);

      await this.insertAudit(
        req,
        'delete',
        'Other refund has been deleted',
        req.user_id,
        'REFUND'
      );
      return {
        success: true,
        message: 'Other refund deleted successfully',
      };
    });
  };
}

export default DeleteOtherRefund;
