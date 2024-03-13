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
class MahramModel extends abstract_models_1.default {
    createMahram(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const mahram = yield this.query()
                .insert(Object.assign(Object.assign({}, data), { maharam_org_agency: this.org_agency }))
                .into('trabill_maharams');
            return mahram[0];
        });
    }
    updateMahram(data, maharam_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .into('trabill_maharams')
                .update(data)
                .where('maharam_id', maharam_id)
                .whereNot('maharam_is_deleted', 1);
        });
    }
    viewMahrams(page, size) {
        return __awaiter(this, void 0, void 0, function* () {
            const page_number = (page - 1) * size;
            return yield this.query()
                .from('trabill_maharams')
                .select('maharam_id', 'maharam_name', 'maharam_org_agency as agency_id')
                .where('maharam_org_agency', null)
                .orWhere('maharam_org_agency', this.org_agency)
                .andWhereNot('maharam_is_deleted', 1)
                .orderBy('maharam_create_date', 'desc')
                .limit(size)
                .offset(page_number);
        });
    }
    countMahramsDataRow() {
        return __awaiter(this, void 0, void 0, function* () {
            const [count] = yield this.query()
                .select(this.db.raw(`COUNT(*) as row_count`))
                .from('trabill_maharams')
                .whereNot('maharam_is_deleted', 1)
                .andWhere('maharam_org_agency', null)
                .orWhere('maharam_org_agency', this.org_agency);
            return count.row_count;
        });
    }
    getAllMahrams() {
        return __awaiter(this, void 0, void 0, function* () {
            const by_clients = yield this.query()
                .from('trabill_maharams')
                .select('maharam_id', 'maharam_name', 'maharam_org_agency as agency_id')
                .where('maharam_org_agency', this.org_agency)
                .andWhereNot('maharam_is_deleted', 1)
                .orderBy('maharam_create_date', 'desc');
            const by_default = yield this.query()
                .from('trabill_maharams')
                .select('maharam_id', 'maharam_name', 'maharam_org_agency as agency_id')
                .where('maharam_org_agency', null)
                .andWhereNot('maharam_is_deleted', 1)
                .orderBy('maharam_create_date', 'desc');
            return [...by_clients, ...by_default];
        });
    }
    deleteMahram(maharam_id, maharam_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .into('trabill_maharams')
                .update({ maharam_is_deleted: 1, maharam_deleted_by })
                .where('maharam_id', maharam_id)
                .whereNot('maharam_is_deleted', 1);
        });
    }
}
exports.default = MahramModel;
//# sourceMappingURL=mahram.models.js.map