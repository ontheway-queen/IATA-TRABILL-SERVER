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
const invoiceOther_services_1 = __importDefault(require("../services/invoiceOther.services"));
const invoiceOther_validators_js_1 = __importDefault(require("../validators/invoiceOther.validators.js"));
class InvoiceOther extends abstract_controllers_1.default {
    constructor() {
        super();
        this.services = new invoiceOther_services_1.default();
        this.validator = new invoiceOther_validators_js_1.default();
        // GET ALL INVOICE NON COMMISSION
        this.getAllInvoiceOther = this.assyncWrapper.wrap(this.validator.readInvoiceOthers, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAllInvoiceOther(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        // VIEW NON COMMISSION DETAILS
        this.viewInvoiceOther = this.assyncWrapper.wrap(this.validator.readInvoiceOthers, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.viewInvoiceOther(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.postInvoiceOther = this.assyncWrapper.wrap(this.validator.addInvoiceOthers, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.postInvoiceOther(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                throw new Error();
            }
        }));
        this.editInvoiceOther = this.assyncWrapper.wrap(this.validator.editInviceOthers, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.editInvoiceOther(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                throw new Error();
            }
        }));
        this.deleteInvoiceOther = this.assyncWrapper.wrap(this.validator.deleteInvoiceOthers, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.deleteInvoiceOther(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                throw new Error();
            }
        }));
        // ============== @View ==================
        this.getForEdit = this.assyncWrapper.wrap(this.validator.readInvoiceOthers, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getForEdit(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                throw new Error();
            }
        }));
        this.getAllInvoiceOthersByClientId = this.assyncWrapper.wrap(this.validator.readInvoiceOthers, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAllInvoiceOthersByClientId(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                throw new Error();
            }
        }));
        this.getTransportType = this.assyncWrapper.wrap(this.validator.readInvoiceOthers, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getTransportType(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                throw new Error();
            }
        }));
    }
}
exports.default = InvoiceOther;
//# sourceMappingURL=invoiceOther.controllers.js.map