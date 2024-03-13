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
class AgencyModel extends abstract_models_1.default {
    createAgency(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const agency = yield this.query()
                .insert(Object.assign(Object.assign({}, data), { agency_org_agency: this.org_agency }))
                .into('trabill_agency');
            return agency[0];
        });
    }
    updateAgency(body, agency_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const agency = yield this.query()
                .into('trabill_agency')
                .update(body)
                .where('agency_id', agency_id);
            return agency;
        });
    }
    viewAgencies(page, size) {
        return __awaiter(this, void 0, void 0, function* () {
            const page_number = (page - 1) * size;
            return (yield this.query()
                .from('trabill_agency')
                .select('agency_id', 'agency_name')
                .orderBy('agency_create_date', 'desc')
                .where('agency_is_deleted', 0)
                .andWhere('agency_org_agency', this.org_agency)
                .limit(size)
                .offset(page_number));
        });
    }
    countAgencysDataRow() {
        return __awaiter(this, void 0, void 0, function* () {
            const [count] = yield this.query()
                .select(this.db.raw(`COUNT(*) as row_count`))
                .from('trabill_agency')
                .where('agency_is_deleted', 0)
                .andWhere('agency_org_agency', this.org_agency);
            return count.row_count;
        });
    }
    getAgencies() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .from('trabill_agency')
                .select('agency_id', 'agency_name')
                .orderBy('agency_create_date', 'desc')
                .where('agency_is_deleted', 0)
                .andWhere('agency_org_agency', this.org_agency);
        });
    }
    deleteAgencies(agency_id, agency_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .into('trabill_agency')
                .update({ agency_is_deleted: 1, agency_deleted_by })
                .where('agency_id', agency_id);
        });
    }
}
exports.default = AgencyModel;
//# sourceMappingURL=agency.model.js.map