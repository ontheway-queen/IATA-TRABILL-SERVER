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
const abstract_services_1 = __importDefault(require("../../../abstracts/abstract.services"));
const lib_1 = require("../../../common/utils/libraries/lib");
class DashboardServices extends abstract_services_1.default {
    constructor() {
        super();
        // @Search Invoices
        this.searchInvoices = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.dashboardModal(req);
            const { search, size, page } = req.query;
            if (!search) {
                return { success: true, data: [] };
            }
            const data = yield conn.searchInvoices(search, page, size);
            const count = yield conn.countSearchInvoices(search);
            return { success: true, count, data };
        });
        // @Dashboard Summary
        this.dashboardSummary = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.dashboardModal(req);
            const currAccStatus = yield conn.currAccStatus();
            const account_status = yield conn.accountStatus();
            return {
                success: true,
                data: {
                    currAccStatus,
                    account_status,
                },
            };
        });
        this.getAccountBalanceData = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.dashboardModal(req);
            const data = yield conn.getAccountDetails();
            const names = data.map((item) => item.acctype_name);
            const ammount = data.map((item) => item.total_amount);
            return { success: true, data: { names, ammount } };
        });
        this.getExpenses = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.dashboardModal(req);
            const accountWiseExpense = yield conn.getAccWiseTodayExpenseTotal();
            const expenseInfo = yield conn.getExpenseInfo();
            return {
                success: true,
                data: Object.assign({ accountWiseExpense }, expenseInfo),
            };
        });
        // INVOICE DETAILS
        this.getMonthReport = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.dashboardModal(req);
            const data = yield conn.getMonthReport();
            return {
                success: true,
                data,
            };
        });
        // DAILY , MONTHLY & YEARLY TRANSACTIONS
        this.getTransactionInfo = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.dashboardModal(req);
            const daily_sales = yield conn.selectDailySales();
            const daily_received = yield conn.selectDailyReceived();
            const daily_expense = yield conn.selectDailyExpense();
            const monthly_sales = yield conn.selectMonthlySales();
            const monthly_received = yield conn.selectMonthlyReceived();
            const monthly_expense = yield conn.selectMonthlyExpense();
            const yearly_sales = yield conn.selectYearlySales();
            const yearly_received = yield conn.selectYearlyReceived();
            const yearly_expense = yield conn.selectYearlyExpense();
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
        });
        this.getDailyPaymentPurchase = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.dashboardModal(req);
            const daily_purchase = yield conn.selectDailyPurchase();
            const daily_payment = yield conn.selectDailyPayment();
            return {
                success: true,
                data: {
                    daily_purchase,
                    daily_payment,
                },
            };
        });
        this.getMonthlyPaymentPurchase = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.dashboardModal(req);
            const monthly_purchase = yield conn.selectMonthlyPurchase();
            const monthly_payment = yield conn.selectMonthlyPayment();
            return {
                success: true,
                data: {
                    monthly_purchase,
                    monthly_payment,
                },
            };
        });
        this.getYearlyPaymentPurchase = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.dashboardModal(req);
            const yearly_purchase = yield conn.selectYearlyPurchase();
            const yearly_payment = yield conn.selectYearlyPayment();
            return {
                success: true,
                data: {
                    yearly_purchase,
                    yearly_payment,
                },
            };
        });
        // BSP BILLING
        this.getAirTicketSummary = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.dashboardModal(req);
            const { sales_from_date, sales_to_date } = (0, lib_1.getIataDateRange)();
            const ticket_issue = yield conn.getBspTicketIssueInfo(sales_from_date, sales_to_date);
            const ticket_re_issue = yield conn.getBspTicketReissueInfo(sales_from_date, sales_to_date);
            const ticket_refund = yield conn.getBspTicketRefundInfo(sales_from_date, sales_to_date);
            const data = yield conn.bspBillingInformation(sales_from_date, sales_to_date);
            // BILLING DATE
            const billing_from_date = (0, lib_1.getNext15Day)(sales_from_date);
            const billing_to_date = (0, lib_1.getNext15Day)(sales_to_date);
            return {
                success: true,
                message: 'the request is OK',
                data: Object.assign(Object.assign({}, data), { billing_from_date,
                    billing_to_date,
                    sales_from_date,
                    sales_to_date }),
            };
        });
        // BSP BILLING SUMMARY
        this.getBspBillingSummary = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.dashboardModal(req);
            const { sales_from_date, sales_to_date } = (0, lib_1.getIataDateRange)();
            const ticket_issue = yield conn.getBspTicketIssueSummary(sales_from_date, sales_to_date);
            const ticket_re_issue = yield conn.getBspTicketReissueSummary(sales_from_date, sales_to_date);
            const ticket_refund = yield conn.getBspTicketRefundSummary(sales_from_date, sales_to_date);
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
        });
        // VENDORS / BANK Guarantee
        this.getVendorBankGuarantee = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.dashboardModal(req);
            const data = yield conn.getVendorBankGuarantee();
            return {
                success: true,
                message: 'request is OK',
                data,
            };
        });
        // BEST CLIENT OF THE YEAR/MONTH
        this.getBestClients = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.dashboardModal(req);
            const thisMonth = `${new Date().getFullYear()}-${new Date().getMonth() + 1}`;
            const monthly = yield conn.getBestClients(null, thisMonth);
            const yearly = yield conn.getBestClients(String(new Date().getFullYear()), null);
            return {
                success: true,
                message: 'request is OK',
                data: { monthly, yearly },
            };
        });
        // BEST EMPLOYEE OF THE YEAR/MONTH
        this.getBestEmployee = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.dashboardModal(req);
            const thisMonth = `${new Date().getFullYear()}-${new Date().getMonth() + 1}`;
            const monthly = yield conn.getBestEmployee(null, thisMonth);
            const yearly = yield conn.getBestEmployee(String(new Date().getFullYear()), null);
            return {
                success: true,
                message: 'request is OK',
                data: { monthly, yearly },
            };
        });
        // IATA BANK GUARANTEE LIMIT
        this.iataBankGuaranteeLimit = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.dashboardModal(req);
            const data = yield conn.iataBankGuaranteeLimit();
            return {
                success: true,
                message: 'request is OK',
                data,
            };
        });
    }
}
exports.default = DashboardServices;
//# sourceMappingURL=dashboard.services.js.map