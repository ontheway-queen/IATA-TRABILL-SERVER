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
const loan_services_1 = __importDefault(require("../services/loan.services"));
const loan_validator_1 = __importDefault(require("../validators/loan.validator"));
class LoanControllers extends abstract_controllers_1.default {
    constructor() {
        super();
        this.services = new loan_services_1.default();
        this.validator = new loan_validator_1.default();
        this.addLoanAuthority = this.assyncWrapper.wrap(this.validator.addLoanAuthority, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.addLoanAuthrity(req);
            if (data.success) {
                res.status(201).json(data);
            }
            else {
                this.error('Add Loan Authority');
            }
        }));
        this.editLoanAuhtority = this.assyncWrapper.wrap(this.validator.editLoanAuthority, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.editLoanAuthority(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Edit Loan Auhtority');
            }
        }));
        this.deleteLoanAuthority = this.assyncWrapper.wrap(this.validator.deleteLoan, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.deleteAuthority(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Delete authority');
            }
        }));
        this.getLoanAuthorities = this.assyncWrapper.wrap(this.validator.readLoan, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getLoanAuthorities(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Get all loan authorities');
            }
        }));
        this.getALLLoanAuthority = this.assyncWrapper.wrap(this.validator.readLoan, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getALLLoanAuthority(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Get all loan authorities');
            }
        }));
        this.addLoan = this.assyncWrapper.wrap(this.validator.addLoan, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.addLoan(req);
            if (data.success) {
                res.status(201).json(data);
            }
            else {
                this.error('Add Loan');
            }
        }));
        this.getLoans = this.assyncWrapper.wrap(this.validator.readLoan, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getLoans(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('All Loans');
            }
        }));
        this.getLoan = this.assyncWrapper.wrap(this.validator.readLoan, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getLoan(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Single Loan');
            }
        }));
        this.editLoan = this.assyncWrapper.wrap(this.validator.editLoan, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.editLoan(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Edit Loan');
            }
        }));
        this.deleteLoan = this.assyncWrapper.wrap(this.validator.deleteLoan, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.deleteLoan(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Delete Loan');
            }
        }));
        /**
         * get loans by loan_type: taking, already_taken
         */
        this.loansForPayment = this.assyncWrapper.wrap(this.validator.readLoan, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.loansForPayment(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('get loan by type: taking, already_taken');
            }
        }));
        this.addPayment = this.assyncWrapper.wrap(this.validator.addPayment, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.addPayment(req);
            if (data.success) {
                res.status(201).json(data);
            }
            else {
                this.error('Add Payment');
            }
        }));
        this.allPayments = this.assyncWrapper.wrap(this.validator.readLoan, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getPayments(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('All payments');
            }
        }));
        this.singlePayment = this.assyncWrapper.wrap(this.validator.readLoan, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getPayment(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Single payment');
            }
        }));
        this.editPayment = this.assyncWrapper.wrap(this.validator.editPayment, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.editPayment(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Edit payment');
            }
        }));
        this.deletePayment = this.assyncWrapper.wrap(this.validator.deleteLoan, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.deletePayment(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Delete payment');
            }
        }));
        this.loansForReceive = this.assyncWrapper.wrap(this.validator.readLoan, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.loansForReceive(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('get loan by type: giving, already_given');
            }
        }));
        this.addReceived = this.assyncWrapper.wrap(this.validator.addReceived, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.addRecieved(req);
            if (data.success) {
                res.status(201).json(data);
            }
            else {
                this.error('Add Received');
            }
        }));
        this.allReceived = this.assyncWrapper.wrap(this.validator.readLoan, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getReceived(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('All Received');
            }
        }));
        this.singleReceived = this.assyncWrapper.wrap(this.validator.readLoan, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getSingleReceived(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Single Received');
            }
        }));
        this.editReceived = this.assyncWrapper.wrap(this.validator.editReceived, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.editRecieved(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Edit Received');
            }
        }));
        this.deleteReceived = this.assyncWrapper.wrap(this.validator.deleteLoan, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.deleteReceived(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Delete Received');
            }
        }));
    }
}
exports.default = LoanControllers;
//# sourceMappingURL=loan.controllers.js.map