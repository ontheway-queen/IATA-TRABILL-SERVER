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
const MoneyReceipt_Services_1 = __importDefault(require("../Services/MoneyReceipt.Services"));
const MoneyReceipt_Validators_1 = __importDefault(require("../Validators/MoneyReceipt.Validators"));
class MoneyReceiptControllers extends abstract_controllers_1.default {
    constructor() {
        super();
        this.services = new MoneyReceipt_Services_1.default();
        this.validator = new MoneyReceipt_Validators_1.default();
        // @POST_MONEY_RECEIPT
        this.postMoneyReceipt = this.assyncWrapper.wrap(this.validator.postMoneyReceipt, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.addMoneyReceipt(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.agentCommissionReceiptAdd = this.assyncWrapper.wrap(this.validator.agentCommissionAdd, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.agentCommissionReceiptAdd(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.deleteAgentMoneyRecipt = this.assyncWrapper.wrap(this.validator.deleteAgentCommission, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.deleteAgentMoneyRecipt(req);
            if (data.success) {
                res.status(200).json(data);
            }
        }));
        // @EDIT_MONEY_RECEIPT
        this.editMoneyReceipt = this.assyncWrapper.wrap(this.validator.updateMoneyReceipt, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.editMoneyReceipt(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        // @VIEW_MONREY_RECEIPT
        this.viewMoneyReceipt = this.assyncWrapper.wrap(this.validator.readMoneyReceipt, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.viewMoneyReceipt(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.viewMoneyReceiptDetails = this.assyncWrapper.wrap(this.validator.readMoneyReceipt, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.viewMoneyReceiptDetails(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        // @GET_INVOICE_DUE
        this.getInvoiceDue = this.assyncWrapper.wrap(this.validator.readMoneyReceipt, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getInvoiceDue(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.updateMoneyReceiptChequeStatus = this.assyncWrapper.wrap(this.validator.chequeStatusUpdate, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.updateMoneyReceiptChequeStatus(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.viewChequeInfoById = this.assyncWrapper.wrap(this.validator.readMoneyReceipt, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.viewChequeInfoById(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('read money receipt cheque by Id...');
            }
        }));
        // @ADD_INVOICE_MONEY_RECEIPT
        this.addInvoiceMoneyReceipt = this.assyncWrapper.wrap(this.validator.addInvoiceMoneyReceipt, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.addInvoiceMoneyReceipt(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        // @DELETE_MONEY_RECEIPT
        this.deleteMoneyReceipt = this.assyncWrapper.wrap(this.validator.commonDelete, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.deleteMoneyReceipt(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        // @GET_DATA_FOR_EDIT
        this.getDataForEdit = this.assyncWrapper.wrap(this.validator.readMoneyReceipt, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getDataForEdit(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        // view agent comission
        this.viewAgentComission = this.assyncWrapper.wrap(this.validator.readMoneyReceipt, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.viewAgentCommission(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('view agent comission...');
            }
        }));
        // view agent comission
        this.viewMoneyReceiptsInvoices = this.assyncWrapper.wrap(this.validator.readMoneyReceipt, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.viewMoneyReceiptsInvoices(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('view money receipts invoices...');
            }
        }));
        // view agent comission
        this.viewAgentInvoiceById = this.assyncWrapper.wrap(this.validator.readMoneyReceipt, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.viewAgentInvoiceById(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('view invoices by client id...');
            }
        }));
        // @GET_ALL_MONEY_RECEIPT
        this.getAllMoneyReceiipt = this.assyncWrapper.wrap(this.validator.readMoneyReceipt, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAllMoneyReceipt(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getAllAgentMoneyReceipt = this.assyncWrapper.wrap(this.validator.readMoneyReceipt, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAllAgentMoneyReceipt(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getInvoiceAndTicketNoByClient = this.assyncWrapper.wrap(this.validator.readMoneyReceipt, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getInvoiceAndTicketNoByClient(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getInvoiceByClientCombinedForEdit = this.assyncWrapper.wrap(this.validator.readMoneyReceipt, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getInvoiceByClientCombinedForEdit(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        // ======================== @ ADVANCE @ ==========================
        this.addAdvanceReturn = this.assyncWrapper.wrap(this.validator.postAdvanceReturn, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.addAdvanceReturn(req);
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
        this.deleteAdvanceReturn = this.assyncWrapper.wrap(this.validator.advrDelete, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.deleteAdvanceReturn(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getAllAdvanceReturn = this.assyncWrapper.wrap(this.validator.adveRead, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAllAdvanceReturn(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getAdvrForEdit = this.assyncWrapper.wrap(this.validator.adveRead, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAdvrForEdit(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        // get all agent invoices by id
        this.getAllAgentInvoiceById = this.assyncWrapper.wrap(this.validator.adveRead, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAllAgentInvoiceById(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('get all agent invoice by id...');
            }
        }));
        this.viewAllAgentInvoice = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.viewAllAgentInvoice(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('view all agent invoices...');
            }
        }));
    }
}
exports.default = MoneyReceiptControllers;
//# sourceMappingURL=MoneyReceipt.Controllers.js.map