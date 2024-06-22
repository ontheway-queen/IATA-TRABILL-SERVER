import { Request } from 'express';
import PDFParser from 'pdf-parse';
import AbstractServices from '../../../abstracts/abstract.services';
import { uploadImageWithBuffer } from '../../../common/middlewares/uploader/imageUploader';
import CustomError from '../../../common/utils/errors/customError';
import {
  dateStrConverter,
  getBspBillingDate,
  getDateRangeByWeek,
  getNext15Day,
} from '../../../common/utils/libraries/lib';
import {
  BspBillingQueryType,
  BspBillingSummaryQueryType,
} from '../types/dashboard.types';
import {
  formatAgentRefund,
  formatAgentTicket,
  getAgentBillingSummary,
} from '../utils/dashbaor.utils';

class DashboardServices extends AbstractServices {
  constructor() {
    super();
  }

  // @Search Invoices
  searchInvoices = async (req: Request) => {
    const conn = this.models.dashboardModal(req);

    const { search, size, page } = req.query as {
      search: string;
      page: string;
      size: string;
    };

    if (!search) {
      return { success: true, data: [] };
    }

    const data = await conn.searchInvoices(search, page, size);

    const count = await conn.countSearchInvoices(search);

    return { success: true, count, data };
  };

  // @Dashboard Summary
  dashboardSummary = async (req: Request) => {
    const conn = this.models.dashboardModal(req);

    const currAccStatus = await conn.currAccStatus();
    const account_status = await conn.accountStatus();

    return {
      success: true,
      data: {
        currAccStatus,
        account_status,
      },
    };
  };

  getAccountBalanceData = async (req: Request) => {
    const conn = this.models.dashboardModal(req);

    const data = await conn.getAccountDetails();

    const names = data.map((item) => item.acctype_name);
    const ammount = data.map((item) => item.total_amount);

    return { success: true, data: { names, ammount } };
  };

  getExpenses = async (req: Request) => {
    const conn = this.models.dashboardModal(req);

    const accountWiseExpense = await conn.getAccWiseTodayExpenseTotal();

    const expenseInfo = await conn.getExpenseInfo();

    return {
      success: true,
      data: {
        accountWiseExpense,
        ...expenseInfo,
      },
    };
  };

  // INVOICE DETAILS
  getMonthReport = async (req: Request) => {
    const conn = this.models.dashboardModal(req);
    const data = await conn.getMonthReport();

    return {
      success: true,
      data,
    };
  };

  // DAILY , MONTHLY & YEARLY TRANSACTIONS
  public getTransactionInfo = async (req: Request) => {
    const conn = this.models.dashboardModal(req);

    const daily_sales = await conn.selectDailySales();
    const daily_received = await conn.selectDailyReceived();
    const daily_expense = await conn.selectDailyExpense();

    const monthly_sales = await conn.selectMonthlySales();
    const monthly_received = await conn.selectMonthlyReceived();
    const monthly_expense = await conn.selectMonthlyExpense();

    const yearly_sales = await conn.selectYearlySales();
    const yearly_received = await conn.selectYearlyReceived();
    const yearly_expense = await conn.selectYearlyExpense();

    return {
      success: true,
      message: 'request is OK',
      data: {
        daily_sales,
        daily_received,
        daily_expense,
        monthly_sales,
        monthly_received,
        monthly_expense,
        yearly_sales,
        yearly_received,
        yearly_expense,
      },
    };
  };

  getDailyPaymentPurchase = async (req: Request) => {
    const conn = this.models.dashboardModal(req);
    const daily_purchase = await conn.selectDailyPurchase();
    const daily_payment = await conn.selectDailyPayment();
    const daily_refund = await conn.selectDailyRefund();

    return {
      success: true,
      data: {
        daily_purchase,
        daily_payment,
        daily_refund,
      },
    };
  };

  getMonthlyPaymentPurchase = async (req: Request) => {
    const conn = this.models.dashboardModal(req);
    const monthly_purchase = await conn.selectMonthlyPurchase();
    const monthly_payment = await conn.selectMonthlyPayment();
    const monthly_refund = await conn.selectMonthlyRefund();

    return {
      success: true,
      data: {
        monthly_purchase,
        monthly_payment,
        monthly_refund,
      },
    };
  };

  getYearlyPaymentPurchase = async (req: Request) => {
    const conn = this.models.dashboardModal(req);
    const yearly_purchase = await conn.selectYearlyPurchase();
    const yearly_payment = await conn.selectYearlyPayment();
    const yearly_refund = await conn.selectYearlyRefund();

    return {
      success: true,
      data: {
        yearly_purchase,
        yearly_payment,
        yearly_refund,
      },
    };
  };

  // BSP BILLING
  public getBSPBilling = async (req: Request) => {
    const conn = this.models.dashboardModal(req);
    const report_conn = this.models.reportModel(req);
    let { billingType, from_date, to_date } = req.query as BspBillingQueryType;

    if (from_date === 'Invalid Date' && to_date === 'Invalid Date') {
      let dateRange = getBspBillingDate(billingType);
      from_date = dateRange.from_date;
      to_date = dateRange.to_date;
    }

    const ticket_issue = await conn.getBspTicketIssueInfo(from_date, to_date);

    const ticket_re_issue = await conn.getBspTicketReissueInfo(
      from_date,
      to_date
    );

    const ticket_refund = await conn.getBspTicketRefundInfo(from_date, to_date);

    const client_sales = await report_conn.getAirTicketTotalSummary(
      from_date as string,
      to_date as string
    );

    // BILLING DATE
    const billing_from_date = getNext15Day(from_date);
    const billing_to_date = getNext15Day(to_date);

    const iata_payment = await conn.getBSPBillingPayment(
      billing_from_date,
      billing_to_date
    );

    return {
      success: true,
      message: 'The request is OK',
      data: {
        billing_from_date,
        billing_to_date,
        sales_from_date: from_date,
        sales_to_date: to_date,
        ticket_issue,
        ticket_re_issue,
        ticket_refund,
        client_sales,
        iata_payment,
      },
    };
  };

  // BSP BILLING SUMMARY
  public getBspBillingSummary = async (req: Request) => {
    const conn = this.models.dashboardModal(req);

    let { billingType, week, from_date, to_date } =
      req.query as BspBillingSummaryQueryType;

    if (from_date === 'Invalid Date' && to_date === 'Invalid Date') {
      let dateRange = getBspBillingDate(billingType);
      from_date = dateRange.from_date;
      to_date = dateRange.to_date;
    }

    if (
      [
        'previous',
        'previous_next',
        'first',
        'second',
        'third',
        'fourth',
      ].includes(week)
    ) {
      const dateRange = getDateRangeByWeek(week);

      from_date = dateRange.startDate;
      to_date = dateRange.endDate;
    }

    const issue = await conn.getBspTicketIssueSummary(from_date, to_date);

    const reissue = await conn.getBspTicketReissueSummary(from_date, to_date);

    const refund = await conn.getBspTicketRefundSummary(from_date, to_date);

    return {
      success: true,
      message: 'the request is OK',
      data: {
        sales_from_date: from_date,
        sales_to_date: to_date,
        ...issue,
        ...reissue,
        ...refund,
      },
    };
  };

  // VENDORS / BANK Guarantee
  public getVendorBankGuarantee = async (req: Request) => {
    const conn = this.models.dashboardModal(req);

    const data = await conn.getVendorBankGuarantee();

    return {
      success: true,
      message: 'request is OK',
      data,
    };
  };

  // BEST CLIENT OF THE YEAR/MONTH
  public getBestClients = async (req: Request) => {
    const conn = this.models.dashboardModal(req);

    const thisMonth = `${new Date().getFullYear()}-${
      new Date().getMonth() + 1
    }`;

    const monthly = await conn.getBestClients(null, thisMonth);

    const yearly = await conn.getBestClients(
      String(new Date().getFullYear()),
      null
    );

    return {
      success: true,
      message: 'request is OK',
      data: { monthly, yearly },
    };
  };

  // BEST EMPLOYEE OF THE YEAR/MONTH
  public getBestEmployee = async (req: Request) => {
    const conn = this.models.dashboardModal(req);

    const thisMonth = `${new Date().getFullYear()}-${
      new Date().getMonth() + 1
    }`;

    const monthly = await conn.getBestEmployee(null, thisMonth);

    const yearly = await conn.getBestEmployee(
      String(new Date().getFullYear()),
      null
    );

    return {
      success: true,
      message: 'request is OK',
      data: { monthly, yearly },
    };
  };

  // IATA BANK GUARANTEE LIMIT
  public iataBankGuaranteeLimit = async (req: Request) => {
    const conn = this.models.dashboardModal(req);
    const data = await conn.iataBankGuaranteeLimit();
    return {
      success: true,
      message: 'request is OK',
      data,
    };
  };

  // BSP BILLING CROSS CHECK
  bspBillingCrossCheck = async (req: Request) => {
    const { bsp_id } = req.params;
    const type = req.query.type || 'SUMMARY';
    const conn = this.models.dashboardModal(req);

    const bsp = await conn.getBspFileUrl(bsp_id);

    if (!bsp.bsp_file_url) {
      throw new CustomError('No file uploaded', 400, 'File not found');
    }

    try {
      const pdfData = await PDFParser(bsp.bsp_file_url as any);

      let data;

      switch (type) {
        case 'SUMMARY':
          data = await getAgentBillingSummary(pdfData?.text, conn);
          break;

        case 'TICKET':
          data = await formatAgentTicket(pdfData?.text, conn);
          break;

        case 'REFUND':
          data = await formatAgentRefund(pdfData?.text, conn);
          break;

        default:
          data = await getAgentBillingSummary(pdfData?.text, conn);
          break;
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('Error parsing PDF:', error);
      throw new CustomError('Error parsing PDF', 500, 'Something went wrong!');
    }
  };

  public uploadBspFile = async (req: Request) => {
    const files = req.files as any[];

    if (!files) {
      throw new CustomError(
        'A PDF file is required for upload. Please ensure that a valid PDF file is provided.',
        400,
        'File Not Provided'
      );
    }

    for (const item of files) {
      const { buffer, mimetype } = item;
      const pdfData = await PDFParser(buffer as any);

      if (!pdfData.text.includes('AGENT BILLING DETAILS')) {
        throw new CustomError(
          'The provided agent billing details are invalid. Please ensure the BSP file contains accurate information.',
          400,
          'Invalid BSP File'
        );
      }

      const salesPeriodRegex =
        /Billing Period:\s*(\d+)\s*\((.*?)\s*to\s*(.*?)\)/;
      const salesPeriodMatch = pdfData.text.match(salesPeriodRegex);

      let from_date;
      let to_date;
      let bsp_bill_date;

      if (salesPeriodMatch) {
        from_date = salesPeriodMatch[2].split('-').join('');
        to_date = salesPeriodMatch[3].split('-').join('');
        bsp_bill_date = dateStrConverter(salesPeriodMatch[3] as string);
      }

      const match = pdfData.text.match(/REFERENCE:\s*(\d+)/);

      const referenceNumber = match ? match[1] : undefined;

      const file_name =
        referenceNumber + '-' + from_date + '-' + to_date + '.PDF';

      const conn = this.models.dashboardModal(req);

      const isExist = await conn.checkBspFileIsExist(file_name);

      if (isExist) {
        throw new CustomError(
          'The file you are attempting to upload already exists. Please upload a different file or rename the existing file.',
          400,
          'File Already Exists'
        );
      }

      const bsp_file_url = (await uploadImageWithBuffer(
        buffer,
        file_name,
        mimetype
      )) as string;

      await conn.insertBspFile({
        bsp_agency_id: req.agency_id,
        bsp_created_by: req.user_id,
        bsp_file_url,
        bsp_file_name: file_name,
        bsp_bill_date: bsp_bill_date as Date,
      });
    }

    return {
      success: true,
      message: 'BSP file upload successfully',
    };
  };

  public deleteBSPDocs = async (req: Request) => {
    const tbd_id = req.params.tbd_id as string;

    const conn = this.models.dashboardModal(req);

    const prev_url = await conn.deleteBSPDocs(tbd_id);

    if (prev_url) this.manageFile.deleteFromCloud([prev_url]);

    return {
      success: true,
      message: 'BSP Doc delete successfully',
    };
  };

  public selectBspFiles = async (req: Request) => {
    const conn = this.models.dashboardModal(req);
    const { search, date } = req.query as { search: string; date: string };
    const data = await conn.selectBspFiles(search, date);

    return {
      success: true,
      message: 'The request is Ok.',
      data,
    };
  };

  public bspFileList = async (req: Request) => {
    const conn = this.models.dashboardModal(req);
    const { search, date, page, size } = req.query as {
      search: string;
      date: string;
      page: string;
      size: string;
    };
    const data = await conn.bspFileList(search, +page, +size, date);

    return {
      success: true,
      message: 'The request is Ok.',
      ...data,
    };
  };
}
export default DashboardServices;
