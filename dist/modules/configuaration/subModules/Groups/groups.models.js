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
class GroupModel extends abstract_models_1.default {
    createGroup(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const group = yield this.query()
                .insert(Object.assign(Object.assign({}, data), { group_org_agency: this.org_agency }))
                .into('trabill_haji_group');
            return group[0];
        });
    }
    updateGroup(data, group_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.query()
                .into('trabill_haji_group')
                .update(data)
                .where('group_id', group_id);
        });
    }
    getGroupName(group_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .from('trabill_haji_group')
                .select('group_name')
                .where('group_id', group_id);
            return data[0].group_name;
        });
    }
    viewGroups(page, size) {
        return __awaiter(this, void 0, void 0, function* () {
            const page_number = (page - 1) * size;
            return yield this.query()
                .from('trabill_haji_group')
                .select('group_id', 'group_type', 'group_name', 'group_org_agency as agency_id')
                .where('group_org_agency', null)
                .orWhere('group_org_agency', this.org_agency)
                .andWhereNot('group_is_deleted', 1)
                .orderBy('group_create_date', 'desc')
                .limit(size)
                .offset(page_number);
        });
    }
    countGroupsDataRow() {
        return __awaiter(this, void 0, void 0, function* () {
            const [count] = yield this.query()
                .select(this.db.raw(`COUNT(*) as row_count`))
                .from('trabill_haji_group')
                .where('group_org_agency', null)
                .orWhere('group_org_agency', this.org_agency)
                .andWhereNot('group_is_deleted', 1);
            return count.row_count;
        });
    }
    getAllGroups() {
        return __awaiter(this, void 0, void 0, function* () {
            const clients = yield this.query()
                .from('trabill_haji_group')
                .select('group_id', 'group_type', 'group_name', 'group_org_agency as agency_id')
                .where('group_org_agency', this.org_agency)
                .andWhereNot('group_is_deleted', 1)
                .orderBy('group_create_date', 'desc');
            const agencys = yield this.query()
                .from('trabill_haji_group')
                .select('group_id', 'group_type', 'group_name', 'group_org_agency as agency_id')
                .where('group_org_agency', null)
                .andWhereNot('group_is_deleted', 1)
                .orderBy('group_create_date', 'desc');
            return [...clients, ...agencys];
        });
    }
    deleteGroups(group_id, group_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.query()
                .from('trabill_haji_group')
                .update({ group_is_deleted: 1, group_deleted_by })
                .where('group_id', group_id);
        });
    }
}
exports.default = GroupModel;
//# sourceMappingURL=groups.models.js.map