"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_routers_1 = __importDefault(require("../../../../abstracts/abstract.routers"));
const invoiceReissue_controllers_1 = __importDefault(require("../controllers/invoiceReissue.controllers"));
class ReIssueAirticketRoutes extends abstract_routers_1.default {
    constructor() {
        super();
        this.controllers = new invoiceReissue_controllers_1.default();
        this.callRouter();
    }
    callRouter() {
        this.routers.put('/void/:invoice_id', this.controllers.voidReissue);
        // GET REISSUE TICKET INFO FOR REFUND REISSUE
        this.routers.get('/ticket-info/:invoice_id', this.controllers.getReissueTicketInfo);
        this.routers.post('/refund', this.controllers.reissueRefund);
        this.routers.get('/refund/:invoice_id', this.controllers.getReissueRefundInfo);
        this.routers.post('/post/existing', this.controllers.addExistingClient);
        this.routers.get('/view/:invoice_id', this.controllers.viewReissue);
        this.routers.get('/existing-client/:client_id', this.controllers.getExistingClientAirticket);
        this.routers.patch('/existing-edit/:invoice_id', this.controllers.editExistingCl);
        this.routers
            .route('/')
            .post(this.controllers.addReissueAirticket)
            .get(this.controllers.getAllReissue);
        this.routers
            .route('/:invoice_id')
            .get(this.controllers.getDataForEdit)
            .patch(this.controllers.editReissueAirticket)
            .delete(this.controllers.deleteReissue);
    }
}
exports.default = ReIssueAirticketRoutes;
//# sourceMappingURL=invoiceReissue.routers.js.map