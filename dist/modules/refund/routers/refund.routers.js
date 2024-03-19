"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_routers_1 = __importDefault(require("../../../abstracts/abstract.routers"));
const refund_controllers_1 = __importDefault(require("../controllers/refund.controllers"));
class RefundRouter extends abstract_routers_1.default {
    constructor() {
        super();
        this.controllers = new refund_controllers_1.default();
        this.callRouter();
    }
    callRouter() {
        // air ticket refund
        this.routers
            .route('/air-ticket-refund')
            .post(this.controllers.addAirTicketRefund)
            .get(this.controllers.getAllAirTicketRefund);
        this.routers
            .route('/air-ticket-refund/:refund_id')
            .delete(this.controllers.deleteAirTicketRefund)
            .get(this.controllers.singleAirTicketRefund);
        this.routers.get('/iat-description/:refund_id', this.controllers.getRefundDescription);
        this.routers.post('/ticket-infos', this.controllers.airTicketInfos);
        this.routers.get('/ticket-no/:id', this.controllers.getTicketNo);
        // client refund
        this.routers.get('/other-refund-client/:client_id', this.controllers.invoiceOtherByClient);
        this.routers.get('/other-billing-info/:invoice_id', this.controllers.getBillingInfo);
        // Other refund
        this.routers
            .route('/other-refund')
            .post(this.controllers.addOtherRefund)
            .get(this.controllers.getAllRefunds);
        this.routers
            .route('/other-refund/:refund_id')
            .get(this.controllers.singleOtherRefund)
            .delete(this.controllers.deleteOtherRefund);
        // PERSIAL REFUND
        this.routers
            .route('/persial-refund')
            .post(this.controllers.addPersialRefund)
            .get(this.controllers.getPersialRefund);
        this.routers
            .route('/persial-refund/:refund_id')
            .delete(this.controllers.deletePersialRefund)
            .get(this.controllers.getSinglePersialRefund);
        this.routers.get('/persial-refundable-ticket/:comb_client', this.controllers.getPersialRefundTickets);
        this.routers.post('/get_partial_refund_info', this.controllers.getPertialAirticketInfo);
        this.routers.get('/get_pertial_ticket_by_invoice/:invoice_id', this.controllers.getPersialRefundTicketsByInvoice);
        // vendor refund
        this.routers.get('/other-refund/vendor/:vendor_id', this.controllers.invoiceOtherByVendor);
        this.routers.get('/other-refund-info/vendor/:vendor_id', this.controllers.getRefundInfoVendor);
        // tour refund
        this.routers.get('/invoice-tour/:client', this.controllers.getTourInvoice);
        this.routers
            .route('/invoice-tour-refund')
            .post(this.controllers.addTourPackRefund)
            .get(this.controllers.getAllTourPackRefund);
        this.routers
            .route('/invoice-tour-refund/:refund_id')
            .delete(this.controllers.delteTourPackRefund)
            .get(this.controllers.viewTourForEdit);
    }
}
exports.default = RefundRouter;
//# sourceMappingURL=refund.routers.js.map