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
class DepartmentsModel extends abstract_models_1.default {
    createDepartment(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const visaType = yield this.query()
                .insert(Object.assign(Object.assign({}, data), { department_org_agency: this.org_agency }))
                .into('trabill_departments');
            return visaType[0];
        });
    }
    viewDepartments(page, size) {
        return __awaiter(this, void 0, void 0, function* () {
            const page_number = (page - 1) * size;
            return yield this.query()
                .from('trabill_departments')
                .select('department_id', 'department_name', 'department_create_date', 'department_org_agency as agency_id')
                .whereNot('department_is_deleted', 1)
                .andWhere((builder) => {
                builder.where('department_org_agency', null);
                builder.orWhere('department_org_agency', this.org_agency);
            })
                .orderBy('department_name')
                .limit(size)
                .offset(page_number);
        });
    }
    countDepartmentDataRow() {
        return __awaiter(this, void 0, void 0, function* () {
            const [count] = yield this.query()
                .select(this.db.raw(`count(*) as row_count`))
                .from('trabill_departments')
                .whereNot('department_is_deleted', 1)
                .andWhere('department_org_agency', null)
                .orWhere('department_org_agency', this.org_agency);
            return count.row_count;
        });
    }
    getAllDepartments() {
        return __awaiter(this, void 0, void 0, function* () {
            const by_clients = yield this.query()
                .from('trabill_departments')
                .select('department_id', 'department_name', 'department_create_date', 'department_org_agency as agency_id')
                .where('department_org_agency', this.org_agency)
                .andWhereNot('department_is_deleted', 1)
                .orderBy('department_name');
            const by_default = yield this.query()
                .from('trabill_departments')
                .select('department_id', 'department_name', 'department_create_date', 'department_org_agency as agency_id')
                .where('department_org_agency', null)
                .andWhereNot('department_is_deleted', 1)
                .orderBy('department_name');
            return [...by_clients, ...by_default];
        });
    }
    editDepartment(data, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .into('trabill_departments')
                .update(data)
                .where('trabill_departments.department_id', id);
        });
    }
    deleteDepartment(id, department_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .into('trabill_departments')
                .update({ department_is_deleted: 1, department_deleted_by })
                .where('trabill_departments.department_id', id);
        });
    }
}
exports.default = DepartmentsModel;
//# sourceMappingURL=departments.models.js.map