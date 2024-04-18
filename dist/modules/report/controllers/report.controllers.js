"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_controllers_1 = __importDefault(require("../../../abstracts/abstract.controllers"));
const report_services_1 = __importDefault(require("../services/report.services"));
const report_validator_1 = __importDefault(require("../validators/report.validator"));
const reportExcel_services_1 = __importDefault(require("../services/excels/reportExcel.services"));
class ReportController extends abstract_controllers_1.default {
    constructor() {
        super();
        this.validator = new report_validator_1.default();
        this.services = new report_services_1.default();
        this.excels = new reportExcel_services_1.default();
        this.getClientLedger = this.assyncWrapper.wrap(this.validator.report_ledgers, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getClientLedger(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Get client ledger report...');
            }
        }));
        this.getVendorLedger = this.assyncWrapper.wrap(this.validator.report_ledgers, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getVendorLedger(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Get vendor ledger report...');
            }
        }));
        this.getVendorPurchaseAndPayment = this.assyncWrapper.wrap(this.validator.readReport, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getVendorPurchaseAndPayment(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Get vendor ledger report...');
            }
        }));
        this.getCombinedReport = this.assyncWrapper.wrap(this.validator.report_ledgers, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getCombinedReport(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Get combined ledger report...');
            }
        }));
        this.getClientByCategory = this.assyncWrapper.wrap(this.validator.readReport, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getClientByCategory(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Get client due or advance...');
            }
        }));
        this.clientDueAdvance = this.assyncWrapper.wrap(this.validator.readReport, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.clientDueAdvance(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Get client due or advance...');
            }
        }));
        this.vendorDueAdvance = this.assyncWrapper.wrap(this.validator.readReport, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.vendorDueAdvance(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Get vendor due or advance...');
            }
        }));
        this.getAgentsDueAdvance = this.assyncWrapper.wrap(this.validator.readReport, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAgentsDueAdvance(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Get vendor due or advance...');
            }
        }));
        this.getDueAdvanceCombined = this.assyncWrapper.wrap(this.validator.readReport, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getDueAdvanceCombined(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Get combined client due or advance...');
            }
        }));
        this.loanReport = this.assyncWrapper.wrap(this.validator.readReport, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.loanReport(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('');
            }
        }));
        this.getLoanSummary = this.assyncWrapper.wrap(this.validator.readReport, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getLoanSummary(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('');
            }
        }));
        this.getClientSales = this.assyncWrapper.wrap(this.validator.readReport, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getClientSales(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Get client sales and collection report...');
            }
        }));
        this.getSalesReport = this.assyncWrapper.wrap(this.validator.readReport, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getSalesReport(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Get sales report and earning...');
            }
        }));
        this.overallProfitLoss = this.assyncWrapper.wrap(this.validator.readReport, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.overallProfitLoss(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Overall profit and loss...');
            }
        }));
        this.getOverallSalesSummery = this.assyncWrapper.wrap(this.validator.readReport, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getOverallSalesSummery(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Overall profit and loss...');
            }
        }));
        this.getOverallClientRefund = this.assyncWrapper.wrap(this.validator.readReport, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getOverallClientRefund(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Overall profit and loss...');
            }
        }));
        this.getOverallPurchase = this.assyncWrapper.wrap(this.validator.readReport, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getOverallPurchase(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Overall profit and loss...');
            }
        }));
        this.payrollReport = this.assyncWrapper.wrap(this.validator.readPayroll, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.payrollReport(req);
            if (data.success) {
                res.status(200).json(data);
            }
        }));
        this.getVisaList = this.assyncWrapper.wrap(this.validator.readReport, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getVisaList(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('get all visa list...');
            }
        }));
        this.visaWiseProfitLoss = this.assyncWrapper.wrap(this.validator.readReport, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.visaWiseProfitLoss(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Visa wise profit and loss...');
            }
        }));
        this.userLoginHistory = this.assyncWrapper.wrap(this.validator.readReport, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.userLoginHistory(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Get User Login History...');
            }
        }));
        this.preRegistrationList = this.assyncWrapper.wrap(this.validator.readReport, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.preRegistrationList(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Get Pre Registration Report...');
            }
        }));
        this.clientWisePassangerList = this.assyncWrapper.wrap(this.validator.readReport, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.clientWisePassengerList(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Get Client Wise Passanger List...');
            }
        }));
        this.countryWiseReport = this.assyncWrapper.wrap(this.validator.readReport, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.countryWiseReport(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Get Country Wise Report...');
            }
        }));
        this.passportWiseReport = this.assyncWrapper.wrap(this.validator.readReport, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.passportWiseReport(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Get Passport Wise Report...');
            }
        }));
        this.passportStatusReport = this.assyncWrapper.wrap(this.validator.readReport, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.passportStatusReport(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Get Passport Status Report...');
            }
        }));
        this.monthlySummary = this.assyncWrapper.wrap(this.validator.readReport, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.monthlySummary(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Get Monthly Summary...');
            }
        }));
        this.dailySummary = this.assyncWrapper.wrap(this.validator.readReport, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.dailySummary(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Get Daily Summary...');
            }
        }));
        this.refundReportClient = this.assyncWrapper.wrap(this.validator.readReport, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.refundReportClient(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Get Refund Report...');
            }
        }));
        this.refundReportVendor = this.assyncWrapper.wrap(this.validator.readReport, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.refundReportVendor(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Get Refund Report...');
            }
        }));
        this.salesReportItemSalesman = this.assyncWrapper.wrap(this.validator.readReport, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.salesReportItemSalesman(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Get Item Sales Man-Wise Sales Report...');
            }
        }));
        this.salesManWiseCollectionDue = this.assyncWrapper.wrap(this.validator.readReport, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.salesManWiseCollectionDue(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Get Sales Report...');
            }
        }));
        this.salesReportCollectionDue = this.assyncWrapper.wrap(this.validator.readReport, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.salesReportCollectionDue(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Get Sales Report Collection & Due...');
            }
        }));
        this.headWiseExpenseReport = this.assyncWrapper.wrap(this.validator.readReport, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.headWiseExpenseReport(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Get Sub Wise Expense Report...');
            }
        }));
        this.accountReport = this.assyncWrapper.wrap(this.validator.readReport, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.accountReport(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Get Account Report...');
            }
        }));
        this.salesManReportCollectionDue = this.assyncWrapper.wrap(this.validator.readReport, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.salesManReportCollectionDue(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Get Sales Report -Sales Man Collection & Due...');
            }
        }));
        this.GDSReport = this.assyncWrapper.wrap(this.validator.readReport, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.GDSReport(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Get GDS Report...');
            }
        }));
        this.AITReport = this.assyncWrapper.wrap(this.validator.readReport, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.AITReport(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Get AIT Report...');
            }
        }));
        this.voidInvoices = this.assyncWrapper.wrap(this.validator.readReport, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.voidInvoices(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Void invoices');
            }
        }));
        this.airlineWiseSalesReport = this.assyncWrapper.wrap(this.validator.readReport, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.airlineWiseSalesReport(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Get Airline Wise Sales Report...');
            }
        }));
        this.getClientDiscount = this.assyncWrapper.wrap(this.validator.readReport, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getClientDiscount(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Get Client Discount...');
            }
        }));
        this.journeyDateWiseClientReport = this.assyncWrapper.wrap(this.validator.readReport, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.journeyDateWiseclientReport(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Get Journey Wise Client Report...');
            }
        }));
        this.ticketWiseProfitLoss = this.assyncWrapper.wrap(this.validator.readReport, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.ticketWiseProfitLoss(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Get Ticket Wise Profit Loss...');
            }
        }));
        this.getAllTicketNo = this.assyncWrapper.wrap(this.validator.readReport, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAllTicketNo(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Get All Ticket No...');
            }
        }));
        this.groupWisePassengerList = this.assyncWrapper.wrap(this.validator.readReport, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.groupWisePassengerList(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Get Group Wise Passenger List...');
            }
        }));
        this.agentsReport = this.assyncWrapper.wrap(this.validator.report_ledgers, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.agentsReport(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Get Agents Report...');
            }
        }));
        this.getEmployeExpense = this.assyncWrapper.wrap(this.validator.readReport, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getEmployeeExpense(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Get Employee Expense Report...');
            }
        }));
        this.getAllInvoiceCategory = this.assyncWrapper.wrap(this.validator.readReport, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAllInvoiceCategory(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Get All invoice categories...');
            }
        }));
        this.getAuditHistory = this.assyncWrapper.wrap(this.validator.readReport, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAuditHistory(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('get ait reports...');
            }
        }));
        this.todaySales = this.assyncWrapper.wrap(this.validator.readReport, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.todaySales(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('get ait reports...');
            }
        }));
        this.paymentAndPurchase = this.assyncWrapper.wrap(this.validator.readReport, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.paymentAndPurchase(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('get ait reports...');
            }
        }));
        this.getOnlineTrxnCharge = this.assyncWrapper.wrap(this.validator.readReport, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getOnlineTrxnCharge(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('');
            }
        }));
        this.invoiceAndMoneyReceiptDiscount = this.assyncWrapper.wrap(this.validator.readReport, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.invoiceAndMoneyReceiptDiscount(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('');
            }
        }));
        this.getInvoicePurches = this.assyncWrapper.wrap(this.validator.readReport, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.excels.getInvoicePurches(req);
            if (data.success) {
                res.status(200).send(data);
            }
            else {
                this.error('');
            }
        }));
        this.getTaxReport = this.assyncWrapper.wrap(this.validator.readReport, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getTaxReport(req);
            if (data.success) {
                res.status(200).send(data);
            }
            else {
                this.error('');
            }
        }));
        this.getOtherTaxReport = this.assyncWrapper.wrap(this.validator.readReport, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getOtherTaxReport(req);
            if (data.success) {
                res.status(200).send(data);
            }
            else {
                this.error('');
            }
        }));
        this.getDailySalesReport = this.assyncWrapper.wrap(this.validator.readCollectionSales, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getDailySalesReport(req);
            res.status(200).json(data);
        }));
        // excel report
        /**
         * ledgers
         */
        this.getClientLedgersExcel = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.excels.getClientLedgersExcel(req, res);
        }));
        this.getVendorLedgersExcel = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.excels.getVendorLedgersExcel(req, res);
        }));
        this.getCombinedLedgersExcel = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.excels.getCombinedLedgersExcel(req, res);
        }));
        /**
         * total due/advance
         */
        this.getDueAdvanceClientExcel = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.excels.getDueAdvanceClientExcel(req, res);
        }));
        this.getDueAdvanceVendorExcel = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.excels.getDueAdvanceVendorExcel(req, res);
        }));
        this.getDueAdvanceAgentExcel = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.excels.getDueAdvanceAgentExcel(req, res);
        }));
        this.getDueAdvanceCombinedClientExcel = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.excels.getDueAdvanceCombinedClientExcel(req, res);
        }));
        /**
         * sales and earning
         */
        this.getMonthlySalesAndEarningExcel = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.excels.getMonthlySalesEarninghExcel(req, res);
        }));
        this.getDailySalesReportExcel = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.excels.getDailySalesReportExcel(req, res);
        }));
        this.getAirlineWiseExcel = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.excels.getAirlineWiseReportExcel(req, res);
        }));
        this.getSalesManItemExcel = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.excels.getSalesManItemExcel(req, res);
        }));
        this.getclientWiseCollectionSalesReportExcel = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.excels.getClientWiseCollectionSalesReportExcel(req, res);
        }));
        this.getVendorWisePurchasePaymentExcel = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.excels.getVendorWisePurchasePaymentReportExcel(req, res);
        }));
        this.getSalesManCollectionAndDueExcel = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.excels.getSalesManCollectionAndDueExcel(req, res);
        }));
        this.getDailySalesCollectionReportExcel = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.excels.getDailySalesCollectionReportExcel(req, res);
        }));
        this.getDailyPurchasePaymentExcel = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.excels.getDailyPurchasePaymentExcel(req, res);
        }));
        /**
         * profit loss
         */
        this.getVisaWiseProfitLossExcel = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.excels.getVisaWiseProfitLossExcel(req, res);
        }));
        this.getOverAllProfitLossExcel = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.excels.getOverAllProfitLossExcel(req, res);
        }));
        this.getTicketWiseProfitExcelReport = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.excels.getTicketWiseProfitExcel(req, res);
        }));
        /**
         * Expense report
         */
        this.getEmployeeExpenseExcel = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.excels.getEmployeeExpenseExcel(req, res);
        }));
        this.getExpenseReportExcel = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.excels.getExpenseReportExcel(req, res);
        }));
        /**
         * Passport Report
         */
        this.getPassportStatusReportExcel = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.excels.getPassportStatusReportExcel(req, res);
        }));
        this.getPassportWiseReportExcel = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.excels.getPassportWiseReportExcel(req, res);
        }));
        /**
         * passenger list
         */
        this.getClientWisePassengerListExcel = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.excels.getClientWisePassengerListExcel(req, res);
        }));
        this.getGroupWisePassengerListExcel = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.excels.getGroupWisePassengerListExcel(req, res);
        }));
        /**
         * Client Discount
         */
        this.getClientDiscountExcel = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.excels.getClientDiscountExcel(req, res);
        }));
        /**
         * journey date wise client
         */
        this.getJourneyDateWiseClientExcelReport = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.excels.getJourneyDateWiseClientExcel(req, res);
        }));
        /**
         * Ait Report
         */
        this.getAitReportReport = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.excels.getAitReportExcel(req, res);
        }));
        /**
         * GDS Report
         */
        this.getGDSReport = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.excels.getGDSReportExcel(req, res);
        }));
        /**
         * accounts Report
         */
        this.getAccountsReport = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.excels.getAccountsReportExcel(req, res);
        }));
        this.getAccountsStatementExcel = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.excels.getAccountsStatementExcel(req, res);
        }));
        /**
         * Loan Reports
         */
        this.getLoanReports = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.excels.getLoanReportsExcel(req, res);
        }));
        /**
         * ONLINE TRXN CHARGE REPORT
         */
        this.getOnlineTrxnChargeReport = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.excels.getOnlineTrxnChargeReportExcel(req, res);
        }));
        /**
         * REFUND REPORT
         */
        this.getRefundReportClient = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.excels.getRefundReportClientExcel(req, res);
        }));
        this.getRefundReportVendor = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.excels.getRefundReportVendorExcel(req, res);
        }));
        /**
         * Summary (Daily&Monthly) Report
         */
        this.getSummaryDailyReport = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.excels.getSummaryDailyReportExcel(req, res);
        }));
        this.getSummaryMonthlyReport = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.excels.getSummaryMonthlyReportExcel(req, res);
        }));
        /**
         * COUNTRY WISE REPORT
         */
        this.getCountryWiseReport = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.excels.getCountryWiseReportExcel(req, res);
        }));
        /**
         * Pre Registration Report
         */
        this.getPreRegistrationReport = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.excels.getPreRegistrationReportExcel(req, res);
        }));
        /**
         * UASER LOGIN HISTORY
         */
        this.getUserLoginHistory = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.excels.getUserLoginHistoryExcel(req, res);
        }));
        /**
         * Void List
         */
        this.getVoidList = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.excels.getVoidListExcel(req, res);
        }));
        /**
         * audit Trail
         */
        this.getAuditTrail = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.excels.getAuditTrailExcel(req, res);
        }));
        /**
         * account transaction history
         */
        this.getAccountTransactionHistory = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.excels.getAccountTransactionHistoryExcel(req, res);
        }));
        /**
         * client all
         */
        this.getClientAll = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.excels.getAllClientExcel(req, res);
        }));
        this.getCombinedClientAll = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.excels.getAllCombinedClientExcel(req, res);
        }));
        /**
         * vendor
         */
        this.getVendorAll = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.excels.getVendorAllExcel(req, res);
        }));
        /**
         * AIR TICKET TOTAL REPORT
         */
        this.airTicketTotalReport = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.airTicketTotalReport(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Air ticket total summary report');
            }
        }));
        this.airTicketDetails = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.airTicketDetails(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Air ticket total summary report');
            }
        }));
        this.airTicketTotalReportExcel = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.excels.airTicketTotalReportExcel(req, res);
        }));
        this.airTicketDetailsReportExcel = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.excels.airTicketDetailsReportExcel(req, res);
        }));
        this.customAirTicketReportExcel = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.excels.customAirTicketReportExcel(req, res);
        }));
    }
}
exports.default = ReportController;
//# sourceMappingURL=report.controllers.js.map