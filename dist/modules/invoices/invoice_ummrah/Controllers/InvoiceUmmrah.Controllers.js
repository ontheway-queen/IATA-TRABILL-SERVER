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
const InvoiceUmmrah_Services_1 = __importDefault(require("../Services/InvoiceUmmrah.Services"));
const InvoiceUmmrah_Validators_1 = __importDefault(require("../Validators/InvoiceUmmrah.Validators"));
class InvoiceUmmrahControllers extends abstract_controllers_1.default {
    constructor() {
        super();
        this.services = new InvoiceUmmrah_Services_1.default();
        this.validator = new InvoiceUmmrah_Validators_1.default();
        this.getAllInvoiceUmmrah = this.assyncWrapper.wrap(this.validator.commonRead, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAllInvoices(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        // VIEW NON COMMISSION DETAILS
        this.viewInvoiceUmmrah = this.assyncWrapper.wrap(this.validator.commonRead, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.viewInvoiceUmmah(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        // @ADD_INVOICE_HAJJ
        this.postInvoiceUmmrah = this.assyncWrapper.wrap(this.validator.postInvoiceUmmrah, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.postInvoiceUmmrah(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        // @EDIT_INVOICE_HAJJ
        this.editInvoiceUmmrah = this.assyncWrapper.wrap(this.validator.updateInvoiceUmmrah, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.editInvoiceUmmrah(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getPreRegistrationReports = this.assyncWrapper.wrap(this.validator.commonRead, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getPreRegistrationReports(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.deleteInvoiceUmmrah = this.assyncWrapper.wrap(this.validator.commonDelete, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.deleteInvoiceUmmrah(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.voidInvoiceUmmrah = this.assyncWrapper.wrap(this.validator.commonDelete, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.voidInvoiceUmmrah(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getDataForEdit = this.assyncWrapper.wrap(this.validator.commonRead, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getDataForEdit(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getBillingInfo = this.assyncWrapper.wrap(this.validator.commonRead, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getBillingInfo(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.createUmmrahRefund = this.assyncWrapper.wrap(this.validator.createUmmrahRefund, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.createUmmrahRefund(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getUmmrahRefund = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getUmmrahRefund(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
    }
}
exports.default = InvoiceUmmrahControllers;
//# sourceMappingURL=InvoiceUmmrah.Controllers.js.map