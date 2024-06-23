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
const abstract_models_1 = __importDefault(require("../../../abstracts/abstract.models"));
class DashboardModels extends abstract_models_1.default {
    constructor() {
        super(...arguments);
        // @Search Invoices
        this.searchInvoices = (searchQuery, page = 1, size = 20) => __awaiter(this, void 0, void 0, function* () {
            size = Number(size);
            const offset = (Number(page) - 1) * size;
            return yield this.query()
                .select('*')
                .from('v_search_invoice')
                .andWhere((builder) => {
                builder
                    .where('client_name', 'like', `%${searchQuery}%`)
                    .orWhere('pax_passname', 'like', `%${searchQuery}%`)
                    .orWhere('airticket_ticket_no', 'like', `%${searchQuery}%`)
                    .orWhere('invoice_no', 'like', `%${searchQuery}%`)
                    .orWhere('passport_no', 'like', `%${searchQuery}%`)
                    .orWhere('airticket_pnr', 'like', `%${searchQuery}%`);
            })
                .where('invoice_org_agency', this.org_agency)
                .limit(size)
                .offset(offset);
        });
        this.countSearchInvoices = (searchQuery) => __awaiter(this, void 0, void 0, function* () {
            const [total] = (yield this.query()
                .count('* as total')
                .from('v_search_invoice')
                .where('invoice_org_agency', this.org_agency)
                .andWhere((builder) => {
                builder
                    .where('client_name', 'like', `%${searchQuery}%`)
                    .orWhere('pax_passname', 'like', `%${searchQuery}%`)
                    .orWhere('airticket_ticket_no', 'like', `%${searchQuery}%`)
                    .orWhere('passport_no', 'like', `%${searchQuery}%`)
                    .orWhere('airticket_pnr', 'like', `%${searchQuery}%`);
            }));
            return total.total;
        });
        this.currAccStatus = () => __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .select(this.db.raw('(@serial := @serial + 1) AS serial_number'))
                .select('account_id', 'account_name', 'account_routing_no', 'account_branch_name AS branch', 'account_number AS account_no', 'account_bank_name AS bank_name', 'account_lbalance AS balance')
                .from('trabill_accounts')
                .where('account_org_agency', this.org_agency)
                .andWhereNot('account_is_deleted', 1)
                .crossJoin(this.db.raw('(SELECT @serial := 0) AS serial'))
                .orderBy('account_name');
        });
        this.accountStatus = () => __awaiter(this, void 0, void 0, function* () {
            const [[data]] = yield this.db.raw(`call ${this.database}.get_account_status(${this.org_agency});`);
            return data;
        });
        this.getLoanDetailsForDashboard = () => __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .select('loan_org_agency', 'loan_type', this.db.raw('sum(loan_amount) total_loan'))
                .from('trabill_loans')
                .where('loan_org_agency', this.org_agency)
                .andWhereNot('loan_is_deleted', 1)
                .groupBy('loan_type', 'loan_org_agency');
        });
        this.getAccountDetails = () => __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .from(`trabill_accounts`)
                .select(this.db.raw('sum(account_lbalance) as total_amount'), 'acctype_name', 'account_acctype_id')
                .leftJoin('trabill_accounts_type', 'account_acctype_id', 'acctype_id')
                .where('account_org_agency', this.org_agency)
                .andWhereNot('account_is_deleted', 1)
                .groupByRaw('acctype_name, account_acctype_id');
        });
        this.getTodayExpenseTotal = () => __awaiter(this, void 0, void 0, function* () {
            const [data] = yield this.query()
                .select(this.db.raw('SUM(expense_total_amount) AS total_expenses_today'))
                .from('trabill_expenses')
                .whereRaw('DATE(expense_created_date) = CURDATE()')
                .andWhere('expense_org_agency', this.org_agency)
                .andWhereNot('expense_is_deleted', 1);
            return Number((data === null || data === void 0 ? void 0 : data.total_expenses_today) || 0);
        });
        this.getTotalExpense = () => __awaiter(this, void 0, void 0, function* () {
            const [data] = yield this.query()
                .select(this.db.raw('SUM(expense_total_amount) AS total_expenses_today'))
                .from('trabill_expenses')
                .where('expense_org_agency', this.org_agency)
                .andWhereNot('expense_is_deleted', 1);
            return Number((data === null || data === void 0 ? void 0 : data.total_expenses_today) || 0);
        });
        this.getAccWiseTodayExpenseTotal = () => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select(this.db.raw('expense_accounts_id,account_name, CAST(SUM(expense_total_amount) AS FLOAT) AS account_total_expenses_today'))
                .from('trabill_expenses')
                .leftJoin('trabill_accounts', { account_id: 'expense_accounts_id' })
                .whereRaw('YEAR(expense_date) = YEAR(CURDATE()) AND MONTH(expense_date) = MONTH(CURDATE())')
                .andWhere('expense_org_agency', this.org_agency)
                .andWhereNot('expense_is_deleted', 1)
                .groupBy('expense_accounts_id', 'account_name');
            return data;
        });
        this.getExpenseInfo = () => __awaiter(this, void 0, void 0, function* () {
            const todayTotal = (yield this.query()
                .sum('expense_total_amount as today_total')
                .from('trabill_expenses')
                .whereRaw('expense_date >= CURDATE() AND expense_date < CURDATE() + INTERVAL 1 DAY')
                .andWhere('expense_org_agency', this.org_agency)
                .andWhereNot('expense_is_deleted', 1));
            const thisMonthTotal = (yield this.query()
                .sum('expense_total_amount as this_month_total')
                .from('trabill_expenses')
                .whereRaw('YEAR(expense_date) = YEAR(CURDATE()) AND MONTH(expense_date) = MONTH(CURDATE())')
                .andWhere('expense_org_agency', this.org_agency)
                .andWhereNot('expense_is_deleted', 1));
            const thisYearTotal = (yield this.query()
                .sum('expense_total_amount as this_year_total')
                .from('trabill_expenses')
                .whereRaw('YEAR(expense_date) = YEAR(CURDATE())')
                .andWhere('expense_org_agency', this.org_agency)
                .andWhereNot('expense_is_deleted', 1));
            return {
                today_total: todayTotal[0].today_total || 0,
                this_month_total: thisMonthTotal[0].this_month_total || 0,
                this_year_total: thisYearTotal[0].this_year_total || 0,
            };
        });
        this.getMonthlyExpense = () => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select(this.db.raw('YEAR(expense_created_date) AS year,MONTHNAME(expense_created_date) AS month,CAST(SUM(expense_total_amount) AS FLOAT) AS total_expenses'))
                .from('trabill_expenses')
                .andWhere('expense_org_agency', this.org_agency)
                .andWhereNot('expense_is_deleted', 1)
                .groupByRaw('YEAR(expense_created_date), MONTHNAME(expense_created_date)');
            return data;
        });
        this.getLastInvoices = () => __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .select('invoice_id', 'invcat_title', 'invoice_sales_date', 'employee_full_name', this.db.raw('coalesce(combine_name, client_name) as client_name'), this.db.raw('coalesce(combine_mobile, client_mobile) as client_mobile'), 'invoice_no', 'invoice_sub_total', 'invoice_net_total', 'invoice_total_profit', 'invoice_total_vendor_price')
                .from('trabill_invoices')
                .leftJoin('trabill_users', { user_id: 'invoice_created_by' })
                .leftJoin('trabill_clients', { client_id: 'invoice_client_id' })
                .leftJoin('trabill_combined_clients', {
                combine_id: 'invoice_combined_id',
            })
                .leftJoin('trabill_employees', { employee_id: 'invoice_sales_man_id' })
                .leftJoin('trabill_invoice_categories', {
                invcat_id: 'invoice_category_id',
            })
                .where('invoice_org_agency', this.org_agency)
                .andWhereNot('invoice_is_deleted', 1)
                .limit(10)
                .orderBy('invoice_id', 'desc');
        });
        // DAILY , MONTHLY & YEARLY REPORTS
        this.selectDailySales = () => __awaiter(this, void 0, void 0, function* () {
            const [result] = yield this.query()
                .from('trabill_invoices')
                .select(this.db.raw('SUM(invoice_net_total) AS value'))
                .whereRaw('DATE(invoice_sales_date) = CURDATE()')
                .andWhere('invoice_org_agency', this.org_agency)
                .andWhereNot('invoice_is_deleted', 1)
                .andWhereNot('invoice_is_cancel', 1)
                .andWhereNot('invoice_is_reissued', 1);
            return (result === null || result === void 0 ? void 0 : result.value) || 0;
        });
        this.selectDailyReceived = () => __awaiter(this, void 0, void 0, function* () {
            const [result] = yield this.query()
                .from('trabill_money_receipts')
                .select(this.db.raw('SUM(receipt_total_amount) AS value'))
                .where('receipt_org_agency', this.org_agency)
                .andWhereNot('receipt_has_deleted', 1)
                .andWhereRaw('DATE(receipt_payment_date) = CURDATE()');
            return (result === null || result === void 0 ? void 0 : result.value) || 0;
        });
        this.selectDailyPurchase = () => __awaiter(this, void 0, void 0, function* () {
            const [result] = yield this.query()
                .from('view_invoices_cost')
                .select(this.db.raw('SUM(cost_price) AS value'))
                .whereRaw('DATE(sales_date) = CURDATE()')
                .andWhere('org_agency', this.org_agency);
            return (result === null || result === void 0 ? void 0 : result.value) || 0;
        });
        this.selectDailyPayment = () => __awaiter(this, void 0, void 0, function* () {
            const [result] = yield this.query()
                .from('trabill_vendor_payments')
                .select(this.db.raw('SUM(payment_amount) AS value'))
                .where('vpay_org_agency', this.org_agency)
                .andWhereNot('vpay_is_deleted', 1)
                .andWhereRaw('DATE(payment_date) = CURDATE()');
            return (result === null || result === void 0 ? void 0 : result.value) || 0;
        });
        this.selectDailyRefund = () => __awaiter(this, void 0, void 0, function* () {
            const [result] = yield this.query()
                .from('v_bsp_ticket_refund')
                .select(this.db.raw('SUM(vrefund_return_amount) AS value'))
                .where('vendor_org_agency', this.org_agency)
                .andWhereRaw('DATE(vrefund_date) = CURDATE()');
            return (result === null || result === void 0 ? void 0 : result.value) || 0;
        });
        this.selectDailyExpense = () => __awaiter(this, void 0, void 0, function* () {
            const [result] = yield this.query()
                .from('trabill_expenses')
                .select(this.db.raw('SUM(expense_total_amount) AS value'))
                .where('expense_org_agency', this.org_agency)
                .andWhereNot('expense_is_deleted', 1)
                .andWhereRaw('DATE(expense_date) = CURDATE()');
            return (result === null || result === void 0 ? void 0 : result.value) || 0;
        });
        // monthly
        this.selectMonthlySales = () => __awaiter(this, void 0, void 0, function* () {
            const [result] = yield this.query()
                .from('trabill_invoices')
                .select(this.db.raw('SUM(invoice_net_total) AS value'))
                .whereRaw('YEAR(invoice_sales_date) = YEAR(CURDATE())')
                .andWhereRaw('MONTH(invoice_sales_date) = MONTH(CURDATE())')
                .andWhere('invoice_org_agency', this.org_agency)
                .andWhereNot('invoice_is_deleted', 1)
                .andWhereNot('invoice_is_cancel', 1)
                .andWhereNot('invoice_is_reissued', 1);
            return (result === null || result === void 0 ? void 0 : result.value) || 0;
        });
        this.selectMonthlyReceived = () => __awaiter(this, void 0, void 0, function* () {
            const [result] = yield this.query()
                .from('trabill_money_receipts')
                .select(this.db.raw('SUM(receipt_total_amount) AS value'))
                .where('receipt_org_agency', this.org_agency)
                .andWhereNot('receipt_has_deleted', 1)
                .whereRaw('YEAR(receipt_payment_date) = YEAR(CURDATE())')
                .andWhereRaw('MONTH(receipt_payment_date) = MONTH(CURDATE())');
            return (result === null || result === void 0 ? void 0 : result.value) || 0;
        });
        this.selectMonthlyPurchase = () => __awaiter(this, void 0, void 0, function* () {
            const [result] = yield this.query()
                .from('view_invoices_cost')
                .select(this.db.raw('SUM(cost_price) AS value'))
                .whereRaw('YEAR(sales_date) = YEAR(CURDATE())')
                .andWhereRaw('MONTH(sales_date) = MONTH(CURDATE())')
                .andWhere('org_agency', this.org_agency);
            return (result === null || result === void 0 ? void 0 : result.value) || 0;
        });
        this.selectMonthlyPayment = () => __awaiter(this, void 0, void 0, function* () {
            const [result] = yield this.query()
                .from('trabill_vendor_payments')
                .select(this.db.raw('SUM(payment_amount) AS value'))
                .where('vpay_org_agency', this.org_agency)
                .andWhereNot('vpay_is_deleted', 1)
                .whereRaw('YEAR(payment_date) = YEAR(CURDATE())')
                .andWhereRaw('MONTH(payment_date) = MONTH(CURDATE())');
            return (result === null || result === void 0 ? void 0 : result.value) || 0;
        });
        this.selectMonthlyRefund = () => __awaiter(this, void 0, void 0, function* () {
            const [result] = yield this.query()
                .from('v_bsp_ticket_refund')
                .select(this.db.raw('SUM(vrefund_return_amount) AS value'))
                .where('vendor_org_agency', this.org_agency)
                .whereRaw('YEAR(vrefund_date) = YEAR(CURDATE())')
                .andWhereRaw('MONTH(vrefund_date) = MONTH(CURDATE())');
            return (result === null || result === void 0 ? void 0 : result.value) || 0;
        });
        this.selectMonthlyExpense = () => __awaiter(this, void 0, void 0, function* () {
            const [result] = yield this.query()
                .from('trabill_expenses')
                .select(this.db.raw('SUM(expense_total_amount) AS value'))
                .where('expense_org_agency', this.org_agency)
                .andWhereNot('expense_is_deleted', 1)
                .whereRaw('YEAR(expense_date) = YEAR(CURDATE())')
                .andWhereRaw('MONTH(expense_date) = MONTH(CURDATE())');
            return (result === null || result === void 0 ? void 0 : result.value) || 0;
        });
        // yearly
        this.selectYearlySales = () => __awaiter(this, void 0, void 0, function* () {
            const [result] = yield this.query()
                .from('trabill_invoices')
                .select(this.db.raw('SUM(invoice_net_total) AS value'))
                .whereRaw('YEAR(invoice_sales_date) = YEAR(CURDATE())')
                .andWhere('invoice_org_agency', this.org_agency)
                .andWhereNot('invoice_is_deleted', 1)
                .andWhereNot('invoice_is_cancel', 1)
                .andWhereNot('invoice_is_reissued', 1);
            return (result === null || result === void 0 ? void 0 : result.value) || 0;
        });
        this.selectYearlyReceived = () => __awaiter(this, void 0, void 0, function* () {
            const [result] = yield this.query()
                .from('trabill_money_receipts')
                .select(this.db.raw('SUM(receipt_total_amount) AS value'))
                .where('receipt_org_agency', this.org_agency)
                .andWhereNot('receipt_has_deleted', 1)
                .whereRaw('YEAR(receipt_payment_date) = YEAR(CURDATE())');
            return (result === null || result === void 0 ? void 0 : result.value) || 0;
        });
        this.selectYearlyPurchase = () => __awaiter(this, void 0, void 0, function* () {
            const [result] = yield this.query()
                .from('view_invoices_cost')
                .select(this.db.raw('SUM(cost_price) AS value'))
                .whereRaw('YEAR(sales_date) = YEAR(CURDATE())')
                .andWhere('org_agency', this.org_agency);
            return (result === null || result === void 0 ? void 0 : result.value) || 0;
        });
        this.selectYearlyPayment = () => __awaiter(this, void 0, void 0, function* () {
            const [result] = yield this.query()
                .from('trabill_vendor_payments')
                .select(this.db.raw('SUM(payment_amount) AS value'))
                .where('vpay_org_agency', this.org_agency)
                .andWhereNot('vpay_is_deleted', 1)
                .whereRaw('YEAR(payment_date) = YEAR(CURDATE())');
            return (result === null || result === void 0 ? void 0 : result.value) || 0;
        });
        this.selectYearlyRefund = () => __awaiter(this, void 0, void 0, function* () {
            const [result] = yield this.query()
                .from('v_bsp_ticket_refund')
                .select(this.db.raw('SUM(vrefund_return_amount) AS value'))
                .where('vendor_org_agency', this.org_agency)
                .whereRaw('YEAR(vrefund_date) = YEAR(CURDATE())');
            return (result === null || result === void 0 ? void 0 : result.value) || 0;
        });
        this.selectYearlyExpense = () => __awaiter(this, void 0, void 0, function* () {
            const [result] = yield this.query()
                .from('trabill_expenses')
                .select(this.db.raw('SUM(expense_total_amount) AS value'))
                .where('expense_org_agency', this.org_agency)
                .andWhereNot('expense_is_deleted', 1)
                .whereRaw('YEAR(expense_date) = YEAR(CURDATE())');
            return (result === null || result === void 0 ? void 0 : result.value) || 0;
        });
        this.getMonthReport = () => __awaiter(this, void 0, void 0, function* () {
            const [[data]] = yield this.db.raw(`call ${this.database}.get_dashboard_this_month_report(${this.org_agency});`);
            return data;
        });
        this.getBspTicketIssueInfo = (from_date, to_date) => __awaiter(this, void 0, void 0, function* () {
            const [data] = yield this.query()
                .select('airticket_vendor_id as vendor_id', this.db.raw('sum(airticket_gross_fare) as gross_fare'), this.db.raw('sum(airticket_tax) as tax'), this.db.raw('sum(airticket_base_fare) * 0.07 as iata_commission'), this.db.raw('sum(airticket_total_taxes_commission) as taxes_commission'), this.db.raw('SUM(airticket_ait) as ait'), this.db.raw('sum(airticket_purchase_price) as purchase_amount'), this.db.raw('sum(airticket_profit) as overall_profit'))
                .from('v_bsp_ticket_issue')
                .where('vendor_org_agency', this.org_agency)
                .andWhere('vendor_type', 'IATA')
                .andWhereRaw(`DATE(airticket_sales_date) BETWEEN ? AND ?`, [
                from_date,
                to_date,
            ]);
            return data;
        });
        this.getBspTicketIssueSummary = (from_date, to_date) => __awaiter(this, void 0, void 0, function* () {
            const ticket_issue = yield this.query()
                .select('*')
                .from('v_bsp_ticket_issue')
                .where('vendor_org_agency', this.org_agency)
                .andWhere('vendor_type', 'IATA')
                .andWhereRaw(`DATE(airticket_sales_date) BETWEEN ? AND ?`, [
                from_date,
                to_date,
            ]);
            // const [{ total_ticket_issue }] = (await this.query()
            //   .sum('airticket_purchase_price as total_ticket_issue')
            //   .from('v_bsp_ticket_issue')
            //   .where('vendor_org_agency', this.org_agency)
            //   .andWhere('vendor_type', 'IATA')
            //   .andWhereRaw(`DATE(airticket_sales_date) BETWEEN ? AND ?`, [
            //     from_date,
            //     to_date,
            //   ])) as { total_ticket_issue: string }[];
            return { ticket_issue };
        });
        this.getBspTicketReissueInfo = (from_date, to_date) => __awaiter(this, void 0, void 0, function* () {
            const [data] = yield this.query()
                .select(this.db.raw('sum(airticket_client_price) as gross_fare'), this.db.raw('sum(airticket_tax) as tax'), this.db.raw('sum(airticket_fare_difference) * 0.07 as iata_commission'), this.db.raw('0 as taxes_commission'), this.db.raw('SUM(airticket_ait) as ait'), this.db.raw('sum(airticket_purchase_price) as purchase_amount'), this.db.raw('sum(airticket_profit) as overall_profit'))
                .from('v_bsp_ticket_reissue')
                .where('airticket_org_agency', this.org_agency)
                .andWhere('vendor_type', 'IATA')
                .andWhereRaw(`DATE(airticket_sales_date) BETWEEN ? AND ?`, [
                from_date,
                to_date,
            ]);
            return data;
        });
        this.getBspTicketReissueSummary = (from_date, to_date) => __awaiter(this, void 0, void 0, function* () {
            const ticket_re_issue = yield this.query()
                .select('*')
                .from('v_bsp_ticket_reissue')
                .where('airticket_org_agency', this.org_agency)
                .andWhere('vendor_type', 'IATA')
                .andWhereRaw(`DATE(airticket_sales_date) BETWEEN ? AND ?`, [
                from_date,
                to_date,
            ]);
            return { ticket_re_issue };
        });
        this.getBspTicketRefundInfo = (from_date, to_date) => __awaiter(this, void 0, void 0, function* () {
            const [data] = (yield this.query()
                .sum('vrefund_return_amount as refund_amount')
                .from('v_bsp_ticket_refund')
                .where('vendor_org_agency', this.org_agency)
                .andWhere('vendor_type', 'IATA')
                .andWhereRaw(`DATE(vrefund_date) BETWEEN ? AND ?`, [
                from_date,
                to_date,
            ]));
            return data;
        });
        // BSP IATA PAYMENT
        this.getBSPBillingPayment = (from_date, to_date) => __awaiter(this, void 0, void 0, function* () {
            if (!from_date || !to_date) {
                return [];
            }
            return yield this.db
                .queryBuilder()
                .from('trabill_vendor_payments')
                .select('vpay_id', 'vouchar_no', 'payment_method_id', 'payment_amount', 'payment_date', 'vendor_id', 'vendor_name', 'account_id', 'account_name', 'user_id', 'user_full_name')
                .leftJoin('trabill_vendors', 'vendor_id', 'vpay_vendor_id')
                .leftJoin('trabill_accounts', 'account_id', 'vpay_account_id')
                .leftJoin('trabill_users', 'user_id', 'created_by')
                .where('vendor_org_agency', this.org_agency)
                .andWhereNot('vpay_is_deleted', 1)
                .andWhere('vendor_type', 'IATA')
                .andWhereRaw('Date(payment_date) BETWEEN ? AND ?', [from_date, to_date]);
        });
        this.getBspTicketRefundSummary = (from_date, to_date) => __awaiter(this, void 0, void 0, function* () {
            const ticket_refund = yield this.query()
                .select('*')
                .from('v_bsp_ticket_refund')
                .where('vendor_org_agency', this.org_agency)
                .andWhere('vendor_type', 'IATA')
                .andWhereRaw(`DATE(vrefund_date) BETWEEN ? AND ?`, [from_date, to_date]);
            return { ticket_refund };
        });
        // GET ACCOUNT DETAILS BY ACCOUNT TYPE
        this.getAccountDetailsByType = (accountType, limit = 20, offset = 0) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.query()
                .select('account_id', 'account_org_agency', 'account_acctype_id', 'account_name', 'account_number', 'account_bank_name', 'account_lbalance', this.db.raw('SUM(expense_total_amount) as total_expense'), this.db.raw('SUM(payroll_net_amount) AS total_payroll'), this.db.raw('SUM(payment_amount) AS total_payment'), this.db.raw('SUM(receipt_total_amount) AS total_received'), 'account_create_date')
                .from('trabill_accounts')
                .joinRaw('left join trabill_expenses on expense_accounts_id = account_id and expense_date >= CURDATE() AND expense_date < CURDATE() + INTERVAL 1 DAY')
                .joinRaw('LEFT JOIN trabill_payroll ON account_id= payroll_account_id AND payroll_date >= CURDATE() AND payroll_date < CURDATE() + INTERVAL 1 DAY')
                .joinRaw('LEFT JOIN trabill_vendor_payments ON account_id = vpay_account_id  AND payment_date >= CURDATE() AND payment_date < CURDATE() + INTERVAL 1 DAY')
                .joinRaw('LEFT JOIN trabill_money_receipts ON account_id = vpay_account_id  AND receipt_payment_date >= CURDATE() AND receipt_payment_date < CURDATE() + INTERVAL 1 DAY')
                .where('account_org_agency', this.org_agency)
                .andWhere('account_acctype_id', accountType)
                .andWhere('account_is_deleted', '<>', 1)
                .groupBy('account_id')
                .limit(limit)
                .offset(offset);
            const [count] = (yield this.query()
                .count('account_id as total')
                .from('trabill_accounts')
                .where('account_org_agency', this.org_agency)
                .andWhere('account_acctype_id', accountType)
                .andWhere('account_is_deleted', '<>', 1));
            return { count: count.total, data: result };
        });
        this.iataBankGuaranteeLimit = () => __awaiter(this, void 0, void 0, function* () {
            const [result] = yield this.query()
                .select('vendor_bank_guarantee as limit_amount', 'vendor_lbalance as uses_amount')
                .from('trabill_vendors')
                .where('vendor_type', 'IATA')
                .andWhere('vendor_org_agency', this.org_agency)
                .andWhereNot('vendor_is_deleted', 1);
            return result;
        });
        this.getTicketInfoByTicket = (ticket_no) => __awaiter(this, void 0, void 0, function* () {
            const [ticket] = yield this.query()
                .select([
                'invoice_id as id',
                this.db.raw("'DB' AS type"),
                'invoice_no',
                'invoice_category_id',
                'airticket_ticket_no as ticket_no',
                'airticket_sales_date as sales_date',
                'airticket_gross_fare as gross_fare',
                'airticket_base_fare as base_fare',
                'airticket_commission_percent as commission_percent',
                'airticket_commission_percent_total as commission_percent_total',
                'airticket_ait as ait',
                'airticket_purchase_price as purchase_price',
            ])
                .from('trabill.v_bsp_ticket_issue')
                .where('airticket_ticket_no', 'like', `%${ticket_no}%`)
                .andWhere('vendor_org_agency', this.org_agency);
            return ticket;
        });
        this.getTicketInfoByTicket1 = (ticket_no) => __awaiter(this, void 0, void 0, function* () {
            const [ticket] = yield this.query()
                .select([
                'invoice_id as id',
                this.db.raw("'DB' as type"),
                'invoice_no',
                'invoice_category_id',
                this.db.raw('COALESCE(iat.airticket_ticket_no, ir.airticket_ticket_no) as ticket_no'),
                this.db.raw('COALESCE(iat.airticket_sales_date, ir.airticket_sales_date) as sales_date'),
                this.db.raw('COALESCE(iat.airticket_gross_fare, ir.airticket_client_price) as gross_fare'),
                this.db.raw('COALESCE(iat.airticket_base_fare, ir.airticket_fare_difference) as base_fare'),
                this.db.raw('COALESCE(iat.airticket_commission_percent, ir.airticket_commission_percent) as commission_percent'),
                this.db.raw('COALESCE(Round(iat.airticket_commission_percent_total), Round(ir.airticket_fare_difference * ir.airticket_commission_percent / 100)) as commission_percent_total'),
                this.db.raw('COALESCE(iat.airticket_ait, ir.airticket_ait) as ait'),
                this.db.raw('COALESCE(iat.airticket_purchase_price, ir.airticket_purchase_price) as purchase_price'),
                'airline_code',
                'client_name',
                'invoice_sales_date',
            ])
                .from('trabill_invoices')
                .leftJoin('trabill_invoice_airticket_items as iat', (event) => {
                event
                    .on('iat.airticket_invoice_id', '=', 'invoice_id')
                    .andOn(this.db.raw('invoice_category_id = 1'));
            })
                .leftJoin('trabill_invoice_reissue_airticket_items as ir', (event) => {
                event
                    .on('ir.airticket_invoice_id', '=', 'invoice_id')
                    .andOn(this.db.raw('invoice_category_id = 3'));
            })
                .leftJoin('trabill_airlines', function () {
                this.on('iat.airticket_airline_id', '=', 'airline_id').orOn('ir.airticket_airline_id', '=', 'airline_id');
            })
                .leftJoin('trabill_clients', 'invoice_client_id', 'client_id')
                .whereIn('invoice_category_id', [1, 3])
                .andWhere('invoice_org_agency', this.org_agency)
                .andWhere('invoice_is_deleted', '<>', 1)
                .andWhere(this.db.raw('COALESCE(iat.airticket_ticket_no, ir.airticket_ticket_no)'), 'like', `%${ticket_no}%`);
            return ticket;
        });
        this.getTicketInfoByRefund = (ticket_no) => __awaiter(this, void 0, void 0, function* () {
            const [ticket] = yield this.query()
                .select({ refund_id: 'vrefund_refund_id' }, this.db.raw("'DB' AS type"), 'airticket_ticket_no as ticket_no', 'atrefund_vouchar_number as vouchar_number', 'client_name', 'comb_client', 'refund_type', 'vrefund_total_amount as total_amount', 'vrefund_charge_amount as charge_amount', 'vrefund_date as date', 'vrefund_return_amount as return_amount', 'airline_name')
                .from('trabill.v_bsp_ticket_refund')
                .where('airticket_ticket_no', 'like', `%${ticket_no}%`)
                .andWhere('vendor_org_agency', this.org_agency);
            return ticket;
        });
        this.checkBspFileIsExist = (fileName) => __awaiter(this, void 0, void 0, function* () {
            const [{ count }] = (yield this.query()
                .count('* as count')
                .from('trabill_bsp_bill')
                .where('bsp_agency_id', this.org_agency)
                .andWhere('bsp_file_name', fileName)
                .andWhereNot('bsp_is_deleted', 1));
            return count;
        });
    }
    // BSP BILLING INFORMATION /: DELETE FROM SERVICE
    bspBillingInformation(from_date, to_date) {
        return __awaiter(this, void 0, void 0, function* () {
            from_date = (0, moment_1.default)(new Date(from_date)).format('YYYY-MM-DD');
            to_date = (0, moment_1.default)(new Date(to_date)).format('YYYY-MM-DD');
            const [data] = (yield this.query()
                .select(this.db.raw('SUM(airticket_gross_fare) AS gross_fare'), this.db.raw('SUM(airticket_tax) as tax'), this.db.raw('SUM(airticket_base_fare) * 0.07 as gross_commission'), this.db.raw('SUM(airticket_total_taxes_commission) as taxes_commission'), this.db.raw('SUM(airticket_ait) as ait'))
                .from('trabill_invoice_airticket_items')
                .whereNot('airticket_is_deleted', 1)
                .andWhere('airticket_org_agency', this.org_agency)
                .andWhereRaw(`DATE_FORMAT(airticket_sales_date, '%Y-%m-%d') BETWEEN ? AND ?`, [from_date, to_date]));
            return data;
        });
    }
    getVendorBankGuarantee() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select('trabill_vendors.vendor_id', 'vendor_name', 'vendor_bank_guarantee', 'vendor_lbalance', this.db.raw('COALESCE(vendor_bank_guarantee, 0) + vendor_lbalance AS remaining_bank_guarantee'), 'vendor_start_date', 'vendor_end_date')
                .from('trabill_vendors')
                .whereNot('vendor_is_deleted', 1)
                .andWhere('vendor_org_agency', this.org_agency)
                .limit(3);
            return data;
        });
    }
    getBestClients(year, month) {
        return __awaiter(this, void 0, void 0, function* () {
            year = year && (0, moment_1.default)(new Date(year)).format('YYYY');
            month = month && (0, moment_1.default)(new Date(month)).format('YYYY-MM');
            const data = yield this.query()
                .select(this.db.raw(`COALESCE(CONCAT('client-', invoice_client_id),
        CONCAT('combined-', invoice_combined_id)) AS comb_client`), this.db.raw(`COALESCE(client_name, combine_name) AS client_name`), this.db.raw(`COALESCE(client_email, combine_email) AS client_email`), this.db.raw(`COALESCE(client_mobile, combine_mobile) AS client_mobile`), this.db.raw(`COALESCE(client_address, combine_address) AS client_address`), this.db.raw(`COALESCE(client_lbalance, combine_lbalance) AS client_last_balance`), this.db.raw(`SUM(invoice_net_total) AS invoice_net_total`), 'invoice_sales_date')
                .from('trabill_invoices')
                .leftJoin('trabill_clients', { client_id: 'invoice_client_id' })
                .leftJoin('trabill_combined_clients', {
                combine_id: 'invoice_combined_id',
            })
                .whereNot('invoice_is_deleted', 1)
                .andWhere('invoice_org_agency', this.org_agency)
                .andWhere((event) => {
                if (year) {
                    event.andWhereRaw(`DATE_FORMAT(invoice_sales_date, '%Y') = ?`, [
                        year,
                    ]);
                }
                if (month) {
                    event.andWhereRaw(`DATE_FORMAT(invoice_sales_date, '%Y-%m') = ?`, [
                        month,
                    ]);
                }
            })
                .orderByRaw(`SUM(invoice_net_total) desc`)
                .groupBy('invoice_client_id', 'invoice_combined_id')
                .limit(10);
            return data;
        });
    }
    getBestEmployee(year, month) {
        return __awaiter(this, void 0, void 0, function* () {
            year = year && (0, moment_1.default)(new Date(year)).format('YYYY');
            month = month && (0, moment_1.default)(new Date(month)).format('YYYY-MM');
            const data = yield this.query()
                .select(this.db.raw(`SUM(invoice_net_total) AS invoice_net_total`), 'employee_id', 'employee_full_name', 'employee_email', 'employee_mobile', 'employee_salary', 'employee_commission', 'employee_address', this.db.raw(`COUNT(invoice_sales_man_id) AS total`))
                .from('trabill_invoices')
                .leftJoin('trabill_employees', { employee_id: 'invoice_sales_man_id' })
                .where('invoice_org_agency', this.org_agency)
                .andWhereNot('invoice_is_deleted', 1)
                .andWhere((event) => {
                if (year)
                    event.andWhereRaw(`DATE_FORMAT(invoice_sales_date, '%Y') = ?`, [
                        year,
                    ]);
                if (month)
                    event.andWhereRaw(`DATE_FORMAT(invoice_sales_date, '%Y-%m') = ?`, [
                        month,
                    ]);
            })
                .orderByRaw(`COUNT(invoice_sales_man_id) desc`)
                .groupBy('invoice_sales_man_id')
                .limit(10);
            return data;
        });
    }
    insertBspFile(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.query().insert(data).into('trabill_bsp_bill');
        });
    }
    deleteBSPDocs(tbd_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [{ tbd_doc }] = (yield this.query()
                .select('tbd_doc')
                .from('trabill_bsp_docs')
                .where({ tbd_id }));
            yield this.query()
                .update({ tbd_is_deleted: 1 })
                .into('trabill_bsp_docs')
                .where({ tbd_id });
            return tbd_doc;
        });
    }
    selectBspFiles(search, date) {
        return __awaiter(this, void 0, void 0, function* () {
            date = date ? (0, moment_1.default)(new Date(date)).format('YYYY-MM-DD') : undefined;
            const data = yield this.query()
                .select('bsp_id', 'bsp_file_name')
                .from('trabill_bsp_bill')
                .where('bsp_agency_id', this.org_agency)
                .andWhereNot('bsp_is_deleted', 1)
                .modify((builder) => {
                if (date) {
                    builder.andWhereRaw('Date(bsp_bill_date)', date);
                }
                if (search) {
                    builder.andWhereILike('bsp_file_name', `%${search}%`);
                }
            })
                .limit(50);
            return data;
        });
    }
    bspFileList(search, page = 1, size = 50, date) {
        return __awaiter(this, void 0, void 0, function* () {
            date = date ? (0, moment_1.default)(new Date(date)).format('YYYY-MM-DD') : undefined;
            const offset = (page - 1) * size;
            const data = yield this.query()
                .select('bsp_id', 'bsp_file_name', 'bsp_file_url', 'bsp_bill_date', 'bsp_created_date', 'user_full_name as created_by')
                .from('trabill_bsp_bill')
                .leftJoin('trabill_users', { user_id: 'bsp_created_by' })
                .where('bsp_agency_id', this.org_agency)
                .andWhereNot('bsp_is_deleted', 1)
                .modify((builder) => {
                if (date) {
                    builder.whereRaw('Date(bsp_bill_date) = ?', [date]);
                }
                if (search) {
                    builder.andWhereILike('bsp_file_name', `%${search}%`);
                }
            })
                .limit(size)
                .offset(offset);
            const [{ count }] = yield this.query()
                .count('* as count')
                .from('trabill_bsp_bill')
                .where('bsp_agency_id', this.org_agency)
                .andWhereNot('bsp_is_deleted', 1)
                .modify((builder) => {
                if (date) {
                    builder.whereRaw('Date(bsp_bill_date) = ?', [date]);
                }
                if (search) {
                    builder.andWhereILike('bsp_file_name', `%${search}%`);
                }
            });
            return { data, count };
        });
    }
    getBspFileUrl(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [data] = (yield this.query()
                .select('bsp_file_url')
                .from('trabill_bsp_bill')
                .where('bsp_agency_id', this.org_agency)
                .andWhere('bsp_id', id));
            return data;
        });
    }
}
exports.default = DashboardModels;
//# sourceMappingURL=dashboard.models.js.map