"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_routers_1 = __importDefault(require("../../../../abstracts/abstract.routers"));
const agency_controllers_1 = __importDefault(require("./agency.controllers"));
class RoutersAgency extends abstract_routers_1.default {
    constructor() {
        super();
        this.controllersAgency = new agency_controllers_1.default();
        this.callRouter();
    }
    callRouter() {
        this.routers.get('/', this.controllersAgency.viewAgencies);
        this.routers.post('/create', this.controllersAgency.createControllerAgency);
        this.routers.get('/view-all', this.controllersAgency.getAgencies);
        this.routers.patch('/update/:agency_id', this.controllersAgency.updateControllerAgency);
        this.routers.delete('/delete/:agency_id', this.controllersAgency.deleteControllerAgency);
    }
}
exports.default = RoutersAgency;
//# sourceMappingURL=agency.routers.js.map