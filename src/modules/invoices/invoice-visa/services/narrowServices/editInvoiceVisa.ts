import { Request } from 'express';
import AbstractServices from '../../../../../abstracts/abstract.services';
import InvoiceHelpers, {
  getClientOrCombId,
  ValidateClientAndVendor,
} from '../../../../../common/helpers/invoice.helpers';
import Trxns from '../../../../../common/helpers/Trxns';
import { IClTrxnBody } from '../../../../../common/interfaces/Trxn.interfaces';
import { InvoiceHistory } from '../../../../../common/types/common.types';
import {
  InvoiceExtraAmount,
  IUpdateInvoiceInfoDb,
} from '../../../../../common/types/Invoice.common.interface';
import {
  ICommonVisaData,
  InvoiceVisaReq,
} from '../../types/invoiceVisa.interface';
import InsertVisaBilling from '../commonServices/InsertVisaBilling';

class EditInvoiceVisa extends AbstractServices {
  constructor() {
    super();
  }

  public editInvoiceVisa = async (req: Request) => {
    const invoice_id = req.params.invoice_id as number | string;

    const {
      invoice_sales_man_id,
      invoice_sub_total,
      invoice_created_by,
      invoice_net_total,
      invoice_discount,
      invoice_vat,
      invoice_service_charge,
      invoice_agent_id,
      invoice_agent_com_amount,
      invoice_combclient_id,
      invoice_sales_date,
      invoice_due_date,
      invoice_note,
      billing_information,
      invoice_no,
      invoice_reference,
      passport_information,
    } = req.body as InvoiceVisaReq;

    const { invoice_client_id, invoice_combined_id } = await getClientOrCombId(
      invoice_combclient_id
    );

    return await this.models.db.transaction(async (trx) => {
      const common_conn = this.models.CommonInvoiceModel(req, trx);
      const trxns = new Trxns(req, trx);


      let invoice_total_profit = 0;
      let invoice_total_vendor_price = 0;

      for (const item of billing_information) {
        invoice_total_profit += item.billing_profit;
        invoice_total_vendor_price += (item.billing_cost_price * item.billing_quantity);

      }

      let ctrxn_pax_name = null;

      if (passport_information.length) {
        const passport_id = passport_information.map(
          (item) => item.passport_id
        );

        ctrxn_pax_name = await common_conn.getPassportName(
          passport_id as number[]
        );
      }

      let approvedSum = 0;
      billing_information.forEach((item) => {
        if (item.billing_status === 'Approved' && item.is_deleted !== 1) {
          approvedSum += item.billing_subtotal;
        }
      });

      if (approvedSum && approvedSum > 0) {
        const { prevCtrxnId } = await common_conn.getPreviousInvoices(
          invoice_id
        );

        const clTrxnBody: IClTrxnBody = {
          ctrxn_type: 'DEBIT',
          ctrxn_amount: invoice_net_total,
          ctrxn_cl: invoice_combclient_id,
          ctrxn_voucher: invoice_no,
          ctrxn_particular_id: prevCtrxnId ? 96 : 97,
          ctrxn_created_at: invoice_sales_date,
          ctrxn_note: invoice_note,
          ctrxn_particular_type: prevCtrxnId
            ? 'Invoice visa update'
            : 'Invoice visa create',
          ctrxn_user_id: invoice_created_by,
          ctrxn_pax: ctrxn_pax_name,
        };

        if (prevCtrxnId) {
          await trxns.clTrxnUpdate({
            ...clTrxnBody,
            ctrxn_trxn_id: prevCtrxnId,
          });
        } else {
          const client_trxn_id = await trxns.clTrxnInsert(clTrxnBody);

          await common_conn.updateInvoiceClTrxn(client_trxn_id, invoice_id);
        }

        if (invoice_agent_id) {
          // AGENT TRANSACTION
          await InvoiceHelpers.invoiceAgentTransactions(
            this.models.agentProfileModel(req, trx),
            req.agency_id,
            invoice_agent_id,
            invoice_id,
            invoice_no,
            invoice_created_by,
            invoice_agent_com_amount,
            'UPDATE',
            97,
            'INVOICE VISA'
          );
        } else {
          await InvoiceHelpers.deleteAgentTransactions(
            this.models.agentProfileModel(req, trx),
            invoice_id,
            invoice_created_by
          );
        }
      }

      // INVOICE INFORMATION UPDATE
      const invoice_information: IUpdateInvoiceInfoDb = {
        invoice_client_id,
        invoice_sub_total,
        invoice_sales_man_id,
        invoice_net_total,
        invoice_sales_date,
        invoice_due_date,
        invoice_updated_by: invoice_created_by,
        invoice_note,
        invoice_combined_id,
        invoice_reference,
        invoice_total_profit,
        invoice_total_vendor_price
      };
      await common_conn.updateInvoiceInformation(
        invoice_id,
        invoice_information
      );

      const invoiceExtraAmount: InvoiceExtraAmount = {
        extra_amount_invoice_id: invoice_id as number,
        invoice_vat,
        invoice_service_charge,
        invoice_discount,
        invoice_agent_id,
        invoice_agent_com_amount,
      };
      await common_conn.updateInvoiceExtraAmount(
        invoiceExtraAmount,
        invoice_id
      );

      const commonVisaData: ICommonVisaData = {
        invoice_client_id,
        invoice_combined_id,
        invoice_created_by,
        invoice_id: invoice_id as number,
      };
      await new InsertVisaBilling().insertVisaBilling(
        req,
        commonVisaData,
        ctrxn_pax_name as string,
        trx
      );

      // Invoice history
      const history_data: InvoiceHistory = {
        history_activity_type: 'INVOICE_UPDATED',
        history_invoice_id: invoice_id,
        history_invoice_payment_amount: invoice_net_total,
        history_created_by: invoice_created_by,
        invoicelog_content: 'Invoice visa has been updated',
      };

      await common_conn.insertInvoiceHistory(history_data);

      await this.insertAudit(
        req,
        'update',
        `Invoice visa has been updated, Voucher - ${invoice_no}, Net - ${invoice_net_total}/-`,
        invoice_created_by,
        'INVOICES'
      );

      return {
        success: true,
        message: 'Invoice visa has been updated',
      };
    });
  };
}

export default EditInvoiceVisa;
