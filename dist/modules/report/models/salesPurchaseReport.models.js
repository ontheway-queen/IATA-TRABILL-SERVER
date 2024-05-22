"use strict";
/*
refactor code sales purchase report models
@Author MD Sabbir <sabbir.m360ict@gmail.com>
*/
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
const dayjs_1 = __importDefault(require("dayjs"));
const moment_1 = __importDefault(require("moment"));
const abstract_models_1 = __importDefault(require("../../../abstracts/abstract.models"));
const common_helper_1 = require("../../../common/helpers/common.helper");
class SalesPurchasesReport extends abstract_models_1.default {
    constructor() {
        super(...arguments);
        this.salesPurchaseReport = (user_id) => __awaiter(this, void 0, void 0, function* () {
            const today = new Date().toISOString().slice(0, 10);
            const [user] = (yield this.query()
                .select('user_data_percent')
                .from('trabill_users')
                .where({ user_id }));
            const [{ total_sales }] = (yield this.query()
                .count('* as total_sales')
                .from('view_invoice_total_billing')
                .whereRaw('DATE(sales_date) = ?', today)
                .where('org_agency_id', this.org_agency));
            const sales = yield this.query()
                .select('invoice_no', 'client_name', this.db.raw(`(sales_price - invoice_discount) AS sales_price`), 'sales_date', 'create_date')
                .from('view_invoice_total_billing')
                .whereRaw('DATE(sales_date) = ?', today)
                .where('org_agency_id', this.org_agency)
                .limit(Math.round((total_sales || 0) * (+user.user_data_percent / 100)));
            const [{ total_collection }] = (yield this.query()
                .count('* as total_collection')
                .from('trabill_money_receipts')
                .whereRaw('DATE(receipt_payment_date) = ?', today)
                .andWhere('receipt_org_agency', this.org_agency)
                .andWhereNot('receipt_has_deleted', 1)
                .andWhereNot('receipt_payment_to', 'AGENT_COMMISSION'));
            const collection = yield this.query()
                .select('receipt_vouchar_no', 'receipt_payment_to', this.db.raw('coalesce(combine_name, client_name, company_name) as client_name'), 'receipt_total_amount', 'receipt_payment_date')
                .from('trabill_money_receipts')
                .leftJoin('trabill_clients', {
                client_id: 'receipt_client_id',
            })
                .leftJoin('trabill_client_company_information', {
                'trabill_client_company_information.company_client_id': 'trabill_clients.client_id',
            })
                .leftJoin('trabill_combined_clients', {
                receipt_combined_id: 'combine_id',
            })
                .whereRaw('DATE(receipt_payment_date) = ?', today)
                .andWhere('receipt_org_agency', this.org_agency)
                .andWhereNot('receipt_has_deleted', 1)
                .andWhereNot('receipt_payment_to', 'AGENT_COMMISSION')
                .limit(Math.round((total_collection || 0) * (+user.user_data_percent / 100)));
            return { sales, collection };
        });
        this.paymentAndPurchase = (user_id) => __awaiter(this, void 0, void 0, function* () {
            const date = (0, dayjs_1.default)().format('YYYY-MM-DD');
            const [user] = (yield this.query()
                .select('user_data_percent')
                .from('trabill_users')
                .where({ user_id }));
            const [{ total_count }] = (yield this.query()
                .count('* as total_count')
                .from('view_invoices_billing')
                .where('org_agency_id', this.org_agency)
                .andWhereRaw('DATE_FORMAT(sales_date, "%Y-%m-%d") = ?', [date]));
            const purchase = yield this.query()
                .select('invoice_no', 'cost_price', 'sales_date AS invoice_sales_date', 'vendor_name', 'create_date')
                .from('view_invoices_billing')
                .where('org_agency_id', this.org_agency)
                .andWhereRaw('DATE_FORMAT(sales_date, "%Y-%m-%d") = ?', [date])
                .limit(Math.round((total_count * +user.user_data_percent) / 100));
            const [{ total_payment }] = (yield this.query()
                .count('* as total_payment')
                .from('trabill_vendor_payments')
                .whereRaw('DATE_FORMAT(payment_date, "%Y-%m-%d") = ?', [date])
                .andWhere('vpay_org_agency', this.org_agency)
                .andWhereNot('vpay_is_deleted', 1));
            const payments = yield this.query()
                .select('invoice_no', 'vouchar_no', this.db.raw('coalesce(combine_name, vendor_name) as vendor_name'), 'vpay_receipt_no', 'cost_price', 'payment_amount', 'payment_date')
                .from('trabill_vendor_payments')
                .leftJoin('view_invoices_details', { invoice_id: 'vpay_invoice_id' })
                .leftJoin('trabill_vendors as vendor', {
                vpay_vendor_id: 'vendor.vendor_id',
            })
                .leftJoin('trabill_combined_clients as combined', {
                vpay_combined_id: 'combined.combine_id',
            })
                .whereRaw('DATE_FORMAT(payment_date, "%Y-%m-%d") = ?', [date])
                .andWhere('vpay_org_agency', this.org_agency)
                .andWhereNot('vpay_is_deleted', 1)
                .limit(Math.round((total_payment || 0) * (+user.user_data_percent / 100)));
            return { purchase, payments };
        });
        this.getTaxReport = (from_date, to_date, page, size) => __awaiter(this, void 0, void 0, function* () {
            from_date = (0, moment_1.default)(new Date(from_date)).format('YYYY-MM-DD');
            to_date = (0, moment_1.default)(new Date(to_date)).format('YYYY-MM-DD');
            const offset = (page - 1) * size;
            const data = yield this.query()
                .select('invoice_vat', 'invoice_no', 'invoice_sales_date', this.db.raw('COALESCE(client_name, company_name, combine_name) as client_name'))
                .from('trabill_invoices_extra_amounts')
                .leftJoin('trabill_invoices', { invoice_id: 'extra_amount_invoice_id' })
                .leftJoin('trabill_clients', { client_id: 'invoice_client_id' })
                .leftJoin('trabill_client_company_information', {
                company_client_id: 'invoice_client_id',
            })
                .leftJoin('trabill_combined_clients', {
                combine_id: 'invoice_combined_id',
            })
                .where('invoice_vat', '>', 0)
                .andWhere('invoice_org_agency', this.org_agency)
                .andWhere('invoice_is_deleted', 0)
                .andWhereRaw(`DATE_FORMAT(invoice_sales_date,'%Y-%m-%d') BETWEEN ? AND ?`, [from_date, to_date])
                .limit(size)
                .offset(offset);
            const [{ row_count }] = yield this.query()
                .select(this.db.raw(`COUNT(*) as row_count`))
                .from('trabill_invoices_extra_amounts')
                .leftJoin('trabill_invoices', { invoice_id: 'extra_amount_invoice_id' })
                .where('invoice_vat', '>', 0)
                .andWhere('invoice_org_agency', this.org_agency)
                .andWhere('invoice_is_deleted', 0)
                .andWhereRaw(`DATE_FORMAT(invoice_sales_date,'%Y-%m-%d') BETWEEN ? AND ?`, [from_date, to_date]);
            return { count: row_count, data };
        });
        this.getOtherTaxReport = (from_date, to_date, page, size) => __awaiter(this, void 0, void 0, function* () {
            from_date = (0, moment_1.default)(new Date(from_date)).format('YYYY-MM-DD');
            to_date = (0, moment_1.default)(new Date(to_date)).format('YYYY-MM-DD');
            const offset = (page - 1) * size;
            const data = yield this.query()
                .select('invoice_id', 'invoice_category_id', 'invoice_client_id', 'invoice_combined_id', 'invoice_no', 'invoice_sales_date', this.db.raw(`COALESCE(client_name, company_name, combine_name) as client_name`), 'airticket_tax', 'airticket_tax1', 'airticket_bd_charge', 'airticket_xt_charge', 'airticket_ut_charge', 'airticket_es_charge', 'airticket_ow_charge', 'airticket_pz_charge', 'airticket_qa_charge', 'airticket_g4_charge', 'airticket_e5_charge', 'airticket_p7_charge', 'airticket_p8_charge', 'airticket_r9_charge', this.db.raw(`(
          COALESCE(airticket_tax,0) +
          COALESCE(airticket_tax1,0) +
          airticket_bd_charge +
          airticket_xt_charge +
          airticket_ut_charge +
          airticket_es_charge +
          airticket_ow_charge +
          airticket_pz_charge +
          airticket_qa_charge +
          airticket_g4_charge +
          airticket_e5_charge +
          airticket_p7_charge +
          airticket_p8_charge +
          airticket_r9_charge
      ) AS total`))
                .from('trabill_invoice_airticket_items')
                .leftJoin('trabill_invoices', { invoice_id: 'airticket_invoice_id' })
                .leftJoin('trabill_clients', { client_id: 'invoice_client_id' })
                .leftJoin('trabill_client_company_information', {
                company_client_id: 'invoice_client_id',
            })
                .leftJoin('trabill_combined_clients', {
                combine_id: 'invoice_combined_id',
            })
                .where('airticket_org_agency', this.org_agency)
                .andWhereRaw(`DATE_FORMAT(invoice_sales_date, '%Y-%m-%d') BETWEEN ? AND ?`, [from_date, to_date])
                .andWhere('airticket_is_deleted', 0)
                .limit(size)
                .offset(offset);
            const [{ row_count }] = yield this.query()
                .select(this.db.raw('count(*) as row_count'))
                .from('trabill_invoice_airticket_items')
                .leftJoin('trabill_invoices', { invoice_id: 'airticket_invoice_id' })
                .where('airticket_org_agency', this.org_agency)
                .andWhereRaw(`DATE_FORMAT(invoice_sales_date, '%Y-%m-%d') BETWEEN ? AND ?`, [from_date, to_date])
                .andWhere('airticket_is_deleted', 0);
            return { count: row_count, data };
        });
        this.getSumTaxAmount = (from_date, to_date) => __awaiter(this, void 0, void 0, function* () {
            from_date = (0, moment_1.default)(new Date(from_date)).format('YYYY-MM-DD');
            to_date = (0, moment_1.default)(new Date(to_date)).format('YYYY-MM-DD');
            const [data] = yield this.query()
                .select(this.db.raw(`sum(
          COALESCE(airticket_tax,0) +
          COALESCE(airticket_tax1,0) +
          airticket_bd_charge +
          airticket_xt_charge +
          airticket_ut_charge +
          airticket_es_charge +
          airticket_ow_charge +
          airticket_pz_charge +
          airticket_qa_charge +
          airticket_g4_charge +
          airticket_e5_charge +
          airticket_p7_charge +
          airticket_p8_charge +
          airticket_r9_charge
      ) AS total`))
                .from('trabill_invoice_airticket_items')
                .leftJoin('trabill_invoices', { invoice_id: 'airticket_invoice_id' })
                .where('airticket_org_agency', this.org_agency)
                .andWhereRaw(`DATE_FORMAT(invoice_sales_date, '%Y-%m-%d') BETWEEN ? AND ?`, [from_date, to_date])
                .andWhere('airticket_is_deleted', 0);
            return data;
        });
        // OVERALL PROFIT LOSS
        // sales report summary
        this.getSalesReportSummary = (from_date, to_date, page, size) => __awaiter(this, void 0, void 0, function* () {
            const offset = (page - 1) * size;
            const data = yield this.query()
                .from('trabill_invoices')
                .select('invoice_id', 'invoice_client_id', 'invoice_combined_id', 'invoice_reissue_client_type', 'invoice_no', 'invoice_category_id', 'invoice_sub_total', 'invoice_net_total', 'invoice_total_profit', 'invoice_sales_date', 'invoice_note', this.db.raw('COALESCE(client_name, combine_name) AS client_name'))
                .leftJoin('trabill_clients', 'client_id', 'invoice_client_id')
                .leftJoin('trabill_combined_clients', 'combine_id', 'invoice_combined_id')
                .whereNot('invoice_is_deleted', 1)
                .andWhere('invoice_org_agency', this.org_agency)
                .andWhereRaw(`DATE_FORMAT(invoice_sales_date,'%Y-%m-%d') BETWEEN ? AND ?`, [from_date, to_date])
                .limit(size)
                .offset(offset);
            const [{ count }] = yield this.query()
                .from('trabill_invoices')
                .count('* as count')
                .whereNot('invoice_is_deleted', 1)
                .andWhere('invoice_org_agency', this.org_agency)
                .andWhereRaw(`DATE_FORMAT(invoice_sales_date,'%Y-%m-%d') BETWEEN ? AND ?`, [from_date, to_date])
                .limit(size)
                .offset(offset);
            return { data, count };
        });
    }
    getSalesReport(comb_client, employee_id, from_date, to_date, page, size, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            from_date = (0, moment_1.default)(new Date(from_date)).format('YYYY-MM-DD');
            to_date = (0, moment_1.default)(new Date(to_date)).format('YYYY-MM-DD');
            const offset = (page - 1) * size;
            const { client_id, combined_id } = (0, common_helper_1.separateCombClientToId)(comb_client);
            const [{ count }] = yield this.query()
                .count('* as count')
                .from('view_sales_and_purchase_report')
                .andWhereRaw('DATE(invoice_sales_date) BETWEEN ? AND ?', [
                from_date,
                to_date,
            ])
                .modify((builder) => {
                if (employee_id && employee_id !== 'all') {
                    builder.where('invoice_sales_man_id', employee_id);
                }
                if (client_id) {
                    builder.where('invoice_client_id', client_id);
                }
                if (combined_id) {
                    builder.where('invoice_combined_id', combined_id);
                }
            })
                .andWhere('org_agency_id', this.org_agency);
            const [user] = (yield this.query()
                .select('user_data_percent')
                .from('trabill_users')
                .where({ user_id }));
            let total_count = count;
            if (user && user.user_data_percent) {
                total_count = Math.round((count * +user.user_data_percent) / 100);
                if (size > total_count) {
                    size = total_count;
                }
                if (page - 1 > 0) {
                    size = total_count - offset;
                }
            }
            const data = yield this.query()
                .select('*')
                .from('view_sales_and_purchase_report')
                .andWhereRaw('DATE(invoice_sales_date) BETWEEN ? AND ?', [
                from_date,
                to_date,
            ])
                .modify((builder) => {
                if (employee_id && employee_id !== 'all') {
                    builder.where('invoice_sales_man_id', employee_id);
                }
                if (client_id) {
                    builder.where('invoice_client_id', client_id);
                }
                if (combined_id) {
                    builder.where('invoice_combined_id', combined_id);
                }
            })
                .andWhere('org_agency_id', this.org_agency)
                .limit(size)
                .offset(offset);
            const infos = data.reduce((acc, item) => {
                acc.sales_price += parseFloat(item.invoice_net_total) || 0;
                acc.cost_price += parseFloat(item.cost_price) || 0;
                acc.total_profit += parseFloat(item.total_profit) || 0;
                acc.total_client_payments +=
                    parseFloat(item.total_client_payments) || 0;
                return acc;
            }, {
                sales_price: 0,
                cost_price: 0,
                total_profit: 0,
                total_client_payments: 0,
            });
            return { count: total_count, data: Object.assign({ data }, infos) };
        });
    }
    salesManWiseCollectionDue(employee_id, from_date, to_date, page, size, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            from_date = (0, moment_1.default)(new Date(from_date)).format('YYYY-MM-DD');
            to_date = (0, moment_1.default)(new Date(to_date)).format('YYYY-MM-DD');
            const offset = (page - 1) * size;
            const [{ count }] = (yield this.query()
                .select(this.db.raw(`count(*) as count`))
                .from('view_invoice_total_billing as view')
                .modify((event) => {
                if (employee_id && employee_id !== 'all') {
                    event.where('view.invoice_sales_man_id', employee_id);
                }
                if (from_date && to_date) {
                    event.whereRaw('DATE_FORMAT(view.sales_date,"%Y-%m-%d") BETWEEN ? AND ?', [from_date, to_date]);
                }
            })
                .andWhere('view.org_agency_id', this.org_agency));
            const [user] = (yield this.query()
                .select('user_data_percent')
                .from('trabill_users')
                .where({ user_id }));
            let total_count = count;
            if (user && user.user_data_percent) {
                total_count = Math.round((count * +user.user_data_percent) / 100);
                if (size > total_count) {
                    size = total_count;
                }
                if (page - 1 > 0) {
                    size = total_count - offset;
                }
            }
            const result = yield this.query()
                .select('view.invoice_id', 'view.invoice_category_id', 'view.invoice_no', 'trabill_employees.employee_full_name', this.db.raw(`(view.sales_price - view.invoice_discount) as sales_price`), 'view.cost_price', 'view.        AS client_payment', 'view.create_date', 'view.sales_date', 'view.invoice_sales_man_id')
                .from('view_invoice_total_billing as view')
                .leftJoin('trabill_employees', 'employee_id', '=', 'view.invoice_sales_man_id')
                .modify((event) => {
                if (employee_id && employee_id !== 'all') {
                    event.where('view.invoice_sales_man_id', employee_id);
                }
                if (from_date && to_date) {
                    event.whereRaw('DATE_FORMAT(view.sales_date,"%Y-%m-%d") BETWEEN ? AND ?', [from_date, to_date]);
                }
            })
                .andWhere('view.org_agency_id', this.org_agency)
                .limit(size)
                .offset(offset);
            const total = result.reduce((acc, item) => {
                acc.sales_price += parseFloat(item.sales_price) || 0;
                acc.client_payment += parseFloat(item.invoice_total_pay) || 0;
                return acc;
            }, {
                sales_price: 0,
                client_payment: 0,
            });
            return { count: total_count, data: Object.assign({ result }, total) };
        });
    }
    getClientSales(client_id, combined_id, from_date, to_date, page, size, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            from_date = (0, moment_1.default)(new Date(from_date)).format('YYYY-MM-DD');
            to_date = (0, moment_1.default)(new Date(to_date)).format('YYYY-MM-DD');
            const offset = (page - 1) * size;
            const [{ count }] = (yield this.query()
                .select(this.db.raw(`count(*) as count`))
                .from('view_client_wise_sales ')
                .andWhereRaw('DATE_FORMAT(sales_date,"%Y-%m-%d") BETWEEN ? AND ?', [
                from_date,
                to_date,
            ])
                .modify((builder) => {
                if (client_id && client_id !== 'all') {
                    builder.where('invoice_client_id', client_id);
                }
                if (combined_id && combined_id !== 'all') {
                    builder.where('invoice_combined_id', combined_id);
                }
            })
                .andWhere('org_agency_id', this.org_agency));
            const [user] = (yield this.query()
                .select('user_data_percent')
                .from('trabill_users')
                .where({ user_id }));
            let total_count = count;
            if (user && user.user_data_percent) {
                total_count = Math.round((count * +user.user_data_percent) / 100);
                if (size > total_count) {
                    size = total_count;
                }
                if (page - 1 > 0) {
                    size = total_count - offset;
                }
            }
            const sales_data = yield this.query()
                .select('client_name', 'pax_name', `ticket_no`, 'invoice_no', 'net_total', 'sales_price', 'cost_price', 'invoice_client_id', 'invoice_combined_id', 'sales_date')
                .from('view_client_wise_sales')
                .andWhereRaw('DATE_FORMAT(sales_date,"%Y-%m-%d") BETWEEN ? AND ?', [
                from_date,
                to_date,
            ])
                .modify((builder) => {
                if (client_id && client_id !== 'all') {
                    builder.where('invoice_client_id', client_id);
                }
                if (combined_id && combined_id !== 'all') {
                    builder.where('invoice_combined_id', combined_id);
                }
            })
                .andWhere('org_agency_id', this.org_agency)
                .limit(size)
                .offset(offset);
            const total = sales_data.reduce((acc, item) => {
                acc.sales_price += parseFloat(item.sales_price) || 0;
                return acc;
            }, {
                sales_price: 0,
            });
            return Object.assign({ count: total_count, sales_data }, total);
        });
    }
    getClientCollectionClient(client_id, combined_id, from_date, to_date, page, size, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            from_date = (0, moment_1.default)(new Date(from_date)).format('YYYY-MM-DD');
            to_date = (0, moment_1.default)(new Date(to_date)).format('YYYY-MM-DD');
            const offset = (page - 1) * size;
            const [{ count }] = (yield this.query()
                .select(this.db.raw(`count(*) as count`))
                .from('trabill_money_receipts')
                .leftJoin('trabill_transaction_type', {
                trxntype_id: 'receipt_trnxtype_id',
            })
                .leftJoin('trabill_clients', { client_id: 'receipt_client_id' })
                .leftJoin('trabill_users', { user_id: 'receipt_created_by' })
                .modify((builder) => {
                if (client_id !== 'all') {
                    builder.where('receipt_client_id', client_id);
                }
                if (combined_id && combined_id !== 'all') {
                    builder.where('receipt_combined_id', combined_id);
                }
            })
                .whereNot('receipt_has_deleted', 1)
                .andWhere('trabill_money_receipts.receipt_org_agency', this.org_agency)
                .andWhereRaw('Date(receipt_payment_date) BETWEEN ? AND ?', [
                from_date,
                to_date,
            ]));
            const [user] = (yield this.query()
                .select('user_data_percent')
                .from('trabill_users')
                .where({ user_id }));
            let total_count = count;
            if (user && user.user_data_percent) {
                total_count = Math.round((count * +user.user_data_percent) / 100);
                if (size > total_count) {
                    size = total_count;
                }
                if (page - 1 > 0) {
                    size = total_count - offset;
                }
            }
            const collection_data = yield this.query()
                .select('receipt_id', 'trxntype_name', 'receipt_vouchar_no', 'receipt_payment_date', 'client_name', 'receipt_total_amount', this.db.raw("concat(user_first_name, ' ', user_last_name) AS user_full_name"), 'receipt_client_id', 'receipt_combined_id')
                .from('trabill_money_receipts')
                .leftJoin('trabill_transaction_type', {
                trxntype_id: 'receipt_trnxtype_id',
            })
                .leftJoin('trabill_clients', { client_id: 'receipt_client_id' })
                .leftJoin('trabill_users', { user_id: 'receipt_created_by' })
                .modify((builder) => {
                if (client_id !== 'all') {
                    builder.where('receipt_client_id', client_id);
                }
                if (combined_id && combined_id !== 'all') {
                    builder.where('receipt_combined_id', combined_id);
                }
            })
                .whereNot('receipt_has_deleted', 1)
                .andWhere('trabill_money_receipts.receipt_org_agency', this.org_agency)
                .andWhereNot('receipt_payment_to', 'AGENT_COMMISSION')
                .andWhereRaw('Date(receipt_payment_date) BETWEEN ? AND ?', [
                from_date,
                to_date,
            ])
                .limit(size)
                .offset(offset);
            const total = collection_data.reduce((acc, item) => {
                acc.receipt_total_amount += parseFloat(item.receipt_total_amount) || 0;
                return acc;
            }, {
                receipt_total_amount: 0,
            });
            return Object.assign({ count: total_count, collection_data }, total);
        });
    }
    getInvoicePurches(vendor_id, combine_id, from_date, to_date, page, size) {
        return __awaiter(this, void 0, void 0, function* () {
            from_date = (0, moment_1.default)(new Date(from_date)).format('YYYY-MM-DD');
            to_date = (0, moment_1.default)(new Date(to_date)).format('YYYY-MM-DD');
            const offset = (page - 1) * size;
            const data = yield this.query()
                .select('view.inv_id as invoice_id', 'view.invoice_no', 'view.purchase_price', 'view.vendor_name', 'view.create_date as created_date', 'view.sales_date')
                .from('view_all_invoices_billing AS view')
                .where('invoice_org_agency', this.org_agency)
                .modify((event) => {
                if (vendor_id && vendor_id !== 'all') {
                    event.andWhere('view.vendor_id', vendor_id);
                }
                if (combine_id && combine_id !== 'all') {
                    event.andWhere('view.combined_id', combine_id);
                }
            })
                .andWhereRaw('Date(view.sales_date) BETWEEN ? AND ?', [
                from_date,
                to_date,
            ])
                .orderBy('view.inv_id', 'desc')
                .limit(size)
                .offset(offset);
            return data;
        });
    }
    countInvoicePurchaseDataRow(vendor_id, combine_id, from_date, to_date) {
        return __awaiter(this, void 0, void 0, function* () {
            from_date = (0, moment_1.default)(new Date(from_date)).format('YYYY-MM-DD');
            to_date = (0, moment_1.default)(new Date(to_date)).format('YYYY-MM-DD');
            const [{ row_count }] = yield this.query()
                .select(this.db.raw(`count(*) as row_count`))
                .from('view_all_invoices_billing AS view')
                .where('invoice_org_agency', this.org_agency)
                .modify((event) => {
                if (vendor_id && vendor_id !== 'all') {
                    event.andWhere('view.vendor_id', vendor_id);
                }
                if (combine_id && combine_id !== 'all') {
                    event.andWhere('view.combined_id', combine_id);
                }
            })
                .andWhereRaw('Date(view.sales_date) BETWEEN ? AND ?', [
                from_date,
                to_date,
            ]);
            return row_count;
        });
    }
    getDailySalesReport(comb_client, employee_id, product_id, from_date, to_date, page, size, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            from_date = (0, moment_1.default)(new Date(from_date)).format('YYYY-MM-DD');
            to_date = (0, moment_1.default)(new Date(to_date)).format('YYYY-MM-DD');
            const offset = (page - 1) * size;
            const { client_id, combined_id } = (0, common_helper_1.separateCombClientToId)(comb_client);
            const [user] = (yield this.query()
                .select('user_data_percent')
                .from('trabill_users')
                .where({ user_id }));
            const [count] = (yield this.query()
                .count('* as total')
                .from('view_daily_sales_report')
                .where('org_agency_id', this.org_agency)
                .modify((event) => {
                if (client_id)
                    event.andWhere('invoice_client_id', client_id);
                if (combined_id)
                    event.andWhere('invoice_combined_id', combined_id);
                if (product_id && product_id !== 'all')
                    event.andWhere('billing_product_id', product_id);
                if (employee_id && employee_id !== 'all')
                    event.andWhere('employee_id', employee_id);
            })
                .andWhereRaw(`DATE_FORMAT(sales_date,'%Y-%m-%d') BETWEEN ? AND ?`, [
                from_date,
                to_date,
            ]));
            let total_count = count.total;
            if (user && user.user_data_percent) {
                total_count = Math.round((count.total * +user.user_data_percent) / 100);
                if (size > total_count) {
                    size = total_count;
                }
                if (page - 1 > 0) {
                    size = total_count - offset;
                }
            }
            const data = yield this.query()
                .select('*')
                .from('view_daily_sales_report')
                .where('org_agency_id', this.org_agency)
                .modify((event) => {
                if (client_id)
                    event.andWhere('invoice_client_id', client_id);
                if (combined_id)
                    event.andWhere('invoice_combined_id', combined_id);
                if (product_id && product_id !== 'all')
                    event.andWhere('billing_product_id', product_id);
                if (employee_id && employee_id !== 'all')
                    event.andWhere('employee_id', employee_id);
            })
                .andWhereRaw(`DATE_FORMAT(sales_date,'%Y-%m-%d') BETWEEN ? AND ?`, [
                from_date,
                to_date,
            ])
                .limit(size)
                .offset(offset);
            const infos = data.reduce((acc, item) => {
                acc.total_sales += parseFloat(item.invoice_net_total) || 0;
                acc.total_cost += parseFloat(item.cost_price) || 0;
                acc.total_collection += parseFloat(item.client_pay_amount) || 0;
                acc.total_due += parseFloat(item.due_amount) || 0;
                acc.total_service_charge +=
                    parseFloat(item.invoice_service_charge) || 0;
                acc.total_discount += parseFloat(item.invoice_discount) || 0;
                acc.total_payment += parseFloat(item.vendor_pay_amount) || 0;
                return acc;
            }, {
                total_sales: 0,
                total_cost: 0,
                total_collection: 0,
                total_due: 0,
                total_service_charge: 0,
                total_discount: 0,
                total_payment: 0,
            });
            return { count: total_count, data: Object.assign({ data }, infos) };
        });
    }
    // SALES MAN WISE CLIENT TOTAL DUE
    salesManWiseClientTotalDue(employee_id, page, size) {
        return __awaiter(this, void 0, void 0, function* () {
            const offset = (page - 1) * size;
            const data = yield this.query()
                .select(this.db.raw('sum(view.sales_price) as total_sales'), this.db.raw('sum(view.invoice_discount) as total_discount'), this.db.raw('sum(view.invoice_total_pay) as total_client_payment'), this.db.raw('sum(view.client_due) as total_client_due'), 'client_name', 'client_mobile', 'comb_client')
                .from('view_invoice_total_billing as view')
                .modify((event) => {
                if (employee_id && employee_id !== 'all') {
                    event.where('view.invoice_sales_man_id', employee_id);
                }
            })
                .andWhere('view.org_agency_id', this.org_agency)
                .andWhere('client_due', '>', 0)
                .limit(size)
                .offset(offset);
            const [{ count }] = yield this.query()
                .select(this.db.raw(`count(*) as count`))
                .from('view_invoice_total_billing as view')
                .modify((event) => {
                if (employee_id && employee_id !== 'all') {
                    event.where('view.invoice_sales_man_id', employee_id);
                }
            })
                .andWhere('view.org_agency_id', this.org_agency)
                .andWhere('client_due', '>', 0);
            return { count, data };
        });
    }
}
exports.default = SalesPurchasesReport;
//# sourceMappingURL=salesPurchaseReport.models.js.map