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
class AirportsModel extends abstract_models_1.default {
    createAirports(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const newData = data.map((item) => {
                return Object.assign(Object.assign({}, item), { airline_org_agency: this.org_agency });
            });
            const airport = yield this.query().insert(newData).into('trabill_airports');
            return airport[0];
        });
    }
    viewAirports(page, size) {
        return __awaiter(this, void 0, void 0, function* () {
            const page_number = (page - 1) * size;
            return yield this.query()
                .select('airline_id', 'airline_airport', 'airline_iata_code', 'airline_country_id', 'airline_created_by', 'airline_org_agency as agency_id', 'country_name', 'airline_is_deleted')
                .from('trabill_airports')
                .whereNot('airline_is_deleted', 1)
                .andWhere('airline_org_agency', this.org_agency)
                .orWhere('airline_org_agency', null)
                .orderBy('airline_create_date', 'desc')
                .leftJoin('trabill_countries', {
                'trabill_countries.country_id': 'trabill_airports.airline_country_id',
            })
                .limit(size)
                .offset(page_number);
        });
    }
    countAirportsDataRow() {
        return __awaiter(this, void 0, void 0, function* () {
            const [count] = yield this.query()
                .select(this.db.raw(`count(*) as row_count`))
                .from('trabill_airports')
                .where('airline_is_deleted', 0)
                .andWhere('airline_org_agency', null)
                .orWhere('airline_org_agency', this.org_agency);
            return count.row_count;
        });
    }
    getAllAirports() {
        return __awaiter(this, void 0, void 0, function* () {
            const by_clients = yield this.query()
                .from('trabill_airports')
                .select('airline_id', 'airline_airport', 'airline_iata_code', 'airline_country_id', 'airline_created_by', 'airline_org_agency as agency_id', 'country_name')
                .leftJoin('trabill_countries', {
                'trabill_countries.country_id': 'trabill_airports.airline_country_id',
            })
                .where('airline_org_agency', this.org_agency)
                .andWhere('airline_is_deleted', 0)
                .orderBy('airline_airport');
            const by_default = yield this.query()
                .from('trabill_airports')
                .select('airline_id', 'airline_airport', 'airline_iata_code', 'airline_country_id', 'airline_created_by', 'airline_org_agency as agency_id', 'country_name')
                .leftJoin('trabill_countries', {
                'trabill_countries.country_id': 'trabill_airports.airline_country_id',
            })
                .where('airline_org_agency', null)
                .andWhere('airline_is_deleted', 0)
                .orderBy('airline_airport');
            return [...by_clients, ...by_default];
        });
    }
    getAirportById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const airport = yield this.query()
                .select('airline_id', 'airline_airport', 'airline_iata_code')
                .from('trabill_airports')
                .where('trabill_airports.airline_id', id)
                .leftJoin('trabill_countries', {
                'trabill_countries.country_id': 'trabill_airports.airline_country_id',
            })
                .select('country_name');
            return airport[0];
        });
    }
    deleteAirport(airline_id, airline_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .into('trabill_airports')
                .update({ airline_is_deleted: 1, airline_deleted_by })
                .where('airline_id', airline_id);
        });
    }
    editAirport(body, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .into('trabill_airports')
                .update(body)
                .where('airline_id', id);
        });
    }
    getAllCountries() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .from('trabill_countries')
                .select('country_id', 'country_name', 'country_iso3', 'country_phonecode')
                .where('countries_org_agency', null)
                .orWhere('countries_org_agency', this.org_agency)
                .andWhereNot('country_is_deleted', 1)
                .orderBy('country_id', 'asc');
        });
    }
}
exports.default = AirportsModel;
//# sourceMappingURL=airports.model.js.map