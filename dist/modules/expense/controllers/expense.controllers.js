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
const expense_services_1 = __importDefault(require("../services/expense.services"));
const expense_validator_1 = __importDefault(require("../validators/expense.validator"));
class ExpenseContorller extends abstract_controllers_1.default {
    constructor() {
        super();
        this.services = new expense_services_1.default();
        this.validator = new expense_validator_1.default();
        this.createExpense = this.assyncWrapper.wrap(this.validator.createExpense, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.addExpense(req);
            if (data.success) {
                res.status(201).json(data);
            }
            else {
                this.error('Create Expense');
            }
        }));
        this.allExpenses = this.assyncWrapper.wrap(this.validator.readExpense, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.allExpenses(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('All expenses');
            }
        }));
        this.deleteExpense = this.assyncWrapper.wrap(this.validator.deleteExpense, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.deleteExpense(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Delete expense failed');
            }
        }));
        this.singleExpenses = this.assyncWrapper.wrap(this.validator.readExpense, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.singleExpenses(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Single expenses');
            }
        }));
        this.editExpense = this.assyncWrapper.wrap(this.validator.updateExpense, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.editExpense(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Edit expense');
            }
        }));
        this.expenseInfos = this.assyncWrapper.wrap(this.validator.readExpense, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.expenseInfos(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('expense infos');
            }
        }));
        this.expenseCheques = this.assyncWrapper.wrap(this.validator.readExpense, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.expenseCheques(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('expense infos');
            }
        }));
    }
}
exports.default = ExpenseContorller;
//# sourceMappingURL=expense.controllers.js.map