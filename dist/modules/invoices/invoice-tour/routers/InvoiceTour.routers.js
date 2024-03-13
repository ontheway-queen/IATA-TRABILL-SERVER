"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_routers_1 = __importDefault(require("../../../../abstracts/abstract.routers"));
const InvoiceTour_controllers_1 = __importDefault(require("../controllers/InvoiceTour.controllers"));
class InvoiceTourRouters extends abstract_routers_1.default {
    constructor() {
        super();
        this.controllers = new InvoiceTour_controllers_1.default();
        this.callRouter();
    }
    callRouter() {
        this.routers.put('/void/:invoice_id', this.controllers.voidInvoiceTour);
        this.routers.get('/costing/:invoice_id', this.controllers.viewITourPackage);
        this.routers.get('/tour/billing/:invoice_id', this.controllers.getTourBillingInfo);
        this.routers.get('/view/:invoice_id', this.controllers.viewITourPackage);
        this.routers.post('/costing/add/:invoice_id', this.controllers.addCostingTourPackage);
        this.routers
            .route('/')
            .post(this.controllers.createInvoiceTour)
            .get(this.controllers.getAllInvoiceTour);
        this.routers
            .route('/:invoice_id')
            .get(this.controllers.getForEdit)
            .patch(this.controllers.editInvoiceTour)
            .delete(this.controllers.deleteResetInvoiceTour);
    }
}
exports.default = InvoiceTourRouters;
//# sourceMappingURL=InvoiceTour.routers.js.map