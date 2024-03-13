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
class PassportStatusModel extends abstract_models_1.default {
    createPassportStatus(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const passportStatus = yield this.query()
                .insert(Object.assign(Object.assign({}, data), { pstatus_org_agency: this.org_agency }))
                .into('trabill_passport_status');
            return passportStatus[0];
        });
    }
    updatePassportStatus(data, status_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .into('trabill_passport_status')
                .update(data)
                .where('pstatus_id', status_id);
        });
    }
    getAllPassportStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            const by_clients = yield this.query()
                .from('trabill_passport_status')
                .select('pstatus_id', 'pstatus_name', 'pstatus_create_date', 'pstatus_org_agency as agency_id')
                .where('pstatus_org_agency', this.org_agency)
                .andWhere('pstatus_is_deleted', 0)
                .orderBy('pstatus_create_date', 'desc');
            const by_default = yield this.query()
                .from('trabill_passport_status')
                .select('pstatus_id', 'pstatus_name', 'pstatus_create_date', 'pstatus_org_agency as agency_id')
                .where('pstatus_org_agency', null)
                .andWhere('pstatus_is_deleted', 0)
                .orderBy('pstatus_create_date', 'desc');
            return [...by_clients, ...by_default];
        });
    }
    deletePassportStatus(status_id, pstatus_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .into('trabill_passport_status')
                .update({ pstatus_is_deleted: 1, pstatus_deleted_by })
                .where('pstatus_id', status_id);
        });
    }
}
exports.default = PassportStatusModel;
//# sourceMappingURL=passportStatus.models.js.map