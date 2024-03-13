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
class AppConfigModels extends abstract_models_1.default {
    getAllOffice() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select(`office_id`, `office_name`, `office_address`, `office_email`, `office_created_date`, this.db.raw(`concat(trabill_users.user_first_name,' ',trabill_users.user_last_name) as created_by`))
                .from(`rcm.rcm_office as ro`)
                .leftJoin(`${this.database}.trabill_users`, {
                'trabill_users.user_id': 'ro.office_created_by',
            })
                .where('ro.office_org_agency', this.org_agency);
            const [{ row_count }] = yield this.db(`rcm.rcm_office as ro`)
                .count('* as row_count')
                .where('ro.office_org_agency', this.org_agency);
            return { count: row_count, data };
        });
    }
    getAllClientByOffice(page, size, search, office_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const offset = (page - 1) * size;
            const data = yield this.query()
                .select(`rc.rclient_id`, `rc.rclient_name`, `rc.rclient_created_date`, `rc.rclient_phone`, `rc.rclient_email`, `rc.rclient_nid_no`, `rc.rclient_image`, `rclient_present_age`)
                .from(`rcm.rcm_office as ro`)
                .where(`ro.office_id`, office_id)
                .where('ro.office_org_agency', this.org_agency)
                .leftJoin(`rcm.rcm_manpowers as rm`, {
                'rm.manpower_office_id': 'ro.office_id',
            })
                .leftJoin(`rcm.rcm_clients as rc`, {
                'rc.rclient_id': 'rm.manpower_client_id',
            })
                .modify((e) => {
                if (search) {
                    e.whereRaw(`LOWER(rc.rclient_name) LIKE ? `, [`%${search}%`]);
                }
            })
                .limit(size)
                .offset(offset);
            const [office_name] = yield this.db(`rcm.rcm_office as ro`)
                .select('ro.office_name')
                .where(`ro.office_id`, office_id);
            const [{ row_count }] = yield this.db(`rcm.rcm_office as ro`)
                .count('* as row_count')
                .where(`ro.office_id`, office_id)
                .leftJoin(`rcm.rcm_manpowers as rm`, {
                'rm.manpower_office_id': 'ro.office_id',
            })
                .leftJoin(`rcm.rcm_clients as rc`, {
                'rc.rclient_id': 'rm.manpower_client_id',
            })
                .modify((e) => {
                if (search) {
                    e.whereRaw(`LOWER(rc.rclient_name) LIKE ? `, [`%${search}%`]);
                }
            })
                .where('ro.office_org_agency', this.org_agency);
            return { row_count, data: Object.assign(Object.assign({}, office_name), { data }) };
        });
    }
    getAllOfficeForEdit(office_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select(`office_id`, `office_name`, `office_address`, `office_email`, `office_created_date`, this.db.raw(`concat(trabill_users.user_first_name,' ',trabill_users.user_last_name) as created_by`))
                .from(`rcm.rcm_office as ro`)
                .leftJoin(`${this.database}.trabill_users`, {
                'trabill_users.user_id': 'ro.office_created_by',
            })
                .where('ro.office_org_agency', this.org_agency)
                .andWhere('office_id', office_id);
            return data;
        });
    }
    viewAllOffice() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select(`office_id`, `office_name`, `office_address`, `office_email`, `office_created_date`, this.db.raw(`concat(trabill_users.user_first_name,' ',trabill_users.user_last_name) as created_by`))
                .from(`rcm.rcm_office as ro`)
                .leftJoin(`${this.database}.trabill_users`, {
                'trabill_users.user_id': 'ro.office_created_by',
            })
                .where('ro.office_org_agency', this.org_agency);
            return data;
        });
    }
    createOffice(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const [id] = yield this.db(`rcm.rcm_office`).insert(Object.assign(Object.assign({}, data), { office_org_agency: this.org_agency }));
            return id;
        });
    }
    editOffice(data, office_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db(`rcm.rcm_office as ro`)
                .update(data)
                .where('ro.office_id', office_id)
                .andWhere('ro.office_org_agency', this.org_agency);
        });
    }
    deleteOffice(office_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db(`rcm.rcm_office as ro`)
                .delete()
                .where('ro.office_id', office_id)
                .andWhere('ro.office_org_agency', this.org_agency);
        });
    }
    getAppConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            const [data] = (yield this.query()
                .select(`tac_org_id`, `tac_inv_cs`, `tac_inv_as`, `tac_inv_iw`, `tac_inv_in`, `tac_inv_sd`, `tac_inv_mob`, `tac_ait_cal`, `tac_wtr_mark`, 'tac_airticket_type', `tac_sig_url`, `tac_wtr_mark_url`, `tac_signtr`, `tac_due_wtr_mark`, `tac_paid_wtr_mark`, `tac_auto_sms`, `tac_invoice_footer_note`, `tac_inv_curr_sym`, `tac_auto_email`)
                .from('trabill_app_config')
                .where('tac_org_id', this.org_agency));
            return data;
        });
    }
    updateAppConfig(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const config = yield this.db('trabill_app_config')
                .select('tac_org_id', 'tac_sig_url')
                .where('tac_org_id', this.org_agency);
            if (!config.length) {
                yield this.db('trabill_app_config').insert(Object.assign(Object.assign({}, data), { tac_org_id: this.org_agency }));
            }
            else {
                return yield this.db('trabill_app_config')
                    .update(data)
                    .where('tac_org_id', this.org_agency);
            }
        });
    }
    updateAppConfigSignature(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.db('trabill_app_config')
                .update(Object.assign({}, data))
                .where('tac_org_id', this.org_agency);
        });
    }
}
exports.default = AppConfigModels;
//# sourceMappingURL=appConfig.models.js.map