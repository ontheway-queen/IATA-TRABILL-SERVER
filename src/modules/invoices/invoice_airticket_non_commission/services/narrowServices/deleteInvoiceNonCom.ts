import { Request } from 'express';
import { Knex } from 'knex';
import AbstractServices from '../../../../../abstracts/abstract.services';
import Trxns from '../../../../../common/helpers/Trxns';

class DeleteNonComInvoice extends AbstractServices {
  constructor() {
    super();
  }

  public deleteNonComInvoice = async (
    req: Request,
    voidTran?: Knex.Transaction<any, any[]>
  ) => {
    const invoice_id = Number(req.params.invoice_id);

    return await this.models.db.transaction(async (trx) => {
      const common_conn = this.models.CommonInvoiceModel(req, voidTran || trx);
      const conn = this.models.invoiceNonCommission(req, voidTran || trx);
      const trxns = new Trxns(req, voidTran || trx);

      const prevBillingInfo = await conn.getPrevNonComVendor(invoice_id);

      await trxns.deleteInvVTrxn(prevBillingInfo);

      await conn.deleteNonCommissionItems(invoice_id, req.user_id);

      await common_conn.deleteInvoices(invoice_id, req.user_id);

      await this.insertAudit(
        req,
        'delete',
        `Invoice air ticket non commission has been deleted`,
        req.user_id,
        'INVOICES'
      );
      return {
        success: true,
        message: 'Invoice air ticket non commission has been deleted',
      };
    });
  };
}

export default DeleteNonComInvoice;
