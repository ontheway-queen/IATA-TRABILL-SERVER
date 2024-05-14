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
class PnrDetailsModels extends abstract_models_1.default {
    airportIdByCode(airportCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const [data] = yield this.query()
                .select('airline_id')
                .from('trabill_airports')
                .whereNot('airline_is_deleted', 1)
                .andWhere('airline_iata_code', airportCode);
            return data.airline_id;
        });
    }
    airlineIdByCode(airlineCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const [data] = yield this.query()
                .select('airline_id')
                .from('trabill_airlines')
                .whereNot('airline_is_deleted', 1)
                .andWhere('airline_code', airlineCode);
            return data.airline_id;
        });
    }
}
exports.default = PnrDetailsModels;
//# sourceMappingURL=pnr_details.models.js.map