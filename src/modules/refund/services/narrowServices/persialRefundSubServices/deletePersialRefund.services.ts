/*
Partial Refund update service
@Author MD Sabbir <sabbir.m360ict@gmail.com>
*/

import { Request } from 'express';
import AbstractServices from '../../../../../abstracts/abstract.services';
import Trxns from '../../../../../common/helpers/Trxns';

class DeletePersialRefund extends AbstractServices {
  constructor() {
    super();
  }

  public delete = async (req: Request) => {
    const { refund_id } = req.params as { refund_id: string };
    const { deleted_by } = req.body as { deleted_by: number };

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.refundModel(req, trx);
      const trxns = new Trxns(req, trx);

      const { prfnd_invoice_id, prfnd_vouchar_number } =
        await conn.getPersialRfndInvoiceId(refund_id);

      const { invoice_category_id } = await conn.getInvoiceInfo(
        prfnd_invoice_id
      );

      const {
        prfnd_actrxn_id,
        prfnd_charge_trxn_id,
        prfnd_trxn_id,
        comb_client,
      } = await conn.getPersialRfndInfo(refund_id);

      if (prfnd_actrxn_id) {
        await trxns.deleteAccTrxn(prfnd_actrxn_id);
      }
      if (prfnd_trxn_id) {
        await trxns.deleteClTrxn(prfnd_trxn_id, comb_client);
      }
      if (prfnd_charge_trxn_id) {
        await trxns.deleteClTrxn(prfnd_charge_trxn_id, comb_client);
      }

      const persialVendorRefundInfo = await conn.getPersialRefundVendorInfo(
        refund_id
      );

      for (const refund_info of persialVendorRefundInfo) {
        const {
          vprfnd_actrxn_id,
          vprfnd_charge_trxn_id,
          vprfnd_trxn_id,
          comb_vendor,
          vprfnd_airticket_id,
        } = refund_info;

        await conn.updateAirticketItemIsRefund(
          vprfnd_airticket_id,
          invoice_category_id,
          0
        );

        if (vprfnd_actrxn_id) {
          await trxns.deleteAccTrxn(vprfnd_actrxn_id);
        }
        if (vprfnd_charge_trxn_id) {
          await trxns.deleteVTrxn(vprfnd_charge_trxn_id, comb_vendor);
        }
        if (vprfnd_trxn_id) {
          await trxns.deleteVTrxn(vprfnd_trxn_id, comb_vendor);
        }
      }

      await conn.deletePersialRefund(refund_id, deleted_by);
      await conn.deletePersialVendorRefund(refund_id, deleted_by);

      await conn.updateInvoiceAirticketIsRefund(prfnd_invoice_id, 0);

      const audit_content = `Persial refund deleted vouchar no: ${prfnd_vouchar_number}`;
      await this.insertAudit(
        req,
        'delete',
        audit_content,
        deleted_by,
        'REFUND'
      );
      return { success: true, message: 'Persial refund deleted successfuly' };
    });
  };
}
export default DeletePersialRefund;
