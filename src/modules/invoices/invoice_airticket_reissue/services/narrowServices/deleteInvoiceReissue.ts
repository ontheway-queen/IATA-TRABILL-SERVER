import { Request } from 'express';
import { Knex } from 'knex';
import AbstractServices from '../../../../../abstracts/abstract.services';
import Trxns from '../../../../../common/helpers/Trxns';

class DeleteReissue extends AbstractServices {
  constructor() {
    super();
  }

  public deleteReissue = async (
    req: Request,
    voidTran?: Knex.Transaction<any, any[]>
  ) => {
    const invoice_id = Number(req.params.invoice_id);
    return await this.models.db.transaction(async (trx) => {
      const common_conn = this.models.CommonInvoiceModel(req, voidTran || trx);
      const conn = this.models.reissueAirticket(req, voidTran || trx);

      const previousVendorBilling = await conn.getReissuePrevVendors(
        invoice_id
      );

      await conn.deleteReissueFlightDetails(invoice_id, req.user_id);
      await conn.deleteAirticketReissueItems(invoice_id, req.user_id);

      await common_conn.deleteInvoices(invoice_id, req.user_id);
      await new Trxns(req, voidTran || trx).deleteInvVTrxn(
        previousVendorBilling
      );

      // UPDATE PREVIOUS INVOICE IS NOT REISSUED
      for (const item of previousVendorBilling) {
        const prevInvCateId = await conn.getExistingInvCateId(item.ex_inv_id);

        await conn.updateInvoiceIsReissued(item.ex_inv_id, 0);
        await conn.updateAirTicketIsReissued(
          prevInvCateId,
          item.ex_airticket_id,
          0
        );
      }

      await this.insertAudit(
        req,
        'delete',
        `Air ticket reissue has been deleted!`,
        req.user_id,
        'INVOICES'
      );

      return {
        success: true,
        data: 'Invoice deleted successfully',
      };
    });
  };
}

export default DeleteReissue;
