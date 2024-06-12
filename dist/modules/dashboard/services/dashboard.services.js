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
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const abstract_services_1 = __importDefault(require("../../../abstracts/abstract.services"));
const customError_1 = __importDefault(require("../../../common/utils/errors/customError"));
const lib_1 = require("../../../common/utils/libraries/lib");
const dashbaor_utils_1 = require("../utils/dashbaor.utils");
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
            const daily_refund = yield conn.selectDailyRefund();
            return {
                success: true,
                data: {
                    daily_purchase,
                    daily_payment,
                    daily_refund,
                },
            };
        });
        this.getMonthlyPaymentPurchase = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.dashboardModal(req);
            const monthly_purchase = yield conn.selectMonthlyPurchase();
            const monthly_payment = yield conn.selectMonthlyPayment();
            const monthly_refund = yield conn.selectMonthlyRefund();
            return {
                success: true,
                data: {
                    monthly_purchase,
                    monthly_payment,
                    monthly_refund,
                },
            };
        });
        this.getYearlyPaymentPurchase = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.dashboardModal(req);
            const yearly_purchase = yield conn.selectYearlyPurchase();
            const yearly_payment = yield conn.selectYearlyPayment();
            const yearly_refund = yield conn.selectYearlyRefund();
            return {
                success: true,
                data: {
                    yearly_purchase,
                    yearly_payment,
                    yearly_refund,
                },
            };
        });
        // BSP BILLING
        this.getBSPBilling = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.dashboardModal(req);
            const report_conn = this.models.reportModel(req);
            let { billingType, from_date, to_date } = req.query;
            if (from_date === 'Invalid Date' && to_date === 'Invalid Date') {
                let dateRange = (0, lib_1.getBspBillingDate)(billingType);
                from_date = dateRange.from_date;
                to_date = dateRange.to_date;
            }
            const ticket_issue = yield conn.getBspTicketIssueInfo(from_date, to_date);
            const ticket_re_issue = yield conn.getBspTicketReissueInfo(from_date, to_date);
            const ticket_refund = yield conn.getBspTicketRefundInfo(from_date, to_date);
            const client_sales = yield report_conn.getAirTicketTotalSummary(from_date, to_date);
            // BILLING DATE
            const billing_from_date = (0, lib_1.getNext15Day)(from_date);
            const billing_to_date = (0, lib_1.getNext15Day)(to_date);
            const iata_payment = yield conn.getBSPBillingPayment(billing_from_date, billing_to_date);
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
        });
        // BSP BILLING SUMMARY
        this.getBspBillingSummary = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.dashboardModal(req);
            let { billingType, week, from_date, to_date } = req.query;
            if (from_date === 'Invalid Date' && to_date === 'Invalid Date') {
                let dateRange = (0, lib_1.getBspBillingDate)(billingType);
                from_date = dateRange.from_date;
                to_date = dateRange.to_date;
            }
            if ([
                'previous',
                'previous_next',
                'first',
                'second',
                'third',
                'fourth',
            ].includes(week)) {
                const dateRange = (0, lib_1.getDateRangeByWeek)(week);
                from_date = dateRange.startDate;
                to_date = dateRange.endDate;
            }
            const issue = yield conn.getBspTicketIssueSummary(from_date, to_date);
            const reissue = yield conn.getBspTicketReissueSummary(from_date, to_date);
            const refund = yield conn.getBspTicketRefundSummary(from_date, to_date);
            return {
                success: true,
                message: 'the request is OK',
                data: Object.assign(Object.assign(Object.assign({ sales_from_date: from_date, sales_to_date: to_date }, issue), reissue), refund),
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
        // BSP BILLING CROSS CHECK
        this.bspBillingCrossCheck = (req) => __awaiter(this, void 0, void 0, function* () {
            if (!req.file) {
                throw new customError_1.default('No file uploaded', 400, 'File not found');
            }
            const type = req.query.type || 'SUMMARY';
            try {
                const conn = this.models.dashboardModal(req);
                const pdfData = yield (0, pdf_parse_1.default)(req.file.path);
                let data;
                if (pdfData.text.includes('AGENT BILLING DETAILS')) {
                    if (type === 'SUMMARY') {
                        data = yield (0, dashbaor_utils_1.getAgentBillingSummary)(pdfData === null || pdfData === void 0 ? void 0 : pdfData.text, conn);
                    }
                    else if (type === 'TICKET') {
                        data = yield (0, dashbaor_utils_1.formatAgentTicket)(pdfData === null || pdfData === void 0 ? void 0 : pdfData.text, conn);
                    }
                    else if (type === 'REFUND') {
                        data = yield (0, dashbaor_utils_1.formatAgentRefund)(pdfData === null || pdfData === void 0 ? void 0 : pdfData.text, conn);
                    }
                    else {
                        data = [];
                    }
                    console.log({ data });
                }
                return {
                    success: true,
                    data,
                };
            }
            catch (error) {
                console.error('Error parsing PDF:', error);
                throw new customError_1.default('Error parsing PDF', 500, 'Something went wrong!');
            }
        });
        this.uploadBSPDocs = (req) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { tbd_date } = req.body;
            const conn = this.models.dashboardModal(req);
            const files = req.files;
            yield conn.insertBSPDocs({
                tbd_agency_id: req.agency_id,
                tbd_date,
                tbd_doc: (_a = files[0]) === null || _a === void 0 ? void 0 : _a.location,
            });
            return {
                success: true,
                message: 'BSP Doc upload successfully',
            };
        });
        this.deleteBSPDocs = (req) => __awaiter(this, void 0, void 0, function* () {
            const tbd_id = req.params.tbd_id;
            const conn = this.models.dashboardModal(req);
            const prev_url = yield conn.deleteBSPDocs(tbd_id);
            if (prev_url)
                this.deleteFile.delete_image(prev_url);
            return {
                success: true,
                message: 'BSP Doc delete successfully',
            };
        });
        this.getBSPDocs = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.dashboardModal(req);
            const data = yield conn.getBSPDocs();
            return Object.assign({ success: true, message: 'The request is Ok.' }, data);
        });
    }
}
exports.default = DashboardServices;
//# sourceMappingURL=dashboard.services.js.map