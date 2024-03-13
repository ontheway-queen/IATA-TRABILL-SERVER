"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_routers_1 = __importDefault(require("../../../../abstracts/abstract.routers"));
const InvoiceHajj_Controllers_1 = __importDefault(require("../Controllers/InvoiceHajj.Controllers"));
class InvoiceHajjRouters extends abstract_routers_1.default {
    constructor() {
        super();
        this.controllers = new InvoiceHajj_Controllers_1.default();
        this.callRouter();
    }
    callRouter() {
        this.routers.get('/all/:id', this.controllers.getAllInvoiceHajj);
        this.routers.get('/view/:id', this.controllers.viewInvoiceHajj);
        this.routers.put('/void/:invoice_id', this.controllers.voidInvoiceHajj);
        this.routers.get('/billing_info/:invoice_id', this.controllers.getHajjInfo);
        this.routers.route('/refund').post(this.controllers.createHajjRefund);
        this.routers.get('/refund/:invoice_id', this.controllers.getHajjInvoiceRefund);
        this.routers.post('/post', this.controllers.postInvoiceHajj);
        this.routers.patch('/edit/:id', this.controllers.editInvoiceHajj);
        this.routers.delete('/:type/:invoice_id', this.controllers.deleteInvoiceHajj);
        this.routers.get('/get-for-edit/:id', this.controllers.getDataForEdit);
    }
}
exports.default = InvoiceHajjRouters;
//# sourceMappingURL=InvoiceHajj.Routes.js.map