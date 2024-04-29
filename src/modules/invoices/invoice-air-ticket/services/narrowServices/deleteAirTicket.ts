import { Request } from 'express';
import { Knex } from 'knex';
import AbstractServices from '../../../../../abstracts/abstract.services';
import Trxns from '../../../../../common/helpers/Trxns';

class DeleteAirTicket extends AbstractServices {
  constructor() {
    super();
  }

  public deleteAirTicket = async (
    req: Request,
    voidTran?: Knex.Transaction<any, any[]>
  ) => {
    const invoice_id = Number(req.params.invoice_id);

    return await this.models.db.transaction(async (trx) => {
      const common_conn = this.models.CommonInvoiceModel(req, voidTran || trx);
      const conn = this.models.invoiceAirticketModel(req, voidTran || trx);
      const trxns = new Trxns(req, voidTran || trx);

      const prevBillingInfo = await conn.getPrevAirticketVendor(invoice_id);

      await trxns.deleteInvVTrxn(prevBillingInfo);

      await conn.deleteAirticketItems(invoice_id, req.user_id);

      await common_conn.deleteInvoices(invoice_id, req.user_id);

      // @invoice history
      const content = `Invoice air ticket has been deleted`;

      await this.insertAudit(req, 'delete', content, req.user_id, 'INVOICES');
      return {
        success: true,
        message: 'invoice has been deleted',
      };
    });
  };
}

export default DeleteAirTicket;
