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
const Vendor_Services_1 = __importDefault(require("../services/Vendor.Services"));
const vendor_validator_1 = __importDefault(require("../validators/vendor.validator"));
class VendorController extends abstract_controllers_1.default {
    constructor() {
        super();
        this.services = new Vendor_Services_1.default();
        this.validator = new vendor_validator_1.default();
        // ===================== vendors ================================
        this.getVendorById = this.assyncWrapper.wrap(this.validator.commonRead, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getVendorById(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getVendorInvoiceDue = this.assyncWrapper.wrap(this.validator.commonRead, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getVendorInvoiceDue(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getAllVendorsAndCombinedByProductId = this.assyncWrapper.wrap(this.validator.commonRead, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAllVendorsAndCombinedByProductId(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getAllVendorsAndcombined = this.assyncWrapper.wrap(this.validator.commonRead, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAllVendorsAndcombined(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.allVendorPaymentChecque = this.assyncWrapper.wrap(this.validator.commonRead, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.allVendorPaymentChecque(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getVendorExcelReport = this.assyncWrapper.wrap(this.validator.commonRead, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getVendorExcelReport(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getAllVendors = this.assyncWrapper.wrap(this.validator.commonRead, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAllVendors(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getForEdit = this.assyncWrapper.wrap(this.validator.commonRead, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getForEdit(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.updateVendorStatusById = this.assyncWrapper.wrap(this.validator.commonUpdate, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.updateVendorStatusById(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.deleteVendor = this.assyncWrapper.wrap(this.validator.commonDelete, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.deleteVendor(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.addVendor = this.assyncWrapper.wrap(this.validator.addVendor, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.addVendor(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.editVendor = this.assyncWrapper.wrap(this.validator.editVendor, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.editVendor(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        // ===================== advance return ================================
        this.addAdvanceReturn = this.assyncWrapper.wrap(this.validator.addAdvanceReturn, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.addAdvanceReturn(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getAdvanceReturn = this.assyncWrapper.wrap(this.validator.commonRead, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAdvanceReturn(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.editAdvanceReturn = this.assyncWrapper.wrap(this.validator.editAdvanceReturn, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.editAdvanceReturn(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.deleteAdvanceReturn = this.assyncWrapper.wrap(this.validator.commonDelete, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.deleteAdvanceReturn(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.vendorLastBalance = this.assyncWrapper.wrap(this.validator.commonDelete, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.vendorLastBalance(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        // ===================== vendor payments ================================
        this.addVendorPayment = this.assyncWrapper.wrap(this.validator.addVendorPayment, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.addVendorPayment(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.editVendorPayment = this.assyncWrapper.wrap(this.validator.editVendorPayment, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.editVendorPayment(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.viewVendorPayment = this.assyncWrapper.wrap(this.validator.commonRead, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.viewVendorPayment(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.viewVendorPaymentDetails = this.assyncWrapper.wrap(this.validator.commonRead, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.viewVendorPaymentDetails(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getVendorPayments = this.assyncWrapper.wrap(this.validator.commonRead, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getVendorPayments(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getCountryCode = this.assyncWrapper.wrap(this.validator.commonRead, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getCountryCode(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getPrevPayBalance = this.assyncWrapper.wrap(this.validator.commonRead, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getPrevPayBalance(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.deleteVendorPayment = this.assyncWrapper.wrap(this.validator.commonDelete, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.deleteVendorPayment(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getPaymentMethod = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getPaymentMethod(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getVendorPayForEditById = this.assyncWrapper.wrap(this.validator.commonRead, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getVendorPayForEditById(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getNonPaidVendorInvoice = this.assyncWrapper.wrap(this.validator.commonRead, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getNonPaidVendorInvoice(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('');
            }
        }));
        this.getNonPaidVendorInvoiceForEdit = this.assyncWrapper.wrap(this.validator.commonRead, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getNonPaidVendorInvoiceForEdit(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('');
            }
        }));
        this.getAdvanceReturnForEdit = this.assyncWrapper.wrap(this.validator.commonRead, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAdvanceReturnForEdit(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getAdvanceReturnDetails = this.assyncWrapper.wrap(this.validator.commonRead, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAdvanceReturnDetails(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getVendorPaymentCheque = this.assyncWrapper.wrap(this.validator.commonRead, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getVendorPaymentCheque(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getVendorAdvrCheque = this.assyncWrapper.wrap(this.validator.commonRead, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getVendorAdvrCheque(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getInvoiceByVendorId = this.assyncWrapper.wrap(this.validator.commonRead, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getInvoiceByVendorId(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.viewAllVendors = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.viewAllVendors(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getInvoiceVendors = this.assyncWrapper.wrap(this.validator.commonRead, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getInvoiceVendors(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('');
            }
        }));
    }
}
exports.default = VendorController;
//# sourceMappingURL=vendor.Controllers.js.map