"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_services_1 = __importDefault(require("../../../abstracts/abstract.services"));
const ChequeCollectionStatusUpdate_1 = __importDefault(require("./NarrowServices/ChequeCollectionStatusUpdate"));
const pdfParse = require('pdf-parse');
class NotificationServices extends abstract_services_1.default {
    constructor() {
        super();
        this.uploadPDF = (req, res) => __awaiter(this, void 0, void 0, function* () {
            if (!req.files || !('pdf' in req.files)) {
                res.status(400);
                res.end();
            }
            else {
                const camelCaseRegex = /([a-z,0-9])([A-Z])/g;
                pdfParse(req.files.pdf[0])
                    .then((result) => {
                    const newText = result.text.replace(camelCaseRegex, '$1 $2');
                    res.send(newText);
                })
                    .catch((error) => {
                    console.error('Error reading file:', error);
                    res.status(500).send('Internal Server Error');
                });
            }
        });
        this.getExpirePassport = (req) => __awaiter(this, void 0, void 0, function* () {
            const today = new Date();
            const priorDate = new Date(new Date().setDate(today.getDate() + 30));
            const conn = this.models.NotificationModals(req);
            const data = yield conn.getExpirePassport(today, priorDate);
            return { success: true, data };
        });
        this.getCollectionCheque = (req) => __awaiter(this, void 0, void 0, function* () {
            const chequeStatus = req.query.status || 'PENDING';
            const conn = this.models.NotificationModals(req);
            const data = yield conn.getCollectionCheque(chequeStatus);
            const count = yield conn.getCollectionChequeCount(chequeStatus);
            return { success: true, data: { count, data } };
        });
        this.getPendingPaymentCheque = (req) => __awaiter(this, void 0, void 0, function* () {
            const chequeStatus = req.query.status || 'PENDING';
            const conn = this.models.NotificationModals(req);
            const data = yield conn.getPendingPaymentCheque(chequeStatus);
            const count = yield conn.getPendingPaymentChequeCount(chequeStatus);
            return { success: true, data: { count, data } };
        });
        this.getDueInvoiceData = (req) => __awaiter(this, void 0, void 0, function* () {
            const { page, size } = req.query;
            const conn = this.models.NotificationModals(req);
            const data = yield conn.getDueInvoiceData(page, size);
            return Object.assign({ success: true }, data);
        });
        this.getVisaDeliveryData = (req) => __awaiter(this, void 0, void 0, function* () {
            const today = new Date();
            const conn = this.models.NotificationModals(req);
            const data = yield conn.getVisaDeliveryData(today);
            return { success: true, data };
        });
        this.getNextExpirePassport = (req) => __awaiter(this, void 0, void 0, function* () {
            const { page, size } = req.query;
            const conn = this.models.NotificationModals(req);
            const data = yield conn.getNextExpirePassport(Number(page) || 1, Number(size) || 20);
            return Object.assign({ success: true }, data);
        });
        this.chequeCollectionStatusUpdate = new ChequeCollectionStatusUpdate_1.default()
            .chequeCollectionStatusUpdate;
    }
}
exports.default = NotificationServices;
//# sourceMappingURL=Notification.Services.js.map