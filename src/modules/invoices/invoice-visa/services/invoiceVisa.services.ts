import dayjs from 'dayjs';
import { Request } from 'express';
import AbstractServices from '../../../../abstracts/abstract.services';
import Trxns from '../../../../common/helpers/Trxns';
import {
  IClTrxnBody,
  IClTrxnUpdate,
  IVTrxn,
} from '../../../../common/interfaces/Trxn.interfaces';
import CustomError from '../../../../common/utils/errors/customError';
import AddInvoiceVisa from './narrowServices/addInvoiceVisa';
import DeleteInvoiceVisa from './narrowServices/deleteinvoicevisa.services';
import EditInvoiceVisa from './narrowServices/editInvoiceVisa';

class InvoiceVisaServices extends AbstractServices {
  constructor() {
    super();
  }

  public getListOfInvoiceVisa = async (req: Request) => {
    const { page, size, search, from_date, to_date } = req.query as {
      page: string;
      size: string;
      search: string;
      from_date: string;
      to_date: string;
    };

    const conn = this.models.invoiceVisaModel(req);

    const data = await conn.getAllInvoiceVisa(
      Number(page) || 1,
      Number(size) || 20,
      search,
      from_date,
      to_date
    );

    return {
      success: true,
      message: 'All Invoices Visa',
      ...data,
    };
  };

  public getForEdit = async (req: Request) => {
    const invoice_id = req.params.invoice_id;

    const conn = this.models.invoiceVisaModel(req);
    const common_conn = this.models.CommonInvoiceModel(req);

    const invoice = await common_conn.getForEditInvoice(invoice_id);

    const billing_information = await conn.getBillingInfo(invoice_id);

    const data = { invoice, billing_information, passportInfo: [] };

    const passportInfo = await conn.getVisaPassport(invoice_id);

    return {
      success: true,
      message: 'invoice visa',
      data: {
        ...data,
        passportInfo,
      },
    };
  };

  updateBillingStatus = async (req: Request) => {
    const billing_id = req.params.billing_id;
    const status = req.query.status as 'Approved' | 'Rejected';
    const { created_by } = req.body as { created_by: number };

    const isApproved = status === 'Approved' ? true : false;

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.invoiceVisaModel(req, trx);
      const trxns = new Trxns(req, trx);

      const common_conn = this.models.CommonInvoiceModel(req, trx);

      const prevBillingInfo = await conn.getPrevBilling(billing_id);

      for (const billing of prevBillingInfo) {
        if (!billing.combined_id && !billing.vendor_id) {
          throw new CustomError(
            'Invoice visa cannot update without vendor!',
            400,
            'Bad Request'
          );
        }
      }

      if (prevBillingInfo[0].billing_status === 'Approved') {
        throw new CustomError(
          'Approved visa cannot edit or update!',
          400,
          'Bad Request'
        );
      }

      const [billing_info] = await conn.getPrevBillingByBillingId(billing_id);

      const {
        combined_id,
        prev_cost_price,
        vendor_id,
        invoice_sales_date,
        prev_sales_price,
        comb_client,
        comb_vendor,
        invoice_id,
      } = billing_info;

      const { prevCtrxnId, prevInvoiceNo, prevInvoiceNote } =
        await common_conn.getPreviousInvoices(invoice_id);

      const approvedAmount = await conn.getPrevBillingApprovedAmount(
        invoice_id
      );

      await this.insertAudit(
        req,
        'update',
        `Invoice visa status updated as ${status}`,
        created_by,
        'INVOICES'
      );

      if (isApproved) {
        if (!prevCtrxnId) {
          const clTrxnBody: IClTrxnBody = {
            ctrxn_type: 'DEBIT',
            ctrxn_amount: prev_sales_price,
            ctrxn_cl: comb_client,
            ctrxn_voucher: prevInvoiceNo,
            ctrxn_particular_id: 96,
            ctrxn_created_at: dayjs().format('YYYY-MM-DD'),
            ctrxn_note: prevInvoiceNote,
            ctrxn_particular_type: 'invoice visa ',
          };

          const invoice_cltrxn_id = await trxns.clTrxnInsert(clTrxnBody);

          await conn.updateInvoiceClientTrxn(invoice_cltrxn_id, invoice_id);
        } else {
          const clTrxnBody: IClTrxnUpdate = {
            ctrxn_type: 'DEBIT',
            ctrxn_amount: approvedAmount + prev_sales_price,
            ctrxn_cl: comb_client,
            ctrxn_voucher: prevInvoiceNo,
            ctrxn_particular_id: 97,
            ctrxn_created_at: invoice_sales_date,
            ctrxn_note: prevInvoiceNote,
            ctrxn_particular_type: 'invoice visa',
            ctrxn_trxn_id: prevCtrxnId,
          };

          await trxns.clTrxnUpdate(clTrxnBody);
        }
        let billing_vtrxn_id = null;

        // VENDOR TRANSACTIIONS

        const VTrxnBody: IVTrxn = {
          comb_vendor: comb_vendor,
          vtrxn_amount: prev_cost_price,
          vtrxn_created_at: invoice_sales_date,
          vtrxn_note: prevInvoiceNote,
          vtrxn_particular_id: 149,
          vtrxn_particular_type: 'Invoice visa',
          vtrxn_type: combined_id ? 'CREDIT' : 'DEBIT',
          vtrxn_user_id: created_by,
          vtrxn_voucher: prevInvoiceNo,
        };

        billing_vtrxn_id = await trxns.VTrxnInsert(VTrxnBody);

        await conn.updateBillingStatus(status, billing_vtrxn_id, billing_id);

        return { success: true, message: 'Invoice visa has been approved' };
      } else {
        await conn.updateBillingStatus(status, null, billing_id);
        return { success: true, message: 'Invoice visa has been rejected' };
      }
    });
  };

  public viewInvoiceVisa = async (req: Request) => {
    const invoice_id = req.params.invoice_id;
    const common_conn = this.models.CommonInvoiceModel(req);
    const conn = this.models.invoiceVisaModel(req);

    // INVOICE DATA
    const invoice = await common_conn.getViewInvoiceInfo(invoice_id);

    const passport_information = await conn.getPassportInfo(invoice_id);

    const billing_information = await conn.getViewBillingInfo(invoice_id);

    return {
      success: true,
      data: { ...invoice, passport_information, billing_information },
    };
  };

  // ============= narrow services ==============

  public addInvoiceVisa = new AddInvoiceVisa().addInvoiceVisa;
  public editInvoiceVisa = new EditInvoiceVisa().editInvoiceVisa;
  public deleteInvoiceVisa = new DeleteInvoiceVisa().deleteInvoiceVisa;
  public voidInvoiceVisa = new DeleteInvoiceVisa().voidInvoiceVisa;
}

export default InvoiceVisaServices;
