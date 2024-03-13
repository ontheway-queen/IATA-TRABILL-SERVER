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
class RoomTypeModel extends abstract_models_1.default {
    createRoomType(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const roomType = yield this.query()
                .insert(Object.assign(Object.assign({}, data), { rtype_org_agency: this.org_agency }))
                .into('trabill_room_types');
            return roomType[0];
        });
    }
    viewRoomTypes(page, size) {
        return __awaiter(this, void 0, void 0, function* () {
            const page_number = (page - 1) * size;
            return yield this.query()
                .from('trabill_room_types')
                .select('rtype_id', 'rtype_name', 'rtype_create_date', 'rtype_org_agency as agency_id')
                .where('rtype_org_agency', null)
                .orWhere('rtype_org_agency', this.org_agency)
                .andWhere('rtype_is_deleted', 0)
                .orderBy('rtype_id', 'desc')
                .limit(size)
                .offset(page_number);
        });
    }
    countRoomTypeDataRow() {
        return __awaiter(this, void 0, void 0, function* () {
            const [count] = yield this.query()
                .select(this.db.raw(`count(*) as row_count`))
                .from('trabill_room_types')
                .where('rtype_is_deleted', 0)
                .andWhere('rtype_org_agency', null)
                .orWhere('rtype_org_agency', this.org_agency);
            return count.row_count;
        });
    }
    getAllRoomTypes() {
        return __awaiter(this, void 0, void 0, function* () {
            const by_clients = yield this.query()
                .from('trabill_room_types')
                .select('rtype_id', 'rtype_name', 'rtype_create_date', 'rtype_org_agency as agency_id')
                .where('rtype_org_agency', this.org_agency)
                .andWhere('rtype_is_deleted', 0)
                .orderBy('rtype_name');
            const by_default = yield this.query()
                .from('trabill_room_types')
                .select('rtype_id', 'rtype_name', 'rtype_create_date', 'rtype_org_agency as agency_id')
                .where('rtype_org_agency', null)
                .andWhere('rtype_is_deleted', 0)
                .orderBy('rtype_name');
            return [...by_clients, ...by_default];
        });
    }
    editRoomType(data, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .into('trabill_room_types')
                .update(data)
                .where('rtype_id', id)
                .whereNot('rtype_is_deleted', 1)
                .andWhereNot('rtype_org_agency', null);
        });
    }
    deleteRoomType(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .into('trabill_room_types')
                .update({ rtype_is_deleted: 1 })
                .where('rtype_id', id)
                .andWhereNot('rtype_org_agency', null);
        });
    }
}
exports.default = RoomTypeModel;
//# sourceMappingURL=roomTypes.models.js.map