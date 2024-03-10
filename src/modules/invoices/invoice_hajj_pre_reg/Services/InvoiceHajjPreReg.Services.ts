import { Request } from 'express';
import AbstractServices from '../../../../abstracts/abstract.services';
import CustomError from '../../../../common/utils/errors/customError';
import AddInvoiceHajjpre from './NarrowServices/AddInvoiceHajjPre.Services';
import DeleteInvoiceHajjPreReg from './NarrowServices/DeleteInvoiceHajjPreReg';
import EditInvoiceHajjpre from './NarrowServices/EditInvoiceHajjPreReg';

class InvoiceHajjPreRegServices extends AbstractServices {
  constructor() {
    super();
  }

  public getAllInvoices = async (req: Request) => {
    const { page, size, search, from_data, to_date } = req.query as {
      page: string;
      size: string;
      search: string;
      from_data: string;
      to_date: string;
    };

    const conn = this.models.CommonInvoiceModel(req);

    const data = await conn.getAllInvoices(
      30,
      Number(page) || 1,
      Number(size) || 20,
      search,
      from_data,
      to_date
    );

    return {
      success: true,
      message: 'All Invoices Hajj Pre Reg',
      ...data,
    };
  };

  // VIEW INVOICE HAJJ PRE REG
  public viewInvoiceHajjPreReg = async (req: Request) => {
    const invoice_id = req.params.id;
    const common_conn = this.models.CommonInvoiceModel(req);
    const conn_receipt = this.models.MoneyReceiptModels(req);
    const conn = this.models.invoiceHajjPre(req);

    // INVOICE DATA
    const invoice = await common_conn.getViewInvoiceInfo(invoice_id);
    const haji_information = await conn.getPreHajiInfo(invoice_id);
    const invoiceDue = await conn_receipt.getInvoiceDue(invoice_id);
    const billing_information = await conn.getHajiBillingInfos(invoice_id);

    return {
      success: true,
      data: {
        ...invoiceDue,
        ...invoice,
        haji_information,
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

  // GET_FOR_EDIT
  public getDetailsById = async (req: Request) => {
    const invoice_id = Number(req.params.invoice_id);
    const conn = this.models.invoiceHajjPre(req);
    const common_conn = this.models.CommonInvoiceModel(req);

    const invoice = await common_conn.getForEditInvoice(invoice_id);

    const haji_information = await conn.getPreHajiInfo(invoice_id);
    const billing_information = await conn.getForEditBillingInfo(invoice_id);

    return {
      success: true,
      data: { ...invoice, haji_information, billing_information },
    };
  };

  public hajiInformationHajjiManagement = async (req: Request) => {
    const conn = this.models.invoiceHajjPre(req);
    const haji_information = await conn.getHajiInformationForHajjiManagement();

    return {
      success: true,
      data: haji_information,
    };
  };

  public hajiInfoByTrackingNo = async (req: Request) => {
    const conn = this.models.invoiceHajjPre(req);
    const tracking_no = req.params.id;
    if (!tracking_no) {
      throw new CustomError(
        'Please provide  valid Tracking Number',
        400,
        'Invalid Tracking Number'
      );
    }
    const haji_information = await conn.getHajiInfoByTrackingNo(tracking_no);

    return {
      success: true,
      data: haji_information,
    };
  };

  public hajiInfoSerialIsUnique = async (req: Request) => {
    const conn = this.models.invoiceHajjPre(req);
    const { data_for, value } = req.body as {
      data_for: 'tracking' | 'serial';
      value: string;
    };

    const data = await conn.getAllTrackingAndSerialNo(data_for, value);

    return {
      success: true,
      data,
      message: data
        ? `${data_for} no. is already exist`
        : `${data_for} no. is unique`,
    };
  };

  public updateHajjiInfoStatus = async (req: Request) => {
    const { invoice_id } = req.params as { invoice_id: string };
    const { status } = req.query as { status: 'approved' | 'cancled' };
    const { updated_by } = req.body as { updated_by: number };

    const conn = this.models.invoiceHajjPre(req);

    await conn.updateHajjiInfoStatus(invoice_id, status, updated_by);

    return {
      success: true,
      message: 'Hajji info status updated successfully!',
    };
  };

  public getAllHajiPreRegInfos = async (req: Request) => {
    const { page, size, month } = req.query;

    const conn = this.models.invoiceHajjPre(req);

    const data = await conn.getAllHajiPreRegInfos(
      Number(page) || 1,
      Number(size) || 20,
      String(month)
    );

    const count = await conn.countAllHajiPreRegInfosDataRow(String(month));

    return { success: true, count, data };
  };

  // =============== narrow services ===================
  public addInvoiceHajjPre = new AddInvoiceHajjpre().addInvoiceHajjPre;
  public editInvoiceHajjPre = new EditInvoiceHajjpre().editInvoiceHajjPre;
  public deleteInvoiceHajjPre = new DeleteInvoiceHajjPreReg()
    .deleteInvoiceHajjPre;
  public voidHajjPreReg = new DeleteInvoiceHajjPreReg().voidHajjPreReg;
}

export default InvoiceHajjPreRegServices;
