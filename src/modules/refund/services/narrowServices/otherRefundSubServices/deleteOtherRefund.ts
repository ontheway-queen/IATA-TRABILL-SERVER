import { Request } from 'express';
import { Knex } from 'knex';
import AbstractServices from '../../../../../abstracts/abstract.services';
import Trxns from '../../../../../common/helpers/Trxns';
import { InvoiceHistory } from '../../../../../common/types/common.types';

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

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.refundModel(req, voidTrx || trx);
      const vendor_conn = this.models.vendorModel(req, voidTrx || trx);
      const common_conn = this.models.CommonInvoiceModel(req, trx);
      const mr_conn = this.models.MoneyReceiptModels(req, trx);
      const trxns = new Trxns(req, voidTrx || trx);

      const { refund_invoice_id, refund_charge_id } =
        await conn.getOtherRefundInvoice(refund_id);

      await conn.updateInvoiceIsRefund(refund_invoice_id, 0);

      if (refund_charge_id) {
        await vendor_conn.deleteOnlineTrxnCharge(refund_charge_id);
      }

      // client trans delete
      const prevData = await conn.getOtherClientRefundInfo(refund_id);

      if (prevData.crefund_ctrxnid) {
        await trxns.deleteClTrxn(
          prevData.crefund_ctrxnid,
          prevData.comb_client
        );
      }
      if (prevData.crefund_charge_ctrxnid) {
        await trxns.deleteClTrxn(
          prevData.crefund_charge_ctrxnid,
          prevData.comb_client
        );
      }
      if (prevData.crefund_actransaction_id) {
        await trxns.deleteAccTrxn(prevData.crefund_actransaction_id);
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

      // delete inv cl pay
      await mr_conn.deleteInvClPayByRfId(
        'OTHER',
        +refund_id,
        prevData.crefund_client_id,
        prevData.crefund_combined_id
      );

      const history_data: InvoiceHistory = {
        history_activity_type: 'INVOICE_REFUNDED',
        history_invoice_id: refund_invoice_id,
        history_created_by: req.user_id,
        invoicelog_content: `DELETE INVOICE REFUND`,
      };

      await common_conn.insertInvoiceHistory(history_data);

      await conn.deleteOtherRefund(refund_id, req.user_id);

      await this.insertAudit(
        req,
        'delete',
        `DELETED OTHER REFUND/:${refund_id}`,
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
