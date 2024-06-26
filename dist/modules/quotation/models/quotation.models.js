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
class QuotationModel extends abstract_models_1.default {
    constructor() {
        super(...arguments);
        this.confirmQuotation = (quotationId) => __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update('quotation_is_confirm', 1)
                .into('trabill_quotations')
                .where('quotation_id', quotationId);
        });
        // INVOICE WITH QUOTATION
        this.getInvoiceByCl = (client_id, combine_id) => __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .select('invoice_id', 'invoice_no', 'invoice_category_id as category_id')
                .from('trabill_invoices')
                .where('invoice_org_agency', this.org_agency)
                .havingIn('invoice_category_id', [1, 3, 5])
                .andWhere('invoice_client_id', client_id)
                .andWhere('invoice_combined_id', combine_id)
                .andWhereNot('invoice_is_deleted', 1);
        });
        this.getAirTicketBilling = (invoice_id) => __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .select('invoice_id', 'invoice_no', 'passport_name', 'airline_name', 'airticket_pnr', 'airticket_ticket_no', 'airticket_client_price', 'airticket_journey_date', 'airticket_return_date', 'airticket_routes')
                .from('trabill.view_all_airticket_details')
                .where('invoice_id', invoice_id);
        });
        this.getOtherBilling = (invoice_id) => __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .select('trabill_other_invoices_billing.billing_invoice_id', 'trabill_products.product_name', 'trabill_other_invoices_billing.pax_name', 'trabill_other_invoices_billing.billing_description', 'trabill_other_invoices_billing.billing_quantity', 'trabill_other_invoices_billing.billing_unit_price', 'trabill_other_invoices_billing.billing_subtotal')
                .from('trabill.trabill_other_invoices_billing')
                .leftJoin('trabill.trabill_products', 'trabill.trabill_products.product_id', 'trabill.trabill_other_invoices_billing.billing_product_id')
                .where('trabill_other_invoices_billing.billing_invoice_id', invoice_id);
        });
        this.getInvoicesTotal = (invoice_id) => __awaiter(this, void 0, void 0, function* () {
            const [data] = yield this.query()
                .select(this.db.raw('sum(invoice_sub_total) as total_sub_total'), this.db.raw('sum(invoice_discount) as total_discount'), this.db.raw('sum(invoice_net_total) as total_net_total'))
                .from('trabill_invoices')
                .leftJoin('trabill_invoices_extra_amounts', {
                invoice_id: 'extra_amount_invoice_id',
            })
                .whereIn('invoice_id', invoice_id)
                .andWhereNot('invoice_is_deleted', 1);
            return data;
        });
        this.getInvoicePayment = (invoice_id) => __awaiter(this, void 0, void 0, function* () {
            const [data] = yield this.query()
                .select(this.db.raw('sum(invclientpayment_amount) as total_payment'))
                .from('trabill_invoice_client_payments')
                .whereIn('invclientpayment_invoice_id', invoice_id)
                .andWhereNot('invclientpayment_is_deleted', 1);
            return data;
        });
    }
    products() {
        return __awaiter(this, void 0, void 0, function* () {
            const products = yield this.query()
                .select('product_id', 'product_name')
                .from('trabill_products')
                .whereNot('products_is_deleted', 1);
            return products;
        });
    }
    insertQuotation(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const quotation = yield this.query()
                .insert(Object.assign(Object.assign({}, data), { quotations_org_agency: this.org_agency }))
                .into('trabill_quotations');
            return quotation[0];
        });
    }
    updateQuotation(quotation_id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const quotation = yield this.query()
                .into('trabill_quotations')
                .update(data)
                .where('quotation_id', quotation_id);
            return quotation;
        });
    }
    selectQuotation(quotation_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [quotation] = yield this.query()
                .from('trabill_quotations')
                .select('quotation_no as q_number', 'quotation_date as sales_date', 'quotation_discount_total as discount', 'quotation_created_by as user', 'quotation_inv_payment as payment')
                .where('quotation_id', quotation_id);
            return quotation;
        });
    }
    deleteQuotation(quotation_id, quotation_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            const quotation = yield this.query()
                .into('trabill_quotations')
                .update({ quotation_is_deleted: 1, quotation_deleted_by })
                .where('quotation_id', quotation_id);
            return quotation;
        });
    }
    insertBillInfo(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const billInfo = yield this.query()
                .insert(data)
                .into('trabill_quotations_billing_infos');
            return billInfo[0];
        });
    }
    insertAccumulatedBilling(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.query().insert(data).into('trabill_quotations_billing_infos');
        });
    }
    deleteBillInfo(quotation_id, billing_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            const bill = yield this.query()
                .update({ billing_is_deleted: 1, billing_deleted_by })
                .into('trabill_quotations_billing_infos')
                .where('billing_quotation_id', quotation_id);
            return bill;
        });
    }
    viewQuotations(page, size, search_text, from_date, to_date) {
        return __awaiter(this, void 0, void 0, function* () {
            search_text && search_text.toLocaleLowerCase();
            const page_number = (page - 1) * size;
            from_date
                ? (from_date = (0, moment_1.default)(new Date(from_date)).format('YYYY-MM-DD'))
                : null;
            to_date ? (to_date = (0, moment_1.default)(new Date(to_date)).format('YYYY-MM-DD')) : null;
            const data = yield this.query()
                .select('quotation_id', this.db.raw(`COALESCE(client_name, company_name, combine_name) as client_name`), this.db.raw(`COALESCE(client_mobile, company_contact_no, combine_mobile) as client_mobile`), 'quotation_no', 'quotation_type', 'quotation_net_total', 'quotation_discount_total', 'quotation_date', 'quotation_note', 'quotation_is_confirm', 'quotation_is_deleted')
                .from('trabill_quotations')
                .leftJoin('trabill_clients', 'client_id', 'quotation_client_id')
                .leftJoin('trabill_client_company_information', 'company_client_id', 'quotation_client_id')
                .leftJoin('trabill_combined_clients', {
                'trabill_combined_clients.combine_id': 'quotation_combined_id',
            })
                .modify((event) => {
                event
                    .andWhere('quotations_org_agency', this.org_agency)
                    .andWhere(function () {
                    if (from_date && to_date) {
                        this.andWhereRaw(`DATE_FORMAT(quotation_create_date,'%Y-%m-%d') BETWEEN ? AND ?`, [from_date, to_date]);
                    }
                    if (search_text) {
                        this.andWhereRaw(`LOWER(trabill_quotations.quotation_no) LIKE ?`, [`%${search_text}%`])
                            .orWhereRaw(`LOWER(trabill_clients.client_name) LIKE ?`, [
                            `%${search_text}%`,
                        ])
                            .orWhereRaw(`LOWER(trabill_combined_clients.combine_name) LIKE ?`, [`%${search_text}%`])
                            .orWhereRaw(`LOWER(trabill_clients.client_mobile) LIKE ?`, [
                            `%${search_text}%`,
                        ])
                            .orWhereRaw(`LOWER(trabill_combined_clients.combine_mobile) LIKE ?`, [`%${search_text}%`]);
                    }
                });
            })
                .andWhere('quotations_org_agency', this.org_agency)
                .andWhere('quotation_is_deleted', 0)
                .orderBy('quotation_create_date', 'desc')
                .limit(size)
                .offset(page_number);
            const [{ row_count }] = yield this.query()
                .select(this.db.raw(`count(*) as row_count`))
                .from('trabill_quotations')
                .leftJoin('trabill_clients', 'trabill_clients.client_id', 'trabill_quotations.quotation_client_id')
                .leftJoin('trabill_combined_clients', {
                'trabill_combined_clients.combine_id': 'quotation_combined_id',
            })
                .modify((event) => {
                event
                    .andWhere('quotations_org_agency', this.org_agency)
                    .andWhere(function () {
                    if (from_date && to_date) {
                        this.andWhereRaw(`DATE_FORMAT(quotation_create_date,'%Y-%m-%d') BETWEEN ? AND ?`, [from_date, to_date]);
                    }
                    if (search_text) {
                        this.andWhereRaw(`LOWER(trabill_quotations.quotation_no) LIKE ?`, [`%${search_text}%`])
                            .orWhereRaw(`LOWER(trabill_clients.client_name) LIKE ?`, [
                            `%${search_text}%`,
                        ])
                            .orWhereRaw(`LOWER(trabill_combined_clients.combine_name) LIKE ?`, [`%${search_text}%`])
                            .orWhereRaw(`LOWER(trabill_clients.client_mobile) LIKE ?`, [
                            `%${search_text}%`,
                        ])
                            .orWhereRaw(`LOWER(trabill_combined_clients.combine_mobile) LIKE ?`, [`%${search_text}%`]);
                    }
                });
            })
                .andWhere('quotations_org_agency', this.org_agency)
                .andWhere('quotation_is_deleted', 0);
            return { count: row_count, data };
        });
    }
    viewQuotation(quotation_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const quotation = yield this.query()
                .select('quotation_id', this.db.raw('CASE WHEN quotation_client_id IS NOT NULL THEN CONCAT("client-",quotation_client_id) ELSE CONCAT("combined-",quotation_combined_id) END AS client_id'), 'client_name', 'client_mobile', 'client_email', 'client_address', 'client_lbalance', 'quotation_no', 'quotation_net_total', 'quotation_discount_total', 'quotation_date', 'quotation_note', 'billing_subtotal as subtotal', 'quotation_is_deleted', this.db.raw("concat(user_first_name, ' ', user_last_name) AS user_full_name"), 'country_name')
                .from('trabill_quotations')
                .leftJoin('trabill_clients', 'trabill_clients.client_id', 'trabill_quotations.quotation_client_id')
                .leftJoin('trabill_users', 'trabill_users.user_id', 'trabill_quotations.quotation_created_by')
                .leftJoin('trabill_quotations_billing_infos', 'trabill_quotations_billing_infos.billing_quotation_id', 'trabill_quotations.quotation_id')
                .leftJoin('trabill_countries', { country_id: 'billing_country_id' })
                .where('quotation_id', quotation_id)
                .andWhereNot('quotation_is_deleted', 1);
            let billInfo = [];
            billInfo = yield this.query()
                .select('product_id', 'billing_description as description', 'billing_quantity as quantity', 'billing_unit_price as unit_price', 'billing_product_total_price as total_price')
                .leftJoin('trabill_products', 'trabill_products.product_id', 'trabill_quotations_billing_infos.billing_product_id')
                .from('trabill_quotations_billing_infos')
                .where('billing_quotation_id', quotation_id)
                .where('billing_is_deleted', 0);
            return Object.assign(Object.assign({}, quotation[0]), (quotation[0].quotation_id && { billInfo }));
        });
    }
    viewBillInfos(quotation_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const billInfos = yield this.query()
                .select('product_name', 'billing_quotation_id', 'billing_description', 'billing_quantity', 'billing_unit_price', 'billing_subtotal', 'country_name')
                .leftJoin('trabill_products', 'trabill_products.product_id', 'trabill_quotations_billing_infos.billing_product_id')
                .leftJoin('trabill_countries', { country_id: 'billing_country_id' })
                .from('trabill_quotations_billing_infos')
                .where('billing_quotation_id', quotation_id)
                .where('billing_is_deleted', 0);
            return billInfos;
        });
    }
    getBilling(quotation_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const billInfos = yield this.query()
                .select('billing_invoice_id as invoices_id', 'billing_category_id as category_id')
                .from('trabill_quotations_billing_infos')
                .where('billing_quotation_id', quotation_id)
                .where('billing_is_deleted', 0);
            return billInfos;
        });
    }
}
exports.default = QuotationModel;
//# sourceMappingURL=quotation.models.js.map