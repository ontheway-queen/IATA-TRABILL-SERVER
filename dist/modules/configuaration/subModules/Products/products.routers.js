"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_routers_1 = __importDefault(require("../../../../abstracts/abstract.routers"));
const products_controllers_1 = __importDefault(require("./products.controllers"));
class RoutersProducts extends abstract_routers_1.default {
    constructor() {
        super();
        this.controllersProducts = new products_controllers_1.default();
        this.callRouter();
    }
    callRouter() {
        this.routers.get('/', this.controllersProducts.viewProducts);
        this.routers.post('/create', this.controllersProducts.createProduct);
        this.routers.post('/create-category', this.controllersProducts.createProductCategory);
        this.routers.get('/get-all', this.controllersProducts.getAllProducts);
        this.routers.get('/get/:id', this.controllersProducts.viewProductsById);
        this.routers.get('/category/get-all', this.controllersProducts.getAllProductCategory);
        this.routers.get('/category/get/:id', this.controllersProducts.getOneProductCategory);
        this.routers.patch('/edit-product/:id', this.controllersProducts.editProducts);
        this.routers.patch('/edit-product-category/:id', this.controllersProducts.editProductCategory);
        this.routers.delete('/delete-product-category/:category_id', this.controllersProducts.deleteProductCategory);
        this.routers.delete('/delete-product/:product_id', this.controllersProducts.deleteProduct);
    }
}
exports.default = RoutersProducts;
//# sourceMappingURL=products.routers.js.map