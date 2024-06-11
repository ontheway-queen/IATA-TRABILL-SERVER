import { Request } from 'express';
import PDFParser from 'pdf-parse';
import AbstractServices from '../../../abstracts/abstract.services';
import CustomError from '../../../common/utils/errors/customError';
import {
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
    if (!req.file) {
      throw new CustomError('No file uploaded', 400, 'File not found');
    }

    const type: string = 'REFUND';

    try {
      const conn = this.models.dashboardModal(req);

      const pdfData = await PDFParser(req.file.path as any);

      let data;

      if (pdfData.text.includes('AGENT BILLING DETAILS')) {
        if (type === 'SUMMARY') {
          data = await getAgentBillingSummary(pdfData?.text, conn);
        } else if (type === 'TICKET') {
          data = await formatAgentTicket(pdfData?.text, conn);
        } else if (type === 'REFUND') {
          data = await formatAgentRefund(pdfData?.text, conn);
        } else {
          data = [];
        }

        console.log({ data });
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
}
export default DashboardServices;
