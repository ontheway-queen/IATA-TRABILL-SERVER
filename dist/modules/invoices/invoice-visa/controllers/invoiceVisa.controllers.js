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
const invoiceVisa_services_1 = __importDefault(require("../services/invoiceVisa.services"));
const invoiceVisa_validators_js_1 = __importDefault(require("../validators/invoiceVisa.validators.js"));
class InvoiceVisa extends abstract_controllers_1.default {
    constructor() {
        super();
        this.services = new invoiceVisa_services_1.default();
        this.validator = new invoiceVisa_validators_js_1.default();
        this.addInvoiceVisa = this.assyncWrapper.wrap(this.validator.addInvoiceVisa, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.addInvoiceVisa(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                throw new Error('Thare was an error in invoice post');
            }
        }));
        this.getAllInvoiceVisa = this.assyncWrapper.wrap(this.validator.readInvoiceVisa, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getListOfInvoiceVisa(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getForEdit = this.assyncWrapper.wrap(this.validator.readInvoiceVisa, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getForEdit(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                throw new Error();
            }
        }));
        this.updateBillingStatus = this.assyncWrapper.wrap(this.validator.readInvoiceVisa, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.updateBillingStatus(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.viewInvoiceVisa = this.assyncWrapper.wrap(this.validator.readInvoiceVisa, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.viewInvoiceVisa(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.editInvoiceVisa = this.assyncWrapper.wrap(this.validator.editInvoice, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.editInvoiceVisa(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                throw new Error();
            }
        }));
        this.deleteInvoiceVisa = this.assyncWrapper.wrap(this.validator.deleteInvoiceVisa, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.deleteInvoiceVisa(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                throw new Error();
            }
        }));
        this.voidInvoiceVisa = this.assyncWrapper.wrap(this.validator.deleteInvoiceVisa, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.voidInvoiceVisa(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                throw new Error();
            }
        }));
    }
}
exports.default = InvoiceVisa;
//# sourceMappingURL=invoiceVisa.controllers.js.map