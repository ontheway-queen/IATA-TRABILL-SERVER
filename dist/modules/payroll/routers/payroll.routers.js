"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const abstract_routers_1 = __importDefault(require("../../../abstracts/abstract.routers"));
const payroll_controllers_1 = __importDefault(require("../controllers/payroll.controllers"));
const ImageUploadToAzure_trabill_1 = require("../../../common/helpers/ImageUploadToAzure_trabill");
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
class PayrollRouters extends abstract_routers_1.default {
    constructor() {
        super();
        this.controllers = new payroll_controllers_1.default();
        this.callRouter();
    }
    callRouter() {
        this.routers.post('/create', upload.fields([{ name: 'payroll_image_url', maxCount: 1 }]), ImageUploadToAzure_trabill_1.uploadImageToAzure_trabill, this.controllers.createPayroll);
        this.routers.route('/payrolls').get(this.controllers.getAllPayroll);
        this.routers
            .route('/payroll/:id')
            .get(this.controllers.getPayrollById)
            .patch(upload.fields([{ name: 'payroll_image_url', maxCount: 1 }]), ImageUploadToAzure_trabill_1.uploadImageToAzure_trabill, this.controllers.editPayroll)
            .delete(this.controllers.deletePayroll);
        this.routers.get('/employee-commission/:employee_id', this.controllers.viewEmployeeCommission);
    }
}
exports.default = PayrollRouters;
//# sourceMappingURL=payroll.routers.js.map