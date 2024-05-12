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
    constructor() {
        super(...arguments);
        // SIGNATURE
        this.insertSignature = (data) => __awaiter(this, void 0, void 0, function* () {
            return yield this.db('trabill_signature_info').insert(data);
        });
        this.updateSignature = (data, sig_id) => __awaiter(this, void 0, void 0, function* () {
            return yield this.db('trabill_signature_info')
                .update(data)
                .where('sig_id', sig_id);
        });
        this.updateSignatureStatus = (sig_status, sig_id) => __awaiter(this, void 0, void 0, function* () {
            return yield this.db('trabill_signature_info')
                .update({ sig_status })
                .where('sig_id', sig_id);
        });
        this.previousSignature = (sig_id) => __awaiter(this, void 0, void 0, function* () {
            const [data] = yield this.db('trabill_signature_info')
                .select('sig_signature')
                .where('sig_id', sig_id);
            return data === null || data === void 0 ? void 0 : data.sig_signature;
        });
        this.selectSignature = () => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.db('trabill_signature_info')
                .select('sig_id', 'sig_org_id', 'sig_employee_id', 'employee_full_name', 'sig_user_id', 'pre_by.user_full_name as prepared_by', 'sig_type', 'sig_name_title', 'sig_position', 'sig_company_name', 'sig_address', 'sig_city', 'sig_state', 'sig_zip_code', 'sig_phone_number', 'sig_email', 'sig_signature', 'sig_created_date as created_date', 'sig_status', 'created_by.user_full_name as created_by')
                .where('sig_org_id', this.org_agency)
                .leftJoin('trabill_users as created_by', {
                'created_by.user_id': 'sig_created_by',
            })
                .leftJoin('trabill_users as pre_by', { 'pre_by.user_id': 'sig_user_id' })
                .leftJoin('trabill_employees', { employee_id: 'sig_employee_id' });
            const [{ count }] = (yield this.db('trabill_signature_info').count('* as count'));
            return { data, count };
        });
    }
    getAppConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            const [data] = (yield this.query()
                .select(`tac_org_id`, `tac_inv_cs`, `tac_inv_as`, `tac_inv_iw`, `tac_inv_in`, `tac_inv_sd`, `tac_inv_mob`, `tac_ait_cal`, `tac_wtr_mark`, 'tac_airticket_type', `tac_sig_url`, `tac_wtr_mark_url`, `tac_signtr`, `tac_due_wtr_mark`, `tac_paid_wtr_mark`, `tac_auto_sms`, `tac_invoice_footer_note`, `tac_inv_curr_sym`, `tac_auto_email`, `tac_wk_day`)
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