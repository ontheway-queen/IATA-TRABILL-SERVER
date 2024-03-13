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
const customError_1 = __importDefault(require("../../../../common/utils/errors/customError"));
class TransportTypeModels extends abstract_models_1.default {
    insertTransportType(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = yield this.query()
                .insert(Object.assign(Object.assign({}, data), { ttype_org_agency: this.org_agency }))
                .into('trabill_transport_types');
            return id[0];
        });
    }
    viewTransportTypes(page, size) {
        return __awaiter(this, void 0, void 0, function* () {
            const page_number = (page - 1) * size;
            return yield this.query()
                .from('trabill_transport_types')
                .select('ttype_id', 'ttype_name', 'ttype_status', 'ttype_create_date', 'ttype_org_agency as agency_id')
                .where('ttype_org_agency', null)
                .orWhere('ttype_org_agency', this.org_agency)
                .whereNot('ttype_has_deleted', 1)
                .orderBy('ttype_name')
                .limit(size)
                .offset(page_number);
        });
    }
    countTransportType() {
        return __awaiter(this, void 0, void 0, function* () {
            const [count] = yield this.query()
                .select(this.db.raw(`count(*) as row_count`))
                .from('trabill_transport_types')
                .where('ttype_org_agency', null)
                .orWhere('ttype_org_agency', this.org_agency)
                .whereNot('ttype_has_deleted', 1);
            return count.row_count;
        });
    }
    getAllTransportTypes() {
        return __awaiter(this, void 0, void 0, function* () {
            const by_default = yield this.query()
                .select('ttype_id', 'ttype_name', 'ttype_status', 'ttype_create_date', 'ttype_org_agency as agency_id')
                .andWhere('ttype_org_agency', null)
                .andWhereNot('ttype_has_deleted', 1)
                .orderBy('ttype_id', 'desc');
            const by_client = yield this.query()
                .from('trabill_transport_types')
                .select('ttype_id', 'ttype_name', 'ttype_status', 'ttype_create_date', 'ttype_org_agency as agency_id')
                .andWhere('ttype_org_agency', this.org_agency)
                .whereNot('ttype_has_deleted', 1)
                .orderBy('ttype_id', 'desc');
            return [...by_client, ...by_default];
        });
    }
    updateTransportType(data, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const isSuccess = yield this.query()
                .into('trabill_transport_types')
                .update(data)
                .whereNot('ttype_has_deleted', 1)
                .andWhere('ttype_id', id)
                .whereNotNull('ttype_org_agency');
            if (isSuccess === 0) {
                throw new customError_1.default('Please provide a valid Id', 400, 'Bad request');
            }
        });
    }
    deleteTransportType(id, ttype_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            const isSuccess = yield this.query()
                .into('trabill_transport_types')
                .update({ ttype_has_deleted: 1, ttype_deleted_by })
                .where('ttype_id', id)
                .whereNotNull('ttype_org_agency')
                .andWhereNot('ttype_has_deleted', 1);
            if (isSuccess === 0) {
                throw new customError_1.default('Pleace provide valid id', 400, 'Bad request');
            }
        });
    }
}
exports.default = TransportTypeModels;
//# sourceMappingURL=transportTypes.models.js.map