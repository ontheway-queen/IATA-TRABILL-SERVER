import { Request } from 'express';
import AbstractServices from '../../../../../abstracts/abstract.services';
import Trxns from '../../../../../common/helpers/Trxns';
import { InvoiceHistory } from '../../../../../common/types/common.types';

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
      const common_conn = this.models.CommonInvoiceModel(req, trx);
      const mr_conn = this.models.MoneyReceiptModels(req, trx);
      const trxns = new Trxns(req, trx);

      const { atrefund_invoice_id, atrefund_trxn_charge_id } =
        await conn.getAirticketRefund(refund_id);

      // client trans delete
      const airticketRefundClient = await conn.getAirticketClientRefund(
        refund_id
      );

      if (atrefund_trxn_charge_id) {
        await this.models
          .vendorModel(req, trx)
          .deleteOnlineTrxnCharge(atrefund_trxn_charge_id);
      }

      const {
        crefund_ctrxnid,
        crefund_charge_ctrxnid,
        crefund_actransaction_id,
      } = airticketRefundClient;

      if (crefund_ctrxnid) {
        await trxns.deleteClTrxn(
          crefund_ctrxnid,
          airticketRefundClient.comb_client
        );
      }
      if (crefund_charge_ctrxnid) {
        await trxns.deleteClTrxn(
          crefund_charge_ctrxnid,
          airticketRefundClient.comb_client
        );
      }

      if (crefund_actransaction_id) {
        await trxns.deleteAccTrxn(crefund_actransaction_id);
      }

      // vendor trans delete
      const previousVendorRefundInfo = await conn.getPreviousVendorRefundInfo(
        refund_id
      );

      for (const item of previousVendorRefundInfo) {
        const {
          vrefund_vtrxn_id,
          vrefund_category_id,
          vrefund_charge_vtrxn_id,
          vrefund_acctrxn_id,
          vrefund_airticket_id,
        } = item;

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
          vrefund_category_id,
          0
        );
      }

      // delete inv cl pay
      await mr_conn.deleteInvClPayByRfId(
        'OTHER',
        +refund_id,
        airticketRefundClient.crefund_client_id,
        airticketRefundClient.crefund_combined_id
      );

      const history_data: InvoiceHistory = {
        history_activity_type: 'INVOICE_REFUNDED',
        history_invoice_id: atrefund_invoice_id,
        history_created_by: req.user_id,
        invoicelog_content: `DELETE INVOICE REFUND`,
      };

      await common_conn.insertInvoiceHistory(history_data);

      await conn.updateInvoiceAirticketIsRefund(atrefund_invoice_id, 0);

      await conn.deleteAirTicketRefund(refund_id, deleted_by);

      await this.insertAudit(
        req,
        'delete',
        `DELETED  INVOICE AIR TICKET REFUND/:${refund_id}`,
        deleted_by,
        'REFUND'
      );

      return {
        success: true,
        message: 'Air ticket refund has been deleted',
      };
    });
  };
}

export default DeleteAirTicketRefund;
