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
const abstract_models_1 = __importDefault(require("../../../abstracts/abstract.models"));
const moment_1 = __importDefault(require("moment"));
class QuotationModel extends abstract_models_1.default {
    constructor() {
        super(...arguments);
        this.confirmQuotation = (quotationId) => __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update('quotation_is_confirm', 1)
                .into('trabill_quotations')
                .where('quotation_id', quotationId);
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
                .select('quotation_id', this.db.raw(`COALESCE(client_name, company_name, combine_name) as client_name`), this.db.raw(`COALESCE(client_mobile, company_contact_no, combine_mobile) as client_mobile`), 'quotation_no', 'quotation_net_total', 'quotation_discount_total', 'quotation_date', 'quotation_note', 'quotation_is_confirm', 'quotation_is_deleted')
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
}
exports.default = QuotationModel;
//# sourceMappingURL=quotation.models.js.map