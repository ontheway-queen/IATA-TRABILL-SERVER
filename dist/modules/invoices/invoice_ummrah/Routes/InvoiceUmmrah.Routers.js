"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_routers_1 = __importDefault(require("../../../../abstracts/abstract.routers"));
const InvoiceUmmrah_Controllers_1 = __importDefault(require("../Controllers/InvoiceUmmrah.Controllers"));
class InvoiceUmmrah extends abstract_routers_1.default {
    constructor() {
        super();
        this.controllers = new InvoiceUmmrah_Controllers_1.default();
        this.callRouter();
    }
    callRouter() {
        this.routers.get('/view/:invoice_id', this.controllers.viewInvoiceUmmrah);
        this.routers.put('/void/:invoice_id', this.controllers.voidInvoiceUmmrah);
        this.routers
            .route('/')
            .post(this.controllers.postInvoiceUmmrah)
            .get(this.controllers.getAllInvoiceUmmrah);
        this.routers.get('/billing_info/:invoice_id', this.controllers.getBillingInfo);
        this.routers.post('/refund', this.controllers.createUmmrahRefund);
        this.routers.get('/refund/:invoice_id', this.controllers.getUmmrahRefund);
        this.routers
            .route('/:invoice_id')
            .get(this.controllers.getDataForEdit)
            .patch(this.controllers.editInvoiceUmmrah)
            .delete(this.controllers.deleteInvoiceUmmrah);
    }
}
exports.default = InvoiceUmmrah;
//# sourceMappingURL=InvoiceUmmrah.Routers.js.map