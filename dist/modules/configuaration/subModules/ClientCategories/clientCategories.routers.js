"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_routers_1 = __importDefault(require("../../../../abstracts/abstract.routers"));
const clientCategories_controllers_1 = __importDefault(require("./clientCategories.controllers"));
class RoutersClientCategories extends abstract_routers_1.default {
    constructor() {
        super();
        this.controllersClientCategories = new clientCategories_controllers_1.default();
        this.callRouter();
    }
    callRouter() {
        this.routers.get('/', this.controllersClientCategories.getClientCategories);
        this.routers.post('/create', this.controllersClientCategories.createClientCategory);
        this.routers.get('/get-all', this.controllersClientCategories.getAllClientCategories);
        this.routers.delete('/delete/:category_id', this.controllersClientCategories.deleteClientCategoryById);
        this.routers.patch('/update/:category_id', this.controllersClientCategories.editClientCategoryById);
    }
}
exports.default = RoutersClientCategories;
//# sourceMappingURL=clientCategories.routers.js.map