import { Request } from 'express';
import AbstractServices from '../../../../abstracts/abstract.services';
import AddInvoiceNonCommission from './narrowServices/addInvoiceNonCommission';
import DeleteNonComInvoice from './narrowServices/deleteInvoiceNonCom';
import EditInvoiceNonCommission from './narrowServices/editInvoiceNonCommission';

class InvoiceNonCommission extends AbstractServices {
  constructor() {
    super();
  }

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
      2,
      Number(page) || 1,
      Number(size) || 20,
      search,
      from_date,
      to_date
    );

    return {
      success: true,
      message: 'All Invoices Air Ticket Non Commission',
      ...data,
    };
  };

  // VIEW INVOICE NON COMMISSION
  public viewNonCommission = async (req: Request) => {
    const invoice_id = req.params.id;

    const common_conn = this.models.CommonInvoiceModel(req);
    const conn = this.models.invoiceNonCommission(req);

    const data = await common_conn.getViewInvoiceInfo(invoice_id);

    const airticket_information = await conn.getViewAirticketNonCom(invoice_id);

    const pax_details = await common_conn.getInvoiceAirTicketPaxDetails(
      invoice_id
    );

    const flights = await conn.getFlightDetails(invoice_id);

    const reissued = await common_conn.getReissuedItemByInvId(invoice_id);

    const refunds = await this.models
      .refundModel(req)
      .getAirticketRefundItems(invoice_id);

    return {
      success: true,
      data: {
        ...data,
        reissued,
        refunds,
        airticket_information,
        flights,
        pax_details,
      },
    };
  };

  public getDataForEdit = async (req: Request) => {
    const invoice_id = Number(req.params.invoice_id);
    const conn = this.models.invoiceNonCommission(req);
    const common_conn = this.models.CommonInvoiceModel(req);

    const invoice_info = await common_conn.getForEditInvoice(invoice_id);
    const airticketPrerequre = await common_conn.getAirticketPrerequire(
      invoice_id
    );

    const ticketInfo = await conn.getNonComTickets(invoice_id);

    return {
      success: true,
      data: {
        invoice_info: { ...invoice_info, ...airticketPrerequre },
        ticketInfo,
      },
    };
  };

  // ============= narrow services ==============
  public addInvoiceNonCommission = new AddInvoiceNonCommission()
    .addInvoiceNonCommission;
  public editInvoiceNonCommission = new EditInvoiceNonCommission()
    .editInvoiceNonCommission;
  public deleteNonComInvoice = new DeleteNonComInvoice().deleteNonComInvoice;
  public voidNonCommission = new DeleteNonComInvoice().voidNonCommission;
}

export default InvoiceNonCommission;
