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
const abstract_services_1 = __importDefault(require("../../../../abstracts/abstract.services"));
const customError_1 = __importDefault(require("../../../../common/utils/errors/customError"));
class ServicesEmployee extends abstract_services_1.default {
    constructor() {
        super();
        this.CreateEmployee = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.configModel.employeeModel(req);
            yield conn.getSineAndId(req.body.employee_creation_sign, req.body.employee_card_id);
            const data = yield conn.createEmployee(req.body);
            return { success: true, data: { employee_id: data } };
        });
        this.UpdateEmployee = (req) => __awaiter(this, void 0, void 0, function* () {
            const { employee_id } = req.params;
            const data = yield this.models.configModel
                .employeeModel(req)
                .updateEmployee(req.body, employee_id);
            if (data === 0) {
                throw new customError_1.default('Please provide a valid Id to update', 400, 'Update failed');
            }
            return { success: true, data };
        });
        this.viewEmployees = (req) => __awaiter(this, void 0, void 0, function* () {
            const { page, size } = req.query;
            const data = yield this.models.configModel
                .employeeModel(req)
                .viewEmployees(Number(page) || 1, Number(size) || 20);
            return Object.assign({ success: true }, data);
        });
        this.getAllEmployees = (req) => __awaiter(this, void 0, void 0, function* () {
            const { search } = req.query;
            const data = yield this.models.configModel
                .employeeModel(req)
                .getAllEmployees(search);
            return { success: true, data };
        });
        this.getEmployeeById = (req) => __awaiter(this, void 0, void 0, function* () {
            const employeeId = req.params.id;
            const data = yield this.models.configModel
                .employeeModel(req)
                .getEmployeeById(employeeId);
            return { success: true, data };
        });
        this.DeleteEmployee = (req) => __awaiter(this, void 0, void 0, function* () {
            const { employee_id } = req.params;
            const { deleted_by } = req.body;
            const data = yield this.models.configModel
                .employeeModel(req)
                .deleteEmployee(employee_id, deleted_by);
            return { success: true, data };
        });
        this.readBloodGroup = (req) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.models.configModel
                .employeeModel(req)
                .getAllBloodGroups();
            return { success: true, data };
        });
    }
}
exports.default = ServicesEmployee;
//# sourceMappingURL=employee.services.js.map