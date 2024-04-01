import { Request } from 'express';
import AbstractServices from '../../../../../abstracts/abstract.services';
import Trxns from '../../../../../common/helpers/Trxns';

class DeleteAirTicketRefund extends AbstractServices {
  constructor() {
    super();
  }

  /**
   * delete air ticket refund
   */
  public delete = async (req: Request) => {
    const { refund_id } = req.params;

    const { deleted_by } = req.body;

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.refundModel(req, trx);
      const trxns = new Trxns(req, trx);

      const { atrefund_invoice_id, atrefund_trxn_charge_id } =
        await conn.getAirticketRefund(refund_id);

      // client trxn delete
      const airticketRefundClient = await conn.getAirticketClientRefund(
        refund_id
      );

      if (atrefund_trxn_charge_id) {
        await this.models
          .vendorModel(req, trx)
          .deleteOnlineTrxnCharge(atrefund_trxn_charge_id);
      }

      for (const item of airticketRefundClient) {
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

      // vendor trxn delete
      const airticketRefundInfo = await conn.getAirticketVendorRefund(
        refund_id
      );

      const category_id = await conn.getInvoiceCategoryId(atrefund_invoice_id);

      for (const item of airticketRefundInfo) {
        const {
          vrefund_vtrxn_id,
          vrefund_charge_vtrxn_id,
          vrefund_acctrxn_id,
          vrefund_airticket_id,
          vrefund_category_id,
        } = item;

        await conn.updateAirticketItemIsRefund(
          vrefund_airticket_id,
          vrefund_category_id,
          0
        );

        if (vrefund_vtrxn_id) {
          await trxns.deleteVTrxn(vrefund_vtrxn_id, item.comb_vendor);
        }

        if (vrefund_charge_vtrxn_id) {
          await trxns.deleteVTrxn(vrefund_charge_vtrxn_id, item.comb_vendor);
        }

        if (vrefund_acctrxn_id) {
          await trxns.deleteAccTrxn(vrefund_acctrxn_id);
        }

        await conn.updateAirticketItemIsRefund(
          vrefund_airticket_id,
          category_id,
          0
        );
      }

      await conn.updateInvoiceAirticketIsRefund(atrefund_invoice_id, 0);

      await conn.deleteAirTicketRefund(refund_id, deleted_by);

      await this.insertAudit(
        req,
        'delete',
        'Airticket refund has been deleted',
        deleted_by,
        'REFUND'
      );

      return {
        success: true,
        message: 'Airticket refund has been deleted',
      };
    });
  };
}

export default DeleteAirTicketRefund;
