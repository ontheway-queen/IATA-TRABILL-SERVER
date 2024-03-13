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
const quotation_services_1 = __importDefault(require("../services/quotation.services"));
const quotation_validator_1 = __importDefault(require("../validators/quotation.validator"));
class QuotationControllers extends abstract_controllers_1.default {
    constructor() {
        super();
        this.services = new quotation_services_1.default();
        this.validator = new quotation_validator_1.default();
        this.products = this.assyncWrapper.wrap(this.validator.productCategory, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.products(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Get all product categories');
            }
        }));
        this.createQuotation = this.assyncWrapper.wrap(this.validator.createQuotation, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.addQuotation(req);
            if (data.success) {
                res.status(201).json(data);
            }
            else {
                this.error('Create quotation');
            }
        }));
        this.allQuotations = this.assyncWrapper.wrap(this.validator.quotations, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.allQuotations(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('All quotations');
            }
        }));
        this.postQuotationOnConfirm = this.assyncWrapper.wrap(this.validator.confirmationQuotation, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.confirmationQuotation(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Single quotation');
            }
        }));
        this.singleQuotation = this.assyncWrapper.wrap(this.validator.quotations, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.singleQuotation(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Single quotation');
            }
        }));
        this.billInfos = this.assyncWrapper.wrap(this.validator.quotations, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.billInfos(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Bill infos');
            }
        }));
        this.editQuotation = this.assyncWrapper.wrap(this.validator.editQuotation, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.editQuotation(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Edit quotation');
            }
        }));
        this.deleteQuotation = this.assyncWrapper.wrap(this.validator.deleteQuotation, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.deleteQuotation(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Delete Quotation');
            }
        }));
    }
}
exports.default = QuotationControllers;
//# sourceMappingURL=quotation.controllers.js.map