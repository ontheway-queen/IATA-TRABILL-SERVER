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
const abstract_controllers_1 = __importDefault(require("../../../../abstracts/abstract.controllers"));
const invoiceAirticket_services_1 = __importDefault(require("../../invoice-air-ticket/services/invoiceAirticket.services"));
const invoiceReissue_services_1 = __importDefault(require("../services/invoiceReissue.services"));
const invoiceReissue_validators_1 = __importDefault(require("../validators/invoiceReissue.validators"));
class ReIssueAirticket extends abstract_controllers_1.default {
    constructor() {
        super();
        this.services = new invoiceReissue_services_1.default();
        this.validator = new invoiceReissue_validators_1.default();
        this.services_airticket = new invoiceAirticket_services_1.default();
        this.addExistingClient = this.assyncWrapper.wrap(this.validator.addExistingClient, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.addExistingClient(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        // VIEW NON COMMISSION DETAILS
        this.viewReissue = this.assyncWrapper.wrap(this.validator.readResissueAirticket, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.viewInvoiceReissue(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getExistingClientAirticket = this.assyncWrapper.wrap(this.validator.readResissueAirticket, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getExistingClientAirticket(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.editExistingCl = this.assyncWrapper.wrap(this.validator.addExistingClient, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.editExistingCl(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.addReissueAirticket = this.assyncWrapper.wrap(this.validator.addReissueAirticket, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.addReissueAirticket(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        // GET ALL INVOICE NON COMMISSION
        this.getAllReissue = this.assyncWrapper.wrap(this.validator.readResissueAirticket, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAllInvoices(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getDataForEdit = this.assyncWrapper.wrap(this.validator.readResissueAirticket, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getDataForEdit(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.editReissueAirticket = this.assyncWrapper.wrap(this.validator.editReissueAirticket, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.editReissueAirticket(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.deleteReissue = this.assyncWrapper.wrap(this.validator.deleteResissueAirticket, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.deleteReissue(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getReissueTicketInfo = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getReissueTicketInfo(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getReissueRefundInfo = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getReissueRefundInfo(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.reissueRefund = this.assyncWrapper.wrap(this.validator.reissueRefundCreate, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.reissueRefund(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
    }
}
exports.default = ReIssueAirticket;
//# sourceMappingURL=invoiceReissue.controllers.js.map