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
const abstract_services_1 = __importDefault(require("../../../../abstracts/abstract.services"));
const customError_1 = __importDefault(require("../../../../common/utils/errors/customError"));
class ServicesProducts extends abstract_services_1.default {
    constructor() {
        super();
        this.createProduct = (req) => __awaiter(this, void 0, void 0, function* () {
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const insert = yield this.models.configModel
                    .productsModel(req, trx)
                    .createProduct(req.body);
                const product = yield this.models.configModel
                    .productsModel(req, trx)
                    .getProduct(insert);
                return {
                    success: true,
                    message: 'product category created successfully',
                    data: product[0],
                };
            }));
        });
        this.createProductCategory = (req) => __awaiter(this, void 0, void 0, function* () {
            yield this.models.configModel
                .productsModel(req)
                .createProductCategory(req.body);
            return { success: true, message: 'product category created successfully' };
        });
        this.viewProducts = (req) => __awaiter(this, void 0, void 0, function* () {
            const { page, size } = req.query;
            const data = yield this.models.configModel
                .productsModel(req)
                .viewProducts(Number(page) || 1, Number(size) || 20);
            const count = yield this.models.configModel
                .productsModel(req)
                .countProductsDataRow();
            return { success: true, count, data };
        });
        this.getAllProducts = (req) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.models.configModel
                .productsModel(req)
                .getAllProducts();
            return { success: true, products: data };
        });
        this.viewProductsById = (req) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const data = yield this.models.configModel
                .productsModel(req)
                .getProductById(id);
            return { success: true, products: data[0] };
        });
        this.getAllProductCategory = (req) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.models.configModel
                .productsModel(req)
                .getAllProductCategories();
            return { success: true, products: data };
        });
        this.getOneProductCategory = (req) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const data = yield this.models.configModel
                .productsModel(req)
                .getOneProductCategory(id);
            return { success: true, products: data[0] };
        });
        this.editProducts = (req) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const data = yield this.models.configModel
                .productsModel(req)
                .editProduct(req.body, id);
            if (data) {
                return {
                    success: true,
                    message: 'product updated successfully',
                    data: data,
                };
            }
            else {
                throw new customError_1.default('Please provide a valid Id', 400, 'Bad request');
            }
        });
        this.editProductCategory = (req) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const data = yield this.models.configModel
                .productsModel(req)
                .editProductCategory(req.body, id);
            if (data) {
                return {
                    success: true,
                    message: 'product category updated successfully',
                    data: data,
                };
            }
            else {
                throw new customError_1.default('Please provide a valid Id', 400, 'Bad request');
            }
        });
        this.deleteProductCategory = (req) => __awaiter(this, void 0, void 0, function* () {
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { category_id } = req.params;
                const { deleted_by } = req.body;
                const data = yield this.models.configModel
                    .productsModel(req, trx)
                    .deleteProductCategory(category_id);
                yield this.models.configModel
                    .productsModel(req, trx)
                    .deleteProductByCategoryId(category_id);
                return { success: true, data: data };
            }));
        });
        this.deleteProducts = (req) => __awaiter(this, void 0, void 0, function* () {
            const { product_id } = req.params;
            const { deleted_by } = req.body;
            const data = yield this.models.configModel
                .productsModel(req)
                .deleteProductById(product_id, deleted_by);
            return { success: true, data };
        });
    }
}
exports.default = ServicesProducts;
//# sourceMappingURL=products.services.js.map