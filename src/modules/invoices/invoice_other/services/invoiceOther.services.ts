import { Request } from 'express';
import AbstractServices from '../../../../abstracts/abstract.services';
import AddInvoiceOther from './narrowServices/addInvoiceOther';
import DeleteInvoiceOtehr from './narrowServices/deleteInvoiceOther';
import EditInvoiceOther from './narrowServices/editInvoiceOther';

class InivoiceOther extends AbstractServices {
  constructor() {
    super();
  }

  // GET ALL
  getAllInvoiceOther = async (req: Request) => {
    const { page, size, search, from_date, to_date } = req.query as {
      page: string;
      size: string;
      search: string;
      from_date: string;
      to_date: string;
    };

    const conn = this.models.invoiceOtherModel(req);

    const data = await conn.getAllInvoiceOtherList(
      search,
      from_date,
      to_date,
      Number(page),
      size
    );

    return {
      success: true,
      message: 'All invoices others',
      ...data,
    };
  };

  // VIEW INVOICE OTHERS
  public viewInvoiceOther = async (req: Request) => {
    const invoice_id = req.params.id;
    const conn = this.models.invoiceOtherModel(req);
    const common_conn = this.models.CommonInvoiceModel(req);

    const invoice = await common_conn.getViewInvoiceInfo(invoice_id);

    const passport_information = await conn.getInvoiceOtherPassInfo(invoice_id);
    const ticket_information = await conn.getInvoiceTicketInfo(invoice_id);
    const hotel_information = await conn.getInvoiceHotelInfo(invoice_id);
    const transport_information = await conn.getInvoiceTransportInfo(
      invoice_id
    );
    const billing_information = await conn.getInvoiceBillingInfo(invoice_id);

    const refunds = await this.models
      .refundModel(req)
      .getOtherRefundItems(invoice_id);

    return {
      success: true,
      data: {
        ...invoice,
        refunds,
        passport_information,
        ticket_information,
        hotel_information,
        transport_information,
        billing_information,
      },
    };
  };

  public getTransportType = async (req: Request) => {
    const conn = this.models.invoiceOtherModel(req);
    const data = await conn.getTransportType();

    return { success: true, data };
  };

  public getForEdit = async (req: Request) => {
    const invoice_id = req.params.id;

    const conn = this.models.invoiceOtherModel(req);
    const common_conn = this.models.CommonInvoiceModel(req);

    const invoice = await common_conn.getForEditInvoice(invoice_id);

    const ticketInfo = await conn.getInvoiceTicketInfo(invoice_id);

    const hotel_information = await conn.getInvoiceHotel(invoice_id);

    const transport_information = await conn.getInvoiceTransportInfo(
      invoice_id
    );
    const billing_information = await conn.getInvoiceBilling(invoice_id);

    const passport_information = await conn.getInvoiceOtherPass(invoice_id);

    return {
      success: true,
      data: {
        ...invoice,
        passport_information,
        ticketInfo,
        hotel_information,
        transport_information,
        billing_information,
      },
    };
  };

  public getAllInvoiceOthersByClientId = async (req: Request) => {
    const clientId = Number(req.params.id);
    const conn = this.models.invoiceOtherModel(req);
    const invoiceOthers = await conn.getRefundOthersInfo(clientId);

    return {
      success: true,
      data: invoiceOthers,
    };
  };

  // ============= narrow services ==============

  public postInvoiceOther = new AddInvoiceOther().addInvoiceOther;
  public editInvoiceOther = new EditInvoiceOther().editInvoiceOther;
  public deleteInvoiceOther = new DeleteInvoiceOtehr().deleteInvoiceOther;
  public voidInvoiceOther = new DeleteInvoiceOtehr().voidInvoiceOther;
}

export default InivoiceOther;
