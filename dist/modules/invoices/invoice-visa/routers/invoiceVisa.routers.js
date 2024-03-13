"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_routers_1 = __importDefault(require("../../../../abstracts/abstract.routers"));
const invoiceVisa_controllers_1 = __importDefault(require("../controllers/invoiceVisa.controllers"));
class InvoiceVisaRouters extends abstract_routers_1.default {
    constructor() {
        super();
        this.controllers = new invoiceVisa_controllers_1.default();
        this.callRouter();
    }
    callRouter() {
        this.routers.put('/void/:invoice_id', this.controllers.voidInvoiceVisa);
        this.routers
            .route('/')
            .post(this.controllers.addInvoiceVisa)
            .get(this.controllers.getAllInvoiceVisa);
        this.routers
            .route('/:invoice_id')
            .get(this.controllers.getForEdit)
            .patch(this.controllers.editInvoiceVisa)
            .delete(this.controllers.deleteInvoiceVisa);
        this.routers.patch('/status/:billing_id', this.controllers.updateBillingStatus);
        this.routers.get('/view/:invoice_id', this.controllers.viewInvoiceVisa);
    }
}
exports.default = InvoiceVisaRouters;
//# sourceMappingURL=invoiceVisa.routers.js.map