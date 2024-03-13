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
const InvoiceHajjPreReg_Services_1 = __importDefault(require("../Services/InvoiceHajjPreReg.Services"));
const InvoiceHajjPreReg_Validators_1 = __importDefault(require("../Validators/InvoiceHajjPreReg.Validators"));
class InvoiceHajjPreRegControllers extends abstract_controllers_1.default {
    constructor() {
        super();
        this.services = new InvoiceHajjPreReg_Services_1.default();
        this.validator = new InvoiceHajjPreReg_Validators_1.default();
        this.getAllInvoiceHajjiPreReg = this.assyncWrapper.wrap(this.validator.commonRead, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAllInvoices(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.viewInvoiceHajjiPreReg = this.assyncWrapper.wrap(this.validator.commonRead, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.viewInvoiceHajjPreReg(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.addInvoiceHajjPre = this.assyncWrapper.wrap(this.validator.postInvoiceHajjPreReg, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.addInvoiceHajjPre(req);
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
        this.deleteInvoiceHajjPre = this.assyncWrapper.wrap(this.validator.commonDelete, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.deleteInvoiceHajjPre(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.voidHajjPreReg = this.assyncWrapper.wrap(this.validator.commonDelete, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.voidHajjPreReg(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.editInvoiceHajjPre = this.assyncWrapper.wrap(this.validator.editInvoiceHajjPreReg, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.editInvoiceHajjPre(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getDetailsById = this.assyncWrapper.wrap(this.validator.commonRead, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getDetailsById(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.hajiInfoByTrackingNo = this.assyncWrapper.wrap(this.validator.commonRead, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.hajiInfoByTrackingNo(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.hajiInformationHajjiManagement = this.assyncWrapper.wrap(this.validator.commonRead, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.hajiInformationHajjiManagement(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.hajiInfoSerialIsUnique = this.assyncWrapper.wrap(this.validator.hajiTrackingSerialCheck, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.hajiInfoSerialIsUnique(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.updateHajjiInfoStatus = this.assyncWrapper.wrap(this.validator.updateHajjiInfoStatus, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.updateHajjiInfoStatus(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('');
            }
        }));
        this.getAllHajiPreRegInfos = this.assyncWrapper.wrap(this.validator.commonRead, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAllHajiPreRegInfos(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('');
            }
        }));
    }
}
exports.default = InvoiceHajjPreRegControllers;
//# sourceMappingURL=InvoiceHajjPreReg.Controllers.js.map