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
class AirlineModel extends abstract_models_1.default {
    createAirlines(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const airline = yield this.query()
                .insert(Object.assign(Object.assign({}, data), { airline_org_agency: this.org_agency }))
                .into('trabill_airlines');
            return airline[0];
        });
    }
    updateAirlines(data, airline_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .into('trabill_airlines')
                .update(data)
                .where('airline_id', airline_id)
                .where('airline_is_deleted', 0);
        });
    }
    deleteAirline(airline_id, airline_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .into('trabill_airlines')
                .update({ airline_is_deleted: 1, airline_deleted_by })
                .where('airline_id', airline_id);
        });
    }
    viewAirlines(page, size) {
        return __awaiter(this, void 0, void 0, function* () {
            const page_number = (page - 1) * size;
            return (yield this.query()
                .from('trabill_airlines')
                .select('airline_id', 'airline_name', 'airline_org_agency as agency_id', 'airline_create_date')
                .where('airline_is_deleted', 0)
                .andWhere('airline_org_agency', this.org_agency)
                .union(this.query()
                .from('trabill_airlines')
                .select('airline_id', 'airline_name', 'airline_org_agency as agency_id', 'airline_create_date')
                .where('airline_is_deleted', 0)
                .andWhere('airline_org_agency', null))
                .orderBy('airline_create_date', 'desc')
                .limit(size)
                .offset(page_number));
        });
    }
    countAirliensDataRow() {
        return __awaiter(this, void 0, void 0, function* () {
            const [count] = yield this.query()
                .select(this.db.raw('COUNT(*) as row_count'))
                .from('trabill_airlines')
                .where('airline_is_deleted', 0)
                .andWhere('airline_org_agency', null)
                .orWhere('airline_org_agency', this.org_agency);
            return count.row_count;
        });
    }
    getAirlines() {
        return __awaiter(this, void 0, void 0, function* () {
            const by_clients = yield this.query()
                .from('trabill_airlines')
                .select('airline_id', 'airline_name', 'airline_org_agency as agency_id')
                .where('airline_is_deleted', 0)
                .orderBy('airline_create_date', 'desc')
                .andWhere('airline_org_agency', this.org_agency);
            const by_default = yield this.query()
                .from('trabill_airlines')
                .select('airline_id', 'airline_name', 'airline_org_agency as agency_id')
                .where('airline_is_deleted', 0)
                .orderBy('airline_create_date', 'desc')
                .andWhere('airline_org_agency', null);
            return [...by_clients, ...by_default];
        });
    }
}
exports.default = AirlineModel;
//# sourceMappingURL=airlines.modals.js.map