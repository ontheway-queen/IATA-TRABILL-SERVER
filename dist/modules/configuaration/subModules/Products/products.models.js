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
class ProductsModel extends abstract_models_1.default {
    createProduct(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield this.query()
                .insert(Object.assign(Object.assign({}, data), { product_org_agency: this.org_agency }))
                .into('trabill_products');
            return product[0];
        });
    }
    createProductCategory(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield this.query()
                .insert(Object.assign(Object.assign({}, data), { category_org_agency: this.org_agency }))
                .into('trabill_product_categories');
            return product[0];
        });
    }
    getProduct(product_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .select('product_id', 'product_name', 'product_status', 'trabill_product_categories.category_title')
                .from('trabill_products')
                .where({ product_id })
                .andWhereNot('products_is_deleted', 1)
                .leftJoin('trabill_product_categories', {
                category_id: 'product_category_id',
            });
        });
    }
    viewProducts(page, size) {
        return __awaiter(this, void 0, void 0, function* () {
            const page_number = (page - 1) * size;
            return yield this.query()
                .select('product_id', 'product_name', 'product_status', 'product_category_id', 'trabill_product_categories.category_title', 'product_org_agency as agency_id', 'products_is_deleted')
                .from('trabill_products')
                .leftJoin('trabill_product_categories', {
                'trabill_product_categories.category_id': 'trabill_products.product_category_id',
            })
                .where('product_org_agency', this.org_agency)
                .whereNot('products_is_deleted', 1)
                .orWhere('product_org_agency', null)
                .orderBy('product_id', 'desc')
                .limit(size)
                .offset(page_number);
        });
    }
    countProductsDataRow() {
        return __awaiter(this, void 0, void 0, function* () {
            const [count] = yield this.query()
                .select(this.db.raw(`count(*) as row_count`))
                .from('trabill_products')
                .whereNot('products_is_deleted', 1)
                .andWhere('product_org_agency', null)
                .orWhere('product_org_agency', this.org_agency);
            return count.row_count;
        });
    }
    getAllProducts() {
        return __awaiter(this, void 0, void 0, function* () {
            const by_clients = yield this.query()
                .select('product_id', 'product_name', 'product_status', 'product_category_id', 'trabill_product_categories.category_title', 'product_org_agency as agency_id')
                .from('trabill_products')
                .leftJoin('trabill_product_categories', {
                'trabill_product_categories.category_id': 'trabill_products.product_category_id',
            })
                .where('product_org_agency', this.org_agency)
                .whereNot('products_is_deleted', 1)
                .orderBy('product_name');
            const by_default = yield this.query()
                .select('product_id', 'product_name', 'product_status', 'product_category_id', 'trabill_product_categories.category_title', 'product_org_agency as agency_id')
                .from('trabill_products')
                .leftJoin('trabill_product_categories', {
                'trabill_product_categories.category_id': 'trabill_products.product_category_id',
            })
                .where('product_org_agency', null)
                .whereNot('products_is_deleted', 1)
                .orderBy('product_name');
            return [...by_default, ...by_clients];
        });
    }
    getProductById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .select('*')
                .from('trabill_products')
                .where('trabill_products.product_id', id)
                .andWhereNot('products_is_deleted', 1);
        });
    }
    getAllProductCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            const by_clients = yield this.query()
                .select('category_id', 'category_title', 'category_org_agency as agency_id')
                .from('trabill_product_categories')
                .where('category_org_agency', this.org_agency)
                .andWhereNot('category_is_deleted', 1);
            const by_default = yield this.query()
                .select('category_id', 'category_title', 'category_org_agency as agency_id')
                .from('trabill_product_categories')
                .where('category_org_agency', null)
                .andWhereNot('category_is_deleted', 1);
            return [...by_clients, ...by_default];
        });
    }
    getOneProductCategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .select('category_id', 'category_title', 'category_org_agency as agency_id')
                .from('trabill_product_categories')
                .where('trabill_product_categories.category_id', id);
        });
    }
    editProduct(data, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .from('trabill_products')
                .update(data)
                .where('trabill_products.product_id', id);
        });
    }
    editProductCategory(data, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .update('trabill_product_categories')
                .update(data)
                .where('trabill_product_categories.category_id', id);
        });
    }
    deleteProductCategory(category_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .into('trabill_product_categories')
                .update('category_is_deleted', 1)
                .where('category_id', category_id);
        });
    }
    deleteProductByCategoryId(category_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .from('trabill_products')
                .update('products_is_deleted', 1)
                .where('product_category_id', category_id)
                .whereNot('products_is_deleted', 1)
                .andWhereNot('product_org_agency', null);
        });
    }
    deleteProductById(product_id, product_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .from('trabill_products')
                .update({ products_is_deleted: 1, product_deleted_by })
                .where('product_id', product_id)
                .andWhereNot('product_org_agency', null);
            if (data) {
                return data;
            }
            else {
                throw new customError_1.default(`You can't delete this product`, 400, 'Bad request');
            }
        });
    }
}
exports.default = ProductsModel;
//# sourceMappingURL=products.models.js.map