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
const moment_1 = __importDefault(require("moment"));
const abstract_services_1 = __importDefault(require("../../../abstracts/abstract.services"));
const common_helper_1 = require("../../../common/helpers/common.helper");
const customError_1 = __importDefault(require("../../../common/utils/errors/customError"));
class ReportServices extends abstract_services_1.default {
    constructor() {
        super();
        /**
         * LEDGERS
         */
        this.getClientLedger = (req) => __awaiter(this, void 0, void 0, function* () {
            const { client_id } = req.params;
            const { from_date, to_date, page, size } = req.query;
            const conn = this.models.trxnModels(req);
            const client_conn = this.models.clientModel(req);
            const client = yield client_conn.getClientInfo(client_id);
            const { ledgers, count } = yield conn.getClTrans(client_id, from_date, to_date, Number(page) || 1, Number(size) || 20);
            return { success: true, count, data: { client, ledgers } };
        });
        this.getVendorLedger = (req) => __awaiter(this, void 0, void 0, function* () {
            const { vendor_id } = req.params;
            const { from_date, to_date, page, size } = req.query;
            const conn = this.models.trxnModels(req);
            const vendor_conn = this.models.reportModel(req);
            const vendor = yield vendor_conn.getVendorInfo(vendor_id);
            const { ledgers, count } = yield conn.getVenTrxns(vendor_id, from_date, to_date, Number(page) || 1, Number(size) || 20);
            return { success: true, count, data: { vendor, ledgers } };
        });
        this.getCombinedReport = (req) => __awaiter(this, void 0, void 0, function* () {
            const { combined_id } = req.params;
            const { from_date, to_date, page, size } = req.query;
            const conn = this.models.trxnModels(req);
            const data = yield conn.getComTrxn(combined_id, from_date, to_date, Number(page) || 1, Number(size) || 20);
            return Object.assign({ success: true }, data);
        });
        this.agentsReport = (req) => __awaiter(this, void 0, void 0, function* () {
            const agentId = Number(req.params.agent_id);
            if (!agentId) {
                throw new customError_1.default('Invalid agent id', 400, 'Please provide a valid agent id');
            }
            const { from_date, to_date, page, size } = req.query;
            const conn = this.models.profitLossReport(req);
            const data = yield conn.agentLedgers(agentId, String(from_date), String(to_date), +page, +size);
            return Object.assign({ success: true, message: 'Agents ledgers' }, data);
        });
        this.getClientByCategory = (req) => __awaiter(this, void 0, void 0, function* () {
            let category_id = req.params.category_id;
            category_id = category_id === 'all' ? undefined : category_id;
            const conn = this.models.reportModel(req);
            const data = yield conn.getClientByCategory(category_id);
            return { success: true, message: 'Invoice by category', data };
        });
        this.clientDueAdvance = (req) => __awaiter(this, void 0, void 0, function* () {
            const { client_id } = req.params;
            const { payment_date, page, size, present_balance = 'all', } = req.query;
            const conn = this.models.reportModel(req);
            const data = yield conn.clientDueAdvance(client_id, String(payment_date), Number(page) || 1, Number(size) || 20);
            return Object.assign({ success: true, client_id }, data);
        });
        // DUE ADVANCE DETAILS & SUMMARY -> CLIENT | AIRLINE | DETAILS | ADVANCE
        this.getDueAdvanceDetailsSummary = (req) => __awaiter(this, void 0, void 0, function* () {
            const { airline_id, comb_client, data_type, search, from_date, to_date } = req.body;
            const { page, size } = req.query;
            const { client_id, combined_id } = (0, common_helper_1.separateCombClientToId)(comb_client);
            const conn = this.models.reportModel(req);
            let data = { count: 0, data: { results: [], total: {} } };
            if (data_type === 'CLIENT') {
                data = yield conn.getClientWiseDueSummary(search, client_id, combined_id, +page, +size);
            }
            else if (data_type === 'AIRLINE') {
                data = yield conn.getAirlineWiseClientDueSummary(search, airline_id, +page, +size);
            }
            else if (data_type === 'DETAILS') {
                data = yield conn.DueDetails(search, client_id, combined_id, airline_id, from_date, to_date, +page, +size);
            }
            return Object.assign({ success: true }, data);
        });
        this.clientAdvance = (req) => __awaiter(this, void 0, void 0, function* () {
            const { search, page, size } = req.query;
            const conn = this.models.reportModel(req);
            const data = yield conn.clientAdvance(search, +page, +size);
            return Object.assign({ success: true }, data);
        });
        this.getDueAdvanceCombined = (req) => __awaiter(this, void 0, void 0, function* () {
            const { combined_id } = req.params;
            const { payment_date, page, size } = req.query;
            const conn = this.models.reportModel(req);
            const data = yield conn.getDueAdvanceCombineClient(combined_id, payment_date, Number(page) || 1, Number(size) || 20);
            return Object.assign({ success: true }, data);
        });
        this.getAgentsDueAdvance = (req) => __awaiter(this, void 0, void 0, function* () {
            const vendorId = req.params.agent_id;
            const { payment_date, page, size } = req.query;
            const conn = this.models.reportModel(req);
            const data = yield conn.getAgentsDueAdvance(vendorId, String(payment_date), Number(page) || 1, Number(size) || 20);
            return Object.assign({ success: true, message: 'Agent advance due' }, data);
        });
        this.loanReport = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.reportModel(req);
            const { authority, loan_type } = req.params;
            const { from_date, to_date, page, size } = req.query;
            const data = yield conn.loanReport(String(from_date), String(to_date), authority, loan_type, Number(page) || 1, Number(size) || 20);
            const count = yield conn.countLoanReportDataRow(String(from_date), String(to_date), authority, loan_type);
            return { success: true, count, data };
        });
        this.getLoanSummary = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.reportModel(req);
            let data = [];
            const types = ['TAKING', 'GIVING', 'ALREADY_TAKEN', 'ALREADY_GIVEN'];
            for (const type of types) {
                const info = yield conn.getLoanSummary(type);
                data.push(info);
            }
            return {
                success: true,
                data,
            };
        });
        this.getVendorPurchaseAndPayment = (req) => __awaiter(this, void 0, void 0, function* () {
            const { comb_vendor } = req.params;
            const { from_date, to_date, page, size } = req.query;
            const conn = this.models.reportModel(req);
            const data = yield conn.getVendorWiseReport(comb_vendor, String(from_date), String(to_date), Number(page) || 1, Number(size) || 20, req.user_id);
            return Object.assign({ success: true }, data);
        });
        this.getClientSales = (req) => __awaiter(this, void 0, void 0, function* () {
            const { client_id } = req.body;
            const { from_date, to_date, page, size } = req.query;
            const conn = this.models.salesPurchasesReport(req);
            let separateComb;
            if (client_id !== 'all') {
                separateComb = (0, common_helper_1.separateCombClientToId)(client_id);
            }
            const clientId = (separateComb === null || separateComb === void 0 ? void 0 : separateComb.client_id) || 'all';
            const combine_id = (separateComb === null || separateComb === void 0 ? void 0 : separateComb.combined_id) || 'all';
            const sales = yield conn.getClientSales(clientId, combine_id, String(from_date), String(to_date), Number(page) || 1, Number(size) || 20, req.user_id);
            const collection = yield conn.getClientCollectionClient(clientId, combine_id, String(from_date), String(to_date), Number(page) || 1, Number(size) || 20, req.user_id);
            const count = {
                collection_count: collection.count,
                sales_count: sales.count,
            };
            const data = Object.assign(Object.assign({}, count), { collection, sales });
            return { success: true, count, data };
        });
        this.vendorDueAdvance = (req) => __awaiter(this, void 0, void 0, function* () {
            const vendorId = req.params.vendor_id;
            const { payment_date, page, size } = req.query;
            const conn = this.models.reportModel(req);
            const data = yield conn.getDueAdvanceVendor(vendorId, String(payment_date), Number(page) || 1, Number(size) || 20);
            return Object.assign({ success: true, message: 'Vendor advance due' }, data);
        });
        this.getSalesReport = (req) => __awaiter(this, void 0, void 0, function* () {
            const { client_id, employee_id } = req.body;
            const { from_date, to_date, page, size } = req.query;
            const conn = this.models.salesPurchasesReport(req);
            const data = yield conn.getSalesReport(client_id, employee_id, String(from_date), String(to_date), Number(page) || 1, Number(size) || 20, req.user_id);
            return Object.assign({ success: true }, data);
        });
        // OVERALL PROFIT LOSS
        this.overallProfitLoss = (req) => __awaiter(this, void 0, void 0, function* () {
            let { from_date, to_date } = req.query;
            from_date = (0, moment_1.default)(new Date(from_date)).format('YYYY-MM-DD');
            to_date = (0, moment_1.default)(new Date(to_date)).format('YYYY-MM-DD');
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.profitLossReport(req, trx);
                const data = yield conn.overallProfitLoss(from_date, to_date);
                return {
                    success: true,
                    data,
                };
            }));
        });
        // overall sales summery
        this.getOverallSalesSummery = (req) => __awaiter(this, void 0, void 0, function* () {
            const { from_date, to_date, page, size } = req.query;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.profitLossReport(req, trx);
                const data = yield conn.getOverallSalesSummery(from_date, to_date, +page, +size);
                return Object.assign({ success: true }, data);
            }));
        });
        // overall client refunds
        this.getOverallClientRefund = (req) => __awaiter(this, void 0, void 0, function* () {
            const { from_date, to_date, page, size } = req.query;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.profitLossReport(req, trx);
                const data = yield conn.getOverallClientRefund(from_date, to_date, +page, +size);
                return Object.assign({ success: true }, data);
            }));
        });
        // overall client refunds
        this.getOverallPurchase = (req) => __awaiter(this, void 0, void 0, function* () {
            const { from_date, to_date, page, size } = req.query;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.profitLossReport(req, trx);
                const data = yield conn.getOverallPurchase(from_date, to_date, +page, +size);
                return Object.assign({ success: true }, data);
            }));
        });
        this.getVisaList = (req) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.models.reportModel(req).getVisaList();
            return { success: true, data };
        });
        this.visaWiseProfitLoss = (req) => __awaiter(this, void 0, void 0, function* () {
            const { visa_id } = req.params;
            const { from_date, to_date, page, size } = req.query;
            const conn = this.models.profitLossReport(req);
            const data = yield conn.visaWiseProfitLoss(visa_id, String(from_date), String(to_date), Number(page) || 1, Number(size) || 20, req.user_id);
            return Object.assign({ success: true }, data);
        });
        this.userLoginHistory = (req) => __awaiter(this, void 0, void 0, function* () {
            const { user_id } = req.body;
            const { from_date, to_date, page, size } = req.query;
            const conn = this.models.reportModel(req);
            const data = yield conn.userLoginHistory(user_id, String(from_date), String(to_date), Number(page) || 1, Number(size) || 20);
            return Object.assign({ success: true }, data);
        });
        this.preRegistrationList = (req) => __awaiter(this, void 0, void 0, function* () {
            const { possible_year, page, size } = req.body;
            const conn = this.models.reportModel(req);
            const data = yield conn.preRegistrationList(possible_year, Number(page) || 1, Number(size) || 20);
            return Object.assign({ success: true }, data);
        });
        this.clientWisePassengerList = (req) => __awaiter(this, void 0, void 0, function* () {
            const client_ids = req.params.id;
            const { page, size } = req.query;
            const conn = this.models.reportModel(req);
            let combineClients;
            if (client_ids && client_ids !== 'all') {
                combineClients = (0, common_helper_1.separateCombClientToId)(client_ids);
            }
            const client_id = (combineClients === null || combineClients === void 0 ? void 0 : combineClients.client_id) || 'all';
            const combined_id = (combineClients === null || combineClients === void 0 ? void 0 : combineClients.combined_id) || 'all';
            const data = yield conn.clientWisePassengerList(client_id, combined_id, Number(page) || 1, Number(size) || 20);
            const count = yield conn.countClientWisePassengerList(client_id, combined_id);
            return { success: true, count, data };
        });
        this.countryWiseReport = (req) => __awaiter(this, void 0, void 0, function* () {
            const { country_id } = req.params;
            const { from_date, to_date, page, size } = req.query;
            const conn = this.models.reportModel(req);
            const data = yield conn.countryWiseReport(country_id, String(from_date), String(to_date), Number(page) || 1, Number(size) || 20);
            return Object.assign({ success: true }, data);
        });
        this.passportWiseReport = (req) => __awaiter(this, void 0, void 0, function* () {
            const passport_id = req.params.id;
            const { from_date, to_date, page, size } = req.query;
            const conn = this.models.reportModel(req);
            const data = yield conn.passportWiseReport(passport_id, String(from_date), String(to_date), Number(page), Number(size));
            return Object.assign({ success: true }, data);
        });
        this.passportStatusReport = (req) => __awaiter(this, void 0, void 0, function* () {
            const { status_name } = req.body;
            const { from_date, to_date, page, size } = req.query;
            const conn = this.models.reportModel(req);
            const data = yield conn.passportStatusReport(status_name, String(from_date), String(to_date), Number(page) || 1, Number(size) || 20);
            const count = yield conn.countPassportStatusDataRow(status_name, String(from_date), String(to_date));
            return { success: true, count, data };
        });
        this.monthlySummary = (req) => __awaiter(this, void 0, void 0, function* () {
            const { month } = req.query;
            const conn = this.models.reportModel(req);
            const monthlySalesAmount = yield conn.salesAmountReport(month, 'monthly');
            const monthlyVendorPayment = yield conn.vendorPaymentAmount(month, 'monthly');
            const monthlyExpenseAmount = yield conn.expenseAmountReport(month, 'monthly');
            const employeeExpenseAmount = yield conn.employeeExpenseReport(month, 'monthly');
            const monthlyClientRefund = yield conn.clientRefundAmount(month, 'monthly');
            const monthlyVendorRefund = yield conn.vendorRefundAmount(month, 'monthly');
            const monthlyAccountCollection = yield conn.accountCollectionAmount(month, 'monthly');
            const monthlyPurchase = yield conn.purchaseReport(month, 'monthly');
            const monthlyAgentPayment = yield conn.getTotalAgentPayment(month, 'monthly');
            //
            const monthlySalesReport = yield conn.salesReport(month, 'monthly');
            const monthlyExpenseReport = yield conn.expenseSummaryReport(month, 'monthly');
            const monthlyVendorPaymentReport = yield conn.vendorPaymentReport(month, 'monthly');
            const monthlyCollectionReport = yield conn.accountCollectionReport(month, 'monthly');
            const monthlyClientRefundReport = yield conn.clientRefundReport(month, 'monthly');
            const monthlyVendorRefundReport = yield conn.vendorRefundReport(month, 'monthly');
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
        });
        this.dailySummary = (req) => __awaiter(this, void 0, void 0, function* () {
            const { day } = req.query;
            const conn = this.models.reportModel(req);
            const dailySalesAmount = yield conn.salesAmountReport(day, 'daily');
            const dailyPurchase = yield conn.purchaseReport(day, 'daily');
            const dailyVendorPayment = yield conn.vendorPaymentAmount(day, 'daily');
            const dailyExpenseAmount = yield conn.expenseAmountReport(day, 'daily');
            const dailyEmployeeExpenseAmount = yield conn.employeeExpenseReport(day, 'daily');
            const dailyClientRefund = yield conn.clientRefundAmount(day, 'daily');
            const dailyVendorRefund = yield conn.vendorRefundAmount(day, 'daily');
            const dailyAccountCollection = yield conn.accountCollectionAmount(day, 'daily');
            const dailyAgentPayment = yield conn.getTotalAgentPayment(day, 'daily');
            //
            const dailySalesReport = yield conn.salesReport(day, 'daily');
            const dailyExpenseReport = yield conn.expenseSummaryReport(day, 'daily');
            const dailyVendorPaymentReport = yield conn.vendorPaymentReport(day, 'daily');
            const dailyCollectionReport = yield conn.accountCollectionReport(day, 'daily');
            const dailyClientRefundReport = yield conn.clientRefundReport(day, 'daily');
            const dailyVendorRefundReport = yield conn.vendorRefundReport(day, 'daily');
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
        });
        this.refundReportClient = (req) => __awaiter(this, void 0, void 0, function* () {
            const { from_date, to_date, page, size } = req.query;
            const conn = this.models.reportModel(req);
            const data = yield conn.refundReportClient(String(from_date), String(to_date), Number(page) || 1, Number(size) || 20);
            const count = yield conn.countRefundClientDataRow(String(from_date), String(to_date));
            return { success: true, count, data };
        });
        this.refundReportVendor = (req) => __awaiter(this, void 0, void 0, function* () {
            const { from_date, to_date, page, size } = req.query;
            const conn = this.models.reportModel(req);
            const data = yield conn.refundReportVendor(String(from_date), String(to_date), Number(page) || 1, Number(size) || 20);
            const count = yield conn.countVendorsRefundsDataRow(String(from_date), String(to_date));
            return { success: true, count, data };
        });
        this.salesManWiseCollectionDue = (req) => __awaiter(this, void 0, void 0, function* () {
            const sales_man_id = req.params.salesman_id;
            const { from_date, to_date, page, size } = req.query;
            const conn = this.models.salesPurchasesReport(req);
            const data = yield conn.salesManWiseCollectionDue(sales_man_id, String(from_date), String(to_date), Number(page) || 1, Number(size) || 20, req.user_id);
            return Object.assign({ success: true }, data);
        });
        this.salesReportCollectionDue = (req) => __awaiter(this, void 0, void 0, function* () {
            const { from_date, to_date } = req.query;
            const conn = this.models.reportModel(req);
            const data = yield conn.salesReportCollectionDue('all', String(from_date), String(to_date));
            return { success: true, data };
        });
        this.headWiseExpenseReport = (req) => __awaiter(this, void 0, void 0, function* () {
            const { head_id } = req.params;
            const { from_date, to_date, page, size } = req.query;
            const conn = this.models.reportModel(req);
            const data = yield conn.headWiseExpenseReport(head_id, String(from_date), String(to_date), Number(page) || 1, Number(size) || 20);
            const count = yield conn.countHeadWiseExpenseDataRow(head_id, String(from_date), String(to_date));
            return { success: true, count, data };
        });
        this.accountReport = (req) => __awaiter(this, void 0, void 0, function* () {
            const { account_id } = req.params;
            const { from_date, to_date, page, size } = req.query;
            const conn = this.models.reportModel(req);
            const data = yield conn.accountReport(account_id, String(from_date), String(to_date), Number(page) || 1, Number(size) || 20);
            const count = yield conn.countAccountReportDataRow(account_id, String(from_date), String(to_date));
            return { success: true, count, data };
        });
        this.salesManReportCollectionDue = (req) => __awaiter(this, void 0, void 0, function* () {
            const { sales_man_id } = req.params;
            const { from_date, to_date } = req.query;
            const conn = this.models.reportModel(req);
            const data = yield conn.salesManReportCollectionDue(sales_man_id, String(from_date), String(to_date));
            return { success: true, data };
        });
        this.salesReportItemSalesman = (req) => __awaiter(this, void 0, void 0, function* () {
            const { item_id, sales_man_id } = req.body;
            const { from_date, to_date, page, size } = req.query;
            const conn = this.models.reportModel(req);
            const data = yield conn.salesReportItemSalesman(item_id, sales_man_id, String(from_date), String(to_date), Number(page) || 1, Number(size) || 20, req.user_id);
            return Object.assign({ success: true }, data);
        });
        this.GDSReport = (req) => __awaiter(this, void 0, void 0, function* () {
            const { gds_id } = req.params;
            const { from_date, to_date, page, size } = req.query;
            const conn = this.models.reportModel(req);
            const { data, count } = yield conn.GDSReport(gds_id, from_date, to_date, page, size);
            const sum = yield conn.GDSReportGrossSum(gds_id, from_date, to_date);
            return { success: true, count, data: Object.assign({ list: data }, sum) };
        });
        this.AITReport = (req) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.vendor_id;
            const { from_date, to_date, page, size } = req.query;
            const conn = this.models.reportModel(req);
            let separateComb;
            if (id && id !== 'all') {
                separateComb = (0, common_helper_1.separateCombClientToId)(id);
            }
            const vendor_id = (separateComb === null || separateComb === void 0 ? void 0 : separateComb.vendor_id) || 'all';
            const combined_id = (separateComb === null || separateComb === void 0 ? void 0 : separateComb.combined_id) || 'all';
            const data = yield conn.AITReportClient(vendor_id, combined_id, String(from_date), String(to_date), Number(page) || 1, Number(size) || 20);
            const count = yield conn.countAitClientCount(vendor_id, combined_id, String(from_date), String(to_date));
            return { success: true, count, data };
        });
        this.voidInvoices = (req) => __awaiter(this, void 0, void 0, function* () {
            const { from_date, to_date, page, size } = req.query;
            const conn = this.models.reportModel(req);
            const data = yield conn.voidInvoices(from_date, to_date, page, size);
            return Object.assign({ success: true }, data);
        });
        this.airlineWiseSalesReport = (req) => __awaiter(this, void 0, void 0, function* () {
            const airline_id = req.params.airline;
            const { from_date, to_date, page, size, search } = req.query;
            const conn = this.models.reportModel(req);
            const data = yield conn.airlineWiseSalesReport(airline_id, String(from_date), String(to_date), Number(page) || 1, Number(size) || 20, search, req.user_id);
            return Object.assign({ success: true }, data);
        });
        this.getClientDiscount = (req) => __awaiter(this, void 0, void 0, function* () {
            const { client_id } = req.params;
            const { from_date, to_date, page, size } = req.query;
            const conn = this.models.reportModel(req);
            let separateComb;
            if (client_id && client_id !== 'all') {
                separateComb = (0, common_helper_1.separateCombClientToId)(client_id);
            }
            const clientId = (separateComb === null || separateComb === void 0 ? void 0 : separateComb.client_id) || 'all';
            const combine_id = (separateComb === null || separateComb === void 0 ? void 0 : separateComb.combined_id) || 'all';
            const data = yield conn.getClientDiscount(clientId, combine_id, String(from_date), String(to_date), Number(page) || 1, Number(size) || 20);
            return Object.assign({ success: true }, data);
        });
        this.journeyDateWiseclientReport = (req) => __awaiter(this, void 0, void 0, function* () {
            const { comb_client } = req.body;
            let separeClient;
            if (comb_client !== 'all') {
                separeClient = (0, common_helper_1.separateCombClientToId)(comb_client);
            }
            const client_id = (separeClient === null || separeClient === void 0 ? void 0 : separeClient.client_id) || 'all';
            const combined_id = (separeClient === null || separeClient === void 0 ? void 0 : separeClient.combined_id) || 'all';
            const { from_date, to_date, page, size } = req.query;
            const conn = this.models.reportModel(req);
            const data = yield conn.journeyDateWiseClientReport(client_id, combined_id, String(from_date), String(to_date), Number(page) || 1, Number(size) || 20);
            return Object.assign({ success: true }, data);
        });
        this.ticketWiseProfitLoss = (req) => __awaiter(this, void 0, void 0, function* () {
            const { ticket_id } = req.params;
            const { from_date, to_date, page, size } = req.query;
            const conn = this.models.profitLossReport(req);
            const tickets = yield conn.ticketWiseProfitLossReport(ticket_id, from_date, to_date, Number(page || 1), Number(size || 20), req.user_id);
            let data = [];
            for (const ticket of tickets.data) {
                const invoiceId = ticket === null || ticket === void 0 ? void 0 : ticket.invoice_id;
                if (invoiceId) {
                    const invoiceDue = yield this.models
                        .MoneyReceiptModels(req)
                        .getInvoiceDue(invoiceId);
                    const ticket_info = Object.assign(Object.assign({}, invoiceDue), ticket);
                    data.push(ticket_info);
                }
            }
            return {
                success: true,
                count: tickets.count,
                data,
            };
        });
        this.getAllTicketNo = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.reportModel(req);
            const data = yield conn.getAllTicketNo();
            return { success: true, data };
        });
        this.groupWisePassengerList = (req) => __awaiter(this, void 0, void 0, function* () {
            const { group_id } = req.params;
            const { page, size } = req.query;
            const conn = this.models.reportModel(req);
            const data = yield conn.hajGroupPassengerList(group_id, Number(page) || 1, Number(size) || 20);
            return Object.assign({ success: true }, data);
        });
        this.getEmployeeExpense = (req) => __awaiter(this, void 0, void 0, function* () {
            const { employee_id } = req.params;
            const { from_date, to_date, page, size } = req.query;
            const conn = this.models.profitLossReport(req);
            const data = yield conn.getEmployeeExpenses(employee_id, String(from_date), String(to_date), Number(page) || 1, Number(size) || 20);
            return Object.assign({ success: true }, data);
        });
        this.getAllInvoiceCategory = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.reportModel(req);
            const data = yield conn.getAllInvoiceCategory();
            return {
                success: true,
                data,
            };
        });
        this.getAuditHistory = (req) => __awaiter(this, void 0, void 0, function* () {
            const { user_id } = req.params;
            const { from_date, to_date, page, size } = req.query;
            const conn = this.models.reportModel(req);
            const data = yield conn.getAuditHistory(user_id, String(from_date), String(to_date), Number(page) || 1, Number(size) || 20);
            return Object.assign({ success: true }, data);
        });
        this.todaySales = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.salesPurchasesReport(req);
            const data = yield conn.salesPurchaseReport(req.user_id);
            return { success: true, data };
        });
        this.paymentAndPurchase = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.salesPurchasesReport(req);
            const data = yield conn.paymentAndPurchase(req.user_id);
            return { success: true, data };
        });
        this.getOnlineTrxnCharge = (req) => __awaiter(this, void 0, void 0, function* () {
            const { page, size, from_date, to_date } = req.query;
            const conn = this.models.profitLossReport(req);
            const data = yield conn.getOnlineTrxnCharge(Number(page) || 1, Number(size) || 20, String(from_date), String(to_date));
            const count = yield conn.countOnlineTrxnChargeDataRow(String(from_date), String(to_date));
            return { success: true, count, data };
        });
        this.payrollReport = (req) => __awaiter(this, void 0, void 0, function* () {
            const { payroll_id } = req.params;
            const { from_date, to_date, page, size } = req.query;
            const conn = this.models.profitLossReport(req);
            const data = yield conn.payrollReport(payroll_id, from_date, to_date, Number(page) || 1, Number(size) || 20);
            return Object.assign({ success: true, message: 'Get all payroll' }, data);
        });
        this.getTaxReport = (req) => __awaiter(this, void 0, void 0, function* () {
            const { from_date, to_date, page, size } = req.query;
            const conn = this.models.salesPurchasesReport(req);
            const data = yield conn.getTaxReport(from_date, to_date, Number(page) || 1, Number(size) || 20);
            return Object.assign({ success: true }, data);
        });
        this.getOtherTaxReport = (req) => __awaiter(this, void 0, void 0, function* () {
            const { from_date, to_date, page, size } = req.query;
            const conn = this.models.salesPurchasesReport(req);
            const { count, data } = yield conn.getOtherTaxReport(from_date, to_date, Number(page) || 1, Number(size) || 20);
            const sum = yield conn.getSumTaxAmount(from_date, to_date);
            return { success: true, count, data: Object.assign({ list: data }, sum) };
        });
        this.getDailySalesReport = (req) => __awaiter(this, void 0, void 0, function* () {
            const { comb_client, employee_id, product_id } = req.body;
            const { from_date, to_date, page, size } = req.query;
            const conn = this.models.salesPurchasesReport(req);
            const data = yield conn.getDailySalesReport(comb_client, employee_id, product_id, from_date, to_date, Number(page || 1), Number(size || 20), req.user_id);
            return Object.assign({ success: true }, data);
        });
        // AIR TICKET TOTAL REPORT
        this.airTicketTotalReport = (req) => __awaiter(this, void 0, void 0, function* () {
            const { from_date, to_date, page, size, client } = req.query;
            const conn = this.models.reportModel(req);
            const data = yield conn.getAirTicketTotalReport(from_date, to_date, page, size, client);
            return Object.assign({ success: true, message: 'Air ticket total report' }, data);
        });
        this.airTicketDetails = (req) => __awaiter(this, void 0, void 0, function* () {
            const { from_date, to_date, page, size, client } = req.query;
            const conn = this.models.reportModel(req);
            const data = yield conn.airTicketDetailsReport(from_date, to_date, Number(page), Number(size), client);
            const sum = yield conn.airTicketDetailsSumCostPurchase(from_date, to_date, client);
            const count = yield conn.airTicketDetailsCount(from_date, to_date, client);
            return { success: true, data: Object.assign({ list: data }, sum), count };
        });
        this.invoiceAndMoneyReceiptDiscount = (req) => __awaiter(this, void 0, void 0, function* () {
            const { from_date, to_date } = req.query;
            if (!from_date || !to_date) {
                return {
                    success: true,
                    error: 'From date and to date is required !',
                    data: null,
                };
            }
            const conn = this.models.reportModel(req);
            const data = yield conn.invoiceAndMoneyReceiptDiscount(from_date, to_date);
            return { success: true, data };
        });
        // SALES MAN WISE CLIENT TOTAL DUE
        this.salesManWiseClientTotalDue = (req) => __awaiter(this, void 0, void 0, function* () {
            const sales_man_id = req.params.salesman_id;
            const { page, size } = req.query;
            const conn = this.models.salesPurchasesReport(req);
            const data = yield conn.salesManWiseClientTotalDue(sales_man_id, Number(page) || 1, Number(size) || 20);
            return Object.assign({ success: true }, data);
        });
    }
}
exports.default = ReportServices;
//# sourceMappingURL=report.services.js.map