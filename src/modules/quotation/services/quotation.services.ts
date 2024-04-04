import { Request } from 'express';
import AbstractServices from '../../../abstracts/abstract.services';
import Trxns from '../../../common/helpers/Trxns';
import { separateCombClientToId } from '../../../common/helpers/common.helper';
import InvoiceHelpers, {
  InvoiceClientAndVendorValidate,
  MoneyReceiptAmountIsValid,
  getClientOrCombId,
} from '../../../common/helpers/invoice.helpers';
import {
  IClTrxnBody,
  IVTrxn,
} from '../../../common/interfaces/Trxn.interfaces';
import CommonAddMoneyReceipt from '../../../common/services/CommonAddMoneyReceipt';
import {
  IInvoiceInfoDb,
  InvoiceExtraAmount,
} from '../../../common/types/Invoice.common.interface';
import { ICommonMoneyReceiptInvoiceData } from '../../../common/types/common.types';
import CustomError from '../../../common/utils/errors/customError';

import {
  IOtherBillingInfoDb,
  IQuotationInvoiceReq,
} from '../../invoices/invoice_other/types/invoiceOther.interface';
import {
  IQuotation,
  IQuotationReqBody,
  IReqBillInfo,
} from '../types/quotation.interfaces';
import QuotationHelper from '../utils/quotationHelper';

class QuotationServices extends AbstractServices {
  constructor() {
    super();
  }

  /**
   * Select product category
   */
  public products = async (req: Request) => {
    const conn = this.models.quotationModel(req);

    const products = await conn.products();

    return { success: true, data: products };
  };

  /**
   * Create quotation
   */

  public addQuotation = async (req: Request) => {
    const {
      client_id,
      q_number,
      date,
      bill_info,
      note,
      sub_total,
      discount,
      net_total,
      created_by,
    } = req.body as IQuotationReqBody;

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.quotationModel(req, trx);
      const { invoice_client_id, invoice_combined_id } =
        await getClientOrCombId(client_id);

      const quotationInfo: IQuotation = {
        quotation_client_id: invoice_client_id as number,
        quotation_combined_id: invoice_combined_id as number,
        quotation_no: q_number,
        quotation_date: date,
        quotation_note: note,
        quotation_discount_total: discount,
        quotation_net_total: net_total,
        quotation_created_by: created_by,
      };

      const quotationId = await conn.insertQuotation(quotationInfo);

      const billInfo = QuotationHelper.parseBillInfo(
        bill_info as IReqBillInfo[],
        sub_total,
        quotationId
      );

      await conn.insertBillInfo(billInfo);

      const message = `Quotation has been created`;
      await this.insertAudit(
        req,
        'create',
        message,
        created_by as number,
        'QUOTATION'
      );
      return {
        success: true,
        message: 'Quotation created successfully',
        data: { quotationId },
      };
    });
  };

  public allQuotations = async (req: Request) => {
    const { page, size, search, from_date, to_date } = req.query as {
      page: string;
      size: string;
      search: string;
      from_date: string;
      to_date: string;
    };

    const conn = this.models.quotationModel(req);

    const data = await conn.viewQuotations(
      Number(page) || 1,
      Number(size) || 20,
      search,
      from_date,
      to_date
    );

    return { success: true, ...data };
  };

  public singleQuotation = async (req: Request) => {
    const { quotation_id } = req.params;

    const conn = this.models.quotationModel(req);

    const data = await conn.viewQuotation(+quotation_id);

    return { success: true, data };
  };

  public confirmationQuotation = async (req: Request) => {
    const {
      invoice_net_total,
      invoice_combclient_id,
      invoice_created_by,
      invoice_note,
      invoice_sales_date,
      invoice_due_date,
      invoice_sales_man_id,
      invoice_sub_total,
      invoice_vat,
      invoice_service_charge,
      invoice_discount,
      invoice_agent_id,
      invoice_agent_com_amount,
      money_receipt,
      billing_information,
      invoice_reference,
    } = req.body as IQuotationInvoiceReq;

    const { invoice_total_profit, invoice_total_vendor_price } =
      await InvoiceClientAndVendorValidate(
        billing_information,
        invoice_combclient_id
      );

    MoneyReceiptAmountIsValid(money_receipt, invoice_net_total);

    const { invoice_client_id, invoice_combined_id } = await getClientOrCombId(
      invoice_combclient_id
    );

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.invoiceOtherModel(req, trx);
      const common_conn = this.models.CommonInvoiceModel(req, trx);
      const combined_conn = this.models.combineClientModel(req, trx);
      const qu_conn = this.models.quotationModel(req, trx);
      const trxns = new Trxns(req, trx);

      const quotationId = req.params.quotation_id;

      const invoice_no = await this.generateVoucher(req, 'QT');

      const clTrxnBody: IClTrxnBody = {
        ctrxn_type: 'DEBIT',
        ctrxn_amount: invoice_net_total,
        ctrxn_cl: invoice_combclient_id,
        ctrxn_voucher: invoice_no,
        ctrxn_particular_id: 145,
        ctrxn_created_at: invoice_sales_date,
        ctrxn_note: invoice_note,
        ctrxn_particular_type: 'quotation invoice',
      };

      const invoice_cltrxn_id = await trxns.clTrxnInsert(clTrxnBody);

      const invoieInfo: IInvoiceInfoDb = {
        invoice_client_id,
        invoice_combined_id,
        invoice_created_by,
        invoice_net_total,
        invoice_no: invoice_no as string,
        invoice_note,
        invoice_category_id: 5,
        invoice_sales_date,
        invoice_due_date,
        invoice_sales_man_id,
        invoice_sub_total,
        invoice_cltrxn_id,
        invoice_total_profit,
        invoice_total_vendor_price,
        invoice_reference,
      };

      const invoice_id = await common_conn.insertInvoicesInfo(invoieInfo);

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
        145,
        'QUOTATION'
      );

      const invoiceExtraAmount: InvoiceExtraAmount = {
        extra_amount_invoice_id: invoice_id,
        invoice_vat,
        invoice_service_charge,
        invoice_discount,
        invoice_agent_id,
        invoice_agent_com_amount,
      };

      await common_conn.insertInvoiceExtraAmount(invoiceExtraAmount);

      for (const billingInfo of billing_information) {
        const {
          billing_comvendor,
          billing_cost_price,
          billing_quantity,
          billing_product_id,
          billing_profit,
          billing_unit_price,
          pax_name,
          billing_description,
        } = billingInfo;

        const billing_subtotal = billing_unit_price * billing_quantity;

        const total_cost_price = Number(billing_cost_price) * billing_quantity;

        const { combined_id, vendor_id } =
          separateCombClientToId(billing_comvendor);

        const VTrxnBody: IVTrxn = {
          comb_vendor: billing_comvendor,
          vtrxn_amount: total_cost_price,
          vtrxn_created_at: invoice_sales_date,
          vtrxn_note: invoice_note,
          vtrxn_particular_id: 154,
          vtrxn_particular_type: 'Quotation inovice',
          vtrxn_type: 'DEBIT',
          vtrxn_user_id: invoice_created_by,
          vtrxn_voucher: invoice_no,
        };

        const billing_vtrxn_id = await trxns.VTrxnInsert(VTrxnBody);

        const billingInfoData: IOtherBillingInfoDb = {
          billing_invoice_id: invoice_id,
          billing_sales_date: invoice_sales_date,
          billing_remaining_quantity: billing_quantity,
          billing_vendor_id: vendor_id,
          billing_combined_id: combined_id,
          billing_cost_price,
          billing_quantity,
          billing_subtotal,
          billing_product_id,
          billing_profit,
          billing_unit_price,
          pax_name,
          billing_vtrxn_id,
          billing_description,
        };

        await conn.insertBillingInfo(billingInfoData);
      }

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

      await qu_conn.confirmQuotation(quotationId);

      await this.updateVoucher(req, 'QT');

      const message = `Invoice quotation has been created`;

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

  public billInfos = async (req: Request) => {
    const { quotation_id } = req.params;

    const conn = this.models.quotationModel(req);

    const data = await conn.viewBillInfos(+quotation_id);

    return { success: true, data };
  };

  public editQuotation = async (req: Request) => {
    const { quotation_id } = req.params;

    const {
      client_id,
      q_number,
      date,
      bill_info,
      note,
      sub_total,
      discount,
      net_total,
      updated_by,
    } = req.body as IQuotationReqBody;

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.quotationModel(req, trx);
      const { invoice_client_id, invoice_combined_id } =
        await getClientOrCombId(client_id);

      const quotationInfo: IQuotation = {
        quotation_client_id: invoice_client_id as number,
        quotation_combined_id: invoice_combined_id as number,
        quotation_no: q_number,
        quotation_date: date,
        quotation_note: note,
        quotation_discount_total: discount,
        quotation_net_total: net_total,
        quotation_updated_by: updated_by,
      };

      await conn.updateQuotation(+quotation_id, quotationInfo);
      const billInfo = QuotationHelper.parseBillInfo(
        bill_info as IReqBillInfo[],
        sub_total,
        +quotation_id
      );

      await conn.deleteBillInfo(+quotation_id, updated_by as number);

      await conn.insertBillInfo(billInfo);

      const message = `Quotation has been updated`;
      await this.insertAudit(
        req,
        'update',
        message,
        updated_by as number,
        'QUOTATION'
      );
      return {
        success: true,
        message: 'Quotation edited successfully',
      };
    });
  };

  public deleteQuotation = async (req: Request) => {
    const { quotation_id } = req.params;

    const { quotation_deleted_by } = req.body;

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.quotationModel(req, trx);

      const deleted = await conn.deleteQuotation(
        +quotation_id,
        quotation_deleted_by
      );

      if (!deleted) {
        throw new CustomError(
          'Please provide a valid id to delete a quotation',
          400,
          'Invalid quotation id'
        );
      }

      await conn.deleteBillInfo(+quotation_id, quotation_deleted_by);

      const message = `Quotation has been deleted`;
      await this.insertAudit(
        req,
        'delete',
        message,
        quotation_deleted_by as number,
        'QUOTATION'
      );

      return {
        success: true,
        message: 'Quotation deleted successfull',
      };
    });
  };
}

export default QuotationServices;
