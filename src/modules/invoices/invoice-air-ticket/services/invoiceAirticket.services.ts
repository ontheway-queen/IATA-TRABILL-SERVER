import axios from 'axios';
import { Request } from 'express';
import AbstractServices from '../../../../abstracts/abstract.services';
import Trxns from '../../../../common/helpers/Trxns';
import { separateCombClientToId } from '../../../../common/helpers/common.helper';
import {
  IAcTrxn,
  IClTrxnBody,
  IVTrxn,
} from '../../../../common/interfaces/Trxn.interfaces';
import { idType } from '../../../../common/types/common.types';
import CustomError from '../../../../common/utils/errors/customError';
import { getPaymentType } from '../../../../common/utils/libraries/lib';
import {
  IAirTicketTaxRefund,
  IAirTicketTaxRefundBody,
  IAirTicketTaxRefundItem,
} from '../types/invoiceAirticket.interface';
import AddInvoiceAirticket from './narrowServices/addInvoiceAirticket';
import DeleteAirTicket from './narrowServices/deleteAirTicket';
import EditInvoiceAirticket from './narrowServices/editInvoiceAirticket';
import SendMail from './narrowServices/sendMail.services';

class InvoiceAirticketService extends AbstractServices {
  constructor() {
    super();
  }

  // GET PNR DETAILS
  pnrDetails = async (req: Request) => {
    const pnrId = req.params.pnr;

    const apiUrl = `http://192.168.0.235:9008/api/v1/btob/flight/booking-details/${pnrId}`;

    try {
      const response = await axios.get(apiUrl);

      const data = response.data;

      if (data.success) {
        return data;
      }
      return { success: true, data: [] };
    } catch (error: any) {
      throw new CustomError('PNR details not found!', 404, error.message);
    }
  };

  public getAllInvoices = async (req: Request) => {
    const { page, size, search, from_date, to_date } = req.query as {
      page: string;
      size: string;
      search: string;
      from_date: string;
      to_date: string;
    };

    const conn = this.models.CommonInvoiceModel(req);

    const data = await conn.getAllInvoices(
      1,
      Number(page) || 1,
      Number(size) || 20,
      search,
      from_date,
      to_date
    );

    return {
      success: true,
      message: 'All Invoices Airticket',
      ...data,
    };
  };

  // get data for edit
  public getDataForEdit = async (req: Request) => {
    const invoice_id = Number(req.params.invoice_id);
    const conn = this.models.invoiceAirticketModel(req);
    const common_conn = this.models.CommonInvoiceModel(req);

    const invoice_info = await common_conn.getForEditInvoice(invoice_id);

    const airticketPrerequre = await common_conn.getAirticketPrerequire(
      invoice_id
    );

    const ticketInfo = await conn.getAirticketItems(invoice_id);

    return {
      success: true,
      data: {
        invoice_info: { ...invoice_info, ...airticketPrerequre },
        ticketInfo,
      },
    };
  };

  // VIEW INVOICE AIR TICKET BY:ID
  public viewCommonInvoiceDetails = async (req: Request) => {
    const invoice_id = req.params.invoice_id;
    const conn = this.models.invoiceAirticketModel(req);
    const common_conn = this.models.CommonInvoiceModel(req);

    const data = await common_conn.getViewInvoiceInfo(invoice_id);

    const pax_details = await common_conn.getInvoiceAirTicketPaxDetails(
      invoice_id
    );

    const flights = await conn.getAirTicketFlights(invoice_id);

    const airticket_information = await conn.getViewAirticketItems(invoice_id);
    const taxes_commission = await conn.selectAirTicketAirlineCommissions(
      invoice_id
    );
    const reissued = await common_conn.getReissuedItemByInvId(invoice_id);

    const refunds = await this.models
      .refundModel(req)
      .getAirticketRefundItems(invoice_id);

    const tax_refund = await conn.viewAirTicketTaxRefund(invoice_id);

    return {
      success: true,
      data: {
        ...data,
        reissued,
        refunds,
        pax_details,
        flights,
        airticket_information,
        tax_refund,
        taxes_commission,
      },
    };
  };

  public getClientDue = async (req: Request) => {
    const data = await this.models
      .CommonInvoiceModel(req)
      .getClientDue(req.params.id);
    return {
      success: true,
      data,
    };
  };

  public getAllInvoicesNumAndId = async (req: Request) => {
    const common_conn = this.models.CommonInvoiceModel(req);

    const data = await common_conn.getAllInvoiceNomAndId();

    return {
      success: true,
      data,
    };
  };

  public getInvoiceAcitivity = async (req: Request) => {
    const id = Number(req.params.id);

    const data = await this.models
      .invoiceAirticketModel(req)
      .getInvoiceActivity(id);

    return { success: true, data };
  };

  public isTicketAlreadyExist = async (req: Request) => {
    const ticket = req.params.ticket;
    const data = await this.models
      .invoiceAirticketModel(req)
      .isTicketNumberExist(ticket);

    return {
      success: true,
      data,
      message: data ? 'Ticket already exist' : 'Ticket no. is unique',
    };
  };

  // AIR TICKET CUSTOM REPORT
  airTicketCustomReport = async (req: Request) => {
    const body = req.body as { fields: { key: string; level: string }[] };
    const { page, size, from_date, to_date } = req.query as {
      page: idType;
      size: idType;
      from_date: string;
      to_date: string;
    };
    const conn = this.models.invoiceAirticketModel(req);

    const fieldKays = body.fields.map((item) => item.key);

    const data = await conn.selectCustomAirTicketReport(
      fieldKays,
      page,
      size,
      from_date,
      to_date
    );
    const count = await conn.selectCustomAirTicketReportCount(
      from_date,
      to_date
    );

    return { success: true, message: 'Air ticket custom report', count, data };
  };

  // AIR TICKET TAX REFUND
  selectAirTicketTax = async (req: Request) => {
    const conn = this.models.invoiceAirticketModel(req);

    const invoiceId = req.params.invoice_id;

    const data = await conn.selectAirTicketTax(invoiceId);

    return { success: true, data };
  };

  addAirTicketTax = async (req: Request) => {
    const {
      refund_invoice_id,
      comb_client,
      ticket_info,
      client_refund_type,
      vendor_refund_type,
      client_pay_type,
      vendor_pay_type,
      client_account_id,
      vendor_account_id,
      client_total_tax_refund,
      vendor_total_tax_refund,
      refund_date,
    } = req.body as IAirTicketTaxRefundBody;

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.invoiceAirticketModel(req, trx);
      const trxns = new Trxns(req, trx);

      const { client_id, combined_id } = separateCombClientToId(comb_client);

      let refund_c_trxn_id = null;
      let client_account_trxn_id = null;
      let vendor_account_trxn_id = null;
      const clAccPayType = getPaymentType(client_pay_type);
      const VAccPayType = getPaymentType(vendor_pay_type);

      // CLIENT TRANSACTION
      if (client_refund_type === 'Adjust') {
        const clTrxnBody: IClTrxnBody = {
          ctrxn_type: 'CREDIT',
          ctrxn_amount: client_total_tax_refund,
          ctrxn_cl: comb_client,
          ctrxn_particular_id: 108,
          ctrxn_created_at: refund_date,
          ctrxn_note: '',
          ctrxn_particular_type: 'AIR TICKET TAX REFUND',
          ctrxn_user_id: req.user_id,
          ctrxn_pay_type: clAccPayType,
        };

        refund_c_trxn_id = await trxns.clTrxnInsert(clTrxnBody);
      } else {
        const ACTrxnBody: IAcTrxn = {
          acctrxn_ac_id: client_account_id,
          acctrxn_type: 'DEBIT',
          acctrxn_amount: client_total_tax_refund,
          acctrxn_created_at: refund_date,
          acctrxn_created_by: req.user_id,
          acctrxn_note: 'Client Refund',
          acctrxn_particular_id: 108,
          acctrxn_particular_type: 'AIR TICKET TAX REFUND',
          acctrxn_pay_type: clAccPayType,
        };

        client_account_trxn_id = await trxns.AccTrxnInsert(ACTrxnBody);

        const clTrxnBody: IClTrxnBody = {
          ctrxn_type: 'CREDIT',
          ctrxn_amount: 0,
          ctrxn_cl: comb_client,
          ctrxn_particular_id: 108,
          ctrxn_created_at: refund_date,
          ctrxn_note: `Money return : ${client_total_tax_refund}/-`,
          ctrxn_particular_type: 'AIR TICKET TAX REFUND',
          ctrxn_user_id: req.user_id,
          ctrxn_pay_type: clAccPayType,
        };

        refund_c_trxn_id = await trxns.clTrxnInsert(clTrxnBody);
      }

      // ACCOUNT TRANSACTION FOR VENDOR
      if (vendor_refund_type === 'Return') {
        const ACTrxnBody: IAcTrxn = {
          acctrxn_ac_id: vendor_account_id,
          acctrxn_type: 'CREDIT',
          acctrxn_amount: vendor_total_tax_refund,
          acctrxn_created_at: refund_date,
          acctrxn_created_by: req.user_id,
          acctrxn_note: 'Vendor Refund',
          acctrxn_particular_id: 108,
          acctrxn_particular_type: 'AIR TICKET TAX REFUND',
          acctrxn_pay_type: VAccPayType,
        };

        vendor_account_trxn_id = await trxns.AccTrxnInsert(ACTrxnBody);
      }

      const refundData: IAirTicketTaxRefund = {
        refund_invoice_id,
        refund_agency_id: req.agency_id,
        refund_client_id: client_id,
        refund_combined_id: combined_id,
        refund_c_trxn_id,
        client_refund_type,
        vendor_refund_type,
        client_pay_type,
        vendor_pay_type,
        client_account_id,
        vendor_account_id,
        client_account_trxn_id,
        vendor_account_trxn_id,
        client_total_tax_refund,
        vendor_total_tax_refund,
      };

      const refund_id = await conn.insertAirTicketTaxRefund(refundData);

      // VENDOR TRANSACTION

      for (const item of ticket_info) {
        const { vendor_id, combined_id } = separateCombClientToId(
          item.comb_vendor
        );

        const VTrxnBody: IVTrxn = {
          comb_vendor: item.comb_vendor,
          vtrxn_amount:
            vendor_refund_type === 'Adjust' ? item.refund_tax_amount : 0,
          vtrxn_created_at: refund_date,
          vtrxn_note:
            vendor_refund_type === 'Adjust'
              ? ''
              : `Money return : ${item.refund_tax_amount}/-`,
          vtrxn_particular_id: 108,
          vtrxn_particular_type: 'AIR TICKET TAX REFUND',
          vtrxn_type: 'CREDIT',
          vtrxn_user_id: req.user_id,
        };

        const refund_v_trxn_id = await trxns.VTrxnInsert(VTrxnBody);

        const refundItemData: IAirTicketTaxRefundItem = {
          refund_airticket_id: item.airticket_id,
          refund_combined_id: combined_id,
          refund_id,
          refund_tax_amount: item.refund_tax_amount,
          refund_vendor_id: vendor_id,
          refund_v_trxn_id,
        };

        await conn.insertAirTicketTaxRefundItem(refundItemData);

        // update air ticket refund
        await conn.updateAirTicketItemRefund(item.airticket_id);
      }

      // UPDATE INVOICE REFUND
      await conn.updateInvoiceRefund(refund_invoice_id);

      return { success: true, msg: 'Invoice air ticket tax refunded!' };
    });
  };

  public getInvoiceInfoForVoid = async (req: Request) => {
    const { invoice_id } = req.params as { invoice_id: string };

    const conn = this.models.invoiceAirticketModel(req);

    const data = await conn.getInvoiceInfoForVoid(invoice_id);

    return {
      success: true,
      data,
    };
  };

  // ============= narrow services ==============
  public addInvoiceAirticket = new AddInvoiceAirticket().addInvoiceAirTicket;
  public editInvoiceAirticket = new EditInvoiceAirticket().editInvoiceAirTicket;
  public deleteInvoiceAirTicket = new DeleteAirTicket().deleteAirTicket;
  public voidInvoiceAirticket = new DeleteAirTicket().voidInvoice;

  public sendEmail = new SendMail().sendEmail;
}

export default InvoiceAirticketService;
