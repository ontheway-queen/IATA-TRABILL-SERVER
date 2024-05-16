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
const abstract_models_1 = __importDefault(require("../../../../abstracts/abstract.models"));
const invoice_helpers_1 = require("../../../../common/helpers/invoice.helpers");
const customError_1 = __importDefault(require("../../../../common/utils/errors/customError"));
class InvoiceVisaModels extends abstract_models_1.default {
    constructor() {
        super(...arguments);
        this.getPrevVisaBilling = (invoiceId) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .from('trabill_invoice_visa_billing_infos')
                .select(this.db.raw('billing_quantity*billing_cost_price as total_cost_price'), 'billing_quantity', 'billing_vendor_id', 'billing_cost_price', 'billing_combined_id', 'billing_vtrxn_id as prevTrxnId')
                .where('billing_invoice_id', invoiceId)
                .andWhereNot('billing_is_deleted', 1);
            return data;
        });
        this.getViewBillingInfo = (inovice_id) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select('billing_id', this.db.raw('COALESCE(tv.vendor_name, tcc.combine_name) AS vendor_name'), 'billing_quantity', 'billing_unit_price', 'billing_subtotal', 'billing_cost_price', 'billing_profit', 'product_name', 'country_name', 'billing_delivery_date', 'billing_mofa_no', 'billing_okala_no', 'billing_visa_no', 'billing_status', 'type_name', 'billing_token')
                .from('trabill_invoice_visa_billing_infos')
                .leftJoin('trabill_combined_clients as tcc', {
                combine_id: 'billing_combined_id',
            })
                .leftJoin('trabill_vendors as tv', { vendor_id: 'billing_vendor_id' })
                .leftJoin('trabill_products', { product_id: 'billing_product_id' })
                .leftJoin('trabill_visa_types', { type_id: 'billing_visa_type_id' })
                .leftJoin('trabill_countries', {
                country_id: 'billing_visiting_country_id',
            })
                .where('billing_invoice_id', inovice_id)
                .andWhereNot('billing_is_deleted', 1);
            return data;
        });
        this.getPassportInfo = (invoiceId) => __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .select('passport_passport_no', 'passport_name', 'passport_mobile_no', 'passport_email', 'passport_date_of_birth', 'passport_date_of_issue', 'passport_date_of_expire')
                .from('trabill_invoice_visa_billing_passport_infos')
                .where('visapss_details_invoice_id', invoiceId)
                .rightJoin('trabill_passport_details', {
                passport_id: 'visapss_details_passport_id',
            })
                .andWhereNot('visapass_details_is_deleted', 1);
        });
        this.updateBillingStatus = (status, billing_vtrxn_id, billingId) => __awaiter(this, void 0, void 0, function* () {
            const success = yield this.query()
                .from('trabill_invoice_visa_billing_infos')
                .update({ billing_status: status, billing_vtrxn_id })
                .where('billing_id', billingId);
            if (!success) {
                throw new customError_1.default('Please provide valid billing id', 400, 'Invalid id');
            }
        });
        this.updateInvoiceClientTrxn = (invoice_cltrxn_id, invoiceId) => __awaiter(this, void 0, void 0, function* () {
            const success = yield this.query()
                .from('trabill_invoices')
                .update({ invoice_cltrxn_id })
                .where('invoice_id', invoiceId);
            if (!success) {
                throw new customError_1.default('Please provide valid billing id', 400, 'Invalid id');
            }
        });
        this.getPrevBillingApprovedAmount = (invoice_id) => __awaiter(this, void 0, void 0, function* () {
            const [{ total_amount }] = yield this.db('trabill_invoice_visa_billing_infos')
                .select(this.db.raw('sum(billing_subtotal) as total_amount'))
                .where('billing_status', 'Approved')
                .andWhere('billing_invoice_id', invoice_id);
            return total_amount || 0;
        });
        this.getVisaPassport = (invoiceId) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select('visapss_details_id', 'visapss_details_passport_id as passport_id')
                .from('trabill_invoice_visa_billing_passport_infos')
                .where('visapss_details_invoice_id', invoiceId)
                .andWhereNot('visapass_details_is_deleted', 1);
            return data;
        });
        this.getBillingInfo = (inovice_id) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select('billing_id', this.db.raw("CASE WHEN billing_vendor_id IS NOT NULL THEN CONCAT('vendor-',billing_vendor_id) ELSE CONCAT('combined-',billing_combined_id) END AS billing_comvendor"), this.db.raw('coalesce(vendor_name, combine_name) as vendor_name'), 'billing_delivery_date', 'billing_mofa_no', 'billing_okala_no', 'billing_visa_no', 'billing_quantity', 'billing_unit_price', 'billing_subtotal', 'billing_cost_price', 'billing_profit', 'billing_status', 'billing_token', 'billing_product_id', 'billing_visiting_country_id', 'billing_visa_type_id')
                .from('trabill_invoice_visa_billing_infos')
                .leftJoin('trabill_vendors', { vendor_id: 'billing_vendor_id' })
                .leftJoin('trabill_combined_clients', {
                combine_id: 'billing_combined_id',
            })
                .where('billing_invoice_id', inovice_id)
                .andWhereNot('billing_is_deleted', 1);
            return data;
        });
        this.insertVisaBilling = (data) => __awaiter(this, void 0, void 0, function* () {
            yield this.query().insert(data).into('trabill_invoice_visa_billing_infos');
        });
        this.updateVisaBilling = (data, billing_id) => __awaiter(this, void 0, void 0, function* () {
            return yield this.db('trabill_invoice_visa_billing_infos')
                .update(data)
                .where('billing_id', billing_id);
        });
        this.billingIsExist = (billing_id) => __awaiter(this, void 0, void 0, function* () {
            if (!billing_id) {
                return undefined;
            }
            const [data] = yield this.query()
                .select('billing_invoice_id', 'billing_vtrxn_id as prevTrxnId', this.db.raw(`CASE WHEN billing_vendor_id IS NOT NULL THEN CONCAT('vendor-', billing_vendor_id) ELSE CONCAT('combined-', billing_combined_id) END AS prevComvendor`), 'billing_vtrxn_id', 'billing_status')
                .from('trabill_invoice_visa_billing_infos')
                .where('billing_id', billing_id);
            return data;
        });
        this.insertVisaPassport = (data) => __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .insert(data)
                .into('trabill_invoice_visa_billing_passport_infos');
        });
        this.updateVisaPassport = (data, visapss_details_id) => __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update(data)
                .into('trabill_invoice_visa_billing_passport_infos')
                .where('visapss_details_id', visapss_details_id);
        });
    }
    getPrevBilling(billing_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select('billing_vendor_id as vendor_id', 'billing_combined_id as combined_id', 'billing_status', this.db.raw('billing_cost_price * billing_quantity as prev_cost_price'))
                .from('trabill_invoice_visa_billing_infos')
                .where('billing_id', billing_id);
            if ((0, invoice_helpers_1.isEmpty)(data)) {
                throw new customError_1.default('Cannot get previous billing info', 400, 'Invalid invoice id');
            }
            const billing_data = [
                Object.assign(Object.assign({}, data[0]), { prev_cost_price: Number(data[0].prev_cost_price) }),
            ];
            return billing_data;
        });
    }
    deleteVisaPassport(invoice_id, visapss_details_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update({ visapass_details_is_deleted: 1, visapss_details_deleted_by })
                .into('trabill_invoice_visa_billing_passport_infos')
                .where('visapss_details_invoice_id', invoice_id);
        });
    }
    deleteSignleVisaPassport(visapss_details_id, visapss_details_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update({ visapass_details_is_deleted: 1, visapss_details_deleted_by })
                .into('trabill_invoice_visa_billing_passport_infos')
                .where('visapss_details_id', visapss_details_id);
        });
    }
    deleteBillingInfo(invoice_id, billing_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update({ billing_is_deleted: 1, billing_deleted_by })
                .into('trabill_invoice_visa_billing_infos')
                .where('billing_invoice_id', invoice_id);
        });
    }
    deleteBillingSingleInfo(billing_id, billing_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!billing_id) {
                throw new customError_1.default('Please provide a valid ID', 400, 'Bad ID');
            }
            yield this.query()
                .update({ billing_is_deleted: 1, billing_deleted_by })
                .into('trabill_invoice_visa_billing_infos')
                .where('billing_id', billing_id);
        });
    }
    getPrevBillingByBillingId(billingId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select('billing_vendor_id as vendor_id', 'billing_combined_id as combined_id', 'billing_invoice_id as invoice_id', 'invoice_sales_date', this.db.raw('billing_cost_price * billing_quantity as prev_cost_price'), this.db.raw('billing_unit_price * billing_quantity as prev_sales_price'), this.db.raw(`CASE WHEN invoice_client_id IS NOT NULL THEN CONCAT('client-',invoice_client_id) ELSE CONCAT('combined-',invoice_combined_id) END AS comb_client`), this.db.raw(`CASE WHEN billing_vendor_id IS NOT NULL THEN CONCAT('vendor-',billing_vendor_id) ELSE CONCAT('combined-',billing_combined_id) END AS comb_vendor`))
                .from('trabill_invoice_visa_billing_infos')
                .leftJoin('trabill_invoices', { invoice_id: 'billing_invoice_id' })
                .where('billing_id', billingId);
            if ((0, invoice_helpers_1.isEmpty)(data)) {
                throw new customError_1.default('Cannot get previous billing info', 400, 'Invalid billing id');
            }
            const billing_data = [
                Object.assign(Object.assign({}, data[0]), { prev_cost_price: Number(data[0].prev_cost_price) }),
            ];
            return billing_data;
        });
    }
    getAllInvoiceVisa(page, size, search_text = '', from_date, to_date) {
        return __awaiter(this, void 0, void 0, function* () {
            size = Number(size);
            from_date
                ? (from_date = (0, moment_1.default)(new Date(from_date)).format('YYYY-MM-DD'))
                : null;
            to_date ? (to_date = (0, moment_1.default)(new Date(to_date)).format('YYYY-MM-DD')) : null;
            const offset = (Number(page) - 1) * size;
            const data = yield this.query()
                .select('*')
                .from('view_invoice_visalist')
                .modify((event) => {
                event
                    .where('invoice_org_agency', this.org_agency)
                    .andWhere(function () {
                    if (search_text) {
                        this.where('invoice_no', 'like', `%${search_text}%`)
                            .orWhere('client_name', 'like', `%${search_text}%`)
                            .orderByRaw('CASE WHEN invoice_no LIKE ? THEN 1 ELSE 2 END, invoice_no LIKE ? DESC', [`${search_text}%`, `%${search_text}%`]);
                    }
                    if (from_date && to_date) {
                        this.andWhereRaw('DATE_FORMAT(invoice_date,"%Y-%m-%d") BETWEEN ? AND ?', [from_date, to_date]);
                    }
                });
            })
                .andWhere('invoice_org_agency', this.org_agency)
                .limit(size)
                .offset(offset);
            const [{ count }] = yield this.db('view_invoice_visalist')
                .count('* as count')
                .modify((event) => {
                event
                    .where('invoice_org_agency', this.org_agency)
                    .andWhere(function () {
                    if (search_text) {
                        this.where('invoice_no', 'like', `%${search_text}%`)
                            .orWhere('client_name', 'like', `%${search_text}%`)
                            .orderByRaw('CASE WHEN invoice_no LIKE ? THEN 1 ELSE 2 END, invoice_no LIKE ? DESC', [`${search_text}%`, `%${search_text}%`]);
                    }
                    if (from_date && to_date) {
                        this.andWhereRaw('DATE_FORMAT(invoice_date,"%Y-%m-%d") BETWEEN ? AND ?', [from_date, to_date]);
                    }
                });
            })
                .andWhere('invoice_org_agency', this.org_agency);
            return { count, data };
        });
    }
}
exports.default = InvoiceVisaModels;
//# sourceMappingURL=invoiceVisa.models.js.map