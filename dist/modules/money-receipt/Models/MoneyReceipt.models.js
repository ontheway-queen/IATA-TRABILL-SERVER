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
const customError_1 = __importDefault(require("../../../common/utils/errors/customError"));
class MoneyReceiptModels extends abstract_models_1.default {
    constructor() {
        super(...arguments);
        // @INVOICE_CLIENT_PAYMENT
        this.insertInvoiceClPay = (insertedData) => __awaiter(this, void 0, void 0, function* () {
            const id = yield this.query()
                .into('trabill_invoice_client_payments')
                .insert(insertedData);
            return id[0];
        });
        this.getPrevInvoiceClPay = (receiptId) => __awaiter(this, void 0, void 0, function* () {
            const [data] = yield this.query()
                .from('trabill_invoice_client_payments')
                .select(this.db.raw("coalesce(concat('client-',invclientpayment_client_id), concat('combined-',invclientpayment_combined_id)) as comb_client"), 'invclientpayment_cltrxn_id')
                .where('invclientpayment_moneyreceipt_id', receiptId)
                .andWhereNot('invclientpayment_is_deleted', 1);
            return data;
        });
        this.deletePrevInvoiceClPay = (receiptId, invclientpayment_deleted_by) => __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .into('trabill_invoice_client_payments')
                .update({ invclientpayment_is_deleted: 1, invclientpayment_deleted_by })
                .where('invclientpayment_moneyreceipt_id', receiptId);
        });
        // @MONEY_RECEIPT
        this.insertMoneyReceipt = (insertedData) => __awaiter(this, void 0, void 0, function* () {
            const id = yield this.query()
                .into('trabill_money_receipts')
                .insert(Object.assign(Object.assign({}, insertedData), { receipt_org_agency: this.org_agency }));
            return id[0];
        });
        this.getMoneyReceiptByInvoiceid = (invoiceId) => __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .from('trabill_invoice_client_payments')
                .select('receipt_money_receipt_no', 'receipt_total_amount', 'receipt_payment_date', this.db.raw("concat(user_first_name, ' ', user_last_name) AS user_full_name"), 'acctype_name')
                .leftJoin('trabill_money_receipts', {
                receipt_id: 'invclientpayment_moneyreceipt_id',
            })
                .leftJoin('trabill_users', {
                user_id: 'receipt_created_by',
            })
                .leftJoin('trabill_accounts_type', {
                acctype_id: 'receipt_payment_type',
            })
                .where('invclientpayment_invoice_id', invoiceId)
                .andWhereNot('invclientpayment_is_deleted', 1)
                .andWhereNot('receipt_has_deleted', 1);
        });
        // @MONEY_RECEIPT_UPDATE
        this.updateMoneyReceipt = (updatedData, receiptId) => __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .into('trabill_money_receipts')
                .update(updatedData)
                .whereNot('receipt_payment_to', 'AGENT_COMMISSION')
                .where('receipt_id', receiptId);
        });
        // @MONEY_RECEIPT_CHEQUE_DETAILS
        this.insertMoneyReceiptChequeInfo = (insertedData) => __awaiter(this, void 0, void 0, function* () {
            const id = yield this.query()
                .into('trabill_money_receipts_cheque_details')
                .insert(Object.assign(Object.assign({}, insertedData), { cheque_org_agency: this.org_agency }));
            return id[0];
        });
        this.deletePrevMoneyReceiptChequeInfo = (receiptId, cheque_deleted_by) => __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .into('trabill_money_receipts_cheque_details')
                .update({ cheque_is_deleted: 1, cheque_deleted_by })
                .where('cheque_receipt_id', receiptId);
        });
        this.MoneyReceiptChequeStatus = (updatedData, receiptId) => __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .into('trabill_money_receipts_cheque_details')
                .update(updatedData)
                .where('cheque_receipt_id', receiptId);
        });
        this.getInvoicesIdAndAmount = (clientId, combinedId) => __awaiter(this, void 0, void 0, function* () {
            const all_invoice = yield this.query()
                .select('invoice_id', this.db.raw('CAST(invoice_net_total AS DECIMAL(15,2)) AS invoice_net_total'))
                .from('trabill_invoices')
                .where('invoice_client_id', clientId)
                .where('invoice_combined_id', combinedId)
                .andWhereNot('invoice_is_deleted', 1);
            const data = [];
            for (const invocie of all_invoice) {
                const [payment] = yield this.query()
                    .select(this.db.raw('CAST(SUM(invclientpayment_amount) AS DECIMAL(15,2)) AS payment'))
                    .from('trabill_invoice_client_payments')
                    .where('invclientpayment_invoice_id', invocie.invoice_id)
                    .andWhereNot('invclientpayment_is_deleted', 1);
                const total_due = invocie.invoice_net_total - (payment === null || payment === void 0 ? void 0 : payment.payment) || 0;
                if (total_due > 0) {
                    data.push({
                        invoice_id: invocie.invoice_id,
                        invoice_net_total: invocie.invoice_net_total,
                        invclientpayment_amount: (payment === null || payment === void 0 ? void 0 : payment.payment) || 0,
                        total_due,
                    });
                }
            }
            return data;
        });
        this.invoiceDueByClient = (clientId, combinedId) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.query()
                .select(this.db.raw('SUM(invoice_net_total - COALESCE(invclientpayment_amount, 0)) as total_due'))
                .from('trabill_invoices')
                .leftJoin('trabill_invoice_client_payments', 'invoice_id', '=', 'invclientpayment_invoice_id')
                .where((qb) => {
                qb.where((qb1) => {
                    qb1.where('invoice_client_id', clientId);
                    if (!clientId) {
                        qb1.orWhereNull('invoice_client_id');
                    }
                }).andWhere((qb2) => {
                    qb2.where('invoice_combined_id', combinedId);
                    if (!combinedId) {
                        qb2.orWhereNull('invoice_combined_id');
                    }
                });
            })
                .andWhere('invoice_is_deleted', 1)
                .andWhereRaw('CAST(invoice_net_total AS DECIMAL(10,2)) > CAST(COALESCE(invclientpayment_amount, 0) AS DECIMAL(10,2))')
                .first();
            return result.total_due || 0;
        });
        // ========================== INVOICE DUE
        this.getInvoiceDue = (invoiceId) => __awaiter(this, void 0, void 0, function* () {
            const [data] = yield this.query()
                .select('invoice_id')
                .select(this.db.raw("COALESCE(CONCAT('client-', invoice_client_id), CONCAT('combined-', invoice_combined_id)) AS invoice_combclient_id"), 'invoice_net_total', this.db.raw('COALESCE(invoice_pay, 0) AS invoice_pay'), this.db.raw('invoice_net_total - invoice_pay AS invoice_due'))
                .from('trabill.trabill_invoices')
                .leftJoin(this.db
                .select(this.db.raw('SUM(invclientpayment_amount) AS invoice_pay'))
                .select('invclientpayment_invoice_id')
                .from('trabill.trabill_invoice_client_payments')
                .whereNot('invclientpayment_is_deleted', 1)
                .groupBy('invclientpayment_invoice_id')
                .as('inv_pay'), 'inv_pay.invclientpayment_invoice_id', '=', 'invoice_id')
                .whereNot('invoice_is_deleted', 1)
                .whereNot('invoice_is_refund', 1)
                .where('invoice_id', invoiceId);
            return Object.assign(Object.assign({}, data), { invoice_due: (data === null || data === void 0 ? void 0 : data.invoice_due) || (data === null || data === void 0 ? void 0 : data.invoice_net_total) });
        });
        // ======================== @GET_ALL_MONEY_RECEIPT
        this.getAllMoneyReceipt = (page, size, search, from_date, to_date) => __awaiter(this, void 0, void 0, function* () {
            search && search.toLowerCase();
            const page_number = (page - 1) * size;
            from_date
                ? (from_date = (0, moment_1.default)(new Date(from_date)).format('YYYY-MM-DD'))
                : null;
            to_date ? (to_date = (0, moment_1.default)(new Date(to_date)).format('YYYY-MM-DD')) : null;
            const data = yield this.query()
                .select('*')
                .from('v_mr')
                .andWhere((builder) => {
                builder
                    .andWhere('receipt_org_agency', this.org_agency)
                    .modify((event) => {
                    if (search) {
                        event
                            .andWhereRaw(`LOWER(receipt_vouchar_no) LIKE ?`, [
                            `%${search}%`,
                        ])
                            .orWhereRaw(`LOWER(account_name) LIKE ?`, [`%${search}%`])
                            .orWhereRaw(`LOWER(client_name) LIKE ?`, [`%${search}%`])
                            .orWhereRaw(`LOWER(mobile) LIKE ?`, [`%${search}%`])
                            .orWhereRaw(`LOWER(receipt_money_receipt_no) LIKE ?`, [
                            `%${search}%`,
                        ])
                            .orWhereRaw(`LOWER(cheque_or_bank_name) LIKE ?`, [
                            `%${search}%`,
                        ]);
                    }
                    if (from_date && to_date) {
                        event.andWhereRaw(`DATE_FORMAT(receipt_payment_date,'%Y-%m-%d') BETWEEN ? AND ?`, [from_date, to_date]);
                    }
                });
            })
                .andWhere('receipt_org_agency', this.org_agency)
                .andWhereNot('receipt_payment_to', 'AGENT_COMMISSION')
                .limit(size)
                .offset(page_number);
            const [{ row_count }] = yield this.query()
                .select(this.db.raw(`COUNT(*) AS row_count`))
                .from('v_mr')
                .andWhere((builder) => {
                builder
                    .andWhere('receipt_org_agency', this.org_agency)
                    .modify((event) => {
                    if (search) {
                        event
                            .andWhereRaw(`LOWER(receipt_vouchar_no) LIKE ?`, [
                            `%${search}%`,
                        ])
                            .orWhereRaw(`LOWER(account_name) LIKE ?`, [`%${search}%`])
                            .orWhereRaw(`LOWER(client_name) LIKE ?`, [`%${search}%`])
                            .orWhereRaw(`LOWER(mobile) LIKE ?`, [`%${search}%`])
                            .orWhereRaw(`LOWER(receipt_money_receipt_no) LIKE ?`, [
                            `%${search}%`,
                        ])
                            .orWhereRaw(`LOWER(cheque_or_bank_name) LIKE ?`, [
                            `%${search}%`,
                        ]);
                    }
                    if (from_date && to_date) {
                        event.andWhereRaw(`DATE_FORMAT(receipt_payment_date,'%Y-%m-%d') BETWEEN ? AND ?`, [from_date, to_date]);
                    }
                });
            })
                .andWhere('receipt_org_agency', this.org_agency);
            return { count: row_count, data };
        });
        this.sumMoneyReceiptAmount = (search, from_date, to_date) => __awaiter(this, void 0, void 0, function* () {
            search && search.toLowerCase();
            from_date
                ? (from_date = (0, moment_1.default)(new Date(from_date)).format('YYYY-MM-DD'))
                : null;
            to_date ? (to_date = (0, moment_1.default)(new Date(to_date)).format('YYYY-MM-DD')) : null;
            const [data] = yield this.query()
                .sum('receipt_total_amount as total_received')
                .from('v_mr')
                .andWhere((builder) => {
                builder
                    .andWhere('receipt_org_agency', this.org_agency)
                    .modify((event) => {
                    if (search) {
                        event
                            .andWhereRaw(`LOWER(receipt_vouchar_no) LIKE ?`, [
                            `%${search}%`,
                        ])
                            .orWhereRaw(`LOWER(account_name) LIKE ?`, [`%${search}%`])
                            .orWhereRaw(`LOWER(client_name) LIKE ?`, [`%${search}%`])
                            .orWhereRaw(`LOWER(mobile) LIKE ?`, [`%${search}%`])
                            .orWhereRaw(`LOWER(receipt_money_receipt_no) LIKE ?`, [
                            `%${search}%`,
                        ])
                            .orWhereRaw(`LOWER(cheque_or_bank_name) LIKE ?`, [
                            `%${search}%`,
                        ]);
                    }
                    if (from_date && to_date) {
                        event.andWhereRaw(`DATE_FORMAT(receipt_payment_date,'%Y-%m-%d') BETWEEN ? AND ?`, [from_date, to_date]);
                    }
                });
            })
                .andWhere('receipt_org_agency', this.org_agency)
                .andWhereNot('receipt_payment_to', 'AGENT_COMMISSION');
            return data;
        });
        this.getAllAgentMoneyReceipt = (page, size, search, from_date, to_date) => __awaiter(this, void 0, void 0, function* () {
            search && search.toLowerCase();
            const page_number = (page - 1) * size;
            from_date
                ? (from_date = (0, moment_1.default)(new Date(from_date)).format('YYYY-MM-DD'))
                : null;
            to_date ? (to_date = (0, moment_1.default)(new Date(to_date)).format('YYYY-MM-DD')) : null;
            const data = yield this.query()
                .select('*')
                .from('v_mr')
                .andWhere((builder) => {
                builder
                    .andWhere('receipt_org_agency', this.org_agency)
                    .modify((event) => {
                    if (search) {
                        event
                            .andWhereRaw(`LOWER(receipt_vouchar_no) LIKE ?`, [
                            `%${search}%`,
                        ])
                            .orWhereRaw(`LOWER(agent_name) LIKE ?`, [`%${search}%`])
                            .orWhereRaw(`LOWER(invoice_no) LIKE ?`, [`%${search}%`])
                            .orWhereRaw(`LOWER(receipt_vouchar_no) LIKE ?`, [`%${search}%`])
                            .orWhereRaw(`LOWER(receipt_money_receipt_no) LIKE ?`, [
                            `%${search}%`,
                        ])
                            .orWhereRaw(`LOWER(cheque_or_bank_name) LIKE ?`, [
                            `%${search}%`,
                        ]);
                    }
                    if (from_date && to_date) {
                        event.andWhereRaw(`DATE_FORMAT(receipt_payment_date,'%Y-%m-%d') BETWEEN ? AND ?`, [from_date, to_date]);
                    }
                });
            })
                .whereNotNull('receipt_agent_id')
                .andWhere('receipt_org_agency', this.org_agency)
                // .andWhere('receipt_payment_to', 'AGENT_COMMISSION')
                .limit(size)
                .offset(page_number);
            const [{ row_count }] = yield this.query()
                .select(this.db.raw(`COUNT(*) AS row_count`))
                .from('v_mr')
                .andWhere((builder) => {
                builder
                    .andWhere('receipt_org_agency', this.org_agency)
                    .modify((event) => {
                    if (search) {
                        event
                            .andWhereRaw(`LOWER(receipt_vouchar_no) LIKE ?`, [
                            `%${search}%`,
                        ])
                            .orWhereRaw(`LOWER(account_name) LIKE ?`, [`%${search}%`])
                            .orWhereRaw(`LOWER(client_name) LIKE ?`, [`%${search}%`])
                            .orWhereRaw(`LOWER(mobile) LIKE ?`, [`%${search}%`])
                            .orWhereRaw(`LOWER(receipt_money_receipt_no) LIKE ?`, [
                            `%${search}%`,
                        ])
                            .orWhereRaw(`LOWER(cheque_or_bank_name) LIKE ?`, [
                            `%${search}%`,
                        ]);
                    }
                    if (from_date && to_date) {
                        event.andWhereRaw(`DATE_FORMAT(receipt_payment_date,'%Y-%m-%d') BETWEEN ? AND ?`, [from_date, to_date]);
                    }
                });
            })
                .whereNotNull('receipt_agent_id')
                .andWhere('receipt_org_agency', this.org_agency);
            return { count: row_count, data };
        });
        // ================== GET_INVOICE_BY_CLIENT_FOR_MONEY_RECEIPT =================
        this.getInvoiceByClientCombined = (clientId, combineId) => __awaiter(this, void 0, void 0, function* () {
            let invoices = [];
            const receipts = (yield this.query()
                .select('invoice_id', 'invoice_net_total', 'invoice_no', 'invoice_date', 'invoice_category_id', 'haji_info_status', 'approve_amount')
                .from('v_mr_able_inv')
                .modify((event) => {
                if (clientId) {
                    event.andWhere('invoice_client_id', clientId);
                }
                if (combineId) {
                    event.andWhere('invoice_combined_id', combineId);
                }
            })
                .andWhere('invoice_org_agency', this.org_agency));
            for (const receipt of receipts) {
                const { invoice_id, invoice_no, invoice_net_total, invoice_date, invoice_category_id, approve_amount, haji_info_status, } = receipt;
                if (invoice_category_id === 10) {
                    invoices.push({
                        invoice_id: invoice_id,
                        invoice_net_total: approve_amount,
                        invoice_no: invoice_no,
                        invoice_date: invoice_date,
                    });
                }
                else if (invoice_category_id === 30) {
                    if (haji_info_status === 'approved') {
                        invoices.push({
                            invoice_id: invoice_id,
                            invoice_net_total: invoice_net_total,
                            invoice_no: invoice_no,
                            invoice_date: invoice_date,
                        });
                    }
                }
                else {
                    invoices.push({
                        invoice_id: invoice_id,
                        invoice_net_total: invoice_net_total,
                        invoice_no: invoice_no,
                        invoice_date: invoice_date,
                    });
                }
            }
            const data = [];
            for (const invoice of invoices) {
                const invoice_pay = yield this.query()
                    .from('trabill_invoice_client_payments')
                    .select(this.db.raw('sum(invclientpayment_amount) as total_pay_amount'))
                    .where('invclientpayment_invoice_id', invoice.invoice_id)
                    .andWhereNot('invclientpayment_is_deleted', 1);
                const invoice_due = Number(invoice.invoice_net_total) -
                    Number(invoice_pay[0].total_pay_amount);
                if (Number(invoice.invoice_net_total) >
                    Number(invoice_pay[0].total_pay_amount)) {
                    data.push(Object.assign(Object.assign({}, invoice), { invoice_due, total_pay_amount: invoice_pay[0].total_pay_amount
                            ? invoice_pay[0].total_pay_amount
                            : 0 }));
                }
            }
            return data;
        });
        this.getInvoiceByClientCombinedForEdit = (clientId, combineId) => __awaiter(this, void 0, void 0, function* () {
            const invoices = yield this.query()
                .from('trabill_invoices')
                .select('invoice_id', 'invoice_net_total', 'invoice_no', 'invoice_create_date as invoice_date')
                .where('invoice_org_agency', this.org_agency)
                .whereNot('invoice_is_deleted', 1)
                .andWhereNot('invoice_is_refund', 1)
                .modify((event) => {
                if (clientId) {
                    event.andWhere('invoice_client_id', clientId);
                }
                if (combineId) {
                    event.andWhere('invoice_combined_id', combineId);
                }
            });
            const data = [];
            for (const invoice of invoices) {
                const invoice_pay = yield this.query()
                    .from('trabill_invoice_client_payments')
                    .select(this.db.raw('sum(invclientpayment_amount) as total_pay_amount'))
                    .where('invclientpayment_invoice_id', invoice.invoice_id)
                    .andWhereNot('invclientpayment_is_deleted', 1);
                const invoice_due = Number(invoice.invoice_net_total) -
                    Number(invoice_pay[0].total_pay_amount);
                data.push(Object.assign(Object.assign({}, invoice), { invoice_due, total_pay_amount: invoice_pay[0].total_pay_amount
                        ? invoice_pay[0].total_pay_amount
                        : 0 }));
            }
            return data;
        });
        // ================== GET_INVOICE_BY_CLIENT_FOR_MONEY_RECEIPT =================
        this.getSpecificTicketByClient = (clientId, combineId) => __awaiter(this, void 0, void 0, function* () {
            const invoices = yield this.query()
                .from('trabill_invoices')
                .select('invoice_id', 'invoice_net_total', 'invoice_no', 'invoice_create_date as invoice_date', 'invoice_client_previous_due', 'invoice_category_id')
                .where('invoice_org_agency', this.org_agency)
                .whereNot('invoice_is_deleted', 1)
                .andWhereNot('invoice_is_refund', 1)
                .modify((event) => {
                if (clientId) {
                    event.andWhere('invoice_client_id', clientId);
                }
                if (combineId) {
                    event.andWhere('invoice_combined_id', combineId);
                }
            });
            let data = [];
            for (const invoice of invoices) {
                const invoice_pay = yield this.query()
                    .from('trabill_invoice_client_payments')
                    .select(this.db.raw('sum(invclientpayment_amount) as total_pay_amount'))
                    .where('invclientpayment_invoice_id', invoice.invoice_id)
                    .andWhereNot('invclientpayment_is_deleted', 1);
                const invoice_due = Number(invoice.invoice_net_total) -
                    Number(invoice_pay[0].total_pay_amount);
                // ========== INVOICE AIR TICKET ITEM CATEGORY-1
                if (invoice.invoice_category_id === 1) {
                    const tickets = yield this.query()
                        .from('trabill_invoice_airticket_items')
                        .select('airticket_ticket_no', 'airticket_client_price as invoice_net_total')
                        .andWhere('airticket_invoice_id', invoice.invoice_id)
                        .andWhereNot('airticket_is_deleted', 1);
                    // @GET_DUE
                    for (const ticket of tickets) {
                        const pay_amount = yield this.query()
                            .from('trabill_invoice_client_payments')
                            .select(this.db.raw('sum(invclientpayment_amount) as total_pay_amount'))
                            .where('invclientpayment_invoice_id', invoice.invoice_id)
                            .andWhere('invclientpayment_ticket_number', ticket.airticket_ticket_no)
                            .andWhereNot('invclientpayment_is_deleted', 1);
                        const ticket_due = Number(ticket.invoice_net_total) -
                            Number(pay_amount[0].total_pay_amount);
                        if (invoice_due >= ticket_due && ticket_due > 0) {
                            data.push(Object.assign(Object.assign({ invoice_id: invoice.invoice_id, invoice_due,
                                ticket_due }, ticket), { total_pay_amount: pay_amount[0].total_pay_amount
                                    ? pay_amount[0].total_pay_amount
                                    : 0 }));
                        }
                    }
                }
                // ========== INVOICE NON COMMISSION CATEGORY-2
                if (invoice.invoice_category_id === 2) {
                    const tickets = yield this.query()
                        .from('trabill_invoice_noncom_airticket_items')
                        .select('airticket_ticket_no', 'airticket_client_price as invoice_net_total')
                        .andWhere('airticket_invoice_id', invoice.invoice_id)
                        .andWhereNot('airticket_is_deleted', 1);
                    for (const ticket of tickets) {
                        const pay_amount = yield this.query()
                            .from('trabill_invoice_client_payments')
                            .select(this.db.raw('sum(invclientpayment_amount) as total_pay_amount'))
                            .where('invclientpayment_invoice_id', invoice.invoice_id)
                            .andWhere('invclientpayment_ticket_number', ticket.airticket_ticket_no)
                            .andWhereNot('invclientpayment_is_deleted', 1);
                        const ticket_due = Number(ticket.invoice_net_total) -
                            Number(pay_amount[0].total_pay_amount);
                        if (invoice_due >= ticket_due && ticket_due > 0) {
                            data.push(Object.assign(Object.assign({ invoice_id: invoice.invoice_id, invoice_due,
                                ticket_due }, ticket), { total_pay_amount: pay_amount[0].total_pay_amount
                                    ? pay_amount[0].total_pay_amount
                                    : 0 }));
                        }
                    }
                }
                // ========== INVOICE REISSUE CATEGORY-3
                if (invoice.invoice_category_id === 3) {
                    const tickets = yield this.query()
                        .from('trabill_invoice_reissue_airticket_items')
                        .select('airticket_ticket_no', 'airticket_client_price as invoice_net_total')
                        .whereNot('airticket_is_deleted', 1)
                        .andWhere('airticket_invoice_id', invoice.invoice_id);
                    for (const ticket of tickets) {
                        const pay_amount = yield this.query()
                            .from('trabill_invoice_client_payments')
                            .select(this.db.raw('sum(invclientpayment_amount) as total_pay_amount'))
                            .where('invclientpayment_invoice_id', invoice.invoice_id)
                            .andWhere('invclientpayment_ticket_number', ticket.airticket_ticket_no)
                            .andWhereNot('invclientpayment_is_deleted', 1);
                        const ticket_due = Number(ticket.invoice_net_total) -
                            Number(pay_amount[0].total_pay_amount);
                        if (invoice_due >= ticket_due && ticket_due > 0) {
                            data.push(Object.assign(Object.assign({ invoice_id: invoice.invoice_id, invoice_due,
                                ticket_due }, ticket), { total_pay_amount: pay_amount[0].total_pay_amount
                                    ? pay_amount[0].total_pay_amount
                                    : 0 }));
                        }
                    }
                }
            }
            return data;
        });
        this.getSpecificTicketByClientForEdit = (clientId, combineId) => __awaiter(this, void 0, void 0, function* () {
            const invoices = yield this.query()
                .from('trabill_invoices')
                .select('invoice_id', 'invoice_net_total', 'invoice_no', 'invoice_create_date as invoice_date', 'invoice_client_previous_due', 'invoice_category_id')
                .where('invoice_org_agency', this.org_agency)
                .whereNot('invoice_is_deleted', 1)
                .andWhereNot('invoice_is_refund', 1)
                .modify((event) => {
                if (clientId) {
                    event.andWhere('invoice_client_id', clientId);
                }
                if (combineId) {
                    event.andWhere('invoice_combined_id', combineId);
                }
            });
            let data = [];
            for (const invoice of invoices) {
                const invoice_pay = yield this.query()
                    .from('trabill_invoice_client_payments')
                    .select(this.db.raw('sum(invclientpayment_amount) as total_pay_amount'))
                    .where('invclientpayment_invoice_id', invoice.invoice_id)
                    .andWhereNot('invclientpayment_is_deleted', 1);
                const invoice_due = Number(invoice.invoice_net_total) -
                    Number(invoice_pay[0].total_pay_amount);
                // ========== INVOICE AIR TICKET ITEM CATEGORY-1
                if (invoice.invoice_category_id === 1) {
                    const tickets = yield this.query()
                        .from('trabill_invoice_airticket_items')
                        .select('airticket_ticket_no', 'airticket_client_price as invoice_net_total')
                        .andWhere('airticket_invoice_id', invoice.invoice_id)
                        .andWhereNot('airticket_is_deleted', 1);
                    // @GET_DUE
                    for (const ticket of tickets) {
                        const pay_amount = yield this.query()
                            .from('trabill_invoice_client_payments')
                            .select(this.db.raw('sum(invclientpayment_amount) as total_pay_amount'))
                            .where('invclientpayment_invoice_id', invoice.invoice_id)
                            .andWhere('invclientpayment_ticket_number', ticket.airticket_ticket_no)
                            .andWhereNot('invclientpayment_is_deleted', 1);
                        const ticket_due = Number(ticket.invoice_net_total) -
                            Number(pay_amount[0].total_pay_amount);
                        data.push(Object.assign(Object.assign({ invoice_id: invoice.invoice_id, invoice_due,
                            ticket_due }, ticket), { total_pay_amount: pay_amount[0].total_pay_amount
                                ? pay_amount[0].total_pay_amount
                                : 0 }));
                    }
                }
                // ========== INVOICE NON COMMISSION CATEGORY-2
                if (invoice.invoice_category_id === 2) {
                    const tickets = yield this.query()
                        .from('trabill_invoice_noncom_airticket_items')
                        .select('airticket_ticket_no', 'airticket_client_price as invoice_net_total')
                        .andWhere('airticket_invoice_id', invoice.invoice_id)
                        .andWhereNot('airticket_is_deleted', 1);
                    for (const ticket of tickets) {
                        const pay_amount = yield this.query()
                            .from('trabill_invoice_client_payments')
                            .select(this.db.raw('sum(invclientpayment_amount) as total_pay_amount'))
                            .where('invclientpayment_invoice_id', invoice.invoice_id)
                            .andWhere('invclientpayment_ticket_number', ticket.airticket_ticket_no)
                            .andWhereNot('invclientpayment_is_deleted', 1);
                        const ticket_due = Number(ticket.invoice_net_total) -
                            Number(pay_amount[0].total_pay_amount);
                        if (invoice_due >= ticket_due && ticket_due > 0) {
                            data.push(Object.assign(Object.assign({ invoice_id: invoice.invoice_id, invoice_due,
                                ticket_due }, ticket), { total_pay_amount: pay_amount[0].total_pay_amount
                                    ? pay_amount[0].total_pay_amount
                                    : 0 }));
                        }
                    }
                }
                // ========== INVOICE REISSUE CATEGORY-3
                if (invoice.invoice_category_id === 3) {
                    const tickets = yield this.query()
                        .from('trabill_invoice_reissue_airticket_items')
                        .select('airticket_ticket_no', 'airticket_client_price as invoice_net_total')
                        .whereNot('airticket_is_deleted', 1)
                        .andWhere('airticket_invoice_id', invoice.invoice_id);
                    for (const ticket of tickets) {
                        const pay_amount = yield this.query()
                            .from('trabill_invoice_client_payments')
                            .select(this.db.raw('sum(invclientpayment_amount) as total_pay_amount'))
                            .where('invclientpayment_invoice_id', invoice.invoice_id)
                            .andWhere('invclientpayment_ticket_number', ticket.airticket_ticket_no)
                            .andWhereNot('invclientpayment_is_deleted', 1);
                        const ticket_due = Number(ticket.invoice_net_total) -
                            Number(pay_amount[0].total_pay_amount);
                        if (invoice_due >= ticket_due && ticket_due > 0) {
                            data.push(Object.assign(Object.assign({ invoice_id: invoice.invoice_id, invoice_due,
                                ticket_due }, ticket), { total_pay_amount: pay_amount[0].total_pay_amount
                                    ? pay_amount[0].total_pay_amount
                                    : 0 }));
                        }
                    }
                }
            }
            return data;
        });
        // =============== GET MONEY RECEIPT BY ID
        this.getMoneyReceiptById = (receiptId) => __awaiter(this, void 0, void 0, function* () {
            let moneyReceipt = yield this.query()
                .from('trabill_money_receipts')
                .select(this.db.raw("CASE WHEN receipt_client_id IS NOT NULL THEN CONCAT('client-', receipt_client_id) ELSE CONCAT('combined-',receipt_combined_id) END AS    receipt_combclient     "), 'acc_trxn.acctrxn_ac_id as account_id', 'receipt_id', 'receipt_total_amount', 'receipt_total_discount', 'receipt_payment_to', 'receipt_money_receipt_no', 'receipt_payment_type', 'receipt_walking_customer_name', 'receipt_payment_date', 'receipt_note', 'cheque_bank_name', 'cheque_number', 'cheque_withdraw_date', 'receipt_trxn_charge as charge_amount', 'receipt_trxn_no as trans_no', 'receipt_received_by')
                .leftJoin(`${this.trxn}.acc_trxn`, `${this.trxn}.acc_trxn.acctrxn_id`, `receipt_actransaction_id`)
                .leftJoin('trabill_money_receipts_cheque_details', {
                cheque_receipt_id: 'receipt_id',
            })
                .where('receipt_id', receiptId)
                .andWhereNot('receipt_has_deleted', 1);
            if (!moneyReceipt.length) {
                throw new customError_1.default('Please provide a valid id', 400, 'Invalid id');
            }
            let newData = moneyReceipt[0];
            // =============== CHEQUES =====================
            if (moneyReceipt[0].receipt_payment_type === 4) {
                const chequeData = yield this.query()
                    .from('trabill_money_receipts_cheque_details')
                    .select('cheque_number', 'cheque_withdraw_date', 'cheque_bank_name', 'cheque_status')
                    .where('cheque_receipt_id', receiptId)
                    .andWhereNot('cheque_is_deleted', 1);
                newData = Object.assign(Object.assign({}, moneyReceipt[0]), chequeData[0]);
            }
            // =============== TICKET ======================
            if (moneyReceipt[0].receipt_payment_to === 'TICKET') {
                const tickets = yield this.query()
                    .from('trabill_invoice_client_payments')
                    .select('invclientpayment_invoice_id as invoice_id', 'invclientpayment_ticket_number as ticket_no', 'invoice_net_total as netTotal', 'invoice_create_date as invoiceDate')
                    .join('trabill_invoices', {
                    invclientpayment_invoice_id: 'invoice_id',
                })
                    .where('invclientpayment_moneyreceipt_id', receiptId)
                    .andWhereNot('invclientpayment_is_deleted', 1);
                const data = [];
                for (const ticket of tickets) {
                    const invoice_total_pay = yield this.query()
                        .from('trabill_invoice_client_payments')
                        .select(this.db.raw('sum(invclientpayment_amount) as total_pay_amount'))
                        .where('invclientpayment_invoice_id', ticket.invoice_id)
                        .andWhereNot('invclientpayment_is_deleted', 1);
                    data.push(Object.assign(Object.assign({}, ticket), { paid: invoice_total_pay[0].total_pay_amount }));
                }
                return Object.assign(Object.assign({}, newData), { tickets: data });
            }
            // =============== INVOICE ======================
            if (moneyReceipt[0].receipt_payment_to === 'INVOICE') {
                const invoices = yield this.query()
                    .from('trabill_invoice_client_payments')
                    .select('invclientpayment_invoice_id as invoice_id', 'invclientpayment_amount as invoice_amount', 'invoice_no', ' invoice_net_total as netTotal', 'invoice_create_date as invoiceDate')
                    .where('invclientpayment_moneyreceipt_id', receiptId)
                    .andWhereNot('invclientpayment_is_deleted', 1)
                    .join('trabill_invoices', {
                    invclientpayment_invoice_id: 'invoice_id',
                });
                const data = [];
                for (const invoice of invoices) {
                    const invoice_total_pay = yield this.query()
                        .from('trabill_invoice_client_payments')
                        .select(this.db.raw('sum(invclientpayment_amount) as total_pay_amount'))
                        .where('invclientpayment_invoice_id', invoice.invoice_id)
                        .andWhereNot('invclientpayment_is_deleted', 1);
                    data.push(Object.assign(Object.assign({}, invoice), { paid: invoice_total_pay[0].total_pay_amount }));
                }
                return Object.assign(Object.assign({}, newData), { invoices: data });
            }
            return newData;
        });
        this.getMoneyReceiptChequeInfo = (receipt_id) => __awaiter(this, void 0, void 0, function* () {
            const [data] = yield this.query()
                .select('cheque_status', 'cheque_withdraw_date')
                .from('trabill_money_receipts_cheque_details')
                .leftJoin('trabill_money_receipts', { receipt_id: 'cheque_receipt_id' })
                .where('cheque_receipt_id', receipt_id)
                .andWhereNot('cheque_is_deleted', 1);
            return data;
        });
        this.getPrevAgentCommissionInfo = (receipt_id) => __awaiter(this, void 0, void 0, function* () {
            const [data] = yield this.query()
                .select('acctrxn_ac_id AS prevAccId', this.db.raw('CAST(receipt_total_amount AS DECIMAL(15,2)) AS prevReceiptTotal'), 'receipt_payment_type', 'receipt_actransaction_id as prevAccTrxnId', 'receipt_agent_id as prevAgentId', 'receipt_agent_trxn_id as prevAgentTrxnId', 'receipt_invoice_id as prevInvoiceId')
                .from('trabill_money_receipts')
                .leftJoin(`${this.trxn}.acc_trxn`, `${this.trxn}.acc_trxn.acctrxn_id`, 'receipt_actransaction_id')
                .where('receipt_id', receipt_id);
            return data;
        });
        this.getPreviousPaidAmount = (receiptId) => __awaiter(this, void 0, void 0, function* () {
            const amount = yield this.query()
                .from('trabill_money_receipts')
                .select('acctrxn_ac_id AS prevAccId', this.db.raw('CAST(receipt_total_amount AS DECIMAL(15,2)) AS prevReceiptTotal'), 'receipt_client_id as prevClientId', 'receipt_combined_id as prevCombId', 'receipt_payment_type', this.db.raw("CASE WHEN receipt_client_id IS NOT NULL THEN CONCAT('client-',receipt_client_id) ELSE CONCAT('combined-',receipt_combined_id) END AS prevCombClient"), 'receipt_ctrxn_id as prevClTrxn', 'receipt_actransaction_id as prevAccTrxnId', 'receipt_agent_id as prevAgentId', 'receipt_agent_trxn_id as prevAgentTrxnId', 'invclientpayment_invoice_id as prevInvoiceId', 'receipt_trxn_charge_id', 'receipt_vouchar_no', 'receipt_trxn_charge')
                .where('receipt_id', receiptId)
                .andWhereNot('receipt_has_deleted', 1)
                .leftJoin(`${this.trxn}.acc_trxn`, `${this.trxn}.acc_trxn.acctrxn_id`, 'receipt_actransaction_id')
                .leftJoin('trabill_invoice_client_payments', {
                invclientpayment_moneyreceipt_id: 'receipt_id',
            });
            return amount[0].receipt_payment_type !== 4
                ? amount[0]
                : undefined;
        });
        this.getInvoicesByMoneyReceiptId = (receiptId) => __awaiter(this, void 0, void 0, function* () {
            const [data] = yield this.query()
                .from('trabill_invoice_client_payments')
                .select('invclientpayment_moneyreceipt_id', 'invclientpayment_invoice_id as invoice_id', 'invclientpayment_amount as invoice_amount')
                .where('invclientpayment_moneyreceipt_id', receiptId);
            return data;
        });
        this.getViewMoneyReceipt = (id) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select('receipt_id', 'trxntype_name', 'receipt_vouchar_no', 'receipt_walking_customer_name', this.db.raw('COALESCE(cl.client_name, cl_cny.company_name, comcl.combine_name) AS client_name'), this.db.raw('CASE WHEN receipt_payment_type = 4 THEN cheque_bank_name ELSE NULL END AS bank_name'), this.db.raw('CASE WHEN receipt_payment_type IN (1, 2, 3) THEN account_name ELSE NULL END AS account_name'), 'receipt_payment_to', 'receipt_payment_date', 'receipt_total_amount', 'receipt_total_discount', 'agent_name', 'receipt_money_receipt_no', 'cheque_number', 'receipt_note', this.db.raw('COALESCE(cl.client_mobile, cl_cny.company_contact_no, comcl.combine_mobile) AS mobile_number'), this.db.raw('COALESCE(cl.client_lbalance, comcl.combine_lbalance) AS client_last_balance'), this.db.raw("CASE WHEN receipt_payment_type = 4 THEN 'Cheque' ELSE acctype_name END AS acctype_name"), this.db.raw(`CASE WHEN receipt_payment_to = 'OVERALL' THEN invoice_no = NULL ELSE invoice_no END AS invoice_no`))
                .from('trabill_money_receipts')
                .leftJoin('trabill_clients as cl', { client_id: 'receipt_client_id' })
                .leftJoin('trabill_client_company_information as cl_cny', {
                company_client_id: 'receipt_client_id',
            })
                .leftJoin('trabill_combined_clients as comcl', {
                combine_id: 'receipt_combined_id',
            })
                .leftJoin('trabill_accounts_type', { acctype_id: 'receipt_payment_type' })
                .leftJoin(`${this.trxn}.acc_trxn`, `${this.trxn}.acc_trxn.acctrxn_id`, 'receipt_actransaction_id')
                .leftJoin('trabill_money_receipts_cheque_details', {
                cheque_receipt_id: 'receipt_id',
            })
                .leftJoin('trabill_transaction_type', {
                trxntype_id: 'receipt_trnxtype_id',
            })
                .leftJoin('trabill_accounts', {
                account_id: `${this.trxn}.acc_trxn.acctrxn_ac_id`,
            })
                .leftJoin('trabill_invoice_client_payments as ticp', 'trabill_money_receipts.receipt_id', 'ticp.invclientpayment_moneyreceipt_id')
                .leftJoin('trabill_invoices_extra_amounts', {
                extra_amount_invoice_id: 'invclientpayment_invoice_id',
            })
                .leftJoin('trabill_invoices', 'trabill_invoices.invoice_id', 'ticp.invclientpayment_invoice_id')
                .leftJoin('trabill_agents_profile', { agent_id: 'invoice_agent_id' })
                .where('receipt_id', id);
            return data[0];
        });
        // ======================== @ ADVANCE RETURN @ ====================================
        this.insertAdvanceReturn = (data) => __awaiter(this, void 0, void 0, function* () {
            const id = yield this.query()
                .insert(Object.assign(Object.assign({}, data), { advr_org_agency: this.org_agency }))
                .into('trabill_advance_return');
            return id[0];
        });
        this.updateAdvanceReturn = (data, advrId) => __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update(data)
                .into('trabill_advance_return')
                .where('advr_id', advrId);
        });
        this.deleteAdvanceReturn = (advr_is_deleted, advr_deleted_by, advrId) => __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update({ advr_is_deleted, advr_deleted_by })
                .into('trabill_advance_return')
                .where('advr_id', advrId);
        });
        this.deleteInvClPayByRfId = (rf_type, rf_id, cl_id, com_id) => __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update('invclientpayment_is_deleted', 1)
                .from('trabill_invoice_client_payments')
                .where('invclientpayment_client_id', cl_id)
                .andWhere('invclientpayment_combined_id', com_id)
                .andWhere('invclientpayment_rf_type', rf_type)
                .andWhere('invclientpayment_rf_id', rf_id);
        });
        this.insertAdvrCheque = (data) => __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .insert(data)
                .into('trabill_advance_return_cheque_details');
        });
        this.getPrevAdvrIfo = (id) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .from('trabill_advance_return')
                .select(this.db.raw('CAST(advr_amount AS DECIMAL(15,2)) AS prevAmoun'), 'advr_vouchar_no', 'advr_account_id as prevAccId', 'advr_payment_type as prevPayType', 'advr_combined_id as prevCombinedId', 'advr_actransaction_id', 'advr_ctrxn_id', this.db.raw("CASE WHEN advr_client_id IS NOT NULL THEN CONCAT('client-',advr_client_id) ELSE CONCAT('combined-',advr_combined_id) END AS prevClientId"), 'advr_trxn_charge_id')
                .where('advr_id', id);
            if (!data.length) {
                throw new customError_1.default('Please provide a valid id', 400, 'Invalid id');
            }
            return data[0];
        });
        this.deletePrevAdvrCheques = (id, cheque_deleted_by) => __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .into('trabill_advance_return_cheque_details')
                .update({ cheque_is_deleted: 1, cheque_deleted_by })
                .where('cheque_advr_id', id);
        });
        this.getAllAdvr = (page, size, search, from_date, to_date) => __awaiter(this, void 0, void 0, function* () {
            search && search.toLowerCase();
            const page_number = (page - 1) * size;
            from_date
                ? (from_date = (0, moment_1.default)(new Date(from_date)).format('YYYY-MM-DD'))
                : null;
            to_date ? (to_date = (0, moment_1.default)(new Date(to_date)).format('YYYY-MM-DD')) : null;
            const data = yield this.query()
                .from('trabill_advance_return')
                .select('advr_id', 'advr_vouchar_no', 'advr_account_id', 'advr_client_id', 'advr_combined_id', 'advr_actransaction_id', 'advr_ctrxn_id', 'advr_amount', 'advr_payment_date', 'advr_payment_type', 'advr_trxn_charge', 'advr_trxn_no', 'advr_note', 'advr_create_date', this.db.raw("concat(user_first_name, ' ', user_last_name) AS created_by"), this.db.raw('COALESCE(account_name, cheque_status) as cheque_status_or_account_name'), this.db.raw('CASE WHEN advr_payment_type = 4 THEN "Cheque" WHEN advr_payment_type = 1 THEN "Cash" WHEN advr_payment_type = 2 THEN "Bank" WHEN advr_payment_type = 3 THEN "Mobile banking"  ELSE NULL END AS advr_pay_type'), this.db.raw('COALESCE(client_name, company_name, combine_name) as client_name'))
                .leftJoin('trabill_clients', { advr_client_id: 'client_id' })
                .leftJoin('trabill_client_company_information', {
                advr_client_id: 'company_client_id',
            })
                .leftJoin('trabill_combined_clients', { combine_id: 'advr_combined_id' })
                .leftJoin('trabill_accounts', { account_id: 'advr_account_id' })
                .leftJoin('trabill_advance_return_cheque_details', {
                cheque_advr_id: 'advr_id',
            })
                .leftJoin('trabill_users', { user_id: 'advr_created_by' })
                .where('advr_is_deleted', 0)
                .modify((event) => {
                event
                    .andWhere('advr_org_agency', this.org_agency)
                    .andWhere(function () {
                    if (search) {
                        this.andWhereRaw(`LOWER(advr_vouchar_no) LIKE ?`, [`%${search}%`])
                            .orWhereRaw(`LOWER(client_name) LIKE ?`, [`%${search}%`])
                            .orWhereRaw(`LOWER(cheque_status) LIKE ?`, [`%${search}%`])
                            .orWhereRaw(`LOWER(account_name) LIKE ?`, [`%${search}%`]);
                    }
                    if (from_date && to_date) {
                        this.andWhereRaw(`DATE_FORMAT(advr_create_date,'%Y-%m-%d') BETWEEN ? AND ? `, [from_date, to_date]);
                    }
                });
            })
                .andWhere('advr_org_agency', this.org_agency)
                .orderBy('advr_id', 'desc')
                .limit(size)
                .offset(page_number);
            const [{ row_count }] = yield this.query()
                .select(this.db.raw(`COUNT(*) AS row_count`))
                .from('trabill_advance_return')
                .leftJoin('trabill_clients', { advr_client_id: 'client_id' })
                .leftJoin('trabill_combined_clients', { combine_id: 'advr_combined_id' })
                .leftJoin('trabill_accounts', { account_id: 'advr_account_id' })
                .leftJoin('trabill_advance_return_cheque_details', {
                cheque_advr_id: 'advr_id',
            })
                .where('advr_is_deleted', 0)
                .modify((event) => {
                event
                    .andWhere('advr_org_agency', this.org_agency)
                    .andWhere(function () {
                    if (search) {
                        this.andWhereRaw(`LOWER(advr_vouchar_no) LIKE ?`, [`%${search}%`])
                            .orWhereRaw(`LOWER(client_name) LIKE ?`, [`%${search}%`])
                            .orWhereRaw(`LOWER(cheque_status) LIKE ?`, [`%${search}%`])
                            .orWhereRaw(`LOWER(account_name) LIKE ?`, [`%${search}%`]);
                    }
                    if (from_date && to_date) {
                        this.andWhereRaw(`DATE_FORMAT(advr_create_date,'%Y-%m-%d') BETWEEN ? AND ? `, [from_date, to_date]);
                    }
                });
            })
                .andWhere('advr_org_agency', this.org_agency);
            return { count: row_count, data };
        });
        this.getAdvrForEdit = (id) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select(this.db.raw("CASE WHEN advr_client_id IS NOT NULL THEN CONCAT('client-', advr_client_id) ELSE CONCAT('combined-',advr_combined_id) END AS    advr_combclient"), this.db.raw(`COALESCE(combine_name, client_name) AS client_name`), 'advr_vouchar_no', 'advr_payment_type', 'advr_account_id', 'account_name', 'advr_amount', 'advr_payment_date', 'advr_note', 'advr_trxn_charge', 'advr_trxn_no')
                .from('trabill_advance_return')
                .leftJoin('trabill_clients', { client_id: 'advr_client_id' })
                .leftJoin('trabill_combined_clients', { combine_id: 'advr_client_id' })
                .leftJoin('trabill_accounts', { account_id: 'advr_account_id' })
                .where('advr_id', id);
            if (!data.length) {
                throw new customError_1.default('Please provide a valid id', 400, 'Invalid Id');
            }
            if (data[0].advr_payment_type === 4) {
                const chequeData = yield this.query()
                    .from('trabill_advance_return_cheque_details')
                    .select('cheque_number', 'cheque_withdraw_date', 'cheque_bank_name')
                    .where('cheque_advr_id', id)
                    .andWhereNot('cheque_is_deleted', 1);
                return Object.assign(Object.assign({}, data[0]), chequeData[0]);
            }
            return data[0];
        });
    }
    deleteMoneyreceipt(receiptId, receipt_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .into('trabill_money_receipts')
                .update({ receipt_has_deleted: 1, receipt_deleted_by })
                .where('receipt_id', receiptId);
            if (data === 0) {
                throw new customError_1.default('Please provide a valid Id to delete receipts', 400, 'Invalid Invoice Id');
            }
        });
    }
    viewChequeInfoById(cheque_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select('cheque_number', 'cheque_withdraw_date', 'receipt_create_date as payment_date', 'cheque_status', 'cheque_bank_name', this.db.raw('IFNULL(client_name, combine_name) as client_name'), 'receipt_total_amount as cheque_amount')
                .from('trabill_money_receipts_cheque_details')
                .leftJoin('trabill_money_receipts', { cheque_receipt_id: 'receipt_id' })
                .leftJoin('trabill_clients', { client_id: 'receipt_client_id' })
                .leftJoin('trabill_combined_clients', {
                combine_id: 'receipt_combined_id',
            })
                .where('cheque_id', cheque_id)
                .andWhereNot('receipt_has_deleted', 1)
                .andWhereNot('cheque_is_deleted', 1);
            return data[0];
        });
    }
    updateAgentAmountPaid(invoiceId, is_paid) {
        return __awaiter(this, void 0, void 0, function* () {
            const success = yield this.query()
                .update('agent_commission_is_paid', is_paid)
                .into('trabill_invoices_extra_amounts')
                .where('extra_amount_invoice_id', invoiceId);
            if (!success) {
                throw new customError_1.default('Please provide valid invoice id', 400, 'invalid id');
            }
        });
    }
    // view Agent comission
    viewAgentCommission(receipt_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select('receipt_id', 'trxntype_name', 'receipt_vouchar_no', 'client_name', 'receipt_payment_to', 'receipt_payment_date', 'receipt_total_amount', 'agent_name', 'receipt_money_receipt_no', 'receipt_note', this.db.raw(`CASE WHEN receipt_payment_type = 1 THEN 'Cash' WHEN receipt_payment_type = 2 THEN 'Bank' WHEN receipt_payment_type = 3 THEN 'Mobile Banking' WHEN receipt_payment_type = 4 THEN 'Cheque' ELSE NULL END AS pay_type`), 'acctype_name')
                .from('trabill_money_receipts')
                .leftJoin('trabill_clients', { client_id: 'receipt_client_id' })
                .leftJoin('trabill_agents_profile', { agent_id: 'receipt_agent_id' })
                .leftJoin('trabill_accounts_type', { acctype_id: 'receipt_payment_type' })
                .leftJoin('trabill_transaction_type', {
                trxntype_id: 'receipt_trnxtype_id',
            })
                .where('receipt_payment_to', 'AGENT_COMMISSION')
                .andWhere('receipt_id', receipt_id)
                .andWhereNot('receipt_has_deleted', 1)
                .orderBy('receipt_id', 'desc');
            return data[0];
        });
    }
    // view Agent comission
    viewMoneyReceiptsInvoices(receipt_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .select('receipt_id', 'trxntype_name', 'receipt_vouchar_no', 'client_name', 'receipt_payment_to', 'receipt_payment_date', 'receipt_trxn_charge as charge_amount', 'receipt_trxn_no as trans_no', 'receipt_total_amount', 'agent_name', 'receipt_money_receipt_no', this.db.raw(`CASE WHEN receipt_payment_type = 1 THEN 'Cash' WHEN receipt_payment_type = 2 THEN 'Bank' WHEN receipt_payment_type = 3 THEN 'Mobile Banking' WHEN receipt_payment_type = 4 THEN 'Cheque' ELSE NULL END AS pay_type`), 'acctype_name')
                .from('trabill_money_receipts')
                .leftJoin('trabill_clients', { client_id: 'receipt_client_id' })
                .leftJoin('trabill_agents_profile', { agent_id: 'receipt_agent_id' })
                .leftJoin('trabill_accounts_type', { acctype_id: 'receipt_payment_type' })
                .leftJoin('trabill_transaction_type', {
                trxntype_id: 'receipt_trnxtype_id',
            })
                .whereNot('receipt_payment_to', 'AGENT_COMMISSION')
                .andWhere('receipt_id', receipt_id)
                .andWhereNot('receipt_has_deleted', 1)
                .orderBy('receipt_id', 'desc');
        });
    }
    // view agent invoice by client id
    viewAgentInvoiceById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select('invoice_id', 'invoice_no', 'invoice_client_id as receipt_client_id', 'invoice_agent_id', 'agent_name', 'invoice_agent_com_amount', 'agent_commission_is_paid')
                .from('trabill_invoices')
                .leftJoin('trabill_invoices_extra_amounts', {
                extra_amount_invoice_id: 'invoice_id',
            })
                .leftJoin('trabill_agents_profile', {
                agent_id: 'invoice_agent_id',
            })
                .where('invoice_client_id', id)
                .where('agent_commission_is_paid', 0)
                .andWhere('invoice_is_deleted', 0)
                .whereNot('invoice_agent_id', 'null')
                .orderBy('invoice_id', 'desc');
            return data;
        });
    }
    viewMoneyReceiptDetails(receipt_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .select('invclientpayment_amount', 'invclientpayment_date', 'invoice_no', 'invoice_sales_date', 'invoice_net_total')
                .from('trabill_invoice_client_payments')
                .where('invclientpayment_moneyreceipt_id', receipt_id)
                .andWhere('invclientpayment_is_deleted', 0)
                .leftJoin('trabill_invoices', {
                invoice_id: 'invclientpayment_invoice_id',
            })
                .leftJoin('trabill_clients', { client_id: 'invoice_client_id' })
                .leftJoin('trabill_combined_clients', {
                combine_id: 'invoice_combined_id',
            })
                .leftJoin('trabill_client_company_information', {
                company_client_id: 'invoice_client_id',
            });
        });
    }
    // get all agent invoice by id
    getAllAgentInvoiceById(invoice_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select('invoice_id', 'invoice_no', 'invoice_agent_com_amount as agent_amount', 'invoice_agent_id as agent_id', 'agent_name', 'invoice_service_charge', 'invoice_vat')
                .from('trabill_invoices_extra_amounts')
                .leftJoin('trabill_invoices', { invoice_id: 'extra_amount_invoice_id' })
                .leftJoin('trabill_agents_profile', { agent_id: 'invoice_agent_id' })
                .where('invoice_org_agency', this.org_agency)
                .whereNotNull('invoice_agent_id')
                .andWhere('agent_commission_is_paid', 0)
                .andWhere('agent_is_deleted', 0)
                .andWhere('extra_amount_invoice_id', invoice_id);
            return data[0];
        });
    }
    viewAllAgentInvoice(search) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .select('invoice_id', 'invoice_no', 'invoice_agent_id')
                .from('trabill_invoices_extra_amounts')
                .leftJoin('trabill_invoices', { invoice_id: 'extra_amount_invoice_id' })
                .where('invoice_org_agency', this.org_agency)
                .andWhereNot('trabill_invoices.invoice_is_deleted', 1)
                .whereNotNull('invoice_agent_id')
                .andWhere('agent_commission_is_paid', 0)
                .andWhere('extra_amount_is_deleted', 0)
                .andWhere('invoice_agent_com_amount', '>', 0)
                .modify((event) => {
                if (search) {
                    event.andWhereILike('invoice_no', `%${search}%`);
                }
                else {
                    event.orderBy('invoice_create_date', 'desc').limit(20);
                }
            });
        });
    }
}
exports.default = MoneyReceiptModels;
//# sourceMappingURL=MoneyReceipt.models.js.map