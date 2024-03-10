import { Request } from 'express';
import AbstractServices from '../../../../abstracts/abstract.services';
import AddCostingInvoiceTour from './narrowServices/AddCostingInvoiceTour';
import AddInvoiceTour from './narrowServices/AddInvoiceTour';
import DeleteResetInvoiceTour from './narrowServices/DeleteRestoreInvoiceTour';
import EditInvoiceTour from './narrowServices/EditInvoiceTour';

class invoiceTourServices extends AbstractServices {
  constructor() {
    super();
  }

  // GET ALL
  getAllTourInvoices = async (req: Request) => {
    const { page, size, search, from_date, to_date } = req.query as {
      page: string;
      size: string;
      search: string;
      from_date: string;
      to_date: string;
    };
    const conn = this.models.CommonInvoiceModel(req);

    const data = await conn.getAllInvoices(
      4,
      Number(page) || 1,
      Number(size) || 20,
      search,
      from_date,
      to_date
    );

    return {
      success: true,
      message: 'All Invoices Tour Package',
      ...data,
    };
  };

  getTourBillingInfo = async (req: Request) => {
    const invoiceId = req.params.invoice_id;

    const conn = this.models.invoiceTourModels(req);

    const tourBilling = await conn.getTourBilling(invoiceId);

    const tourFoods = await conn.getTourFoods(invoiceId);
    const tourTransports = await conn.getTourTransport(invoiceId);
    const tourAccms = await conn.getTourAccm(invoiceId);
    const tourOtherTrans = await conn.getTourOtherTrans(invoiceId);
    const tourGuide = await conn.getTourGuide(invoiceId);
    const tourTicket = await conn.getTourTicketInfo(invoiceId);

    const { invoice_combclient_id } = await conn.getClientId(invoiceId);

    return {
      success: true,
      data: {
        invoice_combclient_id,
        tourBilling,

        tourTransports: !tourTransports.length,
        tourFoods: !tourFoods.length,
        tourAccms: !tourAccms.length,
        tourOtherTrans: !tourOtherTrans.length,
        tourGuide: tourGuide ? !Object.keys(tourGuide).length : true,
        tourTicket: tourTicket ? !Object.keys(tourTicket).length : true,
      },
    };
  };

  // GET FOR EDIT
  getForEdit = async (req: Request) => {
    const conn = this.models.invoiceTourModels(req);
    const common_conn = this.models.CommonInvoiceModel(req);
    const invoiceId = req.params.invoice_id;

    const invoices = await common_conn.getForEditInvoice(invoiceId);

    const invoiceTourExtraInfo = await conn.getTourExtraInfo(invoiceId);

    const tourBilling = await conn.getTourBilling(invoiceId);
    const tourFoods = await conn.getTourFoods(invoiceId);
    const tourTransports = await conn.getTourTransport(invoiceId);
    const tourAccms = await conn.getTourAccm(invoiceId);
    const tourOtherTrans = await conn.getTourOtherTrans(invoiceId);
    const tourGuide = await conn.getTourGuide(invoiceId);
    const tourTicket = await conn.getTourTicketInfo(invoiceId);

    return {
      success: true,
      data: {
        ...invoices,
        ...invoiceTourExtraInfo,
        tourBilling,
        tourFoods: tourFoods.length ? tourFoods : [{}],
        tourTransports: tourTransports.length ? tourTransports : [{}],
        tourAccms: tourAccms.length ? tourAccms : [{}],
        tourOtherTrans: tourOtherTrans.length ? tourOtherTrans : [{}],
        tourGuide,
        tourTicket,
      },
    };
  };

  // VIEW INVOICE TOUR PACKAGE
  viewITourPackage = async (req: Request) => {
    const common_conn = this.models.CommonInvoiceModel(req);
    const conn = this.models.invoiceTourModels(req);
    const invoiceId = req.params.invoice_id;

    const invoices = await common_conn.getViewInvoiceInfo(invoiceId);

    const clientlBalance = await conn.getInvoiceClientlBalance(invoiceId);

    const invoiceTourData = await conn.viewTourInvoiceData(invoiceId);

    const refund = await conn.getTourRefunds(invoiceId);

    return {
      success: true,
      data: {
        ...invoices,
        ...clientlBalance,
        ...invoiceTourData,
        refund,
      },
    };
  };

  // ============= narrow services ==============

  public addCostingTourPackage = new AddCostingInvoiceTour()
    .addCostingInvoiceTour;
  public addInvoiceTour = new AddInvoiceTour().addInvoiceTour;
  public editInvoiceTour = new EditInvoiceTour().editInvoiceTour;
  public deleteResetInvoiceTour = new DeleteResetInvoiceTour()
    .deleteResetInvoiceTour;
  public voidInvoiceTour = new DeleteResetInvoiceTour().voidInvoiceTour;
}

export default invoiceTourServices;
