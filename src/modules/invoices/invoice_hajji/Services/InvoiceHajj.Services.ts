import { Request } from 'express';
import AddInvoiceHajjServices from './NarrowServices/AddInvoiceHajjServices';
import DeleteInvoiceHajj from './NarrowServices/DeleteInvoiceHajjServices';
import EditInvoiceHajj from './NarrowServices/EditInvoiceHajj';
import AbstractServices from '../../../../abstracts/abstract.services';
import HajjRefundServices from './NarrowServices/hajjRefund.services';

class InvoiceHajjServices extends AbstractServices {
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
      31,
      Number(page) || 1,
      Number(size) || 20,
      search,
      from_date,
      to_date
    );

    return {
      success: true,
      message: 'All Invoices Hajj',
      ...data,
    };
  };

  // VIEW INVOICE HAJJ
  public viewInvoiceHajj = async (req: Request) => {
    const invoice_id = Number(req.params.id);
    const common_conn = this.models.CommonInvoiceModel(req);
    const conn_receipt = this.models.MoneyReceiptModels(req);
    const conn = this.models.InvoiceHajjModels(req);

    // INVOICE DATA
    const invoice = await common_conn.getViewInvoiceInfo(invoice_id);
    const prepared_by = await common_conn.getInvoicePreparedBy(invoice_id);
    const authorized_by = await common_conn.getAuthorizedBySignature();

    const haji_information = await conn.getInvoiceHajjPilgrimsInfo(invoice_id);
    const hotel_information = await conn.getHajiHotelInfo(invoice_id);
    const transport_information = await conn.getHajiTransportInfo(invoice_id);

    const billing_information = await conn.getInvoiceHajjBillingView(
      invoice_id
    );

    const payments = await conn_receipt.getMoneyReceiptByInvoiceid(invoice_id);

    const routes = await common_conn.getInvoiceRoutesName(invoice_id);

    return {
      success: true,

      data: {
        ...invoice,
        authorized_by,
        prepared_by,
        routes,
        haji_information,
        hotel_information,
        transport_information,
        billing_information,
        payments,
      },
    };
  };

  public getDataForEdit = async (req: Request) => {
    const conn = this.models.InvoiceHajjModels(req);
    const common_conn = this.models.CommonInvoiceModel(req);
    const id = Number(req.params.id);

    const invoiceInfo = await conn.getInvoiceHajjInfo(id);

    const pilgrims_information = await conn.getInvoiceHajjPilgrimsInfo(id);

    const hotel_information = await conn.getHajiHotelInfo(id);

    const transport_information = await conn.getHajiTransportInfo(id);

    const billing_information = await conn.getForEditHajiBilling(id);

    const invoice_hajj_routes = await common_conn.getInvoiceRoutes(id);

    return {
      success: true,
      data: {
        ...invoiceInfo,
        invoice_hajj_routes,
        invoice_no_passenger: pilgrims_information.length,
        pilgrims_information,
        hotel_information,
        transport_information,
        billing_information,
      },
    };
  };

  public getPreRegistrationReports = async (req: Request) => {
    const conn = this.models.invoiceHajjPre(req);
    const year = req.params.year;
    const data = await conn.getPreRegistrationReports(year);
    const newData: any[] = [];
    for await (const item of data) {
      const haji_group_id = item.invoice_haji_group_id;
      const hajiGroupData = await conn.getHajiGroupName(haji_group_id);
      newData.push({ ...item, ...hajiGroupData });
    }

    return { success: true, data: newData };
  };

  public getHajjInfo = async (req: Request) => {
    const { invoice_id } = req.params as { invoice_id: string };

    const conn = this.models.InvoiceHajjModels(req);

    const data = await conn.getHajjInfo(invoice_id);

    return {
      success: true,
      data,
    };
  };

  public getHajjInvoiceRefund = async (req: Request) => {
    const { invoice_id } = req.params as { invoice_id: string };

    const conn = this.models.InvoiceHajjModels(req);

    const refund = await conn.getHajjInvoiceRefund(invoice_id);
    const refundItems = await conn.getHajjInvoiceRefundItems(invoice_id);

    return {
      success: true,
      data: { refund, refundItems },
    };
  };

  // =============== narrow services ===================
  public addInvoiceHajjServices = new AddInvoiceHajjServices()
    .addInvoiceHajjServices;
  public editInvoiceHajj = new EditInvoiceHajj().editInvoiceHajj;
  public deleteInvoiceHajj = new DeleteInvoiceHajj().deleteInvoiceHajj;
  public voidInvoiceHajj = new DeleteInvoiceHajj().voidInvoiceHajj;
  public createHajjRefund = new HajjRefundServices().hajjRefund;
}

export default InvoiceHajjServices;
