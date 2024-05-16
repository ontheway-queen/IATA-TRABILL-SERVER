import { Request } from 'express';
import AbstractServices from '../../../../../abstracts/abstract.services';
import { InvoiceHistory } from '../../../../../common/types/common.types';
import { IFakeInvoiceReqBody } from '../../types/invoiceAirticket.interface';

class AddInvoiceInfo extends AbstractServices {
  constructor() {
    super();
  }

  public add = async (req: Request) => {
    const {
      infos,
      ti_invoice_id,
      ti_invoice_total_due,
      ti_net_total,
      ti_sub_total,
      ti_total_discount,
      ti_total_payment,
    } = req.body as IFakeInvoiceReqBody;

    const { user_id, agency_id } = req;
    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.invoiceAirticketModel(req, trx);
      const common_conn = this.models.CommonInvoiceModel(req, trx);

      const { prev_inv_net_total } = await common_conn.getPreviousInvoices(
        ti_invoice_id
      );

      const ti_id = await conn.insertInvoiceInfo({
        ti_created_by: user_id,
        ti_invoice_id,
        ti_invoice_total_due,
        ti_net_total,
        ti_org_agency: agency_id,
        ti_sub_total,
        ti_total_discount,
        ti_total_payment,
      });

      if (infos && infos.length) {
        for (const info of infos) {
          await conn.insertInvoiceInfoItems({
            ...info,
            tii_created_by: user_id,
            tii_org_agency: agency_id,
            tii_ti_id: ti_id,
            tii_invoice_id: ti_invoice_id,
          });
        }
      }

      // invoice history
      const content = `INVOICE BILL UPDATED NET TOTAL ${prev_inv_net_total}/- to ${ti_net_total}/-`;
      const history_data: InvoiceHistory = {
        history_activity_type: 'INVOICE_CREATED',
        history_created_by: req.user_id,
        history_invoice_id: ti_invoice_id,
        history_invoice_payment_amount: ti_net_total,
        invoicelog_content: content,
      };

      await common_conn.insertInvoiceHistory(history_data);

      await this.insertAudit(req, 'create', content, user_id, 'INVOICES');

      return {
        success: true,
        message: 'Add Invoice fake info successfully',
        code: 201,
      };
    });
  };
  public delete = async (req: Request) => {
    const { invoice_id } = req.params as { invoice_id: string };

    const { user_id } = req;

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.invoiceAirticketModel(req, trx);

      await conn.deleteInvoiceInfo(invoice_id);
      await conn.deleteInvoiceInfoItems(invoice_id);

      await this.insertAudit(
        req,
        'create',
        'Invoice duplicate info created',
        user_id,
        'INVOICES'
      );

      return {
        success: true,
        message: 'Add Invoice info successfully',
        code: 201,
      };
    });
  };
}
export default AddInvoiceInfo;
