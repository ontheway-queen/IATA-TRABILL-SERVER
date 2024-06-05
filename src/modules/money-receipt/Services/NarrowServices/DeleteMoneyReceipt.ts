import { Request } from 'express';
import AbstractServices from '../../../../abstracts/abstract.services';
import { InvoiceHistory } from '../../../../common/types/common.types';
import Trxns from '../../../../common/helpers/Trxns';

class DeleteMoneyReceipt extends AbstractServices {
  constructor() {
    super();
  }

  public deleteMoneyReceipt = async (req: Request) => {
    const receipt_id = Number(req.params.id);
    const { receipt_deleted_by } = req.body as { receipt_deleted_by: number };

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.MoneyReceiptModels(req, trx);
      const common_conn = this.models.CommonInvoiceModel(req, trx);
      const trxns = new Trxns(req, trx);

      const previousBillingData = await conn.getPreviousPaidAmount(receipt_id);

      await conn.deleteMoneyreceipt(receipt_id, receipt_deleted_by);

      await conn.deletePrevMoneyReceiptChequeInfo(
        receipt_id,
        receipt_deleted_by
      );

      await conn.deletePrevInvoiceClPay(receipt_id, receipt_deleted_by);

      if (previousBillingData) {
        const { prevClTrxn, prevCombClient, prevAccTrxnId } =
          previousBillingData;

        if (prevClTrxn) await trxns.deleteClTrxn(prevClTrxn, prevCombClient);

        if (previousBillingData?.receipt_trxn_charge_id) {
          await this.models
            .vendorModel(req, trx)
            .deleteOnlineTrxnCharge(
              previousBillingData?.receipt_trxn_charge_id
            );
        }

        if (prevAccTrxnId) await trxns.deleteAccTrxn(prevAccTrxnId);
      }

      // delete money receipt

      const invoice = await conn.getInvoicesByMoneyReceiptId(receipt_id);
      if (invoice?.invoice_id) {
        const history_data: InvoiceHistory = {
          history_activity_type: 'INVOICE_PAYMENT_DELETED',
          history_invoice_id: invoice.invoice_id,
          history_created_by: receipt_deleted_by,
          history_invoice_payment_amount: invoice.invoice_amount,
          invoicelog_content: `Payment deleted to Invoice (Amount = ${invoice.invoice_amount})/-`,
        };

        await common_conn.insertInvoiceHistory(history_data);
      }

      await this.insertAudit(
        req,
        'delete',
        `MONEY receipt has been deleted , mr-id:${receipt_id}`,
        receipt_deleted_by,
        'MONEY_RECEIPT'
      );

      return {
        success: true,
        data: 'Money receipt deleted successfully...',
      };
    });
  };
}

export default DeleteMoneyReceipt;
