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
const abstract_controllers_1 = __importDefault(require("../../../abstracts/abstract.controllers"));
const Notification_Validators_1 = __importDefault(require("../Notification.Validators"));
const Notification_Services_1 = __importDefault(require("../Services/Notification.Services"));
class NotificationControllers extends abstract_controllers_1.default {
    constructor() {
        super();
        this.services = new Notification_Services_1.default();
        this.validator = new Notification_Validators_1.default();
        this.chequeCollectionStatusUpdate = this.assyncWrapper.wrap(this.validator.updateCollectionCheque, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.chequeCollectionStatusUpdate(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.uploadPDF = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.services.uploadPDF(req, res);
        }));
        this.getExpirePassport = this.assyncWrapper.wrap(this.validator.readPassport, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getExpirePassport(req);
            if (data.success) {
                res.status(200).json(data);
            }
        }));
        this.getCollectionCheque = this.assyncWrapper.wrap(this.validator.collectionCheque, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getCollectionCheque(req);
            if (data.success) {
                res.status(200).json(data);
            }
        }));
        this.getPendingPaymentCheque = this.assyncWrapper.wrap(this.validator.collectionCheque, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getPendingPaymentCheque(req);
            if (data.success) {
                res.status(200).json(data);
            }
        }));
        this.getDueInvoiceData = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getDueInvoiceData(req);
            if (data.success) {
                res.status(200).json(data);
            }
        }));
        this.getVisaDeliveryData = this.assyncWrapper.wrap(this.validator.readVisa, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getVisaDeliveryData(req);
            if (data.success) {
                res.status(200).json(data);
            }
        }));
        this.getNextExpirePassport = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getNextExpirePassport(req);
            if (data.success) {
                res.status(200).json(data);
            }
        }));
    }
}
exports.default = NotificationControllers;
//# sourceMappingURL=Notification.Controllers.js.map