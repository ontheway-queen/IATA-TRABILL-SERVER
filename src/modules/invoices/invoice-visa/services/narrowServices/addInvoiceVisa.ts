import { Request } from 'express';
import AbstractServices from '../../../../../abstracts/abstract.services';
import InvoiceHelpers, {
  getClientOrCombId,
  MoneyReceiptAmountIsValid,
} from '../../../../../common/helpers/invoice.helpers';
import Trxns from '../../../../../common/helpers/Trxns';
import CommonAddMoneyReceipt from '../../../../../common/services/CommonAddMoneyReceipt';
import {
  ICommonMoneyReceiptInvoiceData,
  InvoiceHistory,
} from '../../../../../common/types/common.types';
import {
  IInvoiceInfoDb,
  InvoiceExtraAmount,
} from '../../../../../common/types/Invoice.common.interface';
import { smsInvoiceData } from '../../../../smsSystem/types/sms.types';
import CommonSmsSendServices from '../../../../smsSystem/utils/CommonSmsSend.services';
import { InvoiceUtils } from '../../../utils/invoice.utils';
import {
  ICommonVisaData,
  InvoiceVisaReq,
} from '../../types/invoiceVisa.interface';
import InsertVisaBilling from '../commonServices/InsertVisaBilling';

class AddInvoiceVisa extends AbstractServices {
  constructor() {
    super();
  }

  public addInvoiceVisa = async (req: Request) => {
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
      money_receipt,
      passport_information,
      invoice_reference,
      billing_information,
    } = req.body as InvoiceVisaReq;

    MoneyReceiptAmountIsValid(money_receipt, invoice_net_total);

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
        invoice_total_vendor_price +=
          Number(item.billing_cost_price || 0) *
          Number(item.billing_quantity | 0);
      }

      if (passport_information.length) {
        const passport_id = passport_information.map(
          (item) => item.passport_id
        );
      }

      const invoice_no = await this.generateVoucher(req, 'IV');

      let approvedSum = 0;

      billing_information.forEach((item) => {
        if (item.billing_status === 'Approved') {
          approvedSum += item.billing_subtotal;
        }
      });

      let invoice_cltrxn_id: number | null = null;
      let invoice_discount_cltrxn_id: number | null = null;

      const productsIds = billing_information.map(
        (item) => item.billing_product_id
      );

      let note = '';

      if (productsIds.length) {
        note = await common_conn.getProductsName(productsIds);
      }

      if (approvedSum && approvedSum > 0) {
        // CLIENT TRANSACTIONS
        const utils = new InvoiceUtils(req.body, common_conn);
        const clientTransId = await utils.clientTrans(trxns, {
          tr_type: 9,
          dis_tr_type: 10,
          invoice_no,
          note,
        });
        invoice_cltrxn_id = clientTransId.invoice_cltrxn_id;
        invoice_discount_cltrxn_id = clientTransId.invoice_discount_cltrxn_id;
      }

      const invoice_information: IInvoiceInfoDb = {
        invoice_cltrxn_id,
        invoice_discount_cltrxn_id,
        invoice_client_id,
        invoice_no: invoice_no as string,
        invoice_sub_total,
        invoice_category_id: 10,
        invoice_sales_man_id,
        invoice_net_total,
        invoice_combined_id,
        invoice_sales_date,
        invoice_due_date,
        invoice_created_by,
        invoice_note,
        invoice_reference,
        invoice_total_profit,
        invoice_total_vendor_price,
      };

      const invoice_id = await common_conn.insertInvoicesInfo(
        invoice_information
      );

      // AGENT COMMISSION
      if (billing_information) {
        // AGENT TRANSACTION
        await InvoiceHelpers.invoiceAgentTransactions(
          this.models.agentProfileModel(req, trx),
          req.agency_id,
          invoice_agent_id,
          invoice_id,
          invoice_no,
          invoice_created_by,
          invoice_agent_com_amount,
          'CREATE',
          96,
          'INVOICE VISA'
        );
      }

      const invoiceExtraAmount: InvoiceExtraAmount = {
        extra_amount_invoice_id: invoice_id,
        invoice_vat,
        invoice_service_charge,
        invoice_discount,
        invoice_agent_id,
        invoice_agent_com_amount,
      };
      await common_conn.insertInvoiceExtraAmount(invoiceExtraAmount);

      const commonVisaData: ICommonVisaData = {
        invoice_client_id,
        invoice_combined_id,
        invoice_created_by,
        invoice_id,
      };
      await new InsertVisaBilling().insertVisaBilling(req, commonVisaData, trx);

      // MONEY RECEIPT
      const moneyReceiptInvoice: ICommonMoneyReceiptInvoiceData = {
        invoice_client_id,
        invoice_combined_id,
        invoice_created_by,
        invoice_id,
      };

      await new CommonAddMoneyReceipt().commonAddMoneyReceipt(
        req,
        moneyReceiptInvoice,
        trx
      );

      // INVOICE HISTORY
      const history_data: InvoiceHistory = {
        history_activity_type: 'INVOICE_CREATED',
        history_created_by: invoice_created_by,
        history_invoice_id: invoice_id,
        history_invoice_payment_amount: invoice_net_total,
        invoicelog_content: 'Invoice visa has been created',
      };

      await common_conn.insertInvoiceHistory(history_data);

      await this.updateVoucher(req, 'IV');

      const smsInvoiceDate: smsInvoiceData = {
        invoice_client_id: invoice_client_id as number,
        invoice_combined_id: invoice_combined_id as number,
        invoice_sales_date,
        invoice_created_by,
        invoice_id,
      };

      await new CommonSmsSendServices().sendSms(req, smsInvoiceDate, trx);

      const message = `Invoice visa has been created, Voucher - ${invoice_no}, Net - ${invoice_net_total}/-`;

      await this.insertAudit(
        req,
        'create',
        message,
        invoice_created_by,
        'INVOICES'
      );

      return {
        success: true,
        message,
        data: { invoice_id },
      };
    });
  };
}

export default AddInvoiceVisa;
