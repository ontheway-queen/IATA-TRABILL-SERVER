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
const invoiceNonCommission_services_1 = __importDefault(require("../services/invoiceNonCommission.services"));
const commonNonCommission_validator_1 = require("../validators/commonNonCommission.validator");
const invoiceNonCommission_validators_1 = __importDefault(require("../validators/invoiceNonCommission.validators"));
class InvoiceNonCommissionController extends abstract_controllers_1.default {
    constructor() {
        super();
        this.services = new invoiceNonCommission_services_1.default();
        this.validator = new invoiceNonCommission_validators_1.default();
        // GET ALL INVOICE NON COMMISSION
        this.getAllInvoices = this.assyncWrapper.wrap(this.validator.readInvoiceNonComission, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAllInvoices(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        // GET ALL INVOICE NON COMMISSION
        this.voidNonCommission = this.assyncWrapper.wrap(commonNonCommission_validator_1.voidInvoices, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.voidNonCommission(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        // VIEW NON COMMISSION DETAILS
        this.viewNoncommissioinDetails = this.assyncWrapper.wrap(this.validator.readInvoiceNonComission, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.viewNonCommission(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.addInvoiceNonCommission = this.assyncWrapper.wrap(this.validator.addInvoiceNonCommission, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.addInvoiceNonCommission(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getDataForEdit = this.assyncWrapper.wrap(this.validator.readInvoiceNonComission, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getDataForEdit(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.editInvoiceNonCommission = this.assyncWrapper.wrap(this.validator.editInvoiceNonCommission, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.editInvoiceNonCommission(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.deleteNonComInvoice = this.assyncWrapper.wrap(this.validator.deleteInvoiceNonComission, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.deleteNonComInvoice(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
    }
}
exports.default = InvoiceNonCommissionController;
//# sourceMappingURL=invoiceNonCommission.controllers.js.map