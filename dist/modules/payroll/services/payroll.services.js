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
const abstract_services_1 = __importDefault(require("../../../abstracts/abstract.services"));
const addPayroll_services_1 = __importDefault(require("./narrowServices/addPayroll.services"));
const deletePayroll_services_1 = __importDefault(require("./narrowServices/deletePayroll.services"));
const editPayroll_services_1 = __importDefault(require("./narrowServices/editPayroll.services"));
class PayrollServices extends abstract_services_1.default {
    constructor() {
        super();
        this.createPayrolls = new addPayroll_services_1.default().createPayrollServices;
        this.editPayrolls = new editPayroll_services_1.default().editPayrollServices;
        this.deletePayrolls = new deletePayroll_services_1.default().deletePayrollServices;
    }
    getAllPayrolls(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, size, search, from_date, to_date } = req.query;
            const conn = this.models.payrollModel(req);
            const data = yield conn.getPayroll(Number(page) || 1, Number(size) || 20, search, from_date, to_date);
            return Object.assign({ success: true }, data);
        });
    }
    // get all payroll
    getPayrollsById(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const conn = this.models.payrollModel(req);
            const payroll = yield conn.getPayrollById(id);
            const payroll_deductions = yield conn.getPayrollDeductions(id);
            const data = Object.assign(Object.assign({}, payroll), { payroll_deductions });
            return { success: true, data };
        });
    }
    viewEmployeeCommission(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { employee_id } = req.params;
            const { month } = req.query;
            const conn = this.models.payrollModel(req);
            const data = yield conn.viewEmployeeCommission(+employee_id, month);
            return { success: true, data };
        });
    }
}
exports.default = PayrollServices;
//# sourceMappingURL=payroll.services.js.map