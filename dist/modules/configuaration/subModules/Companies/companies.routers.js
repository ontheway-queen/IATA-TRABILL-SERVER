"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_routers_1 = __importDefault(require("../../../../abstracts/abstract.routers"));
const companies_controllers_1 = __importDefault(require("./companies.controllers"));
class RoutersCompanies extends abstract_routers_1.default {
    constructor() {
        super();
        this.controllersCompanies = new companies_controllers_1.default();
        this.callRouter();
    }
    callRouter() {
        this.routers.get('/', this.controllersCompanies.viewCompanies);
        this.routers.post('/create', this.controllersCompanies.createControllerCompanies);
        this.routers.get('/view-all', this.controllersCompanies.getAllCompanies);
        this.routers.patch('/update/:company_id', this.controllersCompanies.updateControllerCompanies);
        this.routers.delete('/delete/:company_id', this.controllersCompanies.deleteControllerCompanies);
    }
}
exports.default = RoutersCompanies;
//# sourceMappingURL=companies.routers.js.map