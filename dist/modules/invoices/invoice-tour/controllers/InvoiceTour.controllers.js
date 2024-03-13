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
const invoiceTour_services_1 = __importDefault(require("../services/invoiceTour.services"));
const InvoiceTour_validators_1 = __importDefault(require("../validators/InvoiceTour.validators"));
class InvoiceTourController extends abstract_controllers_1.default {
    constructor() {
        super();
        this.services = new invoiceTour_services_1.default();
        this.validator = new InvoiceTour_validators_1.default();
        this.getAllInvoiceTour = this.assyncWrapper.wrap(this.validator.readInvoiceTour, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAllTourInvoices(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Get all invoice tour ');
            }
        }));
        this.getForEdit = this.assyncWrapper.wrap(this.validator.readInvoiceTour, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getForEdit(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Get for edit invoice tour ');
            }
        }));
        // VIEW INVOICE TOUR PACKAGE
        this.viewITourPackage = this.assyncWrapper.wrap(this.validator.readInvoiceTour, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.viewITourPackage(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Get view invoice tour ');
            }
        }));
        this.getTourBillingInfo = this.assyncWrapper.wrap(this.validator.readInvoiceTour, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getTourBillingInfo(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Get view invoice tour ');
            }
        }));
        // UPDATE
        this.editInvoiceTour = this.assyncWrapper.wrap(this.validator.updateTourPackage, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.editInvoiceTour(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Get for edit invoice tour ');
            }
        }));
        // CREATE
        this.createInvoiceTour = this.assyncWrapper.wrap(this.validator.createTourPackage, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.addInvoiceTour(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                throw new Error();
            }
        }));
        // ADD COSTING
        this.addCostingTourPackage = this.assyncWrapper.wrap(this.validator.addCostingTour, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.addCostingTourPackage(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                throw new Error();
            }
        }));
        this.deleteResetInvoiceTour = this.assyncWrapper.wrap(this.validator.deleteInvoiceTour, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.deleteResetInvoiceTour(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                throw new Error();
            }
        }));
        this.voidInvoiceTour = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.voidInvoiceTour(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                throw new Error();
            }
        }));
    }
}
exports.default = InvoiceTourController;
//# sourceMappingURL=InvoiceTour.controllers.js.map