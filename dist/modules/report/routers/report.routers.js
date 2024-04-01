"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_routers_1 = __importDefault(require("../../../abstracts/abstract.routers"));
const report_controllers_1 = __importDefault(require("../controllers/report.controllers"));
class ReportRouter extends abstract_routers_1.default {
    constructor() {
        super();
        this.controllers = new report_controllers_1.default();
        this.callRouter();
    }
    callRouter() {
        /**
         * LEDGERS
         */
        this.routers.get('/client-ledger/:client_id', this.controllers.getClientLedger);
        this.routers.get('/vendors-ledger/:vendor_id', this.controllers.getVendorLedger);
        this.routers.get('/combineds-ledger/:combined_id', this.controllers.getCombinedReport);
        this.routers.get('/agents-report/:agent_id', this.controllers.agentsReport);
        /* AIR TICKET TOTAL REPORT */
        this.routers.get('/air-ticket-summary', this.controllers.airTicketTotalReport);
        this.routers.get('/air-ticket-summary-excel', this.controllers.airTicketTotalReportExcel);
        this.routers.get('/air-ticket-details', this.controllers.airTicketDetails);
        this.routers.get('/air-ticket-details-excel', this.controllers.airTicketDetailsReportExcel);
        /**
         * TOTAL DUE ADVANCE
         */
        this.routers.get('/client-advance-due/:client_id', this.controllers.clientDueAdvance);
        this.routers.get('/vendor-advance-due/:vendor_id', this.controllers.vendorDueAdvance);
        this.routers.get('/due-advance/combined/:combined_id', this.controllers.getDueAdvanceCombined);
        this.routers.get('/vendors-purchase-payment/:comb_vendor', this.controllers.getVendorPurchaseAndPayment);
        this.routers.get('/loan-report/:authority/:loan_type', this.controllers.loanReport);
        this.routers.get('/loan-summary/report', this.controllers.getLoanSummary);
        this.routers.get('/client-by-category/:category_id', this.controllers.getClientByCategory);
        /**
         * SALES REPORT
         */
        this.routers.post('/sales-collection/client', this.controllers.getClientSales);
        this.routers.post('/sales-report-item/salesman', this.controllers.salesReportItemSalesman);
        this.routers.get('/airline-wise-sales-report/:airline', this.controllers.airlineWiseSalesReport);
        this.routers.post('/sales-earning', this.controllers.getSalesReport);
        this.routers.get('/sales_report_collection_due', this.controllers.salesReportCollectionDue);
        this.routers.get('/sales-man-report-collection-due/:sales_man_id', this.controllers.salesManReportCollectionDue);
        // SALES REPORT
        this.routers.post('/daily-sales-report', this.controllers.getDailySalesReport);
        this.routers.get('/daily-sales-report/excel', this.controllers.getDailySalesReportExcel);
        /**
         * PROFIT LOSS
         */
        this.routers.get('/overall-profit-loss', this.controllers.overallProfitLoss);
        this.routers.get('/overall-sales-summery', this.controllers.getOverallSalesSummery);
        this.routers.get('/overall-client-refunds', this.controllers.getOverallClientRefund);
        this.routers.get('/visa-profit-loss/:visa_id', this.controllers.visaWiseProfitLoss);
        this.routers.get('/ticket-wise-profit-loss/:ticket_id', this.controllers.ticketWiseProfitLoss);
        this.routers.get('/visa-list', this.controllers.getVisaList);
        this.routers.post('/user-login-history', this.controllers.userLoginHistory);
        this.routers.post('/pre-registration', this.controllers.preRegistrationList);
        this.routers.get('/client-wise-passenger-list/:id', this.controllers.clientWisePassangerList);
        this.routers.get('/country-wise-report/:country_id', this.controllers.countryWiseReport);
        this.routers.get('/passport-wise-report/:id', this.controllers.passportWiseReport);
        this.routers.post('/passport-status-report', this.controllers.passportStatusReport);
        this.routers.get('/monthly-summary', this.controllers.monthlySummary);
        this.routers.get('/daily-summary', this.controllers.dailySummary);
        this.routers.get('/refund-report-client', this.controllers.refundReportClient);
        this.routers.get('/refund-report-vendor', this.controllers.refundReportVandor);
        this.routers.get('/salesman-collection-due/:salesman_id', this.controllers.salesManWiseCollectionDue);
        this.routers.get('/sales_report_collection_due', this.controllers.salesReportCollectionDue);
        this.routers.get('/head-wise-expense-report/:head_id', this.controllers.headWiseExpenseReport);
        this.routers.get('/account-report/:account_id', this.controllers.accountReport);
        this.routers.get('/gds-report/:gds_id', this.controllers.GDSReport);
        this.routers.get('/ait-report/:vendor_id', this.controllers.AITReport);
        this.routers.get('/client-discount/:client_id', this.controllers.getClientDiscount);
        this.routers.post('/journey-date-wise-client-report', this.controllers.journeyDateWiseClientReport);
        this.routers.get('/all-ticket-info', this.controllers.getAllTicketNo);
        this.routers.get('/group-wise-passenger-list/:group_id', this.controllers.groupWisePassengerList);
        this.routers.get('/employe-expense/:employee_id', this.controllers.getEmployeExpense);
        this.routers.get('/invoice-categorys', this.controllers.getAllInvoiceCategory);
        this.routers.get('/audit/:user_id', this.controllers.getAuditHistory);
        this.routers.get('/payroll-report/:payroll_id', this.controllers.payrollReport);
        // today report
        this.routers.get('/today/sales-report', this.controllers.todaySales);
        this.routers.get('/today/payment-purchase', this.controllers.paymentAndPurchase);
        this.routers.get('/online-trxn-charge', this.controllers.getOnlineTrxnCharge);
        this.routers.get('/vendor-purches/:comb_vendor', this.controllers.getInvoicePurches);
        this.routers.get('/tax-report', this.controllers.getTaxReport);
        this.routers.get('/other-tax-report', this.controllers.getOtherTaxReport);
        this.routers.get('/void-invoices', this.controllers.voidInvoices);
        // excel report
        /**
         * ledger
         */
        this.routers.post('/air-ticket-custom-excel', this.controllers.customAirTicketReportExcel);
        this.routers.get('/client_ledger_excel/:client_id', this.controllers.getClientLedgersExcel);
        this.routers.get('/vendor_ledger_excel/:vendor_id', this.controllers.getVendorLedgersExcel);
        this.routers.get('/combined_ledger_excel/:combined_id', this.controllers.getCombinedLedgersExcel);
        this.routers.get('/due-advance/agents/:agent_id', this.controllers.getAgentsDueAdvance);
        /**
         * Total Due/Advance
         */
        this.routers.get('/totalDueAdvance/clients/:client_id', this.controllers.getDueAdvanceClientExcel);
        this.routers.get('/totalDueAdvance/vendor/:vendor_id', this.controllers.getDueAdvanceVendorExcel);
        this.routers.get('/totalDueAdvance/agent/:agent_id', this.controllers.getDueAdvanceAgentExcel);
        this.routers.get('/totalDueAdvance/combined_client/:combined_client_id', this.controllers.getDueAdvanceCombinedClientExcel);
        /**
         * Sales Report
         */
        this.routers.post('/sales/monthlySalesAndEarning', this.controllers.getMonthlySalesAndEarningExcel);
        this.routers.get('/sales/airlineWiseReport/:airline', this.controllers.getAirlineWiseExcel);
        this.routers.post('/sales/salesManItem', this.controllers.getSalesManItemExcel);
        this.routers.post('/sales/clientWiseCollectionSalesReport', this.controllers.getclientWiseCollectionSalesReportExcel);
        this.routers.get('/sales/vendorWisePurchasePaymentReport/:comb_vendor', this.controllers.getVendorWisePurchasePaymentExcel);
        this.routers.get('/sales/salesManCollectionAndDue/:salesman_id', this.controllers.getSalesManCollectionAndDueExcel);
        this.routers.get('/sales/dailyCollectionPayment/salesCollection', this.controllers.getDailySalesCollectionReportExcel);
        this.routers.get('/sales/dailyCollectionPayment/purcheasePayment', this.controllers.getDailyPurchasePaymentExcel);
        this.routers.get('/profitLoss/visaWiseProfitLoss/:visa_id', this.controllers.getVisaWiseProfitLossExcel);
        this.routers.get('/profitLoss/overAllProfitLoss', this.controllers.getOverAllProfitLossExcel);
        this.routers.get('/profitLoss/ticketWiseProfit/:ticket_id', this.controllers.getTicketWiseProfitExcelReport);
        this.routers.get('/expense/employeeExpense/:employee_id', this.controllers.getEmployeeExpenseExcel);
        this.routers.get('/expense/expenseReport/:head_id', this.controllers.getExpenseReportExcel);
        this.routers.post('/passport/passportStatusReport', this.controllers.getPassportStatusReportExcel);
        this.routers.get('/passport/passportWiseReport/:id', this.controllers.getPassportWiseReportExcel);
        this.routers.get('/passenger/clientWisePassengerList/:id', this.controllers.getClientWisePassengerListExcel);
        this.routers.get('/passenger/groupWisePassengerList/:group_id', this.controllers.getGroupWisePassengerListExcel);
        this.routers.get('/clientDiscount/:client_id', this.controllers.getClientDiscountExcel);
        this.routers.post('/journeyDateWiseClient', this.controllers.getJourneyDateWiseClientExcelReport);
        this.routers.get('/AitReport/:vendor_id', this.controllers.getAitReportReport);
        this.routers.get('/gdsReport/:gds_id', this.controllers.getGDSReport);
        this.routers.get('/accountsReport/:account_id', this.controllers.getAccountsReport);
        this.routers.get('/accountsStatment/:account_id', this.controllers.getAccountsStatementExcel);
        this.routers.get('/loanReports/:authority/:loan_type', this.controllers.getLoanReports);
        this.routers.get('/onlineTrxnChargeReport', this.controllers.getOnlineTrxnChargeReport);
        this.routers.get('/refundReportClient', this.controllers.getRefundReportClient);
        this.routers.get('/refundReportVendor', this.controllers.getRefundReportVendor);
        this.routers.get('/daily-summery', this.controllers.getSummaryDailyReport);
        this.routers.get('/monthly-summery', this.controllers.getSummaryMonthlyReport);
        this.routers.get('/countryWiseReport/:country_id', this.controllers.getCountryWiseReport);
        this.routers.post('/preRegistrationReport', this.controllers.getPreRegistrationReport);
        this.routers.post('/userLoginHistory', this.controllers.getUserLoginHistory);
        this.routers.get('/voidList', this.controllers.getVoidList);
        this.routers.get('/auditTrail/:user_id', this.controllers.getAuditTrail);
        this.routers.get('/onlineTrxnChargeReport', this.controllers.getOnlineTrxnChargeReport);
        this.routers.get('/accountTransactionHistory/:account_id', this.controllers.getAccountTransactionHistory);
        this.routers.get('/client-all', this.controllers.getClientAll);
        this.routers.get('/combined-Client-all', this.controllers.getCombinedClientAll);
        /**
         * vendor
         */
        this.routers.get('/vendor-all', this.controllers.getVendorAll);
    }
}
exports.default = ReportRouter;
//# sourceMappingURL=report.routers.js.map