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
const imageUploader_1 = require("../../../common/middlewares/uploader/imageUploader");
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
            const { bsp_id } = req.params;
            const type = req.query.type || 'SUMMARY';
            const conn = this.models.dashboardModal(req);
            const bsp = yield conn.getBspFileUrl(bsp_id);
            if (!bsp.bsp_file_url) {
                throw new customError_1.default('No file uploaded', 400, 'File not found');
            }
            try {
                const pdfData = yield (0, pdf_parse_1.default)(bsp.bsp_file_url);
                let data;
                switch (type) {
                    case 'SUMMARY':
                        data = yield (0, dashbaor_utils_1.getAgentBillingSummary)(pdfData === null || pdfData === void 0 ? void 0 : pdfData.text, conn);
                        break;
                    case 'TICKET':
                        data = yield (0, dashbaor_utils_1.formatAgentTicket)(pdfData === null || pdfData === void 0 ? void 0 : pdfData.text, conn);
                        break;
                    case 'REFUND':
                        data = yield (0, dashbaor_utils_1.formatAgentRefund)(pdfData === null || pdfData === void 0 ? void 0 : pdfData.text, conn);
                        break;
                    default:
                        data = yield (0, dashbaor_utils_1.getAgentBillingSummary)(pdfData === null || pdfData === void 0 ? void 0 : pdfData.text, conn);
                        break;
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
        this.uploadBspFile = (req) => __awaiter(this, void 0, void 0, function* () {
            const files = req.files;
            if (!files) {
                throw new customError_1.default('A PDF file is required for upload. Please ensure that a valid PDF file is provided.', 400, 'File Not Provided');
            }
            for (const item of files) {
                const { buffer, mimetype } = item;
                const pdfData = yield (0, pdf_parse_1.default)(buffer);
                if (!pdfData.text.includes('AGENT BILLING DETAILS')) {
                    throw new customError_1.default('The provided agent billing details are invalid. Please ensure the BSP file contains accurate information.', 400, 'Invalid BSP File');
                }
                const salesPeriodRegex = /Billing Period:\s*(\d+)\s*\((.*?)\s*to\s*(.*?)\)/;
                const salesPeriodMatch = pdfData.text.match(salesPeriodRegex);
                let from_date;
                let to_date;
                let bsp_bill_date;
                if (salesPeriodMatch) {
                    from_date = salesPeriodMatch[2].split('-').join('');
                    to_date = salesPeriodMatch[3].split('-').join('');
                    bsp_bill_date = (0, lib_1.dateStrConverter)(salesPeriodMatch[3]);
                }
                const match = pdfData.text.match(/REFERENCE:\s*(\d+)/);
                const referenceNumber = match ? match[1] : undefined;
                const file_name = referenceNumber + '-' + from_date + '-' + to_date + '.PDF';
                const conn = this.models.dashboardModal(req);
                const isExist = yield conn.checkBspFileIsExist(file_name);
                if (isExist) {
                    throw new customError_1.default('The file you are attempting to upload already exists. Please upload a different file or rename the existing file.', 400, 'File Already Exists');
                }
                const bsp_file_url = (yield (0, imageUploader_1.uploadImageWithBuffer)(buffer, file_name, mimetype));
                yield conn.insertBspFile({
                    bsp_agency_id: req.agency_id,
                    bsp_created_by: req.user_id,
                    bsp_file_url,
                    bsp_file_name: file_name,
                    bsp_bill_date: bsp_bill_date,
                });
            }
            return {
                success: true,
                message: 'BSP file upload successfully',
            };
        });
        this.deleteBSPDocs = (req) => __awaiter(this, void 0, void 0, function* () {
            const tbd_id = req.params.tbd_id;
            const conn = this.models.dashboardModal(req);
            const prev_url = yield conn.deleteBSPDocs(tbd_id);
            if (prev_url)
                this.manageFile.deleteFromCloud([prev_url]);
            return {
                success: true,
                message: 'BSP Doc delete successfully',
            };
        });
        this.selectBspFiles = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.dashboardModal(req);
            const { search, date } = req.query;
            const data = yield conn.selectBspFiles(search, date);
            return {
                success: true,
                message: 'The request is Ok.',
                data,
            };
        });
        this.bspFileList = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.dashboardModal(req);
            const { search, date, page, size } = req.query;
            const data = yield conn.bspFileList(search, +page, +size, date);
            return Object.assign({ success: true, message: 'The request is Ok.' }, data);
        });
    }
}
exports.default = DashboardServices;
//# sourceMappingURL=dashboard.services.js.map