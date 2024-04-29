"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_routers_1 = __importDefault(require("../../../../abstracts/abstract.routers"));
const invoiceOther_controllers_1 = __importDefault(require("../controllers/invoiceOther.controllers"));
class InivoiceOtherRouters extends abstract_routers_1.default {
    constructor() {
        super();
        this.controllers = new invoiceOther_controllers_1.default();
        this.callRouter();
    }
    callRouter() {
        this.routers.get('/all', this.controllers.getAllInvoiceOther);
        this.routers.get('/view/:id', this.controllers.viewInvoiceOther);
        this.routers.post('/post', this.controllers.postInvoiceOther);
        this.routers.get('/transport-type', this.controllers.getTransportType);
        this.routers.get('/refund-others/:id', this.controllers.getAllInvoiceOthersByClientId);
        this.routers.get('/view/invoice-all-data-by-id/:id', this.controllers.getForEdit);
        this.routers.patch('/edit/:id', this.controllers.editInvoiceOther);
        this.routers.delete('/delete/:invoice_id', this.controllers.deleteInvoiceOther);
    }
}
exports.default = InivoiceOtherRouters;
//# sourceMappingURL=invoiceOther.routers.js.map