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
const InvoiceHajj_Services_1 = __importDefault(require("../Services/InvoiceHajj.Services"));
const InvoiceHajj_Validators_1 = __importDefault(require("../Validators/InvoiceHajj.Validators"));
const abstract_controllers_1 = __importDefault(require("../../../../abstracts/abstract.controllers"));
class InvoiceHajjControllers extends abstract_controllers_1.default {
    constructor() {
        super();
        this.services = new InvoiceHajj_Services_1.default();
        this.validator = new InvoiceHajj_Validators_1.default();
        // =================== InvoiceHajjPreReg Controllers ==================
        // GET ALL INVOICE NON COMMISSION
        this.getAllInvoiceHajj = this.assyncWrapper.wrap(this.validator.commonRead, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAllInvoices(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.viewInvoiceHajj = this.assyncWrapper.wrap(this.validator.commonRead, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.viewInvoiceHajj(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        // @ADD_INVOICE_HAJJ
        this.postInvoiceHajj = this.assyncWrapper.wrap(this.validator.postInvoiceHajj, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.addInvoiceHajjServices(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        // @EDIT_INVOICE_HAJJ
        this.editInvoiceHajj = this.assyncWrapper.wrap(this.validator.postInvoiceHajj, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.editInvoiceHajj(req);
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
        this.deleteInvoiceHajj = this.assyncWrapper.wrap(this.validator.commonDelete, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.deleteInvoiceHajj(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.voidInvoiceHajj = this.assyncWrapper.wrap(this.validator.commonDelete, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.voidInvoiceHajj(req);
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
        this.getHajjInfo = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getHajjInfo(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.createHajjRefund = this.assyncWrapper.wrap(this.validator.createHajjRefund, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.createHajjRefund(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getHajjInvoiceRefund = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getHajjInvoiceRefund(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
    }
}
exports.default = InvoiceHajjControllers;
//# sourceMappingURL=InvoiceHajj.Controllers.js.map