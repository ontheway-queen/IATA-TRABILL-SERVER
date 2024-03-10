import { Request } from 'express';
import AbstractServices from '../../../../../abstracts/abstract.services';
import { InvoiceHistory } from '../../../../../common/types/common.types';
import { ITourRequest } from '../../types/invouceTour.interfaces';
import InvoiceTourHelpers from '../../utils/invoicetour.helpers';

class AddCostingInvoiceTour extends AbstractServices {
  constructor() {
    super();
  }

  public addCostingInvoiceTour = async (req: Request) => {
    const { invoice_created_by } = req.body as ITourRequest;

    const invoice_id = Number(req.params.invoice_id);

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.invoiceTourModels(req, trx);
      const vendor_conn = this.models.vendorModel(req, trx);
      const common_conn = this.models.CommonInvoiceModel(req, trx);
      const combined_conn = this.models.combineClientModel(req, trx);

      await conn.deleteBillingOnly(invoice_id, invoice_created_by);

      // TOUR VENDOR COST BILLING INSERT
      await InvoiceTourHelpers.addVendorCostBilling(
        req,
        conn,
        vendor_conn,
        combined_conn,
        invoice_id,
        trx
      );

      const history_data: InvoiceHistory = {
        history_activity_type: 'INVOICE_PAYMENT_CREATED',
        history_invoice_id: invoice_id,
        history_created_by: invoice_created_by,
        invoicelog_content: `Invoice costing has been added`,
      };

      await common_conn.insertInvoiceHistory(history_data);

      const content = `Invoice tour costing has been added, inv-id:${invoice_id}`;

      await this.insertAudit(
        req,
        'create',
        content,
        invoice_created_by,
        'INVOICES'
      );

      return { success: true, message: 'Invoice tour costing has been added' };
    });
  };
}

export default AddCostingInvoiceTour;
