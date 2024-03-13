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
const expenseHead_sevices_1 = __importDefault(require("./expenseHead.sevices"));
const expenseHead_validators_1 = __importDefault(require("./expenseHead.validators"));
class ControllersExpenseHead extends abstract_controllers_1.default {
    constructor() {
        super();
        this.servicesExpenseHead = new expenseHead_sevices_1.default();
        this.validator = new expenseHead_validators_1.default();
        this.createControllerExpenseHead = this.assyncWrapper.wrap(this.validator.createExpenseHead, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesExpenseHead.CreateExpenseHead(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.updateControllerExpenseHead = this.assyncWrapper.wrap(this.validator.editExpenseHead, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesExpenseHead.UpdateExpenseHead(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.viewExpenseHeads = this.assyncWrapper.wrap(this.validator.readExpenseHead, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesExpenseHead.viewExpenseHeads(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getAllExpenseHeads = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesExpenseHead.getAllExpenseHeads(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.deleteControllerExpenseHead = this.assyncWrapper.wrap(this.validator.deleteExpenseHead, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesExpenseHead.DeleteExpenseHead(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
    }
}
exports.default = ControllersExpenseHead;
//# sourceMappingURL=expenseHead.controllers.js.map