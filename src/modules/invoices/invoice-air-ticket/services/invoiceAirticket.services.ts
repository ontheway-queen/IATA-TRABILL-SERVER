import axios from 'axios';
import { Request } from 'express';
import AbstractServices from '../../../../abstracts/abstract.services';
import { idType } from '../../../../common/types/common.types';
import CustomError from '../../../../common/utils/errors/customError';
import AddInvoiceAirticket from './narrowServices/addInvoiceAirticket';
import AirTicketTaxRefund from './narrowServices/air_ticket_tax_refund';
import DeleteAirTicket from './narrowServices/deleteAirTicket';
import EditInvoiceAirticket from './narrowServices/editInvoiceAirticket';
import SendMail from './narrowServices/sendMail.services';
import VoidInvoice from './narrowServices/void_invoice';

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
  public voidInvoiceAirticket = new VoidInvoice().voidInvoice;
  public addAirTicketTax = new AirTicketTaxRefund().addAirTicketTax;

  public sendEmail = new SendMail().sendEmail;
}

export default InvoiceAirticketService;
