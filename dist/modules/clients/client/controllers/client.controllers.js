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
const client_services_1 = __importDefault(require("../services/client.services"));
const client_validator_1 = __importDefault(require("../validators/client.validator"));
class ClientControllers extends abstract_controllers_1.default {
    constructor() {
        super();
        this.validator = new client_validator_1.default();
        this.services = new client_services_1.default();
        // CREATE CLIENT
        this.addClient = this.assyncWrapper.wrap(this.validator.addEditClient, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.addClient(req);
            if (data.success) {
                res.status(201).json(data);
            }
            else {
                this.error('add client controller');
            }
        }));
        // UPDATE CLIENT STATUS
        this.updateClientStatus = this.assyncWrapper.wrap(this.validator.activeStatus, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.updateClientStatus(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('client activate controller');
            }
        }));
        // UPDATE CLIENT
        this.editClient = this.assyncWrapper.wrap(this.validator.addEditClient, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.editClient(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Edit Client');
            }
        }));
        this.getAllClientAndCombined = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAllClientAndCombined(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.checkCreditLimit = this.assyncWrapper.wrap(this.validator.checkCreditLimit, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.checkCreditLimit(req);
            if (data.success) {
                res.status(201).json(data);
            }
            else {
                this.error('add client controller');
            }
        }));
        this.getClLastBalanceById = this.assyncWrapper.wrap(this.validator.readClient, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getClLastBalanceById(req);
            if (data.success) {
                res.status(201).json(data);
            }
            else {
                this.error('add client controller');
            }
        }));
        this.getCombClientLBalance = this.assyncWrapper.wrap(this.validator.readClient, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getCombClientLBalance(req);
            if (data.success) {
                res.status(201).json(data);
            }
            else {
                this.error('add client controller');
            }
        }));
        this.deleteClient = this.assyncWrapper.wrap(this.validator.deleteClient, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.deleteClient(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Delete client');
            }
        }));
        this.generateExcelReport = this.assyncWrapper.wrap(this.validator.readClient, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.generateExcelReport(req);
            if (data.success) {
                res.status(200).send(data);
            }
            else {
                this.error('Client excel report');
            }
        }));
        this.getAllClients = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAllClients(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('view clients controller');
            }
        }));
        this.viewAllClient = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.viewAllClient(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('');
            }
        }));
        this.getSingleClient = this.assyncWrapper.wrap(this.validator.readClient, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getSingleClient(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('view clients controller');
            }
        }));
        /**
         * view client all invoices
         */
        this.clientAllInvoices = this.assyncWrapper.wrap(this.validator.readClientAllInvoices, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.clientAllInvoices(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('View Client Invoices...');
            }
        }));
        /**
         * view client all money receipts
         */
        this.clientAllMoneyReceipts = this.assyncWrapper.wrap(this.validator.readClientAllMoneyReceipt, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.clientAllMoneyReceipts(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('View Client Money Receipts...');
            }
        }));
        /**
         * view client all quotations
         */
        this.clientAllQuotations = this.assyncWrapper.wrap(this.validator.readClientAllQuotations, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.clientAllQuotations(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('View Client Quotations...');
            }
        }));
        /**
         * client all refund
         */
        this.clientAllRefund = this.assyncWrapper.wrap(this.validator.readClientAllRefunds, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.clientAllRefund(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('View Client Refund...');
            }
        }));
        this.clientAllPassport = this.assyncWrapper.wrap(this.validator.readClientAllPassport, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.clientAllPassport(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('View Client Passport...');
            }
        }));
        this.sendEmailToClinet = this.assyncWrapper.wrap([
        // send email
        ], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.sendEmailToClinet(req);
            if (data.success) {
                res.status(200).send(data);
            }
            else {
                this.error('');
            }
        }));
        this.addIncentiveIncomeClient = this.assyncWrapper.wrap(this.validator.createCombClientIncentive, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.addIncentiveIncomeClient(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('');
            }
        }));
        this.getClientCombinedIncentiveIncome = this.assyncWrapper.wrap(this.validator.readCombClientIncentive, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getClientCombinedIncentiveIncome(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('');
            }
        }));
        this.getSingleClientCombinedIncentiveIncome = this.assyncWrapper.wrap(this.validator.readCombClientIncentive, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getSingleClientCombinedIncentiveIncome(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('');
            }
        }));
        this.editIncentiveIncomeCombClient = this.assyncWrapper.wrap(this.validator.editCombClientIncentive, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.editIncentiveIncomeCombClient(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('');
            }
        }));
        this.deleteIncentiveIncomeCombClient = this.assyncWrapper.wrap(this.validator.deleteCombClientIncentive, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.deleteIncentiveIncomeCombClient(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('');
            }
        }));
    }
}
exports.default = ClientControllers;
//# sourceMappingURL=client.controllers.js.map