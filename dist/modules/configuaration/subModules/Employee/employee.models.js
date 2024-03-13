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
const abstract_models_1 = __importDefault(require("../../../../abstracts/abstract.models"));
class EmployeeModel extends abstract_models_1.default {
    createEmployee(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const employee = yield this.query()
                .insert(Object.assign(Object.assign({}, data), { employee_org_agency: this.org_agency }))
                .into('trabill_employees');
            return employee[0];
        });
    }
    updateEmployee(data, employee_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .into('trabill_employees')
                .update(data)
                .where('employee_id', employee_id);
        });
    }
    deleteEmployee(employee_id, employee_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .into('trabill_employees')
                .update({ employee_is_deleted: 1, employee_deleted_by })
                .where('employee_id', employee_id);
        });
    }
    getAllBloodGroups() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query().select('*').from('trabill_blood_groups');
        });
    }
    getEmployeeById(employeeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const [data] = yield this.query()
                .from('trabill_employees')
                .select('employee_full_name', 'employee_email', 'employee_mobile', 'employee_commission', this.db.raw('CAST(employee_salary AS DECIMAL(15,2))  AS employee_salary'), 'employee_joining_date', 'employee_address', 'employee_status', 'employee_status', 'trabill_designations.designation_name', 'trabill_blood_groups.group_name', 'employee_birth_date', 'employee_apppoint_date', 'employee_card_id')
                .leftJoin('trabill_blood_groups', 'trabill_blood_groups.group_id', 'trabill_employees.employee_bloodgroup_id')
                .leftJoin('trabill_designations', 'trabill_designations.designation_id', 'trabill_employees.employee_designation_id')
                .where('employee_id', employeeId);
            return data;
        });
    }
    viewEmployees(page, size) {
        return __awaiter(this, void 0, void 0, function* () {
            const page_number = (page - 1) * size;
            const data = yield this.query()
                .from('trabill_employees')
                .select('employee_id', 'employee_card_id', 'employee_full_name', 'trabill_departments.department_id', 'trabill_departments.department_name', 'trabill_designations.designation_id', 'trabill_designations.designation_name', 'trabill_blood_groups.group_id', 'trabill_blood_groups.group_name', 'employee_email', 'employee_mobile', 'employee_salary', 'employee_commission', 'employee_birth_date', 'employee_apppoint_date', 'employee_joining_date', 'employee_address', 'employee_status', 'employee_org_agency as agency_id')
                .leftJoin('trabill_departments', 'trabill_departments.department_id', 'trabill_employees.employee_department_id')
                .leftJoin('trabill_designations', 'trabill_designations.designation_id', 'trabill_employees.employee_designation_id')
                .leftJoin('trabill_blood_groups', 'trabill_blood_groups.group_id', 'trabill_employees.employee_bloodgroup_id')
                .whereNot('employee_is_deleted', 1)
                .andWhere('employee_org_agency', this.org_agency)
                .orderBy('employee_create_date', 'desc')
                .limit(size)
                .offset(page_number);
            const [{ row_count }] = yield this.query()
                .select(this.db.raw(`count(*) as row_count`))
                .from('trabill_employees')
                .whereNot('employee_is_deleted', 1)
                .andWhere('employee_org_agency', this.org_agency);
            return { count: row_count, data };
        });
    }
    getAllEmployees(string) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .from('trabill_employees')
                .select('employee_id', 'employee_full_name', 'employee_birth_date', 'employee_card_id', 'trabill_departments.department_id', 'trabill_departments.department_name', 'trabill_designations.designation_id', 'trabill_designations.designation_name', 'trabill_blood_groups.group_id', 'trabill_blood_groups.group_name', 'employee_email', 'employee_mobile', 'employee_salary', 'employee_commission', 'employee_apppoint_date', 'employee_joining_date', 'employee_address', 'employee_status', 'employee_org_agency as agency_id')
                .leftJoin('trabill_departments', 'trabill_departments.department_id', 'trabill_employees.employee_department_id')
                .leftJoin('trabill_designations', 'trabill_designations.designation_id', 'trabill_employees.employee_designation_id')
                .leftJoin('trabill_blood_groups', 'trabill_blood_groups.group_id', 'trabill_employees.employee_bloodgroup_id')
                .whereNot('employee_is_deleted', 1)
                .andWhere('employee_org_agency', this.org_agency)
                .orderBy('employee_full_name');
        });
    }
}
exports.default = EmployeeModel;
//# sourceMappingURL=employee.models.js.map