import { Request } from 'express';
import AbstractServices from '../../../abstracts/abstract.services';
import { separateCombClientToId } from '../../../common/helpers/common.helper';
import { idType } from '../../../common/types/common.types';
import CustomError from '../../../common/utils/errors/customError';
import { IListQuery } from '../types/report.interfaces';
class ReportServices extends AbstractServices {
  constructor() {
    super();
  }

  /**
   * LEDGERS
   */
  public getClientLedger = async (req: Request) => {
    const { client_id } = req.params;

    const { from_date, to_date, page, size } = req.query as {
      from_date: string;
      to_date: string;
      page: string;
      size: string;
    };

    const conn = this.models.trxnModels(req);
    const client_conn = this.models.clientModel(req);

    const client = await client_conn.getClientInfo(client_id);

    const { ledgers, count } = await conn.getClTrans(
      client_id,
      from_date,
      to_date,
      Number(page) || 1,
      Number(size) || 20
    );

    return { success: true, count, data: { client, ledgers } };
  };

  public getVendorLedger = async (req: Request) => {
    const { vendor_id } = req.params;

    const { from_date, to_date, page, size } = req.query as {
      from_date: string;
      to_date: string;
      page: string;
      size: string;
    };

    const conn = this.models.trxnModels(req);
    const vendor_conn = this.models.reportModel(req);

    const vendor = await vendor_conn.getVendorInfo(vendor_id);
    const { ledgers, count } = await conn.getVenTrxns(
      vendor_id,
      from_date,
      to_date,
      Number(page) || 1,
      Number(size) || 20
    );

    return { success: true, count, data: { vendor, ledgers } };
  };

  getCombinedReport = async (req: Request) => {
    const { combined_id } = req.params;

    const { from_date, to_date, page, size } = req.query as {
      from_date: string;
      to_date: string;
      page: string;
      size: string;
    };

    const conn = this.models.trxnModels(req);

    const data = await conn.getComTrxn(
      combined_id,
      from_date,
      to_date,
      Number(page) || 1,
      Number(size) || 20
    );

    return { success: true, ...data };
  };

  public agentsReport = async (req: Request) => {
    const agentId = Number(req.params.agent_id);

    if (!agentId) {
      throw new CustomError(
        'Invalid agent id',
        400,
        'Please provide a valid agent id'
      );
    }

    const { from_date, to_date, page, size } = req.query as {
      from_date: string;
      to_date: string;
      page: string;
      size: string;
    };

    const conn = this.models.profitLossReport(req);

    const data = await conn.agentLedgers(
      agentId,
      String(from_date),
      String(to_date),
      +page,
      +size
    );

    return {
      success: true,
      message: 'Agents ledgers',
      ...data,
    };
  };

  public getClientByCategory = async (req: Request) => {
    let category_id: undefined | string = req.params.category_id;

    category_id = category_id === 'all' ? undefined : category_id;

    const conn = this.models.reportModel(req);

    const data = await conn.getClientByCategory(category_id);

    return { success: true, message: 'Invoice by category', data };
  };

  public clientDueAdvance = async (req: Request) => {
    const { client_id } = req.params;
    const {
      payment_date,
      page,
      size,
      present_balance = 'all',
    } = req.query as {
      present_balance: 'due' | 'advance' | 'all';
      size: string;
      payment_date: string;
      page: string;
    };

    const conn = this.models.reportModel(req);

    const data = await conn.clientDueAdvance(
      client_id,
      String(payment_date),
      Number(page) || 1,
      Number(size) || 20
    );

    return {
      success: true,
      client_id,
      ...data,
    };
  };

  public getDueAdvanceCombined = async (req: Request) => {
    const { combined_id } = req.params as { combined_id: string };

    const { payment_date, page, size } = req.query as {
      payment_date: string;
      page: string;
      size: string;
    };

    const conn = this.models.reportModel(req);

    const data = await conn.getDueAdvanceCombineClient(
      combined_id,
      payment_date,
      Number(page) || 1,
      Number(size) || 20
    );

    return { success: true, ...data };
  };

  public getAgentsDueAdvance = async (req: Request) => {
    const vendorId = req.params.agent_id;
    const { payment_date, page, size } = req.query;

    const conn = this.models.reportModel(req);

    const data = await conn.getAgentsDueAdvance(
      vendorId,
      String(payment_date),
      Number(page) || 1,
      Number(size) || 20
    );

    return { success: true, message: 'Agent advance due', ...data };
  };

  loanReport = async (req: Request) => {
    const conn = this.models.reportModel(req);

    const { authority, loan_type } = req.params;

    const { from_date, to_date, page, size } = req.query;

    const data = await conn.loanReport(
      String(from_date),
      String(to_date),
      authority,
      loan_type,
      Number(page) || 1,
      Number(size) || 20
    );

    const count = await conn.countLoanReportDataRow(
      String(from_date),
      String(to_date),
      authority,
      loan_type
    );

    return { success: true, count, data };
  };

  public getLoanSummary = async (req: Request) => {
    const conn = this.models.reportModel(req);

    let data = [];
    const types = ['TAKING', 'GIVING', 'ALREADY_TAKEN', 'ALREADY_GIVEN'];

    for (const type of types) {
      const info = await conn.getLoanSummary(type);
      data.push(info);
    }

    return {
      success: true,
      data,
    };
  };

  public getVendorPurchaseAndPayment = async (req: Request) => {
    const { comb_vendor } = req.params;

    const { from_date, to_date, page, size } = req.query;

    let separateVendor;

    if (comb_vendor && comb_vendor !== 'all') {
      separateVendor = separateCombClientToId(comb_vendor);
    }
    const vendor_id = separateVendor?.vendor_id || 'all';
    const combined_id = separateVendor?.combined_id || 'all';

    const conn = this.models.reportModel(req);

    const data = await conn.getVendorWiseReport(
      vendor_id,
      combined_id,
      String(from_date),
      String(to_date),
      Number(page) || 1,
      Number(size) || 20
    );

    const count = await conn.countVendorPaymentDataRow(
      vendor_id,
      combined_id,
      String(from_date),
      String(to_date)
    );

    return {
      success: true,
      data,
      count,
    };
  };

  public getClientSales = async (req: Request) => {
    const { client_id } = req.body;
    const { from_date, to_date, page, size } = req.query;

    const conn = this.models.salesPurchasesReport(req);

    let separateComb;
    if (client_id !== 'all') {
      separateComb = separateCombClientToId(client_id);
    }
    const clientId = separateComb?.client_id || 'all';
    const combine_id = separateComb?.combined_id || 'all';

    const sales = await conn.getClientSales(
      clientId,
      combine_id,
      String(from_date),
      String(to_date),
      Number(page) || 1,
      Number(size) || 20
    );

    const sales_count = await conn.countClientSalesDataRow(
      clientId,
      combine_id,
      String(from_date),
      String(to_date)
    );

    const collection = await conn.getClientCollectionClient(
      clientId,
      combine_id,
      String(from_date),
      String(to_date),
      Number(page) || 1,
      Number(size) || 20
    );

    const collection_count = await conn.countClientCollectionDataRow(
      clientId,
      combine_id,
      String(from_date),
      String(to_date)
    );

    const count = { collection_count, sales_count };

    const data = { ...count, collection, sales };

    return { success: true, count, data };
  };

  public vendorDueAdvance = async (req: Request) => {
    const vendorId = req.params.vendor_id;
    const { payment_date, page, size } = req.query;

    const conn = this.models.reportModel(req);

    const data = await conn.getDueAdvanceVendor(
      vendorId,
      String(payment_date),
      Number(page) || 1,
      Number(size) || 20
    );

    return { success: true, message: 'Vendor advance due', ...data };
  };

  public getSalesReport = async (req: Request) => {
    const { client_id: invoice_combclient_id, employee_id } = req.body as {
      employee_id: idType;
      client_id: string;
    };

    const { from_date, to_date, page, size } = req.query;

    let clientCombine;
    if (invoice_combclient_id && invoice_combclient_id !== 'all') {
      clientCombine = separateCombClientToId(invoice_combclient_id);
    }
    let client_id: idType = clientCombine?.client_id || 'all';
    let combined_id: idType = clientCombine?.combined_id || 'all';

    const conn = this.models.salesPurchasesReport(req);

    const data = await conn.getSalesReport(
      client_id as string,
      combined_id as string,
      employee_id,
      String(from_date),
      String(to_date),
      Number(page) || 1,
      Number(size) || 20
    );

    return { success: true, ...data };
  };

  // OVERALL PROFIT LOSS
  public overallProfitLoss = async (req: Request) => {
    const { from_date, to_date } = req.query as {
      from_date: string;
      to_date: string;
    };

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.profitLossReport(req, trx);

      // sales and purchase
      const sales_info = await conn.totalSales(from_date, to_date);

      const refund_info = await conn.getClientRefundTotal(from_date, to_date);

      const service_charge = await conn.getInvoicesServiceCharge(
        from_date,
        to_date
      );

      const void_profit_loss = await conn.getInvoiceVoidProfit(
        from_date,
        to_date
      );

      const total_employee_salary = await conn.getEmployeeExpense(
        from_date,
        to_date
      );

      const expense_total = await conn.allExpenses(from_date, to_date);

      const incentive = await conn.allIncentive(from_date, to_date);

      const total_discount = await conn.getAllClientDiscount(
        from_date,
        to_date
      );

      const online_charge = await conn.getBankCharge(from_date, to_date);

      const vendor_ait = await conn.getVendorAit(from_date, to_date);

      const non_invoice = await conn.getNonInvoiceIncomeProfit(
        from_date,
        to_date
      );
      const agent_payment = await conn.getAgentPayment(from_date, to_date);

      return {
        success: true,
        data: {
          ...sales_info,
          ...refund_info,
          service_charge,
          void_profit_loss,

          total_incentive_income: incentive,
          non_invoice,

          expense_total,
          total_employee_salary,
          total_discount,
          online_charge,
          vendor_ait,
          agent_payment,
        },
      };
    });
  };

  // overall sales summery
  public getOverallSalesSummery = async (req: Request) => {
    const { from_date, to_date, page, size } = req.query as IListQuery;

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.profitLossReport(req, trx);

      const data = await conn.getOverallSalesSummery(
        from_date,
        to_date,
        +page,
        +size
      );

      return {
        success: true,
        ...data,
      };
    });
  };

  // overall client refunds
  public getOverallClientRefund = async (req: Request) => {
    const { from_date, to_date, page, size } = req.query as IListQuery;

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.profitLossReport(req, trx);

      const data = await conn.getOverallClientRefund(
        from_date,
        to_date,
        +page,
        +size
      );

      return {
        success: true,
        ...data,
      };
    });
  };

  // overall client refunds
  public getOverallPurchase = async (req: Request) => {
    const { from_date, to_date, page, size } = req.query as IListQuery;

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.profitLossReport(req, trx);

      const data = await conn.getOverallPurchase(
        from_date,
        to_date,
        +page,
        +size
      );

      return {
        success: true,
        ...data,
      };
    });
  };

  public getVisaList = async (req: Request) => {
    const data = await this.models.reportModel(req).getVisaList();

    return { success: true, data };
  };

  public visaWiseProfitLoss = async (req: Request) => {
    const { visa_id } = req.params as { visa_id: idType };
    const { from_date, to_date, page, size } = req.query;

    const conn = this.models.profitLossReport(req);

    const data = await conn.visaWiseProfitLoss(
      visa_id,
      String(from_date),
      String(to_date),
      Number(page) || 1,
      Number(size) || 20
    );

    return { success: true, ...data };
  };

  public userLoginHistory = async (req: Request) => {
    const { user_id } = req.body as { user_id: idType };

    const { from_date, to_date, page, size } = req.query;
    const conn = this.models.reportModel(req);

    const data = await conn.userLoginHistory(
      user_id,
      String(from_date),
      String(to_date),
      Number(page) || 1,
      Number(size) || 20
    );

    return { success: true, ...data };
  };

  public preRegistrationList = async (req: Request) => {
    const { possible_year, page, size } = req.body as {
      possible_year: idType;
      page: string;
      size: string;
    };

    const conn = this.models.reportModel(req);

    const data = await conn.preRegistrationList(
      possible_year,
      Number(page) || 1,
      Number(size) || 20
    );

    return { success: true, ...data };
  };

  public clientWisePassengerList = async (req: Request) => {
    const client_ids = req.params.id;
    const { page, size } = req.query;

    const conn = this.models.reportModel(req);

    let combineClients;
    if (client_ids && client_ids !== 'all') {
      combineClients = separateCombClientToId(client_ids);
    }
    const client_id: idType = combineClients?.client_id || 'all';
    const combined_id: idType = combineClients?.combined_id || 'all';

    const data = await conn.clientWisePassengerList(
      client_id,
      combined_id,
      Number(page) || 1,
      Number(size) || 20
    );

    const count = await conn.countClientWisePassengerList(
      client_id,
      combined_id
    );

    return { success: true, count, data };
  };

  public countryWiseReport = async (req: Request) => {
    const { country_id } = req.params;

    const { from_date, to_date, page, size } = req.query;

    const conn = this.models.reportModel(req);

    const data = await conn.countryWiseReport(
      country_id,
      String(from_date),
      String(to_date),
      Number(page) || 1,
      Number(size) || 20
    );

    return { success: true, ...data };
  };

  public passportWiseReport = async (req: Request) => {
    const passport_id = req.params.id as string;

    const { from_date, to_date, page, size } = req.query as {
      from_date: string;
      to_date: string;
      page: string;
      size: string;
    };

    const conn = this.models.reportModel(req);

    const data = await conn.passportWiseReport(
      passport_id,
      String(from_date),
      String(to_date),
      Number(page),
      Number(size)
    );

    return { success: true, ...data };
  };

  public passportStatusReport = async (req: Request) => {
    const { status_name } = req.body as { status_name: string };

    const { from_date, to_date, page, size } = req.query;

    const conn = this.models.reportModel(req);

    const data = await conn.passportStatusReport(
      status_name,
      String(from_date),
      String(to_date),
      Number(page) || 1,
      Number(size) || 20
    );

    const count = await conn.countPassportStatusDataRow(
      status_name,
      String(from_date),
      String(to_date)
    );

    return { success: true, count, data };
  };

  public monthlySummary = async (req: Request) => {
    const { month } = req.query as {
      month: string;
    };

    const conn = this.models.reportModel(req);

    const monthlySalesAmount = await conn.salesAmountReport(month, 'monthly');
    const monthlyVendorPayment = await conn.vendorPaymentAmount(
      month,
      'monthly'
    );
    const monthlyExpenseAmount = await conn.expenseAmountReport(
      month,
      'monthly'
    );
    const employeeExpenseAmount = await conn.employeeExpenseReport(
      month,
      'monthly'
    );
    const monthlyClientRefund = await conn.clientRefundAmount(month, 'monthly');
    const monthlyVendorRefund = await conn.vendorRefundAmount(month, 'monthly');
    const monthlyAccountCollection = await conn.accountCollectionAmount(
      month,
      'monthly'
    );
    const monthlyPurchase = await conn.purchaseReport(month, 'monthly');
    const monthlyAgentPayment = await conn.getTotalAgentPayment(
      month,
      'monthly'
    );

    //
    const monthlySalesReport = await conn.salesReport(month, 'monthly');
    const monthlyExpenseReport = await conn.expenseSummaryReport(
      month,
      'monthly'
    );
    const monthlyVendorPaymentReport = await conn.vendorPaymentReport(
      month,
      'monthly'
    );
    const monthlyCollectionReport = await conn.accountCollectionReport(
      month,
      'monthly'
    );

    const monthlyClientRefundReport = await conn.clientRefundReport(
      month,
      'monthly'
    );
    const monthlyVendorRefundReport = await conn.vendorRefundReport(
      month,
      'monthly'
    );

    return {
      success: true,
      data: {
        monthlyVendorPayment,
        monthlySalesAmount,
        monthlyExpenseAmount,
        employeeExpenseAmount,
        monthlyClientRefund,
        monthlyVendorRefund,
        monthlyAccountCollection,
        monthlyPurchase,
        monthlyAgentPayment,
        monthlySalesReport,
        monthlyExpenseReport,
        monthlyVendorPaymentReport,
        monthlyCollectionReport,
        monthlyClientRefundReport,
        monthlyVendorRefundReport,
      },
    };
  };

  public dailySummary = async (req: Request) => {
    const { day } = req.query as { day: string };

    const conn = this.models.reportModel(req);

    const dailySalesAmount = await conn.salesAmountReport(day, 'daily');
    const dailyPurchase = await conn.purchaseReport(day, 'daily');
    const dailyVendorPayment = await conn.vendorPaymentAmount(day, 'daily');
    const dailyExpenseAmount = await conn.expenseAmountReport(day, 'daily');
    const dailyEmployeeExpenseAmount = await conn.employeeExpenseReport(
      day,
      'daily'
    );
    const dailyClientRefund = await conn.clientRefundAmount(day, 'daily');
    const dailyVendorRefund = await conn.vendorRefundAmount(day, 'daily');
    const dailyAccountCollection = await conn.accountCollectionAmount(
      day,
      'daily'
    );
    const dailyAgentPayment = await conn.getTotalAgentPayment(day, 'daily');

    //
    const dailySalesReport = await conn.salesReport(day, 'daily');
    const dailyExpenseReport = await conn.expenseSummaryReport(day, 'daily');
    const dailyVendorPaymentReport = await conn.vendorPaymentReport(
      day,
      'daily'
    );
    const dailyCollectionReport = await conn.accountCollectionReport(
      day,
      'daily'
    );
    const dailyClientRefundReport = await conn.clientRefundReport(day, 'daily');
    const dailyVendorRefundReport = await conn.vendorRefundReport(day, 'daily');

    return {
      success: true,
      data: {
        dailyVendorPayment,
        dailySalesAmount,
        dailyExpenseAmount,
        dailyEmployeeExpenseAmount,
        dailyClientRefund,
        dailyVendorRefund,
        dailyAccountCollection,
        dailyPurchase,
        dailyAgentPayment,
        dailySalesReport,
        dailyExpenseReport,
        dailyVendorPaymentReport,
        dailyCollectionReport,
        dailyClientRefundReport,
        dailyVendorRefundReport,
      },
    };
  };

  public refundReportClient = async (req: Request) => {
    const { from_date, to_date, page, size } = req.query;
    const conn = this.models.reportModel(req);

    const data = await conn.refundReportClient(
      String(from_date),
      String(to_date),
      Number(page) || 1,
      Number(size) || 20
    );

    const count = await conn.countRefundClientDataRow(
      String(from_date),
      String(to_date)
    );

    return { success: true, count, data };
  };

  public refundReportVendor = async (req: Request) => {
    const { from_date, to_date, page, size } = req.query;
    const conn = this.models.reportModel(req);

    const data = await conn.refundReportVendor(
      String(from_date),
      String(to_date),
      Number(page) || 1,
      Number(size) || 20
    );

    const count = await conn.countVendorsRefundsDataRow(
      String(from_date),
      String(to_date)
    );

    return { success: true, count, data };
  };

  public salesManWiseCollectionDue = async (req: Request) => {
    const sales_man_id = req.params.salesman_id;

    const { from_date, to_date, page, size } = req.query;

    const conn = this.models.salesPurchasesReport(req);

    const data = await conn.salesManWiseCollectionDue(
      sales_man_id,
      String(from_date),
      String(to_date),
      Number(page) || 1,
      Number(size) || 20
    );

    return { success: true, ...data };
  };

  public salesReportCollectionDue = async (req: Request) => {
    const { from_date, to_date } = req.query;

    const conn = this.models.reportModel(req);

    const data = await conn.salesReportCollectionDue(
      'all',
      String(from_date),
      String(to_date)
    );

    return { success: true, data };
  };

  public headWiseExpenseReport = async (req: Request) => {
    const { head_id } = req.params;

    const { from_date, to_date, page, size } = req.query;

    const conn = this.models.reportModel(req);

    const data = await conn.headWiseExpenseReport(
      head_id,
      String(from_date),
      String(to_date),
      Number(page) || 1,
      Number(size) || 20
    );

    const count = await conn.countHeadWiseExpenseDataRow(
      head_id,
      String(from_date),
      String(to_date)
    );

    return { success: true, count, data };
  };

  public accountReport = async (req: Request) => {
    const { account_id } = req.params as { account_id: idType };
    const { from_date, to_date, page, size } = req.query;

    const conn = this.models.reportModel(req);

    const data = await conn.accountReport(
      account_id,
      String(from_date),
      String(to_date),
      Number(page) || 1,
      Number(size) || 20
    );

    const count = await conn.countAccountReportDataRow(
      account_id,
      String(from_date),
      String(to_date)
    );

    return { success: true, count, data };
  };

  public salesManReportCollectionDue = async (req: Request) => {
    const { sales_man_id } = req.params;

    const { from_date, to_date } = req.query;

    const conn = this.models.reportModel(req);

    const data = await conn.salesManReportCollectionDue(
      sales_man_id,
      String(from_date),
      String(to_date)
    );

    return { success: true, data };
  };

  public salesReportItemSalesman = async (req: Request) => {
    const { item_id, sales_man_id } = req.body as {
      item_id: idType;
      sales_man_id: idType;
    };

    const { from_date, to_date, page, size } = req.query;

    const conn = this.models.reportModel(req);

    const data = await conn.salesReportItemSalesman(
      item_id,
      sales_man_id,
      String(from_date),
      String(to_date),
      Number(page) || 1,
      Number(size) || 20
    );

    return {
      success: true,
      ...data,
    };
  };

  public GDSReport = async (req: Request) => {
    const { gds_id } = req.params;

    const { from_date, to_date, page, size } = req.query as {
      from_date: string;
      to_date: string;
      page: idType;
      size: idType;
    };

    const conn = this.models.reportModel(req);

    const { data, count } = await conn.GDSReport(
      gds_id,
      from_date,
      to_date,
      page,
      size
    );
    const sum = await conn.GDSReportGrossSum(gds_id, from_date, to_date);

    return { success: true, count, data: { list: data, ...sum } };
  };

  public AITReport = async (req: Request) => {
    const id = req.params.vendor_id as string;

    const { from_date, to_date, page, size } = req.query;

    const conn = this.models.reportModel(req);

    let separateComb;
    if (id && id !== 'all') {
      separateComb = separateCombClientToId(id);
    }

    const vendor_id = separateComb?.vendor_id || 'all';
    const combined_id = separateComb?.combined_id || 'all';

    const data = await conn.AITReportClient(
      vendor_id as number,
      combined_id as number,
      String(from_date),
      String(to_date),
      Number(page) || 1,
      Number(size) || 20
    );

    const count = await conn.countAitClientCount(
      vendor_id,
      combined_id,
      String(from_date),
      String(to_date)
    );

    return { success: true, count, data };
  };

  public voidInvoices = async (req: Request) => {
    const { from_date, to_date, page, size } = req.query as {
      from_date: string;
      to_date: string;
      page: string;
      size: string;
    };

    const conn = this.models.reportModel(req);

    const data = await conn.voidInvoices(
      from_date as string,
      to_date as string,
      page,
      size
    );

    return { success: true, ...data };
  };

  public airlineWiseSalesReport = async (req: Request) => {
    const airline_id = req.params.airline;

    const { from_date, to_date, page, size, search } = req.query;

    const conn = this.models.reportModel(req);

    const { data } = await conn.airlineWiseSalesReport(
      airline_id,
      String(from_date),
      String(to_date),
      Number(page) || 1,
      Number(size) || 20,
      search as string
    );

    const count = await conn.countAirlinesWiseReportDataRow(
      airline_id,
      String(from_date),
      String(to_date)
    );

    return { success: true, count, data };
  };

  public getClientDiscount = async (req: Request) => {
    const { client_id } = req.params;
    const { from_date, to_date, page, size } = req.query;

    const conn = this.models.reportModel(req);

    let separateComb;
    if (client_id && client_id !== 'all') {
      separateComb = separateCombClientToId(client_id);
    }

    const clientId = separateComb?.client_id || 'all';
    const combine_id = separateComb?.combined_id || 'all';

    const data = await conn.getClientDiscount(
      clientId,
      combine_id,
      String(from_date),
      String(to_date),
      Number(page) || 1,
      Number(size) || 20
    );

    return { success: true, ...data };
  };

  public journeyDateWiseclientReport = async (req: Request) => {
    const { comb_client } = req.body as { comb_client: string };

    let separeClient;
    if (comb_client !== 'all') {
      separeClient = separateCombClientToId(comb_client);
    }
    const client_id = separeClient?.client_id || 'all';
    const combined_id = separeClient?.combined_id || 'all';

    const { from_date, to_date, page, size } = req.query;

    const conn = this.models.reportModel(req);

    const data = await conn.journeyDateWiseClientReport(
      client_id,
      combined_id,
      String(from_date),
      String(to_date),
      Number(page) || 1,
      Number(size) || 20
    );

    return { success: true, ...data };
  };

  public ticketWiseProfitLoss = async (req: Request) => {
    const { ticket_id } = req.params as { ticket_id: idType };

    const { from_date, to_date, page, size } = req.query as {
      from_date: string;
      to_date: string;
      page: string;
      size: string;
    };

    const conn = this.models.profitLossReport(req);

    const tickets = await conn.ticketWiseProfitLossReport(
      ticket_id,
      from_date,
      to_date,
      Number(page || 1),
      Number(size || 20)
    );

    let data: any[] = [];

    for (const ticket of tickets) {
      const invoiceId = ticket?.invoice_id;
      if (invoiceId) {
        const invoiceDue = await this.models
          .MoneyReceiptModels(req)
          .getInvoiceDue(invoiceId);

        const ticket_info = { ...invoiceDue, ...ticket };

        data.push(ticket_info);
      }
    }

    const count = await conn.countTicketWiseProfitLossReportDataRow(
      ticket_id,
      from_date,
      to_date
    );

    return {
      success: true,
      count,
      data,
    };
  };
  public getAllTicketNo = async (req: Request) => {
    const conn = this.models.reportModel(req);

    const data = await conn.getAllTicketNo();

    return { success: true, data };
  };

  public groupWisePassengerList = async (req: Request) => {
    const { group_id } = req.params;

    const { page, size } = req.query;

    const conn = this.models.reportModel(req);

    const data = await conn.hajGroupPassengerList(
      group_id,
      Number(page) || 1,
      Number(size) || 20
    );

    return { success: true, ...data };
  };

  public getEmployeeExpense = async (req: Request) => {
    const { employee_id } = req.params as {
      employee_id: idType;
    };

    const { from_date, to_date, page, size } = req.query;

    const conn = this.models.profitLossReport(req);

    const data = await conn.getEmployeeExpenses(
      employee_id,
      String(from_date),
      String(to_date),
      Number(page) || 1,
      Number(size) || 20
    );

    const count = await conn.countEmployeeExpenseDataRow(
      employee_id,
      String(from_date),
      String(to_date)
    );

    return { success: true, count, data };
  };

  public getAllInvoiceCategory = async (req: Request) => {
    const conn = this.models.reportModel(req);

    const data = await conn.getAllInvoiceCategory();

    return {
      success: true,
      data,
    };
  };

  public getAuditHistory = async (req: Request) => {
    const { user_id } = req.params as { user_id: string };

    const { from_date, to_date, page, size } = req.query;

    const conn = this.models.reportModel(req);

    const data = await conn.getAuditHistory(
      user_id,
      String(from_date),
      String(to_date),
      Number(page) || 1,
      Number(size) || 20
    );

    return { success: true, ...data };
  };

  public todaySales = async (req: Request) => {
    const conn = this.models.salesPurchasesReport(req);

    const data = await conn.salesPurchaseReport();

    return { success: true, data };
  };

  public paymentAndPurchase = async (req: Request) => {
    const conn = this.models.salesPurchasesReport(req);

    const data = await conn.paymentAndPurchase();

    return { success: true, data };
  };

  public getOnlineTrxnCharge = async (req: Request) => {
    const { page, size, from_date, to_date } = req.query;

    const conn = this.models.profitLossReport(req);

    const data = await conn.getOnlineTrxnCharge(
      Number(page) || 1,
      Number(size) || 20,
      String(from_date),
      String(to_date)
    );

    const count = await conn.countOnlineTrxnChargeDataRow(
      String(from_date),
      String(to_date)
    );

    return { success: true, count, data };
  };

  payrollReport = async (req: Request) => {
    const { payroll_id } = req.params as { payroll_id: string };

    const { from_date, to_date, page, size } = req.query as {
      from_date: string;
      to_date: string;
      page: string;
      size: string;
    };

    const conn = this.models.profitLossReport(req);

    const data = await conn.payrollReport(
      payroll_id,
      from_date,
      to_date,
      Number(page) || 1,
      Number(size) || 20
    );

    return { success: true, message: 'Get all payroll', ...data };
  };

  public getTaxReport = async (req: Request) => {
    const { from_date, to_date, page, size } = req.query as {
      from_date: string;
      to_date: string;
      page: string;
      size: string;
    };
    const conn = this.models.salesPurchasesReport(req);

    const data = await conn.getTaxReport(
      from_date,
      to_date,
      Number(page) || 1,
      Number(size) || 20
    );

    return { success: true, ...data };
  };

  public getOtherTaxReport = async (req: Request) => {
    const { from_date, to_date, page, size } = req.query as {
      from_date: string;
      to_date: string;
      page: string;
      size: string;
    };
    const conn = this.models.salesPurchasesReport(req);

    const { count, data } = await conn.getOtherTaxReport(
      from_date,
      to_date,
      Number(page) || 1,
      Number(size) || 20
    );

    const sum = await conn.getSumTaxAmount(from_date, to_date);

    return { success: true, count, data: { list: data, ...sum } };
  };

  public getDailySalesReport = async (req: Request) => {
    const { comb_client, employee_id, product_id } = req.body as {
      comb_client: string;
      employee_id: number;
      product_id: number;
    };
    const { from_date, to_date, page, size } = req.query as {
      from_date: string;
      to_date: string;
      page: string;
      size: string;
    };

    const conn = this.models.salesPurchasesReport(req);
    let combClients;
    let clientId;
    let combineId;
    if (comb_client !== 'all') {
      combClients = separateCombClientToId(comb_client);
    }

    if (combClients?.client_id) {
      clientId = combClients.client_id;
    }

    if (combClients?.combined_id) {
      combineId = combClients.combined_id;
    }

    const data = await conn.getDailySalesReport(
      clientId as number,
      combineId as number,
      employee_id,
      product_id,
      from_date,
      to_date,
      Number(page || 1),
      Number(size || 20)
    );

    return { success: true, ...data };
  };

  // AIR TICKET TOTAL REPORT
  airTicketTotalReport = async (req: Request) => {
    const { from_date, to_date, page, size, client } = req.query as {
      from_date: string;
      to_date: string;
      page: string;
      size: string;
      client: string;
    };

    const conn = this.models.reportModel(req);

    const data = await conn.getAirTicketTotalReport(
      from_date,
      to_date,
      page,
      size,
      client
    );

    return { success: true, message: 'Air ticket total report', ...data };
  };

  airTicketDetails = async (req: Request) => {
    const { from_date, to_date, page, size, client } = req.query as {
      from_date: string;
      to_date: string;
      page: string;
      size: string;
      client: string;
    };

    const conn = this.models.reportModel(req);

    const data = await conn.airTicketDetailsReport(
      from_date,
      to_date,
      Number(page),
      Number(size),
      client
    );

    const sum = await conn.airTicketDetailsSumCostPurchase(
      from_date,
      to_date,
      client
    );

    const count = await conn.airTicketDetailsCount(from_date, to_date, client);

    return { success: true, data: { list: data, ...sum }, count };
  };
  invoiceAndMoneyReceiptDiscount = async (req: Request) => {
    const { from_date, to_date } = req.query as {
      from_date: string;
      to_date: string;
    };

    if (!from_date || !to_date) {
      return {
        success: true,
        error: 'From date and to date is required !',
        data: null,
      };
    }

    const conn = this.models.reportModel(req);

    const data = await conn.invoiceAndMoneyReceiptDiscount(from_date, to_date);

    return { success: true, data };
  };

  // SALES MAN WISE CLIENT TOTAL DUE
  public salesManWiseClientTotalDue = async (req: Request) => {
    const sales_man_id = req.params.salesman_id;

    const { page, size } = req.query;

    const conn = this.models.salesPurchasesReport(req);

    const data = await conn.salesManWiseClientTotalDue(
      sales_man_id,
      Number(page) || 1,
      Number(size) || 20
    );

    return { success: true, ...data };
  };
}

export default ReportServices;
