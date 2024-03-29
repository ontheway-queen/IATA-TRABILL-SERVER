"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_routers_1 = __importDefault(require("../../../../abstracts/abstract.routers"));
const invoiceAirticket_controllers_1 = __importDefault(require("../controllers/invoiceAirticket.controllers"));
class InvoiceAirTicketRouter extends abstract_routers_1.default {
    constructor() {
        super();
        this.controllers = new invoiceAirticket_controllers_1.default();
        this.callRouter();
    }
    callRouter() {
        this.routers.get('/pnr-details/:pnr', this.controllers.pnrDetails);
        this.routers.get('/all-invoiceno-and-id', this.controllers.getAllInvoicesNumAndId);
        this.routers.get('/client-due/:id', this.controllers.getClientDue);
        this.routers.get('/is-exist/:ticket', this.controllers.isTicketAlreadyExist);
        this.routers.get('/view-invoice-activity/:id', this.controllers.getInvoiceAcitivity);
        // ========= INVOICE AIRTICKET ==============
        this.routers.get('/invoice-details-for-void/:invoice_id', this.controllers.getInvoiceInfoForVoid);
        this.routers.put('/void/:invoice_id', this.controllers.voidInvoiceAirticket);
        this.routers
            .route('/')
            .post(this.controllers.postInvoiceAirticket)
            .get(this.controllers.getAllInvoices);
        this.routers
            .route('/:invoice_id')
            .get(this.controllers.getDataForEdit)
            .patch(this.controllers.eidtInvioceAirticket)
            .delete(this.controllers.deleteInvoiceAirTicket);
        this.routers.get('/view/:invoice_id', this.controllers.viewCommonInvoiceDetails);
        this.routers.post('/send-email/:invoice_id', this.controllers.sendEmail);
        // AIR TICKET CUSTOM REPORT GENERATE
        this.routers.post('/custom-report', this.controllers.airTicketCustomReport);
        // AIR TICKET TAX REFUND
        this.routers.get('/tax-refund/:invoice_id', this.controllers.selectAirTicketTax);
        this.routers.post('/tax-refund', this.controllers.addAirTicketTax);
    }
}
exports.default = InvoiceAirTicketRouter;
//# sourceMappingURL=invoiceAirticket.routers.js.map