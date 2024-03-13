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
const payroll_services_1 = __importDefault(require("../services/payroll.services"));
const payroll_validators_1 = __importDefault(require("../validators/payroll.validators"));
class PayrollControllers extends abstract_controllers_1.default {
    constructor() {
        super();
        this.services = new payroll_services_1.default();
        this.validator = new payroll_validators_1.default();
        this.createPayroll = this.assyncWrapper.wrap(this.validator.createPayroll, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.createPayrolls(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Create Payroll...');
            }
        }));
        // get all payroll
        this.getAllPayroll = this.assyncWrapper.wrap(this.validator.readPayroll, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAllPayrolls(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Get all payroll...');
            }
        }));
        // get payroll by id
        this.getPayrollById = this.assyncWrapper.wrap(this.validator.readPayroll, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getPayrollsById(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Get payroll by id...');
            }
        }));
        // update payroll
        this.editPayroll = this.assyncWrapper.wrap(this.validator.updatePayroll, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.editPayrolls(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Update payroll...');
            }
        }));
        // delete payroll
        this.deletePayroll = this.assyncWrapper.wrap(this.validator.deletePayroll, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.deletePayrolls(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Delete payroll...');
            }
        }));
        this.viewEmployeeCommission = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.viewEmployeeCommission(req);
            if (data.success) {
                res.status(200).json(data);
            }
        }));
    }
}
exports.default = PayrollControllers;
//# sourceMappingURL=payroll.controllers.js.map