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
class ServicesDepartments extends abstract_services_1.default {
    constructor() {
        super();
        this.createDepartment = (req) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.models.configModel
                .departmentsModel(req)
                .createDepartment(req.body);
            return {
                success: true,
                data: { department_id: data },
            };
        });
        this.viewDepartment = (req) => __awaiter(this, void 0, void 0, function* () {
            const { page, size } = req.query;
            const data = yield this.models.configModel
                .departmentsModel(req)
                .viewDepartments(Number(page) || 1, Number(size) || 20);
            const count = yield this.models.configModel
                .departmentsModel(req)
                .countDepartmentDataRow();
            return { success: true, count, data };
        });
        this.getAllDepartments = (req) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.models.configModel
                .departmentsModel(req)
                .getAllDepartments();
            return { success: true, data };
        });
        this.editDepartment = (req) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const data = yield this.models.configModel
                .departmentsModel(req)
                .editDepartment(req.body, id);
            if (data === 0) {
                throw new customError_1.default('Please provide a valid Id', 400, 'Update failed');
            }
            return {
                success: true,
                message: 'Department updated successfully',
                data,
            };
        });
        this.deleteDepartment = (req) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { deleted_by } = req.body;
            const data = yield this.models.configModel
                .departmentsModel(req)
                .deleteDepartment(id, deleted_by);
            return { success: true, data };
        });
    }
}
exports.default = ServicesDepartments;
//# sourceMappingURL=departments.services.js.map