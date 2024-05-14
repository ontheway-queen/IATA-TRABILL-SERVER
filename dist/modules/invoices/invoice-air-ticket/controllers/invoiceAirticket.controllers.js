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
const invoiceAirticket_services_1 = __importDefault(require("../services/invoiceAirticket.services"));
const invoiceAirticket_validators_1 = __importDefault(require("../validators/invoiceAirticket.validators"));
class InvoiceAirticketController extends abstract_controllers_1.default {
    constructor() {
        super();
        this.services = new invoiceAirticket_services_1.default();
        this.validator = new invoiceAirticket_validators_1.default();
        // PNR DETAILS
        this.pnrDetails = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.pnrDetails(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        /**
         * @API /api/v1/invoice-air-ticket
         * @Desc Invoice Airticket create
         * @Method POST
         */
        this.postInvoiceAirticket = this.assyncWrapper.wrap(this.validator.postInvoiceAirticket, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.addInvoiceAirticket(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getAllInvoices = this.assyncWrapper.wrap(this.validator.readInvoiceAirticket, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAllInvoices(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getDataForEdit = this.assyncWrapper.wrap(this.validator.readInvoiceAirticket, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getDataForEdit(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.eidtInvioceAirticket = this.assyncWrapper.wrap(this.validator.editInvoice, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.editInvoiceAirticket(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.deleteInvoiceAirTicket = this.assyncWrapper.wrap(this.validator.deleteInvoiceAirticket, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.deleteInvoiceAirTicket(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.viewCommonInvoiceDetails = this.assyncWrapper.wrap(this.validator.readInvoiceAirticket, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.viewCommonInvoiceDetails(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.voidInvoiceAirticket = this.assyncWrapper.wrap(this.validator.voidAirticket, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.voidInvoiceAirticket(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        // =================COMMON ===============
        this.getAllInvoicesNumAndId = this.assyncWrapper.wrap(this.validator.readInvoiceAirticket, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAllInvoicesNumAndId(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getClientDue = this.assyncWrapper.wrap(this.validator.readInvoiceAirticket, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getClientDue(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.isTicketAlreadyExist = this.assyncWrapper.wrap(this.validator.readInvoiceAirticket, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.isTicketAlreadyExist(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getInvoiceAcitivity = this.assyncWrapper.wrap(this.validator.readInvoiceAirticket, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getInvoiceAcitivity(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.sendEmail = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.sendEmail(req);
            if (data.success) {
                res.status(200).json(data);
            }
        }));
        this.airTicketCustomReport = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.airTicketCustomReport(req);
            if (data.success) {
                res.status(200).json(data);
            }
        }));
        // AIR TICKET TAX REFUND
        this.selectAirTicketTax = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.selectAirTicketTax(req);
            if (data.success) {
                res.status(200).json(data);
            }
        }));
        this.addAirTicketTax = this.assyncWrapper.wrap(this.validator.validateTaxRefund, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.addAirTicketTax(req);
            if (data.success) {
                res.status(200).json(data);
            }
        }));
        this.getInvoiceInfoForVoid = this.assyncWrapper.wrap(this.validator.readInvoiceAirticket, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getInvoiceInfoForVoid(req);
            if (data.success) {
                res.status(200).json(data);
            }
        }));
        this.getInvoiceDiscount = this.assyncWrapper.wrap(this.validator.readInvoiceAirticket, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getInvoiceDiscount(req);
            if (data.success) {
                res.status(200).json(data);
            }
        }));
        this.getInvoiceClientPayment = this.assyncWrapper.wrap(this.validator.readInvoiceAirticket, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getInvoiceClientPayment(req);
            if (data.success) {
                res.status(200).json(data);
            }
        }));
    }
}
exports.default = InvoiceAirticketController;
//# sourceMappingURL=invoiceAirticket.controllers.js.map