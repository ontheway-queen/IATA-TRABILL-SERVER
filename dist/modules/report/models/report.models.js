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
const common_helper_1 = require("../../../common/helpers/common.helper");
const lib_1 = require("../../../common/utils/libraries/lib");
class ReportModel extends abstract_models_1.default {
    constructor() {
        super(...arguments);
        this.loanReport = (from_date, to_date, authority, loan_type, page, size) => __awaiter(this, void 0, void 0, function* () {
            from_date = (0, moment_1.default)(new Date(from_date)).format('YYYY-MM-DD');
            to_date = (0, moment_1.default)(new Date(to_date)).format('YYYY-MM-DD');
            const offset = (page - 1) * size;
            const loan_reports = yield this.query()
                .select('loan_name', 'authority_name', 'loan_installment', 'loan_installment_type', 'loan_installment_per_day', 'loan_installment_per_month', 'loan_installment_duration', 'loan_interest_percent', 'loan_cheque_no', 'loan_bank_name', 'loan_payment_type', 'loan_amount', 'loan_payable_amount', 'loan_receivable_amount', 'loan_due_amount', 'loan_note', 'loan_create_date')
                .from('trabill_loans')
                .leftJoin('trabill_loan_authorities', {
                authority_id: 'loan_authority_id',
            })
                .whereNot('loan_is_deleted', 1)
                .modify((builder) => {
                if (authority && authority !== 'all') {
                    builder.andWhere('loan_authority_id', authority);
                }
                if (loan_type && loan_type !== 'all') {
                    builder.andWhere('loan_type', loan_type);
                }
                if (from_date && to_date) {
                    builder.whereRaw('Date(loan_date) BETWEEN ? AND ?', [
                        from_date,
                        to_date,
                    ]);
                }
            })
                .andWhere('loan_org_agency', this.org_agency)
                .limit(size)
                .offset(offset);
            return loan_reports;
        });
        this.airTicketDetailsReport = (from_date, to_date, page, size, client) => __awaiter(this, void 0, void 0, function* () {
            const offset = (page - 1) * size;
            const { client_id, combined_id } = (0, common_helper_1.separateCombClientToId)(client);
            return yield this.query()
                .select('*')
                .from('view_all_airticket_details')
                .where('airticket_org_agency', this.org_agency)
                .modify((builder) => {
                builder.where('airticket_org_agency', this.org_agency);
                if (from_date && to_date) {
                    builder.whereRaw('Date(sales_date) BETWEEN ? AND ?', [
                        from_date,
                        to_date,
                    ]);
                }
                if (client_id) {
                    builder.where('airticket_client_id', client_id);
                }
                if (combined_id) {
                    builder.where('airticket_vendor_combine_id', combined_id);
                }
            })
                .orderBy('sales_date', 'desc')
                .limit(size)
                .offset(offset);
        });
        this.airTicketDetailsSumCostPurchase = (from_date, to_date, client) => __awaiter(this, void 0, void 0, function* () {
            const { client_id, combined_id } = (0, common_helper_1.separateCombClientToId)(client);
            const [data] = yield this.query()
                .sum('airticket_client_price as total_sales_price')
                .sum('airticket_purchase_price as total_purchase_price')
                .from('view_all_airticket_details')
                .where('airticket_org_agency', this.org_agency)
                .modify((builder) => {
                builder.where('airticket_org_agency', this.org_agency);
                if (from_date && to_date) {
                    builder.whereRaw('Date(sales_date) BETWEEN ? AND ?', [
                        from_date,
                        to_date,
                    ]);
                }
                if (client_id) {
                    builder.where('airticket_client_id', client_id);
                }
                if (combined_id) {
                    builder.where('airticket_vendor_combine_id', combined_id);
                }
            });
            return data;
        });
        this.airTicketDetailsCount = (from_date, to_date, client) => __awaiter(this, void 0, void 0, function* () {
            const { client_id, combined_id } = (0, common_helper_1.separateCombClientToId)(client);
            const [total] = (yield this.query()
                .count('airticket_ticket_no as count')
                .from('view_all_airticket_details')
                .where('airticket_org_agency', this.org_agency)
                .modify((builder) => {
                builder.where('airticket_org_agency', this.org_agency);
                if (from_date && to_date) {
                    builder.whereRaw('Date(sales_date) BETWEEN ? AND ?', [
                        from_date,
                        to_date,
                    ]);
                }
                if (client_id) {
                    builder.where('airticket_client_id', client_id);
                }
                if (combined_id) {
                    builder.where('airticket_vendor_combine_id', combined_id);
                }
            }));
            return total.count;
        });
        this.getVendorInfo = (vendorId) => __awaiter(this, void 0, void 0, function* () {
            const vendor = yield this.query()
                .select('vendor_name as name', 'vendor_email as email', 'vendor_address as address', 'vendor_mobile', 'vendor_lbalance as last_balance')
                .from('trabill_vendors')
                .where('vendor_id', vendorId);
            return vendor[0];
        });
        this.getClientByCategory = (categoryId) => __awaiter(this, void 0, void 0, function* () {
            const clients = yield this.query()
                .select('client_id', 'client_name')
                .from('trabill_clients')
                .whereNot('client_is_deleted', 1)
                .modify((builder) => {
                if (categoryId) {
                    builder.where('client_category_id', categoryId);
                }
            })
                .andWhere('client_org_agency', this.org_agency);
            return clients;
        });
        // CLIENT DUE ADVANCE
        this.getClientWiseDueSummary = (search, client_id, combine_id, page = 1, size = 50) => __awaiter(this, void 0, void 0, function* () {
            const offset = (+page - 1) * +size;
            const results = yield this.query()
                .select('invoice_org_agency', 'invoice_client_id', 'invoice_combined_id', 'client_name', 'last_balance', this.db.raw('SUM(purchase) as purchase'), this.db.raw('SUM(sales) as sales'), this.db.raw('SUM(pay) as pay'), this.db.raw('SUM(due) as due'), this.db.raw('SUM(profit) as profit'), this.db.raw('SUM(invoice_service_charge) as service_charge'), this.db.raw('SUM(invoice_discount) as invoice_discount'), this.db.raw('SUM(overall_profit) as overall_profit'), this.db.raw('GROUP_CONCAT(airlines) AS airlines_code'))
                .from(this.db
                .select('invoice_org_agency', 'invoice_client_id', 'invoice_combined_id', 'client_name', 'last_balance', this.db.raw('SUM(invoice_total_vendor_price) as purchase'), this.db.raw('SUM(invoice_net_total) as sales'), this.db.raw('SUM(cl_pay) as pay'), this.db.raw('SUM(due_amount) as due'), this.db.raw('SUM(invoice_total_profit) as profit'), this.db.raw('SUM(invoice_service_charge) as invoice_service_charge'), this.db.raw('SUM(invoice_discount) as invoice_discount'), this.db.raw('SUM(overall_profit) as overall_profit'), this.db.raw("CONCAT(airline_code, '(', COUNT(*), ')') AS airlines"))
                .from('trabill.v_invoices_due')
                .where('invoice_org_agency', this.org_agency)
                .modify(function (queryBuilder) {
                if (search) {
                    queryBuilder.where(function () {
                        this.whereILike('client_name', `%${search}%`).orWhereILike('airline_code', `%${search}%`);
                    });
                }
                if (client_id || combine_id) {
                    queryBuilder.where(function () {
                        this.where('invoice_client_id', client_id).andWhere('invoice_combined_id', combine_id);
                    });
                }
            })
                .groupBy('invoice_client_id', 'invoice_combined_id', 'airline_id')
                .as('inv_due'))
                .groupBy('inv_due.invoice_client_id', 'inv_due.invoice_combined_id')
                .offset(offset)
                .limit(size);
            const [{ count }] = (yield this.query()
                .count('* as count')
                .from(this.db
                .select('invoice_client_id', 'invoice_combined_id')
                .from('trabill.v_invoices_due')
                .where('invoice_org_agency', this.org_agency)
                .modify(function (queryBuilder) {
                if (search) {
                    queryBuilder.where(function () {
                        this.whereILike('client_name', `%${search}%`).orWhereILike('airline_code', `%${search}%`);
                    });
                }
            })
                .groupBy('invoice_client_id', 'invoice_combined_id')
                .as('inv_due')));
            const [total] = yield this.query()
                .select(this.db.raw('SUM(invoice_total_vendor_price) as purchase'), this.db.raw('SUM(invoice_net_total) as sales'), this.db.raw('SUM(cl_pay) as pay'), this.db.raw('SUM(due_amount) as due'), this.db.raw('SUM(overall_profit) as profit'), this.db.raw('SUM(invoice_service_charge) as service_charge'), this.db.raw('SUM(invoice_discount) as invoice_discount'), this.db.raw('SUM(overall_profit) as overall_profit'))
                .from('trabill.v_invoices_due')
                .where('invoice_org_agency', this.org_agency)
                .modify(function (queryBuilder) {
                if (search) {
                    queryBuilder.where(function () {
                        this.whereILike('client_name', `%${search}%`).orWhereILike('airline_code', `%${search}%`);
                    });
                }
                if (client_id || combine_id) {
                    queryBuilder.where(function () {
                        this.where('invoice_client_id', client_id).andWhere('invoice_combined_id', combine_id);
                    });
                }
            });
            const [client_l_balance] = yield this.query()
                .select(this.db.raw('SUM(last_balance) as last_balance'))
                .from(this.db
                .select('last_balance')
                .from('trabill.v_invoices_due')
                .where('invoice_org_agency', this.org_agency)
                .modify(function (queryBuilder) {
                if (search) {
                    queryBuilder.where(function () {
                        this.whereILike('client_name', `%${search}%`).orWhereILike('airline_code', `%${search}%`);
                    });
                }
                if (client_id || combine_id) {
                    queryBuilder.where(function () {
                        this.where('invoice_client_id', client_id).andWhere('invoice_combined_id', combine_id);
                    });
                }
            })
                .groupBy('invoice_client_id', 'invoice_combined_id')
                .as('inv_due'));
            total.last_balance = client_l_balance.last_balance || 0;
            return { count, data: { results, total } };
        });
        this.DueDetails = (search, client_id, combine_id, airline_id, from_date, to_date, page = 1, size = 50) => __awaiter(this, void 0, void 0, function* () {
            const offset = (+page - 1) * +size;
            const results = yield this.query()
                .select([
                'invoice_id',
                'invoice_org_agency',
                'invoice_client_id',
                'invoice_combined_id',
                'client_name',
                'invoice_no',
                'invoice_category_id',
                'invoice_sales_date',
                'airline_id',
                'airline_name',
                'invoice_total_vendor_price as purchase',
                'invoice_net_total as sales',
                'cl_pay as pay',
                'due_amount as due',
                'invoice_total_profit as profit',
                'invoice_service_charge as service_charge',
                'invoice_discount',
                'overall_profit',
                'airline_code as airlines_code',
            ])
                .from('trabill.v_invoices_due')
                .where('invoice_org_agency', this.org_agency)
                .modify(function (queryBuilder) {
                if (search) {
                    queryBuilder.where(function () {
                        this.whereILike('airline_name', `%${search}%`)
                            .orWhereILike('airline_code', `%${search}%`)
                            .orWhereILike('client_name', `%${search}%`);
                    });
                }
                if (client_id || combine_id) {
                    queryBuilder.where(function () {
                        this.where('invoice_client_id', client_id).andWhere('invoice_combined_id', combine_id);
                    });
                }
                if (airline_id || airline_id === null) {
                    queryBuilder.where(function () {
                        this.where('airline_id', airline_id);
                    });
                }
                if (from_date && to_date) {
                    queryBuilder.whereRaw('Date(invoice_sales_date) BETWEEN ? AND ?', [
                        from_date,
                        to_date,
                    ]);
                }
            })
                .offset(offset)
                .limit(size);
            const [{ count }] = (yield this.query()
                .count('* as count')
                .from('trabill.v_invoices_due')
                .where('invoice_org_agency', this.org_agency)
                .modify(function (queryBuilder) {
                if (search) {
                    queryBuilder.where(function () {
                        this.whereILike('airline_name', `%${search}%`)
                            .orWhereILike('airline_code', `%${search}%`)
                            .orWhereILike('client_name', `%${search}%`);
                    });
                }
                if (client_id || combine_id) {
                    queryBuilder.where(function () {
                        this.where('invoice_client_id', client_id).andWhere('invoice_combined_id', combine_id);
                    });
                }
                if (airline_id || airline_id === null) {
                    queryBuilder.where(function () {
                        this.where('airline_id', airline_id);
                    });
                }
                if (from_date && to_date) {
                    queryBuilder.whereRaw('Date(invoice_sales_date) BETWEEN ? AND ?', [
                        from_date,
                        to_date,
                    ]);
                }
            }));
            const [total] = yield this.query()
                .select(this.db.raw('SUM(invoice_total_vendor_price) as purchase'), this.db.raw('SUM(invoice_net_total) as sales'), this.db.raw('SUM(cl_pay) as pay'), this.db.raw('SUM(due_amount) as due'), this.db.raw('SUM(overall_profit) as profit'), this.db.raw('SUM(invoice_service_charge) as service_charge'), this.db.raw('SUM(invoice_discount) as invoice_discount'), this.db.raw('SUM(overall_profit) as overall_profit'))
                .from('trabill.v_invoices_due')
                .where('invoice_org_agency', this.org_agency)
                .modify(function (queryBuilder) {
                if (search) {
                    queryBuilder.where(function () {
                        this.whereILike('airline_name', `%${search}%`)
                            .orWhereILike('airline_code', `%${search}%`)
                            .orWhereILike('client_name', `%${search}%`);
                    });
                }
                if (client_id || combine_id) {
                    queryBuilder.where(function () {
                        this.where('invoice_client_id', client_id).andWhere('invoice_combined_id', combine_id);
                    });
                }
                if (airline_id || airline_id === null) {
                    queryBuilder.where(function () {
                        this.where('airline_id', airline_id);
                    });
                }
                if (from_date && to_date) {
                    queryBuilder.whereRaw('Date(invoice_sales_date) BETWEEN ? AND ?', [
                        from_date,
                        to_date,
                    ]);
                }
            });
            return { count, data: { results, total } };
        });
        this.getAirlineWiseClientDueSummary = (search, airline_id, page = 1, size = 50) => __awaiter(this, void 0, void 0, function* () {
            const offset = (+page - 1) * +size;
            const results = yield this.query()
                .select([
                'invoice_org_agency',
                'airline_id',
                this.db.raw('SUM(invoice_total_vendor_price) as purchase'),
                this.db.raw('SUM(invoice_net_total) as sales'),
                this.db.raw('SUM(cl_pay) as pay'),
                this.db.raw('SUM(due_amount) as due'),
                this.db.raw('SUM(invoice_total_profit) as profit'),
                this.db.raw('SUM(invoice_service_charge) as service_charge'),
                this.db.raw('SUM(invoice_discount) as invoice_discount'),
                this.db.raw('SUM(overall_profit) as overall_profit'),
                'airline_code as airlines_code',
                'airline_name',
            ])
                .from('trabill.v_invoices_due')
                .where('invoice_org_agency', this.org_agency)
                .modify(function (queryBuilder) {
                if (search) {
                    queryBuilder.where(function () {
                        this.whereILike('airline_name', `%${search}%`).orWhereILike('airline_code', `%${search}%`);
                    });
                }
                if (airline_id || airline_id === null) {
                    queryBuilder.where(function () {
                        this.where('airline_id', airline_id);
                    });
                }
            })
                .groupBy('airline_id')
                .offset(offset)
                .limit(size);
            const [{ count }] = (yield this.query()
                .count('* as count')
                .from('trabill.v_invoices_due')
                .where('invoice_org_agency', this.org_agency)
                .modify(function (queryBuilder) {
                if (search) {
                    queryBuilder.where(function () {
                        this.whereILike('airline_name', `%${search}%`).orWhereILike('airline_code', `%${search}%`);
                    });
                }
                if (airline_id || airline_id === null) {
                    queryBuilder.where(function () {
                        this.where('airline_id', airline_id);
                    });
                }
            })
                .groupBy('airline_id'));
            const [total] = (yield this.query()
                .select(this.db.raw('SUM(invoice_total_vendor_price) as purchase'), this.db.raw('SUM(invoice_net_total) as sales'), this.db.raw('SUM(cl_pay) as pay'), this.db.raw('SUM(due_amount) as due'), this.db.raw('SUM(overall_profit) as profit'), this.db.raw('SUM(invoice_service_charge) as service_charge'), this.db.raw('SUM(invoice_discount) as invoice_discount'), this.db.raw('SUM(overall_profit) as overall_profit'))
                .from('trabill.v_invoices_due')
                .where('invoice_org_agency', this.org_agency)
                .modify(function (queryBuilder) {
                if (search) {
                    queryBuilder.where(function () {
                        this.whereILike('airline_name', `%${search}%`).orWhereILike('airline_code', `%${search}%`);
                    });
                }
                if (airline_id || airline_id === null) {
                    queryBuilder.where(function () {
                        this.where('airline_id', airline_id);
                    });
                }
            }));
            return { count, data: { results, total } };
        });
        this.clientAdvance = (search, page = 1, size = 20) => __awaiter(this, void 0, void 0, function* () {
            const offset = (+page - 1) * +size;
            const results = yield this.query()
                .select('client_id', 'client_category_id', 'client_entry_id', 'client_type', 'client_name', 'client_lbalance', 'client_created_date')
                .from('trabill.trabill_clients')
                .where('client_org_agency', this.org_agency)
                .modify((builder) => {
                if (search) {
                    builder
                        .whereILike('client_name', `%${search}%`)
                        .orWhereILike('client_entry_id', `%${search}%`)
                        .orWhereILike('client_mobile', `%${search}%`);
                }
            })
                .andWhereNot('client_is_deleted', 1)
                .andWhere('client_lbalance', '>', 0)
                .offset(offset)
                .limit(size);
            const [total] = yield this.query()
                .sum('client_lbalance as total_advance')
                .from('trabill.trabill_clients')
                .where('client_org_agency', this.org_agency)
                .modify((builder) => {
                if (search) {
                    builder
                        .whereILike('client_name', `%${search}%`)
                        .orWhereILike('client_entry_id', `%${search}%`)
                        .orWhereILike('client_mobile', `%${search}%`);
                }
            })
                .andWhereNot('client_is_deleted', 1)
                .andWhere('client_lbalance', '>', 0);
            const [{ count }] = (yield this.query()
                .count('* as count')
                .from('trabill.trabill_clients')
                .where('client_org_agency', this.org_agency)
                .andWhereNot('client_is_deleted', 1)
                .andWhere('client_lbalance', '>', 0));
            return { count, data: { results, total } };
        });
        // INVOICE AND MONEY RECEIPT DISCOUNT
        this.invoiceAndMoneyReceiptDiscount = (from_date, to_date) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select('invoice_id', 'invoice_org_agency', 'invoice_category_id', 'invoice_no', 'invoice_discount', 'invoice_net_total', 'invoice_sales_date as date', this.db.raw('"TICKET" AS type'))
                .from('trabill.trabill_invoices_extra_amounts')
                .leftJoin('trabill_invoices', 'invoice_id', 'extra_amount_invoice_id')
                .whereNot('invoice_is_deleted', 1)
                .andWhere('invoice_org_agency', this.org_agency)
                .andWhere('invoice_discount', '>', 0)
                .andWhereRaw('Date(invoice_sales_date) BETWEEN ? AND ?', [
                from_date,
                to_date,
            ])
                .unionAll([
                this.db
                    .select('receipt_id', 'receipt_org_agency', this.db.raw('null as invoice_category_id'), 'receipt_vouchar_no', 'receipt_total_discount', 'receipt_total_amount', 'receipt_payment_date as date', this.db.raw('"MONEY_RECEIPT" AS type'))
                    .from('trabill.trabill_money_receipts')
                    .whereNot('receipt_has_deleted', 1)
                    .andWhere('receipt_org_agency', this.org_agency)
                    .andWhere('receipt_total_discount', '>', 0)
                    .andWhereRaw('Date(receipt_payment_date) BETWEEN ? AND ?', [
                    from_date,
                    to_date,
                ]),
            ])
                .orderBy('date');
            return data;
        });
        this.clientLastBalance = () => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .from('trabill_clients as tc')
                .leftJoin(this.query()
                .from('trxn.client_trxn')
                .select('ctrxn_cl_id', 'ctrxn_lbalance')
                .whereNot('ctrxn_is_delete', 1)
                .orderBy('ctrxn_id', 'desc')
                .limit(1)
                .as('tct'), 'tc.client_id', 'tct.ctrxn_cl_id')
                .select('tc.client_id', 'tc.client_org_agency', 'tc.client_entry_id', 'tc.client_name', 'tc.client_lbalance', this.db.raw('COALESCE(tct.ctrxn_lbalance, 0) as ctrxn_lbalance'))
                .whereNot('tc.client_lbalance', this.db.raw('COALESCE(tct.ctrxn_lbalance, 0)'));
            return data;
        });
    }
    countLoanReportDataRow(from_date, to_date, authority, loan_type) {
        return __awaiter(this, void 0, void 0, function* () {
            from_date = (0, moment_1.default)(new Date(from_date)).format('YYYY-MM-DD');
            to_date = (0, moment_1.default)(new Date(to_date)).format('YYYY-MM-DD');
            const [count] = yield this.query()
                .select(this.db.raw(`count(*) as row_count`))
                .from('trabill_loans')
                .leftJoin('trabill_loan_authorities', {
                authority_id: 'loan_authority_id',
            })
                .whereNot('loan_is_deleted', 1)
                .modify((builder) => {
                if (authority && authority !== 'all') {
                    builder.andWhere('loan_authority_id', authority);
                }
                if (loan_type && loan_type !== 'all') {
                    builder.andWhere('loan_type', loan_type);
                }
                if (from_date && to_date) {
                    builder.whereRaw('Date(loan_date) BETWEEN ? AND ?', [
                        from_date,
                        to_date,
                    ]);
                }
            })
                .andWhere('loan_org_agency', this.org_agency);
            return count.row_count;
        });
    }
    getLoanSummary(type) {
        return __awaiter(this, void 0, void 0, function* () {
            const [data] = yield this.query()
                .select(this.db.raw(`'${type}' AS loan_type`), this.db.raw(`SUM(COALESCE(loan_amount, 0)) AS loan_amount`), this.db.raw(`SUM(COALESCE(loan_payable_amount, 0)) AS payable_amount`), this.db.raw(`SUM(COALESCE(loan_receivable_amount, 0)) AS receivable_amount`), this.db.raw(`SUM(COALESCE(loan_due_amount, 0)) AS due_amount`), this.db.raw(`SUM(CAST(COALESCE(loan_amount, 0) * (COALESCE(loan_interest_percent, 0) / 100) AS SIGNED)) AS interest_amount`))
                .from('trabill_loans')
                .whereNot('loan_is_deleted', 1)
                .andWhere('loan_org_agency', this.org_agency)
                .andWhere('loan_type', type);
            return data;
        });
    }
    clientDueAdvance(client_id, date, page, size) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const query1 = trx.raw(`call ${this.database}.get_advance_due_client('${client_id}', ${this.org_agency}, '${date}', ${page}, ${size},  @count);`);
                const query2 = trx.raw('SELECT @count AS count;');
                const [[[data]], [[totalRows]]] = yield Promise.all([query1, query2]);
                const totalCount = totalRows.count;
                return { count: totalCount, data };
            }));
            return result;
        });
    }
    getDueAdvanceVendor(vendor_id, date, page, size) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const query1 = trx.raw(`call ${this.database}.get_advance_due_vendor('${vendor_id}', ${this.org_agency}, '${date}', ${page}, ${size}, @count);`);
                const query2 = trx.raw('SELECT @count AS count;');
                const [[[data]], [[totalRows]]] = yield Promise.all([query1, query2]);
                const totalCount = totalRows.count;
                return { count: totalCount, data };
            }));
            return result;
        });
    }
    getDueAdvanceCombineClient(combine_id, date, page, size) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const query1 = trx.raw(`call trabill.get_advance_due_combine('${combine_id}', ${this.org_agency}, '${date}', ${page}, ${size}, @count);`);
                const query2 = trx.raw('SELECT @count AS count;');
                const [[[data]], [[totalRows]]] = yield Promise.all([query1, query2]);
                const totalCount = totalRows.count;
                return { count: totalCount, data };
            }));
            return result;
        });
    }
    getVendorWiseReport(comb_vendor, from_date, to_date, page, size, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            from_date = (0, moment_1.default)(new Date(from_date)).format('YYYY-MM-DD');
            to_date = (0, moment_1.default)(new Date(to_date)).format('YYYY-MM-DD');
            const offset = (page - 1) * size;
            const { vendor_id, combined_id } = (0, common_helper_1.separateCombClientToId)(comb_vendor);
            const [{ count }] = (yield this.query()
                .select(this.db.raw(`count(*) as count`))
                .from('view_invoices_cost')
                .modify((event) => {
                if (vendor_id && vendor_id) {
                    event.andWhere('vendor_id', vendor_id);
                }
                if (combined_id) {
                    event.andWhere('combine_id', combined_id);
                }
            })
                .andWhere('org_agency', this.org_agency)
                .andWhereRaw('Date(sales_date) BETWEEN ? AND ?', [
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
            const data = yield this.query()
                .select('*')
                .from('view_invoices_cost')
                .modify((event) => {
                if (vendor_id) {
                    event.andWhere('vendor_id', vendor_id);
                }
                if (combined_id) {
                    event.andWhere('combine_id', combined_id);
                }
            })
                .andWhere('org_agency', this.org_agency)
                .andWhereRaw('Date(sales_date) BETWEEN ? AND ?', [from_date, to_date])
                .limit(size)
                .offset(offset);
            return { count: total_count, data };
        });
    }
    getVisaList() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select('invcat_id', 'invcat_parentcat', 'invcat_title')
                .from('trabill_invoice_categories')
                .where('invcat_parentcat', 'VISA')
                .whereNot('invcat_is_deleted', 1);
            return data;
        });
    }
    userLoginHistory(user_id, from_date, to_date, page, size) {
        return __awaiter(this, void 0, void 0, function* () {
            from_date = (0, moment_1.default)(new Date(from_date)).format('YYYY-MM-DD');
            to_date = (0, moment_1.default)(new Date(to_date)).format('YYYY-MM-DD');
            const offset = (page - 1) * size;
            const data = yield this.query()
                .select('*')
                .from('v_login_history')
                .where('login_user_id', user_id)
                .andWhere('user_agency_id', this.org_agency)
                .andWhereRaw('DATE_FORMAT(login_date_and_time, "%Y-%m-%d") BETWEEN ? AND ?', [from_date, to_date])
                .orderBy('login_id', 'desc')
                .limit(size)
                .offset(offset);
            const [count] = yield this.query()
                .select(this.db.raw(`count(*) as row_count`))
                .from('v_login_history')
                .where('login_user_id', user_id)
                .andWhere('user_agency_id', this.org_agency)
                .andWhereRaw('DATE_FORMAT(login_date_and_time, "%Y-%m-%d") BETWEEN ? AND ?', [from_date, to_date]);
            return { count: count.row_count, data };
        });
    }
    countUserLoginHisDataRow(user_id, from_date, to_date) {
        return __awaiter(this, void 0, void 0, function* () {
            from_date = (0, moment_1.default)(new Date(from_date)).format('YYYY-MM-DD');
            to_date = (0, moment_1.default)(new Date(to_date)).format('YYYY-MM-DD');
            const [count] = yield this.query()
                .select(this.db.raw(`count(*) as row_count`))
                .from('trabill_users_login_history')
                .leftJoin('trabill_users', { user_id: 'login_user_id' })
                .where('login_user_id', user_id)
                .andWhere('user_agency_id', this.org_agency)
                .andWhereRaw('Date(login_date_and_time) BETWEEN ? AND ?', [
                from_date,
                to_date,
            ]);
            return count.row_count;
        });
    }
    getAgentsDueAdvance(agent_id, date, page, size) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const query1 = trx.raw(`call ${this.database}.get_advance_due_agent('${agent_id}', ${this.org_agency}, '${date}', ${page}, ${size}, @count);`);
                const query2 = trx.raw('SELECT @count AS count;');
                const [[[data]], [[totalRows]]] = yield Promise.all([query1, query2]);
                const totalCount = totalRows.count;
                return { count: totalCount, data };
            }));
            return result;
        });
    }
    preRegistrationList(possible_year, page, size) {
        return __awaiter(this, void 0, void 0, function* () {
            const offset = (page - 1) * size;
            const data = yield this.query()
                .select(this.db.raw('CASE WHEN trabill_clients.client_name IS NOT NULL THEN trabill_clients.client_name ELSE trabill_combined_clients.combine_name END as client_name'), 'invoice_client_id', 'invoice_combined_id', 'haji_info_vouchar_no', 'billing_quantity as total_haj', 'pax_name', 'group_name', 'group_type', 'billing_unit_price', 'billing_subtotal', 'billing_profit', 'hajiinfo_mobile as haji_mobile', 'hajiinfo_tracking_number', 'hajiinfo_nid', 'hajiinfo_name', this.db.raw("concat(user_first_name, ' ', user_last_name) AS user_full_name"))
                .from('trabill_invoice_hajj_pre_reg_haji_infos')
                .leftJoin('trabill_invoices', { invoice_id: 'haji_info_invoice_id' })
                .leftJoin('trabill_clients', { client_id: 'invoice_client_id' })
                .leftJoin('trabill_combined_clients', {
                combine_id: 'invoice_combined_id',
            })
                .leftJoin('trabill_invoice_hajj_pre_reg_billing_infos', {
                billing_invoice_id: 'haji_info_invoice_id',
            })
                .leftJoin('trabill_haji_group', { group_id: 'invoice_haji_group_id' })
                .leftJoin('trabill_users', { user_id: 'haji_info_created_by' })
                .leftJoin('trabill_haji_informations', {
                hajiinfo_id: 'haji_info_haji_id',
            })
                .where('haji_info_reg_year', possible_year)
                .andWhere('trabill_invoices.invoice_org_agency', this.org_agency)
                .andWhereNot('haji_info_info_is_deleted', 1)
                .offset(offset)
                .limit(size);
            const [{ row_count }] = yield this.query()
                .select(this.db.raw(`count(*) as row_count`))
                .from('trabill_invoice_hajj_pre_reg_haji_infos')
                .leftJoin('trabill_invoices', { invoice_id: 'haji_info_invoice_id' })
                .leftJoin('trabill_invoice_hajj_pre_reg_billing_infos', {
                billing_invoice_id: 'haji_info_invoice_id',
            })
                .leftJoin('trabill_haji_group', { group_id: 'invoice_haji_group_id' })
                .leftJoin('trabill_users', { user_id: 'haji_info_created_by' })
                .leftJoin('trabill_haji_informations', {
                hajiinfo_id: 'haji_info_haji_id',
            })
                .where('haji_info_reg_year', possible_year)
                .andWhere('trabill_invoices.invoice_org_agency', this.org_agency)
                .andWhereNot('haji_info_info_is_deleted', 1);
            return { count: row_count, data };
        });
    }
    clientWisePassengerList(client_id, combined_id, page, size) {
        return __awaiter(this, void 0, void 0, function* () {
            const offset = (page - 1) * size;
            const data = yield this.query()
                .select('passport_id', 'passport_client_id', 'passport_name as client_name', 'passport_mobile_no', 'passport_passport_no', 'passport_email', 'passport_date_of_birth', 'passport_date_of_expire', 'passport_date_of_issue')
                .from('trabill_passport_details')
                .whereNot('passport_is_deleted', 1)
                .andWhere('passport_org_agency', this.org_agency)
                .modify((builder) => {
                if (client_id && client_id !== 'all') {
                    builder.where('passport_client_id', client_id);
                }
                if (combined_id && combined_id !== 'all') {
                    builder.where('passport_combined_id', combined_id);
                }
            })
                .orderBy('passport_id', 'desc')
                .limit(size)
                .offset(offset);
            return data;
        });
    }
    countClientWisePassengerList(client_id, combined_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [count] = yield this.query()
                .select(this.db.raw(`count(*) as row_count`))
                .from('trabill_passport_details')
                .whereNot('passport_is_deleted', 1)
                .andWhere('passport_org_agency', this.org_agency)
                .modify((builder) => {
                if (client_id && client_id !== 'all') {
                    builder.where('passport_client_id', client_id);
                }
                if (combined_id && combined_id !== 'all') {
                    builder.where('passport_combined_id', combined_id);
                }
            });
            return count.row_count;
        });
    }
    countryWiseReport(country_id, from_date, to_date, page, size) {
        return __awaiter(this, void 0, void 0, function* () {
            from_date = (0, moment_1.default)(new Date(from_date)).format('YYYY-MM-DD');
            to_date = (0, moment_1.default)(new Date(to_date)).format('YYYY-MM-DD');
            const offset = (page - 1) * size;
            const data = yield this.query()
                .select('*')
                .from('view_country_wise_report')
                .modify((event) => {
                if (country_id && country_id !== 'all') {
                    event.andWhere('billing_country_id', country_id);
                }
            })
                .andWhere('invoice_org_agency', this.org_agency)
                .andWhereRaw('Date(invoice_sales_date) BETWEEN ? AND ?', [
                from_date,
                to_date,
            ])
                .limit(size)
                .offset(offset);
            const [{ total }] = yield this.query()
                .count('* as total')
                .from('view_country_wise_report')
                .modify((event) => {
                if (country_id && country_id !== 'all') {
                    event.andWhere('billing_country_id', country_id);
                }
            })
                .andWhere('invoice_org_agency', this.org_agency)
                .andWhereRaw('Date(invoice_sales_date) BETWEEN ? AND ?', [
                from_date,
                to_date,
            ]);
            return { count: total, data };
        });
    }
    passportWiseReport(passport_id, from_date, to_date, page = 1, size = 20) {
        return __awaiter(this, void 0, void 0, function* () {
            const offset = (page - 1) * size;
            from_date = (0, moment_1.default)(new Date(from_date)).format('YYYY-MM-DD');
            to_date = (0, moment_1.default)(new Date(to_date)).format('YYYY-MM-DD');
            const data = yield this.query()
                .select('p_invoice_id AS invoice_id', 'invoice_category_id', 'passport_client_id', 'passport_combined_id', 'trabill_passport_details.passport_id', 'trabill_passport_details.passport_passport_no', 'passport_mobile_no', 'passport_date_of_birth', 'passport_name', this.db.raw(`coalesce(client_name,company_name, combine_name ) as client_name`), 'country_name as destination', 'invoice_no', 'pstatus_updated_by', this.db.raw("concat(user_first_name, ' ', user_last_name) AS status_change_by"))
                .from('trabill_passport_details')
                .leftJoin('view_invoice_passport', {
                'view_invoice_passport.passport_id': 'trabill_passport_details.passport_id',
            })
                .leftJoin('trabill_invoices', { invoice_id: 'p_invoice_id' })
                .leftJoin('trabill_countries', {
                country_id: 'passport_visiting_country',
            })
                .leftJoin('trabill_clients', { client_id: 'passport_client_id' })
                .leftJoin('trabill_combined_clients', {
                combine_id: 'passport_combined_id',
            })
                .leftJoin('trabill_client_company_information', {
                company_client_id: 'passport_client_id',
            })
                .leftJoin('trabill_passport_status', { pstatus_id: 'passport_status_id' })
                .leftJoin('trabill_users', function () {
                this.on({ user_id: 'pstatus_updated_by' }).orOn({
                    user_id: 'pstatus_created_by',
                });
            })
                .modify((event) => {
                event
                    .andWhere('passport_org_agency', this.org_agency)
                    .andWhere(function () {
                    if (passport_id && passport_id !== 'all') {
                        this.andWhere('trabill_passport_details.passport_id', passport_id);
                    }
                });
            })
                .whereNot('passport_is_deleted', 1)
                .andWhere('passport_org_agency', this.org_agency)
                .limit(size)
                .offset(offset)
                .orderBy('trabill_passport_details.passport_id', 'desc');
            const [{ row_count }] = yield this.query()
                .count('* as row_count')
                .from('trabill_passport_details')
                .modify((event) => {
                event
                    .andWhere('passport_org_agency', this.org_agency)
                    .andWhere(function () {
                    if (passport_id && passport_id !== 'all') {
                        this.andWhere('passport_id', passport_id);
                    }
                });
            })
                .whereNot('passport_is_deleted', 1)
                .andWhere('passport_org_agency', this.org_agency);
            return { count: row_count, data };
        });
    }
    passportStatusReport(status_id, from_date, to_date, page, size) {
        return __awaiter(this, void 0, void 0, function* () {
            from_date = (0, moment_1.default)(new Date(from_date)).format('YYYY-MM-DD');
            to_date = (0, moment_1.default)(new Date(to_date)).format('YYYY-MM-DD');
            const offset = (page - 1) * size;
            const data = yield this.query()
                .select('invoice_id', 'invoice_category_id', 'passport_client_id', 'passport_combined_id', 'passport_name', 'trabill_passport_details.passport_passport_no', this.db.raw('COALESCE(combine_name, client_name) AS client_name'), 'invoice_no', 'country_name', this.db.raw(`COALESCE(pstatus_name,'Unknown') AS pstatus_name`), 'passport_create_date', 'trabill_passport_details.passport_id')
                .from('trabill_passport_details')
                .leftJoin('trabill_clients', { client_id: 'passport_client_id' })
                .leftJoin('trabill_combined_clients', {
                combine_id: 'passport_combined_id',
            })
                .leftJoin('view_invoice_passport', {
                'view_invoice_passport.passport_id': 'trabill_passport_details.passport_id',
            })
                .leftJoin('trabill_invoices', {
                invoice_id: 'p_invoice_id',
            })
                .leftJoin('trabill_countries', {
                country_id: 'passport_visiting_country',
            })
                .leftJoin('trabill_passport_status', {
                pstatus_id: 'passport_status_id',
            })
                .modify((event) => {
                event
                    .where('passport_org_agency', this.org_agency)
                    .andWhere(function () {
                    if (status_id && status_id !== 'all') {
                        this.andWhere('passport_status_id', status_id);
                    }
                });
            })
                .whereNot('passport_is_deleted', 1)
                .andWhere('passport_org_agency', this.org_agency)
                .andWhereRaw('Date(passport_create_date) BETWEEN ? AND ?', [
                from_date,
                to_date,
            ])
                .orderBy('passport_id', 'desc')
                .limit(size)
                .offset(offset);
            return data;
        });
    }
    countPassportStatusDataRow(status_id, from_date, to_date) {
        return __awaiter(this, void 0, void 0, function* () {
            from_date = (0, moment_1.default)(new Date(from_date)).format('YYYY-MM-DD');
            to_date = (0, moment_1.default)(new Date(to_date)).format('YYYY-MM-DD');
            const [count] = yield this.query()
                .select(this.db.raw(`count(*) as row_count`))
                .from('trabill_passport_details')
                .modify((event) => {
                event
                    .where('passport_org_agency', this.org_agency)
                    .andWhere(function () {
                    if (status_id && status_id !== 'all') {
                        this.andWhere('passport_status_id', status_id);
                    }
                });
            })
                .whereNot('passport_is_deleted', 1)
                .andWhere('passport_org_agency', this.org_agency)
                .andWhereRaw('Date(passport_create_date) BETWEEN ? AND ?', [
                from_date,
                to_date,
            ]);
            return count.row_count;
        });
    }
    salesAmountReport(date, type) {
        return __awaiter(this, void 0, void 0, function* () {
            type === 'daily'
                ? (date = (0, moment_1.default)(date).format('YYYY-MM-DD'))
                : (date = (0, moment_1.default)(new Date(date)).format('YYYY-MM'));
            const data = yield this.query()
                .select(this.db.raw('CAST(SUM(COALESCE(invoice_net_total,0)) AS DECIMAL(15,2)) as sales_total'))
                .from('trabill_invoices')
                .where('invoice_org_agency', this.org_agency)
                .modify((event) => {
                type === 'daily'
                    ? event.andWhereRaw(`DATE_FORMAT(invoice_sales_date, '%Y-%m-%d') = ?`, [date])
                    : event.andWhereRaw(`DATE_FORMAT(invoice_sales_date, '%Y-%m') = ?`, [
                        date,
                    ]);
            });
            return data;
        });
    }
    salesReport(date, type) {
        return __awaiter(this, void 0, void 0, function* () {
            type === 'daily'
                ? (date = (0, moment_1.default)(new Date(date)).format('YYYY-MM-DD'))
                : (date = (0, moment_1.default)(new Date(date)).format('YYYY-MM'));
            const data = yield this.query()
                .select('invoice_id', 'invoice_no', this.db.raw(`COALESCE(client_name, combine_name) AS client_name`), 'invoice_net_total', 'invoice_sales_date')
                .from('trabill_invoices')
                .leftJoin('trabill_clients', { client_id: 'invoice_client_id' })
                .leftJoin('trabill_combined_clients', {
                combine_id: 'invoice_combined_id',
            })
                .where('invoice_org_agency', this.org_agency)
                .andWhere('invoice_is_deleted', 0)
                .modify((event) => {
                type === 'daily'
                    ? event.andWhereRaw(`DATE_FORMAT(invoice_sales_date, '%Y-%m-%d') = ?`, [date])
                    : event.andWhereRaw(`DATE_FORMAT(invoice_sales_date, '%Y-%m') = ?`, [
                        date,
                    ]);
            });
            return data;
        });
    }
    purchaseReport(date, type) {
        return __awaiter(this, void 0, void 0, function* () {
            type === 'daily'
                ? (date = (0, moment_1.default)(date).format('YYYY-MM-DD'))
                : (date = (0, moment_1.default)(new Date(date)).format('YYYY-MM'));
            const data = yield this.query()
                .select(this.db.raw('CAST(SUM(COALESCE(cost_price, 0)) AS DECIMAL(15,2))  as total_cost'))
                .from('view_invoices_billing')
                .where('org_agency_id', this.org_agency)
                .modify((event) => {
                type === 'daily'
                    ? event.andWhereRaw(`DATE_FORMAT(sales_date, '%Y-%m-%d') = ?`, [date])
                    : event.andWhereRaw(`DATE_FORMAT(sales_date, '%Y-%m') = ?`, [date]);
            });
            return data;
        });
    }
    vendorPaymentAmount(date, type) {
        return __awaiter(this, void 0, void 0, function* () {
            type === 'daily'
                ? (date = (0, moment_1.default)(date).format('YYYY-MM-DD'))
                : (date = (0, moment_1.default)(new Date(date)).format('YYYY-MM'));
            const [data] = yield this.query()
                .select(this.db.raw('sum(payment_amount) as total_payment'))
                .from('trabill_vendor_payments')
                .where('vpay_org_agency', this.org_agency)
                .andWhereNot('vpay_is_deleted', 1)
                .modify((event) => {
                type === 'daily'
                    ? event.andWhereRaw(`DATE_FORMAT(trabill_vendor_payments.payment_date, '%Y-%m-%d') = ?`, [date])
                    : event.andWhereRaw('DATE_FORMAT(trabill_vendor_payments.payment_date,"%Y-%m") = ?', [date]);
            });
            return data;
        });
    }
    vendorPaymentReport(date, type) {
        return __awaiter(this, void 0, void 0, function* () {
            type === 'daily'
                ? (date = (0, moment_1.default)(date).format('YYYY-MM-DD'))
                : (date = (0, moment_1.default)(new Date(date)).format('YYYY-MM'));
            const data = yield this.query()
                .select('vouchar_no', this.db.raw(`COALESCE(vendor_name, combine_name) AS vendor_name`), 'payment_amount')
                .from('trabill_vendor_payments')
                .leftJoin('trabill_vendors', { vendor_id: 'vpay_vendor_id' })
                .leftJoin('trabill_combined_clients', { combine_id: 'vpay_combined_id' })
                .where('vpay_org_agency', this.org_agency)
                .andWhereNot('vpay_is_deleted', 1)
                .modify((event) => {
                type === 'daily'
                    ? event.andWhereRaw(`DATE_FORMAT(trabill_vendor_payments.payment_date, '%Y-%m-%d') = ?`, [date])
                    : event.andWhereRaw('DATE_FORMAT(trabill_vendor_payments.payment_date,"%Y-%m") = ?', [date]);
            });
            return data;
        });
    }
    expenseAmountReport(date, type) {
        return __awaiter(this, void 0, void 0, function* () {
            type === 'daily'
                ? (date = (0, moment_1.default)(date).format('YYYY-MM-DD'))
                : (date = (0, moment_1.default)(new Date(date)).format('YYYY-MM'));
            const data = yield this.query()
                .select(this.db.raw('sum(DISTINCT trabill_expenses.expense_total_amount) as expense_total'))
                .from('trabill_expenses')
                .leftJoin('trabill_expense_cheque_details', {
                expcheque_expense_id: 'expense_id',
            })
                .where(function () {
                this.where('trabill_expenses.expense_payment_type', '<', '4').orWhere(function () {
                    this.where('trabill_expenses.expense_payment_type', '=', '4').andWhere('trabill_expense_cheque_details.expcheque_status', 'DEPOSIT');
                });
            })
                .andWhere('expense_org_agency', this.org_agency)
                .andWhereNot('expense_is_deleted', 1)
                .modify((event) => {
                type === 'daily'
                    ? event.andWhereRaw(`DATE_FORMAT(expense_date, '%Y-%m-%d') = ?`, [
                        date,
                    ])
                    : event.andWhereRaw('DATE_FORMAT(expense_date, "%Y-%m") = ?', [date]);
            });
            return data;
        });
    }
    expenseSummaryReport(date, type) {
        return __awaiter(this, void 0, void 0, function* () {
            type === 'daily'
                ? (date = (0, moment_1.default)(date).format('YYYY-MM-DD'))
                : (date = (0, moment_1.default)(new Date(date)).format('YYYY-MM'));
            const data = yield this.query()
                .select('head_name', 'expdetails_amount', 'expense_vouchar_no', 'expense_note', 'expense_note')
                .from('trabill_expense_details')
                .leftJoin('trabill_expense_head', { head_id: 'expdetails_head_id' })
                .leftJoin('trabill_expenses', { expense_id: 'expdetails_expense_id' })
                .where('expense_org_agency', this.org_agency)
                .modify((event) => {
                type === 'daily'
                    ? event.andWhereRaw(`DATE_FORMAT(expense_date, '%Y-%m-%d') = ?`, [
                        date,
                    ])
                    : event.andWhereRaw('DATE_FORMAT(expense_date, "%Y-%m") = ?', [date]);
            });
            return data;
        });
    }
    employeeExpenseReport(date, type) {
        return __awaiter(this, void 0, void 0, function* () {
            type === 'daily'
                ? (date = (0, moment_1.default)(date).format('YYYY-MM-DD'))
                : (date = (0, moment_1.default)(new Date(date)).format('YYYY-MM'));
            const data = yield this.query()
                .select(this.db.raw('sum(payroll_salary) as salary'))
                .from('trabill_payroll')
                .where('payroll_org_agency', this.org_agency)
                .where('payroll_id_deleted', 0)
                .modify((event) => {
                type === 'daily'
                    ? event.andWhereRaw(`DATE_FORMAT(payroll_date, '%Y-%m-%d') = ?`, [
                        date,
                    ])
                    : event.andWhereRaw('DATE_FORMAT(payroll_date, "%Y-%m") = ?', [date]);
            });
            return data;
        });
    }
    accountCollectionAmount(date, type) {
        return __awaiter(this, void 0, void 0, function* () {
            type === 'daily'
                ? (date = (0, moment_1.default)(new Date(date)).format('YYYY-MM-DD'))
                : (date = (0, moment_1.default)(new Date(date)).format('YYYY-MM'));
            const data = yield this.query()
                .select(this.db.raw('sum(acctrxn_amount) as account_collection'))
                .from(`${this.trxn}.acc_trxn`)
                .leftJoin(this.db.raw(`trabill_accounts ON trabill_accounts.account_id = ${this.trxn}.acc_trxn.acctrxn_ac_id AND account_is_deleted =0`))
                .modify((event) => {
                type === 'daily'
                    ? event.andWhereRaw(`DATE_FORMAT(${this.trxn}.acc_trxn.acctrxn_created_at, '%Y-%m-%d') = ?`, [date])
                    : event.andWhereRaw(`DATE_FORMAT(${this.trxn}.acc_trxn.acctrxn_created_at, '%Y-%m') = ?`, [date]);
            })
                .where('acctrxn_type', 'CREDIT')
                .andWhere('acctrxn_agency_id', this.org_agency)
                .andWhereNot('acctrxn_is_deleted', 1);
            return data;
        });
    }
    accountCollectionReport(date, type) {
        return __awaiter(this, void 0, void 0, function* () {
            type === 'daily'
                ? (date = (0, moment_1.default)(new Date(date)).format('YYYY-MM-DD'))
                : (date = (0, moment_1.default)(new Date(date)).format('YYYY-MM'));
            const data = yield this.query()
                .select('account_id', 'account_name', this.db.raw('sum(acctrxn_amount) as account_collection'))
                .from(`${this.trxn}.acc_trxn`)
                .leftJoin(this.db.raw(`trabill_accounts ON trabill_accounts.account_id = ${this.trxn}.acc_trxn.acctrxn_ac_id AND account_is_deleted =0`))
                .modify((event) => {
                type === 'daily'
                    ? event.andWhereRaw(`DATE_FORMAT(${this.trxn}.acc_trxn.acctrxn_created_at, '%Y-%m-%d') = ?`, [date])
                    : event.andWhereRaw(`DATE_FORMAT(${this.trxn}.acc_trxn.acctrxn_created_at, '%Y-%m') = ?`, [date]);
            })
                .where('acctrxn_type', 'CREDIT')
                .andWhere('acctrxn_agency_id', this.org_agency)
                .andWhereNot('acctrxn_is_deleted', 1)
                .groupBy('acctrxn_ac_id');
            return data;
        });
    }
    getTotalAgentPayment(date, type) {
        return __awaiter(this, void 0, void 0, function* () {
            type === 'daily'
                ? (date = (0, moment_1.default)(new Date(date)).format('YYYY-MM-DD'))
                : (date = (0, moment_1.default)(new Date(date)).format('YYYY-MM'));
            const [data] = (yield this.query()
                .select(this.db.raw(`CAST(SUM(COALESCE(receipt_total_amount, 0)) AS DECIMAL(15,2)) AS agent_payment`))
                .from('trabill_money_receipts')
                .where('receipt_has_deleted', 0)
                .andWhere('receipt_org_agency', this.org_agency)
                .andWhere('receipt_payment_to', 'AGENT_COMMISSION')
                .modify((event) => {
                type === 'daily'
                    ? event.andWhereRaw('DATE_FORMAT(receipt_payment_date, "%Y-%m-%d") = ?', [date])
                    : event.andWhereRaw(`DATE_FORMAT(receipt_payment_date, '%Y-%m') = ?`, [date]);
            }));
            return Number(data.agent_payment);
        });
    }
    clientRefundAmount(date, type) {
        return __awaiter(this, void 0, void 0, function* () {
            type === 'daily'
                ? (date = (0, moment_1.default)(date).format('YYYY-MM-DD'))
                : (date = (0, moment_1.default)(new Date(date)).format('YYYY-MM'));
            const data = yield this.query()
                .select(this.db.raw('sum(crefund_total_amount) as client_refund_total'))
                .from('view_clients_refunds')
                .where('agency_id', this.org_agency)
                .modify((event) => {
                type === 'daily'
                    ? event.andWhereRaw(`DATE_FORMAT(view_clients_refunds.crefund_create_date, '%Y-%m-%d') = ?`, [date])
                    : event.andWhereRaw('DATE_FORMAT(view_clients_refunds.crefund_create_date, "%Y-%m") = ?', [date]);
            });
            return data;
        });
    }
    clientRefundReport(date, type) {
        return __awaiter(this, void 0, void 0, function* () {
            type === 'daily'
                ? (date = (0, moment_1.default)(date).format('YYYY-MM-DD'))
                : (date = (0, moment_1.default)(new Date(date)).format('YYYY-MM'));
            const data = yield this.query()
                .select('refund_invoice_id', 'invoice_no', 'client_name', 'crefund_total_amount')
                .from('view_clients_refunds')
                .where('agency_id', this.org_agency)
                .modify((event) => {
                type === 'daily'
                    ? event.andWhereRaw(`DATE_FORMAT(view_clients_refunds.crefund_create_date, '%Y-%m-%d') = ?`, [date])
                    : event.andWhereRaw('DATE_FORMAT(view_clients_refunds.crefund_create_date, "%Y-%m") = ?', [date]);
            });
            return data;
        });
    }
    vendorRefundReport(date, type) {
        return __awaiter(this, void 0, void 0, function* () {
            type === 'daily'
                ? (date = (0, moment_1.default)(date).format('YYYY-MM-DD'))
                : (date = (0, moment_1.default)(new Date(date)).format('YYYY-MM'));
            const data = yield this.query()
                .select('invoice_no', 'vendor_name', 'vrefund_total_amount')
                .from('view_vendors_refunds')
                .where('agency_id', this.org_agency)
                .modify((event) => {
                type === 'daily'
                    ? event.andWhereRaw(`DATE_FORMAT(view_vendors_refunds.vrefund_create_date, '%Y-%m-%d') = ?`, [date])
                    : event.andWhereRaw('DATE_FORMAT(view_vendors_refunds.vrefund_create_date, "%Y-%m") = ?', [date]);
            });
            return data;
        });
    }
    vendorRefundAmount(date, type) {
        return __awaiter(this, void 0, void 0, function* () {
            type === 'daily'
                ? (date = (0, moment_1.default)(date).format('YYYY-MM-DD'))
                : (date = (0, moment_1.default)(new Date(date)).format('YYYY-MM'));
            const data = yield this.query()
                .select(this.db.raw('sum(vrefund_return_amount) as vendor_refund_total'))
                .from('view_vendors_refunds')
                .where('agency_id', this.org_agency)
                .modify((event) => {
                type === 'daily'
                    ? event.andWhereRaw(`DATE_FORMAT(view_vendors_refunds.vrefund_create_date, '%Y-%m-%d') = ?`, [date])
                    : event.andWhereRaw('DATE_FORMAT(view_vendors_refunds.vrefund_create_date, "%Y-%m") = ?', [date]);
            });
            return data;
        });
    }
    refundReportClient(from_date, to_date, page, size) {
        return __awaiter(this, void 0, void 0, function* () {
            from_date = (0, moment_1.default)(from_date).format('YYYY-MM-DD');
            to_date = (0, moment_1.default)(to_date).format('YYYY-MM-DD');
            const [[client_refunds]] = yield this.db.raw(`call ${this.database}.get_clients_refunds(${this.org_agency}, '${from_date}', '${to_date}', ${page}, ${size});`);
            return client_refunds;
        });
    }
    countRefundClientDataRow(from_date, to_date) {
        return __awaiter(this, void 0, void 0, function* () {
            from_date = (0, moment_1.default)(from_date).format('YYYY-MM-DD');
            to_date = (0, moment_1.default)(to_date).format('YYYY-MM-DD');
            const [[[count]]] = yield this.db.raw(`call ${this.database}.count_all_clients_refunds(${this.org_agency}, '${from_date}', '${to_date}');`);
            return Number(count.row_count);
        });
    }
    refundReportVendor(from_date, to_date, page, size) {
        return __awaiter(this, void 0, void 0, function* () {
            from_date = (0, moment_1.default)(from_date).format('YYYY-MM-DD');
            to_date = (0, moment_1.default)(to_date).format('YYYY-MM-DD');
            const [[vendor_refunds]] = yield this.db.raw(`call ${this.database}.get_vendors_refunds(${this.org_agency}, '${from_date}', '${to_date}', ${page}, ${size});`);
            return vendor_refunds;
        });
    }
    countVendorsRefundsDataRow(from_date, to_date) {
        return __awaiter(this, void 0, void 0, function* () {
            from_date = (0, moment_1.default)(from_date).format('YYYY-MM-DD');
            to_date = (0, moment_1.default)(to_date).format('YYYY-MM-DD');
            const [[[count]]] = yield this.db.raw(`call ${this.database}.count_all_vendors_refunds(${this.org_agency}, '${from_date}', '${to_date}');`);
            return count.row_count;
        });
    }
    salesReportCollectionDue(employee_id, from_date, to_date) {
        return __awaiter(this, void 0, void 0, function* () {
            from_date = (0, moment_1.default)(new Date(from_date)).format('YYYY-MM-DD');
            to_date = (0, moment_1.default)(new Date(to_date)).format('YYYY-MM-DD');
            const data = yield this.query()
                .select('receipt_vouchar_no as money_recepts', 'receipt_total_amount', 'invoice_net_total', 'invoice_client_previous_due', 'employee_full_name as sales_person')
                .from('trabill_money_receipts')
                .leftJoin('trabill_invoices', { invoice_client_id: 'receipt_client_id' })
                .leftJoin('trabill_clients', { client_id: 'receipt_client_id' })
                .leftJoin('trabill_users', { user_id: 'receipt_created_by' })
                .leftJoin('trabill_employees', { employee_id: 'invoice_sales_man_id' })
                .where('trabill_invoices.invoice_org_agency', this.org_agency)
                .andWhere('trabill_money_receipts.receipt_org_agency', this.org_agency)
                .andWhere('trabill_money_receipts.receipt_has_deleted', 0)
                .whereRaw('Date(receipt_payment_date) BETWEEN ? AND ?', [
                from_date,
                to_date,
            ])
                .modify((event) => {
                if (employee_id && employee_id !== 'all') {
                    event.where('invoice_sales_man_id', employee_id);
                }
            });
            return data;
        });
    }
    headWiseExpenseReport(head_id, from_date, to_date, page, size) {
        return __awaiter(this, void 0, void 0, function* () {
            from_date = (0, moment_1.default)(new Date(from_date)).format('YYYY-MM-DD');
            to_date = (0, moment_1.default)(new Date(to_date)).format('YYYY-MM-DD');
            const offset = (page - 1) * size;
            const data = yield this.query()
                .select('expense_total_amount', 'expdetails_head_id', 'head_name as head_expense', 'expense_vouchar_no', 'expense_note', 'expcheque_status', 'expense_date', 'expense_payment_type', 'account_name', 'expdetails_amount')
                .from('trabill_expense_details')
                .leftJoin('trabill_expense_head', { head_id: 'expdetails_head_id' })
                .leftJoin('trabill_expenses', { expense_id: 'expdetails_expense_id' })
                .leftJoin('trabill_expense_cheque_details', {
                expcheque_expense_id: 'expense_id',
            })
                .leftJoin('trabill_accounts', { account_id: 'expense_accounts_id' })
                .where('expense_is_deleted', 0)
                .modify((event) => {
                if (head_id && head_id !== 'all') {
                    event.andWhere('expdetails_head_id', head_id);
                }
            })
                .andWhere('trabill_expenses.expense_org_agency', this.org_agency)
                .where(function () {
                this.where('trabill_expenses.expense_payment_type', '!=', '4').orWhere(function () {
                    this.where('trabill_expenses.expense_payment_type', '4').andWhere('trabill_expense_cheque_details.expcheque_status', 'DEPOSIT');
                });
            })
                .andWhereRaw('Date(expense_date) BETWEEN ? AND ?', [from_date, to_date])
                .orderBy('expense_id', 'desc')
                .groupBy('expense_id')
                .limit(size)
                .offset(offset);
            return data;
        });
    }
    countHeadWiseExpenseDataRow(head_id, from_date, to_date) {
        return __awaiter(this, void 0, void 0, function* () {
            from_date = (0, moment_1.default)(new Date(from_date)).format('YYYY-MM-DD');
            to_date = (0, moment_1.default)(new Date(to_date)).format('YYYY-MM-DD');
            const [count] = yield this.query()
                .select(this.db.raw(`count(*) as row_count`))
                .from('trabill_expense_details')
                .leftJoin('trabill_expense_head', { head_id: 'expdetails_head_id' })
                .leftJoin('trabill_expenses', { expense_id: 'expdetails_expense_id' })
                .leftJoin('trabill_users', { user_id: 'head_created_by' })
                .leftJoin('trabill_expense_cheque_details', {
                expcheque_expense_id: 'expense_id',
            })
                .where('expense_is_deleted', 0)
                .modify((event) => {
                if (head_id && head_id !== 'all') {
                    event.where('expdetails_head_id', head_id);
                }
            })
                .andWhere('trabill_expenses.expense_org_agency', this.org_agency)
                .where(function () {
                this.where('trabill_expenses.expense_payment_type', '!=', '4').orWhere(function () {
                    this.where('trabill_expenses.expense_payment_type', '4').andWhere('trabill_expense_cheque_details.expcheque_status', 'DEPOSIT');
                });
            })
                .andWhereRaw('Date(expense_date) BETWEEN ? AND ?', [from_date, to_date]);
            return count.row_count;
        });
    }
    accountReport(account_id, from_date, to_date, page, size) {
        return __awaiter(this, void 0, void 0, function* () {
            from_date = (0, moment_1.default)(new Date(from_date)).format('YYYY-MM-DD');
            to_date = (0, moment_1.default)(new Date(to_date)).format('YYYY-MM-DD');
            const offset = (page - 1) * size;
            const getAllReport = yield this.query()
                .select('account_id', 'account_name', this.db.raw("concat(user_first_name, ' ', user_last_name) as created_by"), 'acctrxn_type AS actransaction_type', 'acctrxn_amount AS actransaction_amount', 'trxntype_name as transection_type', 'acctrxn_particular_id AS actransaction_transaction_type_id', 'acctrxn_created_at AS actransaction_date')
                .from(`${this.trxn}.acc_trxn`)
                .leftJoin('trabill_accounts', {
                account_id: `${this.trxn}.acc_trxn.acctrxn_ac_id`,
            })
                .leftJoin('trabill_users', {
                user_id: `${this.trxn}.acc_trxn.acctrxn_created_by`,
            })
                .leftJoin('trabill_transaction_type', {
                trxntype_id: `${this.trxn}.acc_trxn.acctrxn_particular_id`,
            })
                .where(`${this.trxn}.acc_trxn.acctrxn_agency_id`, this.org_agency)
                .andWhereNot(`${this.trxn}.acc_trxn.acctrxn_is_deleted`, 1)
                .modify((event) => {
                if (account_id !== 'all') {
                    let transaction_type;
                    if (account_id === 'non-invoice') {
                        transaction_type = 10;
                    }
                    else if (account_id === 'incentive') {
                        transaction_type = 26;
                    }
                    else if (account_id === 'investment') {
                        transaction_type = 43;
                    }
                    if (transaction_type === 10 ||
                        transaction_type === 26 ||
                        transaction_type === 43) {
                        event.where('acctrxn_particular_id', transaction_type);
                    }
                    else {
                        event.where('acctrxn_ac_id', account_id);
                    }
                }
            })
                .andWhereRaw('Date(acctrxn_created_at) BETWEEN ? AND ?', [
                from_date,
                to_date,
            ])
                .orderBy('acctrxn_particular_id', 'desc')
                .limit(size)
                .offset(offset);
            return getAllReport;
        });
    }
    countAccountReportDataRow(account_id, from_date, to_date) {
        return __awaiter(this, void 0, void 0, function* () {
            from_date = (0, moment_1.default)(new Date(from_date)).format('YYYY-MM-DD');
            to_date = (0, moment_1.default)(new Date(to_date)).format('YYYY-MM-DD');
            const [count] = yield this.query()
                .select(this.db.raw(`count(*) as row_count`))
                .from(`${this.trxn}.acc_trxn`)
                .andWhereNot('acctrxn_is_deleted', 1)
                .modify((event) => {
                if (account_id !== 'all') {
                    let transaction_type;
                    if (account_id === 'non-invoice') {
                        transaction_type = 10;
                    }
                    else if (account_id === 'incentive') {
                        transaction_type = 26;
                    }
                    else if (account_id === 'investment') {
                        transaction_type = 43;
                    }
                    if (transaction_type === 10 ||
                        transaction_type === 26 ||
                        transaction_type === 43) {
                        event.where('acctrxn_particular_id', transaction_type);
                    }
                    else {
                        event.where('acctrxn_ac_id', account_id);
                    }
                }
            })
                .andWhere('acctrxn_agency_id', this.org_agency)
                .whereRaw('Date(acctrxn_created_at) BETWEEN ? AND ?', [
                from_date,
                to_date,
            ]);
            return count.row_count;
        });
    }
    salesReportItemSalesman(item_id, sales_man_id, from_date, to_date, page, size, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            from_date = (0, moment_1.default)(new Date(from_date)).format('YYYY-MM-DD');
            to_date = (0, moment_1.default)(new Date(to_date)).format('YYYY-MM-DD');
            const offset = (page - 1) * size;
            const [{ count }] = (yield this.query()
                .select(this.db.raw(`count(*) as count`))
                .from(`view_sales_report_item_salesman`)
                .andWhereRaw('DATE_FORMAT(sales_date, "%Y-%m-%d") BETWEEN ? AND ?', [
                from_date,
                to_date,
            ])
                .modify(function (builder) {
                if (sales_man_id && sales_man_id !== 'all') {
                    builder.andWhere('invoice_sales_man_id', sales_man_id);
                }
                if (item_id && item_id !== 'all') {
                    builder.andWhere('product_id', item_id);
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
            const report = yield this.query()
                .select('invoice_id', 'invoice_category_id', 'invoice_no', 'sales_price', 'cost_price', 'create_date', 'sales_date', 'invoice_name', 'product_name', 'sales_by', 'invoice_sales_man_id', 'invoice_client_id', 'invoice_combined_id', 'client_name')
                .from(`view_sales_report_item_salesman`)
                .andWhereRaw('DATE_FORMAT(sales_date, "%Y-%m-%d") BETWEEN ? AND ?', [
                from_date,
                to_date,
            ])
                .modify(function (builder) {
                if (sales_man_id && sales_man_id !== 'all') {
                    builder.andWhere('invoice_sales_man_id', sales_man_id);
                }
                if (item_id && item_id !== 'all') {
                    builder.andWhere('product_id', item_id);
                }
            })
                .andWhere('org_agency_id', this.org_agency)
                .limit(size)
                .offset(offset);
            let employee;
            if (sales_man_id)
                [employee] = yield this.query()
                    .select('employee_full_name', 'employee_mobile', 'department_name', 'designation_name')
                    .from('trabill_employees')
                    .leftJoin('trabill_departments', {
                    department_id: 'employee_department_id',
                })
                    .leftJoin('trabill_designations', {
                    designation_id: 'employee_designation_id',
                })
                    .where('employee_id', sales_man_id);
            const total = report.reduce((acc, item) => {
                acc.total_sales += parseFloat(item.sales_price) || 0;
                return acc;
            }, {
                total_sales: 0,
            });
            return { count: total_count, data: { employee, report, total } };
        });
    }
    salesManReportCollectionDue(sales_man_id, from_date, to_date) {
        return __awaiter(this, void 0, void 0, function* () {
            from_date = (0, moment_1.default)(new Date(from_date)).format('YYYY-MM-DD');
            to_date = (0, moment_1.default)(new Date(to_date)).format('YYYY-MM-DD');
            const invoices = yield this.query()
                .select('invoice_id', 'invoice_no', 'invcat_title as invoice_name', 'employee_full_name as invoice_sales_by ', 'invoice_sales_date', 'client_name', 'invoice_net_total')
                .from('trabill_invoices')
                .where('trabill_invoices.invoice_org_agency', this.org_agency)
                .andWhere('invoice_is_deleted', 0)
                .leftJoin('trabill_invoice_categories', {
                invcat_id: 'invoice_category_id',
            })
                .leftJoin('trabill_clients', { client_id: 'invoice_client_id' })
                .leftJoin('trabill_employees', { employee_id: 'invoice_sales_man_id' })
                .modify(function (builder) {
                if (sales_man_id !== 'all') {
                    builder.where('invoice_sales_man_id', sales_man_id);
                }
            })
                .whereRaw('Date(invoice_sales_date) BETWEEN ? AND ?', [
                from_date,
                to_date,
            ]);
            const report = [];
            for (const item of invoices) {
                const [{ total_pay }] = yield this.query()
                    .from('trabill_invoice_client_payments')
                    .leftJoin('trabill_invoices', {
                    invoice_id: 'invclientpayment_invoice_id',
                })
                    .select(this.db.raw('SUM(invclientpayment_amount) AS total_pay'))
                    .where('invclientpayment_invoice_id', item.invoice_id)
                    .andWhere('trabill_invoices.invoice_org_agency', this.org_agency)
                    .andWhereNot('invclientpayment_is_deleted', 1);
                item.invoice_payment = total_pay ? total_pay : 0;
                report.push(item);
            }
            const [employee] = yield this.query()
                .select('employee_full_name', 'employee_mobile', 'department_name')
                .from('trabill_employees')
                .leftJoin('trabill_departments', {
                department_id: 'employee_department_id',
            })
                .where('employee_id', sales_man_id);
            return { employee, report };
        });
    }
    GDSReport(gds_name, from_date, to_date, page = 1, size = 20) {
        return __awaiter(this, void 0, void 0, function* () {
            from_date
                ? (from_date = (0, moment_1.default)(new Date(from_date)).format('YYYY-MM-DD'))
                : null;
            to_date ? (to_date = (0, moment_1.default)(new Date(to_date)).format('YYYY-MM-DD')) : null;
            const offset = ((0, lib_1.numRound)(page) - 1) * (0, lib_1.numRound)(size || 20);
            const data = yield this.query()
                .select('airticket_id', 'airline.airline_name', 'airticket_gross_fare', 'airticket_commission_percent_total', 'airticket_gds_id as gds_name', this.db.raw('airticket_segment as airticket_segment'), 'airticket_journey_date', 'airticket_ticket_no', this.db.raw(`GROUP_CONCAT(airline_iata_code SEPARATOR ' - ') AS airline_iata_code`), 'airticket_pnr')
                .from('trabill_invoice_airticket_items')
                .leftJoin(this.db.raw(`trabill_invoice_airticket_routes AS route ON route.airoute_airticket_id = airticket_id AND route.airoute_invoice_id = airticket_invoice_id AND airoute_is_deleted = 0`))
                .leftJoin('trabill_airports', {
                'trabill_airports.airline_id': 'airoute_route_sector_id',
            })
                .leftJoin('trabill_airlines as airline', {
                'airline.airline_id': 'airticket_airline_id',
            })
                .where('airticket_org_agency', this.org_agency)
                .whereNotNull('airticket_gds_id')
                .andWhereNot('airticket_is_deleted', 1)
                .modify((event) => {
                if (gds_name && gds_name !== 'all') {
                    event.andWhere('airticket_gds_id', gds_name);
                }
                if (from_date && to_date) {
                    event.andWhereRaw('Date(airticket_sales_date) BETWEEN ? AND ?', [
                        from_date,
                        to_date,
                    ]);
                }
            })
                .groupBy('airticket_id', 'gds_name')
                .limit((0, lib_1.numRound)(size))
                .offset(offset);
            const [{ row_count }] = yield this.db('trabill_invoice_airticket_items')
                .select(this.db.raw('count(*) as row_count'))
                .where('airticket_org_agency', this.org_agency)
                .whereNotNull('airticket_gds_id')
                .andWhereNot('airticket_is_deleted', 1)
                .modify((event) => {
                if (gds_name && gds_name !== 'all') {
                    event.andWhere('airticket_gds_id', gds_name);
                }
                if (from_date && to_date) {
                    event.andWhereRaw('Date(airticket_sales_date) BETWEEN ? AND ?', [
                        from_date,
                        to_date,
                    ]);
                }
            });
            return { count: row_count, data };
        });
    }
    GDSReportGrossSum(gds_name, from_date, to_date) {
        return __awaiter(this, void 0, void 0, function* () {
            from_date
                ? (from_date = (0, moment_1.default)(new Date(from_date)).format('YYYY-MM-DD'))
                : null;
            to_date ? (to_date = (0, moment_1.default)(new Date(to_date)).format('YYYY-MM-DD')) : null;
            const [data] = yield this.query()
                .sum('airticket_gross_fare as total_gross_fare')
                .sum('airticket_commission_percent_total as total_commission')
                .from('trabill_invoice_airticket_items')
                .where('airticket_org_agency', this.org_agency)
                .whereNotNull('airticket_gds_id')
                .andWhereNot('airticket_is_deleted', 1)
                .modify((event) => {
                if (gds_name && gds_name !== 'all') {
                    event.andWhere('airticket_gds_id', gds_name);
                }
                if (from_date && to_date) {
                    event.andWhereRaw('Date(airticket_sales_date) BETWEEN ? AND ?', [
                        from_date,
                        to_date,
                    ]);
                }
            });
            return data;
        });
    }
    AITReportClient(vendor_id, combined_id, from_date, to_date, page, size) {
        return __awaiter(this, void 0, void 0, function* () {
            from_date = (0, moment_1.default)(new Date(from_date)).format('YYYY-MM-DD');
            to_date = (0, moment_1.default)(new Date(to_date)).format('YYYY-MM-DD');
            const offset = (page - 1) * size;
            const data = yield this.query()
                .select('vendor_name', 'airticket_net_commssion', 'airticket_ait', 'airticket_sales_date', 'airticket_pnr', 'airticket_ticket_no')
                .from('trabill_invoice_airticket_items')
                .leftJoin('trabill_vendors', { vendor_id: 'airticket_vendor_id' })
                .where('airticket_org_agency', this.org_agency)
                .andWhereNot('airticket_is_deleted', 1)
                .modify((builder) => {
                if (vendor_id && vendor_id !== 'all') {
                    builder.where('airticket_vendor_id', vendor_id);
                }
                if (combined_id && combined_id !== 'all') {
                    builder.where('airticket_vendor_combine_id', combined_id);
                }
            })
                .andWhereRaw('Date(airticket_issue_date) BETWEEN ? AND ?', [
                from_date,
                to_date,
            ])
                .limit(size)
                .offset(offset);
            return data;
        });
    }
    voidInvoices(from_date, to_date, page = 1, size = 20) {
        return __awaiter(this, void 0, void 0, function* () {
            size = Number(size);
            const offset = (Number(page) - 1) * size;
            const data = yield this.query()
                .select('invoice_id', 'invoice_category_id', 'invoice_client_id', 'invoice_combined_id', this.db.raw('coalesce(cl.client_name,comb.combine_name , company_name) as client_name'), 'invoice_reissue_client_type', 'invoice_no', 'invoice_hajj_session', 'invcat_title', 'invoice_sub_total', 'invoice_net_total', 'invoice_void_charge', 'invoice_sales_date', 'invoice_note', 'user_full_name AS user_name', this.db.raw("CASE WHEN invoice_is_void = 1 THEN 'VOID' ELSE 'DELETE' END AS invoices_trash_type"), 'invoice_create_date')
                .from('trabill_invoices')
                .leftJoin('trabill_users', { user_id: 'invoice_created_by' })
                .leftJoin('trabill_client_company_information', {
                company_client_id: 'invoice_client_id',
            })
                .leftJoin('trabill_clients as cl', {
                'cl.client_id': 'invoice_client_id',
            })
                .leftJoin('trabill_combined_clients as comb', {
                'comb.combine_id': 'invoice_combined_id',
            })
                .leftJoin('trabill_invoice_categories', {
                invcat_id: 'invoice_category_id',
            })
                .where('invoice_is_void', 1)
                .andWhere('invoice_org_agency', this.org_agency)
                .modify((builder) => {
                if (from_date && to_date) {
                    builder.andWhereRaw('Date(invoice_void_date) BETWEEN ? AND ?', [
                        from_date,
                        to_date,
                    ]);
                }
            })
                .limit(size)
                .offset(offset);
            const [{ count }] = (yield this.query()
                .count('* as count')
                .from('trabill_invoices')
                .where('invoice_is_void', 1)
                .andWhere('invoice_org_agency', this.org_agency)
                .modify((builder) => {
                if (from_date && to_date) {
                    builder.andWhereRaw('Date(invoice_void_date) BETWEEN ? AND ?', [
                        from_date,
                        to_date,
                    ]);
                }
            }));
            return { count, data };
        });
    }
    // AIR TICKET TOTAL REPORT
    getAirTicketTotalReport(from_date, to_date, page = 1, size = 20, client) {
        return __awaiter(this, void 0, void 0, function* () {
            size = Number(size);
            const offset = (Number(page) - 1) * size;
            const { client_id, combined_id } = (0, common_helper_1.separateCombClientToId)(client);
            const data = yield this.query()
                .select('*')
                .from('v_air_ticket_total_summary')
                .andWhere('invoice_org_agency', this.org_agency)
                .modify((builder) => {
                if (from_date && to_date) {
                    builder.andWhereRaw('Date(invoice_sales_date) BETWEEN ? AND ?', [
                        from_date,
                        to_date,
                    ]);
                }
                if (client_id) {
                    builder.where('invoice_client_id', client_id);
                }
                if (combined_id) {
                    builder.where('invoice_combined_id', combined_id);
                }
            })
                .limit(size)
                .offset(offset);
            const [{ count }] = (yield this.query()
                .count('* as count')
                .from('v_air_ticket_total_summary')
                .andWhere('invoice_org_agency', this.org_agency)
                .modify((builder) => {
                if (from_date && to_date) {
                    builder.andWhereRaw('Date(invoice_sales_date) BETWEEN ? AND ?', [
                        from_date,
                        to_date,
                    ]);
                }
                if (client_id) {
                    builder.where('invoice_client_id', client_id);
                }
                if (combined_id) {
                    builder.where('invoice_combined_id', combined_id);
                }
            }));
            return { count, data };
        });
    }
    getAirTicketTotalSummary(from_date, to_date) {
        return __awaiter(this, void 0, void 0, function* () {
            const [data] = yield this.query()
                .sum('client_amount as total_sales')
                .sum('total_purchase as total_purchase')
                .sum('net_profit_loss as total_profit_loss')
                .sum('receive_amount as total_received')
                .from('v_air_ticket_total_summary')
                .andWhere('invoice_org_agency', this.org_agency)
                .modify((builder) => {
                if (from_date && to_date) {
                    builder.andWhereRaw('Date(invoice_sales_date) BETWEEN ? AND ?', [
                        from_date,
                        to_date,
                    ]);
                }
            });
            return data;
        });
    }
    countAitClientCount(vendor_id, combined_id, from_date, to_date) {
        return __awaiter(this, void 0, void 0, function* () {
            from_date = (0, moment_1.default)(new Date(from_date)).format('YYYY-MM-DD');
            to_date = (0, moment_1.default)(new Date(to_date)).format('YYYY-MM-DD');
            const [count] = yield this.query()
                .select(this.db.raw(`count(*) as row_count`))
                .from('trabill_invoice_airticket_items')
                .where('airticket_org_agency', this.org_agency)
                .andWhereNot('airticket_is_deleted', 1)
                .modify((builder) => {
                if (vendor_id && vendor_id !== 'all') {
                    builder.where('airticket_vendor_id', vendor_id);
                }
                if (combined_id && combined_id !== 'all') {
                    builder.where('airticket_vendor_combine_id', combined_id);
                }
            })
                .andWhereRaw('DATE_FORMAT(airticket_issue_date,"%Y-%m-%d") BETWEEN ? AND ?', [from_date, to_date]);
            return count.row_count;
        });
    }
    airlineWiseSalesReport(airline_id, from_date, to_date, page, size, search_query, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            from_date = (0, moment_1.default)(new Date(from_date)).format('YYYY-MM-DD');
            to_date = (0, moment_1.default)(new Date(to_date)).format('YYYY-MM-DD');
            const offset = (page - 1) * size;
            const [{ count }] = (yield this.query()
                .select(this.db.raw(`count(*) as count`))
                .from('view_all_airticket_details')
                .where('airticket_org_agency', this.org_agency)
                .modify((builder) => {
                if (airline_id !== 'all') {
                    builder.andWhere('airticket_airline_id', airline_id);
                }
            })
                .andWhereRaw('DATE_FORMAT(sales_date,"%Y-%m-%d") BETWEEN ? AND ?', [
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
            const result = yield this.query()
                .select('view_all_airticket_details.airticket_invoice_id as invoice_id', 
            // 'airticket_is_refund',
            // 'airticket_is_reissued',
            'view_all_airticket_details.invoice_category_id', 'view_all_airticket_details.invoice_no', 'airticket_airline_id', 'view_all_airticket_details.airticket_ticket_no', 'view_all_airticket_details.airticket_id', 'view_all_airticket_details.airticket_pnr', 'view_all_airticket_details.passport_name', 'view_all_airticket_details.airticket_routes', this.db.raw(`CASE 
        WHEN airticket_is_refund THEN 'REFUNDED'
        WHEN airticket_is_reissued THEN 'REISSUED'
        ELSE 'ISSUED'
    END AS TKT_TYPE`), this.db.raw(`view_all_airticket_details.airticket_client_price - COALESCE(trabill_invoices_extra_amounts.invoice_discount, 0) AS airticket_client_price`), 'view_all_airticket_details.airticket_purchase_price', this.db.raw('((view_all_airticket_details.airticket_client_price - COALESCE(trabill_invoices_extra_amounts.invoice_discount, 0)) - view_all_airticket_details.airticket_purchase_price) as total_profit'), 'trabill_airlines.airline_name', 'create_date AS invoice_create_date')
                .from('view_all_airticket_details')
                .leftJoin('trabill_airlines', { airline_id: 'airticket_airline_id' })
                .leftJoin('trabill_invoices_extra_amounts', {
                extra_amount_invoice_id: 'airticket_invoice_id',
            })
                .where('airticket_org_agency', this.org_agency)
                .modify((builder) => {
                if (airline_id !== 'all') {
                    builder.andWhere('airticket_airline_id', airline_id);
                }
                if (search_query) {
                    builder.whereILike('airticket_ticket_no', `%${search_query}%`);
                }
            })
                .andWhereRaw('DATE_FORMAT(sales_date,"%Y-%m-%d") BETWEEN ? AND ?', [
                from_date,
                to_date,
            ])
                .limit(size)
                .offset(offset);
            const infos = result.reduce((acc, item) => {
                acc.airticket_client_price +=
                    parseFloat(item.airticket_client_price) || 0;
                acc.airticket_purchase_price +=
                    parseFloat(item.airticket_purchase_price) || 0;
                return acc;
            }, {
                airticket_client_price: 0,
                airticket_purchase_price: 0,
            });
            return { count: total_count, data: Object.assign({ result }, infos) };
        });
    }
    getClientDiscount(client_id, combine_id, from_date, to_date, page, size) {
        return __awaiter(this, void 0, void 0, function* () {
            from_date = (0, moment_1.default)(new Date(from_date)).format('YYYY-MM-DD');
            to_date = (0, moment_1.default)(new Date(to_date)).format('YYYY-MM-DD');
            const offset = (page - 1) * size;
            const data = yield this.query()
                .select('invoice_id', 'invoice_category_id', 'invoice_client_id', 'invoice_combined_id', 'invoice_no', this.db.raw(`COALESCE(client_name, combine_name) as client_name`), 'invoice_sales_date as payment_date', 'invoice_discount as discount_total')
                .from('trabill_invoices')
                .leftJoin('trabill_clients', { client_id: 'invoice_client_id' })
                .leftJoin('trabill_combined_clients', {
                combine_id: 'invoice_combined_id',
            })
                .leftJoin('trabill_invoices_extra_amounts', {
                extra_amount_invoice_id: 'invoice_id',
            })
                .where('trabill_invoices.invoice_org_agency', this.org_agency)
                .andWhereNot('trabill_invoices.invoice_is_deleted', 1)
                .andWhere('invoice_discount', '>', 0)
                .whereRaw('Date(invoice_sales_date) BETWEEN ? AND ?', [
                from_date,
                to_date,
            ])
                .modify((event) => {
                if (client_id && client_id !== 'all') {
                    event.andWhere('invoice_client_id', client_id);
                }
                if (combine_id && combine_id !== 'all') {
                    event.andWhere('invoice_combined_id', combine_id);
                }
            })
                .orderBy('invoice_id')
                .limit(size)
                .offset(offset);
            const [{ row_count }] = yield this.query()
                .select(this.db.raw(`count(*) as row_count`))
                .from('trabill_invoices')
                .leftJoin('trabill_invoice_airticket_items', {
                airticket_invoice_id: 'invoice_id',
            })
                .where('trabill_invoices.invoice_org_agency', this.org_agency)
                .andWhereNot('invoice_is_deleted', 1)
                .whereRaw('Date(invoice_sales_date) BETWEEN ? AND ?', [
                from_date,
                to_date,
            ])
                .modify((event) => {
                if (client_id && client_id !== 'all') {
                    event.andWhere('invoice_client_id', client_id);
                }
                if (combine_id && combine_id !== 'all') {
                    event.andWhere('invoice_combined_id', combine_id);
                }
            })
                .whereNot('airticket_discount_total', 0);
            return { count: row_count, data };
        });
    }
    journeyDateWiseClientReport(client_id, combined_id, from_date, to_date, page, size) {
        return __awaiter(this, void 0, void 0, function* () {
            from_date = (0, moment_1.default)(new Date(from_date)).format('YYYY-MM-DD');
            to_date = (0, moment_1.default)(new Date(to_date)).format('YYYY-MM-DD');
            const offset = (page - 1) * size;
            const data = yield this.query()
                .select('*')
                .from('view_journey_date_wise_report')
                .where('airticket_org_agency', this.org_agency)
                .whereNotNull('airticket_journey_date')
                .andWhereRaw(`Date(airticket_journey_date) BETWEEN ? AND ?`, [
                from_date,
                to_date,
            ])
                .andWhere((event) => {
                if (client_id && client_id !== 'all')
                    event.where('airticket_client_id', client_id);
                if (combined_id && combined_id !== 'all')
                    event.andWhere('airticket_combined_id', combined_id);
            })
                .limit(size)
                .offset(offset);
            const [{ count }] = (yield this.query()
                .count('*')
                .from('view_journey_date_wise_report')
                .where('airticket_org_agency', this.org_agency)
                .whereNotNull('airticket_journey_date')
                .andWhere((event) => {
                if (client_id && client_id !== 'all')
                    event.where('airticket_client_id', client_id);
                if (combined_id && combined_id !== 'all')
                    event.andWhere('airticket_combined_id', combined_id);
            })
                .andWhereRaw(`Date(airticket_journey_date) BETWEEN ? AND ?`, [
                from_date,
                to_date,
            ]));
            return { count, data };
        });
    }
    getAllTicketNo() {
        return __awaiter(this, void 0, void 0, function* () {
            const [[ticket_no]] = yield this.db.raw(`call ${this.database}.get_all_ticket_no(${this.org_agency});`);
            return ticket_no;
        });
    }
    hajGroupPassengerList(group_id, page, size) {
        return __awaiter(this, void 0, void 0, function* () {
            const offset = (page - 1) * size;
            const data = yield this.query()
                .select('passport_passport_no', 'passport_name', 'hajiinfo_tracking_number', 'hajiinfo_tracking_number', 'passport_date_of_birth', 'passport_date_of_issue', 'passport_date_of_expire', 'passport_email', 'passport_mobile_no')
                .from('view_group_wise_passenger_list')
                .where('invoice_org_agency', this.org_agency)
                .modify((e) => {
                if (group_id && group_id !== 'all') {
                    e.where('invoice_haji_group_id', group_id);
                }
            })
                .orderBy('invoice_id', 'desc')
                .limit(size)
                .offset(offset);
            const [{ row_count }] = yield this.query()
                .select(this.db.raw(`count(*) as row_count`))
                .from('view_group_wise_passenger_list')
                .where('invoice_org_agency', this.org_agency)
                .modify((e) => {
                if (group_id) {
                    e.where('invoice_haji_group_id', group_id);
                }
            });
            return { count: row_count, data };
        });
    }
    getAllInvoiceCategory() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .select('invcat_id', 'invcat_title')
                .from('trabill_invoice_categories')
                .whereNot('invcat_is_deleted', 1);
        });
    }
    getAuditHistory(user_id, from_date, to_date, page, size) {
        return __awaiter(this, void 0, void 0, function* () {
            from_date = (0, moment_1.default)(new Date(from_date)).format('YYYY-MM-DD');
            to_date = (0, moment_1.default)(new Date(to_date)).format('YYYY-MM-DD');
            const offset = (page - 1) * size;
            const data = yield this.query()
                .select('audit_id', 'audit_user_id', 'audit_action', 'audit_content', 'audit_module_type', 'audit_action_date_time', this.db.raw("CONCAT(user_first_name, ' ', user_last_name) AS user_name"))
                .from('trabill_audit_history')
                .leftJoin('trabill_users', { user_id: 'audit_user_id' })
                .modify((builder) => {
                if (user_id && user_id !== 'all') {
                    builder.where('audit_user_id', user_id);
                }
            })
                .where('audit_org_agency', this.org_agency)
                .andWhereRaw('Date(audit_action_date_time) BETWEEN ? AND ?', [
                from_date,
                to_date,
            ])
                .orderBy('audit_id', 'desc')
                .limit(size)
                .offset(offset);
            const [{ row_count }] = yield this.query()
                .select(this.db.raw(`count(*) as row_count`))
                .from('trabill_audit_history')
                .modify((builder) => {
                if (user_id && user_id !== 'all') {
                    builder.where('audit_user_id', user_id);
                }
            })
                .where('audit_org_agency', this.org_agency)
                .andWhereNot('audit_is_deleted', 1)
                .andWhereRaw('Date(audit_action_date_time) BETWEEN ? AND ?', [
                from_date,
                to_date,
            ]);
            return { count: row_count, data };
        });
    }
}
exports.default = ReportModel;
//# sourceMappingURL=report.models.js.map