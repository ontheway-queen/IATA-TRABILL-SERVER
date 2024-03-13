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
const abstract_controllers_1 = __importDefault(require("../../../../abstracts/abstract.controllers"));
const products_services_1 = __importDefault(require("./products.services"));
const products_validators_1 = __importDefault(require("./products.validators"));
class ControllersProducts extends abstract_controllers_1.default {
    constructor() {
        super();
        this.servicesProducts = new products_services_1.default();
        this.validator = new products_validators_1.default();
        this.createProduct = this.assyncWrapper.wrap(this.validator.createProducts, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesProducts.createProduct(req);
            if (data.success) {
                res
                    .status(201)
                    .json({ success: true, message: data.message, data: data.data });
            }
            else {
                this.error('add product controller');
            }
        }));
        this.createProductCategory = this.assyncWrapper.wrap(this.validator.createProductCategory, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesProducts.createProductCategory(req);
            if (data.success) {
                res.status(201).json({ success: true, message: data.message });
            }
            else {
                this.error('add product controller');
            }
        }));
        this.viewProducts = this.assyncWrapper.wrap(this.validator.editProductCategory, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesProducts.viewProducts(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else
                this.error();
        }));
        this.getAllProducts = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesProducts.getAllProducts(req);
            if (data.success) {
                res.status(200).json({ success: true, data: data.products });
            }
            else
                this.error();
        }));
        this.viewProductsById = this.assyncWrapper.wrap(this.validator.readProduct, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesProducts.viewProductsById(req);
            if (data.success) {
                res.status(200).json({ success: true, data: data.products });
            }
            else
                this.error();
        }));
        this.getOneProductCategory = this.assyncWrapper.wrap(this.validator.readProduct, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesProducts.getOneProductCategory(req);
            if (data.success) {
                res.status(200).json({ success: true, data: data.products });
            }
            else
                this.error();
        }));
        this.getAllProductCategory = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesProducts.getAllProductCategory(req);
            if (data.success) {
                res.status(200).json({ success: true, data: data.products });
            }
            else
                this.error();
        }));
        this.editProducts = this.assyncWrapper.wrap(this.validator.editProducts, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesProducts.editProducts(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else
                this.error();
        }));
        this.editProductCategory = this.assyncWrapper.wrap(this.validator.editProductCategory, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesProducts.editProductCategory(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else
                this.error();
        }));
        this.deleteProductCategory = this.assyncWrapper.wrap(this.validator.deleteProduct, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesProducts.deleteProductCategory(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else
                this.error();
        }));
        this.deleteProduct = this.assyncWrapper.wrap(this.validator.deleteProduct, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesProducts.deleteProducts(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else
                this.error();
        }));
    }
}
exports.default = ControllersProducts;
//# sourceMappingURL=products.controllers.js.map