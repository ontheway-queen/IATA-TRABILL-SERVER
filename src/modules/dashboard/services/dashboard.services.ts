import { Request } from 'express';
import AbstractServices from '../../../abstracts/abstract.services';
import {
  getIataDateRange,
  getNext15Day,
} from '../../../common/utils/libraries/lib';

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

    return {
      success: true,
      data: {
        daily_purchase,
        daily_payment,
      },
    };
  };

  getMonthlyPaymentPurchase = async (req: Request) => {
    const conn = this.models.dashboardModal(req);
    const monthly_purchase = await conn.selectMonthlyPurchase();
    const monthly_payment = await conn.selectMonthlyPayment();

    return {
      success: true,
      data: {
        monthly_purchase,
        monthly_payment,
      },
    };
  };

  getYearlyPaymentPurchase = async (req: Request) => {
    const conn = this.models.dashboardModal(req);
    const yearly_purchase = await conn.selectYearlyPurchase();
    const yearly_payment = await conn.selectYearlyPayment();

    return {
      success: true,
      data: {
        yearly_purchase,
        yearly_payment,
      },
    };
  };

  // BSP BILLING
  public getAirTicketSummary = async (req: Request) => {
    const conn = this.models.dashboardModal(req);

    const { sales_from_date, sales_to_date } = getIataDateRange();

    const ticket_issue = await conn.getBspTicketIssueInfo(
      sales_from_date,
      sales_to_date
    );
    const ticket_re_issue = await conn.getBspTicketReissueInfo(
      sales_from_date,
      sales_to_date
    );
    const ticket_refund = await conn.getBspTicketRefundInfo(
      sales_from_date,
      sales_to_date
    );

    const data = await conn.bspBillingInformation(
      sales_from_date,
      sales_to_date
    );

    // BILLING DATE
    const billing_from_date = getNext15Day(sales_from_date);
    const billing_to_date = getNext15Day(sales_to_date);

    return {
      success: true,
      message: 'the request is OK',
      data: {
        ...data,
        billing_from_date,
        billing_to_date,
        sales_from_date,
        sales_to_date,
      },
    };
  };

  // BSP BILLING SUMMARY
  public getBspBillingSummary = async (req: Request) => {
    const conn = this.models.dashboardModal(req);

    const { sales_from_date, sales_to_date } = getIataDateRange();

    const ticket_issue = await conn.getBspTicketIssueSummary(
      sales_from_date,
      sales_to_date
    );
    const ticket_re_issue = await conn.getBspTicketReissueSummary(
      sales_from_date,
      sales_to_date
    );
    const ticket_refund = await conn.getBspTicketRefundSummary(
      sales_from_date,
      sales_to_date
    );

    return {
      success: true,
      message: 'the request is OK',
      data: {
        sales_from_date,
        sales_to_date,
        ticket_issue,
        ticket_re_issue,
        ticket_refund,
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
}
export default DashboardServices;
