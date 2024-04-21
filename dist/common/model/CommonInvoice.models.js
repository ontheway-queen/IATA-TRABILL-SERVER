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
const abstract_models_1 = __importDefault(require("../../abstracts/abstract.models"));
const invoice_helpers_1 = require("../helpers/invoice.helpers");
const customError_1 = __importDefault(require("../utils/errors/customError"));
class CommonInvoiceModel extends abstract_models_1.default {
    constructor() {
        super(...arguments);
        this.checkCreditLimit = (ac_type, ac_id, ac_amount) => __awaiter(this, void 0, void 0, function* () {
            const [[[data]]] = yield this.db.raw(`CALL ${this.database}.check_credit_limit(?, ?, ?)`, [ac_type, ac_id, ac_amount]);
            return data === null || data === void 0 ? void 0 : data.result;
        });
        this.hasInvoiceMoneyReceipt = (invoice_id) => __awaiter(this, void 0, void 0, function* () {
            const [data] = (yield this.query()
                .count('invclientpayment_id as total')
                .from('trabill_invoice_client_payments')
                .where('invclientpayment_invoice_id', invoice_id)
                .whereNot('invclientpayment_is_deleted', 1));
            return data.total;
        });
        this.updateIsVoid = (invoiceId, invoice_void_charge) => __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update({ invoice_void_charge, invoice_is_void: 1 })
                .into('trabill_invoices_delete_void')
                .where('invoice_id', invoiceId);
        });
        this.getForEditInvoice = (invoiceId) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select('*')
                .from('view_invoice_for_edit')
                .where('invoice_id', invoiceId);
            if ((0, invoice_helpers_1.isNotEmpty)(data))
                return data[0];
            else {
                throw new customError_1.default('Please provide a valid invoice id', 400, 'Invalid invoice id');
            }
        });
        this.getProductById = (productId) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select('product_name')
                .from('trabill_products')
                .where('product_id', productId);
            return data[0].product_name;
        });
        this.getAirticketPrerequire = (invoice_id) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .from('trabill_invoices_airticket_prerequire')
                .select('invoice_show_discount', 'invoice_show_prev_due')
                .where('airticket_invoice_id', invoice_id);
            return data[0];
        });
        this.getInvoiceAirTicketPaxDetails = (invoiceId) => __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .select('passport_date_of_birth', 'passport_date_of_expire', 'passport_date_of_issue', this.db.raw('COALESCE(passport_email,p_email) AS passport_email'), this.db.raw('COALESCE(passport_mobile_no,p_mobile_no) AS passport_mobile_no'), 'passport_nid_no', 'passport_passport_no', this.db.raw('COALESCE(passport_name, p_passport_name) AS passport_name'), this.db.raw('COALESCE(passport_person_type, p_passport_type) AS passport_person_type'))
                .from('trabill_invoice_airticket_pax')
                .where('p_invoice_id', invoiceId)
                .andWhereNot('p_is_deleted', 1)
                .leftJoin('trabill_passport_details', {
                p_passport_id: 'passport_id',
            });
        });
        this.getViewBillingInfo = (inovice_id, billingTable) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select(this.db.raw('COALESCE(tv.vendor_name, tcc.combine_name) AS vendor_name'), 'billing_quantity', 'billing_unit_price', 'billing_subtotal', 'billing_cost_price', 'billing_profit', 'product_name', 'pax_name', 'billing_description')
                .from(billingTable)
                .leftJoin('trabill_combined_clients as tcc', {
                combine_id: 'billing_combined_id',
            })
                .leftJoin('trabill_vendors as tv', { vendor_id: 'billing_vendor_id' })
                .leftJoin('trabill_products', { product_id: 'billing_product_id' })
                .where('billing_invoice_id', inovice_id)
                .andWhereNot('billing_is_deleted', 1);
            return data;
        });
        //   INVOICE EXTRA AMOUNT
        this.insertInvoiceExtraAmount = (data) => __awaiter(this, void 0, void 0, function* () {
            yield this.query().insert(data).into('trabill_invoices_extra_amounts');
        });
        this.insertInvoicePreData = (data) => __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .insert(data)
                .into('trabill_invoices_airticket_prerequire');
        });
        this.updateInvoiceExtraAmount = (data, invoiceId) => __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update(data)
                .into('trabill_invoices_extra_amounts')
                .where('extra_amount_invoice_id', invoiceId);
        });
        this.updateAirticketPreData = (data, invoiceId) => __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update(data)
                .into('trabill_invoices_airticket_prerequire')
                .where('airticket_invoice_id', invoiceId);
        });
        this.getClientDue = (clientId) => __awaiter(this, void 0, void 0, function* () {
            const invoices = yield this.query()
                .select(this.db.raw('sum(invoice_net_total) as total_invoices'))
                .from('trabill_invoices')
                .where('invoice_client_id', clientId)
                .andWhereNot('invoice_is_deleted', 1);
            if ((0, invoice_helpers_1.isEmpty)(invoices)) {
                throw new customError_1.default('Cannot get client due', 400, 'Invalid client id');
            }
            const paidPay = yield this.query()
                .select(this.db.raw('sum(invclientpayment_amount) as total_paid'))
                .from('trabill_invoice_client_payments')
                .where('invclientpayment_client_id', clientId)
                .andWhereNot('invclientpayment_is_deleted', 1);
            if ((0, invoice_helpers_1.isNotEmpty)(paidPay)) {
                return Number(invoices[0].total_invoices) - Number(paidPay[0].total_paid);
            }
            else {
                return Number(invoices[0].total_invoices);
            }
        });
        this.insertAirticketRoute = (data) => __awaiter(this, void 0, void 0, function* () {
            const [id] = yield this.query()
                .insert(data)
                .into('trabill_invoice_airticket_routes');
            return id;
        });
        this.deleteAirticketRoute = (invoiceId, airoute_deleted_by) => __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update({ airoute_is_deleted: 1, airoute_deleted_by })
                .into('trabill_invoice_airticket_routes')
                .where('airoute_invoice_id', invoiceId);
        });
        this.deleteAirticketRouteByTicketIdAndInvoice = (invoiceId, ticketId, airoute_deleted_by) => __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update({ airoute_is_deleted: 1, airoute_deleted_by })
                .into('trabill_invoice_airticket_routes')
                .where('airoute_invoice_id', invoiceId)
                .andWhere('airoute_airticket_id', ticketId);
        });
        this.getInvoiceRoutes = (invoiceId) => __awaiter(this, void 0, void 0, function* () {
            const airticketRoutesId = yield this.query()
                .select('airoute_route_sector_id')
                .from('trabill_invoice_airticket_routes')
                .leftJoin('trabill_airports', { airline_id: 'airoute_route_sector_id' })
                .where('airoute_invoice_id', invoiceId)
                .andWhereNot('airoute_is_deleted', 1);
            const airticket_route_or_sector = airticketRoutesId.map((item) => item.airoute_route_sector_id);
            return airticket_route_or_sector;
        });
        this.getInvoiceRoutesName = (invoiceId) => __awaiter(this, void 0, void 0, function* () {
            const [routes] = yield this.query()
                .select(this.db.raw("group_concat(airline_iata_code, '-') as routes"))
                .from('trabill_invoice_airticket_routes')
                .where('airoute_invoice_id', invoiceId)
                .andWhereNot('airoute_is_deleted', 1)
                .leftJoin('trabill_airports', { airline_id: 'airoute_route_sector_id' })
                .groupBy('airoute_invoice_id');
            routes;
        });
        this.getAllInvoiceNomAndId = () => __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .select('invoice_id', 'invoice_no', 'invoice_category_id as cate_id')
                .from('trabill_invoices')
                .where('invoice_org_agency', this.org_agency)
                .whereNot('invoice_is_deleted', 1)
                .andWhereNot('invoice_is_refund', 1);
        });
        this.getSmsInvoiceInfo = (invoiceId) => __awaiter(this, void 0, void 0, function* () {
            const [data] = yield this.query()
                .select('invoice_no', 'org_owner_full_name', this.db.raw('COALESCE(client_name, combine_name) AS client_name'), 'invoice_net_total', 'org_currency', 'invoice_sales_date')
                .from('trabill_invoices')
                .leftJoin('trabill_agency_organization_information', {
                org_id: 'invoice_org_agency',
            })
                .leftJoin('view_all_clients', { client_id: 'invoice_client_id' })
                .leftJoin('view_all_combined_clients', {
                combine_id: 'invoice_combined_id',
            })
                .where('invoice_id', invoiceId);
            return data;
        });
        this.getSmsReceiptInfo = (receiptId) => __awaiter(this, void 0, void 0, function* () {
            const [data] = yield this.query()
                .select('receipt_total_amount', 'org_owner_full_name', 'org_currency', this.db.raw('COALESCE(client_name, combine_name) AS client_name'), this.db.raw('COALESCE(client_last_balance, combine_lastbalance_amount) AS client_last_balance'), 'receipt_payment_date')
                .from('trabill_money_receipts')
                .leftJoin('trabill_agency_organization_information', {
                org_id: 'receipt_org_agency',
            })
                .leftJoin('view_all_clients', { client_id: 'receipt_client_id' })
                .leftJoin('view_all_combined_clients', {
                combine_id: 'receipt_combined_id',
            })
                .where('receipt_id', receiptId);
            return data;
        });
        this.getRoutesInfo = (routes_id) => __awaiter(this, void 0, void 0, function* () {
            const newRoute = [];
            for (const id of routes_id) {
                if (id) {
                    const [route] = (yield this.query()
                        .select('airline_iata_code')
                        .from('trabill_airports')
                        .where('trabill_airports.airline_id', id));
                    newRoute.push(route);
                }
            }
            const route = newRoute.map((item) => item.airline_iata_code).join('->');
            return route;
        });
        this.getPassportName = (id) => __awaiter(this, void 0, void 0, function* () {
            if (id[0]) {
                const names = yield this.query()
                    .select('passport_name')
                    .from('trabill.trabill_passport_details')
                    .whereIn('passport_id', id);
                return names.map((item) => item.passport_name).join(', ');
            }
        });
        this.getReissuedItemByInvId = (existingInvoiceId) => __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .select(this.db.raw('COALESCE(vendor_name, combine_name) vendor_name'), 'airticket_sales_date', 'airticket_profit', 'airticket_journey_date', 'airticket_return_date', 'airticket_purchase_price', 'airticket_client_price', 'airticket_ticket_no', 'airticket_existing_invoiceid', 'airticket_existing_airticket_id', 'airticket_penalties', 'airticket_fare_difference', 'airticket_commission_percent', 'airticket_ait', 'airticket_issue_date', 'airticket_classes')
                .from('trabill_invoice_reissue_airticket_items')
                .leftJoin('trabill_vendors', { vendor_id: 'airticket_vendor_id' })
                .leftJoin('trabill_combined_clients', {
                combine_id: 'airticket_vendor_combine_id',
            })
                .where('airticket_existing_invoiceid', existingInvoiceId)
                .andWhereNot('airticket_is_deleted', 1);
        });
        // ADVANCE MONEY RECEIPT
        this.getAdvanceMrById = (cl_id, com_id) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select('*')
                .from('v_advance_mr')
                .where('receipt_org_agency', this.org_agency)
                .andWhere('receipt_client_id', cl_id)
                .andWhere('receipt_combined_id', com_id);
            return data;
        });
        this.insertAdvanceMr = (data) => __awaiter(this, void 0, void 0, function* () {
            yield this.query().insert(data).into('trabill_invoice_client_payments');
        });
    }
    getAllInvoices(category_id, page, size, search_text = '', from_date, to_date) {
        return __awaiter(this, void 0, void 0, function* () {
            search_text && search_text.toLowerCase();
            size = Number(size);
            const offset = (Number(page) - 1) * size;
            from_date
                ? (from_date = (0, moment_1.default)(new Date(from_date)).format('YYYY-MM-DD'))
                : null;
            to_date ? (to_date = (0, moment_1.default)(new Date(to_date)).format('YYYY-MM-DD')) : null;
            const data = yield this.query()
                .select('*')
                .from('v_all_inv')
                .where('invoice_category_id', category_id)
                .modify((event) => {
                event
                    .andWhere(function () {
                    if (from_date && to_date) {
                        this.andWhereRaw(`DATE_FORMAT(invoice_create_date, '%Y-%m-%d') BETWEEN ? AND ?`, [from_date, to_date]);
                    }
                    if (search_text) {
                        this.andWhereRaw(`LOWER(v_all_inv.invoice_no) LIKE ?`, [
                            `%${search_text}%`,
                        ]).orWhereRaw(`LOWER(v_all_inv.client_name) LIKE ?`, [
                            `%${search_text}%`,
                        ]);
                    }
                })
                    .andWhere('invoice_org_agency', this.org_agency);
            })
                .andWhere('invoice_org_agency', this.org_agency)
                .limit(size)
                .offset(offset);
            const [{ row_count }] = yield this.query()
                .select(this.db.raw('count(*) as row_count'))
                .from('v_all_inv')
                .where('invoice_org_agency', this.org_agency)
                .andWhere('invoice_category_id', category_id)
                .andWhere(function () {
                if (from_date && to_date) {
                    this.andWhereRaw(`DATE_FORMAT(invoice_create_date, '%Y-%m-%d') BETWEEN ? AND ?`, [from_date, to_date]);
                }
                if (search_text) {
                    this.andWhereRaw(`LOWER(v_all_inv.invoice_no) LIKE ?`, [
                        `%${search_text}%`,
                    ]).orWhereRaw(`LOWER(v_all_inv.client_name) LIKE ?`, [
                        `%${search_text}%`,
                    ]);
                }
            });
            return { count: row_count, data };
        });
    }
    insertInvoiceAirticketPax(p_invoice_id, p_airticket_id, p_passport_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .insert({ p_invoice_id, p_airticket_id, p_passport_id })
                .into('trabill_invoice_airticket_pax');
        });
    }
    insertPaxIfNotExist(p_invoice_id, p_airticket_id, p_passport_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [isExist] = (yield this.query()
                .count('* as count')
                .from('trabill_invoice_airticket_pax')
                .where('p_invoice_id', p_invoice_id)
                .where('p_airticket_id', p_airticket_id)
                .where('p_passport_id', p_passport_id));
            if (!isExist.count) {
                yield this.query()
                    .insert({ p_invoice_id, p_airticket_id, p_passport_id })
                    .into('trabill_invoice_airticket_pax');
            }
        });
    }
    deleteInvoiceAirTicketPax(p_invoice_id, p_airticket_id, p_passport_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update({ p_is_deleted: 1 })
                .from('trabill_invoice_airticket_pax')
                .where('p_invoice_id', p_invoice_id)
                .where('p_airticket_id', p_airticket_id)
                .where('p_passport_id', p_passport_id);
        });
    }
    deletePreviousPax(p_invoice_id, p_airticket_id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (p_airticket_id) {
                yield this.query()
                    .update({ p_is_deleted: 1 })
                    .from('trabill_invoice_airticket_pax')
                    .whereNull('p_passport_id')
                    .andWhere('p_invoice_id', p_invoice_id)
                    .andWhere('p_airticket_id', p_airticket_id);
            }
        });
    }
    deleteInvoicePax(p_invoice_id, p_airticket_id, p_passport_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .insert({ p_invoice_id, p_airticket_id, p_passport_id })
                .into('trabill_invoice_airticket_pax');
        });
    }
    insertInvoiceAirticketPaxName(p_invoice_id, p_airticket_id, p_passport_name, p_passport_type, p_mobile_no, p_email) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .insert({
                p_invoice_id,
                p_airticket_id,
                p_passport_name,
                p_passport_type,
                p_mobile_no,
                p_email,
            })
                .into('trabill_invoice_airticket_pax');
        });
    }
    updateInvoiceAirTicketPax(p_invoice_id, p_airticket_id, pax_passports) {
        return __awaiter(this, void 0, void 0, function* () {
            const previous_pax = yield this.query()
                .select('p_invoice_id', 'p_airticket_id', 'p_passport_id')
                .from('trabill_invoice_airticket_pax')
                .where('p_invoice_id', p_invoice_id)
                .andWhere('p_airticket_id', p_airticket_id)
                .whereNotNull('p_passport_id')
                .andWhereNot('p_is_deleted', 1);
            if (pax_passports) {
                for (const paxInfo of previous_pax) {
                    if (!pax_passports.includes(paxInfo.p_passport_id)) {
                        yield this.query()
                            .update({ p_is_deleted: 1 })
                            .from('trabill_invoice_airticket_pax')
                            .where('p_invoice_id', p_invoice_id)
                            .andWhere('p_airticket_id', p_airticket_id)
                            .andWhere('p_passport_id', paxInfo.p_passport_id);
                    }
                }
                const pax_passport_id = previous_pax.map((item) => item.p_passport_id);
                for (const passportId of pax_passports) {
                    if (!pax_passport_id.includes(passportId) && passportId) {
                        yield this.query()
                            .insert({ p_invoice_id, p_airticket_id, p_passport_id: passportId })
                            .into('trabill_invoice_airticket_pax');
                    }
                }
            }
        });
    }
    getPreviousInvoices(invoice_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [data] = yield this.query()
                .from('trabill_invoices')
                .select('invoice_client_id as prevClientId', 'invoice_net_total as prev_inv_net_total', 'invoice_combined_id as prevComId', 'invoice_agent_com_amount as prevAgentCommission', 'invoice_agent_id as prevAgentId', 'invoice_cltrxn_id as prevCtrxnId', 'invoice_discount_cltrxn_id as prevClChargeTransId', 'invoice_no as prevInvoiceNo', 'invoice_note AS prevInvoiceNote', this.db.raw("coalesce(concat('client-',invoice_client_id), concat('combined-',invoice_combined_id)) as comb_client"), 'invoice_category_id')
                .where('invoice_id', invoice_id)
                .leftJoin('trabill_invoices_extra_amounts', {
                extra_amount_invoice_id: 'invoice_id',
            });
            if (!data) {
                throw new customError_1.default('Pleace provide valid invoice id', 400, 'Invalid id');
            }
            return Object.assign(Object.assign({}, data), { prevClientId: Number(data.prevClientId), prev_inv_net_total: Number(data.prev_inv_net_total) });
        });
    }
    // INVOICES
    insertInvoicesInfo(invoice_information) {
        return __awaiter(this, void 0, void 0, function* () {
            const invoice_id = yield this.query()
                .into('trabill_invoices')
                .insert(Object.assign(Object.assign({}, invoice_information), { invoice_org_agency: this.org_agency }));
            if (!invoice_id.length) {
                throw new customError_1.default('Cannot insert invoice data', 400, 'Invalid invoice data');
            }
            return invoice_id[0];
        });
    }
    updateInvoiceInformation(id, updated_invoice) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .into('trabill_invoices')
                .update(updated_invoice)
                .where('invoice_id', id);
        });
    }
    updateInvoiceClTrxn(invoice_cltrxn_id, invoice_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .into('trabill_invoices')
                .update({ invoice_cltrxn_id })
                .where('invoice_id', invoice_id);
        });
    }
    deleteInvoices(invoiceId, invoice_has_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            const has_v_pay = yield this.query()
                .select('*')
                .from('trabill_invoice_vendor_payments')
                .where('invendorpay_isdeleted', 0)
                .andWhere('invendorpay_invoice_id', invoiceId);
            const has_c_receipt = yield this.query()
                .select('*')
                .from('trabill_invoice_client_payments')
                .where('invclientpayment_is_deleted', 0)
                .andWhere('invclientpayment_invoice_id', invoiceId);
            if (has_c_receipt.length || has_v_pay.length) {
                throw new customError_1.default(`You can't delete this invoice`, 400, 'Bad request');
            }
            yield this.db.raw(`CALL ${this.database}.delete_invoice(?,?);`, [
                invoiceId,
                invoice_has_deleted_by,
            ]);
        });
    }
    getViewInvoiceInfo(invoiceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .from('trabill_invoices')
                .select('invoice_no', 'invoice_reference', 'invoice_client_previous_due', 'invoice_total_profit', 'invoice_show_discount', 'invoice_show_prev_due', 'employee_full_name', 'invoice_net_total', 'invoice_sub_total', 'invoice_total_vendor_price', 'invoice_category_id', 'invoice_create_date as invoice_date', 'invoice_sales_date', 'invoice_due_date', 'invoice_vat', 'invoice_service_charge', 'invoice_discount', 'agent_name', 'invoice_agent_com_amount', 'invoice_walking_customer_name', 'invoice_reissue_client_type', 'invoice_is_refund', this.db.raw("CASE WHEN invoice_client_id IS NOT NULL THEN CONCAT('client-',invoice_client_id) ELSE CONCAT('combined-',invoice_combined_id) END AS invoice_combclient_id"), this.db.raw('COALESCE(cl.client_name, ccl.combine_name) AS client_name'), this.db.raw(`COALESCE(cl.client_mobile, ccl.combine_mobile) AS client_mobile`), this.db.raw('COALESCE(cl.client_email, ccl.combine_email) AS client_email'), this.db.raw('COALESCE(cl.client_address, ccl.combine_address) AS client_address'), 'invoice_note', 'user_first_name')
                .where('invoice_id', invoiceId)
                .leftJoin('trabill_invoices_extra_amounts', {
                extra_amount_invoice_id: 'invoice_id',
            })
                .leftJoin('trabill_invoices_airticket_prerequire', {
                airticket_invoice_id: 'invoice_id',
            })
                .leftJoin('trabill_agents_profile', { agent_id: 'invoice_agent_id' })
                .leftJoin('trabill_employees', { employee_id: 'invoice_sales_man_id' })
                .leftJoin('trabill_users', { user_id: 'invoice_created_by' })
                .leftJoin('trabill_clients as cl', { invoice_client_id: 'cl.client_id' })
                .leftJoin('trabill_combined_clients as ccl', 'ccl.combine_id', 'invoice_combined_id');
            if ((0, invoice_helpers_1.isEmpty)(data)) {
                throw new customError_1.default('Please provide a valid invoice id', 400, 'Invalid Invoice Id');
            }
            const payments = yield this.query()
                .select('invclientpayment_moneyreceipt_id', 'invclientpayment_amount as receipt_total_amount', 'receipt_payment_date', 'user_full_name as received_by', 'acctype_name', this.db.raw('COALESCE(cl.client_name, ccl.combine_name) AS client_name'), this.db.raw('COALESCE(mr.receipt_money_receipt_no, mr.receipt_vouchar_no) AS receipt_money_receipt_no'), 'mr.receipt_payment_to', this.db.raw("COALESCE(mr.receipt_note, 'N/A') AS receipt_note "))
                .from('trabill_invoice_client_payments')
                .join('trabill_users', { user_id: 'invclientpayment_collected_by' })
                .leftJoin('trabill_money_receipts as mr', {
                receipt_id: 'invclientpayment_moneyreceipt_id',
            })
                .leftJoin('trabill_accounts_type', {
                acctype_id: 'receipt_payment_type',
            })
                .leftJoin('trabill_clients as cl', {
                invclientpayment_client_id: 'cl.client_id',
            })
                .leftJoin('trabill_combined_clients as ccl', 'ccl.combine_id', 'invclientpayment_combined_id')
                .where('invclientpayment_invoice_id', invoiceId)
                .andWhereNot('invclientpayment_is_deleted', 1)
                .andWhereNot('receipt_has_deleted', 1);
            const [invoices_pay] = yield this.query()
                .select(this.db.raw('CAST(SUM(invclientpayment_amount) AS DECIMAL(15,2)) AS invoice_pay'), this.db.raw('CAST(invoice_net_total - SUM(invclientpayment_amount) AS DECIMAL(15,2)) AS invoice_due'))
                .from('trabill_invoice_client_payments')
                .join('trabill_invoices', {
                invoice_id: 'invclientpayment_invoice_id',
            })
                .where('invclientpayment_invoice_id', invoiceId)
                .andWhereNot('invclientpayment_is_deleted', 1);
            return Object.assign(Object.assign(Object.assign({}, data[0]), invoices_pay), { payments });
        });
    }
    insertInvoiceHistory(historyData) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .into('trabill_invoices_history')
                .insert(Object.assign(Object.assign({}, historyData), { history_org_agency: this.org_agency }));
        });
    }
    createInvoiceVoidDetails(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const [id] = yield this.query()
                .insert(data)
                .into('trabill_invoices_void_details');
            return id;
        });
    }
}
exports.default = CommonInvoiceModel;
//# sourceMappingURL=CommonInvoice.models.js.map