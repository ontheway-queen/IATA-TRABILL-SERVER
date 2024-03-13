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
class DesignationModel extends abstract_models_1.default {
    createDesignation(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const designation = yield this.query()
                .insert(Object.assign(Object.assign({}, data), { designation_org_agency: this.org_agency }))
                .into('trabill_designations');
            return designation[0];
        });
    }
    viewDesignations(page, size) {
        return __awaiter(this, void 0, void 0, function* () {
            const page_number = (page - 1) * size;
            return yield this.query()
                .select('designation_id', 'designation_name', 'designation_create_date', 'designation_created_by', 'designation_is_deleted', 'designation_org_agency as agency_id')
                .from('trabill_designations')
                .where('designation_org_agency', null)
                .orWhere('designation_org_agency', this.org_agency)
                .andWhereNot('designation_is_deleted', 1)
                .orderBy('designation_name')
                .limit(size)
                .offset(page_number);
        });
    }
    countDesignationsDataRow() {
        return __awaiter(this, void 0, void 0, function* () {
            const [count] = yield this.query()
                .select(this.db.raw(`count(*) as row_count`))
                .from('trabill_designations')
                .where('designation_org_agency', null)
                .orWhere('designation_org_agency', this.org_agency)
                .andWhereNot('designation_is_deleted', 1);
            return count.row_count;
        });
    }
    getAllDesignations() {
        return __awaiter(this, void 0, void 0, function* () {
            const by_clients = yield this.query()
                .select('designation_id', 'designation_name', 'designation_create_date', 'designation_created_by', 'designation_is_deleted', 'designation_org_agency as agency_id')
                .from('trabill_designations')
                .whereNot('designation_is_deleted', 1)
                .where('designation_org_agency', this.org_agency)
                .orderBy('designation_name');
            const by_default = yield this.query()
                .select('designation_id', 'designation_name', 'designation_create_date', 'designation_created_by', 'designation_is_deleted', 'designation_org_agency as agency_id')
                .from('trabill_designations')
                .whereNot('designation_is_deleted', 1)
                .andWhere('designation_org_agency', null)
                .orderBy('designation_name');
            return [...by_clients, ...by_default];
        });
    }
    deleteDesignation(id, designation_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .into('trabill_designations')
                .update({ designation_is_deleted: 1, designation_deleted_by })
                .where('designation_id', id);
        });
    }
    editDesignation(data, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .into('trabill_designations')
                .update(data)
                .where('trabill_designations.designation_id', id)
                .whereNot('designation_is_deleted', 1);
        });
    }
}
exports.default = DesignationModel;
//# sourceMappingURL=designations.models.js.map