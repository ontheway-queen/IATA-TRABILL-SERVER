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
class VisaTypeModel extends abstract_models_1.default {
    createVisaType(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const visaType = yield this.query()
                .insert(Object.assign(Object.assign({}, data), { type_org_agency: this.org_agency }))
                .into('trabill_visa_types');
            return visaType[0];
        });
    }
    editVisaType(data, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const visaType = yield this.query()
                .update(data)
                .into('trabill_visa_types')
                .where('trabill_visa_types.type_id', id)
                .whereNotNull('type_org_agency');
            if (visaType) {
                return visaType;
            }
            else {
                throw new customError_1.default(`You can't update this visa provide that id you was created`, 400, 'Bad ID');
            }
        });
    }
    viewVisaType(page = '1', size = '20') {
        return __awaiter(this, void 0, void 0, function* () {
            page = Number(page);
            size = Number(size);
            const page_number = (page - 1) * size;
            const visaTypes = yield this.query()
                .from('trabill_visa_types')
                .select('type_id', 'type_name', 'type_created_by', 'type_org_agency as agency_id')
                .where('type_org_agency', null)
                .orWhere('type_org_agency', this.org_agency)
                .andWhere('type_is_deleted', 0)
                .orderBy('type_name')
                .limit(size)
                .offset(page_number);
            return visaTypes;
        });
    }
    countVisaTypeDataRow() {
        return __awaiter(this, void 0, void 0, function* () {
            const [count] = yield this.query()
                .select(this.db.raw(`count(*) as row_count`))
                .from('trabill_visa_types')
                .where('type_org_agency', null)
                .orWhere('type_org_agency', this.org_agency)
                .andWhere('type_is_deleted', 0);
            return count.row_count;
        });
    }
    getAllVisaType() {
        return __awaiter(this, void 0, void 0, function* () {
            const by_clients = yield this.query()
                .from('trabill_visa_types')
                .select('type_id', 'type_name', 'type_created_by', 'type_org_agency as agency_id')
                .where('type_org_agency', this.org_agency)
                .andWhere('type_is_deleted', 0)
                .orderBy('type_name');
            const by_default = yield this.query()
                .from('trabill_visa_types')
                .select('type_id', 'type_name', 'type_created_by', 'type_org_agency as agency_id')
                .where('type_org_agency', null)
                .andWhere('type_is_deleted', 0)
                .orderBy('type_name');
            return [...by_clients, ...by_default];
        });
    }
    deleteVisaType(type_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const visaTypes = yield this.query()
                .from('trabill_visa_types')
                .update({ type_is_deleted: 1 })
                .where({ type_id })
                .whereNotNull('type_org_agency');
            if (visaTypes) {
                return visaTypes;
            }
            else {
                throw new customError_1.default(`You can't delete this visa provide that id you was created`, 400, 'Bad ID');
            }
        });
    }
}
exports.default = VisaTypeModel;
//# sourceMappingURL=visaTypes.models.js.map