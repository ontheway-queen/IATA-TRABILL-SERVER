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
class CompanyModel extends abstract_models_1.default {
    createCompany(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const visaType = yield this.query()
                .insert(Object.assign(Object.assign({}, data), { company_org_agency: this.org_agency }))
                .into('trabill_companies');
            return visaType[0];
        });
    }
    updateCompany(data, company_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .into('trabill_companies')
                .update(data)
                .where('company_id', company_id);
        });
    }
    deleteCompany(company_id, company_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .into('trabill_companies')
                .update({ company_is_deleted: 1, company_deleted_by })
                .where('company_id', company_id);
        });
    }
    viewCompanies(page, size) {
        return __awaiter(this, void 0, void 0, function* () {
            const page_number = (page - 1) * size;
            const data = yield this.query()
                .select('company_id', 'company_name', 'company_contact_person', 'company_designation', 'company_phone', 'company_create_date', 'company_address', 'company_org_agency as agency_id')
                .from('trabill_companies')
                .where('company_is_deleted', 0)
                .andWhere('company_org_agency', this.org_agency)
                .orderBy('company_id', 'desc')
                .limit(size)
                .offset(page_number);
            const [{ row_count }] = yield this.query()
                .select(this.db.raw('COUNT(*) as row_count'))
                .from('trabill_companies')
                .where('company_is_deleted', 0)
                .andWhere('company_org_agency', this.org_agency);
            return { count: row_count, data };
        });
    }
    getAllCompanies() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .select('company_id', 'company_name', 'company_contact_person', 'company_designation', 'company_phone', 'company_create_date', 'company_address', 'company_org_agency as agency_id')
                .from('trabill_companies')
                .where('company_is_deleted', 0)
                .andWhere('company_org_agency', this.org_agency)
                .orderBy('company_id', 'desc');
        });
    }
}
exports.default = CompanyModel;
//# sourceMappingURL=companies.model.js.map