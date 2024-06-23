"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_routers_1 = __importDefault(require("../../../abstracts/abstract.routers"));
const payroll_controllers_1 = __importDefault(require("../controllers/payroll.controllers"));
class PayrollRouters extends abstract_routers_1.default {
    constructor() {
        super();
        this.controllers = new payroll_controllers_1.default();
        this.callRouter();
    }
    callRouter() {
        this.routers.post('/create', this.uploader.cloudUploadRaw(this.fileFolder.TRABILL_FILE), this.controllers.createPayroll);
        this.routers.route('/payrolls').get(this.controllers.getAllPayroll);
        this.routers
            .route('/payroll/:id')
            .get(this.controllers.getPayrollById)
            .patch(this.uploader.cloudUploadRaw(this.fileFolder.TRABILL_FILE), this.controllers.editPayroll)
            .delete(this.controllers.deletePayroll);
        this.routers.get('/employee-commission/:employee_id', this.controllers.viewEmployeeCommission);
    }
}
exports.default = PayrollRouters;
//# sourceMappingURL=payroll.routers.js.map