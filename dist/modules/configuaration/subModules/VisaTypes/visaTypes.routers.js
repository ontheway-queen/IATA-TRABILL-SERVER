"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_routers_1 = __importDefault(require("../../../../abstracts/abstract.routers"));
const visaTypes_controllers_1 = __importDefault(require("./visaTypes.controllers"));
class RoutersVisaTypes extends abstract_routers_1.default {
    constructor() {
        super();
        this.controllersVisaTypes = new visaTypes_controllers_1.default();
        this.callRouter();
    }
    callRouter() {
        this.routers.get('/', this.controllersVisaTypes.viewVisaType);
        this.routers.post('/create', this.controllersVisaTypes.createVisaType);
        this.routers.get('/view-all', this.controllersVisaTypes.getAllVisaType);
        this.routers.patch('/edit/:id', this.controllersVisaTypes.editVisaType);
        this.routers.delete('/delete/:type_id', this.controllersVisaTypes.deleteVisaType);
    }
}
exports.default = RoutersVisaTypes;
//# sourceMappingURL=visaTypes.routers.js.map