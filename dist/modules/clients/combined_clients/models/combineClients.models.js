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
const abstract_models_1 = __importDefault(require("../../../../abstracts/abstract.models"));
const customError_1 = __importDefault(require("../../../../common/utils/errors/customError"));
class CombineClientsModels extends abstract_models_1.default {
    constructor() {
        super(...arguments);
        this.updateCombineClientOpeningTrxnId = (combine_opening_trxn_id, combine_id) => __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .update({ combine_opening_trxn_id })
                .into('trabill_combined_clients')
                .where('combine_id', combine_id);
        });
        this.getCombineClientOpeningTrxnId = (combine_id) => __awaiter(this, void 0, void 0, function* () {
            const [combine] = yield this.query()
                .select('combine_opening_trxn_id')
                .from('trabill_combined_clients')
                .where('combine_id', combine_id);
            return Number(combine.combine_opening_trxn_id);
        });
        this.getCombinedLastBalance = (combined_id) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const client = (yield this.query()
                .select('combine_lbalance')
                .from('trabill_combined_clients')
                .where('combine_id', combined_id));
            if (!client.length) {
                throw new customError_1.default('Please provide valid client id', 400, 'Invalid client id');
            }
            const client_total_invoice = yield this.query()
                .from('trabill_invoices')
                .select(this.db.raw('sum(invoice_net_total) as client_total'))
                .where('invoice_combined_id', combined_id)
                .andWhereNot('invoice_is_deleted', 1);
            const client_total = Number((_a = client_total_invoice[0]) === null || _a === void 0 ? void 0 : _a.client_total);
            const client_pay_invoice = yield this.query()
                .from('trabill_invoice_client_payments')
                .select(this.db.raw('sum(invclientpayment_amount) as total_pay'))
                .where('invclientpayment_combined_id', combined_id)
                .andWhereNot('invclientpayment_is_deleted', 1);
            const client_pay = Number((_b = client_pay_invoice[0]) === null || _b === void 0 ? void 0 : _b.total_pay);
            return {
                client_invoice_total: client_total,
                client_prev_due: client_total - client_pay,
                client_last_balance: Number(client[0].combine_lbalance),
            };
        });
    }
    insertCombineClient(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = yield this.query()
                .insert(Object.assign(Object.assign({}, data), { combine_org_agency: this.org_agency }))
                .into('trabill_combined_clients');
            return id[0];
        });
    }
    getTraxn(combine_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [{ total }] = yield this.query()
                .from(`${this.trxn}.comb_trxn`)
                .count('* as total')
                .where('comtrxn_comb_id', combine_id)
                .andWhere('comtrxn_agency_id', this.org_agency)
                .andWhereNot('comtrxn_particular_id', 11)
                .andWhereNot('comtrxn_is_deleted', 1);
            return total;
        });
    }
    insertCombineClientProducts(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const combineProducts = yield this.query()
                .insert(data)
                .into('trabill_combine_products');
            return combineProducts;
        });
    }
    getAllCombines(is_deleted, page, size, search) {
        return __awaiter(this, void 0, void 0, function* () {
            const page_number = (page - 1) * size;
            const combined_client = yield this.query()
                .select('*')
                .from('view_all_combined_clients')
                .where('combine_is_deleted', is_deleted)
                .andWhere((builder) => {
                builder.where('combine_org_agency', this.org_agency).modify((event) => {
                    if (search && search !== 'all') {
                        event
                            .andWhere('view_all_combined_clients.combine_name', 'LIKE', `%${search}%`)
                            .orWhere('view_all_combined_clients.combine_mobile', 'LIKE', `%${search}%`)
                            .orWhere('view_all_combined_clients.combine_email', 'LIKE', `%${search}%`);
                    }
                });
            })
                .andWhere('combine_org_agency', this.org_agency)
                .limit(size)
                .offset(page_number);
            return combined_client;
        });
    }
    viewAllCombine(search) {
        return __awaiter(this, void 0, void 0, function* () {
            const combine = yield this.query()
                .select('combine_id', 'combine_name', 'combine_lbalance as last_balance')
                .from('trabill_combined_clients')
                .whereNot('combine_is_deleted', 1)
                .modify((event) => {
                if (search) {
                    event
                        .andWhere('combine_org_agency', this.org_agency)
                        .andWhere('combine_name', 'like', `%${search}%`)
                        .orWhere('combine_mobile', 'like', `%${search}%`);
                }
                else {
                    event.orderBy('combine_id', 'desc').limit(20);
                }
            })
                .andWhere('combine_org_agency', this.org_agency);
            return combine;
        });
    }
    countCombineDataRow(is_deleted, search) {
        return __awaiter(this, void 0, void 0, function* () {
            const [count] = yield this.query()
                .select(this.db.raw(`count(*) as row_count`))
                .from('view_all_combined_clients')
                .where('combine_is_deleted', is_deleted)
                .andWhere((builder) => {
                builder.where('combine_org_agency', this.org_agency).modify((event) => {
                    if (search && search !== 'all') {
                        event
                            .andWhere('view_all_combined_clients.combine_name', 'LIKE', `%${search}%`)
                            .orWhere('view_all_combined_clients.combine_mobile', 'LIKE', `%${search}%`)
                            .orWhere('view_all_combined_clients.combine_email', 'LIKE', `%${search}%`);
                    }
                });
            })
                .andWhere('combine_org_agency', this.org_agency);
            return count.row_count;
        });
    }
    getCombineClientExcelReport() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select('combine_id as id', 'combine_name as name', 'combine_mobile as mobile', 'combine_email as email', 'combine_address as address', 'combine_company_name as company_name', 'combine_lbalance as combine_amount', this.db.raw("concat(user_first_name, ' ', user_last_name) AS created_by"), this.db.raw(`CASE WHEN combine_client_status = 1 THEN 'Active' WHEN combine_client_status = 0 THEN 'Inactive' END AS status`))
                .from('trabill_combined_clients')
                .leftJoin('trabill_users', { user_id: 'combine_create_by' })
                .where('combine_org_agency', this.org_agency)
                .whereNot('combine_is_deleted', 1)
                .orderBy('combine_id', 'desc');
            return data;
        });
    }
    getSingleCombinedClient(combine_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select('combine_id', 'combine_category_id', 'combine_name', 'combine_mobile', 'combine_email', 'combine_address', 'combine_company_name', 'combine_gender', 'combine_designation', 'trabill_combined_clients.combine_credit_limit', 'combine_commission_rate', 'combine_lbalance as combine_lastbalance_amount', 'combine_client_status', 'combine_opening_trxn.comtrxn_amount AS combine_opening_balance', this.db.raw(`CASE WHEN combine_opening_trxn.comtrxn_type = 'DEBIT' THEN 'due' WHEN combine_opening_trxn.comtrxn_type = 'CREDIT' THEN 'advance'  ELSE NULL END AS opening_balance_type`))
                .from('trabill_combined_clients')
                .leftJoin(`${this.trxn}.comb_trxn as combine_opening_trxn`, {
                'combine_opening_trxn.comtrxn_id': 'trabill_combined_clients.combine_opening_trxn_id',
            })
                .leftJoin('trabill_users', { user_id: 'combine_create_by' })
                .where('combine_id', combine_id);
            return data[0];
        });
    }
    getCombinePrevProductsId(combine_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const products = yield this.query()
                .select('cproduct_product_id')
                .from('trabill_combine_products')
                .where('cproduct_combine_id', combine_id)
                .andWhereNot('cproduct_is_deleted', 1);
            if (products.length) {
                const data = products === null || products === void 0 ? void 0 : products.map((item) => {
                    return item.cproduct_product_id;
                });
                return data;
            }
            return [];
        });
    }
    getCombineClientName(combine_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select('combine_name')
                .from('trabill_combined_clients')
                .where('combine_id', combine_id);
            if (data[0]) {
                const combineInfo = data[0].combine_name;
                return combineInfo;
            }
        });
    }
    getClientLastBalanceById(client_id, combine_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const balance = (yield this.query()
                .select('combine_lbalance AS last_balance')
                .from('trabill_combined_clients')
                .where('combine_id', combine_id)
                .unionAll([
                this.db
                    .select('client_lbalance AS last_balance')
                    .from('trabill_clients')
                    .where('client_id', client_id),
            ]));
            if (balance.length) {
                return Number(balance[0].last_balance);
            }
            else {
                throw new customError_1.default('Please provide a valid client Id', 400, 'Invalid client Id');
            }
        });
    }
    updateClientStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .update('combine_client_status', status)
                .from('trabill_combined_clients')
                .where('combine_client_status', status === 1 ? 0 : 1)
                .where('combine_id', id)
                .andWhere('combine_org_agency', this.org_agency);
            if (data === 0) {
                throw new customError_1.default('Please provide a valid combined id', 400, 'Invalid id');
            }
            return data;
        });
    }
    updateCombineInformation(id, update_information) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .into('trabill_combined_clients')
                .update(update_information)
                .where('combine_id', id);
            return data;
        });
    }
    deletePreviousProduct(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .update({ cproduct_is_deleted: 1 })
                .into('trabill_combine_products')
                .where('cproduct_combine_id', id);
            return data;
        });
    }
    deleteCombineClients(combine_id, delete_by) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.raw("call deleteAccountByType('COMBINED', ?, ?);", [
                delete_by,
                combine_id,
            ]);
        });
    }
}
exports.default = CombineClientsModels;
//# sourceMappingURL=combineClients.models.js.map