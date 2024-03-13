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
class ClientCategoryModel extends abstract_models_1.default {
    createClientCategory(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const clientCategory = yield this.query()
                .insert(Object.assign(Object.assign({}, data), { category_org_agency: this.org_agency }))
                .into('trabill_client_categories');
            return clientCategory[0];
        });
    }
    getAllClientCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            const by_clients = yield this.query()
                .select('category_id', 'category_title', 'category_prefix', 'category_org_agency as agency_id')
                .from('trabill_client_categories')
                .where('category_org_agency', this.org_agency)
                .where('category_is_deleted', 0);
            const by_default = yield this.query()
                .select('category_id', 'category_title', 'category_prefix', 'category_org_agency as agency_id')
                .from('trabill_client_categories')
                .where('category_org_agency', null)
                .where('category_is_deleted', 0);
            return [...by_clients, ...by_default];
        });
    }
    getClientCategories(page, size) {
        return __awaiter(this, void 0, void 0, function* () {
            const page_number = (page - 1) * size;
            const getData = (agency) => {
                return this.query()
                    .select('category_id', 'category_title', 'category_prefix', 'category_org_agency as agency_id', 'category_is_deleted')
                    .from('trabill_client_categories')
                    .where('category_is_deleted', 0)
                    .andWhere('category_org_agency', agency)
                    .limit(size)
                    .offset(page_number);
            };
            const defaultData = yield getData(null);
            const agencyData = yield getData(this.org_agency);
            return [...agencyData, ...defaultData];
        });
    }
    countClientCategory() {
        return __awaiter(this, void 0, void 0, function* () {
            const [count] = yield this.query()
                .select(this.db.raw(`count(*) as row_count`))
                .from('trabill_client_categories')
                .where('category_org_agency', null)
                .orWhere('category_org_agency', this.org_agency)
                .where('category_is_deleted', 0);
            return count.row_count;
        });
    }
    clients(category_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .select('client_id')
                .from('trabill_clients')
                .where('client_category_id', category_id)
                .andWhereNot('client_is_deleted', 1);
        });
    }
    deleteClientCategory(category_id, category_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .into('trabill_client_categories')
                .update({ category_is_deleted: 1, category_deleted_by })
                .where('category_id', category_id);
        });
    }
    editClientCategory(data, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .into('trabill_client_categories')
                .update(data)
                .where('trabill_client_categories.category_id', id);
        });
    }
}
exports.default = ClientCategoryModel;
//# sourceMappingURL=clientCategories.model.js.map