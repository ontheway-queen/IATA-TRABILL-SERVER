import { Request, Response } from 'express';
import AbstractController from '../../../abstracts/abstract.controllers';
import ReportServices from '../services/report.services';
import ReportValidator from '../validators/report.validator';
import ReportExcelServices from '../services/excels/reportExcel.services';
class ReportController extends AbstractController {
  private validator = new ReportValidator();
  private services = new ReportServices();
  private excels = new ReportExcelServices();

  constructor() {
    super();
  }

  public getClientLedger = this.assyncWrapper.wrap(
    this.validator.report_ledgers,
    async (req: Request, res: Response) => {
      const data = await this.services.getClientLedger(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Get client ledger report...');
      }
    }
  );

  public getVendorLedger = this.assyncWrapper.wrap(
    this.validator.report_ledgers,
    async (req: Request, res: Response) => {
      const data = await this.services.getVendorLedger(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Get vendor ledger report...');
      }
    }
  );
  public getVendorPurchaseAndPayment = this.assyncWrapper.wrap(
    this.validator.readReport,
    async (req: Request, res: Response) => {
      const data = await this.services.getVendorPurchaseAndPayment(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Get vendor ledger report...');
      }
    }
  );
  public getCombinedReport = this.assyncWrapper.wrap(
    this.validator.report_ledgers,
    async (req: Request, res: Response) => {
      const data = await this.services.getCombinedReport(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Get combined ledger report...');
      }
    }
  );

  public getClientByCategory = this.assyncWrapper.wrap(
    this.validator.readReport,
    async (req: Request, res: Response) => {
      const data = await this.services.getClientByCategory(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Get client due or advance...');
      }
    }
  );

  public clientDueAdvance = this.assyncWrapper.wrap(
    this.validator.readReport,
    async (req: Request, res: Response) => {
      const data = await this.services.clientDueAdvance(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Get client due or advance...');
      }
    }
  );

  public vendorDueAdvance = this.assyncWrapper.wrap(
    this.validator.readReport,
    async (req: Request, res: Response) => {
      const data = await this.services.vendorDueAdvance(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Get vendor due or advance...');
      }
    }
  );

  public getAgentsDueAdvance = this.assyncWrapper.wrap(
    this.validator.readReport,
    async (req: Request, res: Response) => {
      const data = await this.services.getAgentsDueAdvance(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Get vendor due or advance...');
      }
    }
  );

  public getDueAdvanceCombined = this.assyncWrapper.wrap(
    this.validator.readReport,
    async (req: Request, res: Response) => {
      const data = await this.services.getDueAdvanceCombined(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Get combined client due or advance...');
      }
    }
  );

  public loanReport = this.assyncWrapper.wrap(
    this.validator.readReport,
    async (req: Request, res: Response) => {
      const data = await this.services.loanReport(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('');
      }
    }
  );
  public getLoanSummary = this.assyncWrapper.wrap(
    this.validator.readReport,
    async (req: Request, res: Response) => {
      const data = await this.services.getLoanSummary(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('');
      }
    }
  );

  public getClientSales = this.assyncWrapper.wrap(
    this.validator.readReport,
    async (req: Request, res: Response) => {
      const data = await this.services.getClientSales(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Get client sales and collection report...');
      }
    }
  );

  public getSalesReport = this.assyncWrapper.wrap(
    this.validator.readReport,
    async (req: Request, res: Response) => {
      const data = await this.services.getSalesReport(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Get sales report and earning...');
      }
    }
  );

  public overallProfitLoss = this.assyncWrapper.wrap(
    this.validator.readReport,
    async (req: Request, res: Response) => {
      const data = await this.services.overallProfitLoss(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Overall profit and loss...');
      }
    }
  );

  public getOverallSalesSummery = this.assyncWrapper.wrap(
    this.validator.readReport,
    async (req: Request, res: Response) => {
      const data = await this.services.getOverallSalesSummery(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Overall profit and loss...');
      }
    }
  );

  public getOverallClientRefund = this.assyncWrapper.wrap(
    this.validator.readReport,
    async (req: Request, res: Response) => {
      const data = await this.services.getOverallClientRefund(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Overall profit and loss...');
      }
    }
  );

  public getOverallPurchase = this.assyncWrapper.wrap(
    this.validator.readReport,
    async (req: Request, res: Response) => {
      const data = await this.services.getOverallPurchase(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Overall profit and loss...');
      }
    }
  );

  payrollReport = this.assyncWrapper.wrap(
    this.validator.readPayroll,
    async (req: Request, res: Response) => {
      const data = await this.services.payrollReport(req);

      if (data.success) {
        res.status(200).json(data);
      }
    }
  );

  public getVisaList = this.assyncWrapper.wrap(
    this.validator.readReport,
    async (req: Request, res: Response) => {
      const data = await this.services.getVisaList(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('get all visa list...');
      }
    }
  );

  public visaWiseProfitLoss = this.assyncWrapper.wrap(
    this.validator.readReport,
    async (req: Request, res: Response) => {
      const data = await this.services.visaWiseProfitLoss(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Visa wise profit and loss...');
      }
    }
  );

  public userLoginHistory = this.assyncWrapper.wrap(
    this.validator.readReport,
    async (req: Request, res: Response) => {
      const data = await this.services.userLoginHistory(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Get User Login History...');
      }
    }
  );

  public preRegistrationList = this.assyncWrapper.wrap(
    this.validator.readReport,

    async (req: Request, res: Response) => {
      const data = await this.services.preRegistrationList(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Get Pre Registration Report...');
      }
    }
  );

  public clientWisePassangerList = this.assyncWrapper.wrap(
    this.validator.readReport,

    async (req: Request, res: Response) => {
      const data = await this.services.clientWisePassengerList(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Get Client Wise Passanger List...');
      }
    }
  );

  public countryWiseReport = this.assyncWrapper.wrap(
    this.validator.readReport,

    async (req: Request, res: Response) => {
      const data = await this.services.countryWiseReport(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Get Country Wise Report...');
      }
    }
  );

  public passportWiseReport = this.assyncWrapper.wrap(
    this.validator.readReport,

    async (req: Request, res: Response) => {
      const data = await this.services.passportWiseReport(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Get Passport Wise Report...');
      }
    }
  );

  public passportStatusReport = this.assyncWrapper.wrap(
    this.validator.readReport,

    async (req: Request, res: Response) => {
      const data = await this.services.passportStatusReport(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Get Passport Status Report...');
      }
    }
  );

  public monthlySummary = this.assyncWrapper.wrap(
    this.validator.readReport,

    async (req: Request, res: Response) => {
      const data = await this.services.monthlySummary(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Get Monthly Summary...');
      }
    }
  );

  public dailySummary = this.assyncWrapper.wrap(
    this.validator.readReport,

    async (req: Request, res: Response) => {
      const data = await this.services.dailySummary(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Get Daily Summary...');
      }
    }
  );

  public refundReportClient = this.assyncWrapper.wrap(
    this.validator.readReport,

    async (req: Request, res: Response) => {
      const data = await this.services.refundReportClient(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Get Refund Report...');
      }
    }
  );

  public refundReportVendor = this.assyncWrapper.wrap(
    this.validator.readReport,

    async (req: Request, res: Response) => {
      const data = await this.services.refundReportVendor(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Get Refund Report...');
      }
    }
  );

  public salesReportItemSalesman = this.assyncWrapper.wrap(
    this.validator.readReport,
    async (req: Request, res: Response) => {
      const data = await this.services.salesReportItemSalesman(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Get Item Sales Man-Wise Sales Report...');
      }
    }
  );

  public salesManWiseCollectionDue = this.assyncWrapper.wrap(
    this.validator.readReport,
    async (req: Request, res: Response) => {
      const data = await this.services.salesManWiseCollectionDue(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Get Sales Report...');
      }
    }
  );

  public salesReportCollectionDue = this.assyncWrapper.wrap(
    this.validator.readReport,
    async (req: Request, res: Response) => {
      const data = await this.services.salesReportCollectionDue(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Get Sales Report Collection & Due...');
      }
    }
  );

  public headWiseExpenseReport = this.assyncWrapper.wrap(
    this.validator.readReport,
    async (req: Request, res: Response) => {
      const data = await this.services.headWiseExpenseReport(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Get Sub Wise Expense Report...');
      }
    }
  );

  public accountReport = this.assyncWrapper.wrap(
    this.validator.readReport,
    async (req: Request, res: Response) => {
      const data = await this.services.accountReport(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Get Account Report...');
      }
    }
  );

  public salesManReportCollectionDue = this.assyncWrapper.wrap(
    this.validator.readReport,

    async (req: Request, res: Response) => {
      const data = await this.services.salesManReportCollectionDue(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Get Sales Report -Sales Man Collection & Due...');
      }
    }
  );

  public GDSReport = this.assyncWrapper.wrap(
    this.validator.readReport,

    async (req: Request, res: Response) => {
      const data = await this.services.GDSReport(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Get GDS Report...');
      }
    }
  );

  public AITReport = this.assyncWrapper.wrap(
    this.validator.readReport,
    async (req: Request, res: Response) => {
      const data = await this.services.AITReport(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Get AIT Report...');
      }
    }
  );

  public voidInvoices = this.assyncWrapper.wrap(
    this.validator.readReport,
    async (req: Request, res: Response) => {
      const data = await this.services.voidInvoices(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Void invoices');
      }
    }
  );

  public airlineWiseSalesReport = this.assyncWrapper.wrap(
    this.validator.readReport,
    async (req: Request, res: Response) => {
      const data = await this.services.airlineWiseSalesReport(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Get Airline Wise Sales Report...');
      }
    }
  );

  public getClientDiscount = this.assyncWrapper.wrap(
    this.validator.readReport,
    async (req: Request, res: Response) => {
      const data = await this.services.getClientDiscount(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Get Client Discount...');
      }
    }
  );

  public journeyDateWiseClientReport = this.assyncWrapper.wrap(
    this.validator.readReport,
    async (req: Request, res: Response) => {
      const data = await this.services.journeyDateWiseclientReport(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Get Journey Wise Client Report...');
      }
    }
  );

  public ticketWiseProfitLoss = this.assyncWrapper.wrap(
    this.validator.readReport,
    async (req: Request, res: Response) => {
      const data = await this.services.ticketWiseProfitLoss(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Get Ticket Wise Profit Loss...');
      }
    }
  );

  public getAllTicketNo = this.assyncWrapper.wrap(
    this.validator.readReport,
    async (req: Request, res: Response) => {
      const data = await this.services.getAllTicketNo(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Get All Ticket No...');
      }
    }
  );

  public groupWisePassengerList = this.assyncWrapper.wrap(
    this.validator.readReport,
    async (req: Request, res: Response) => {
      const data = await this.services.groupWisePassengerList(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Get Group Wise Passenger List...');
      }
    }
  );

  public agentsReport = this.assyncWrapper.wrap(
    this.validator.report_ledgers,
    async (req: Request, res: Response) => {
      const data = await this.services.agentsReport(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Get Agents Report...');
      }
    }
  );

  public getEmployeExpense = this.assyncWrapper.wrap(
    this.validator.readReport,
    async (req: Request, res: Response) => {
      const data = await this.services.getEmployeeExpense(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Get Employee Expense Report...');
      }
    }
  );

  public getAllInvoiceCategory = this.assyncWrapper.wrap(
    this.validator.readReport,
    async (req: Request, res: Response) => {
      const data = await this.services.getAllInvoiceCategory(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Get All invoice categories...');
      }
    }
  );

  public getAuditHistory = this.assyncWrapper.wrap(
    this.validator.readReport,
    async (req: Request, res: Response) => {
      const data = await this.services.getAuditHistory(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('get ait reports...');
      }
    }
  );

  public todaySales = this.assyncWrapper.wrap(
    this.validator.readReport,
    async (req: Request, res: Response) => {
      const data = await this.services.todaySales(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('get ait reports...');
      }
    }
  );

  public paymentAndPurchase = this.assyncWrapper.wrap(
    this.validator.readReport,
    async (req: Request, res: Response) => {
      const data = await this.services.paymentAndPurchase(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('get ait reports...');
      }
    }
  );

  public getOnlineTrxnCharge = this.assyncWrapper.wrap(
    this.validator.readReport,
    async (req: Request, res: Response) => {
      const data = await this.services.getOnlineTrxnCharge(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('');
      }
    }
  );

  public invoiceAndMoneyReceiptDiscount = this.assyncWrapper.wrap(
    this.validator.readReport,
    async (req: Request, res: Response) => {
      const data = await this.services.invoiceAndMoneyReceiptDiscount(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('');
      }
    }
  );

  public getInvoicePurches = this.assyncWrapper.wrap(
    this.validator.readReport,
    async (req: Request, res: Response) => {
      const data = await this.excels.getInvoicePurches(req);

      if (data.success) {
        res.status(200).send(data);
      } else {
        this.error('');
      }
    }
  );

  public getTaxReport = this.assyncWrapper.wrap(
    this.validator.readReport,
    async (req: Request, res: Response) => {
      const data = await this.services.getTaxReport(req);

      if (data.success) {
        res.status(200).send(data);
      } else {
        this.error('');
      }
    }
  );

  public getOtherTaxReport = this.assyncWrapper.wrap(
    this.validator.readReport,
    async (req: Request, res: Response) => {
      const data = await this.services.getOtherTaxReport(req);

      if (data.success) {
        res.status(200).send(data);
      } else {
        this.error('');
      }
    }
  );

  public getDailySalesReport = this.assyncWrapper.wrap(
    this.validator.readCollectionSales,
    async (req: Request, res: Response) => {
      const data = await this.services.getDailySalesReport(req);

      res.status(200).json(data);
    }
  );
  // excel report
  /**
   * ledgers
   */
  public getClientLedgersExcel = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data: any = await this.excels.getClientLedgersExcel(req, res);
    }
  );

  public getVendorLedgersExcel = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data: any = await this.excels.getVendorLedgersExcel(req, res);
    }
  );

  public getCombinedLedgersExcel = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data: any = await this.excels.getCombinedLedgersExcel(req, res);
    }
  );

  /**
   * total due/advance
   */
  public getDueAdvanceClientExcel = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data: any = await this.excels.getDueAdvanceClientExcel(req, res);
    }
  );

  public getDueAdvanceVendorExcel = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data: any = await this.excels.getDueAdvanceVendorExcel(req, res);
    }
  );

  public getDueAdvanceAgentExcel = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data: any = await this.excels.getDueAdvanceAgentExcel(req, res);
    }
  );

  public getDueAdvanceCombinedClientExcel = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data: any = await this.excels.getDueAdvanceCombinedClientExcel(
        req,
        res
      );
    }
  );

  /**
   * sales and earning
   */
  public getMonthlySalesAndEarningExcel = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data: any = await this.excels.getMonthlySalesEarninghExcel(
        req,
        res
      );
    }
  );
  public getDailySalesReportExcel = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data: any = await this.excels.getDailySalesReportExcel(req, res);
    }
  );

  public getAirlineWiseExcel = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data: any = await this.excels.getAirlineWiseReportExcel(req, res);
    }
  );

  public getSalesManItemExcel = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data: any = await this.excels.getSalesManItemExcel(req, res);
    }
  );

  public getclientWiseCollectionSalesReportExcel = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data: any =
        await this.excels.getClientWiseCollectionSalesReportExcel(req, res);
    }
  );

  public getVendorWisePurchasePaymentExcel = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data: any =
        await this.excels.getVendorWisePurchasePaymentReportExcel(req, res);
    }
  );

  public getSalesManCollectionAndDueExcel = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data: any = await this.excels.getSalesManCollectionAndDueExcel(
        req,
        res
      );
    }
  );
  public getDailySalesCollectionReportExcel = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data: any = await this.excels.getDailySalesCollectionReportExcel(
        req,
        res
      );
    }
  );

  public getDailyPurchasePaymentExcel = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data: any = await this.excels.getDailyPurchasePaymentExcel(
        req,
        res
      );
    }
  );
  /**
   * profit loss
   */

  public getVisaWiseProfitLossExcel = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      await this.excels.getVisaWiseProfitLossExcel(req, res);
    }
  );

  public getOverAllProfitLossExcel = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      await this.excels.getOverAllProfitLossExcel(req, res);
    }
  );
  public getTicketWiseProfitExcelReport = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      await this.excels.getTicketWiseProfitExcel(req, res);
    }
  );
  /**
   * Expense report
   */
  public getEmployeeExpenseExcel = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      await this.excels.getEmployeeExpenseExcel(req, res);
    }
  );

  public getExpenseReportExcel = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      await this.excels.getExpenseReportExcel(req, res);
    }
  );
  /**
   * Passport Report
   */
  public getPassportStatusReportExcel = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      await this.excels.getPassportStatusReportExcel(req, res);
    }
  );

  public getPassportWiseReportExcel = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      await this.excels.getPassportWiseReportExcel(req, res);
    }
  );

  /**
   * passenger list
   */
  public getClientWisePassengerListExcel = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      await this.excels.getClientWisePassengerListExcel(req, res);
    }
  );

  public getGroupWisePassengerListExcel = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      await this.excels.getGroupWisePassengerListExcel(req, res);
    }
  );
  /**
   * Client Discount
   */
  public getClientDiscountExcel = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      await this.excels.getClientDiscountExcel(req, res);
    }
  );
  /**
   * journey date wise client
   */
  public getJourneyDateWiseClientExcelReport = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      await this.excels.getJourneyDateWiseClientExcel(req, res);
    }
  );
  /**
   * Ait Report
   */
  public getAitReportReport = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      await this.excels.getAitReportExcel(req, res);
    }
  );
  /**
   * GDS Report
   */
  public getGDSReport = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      await this.excels.getGDSReportExcel(req, res);
    }
  );
  /**
   * accounts Report
   */
  public getAccountsReport = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      await this.excels.getAccountsReportExcel(req, res);
    }
  );

  public getAccountsStatementExcel = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      await this.excels.getAccountsStatementExcel(req, res);
    }
  );

  /**
   * Loan Reports
   */
  public getLoanReports = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      await this.excels.getLoanReportsExcel(req, res);
    }
  );

  /**
   * ONLINE TRXN CHARGE REPORT
   */

  public getOnlineTrxnChargeReport = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      await this.excels.getOnlineTrxnChargeReportExcel(req, res);
    }
  );

  /**
   * REFUND REPORT
   */
  public getRefundReportClient = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      await this.excels.getRefundReportClientExcel(req, res);
    }
  );

  public getRefundReportVendor = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      await this.excels.getRefundReportVendorExcel(req, res);
    }
  );

  /**
   * Summary (Daily&Monthly) Report
   */
  public getSummaryDailyReport = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      await this.excels.getSummaryDailyReportExcel(req, res);
    }
  );

  public getSummaryMonthlyReport = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      await this.excels.getSummaryMonthlyReportExcel(req, res);
    }
  );

  /**
   * COUNTRY WISE REPORT
   */
  public getCountryWiseReport = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      await this.excels.getCountryWiseReportExcel(req, res);
    }
  );

  /**
   * Pre Registration Report
   */

  public getPreRegistrationReport = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      await this.excels.getPreRegistrationReportExcel(req, res);
    }
  );

  /**
   * UASER LOGIN HISTORY
   */
  public getUserLoginHistory = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      await this.excels.getUserLoginHistoryExcel(req, res);
    }
  );

  /**
   * Void List
   */
  public getVoidList = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      await this.excels.getVoidListExcel(req, res);
    }
  );
  /**
   * audit Trail
   */
  public getAuditTrail = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      await this.excels.getAuditTrailExcel(req, res);
    }
  );

  /**
   * account transaction history
   */
  public getAccountTransactionHistory = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      await this.excels.getAccountTransactionHistoryExcel(req, res);
    }
  );

  /**
   * client all
   */
  public getClientAll = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      await this.excels.getAllClientExcel(req, res);
    }
  );

  public getCombinedClientAll = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      await this.excels.getAllCombinedClientExcel(req, res);
    }
  );

  /**
   * vendor
   */

  public getVendorAll = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      await this.excels.getVendorAllExcel(req, res);
    }
  );

  /**
   * AIR TICKET TOTAL REPORT
   */

  public airTicketTotalReport = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.services.airTicketTotalReport(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Air ticket total summary report');
      }
    }
  );

  public airTicketDetails = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.services.airTicketDetails(req);
      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Air ticket total summary report');
      }
    }
  );

  public airTicketTotalReportExcel = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      await this.excels.airTicketTotalReportExcel(req, res);
    }
  );

  public airTicketDetailsReportExcel = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      await this.excels.airTicketDetailsReportExcel(req, res);
    }
  );

  public customAirTicketReportExcel = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      await this.excels.customAirTicketReportExcel(req, res);
    }
  );

  // SALES MAN WISE CLIENT TOTAL DUE
  public salesManWiseClientTotalDue = this.assyncWrapper.wrap(
    this.validator.readReport,
    async (req: Request, res: Response) => {
      const data = await this.services.salesManWiseClientTotalDue(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Get Sales Report...');
      }
    }
  );
}

export default ReportController;
