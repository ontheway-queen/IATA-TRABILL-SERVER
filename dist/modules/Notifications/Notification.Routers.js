"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_routers_1 = __importDefault(require("../../abstracts/abstract.routers"));
const Notification_Controllers_1 = __importDefault(require("./Controllers/Notification.Controllers"));
class NotificationRouters extends abstract_routers_1.default {
    constructor() {
        super();
        this.controllers = new Notification_Controllers_1.default();
        this.callRouter();
    }
    // ====================== invoice hajj pre reg reuters =======================
    callRouter() {
        this.routers.patch('/collection-cheque-status', this.controllers.chequeCollectionStatusUpdate);
        this.routers.post('/upload-pdf', this.controllers.uploadPDF);
        this.routers.get('/exp-passport', this.controllers.getExpirePassport);
        this.routers.get('/collect-cheque', this.controllers.getCollectionCheque);
        this.routers.get('/payment-cheque', this.controllers.getPendingPaymentCheque);
        this.routers.get('/due-invoice', this.controllers.getDueInvoiceData);
        this.routers.get('/visa-delivary', this.controllers.getVisaDeliveryData);
        this.routers.get('/passport-resent', this.controllers.getNextExpirePassport);
    }
}
exports.default = NotificationRouters;
//# sourceMappingURL=Notification.Routers.js.map