"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_routers_1 = __importDefault(require("../../../../abstracts/abstract.routers"));
const invoiceNonCommission_controllers_1 = __importDefault(require("../controllers/invoiceNonCommission.controllers"));
class InvoiceNonCommission extends abstract_routers_1.default {
    constructor() {
        super();
        this.controllers = new invoiceNonCommission_controllers_1.default();
        this.callRouter();
    }
    callRouter() {
        this.routers
            .route('/')
            .post(this.controllers.addInvoiceNonCommission)
            .get(this.controllers.getAllInvoices);
        this.routers
            .route('/:invoice_id')
            .patch(this.controllers.editInvoiceNonCommission)
            .get(this.controllers.getDataForEdit)
            .delete(this.controllers.deleteNonComInvoice);
        this.routers.get('/view/:id', this.controllers.viewNoncommissioinDetails);
    }
}
exports.default = InvoiceNonCommission;
//# sourceMappingURL=invoiceNonCommission.routers.js.map