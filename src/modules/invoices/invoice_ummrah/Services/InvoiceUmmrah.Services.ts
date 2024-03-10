import { Request } from 'express';
import AbstractServices from '../../../../abstracts/abstract.services';
import AddInvoiceUmmrah from './NarrowServices/AddInvoiceummrah';
import DeleteInvoiceUmmrah from './NarrowServices/DeleteInvoiceUmmrah';
import EditInvoiceUmmrah from './NarrowServices/EditInvoiceUmmrah';
import UmmrahRefundServices from './NarrowServices/ummrahRefund.services';

class InvoiceUmmrahServices extends AbstractServices {
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
      26,
      Number(page) || 1,
      Number(size) || 20,
      search,
      from_date,
      to_date
    );

    return {
      success: true,
      message: 'All Invoices Air ticket',
      ...data,
    };
  };

  // VIEW INVOICE UMRAH
  public viewInvoiceUmmah = async (req: Request) => {
    const invoice_id = Number(req.params.invoice_id);
    const common_conn = this.models.CommonInvoiceModel(req);
    const conn = this.models.InvoiceUmmarhModels(req);

    const invoice = await common_conn.getViewInvoiceInfo(invoice_id);

    const passenger_info = await conn.viewIUmmrahPassengerInfos(invoice_id);
    const hotel_information = await conn.getIUHotelInfos(invoice_id);

    const billing_information = await common_conn.getViewBillingInfo(
      invoice_id,
      'trabill_invoice_umrah_billing_infos'
    );

    return {
      success: true,

      data: {
        ...invoice,
        passenger_info,
        hotel_information,
        billing_information,
      },
    };
  };

  public getDataForEdit = async (req: Request) => {
    const conn = this.models.InvoiceUmmarhModels(req);
    const common_conn = this.models.CommonInvoiceModel(req);
    const invoice_id = Number(req.params.invoice_id);
    const invoiceInfo = await common_conn.getForEditInvoice(invoice_id);

    const passenget_info = await conn.getIUmmrahPassengerInfos(invoice_id);
    const hotel_information = await conn.getIUHotelInfos(invoice_id);
    const billing_information = await conn.getForEditBilling(invoice_id);

    return {
      success: true,
      data: {
        ...invoiceInfo,
        invoice_no_passenger: passenget_info.length,
        passenget_info,
        hotel_information,
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

  public getBillingInfo = async (req: Request) => {
    const invoiceId = req.params.invoice_id as string;

    const conn = this.models.InvoiceUmmarhModels(req);

    const data = await conn.getBillingInfo(invoiceId);

    return {
      success: true,
      data,
    };
  };

  public getUmmrahRefund = async (req: Request) => {
    const invoiceId = req.params.invoice_id as string;

    const conn = this.models.InvoiceUmmarhModels(req);

    const refund = await conn.getUmmrahRefund(invoiceId);
    const refundItems = await conn.getUmmrahRefundItems(invoiceId);

    return {
      success: true,
      data: { refund, refundItems },
    };
  };

  // =============== narrow services ===================
  public postInvoiceUmmrah = new AddInvoiceUmmrah().postInvoiceUmmrah;
  public editInvoiceUmmrah = new EditInvoiceUmmrah().editInvoiceUmmrah;
  public deleteInvoiceUmmrah = new DeleteInvoiceUmmrah().deleteInvoiceUmmrah;
  public voidInvoiceUmmrah = new DeleteInvoiceUmmrah().voidInvoiceUmmrah;

  public createUmmrahRefund = new UmmrahRefundServices().refund;
}

export default InvoiceUmmrahServices;
