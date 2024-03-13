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
const abstract_models_1 = __importDefault(require("../../../abstracts/abstract.models"));
const customError_1 = __importDefault(require("../../../common/utils/errors/customError"));
class PassportModel extends abstract_models_1.default {
    constructor() {
        super(...arguments);
        this.updatePassport = (data) => __awaiter(this, void 0, void 0, function* () {
            const [passport_id] = yield this.query()
                .insert(Object.assign(Object.assign({}, data), { passport_org_agency: this.org_agency }))
                .into('trabill_passport_details')
                .onConflict('passport_id')
                .merge(data);
            return passport_id;
        });
        this.passportNumberIsUnique = (passport_no) => __awaiter(this, void 0, void 0, function* () {
            const [passport] = yield this.query()
                .from('trabill_passport_details')
                .select(this.db.raw('COUNT(*) as total'))
                .where('passport_org_agency', this.org_agency)
                .andWhere('passport_passport_no', passport_no)
                .andWhereNot('passport_is_deleted', 1);
            return passport.total;
        });
        this.deletePassport = (passport_id, passport_deleted_by) => __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update({ passport_is_deleted: 1, passport_deleted_by })
                .into('trabill_passport_details')
                .where('passport_id', passport_id);
        });
    }
    addPassport(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const passport = yield this.query()
                .insert(Object.assign(Object.assign({}, data), { passport_org_agency: this.org_agency }))
                .into('trabill_passport_details');
            return passport[0];
        });
    }
    editPassport(data, passport_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const passport = yield this.query()
                .update(data)
                .into('trabill_passport_details')
                .where('passport_id', passport_id);
            return passport;
        });
    }
    viewPassports(page, size, search_text, from_date, to_date, client_id, combined_id) {
        return __awaiter(this, void 0, void 0, function* () {
            search_text && search_text.toLocaleLowerCase();
            const page_number = (page - 1) * size;
            const data = yield this.query()
                .select('passport_org_agency', 'passport_id', 'pstatus_name', 'passport_client_id', 'client_name', 'client_mobile', 'passport_name', 'passport_passport_no', 'passport_mobile_no', 'passport_date_of_birth', 'passport_date_of_issue', 'passport_date_of_expire', 'passport_create_date', 'passport_email', 'passport_scan_copy', 'passport_upload_photo', 'passport_upload_others', 'rclient_name')
                .from('trabill_passport_details')
                .leftJoin('trabill_clients', { client_id: 'passport_client_id' })
                .leftJoin('trabill_combined_clients', {
                combine_id: 'passport_combined_id',
            })
                .leftJoin(this.db.raw(`trabill_passport_status ON pstatus_id = passport_status_id AND pstatus_is_deleted = 0`))
                .leftJoin(this.db.raw(`rcm.rcm_clients ON trabill.trabill_passport_details.passport_rec_cl_id = rcm.rcm_clients.rclient_id AND rclient_is_deleted = 0`))
                .where('passport_is_deleted', 0)
                .andWhere((builder) => {
                builder.andWhere('passport_org_agency', this.org_agency).modify((e) => {
                    if (from_date && to_date) {
                        e.andWhereRaw(`DATE_FORMAT(passport_create_date, '%Y-%m-%d') BETWEEN ? AND ?`, [from_date, to_date]);
                    }
                    if (search_text) {
                        e.andWhereRaw(`LOWER(passport_name) LIKE ?`, [`%${search_text}%`])
                            .orWhereRaw(`LOWER(passport_passport_no) LIKE ?`, [
                            `%${search_text}%`,
                        ])
                            .orWhereRaw(`LOWER(passport_mobile_no) LIKE ?`, [
                            `%${search_text}%`,
                        ]);
                    }
                    if (client_id !== null) {
                        e.andWhere('passport_client_id', client_id);
                    }
                    if (combined_id !== null) {
                        e.andWhere('passport_combined_id', combined_id);
                    }
                });
            })
                .andWhere('passport_org_agency', this.org_agency)
                .orderBy('passport_create_date', 'desc')
                .limit(size)
                .offset(page_number);
            const [{ row_count }] = yield this.query()
                .select(this.db.raw(`count(*) as row_count`))
                .where('passport_is_deleted', 0)
                .andWhere((builder) => {
                builder.andWhere('passport_org_agency', this.org_agency).modify((e) => {
                    if (from_date && to_date) {
                        e.andWhereRaw(`DATE_FORMAT(passport_create_date, '%Y-%m-%d') BETWEEN ? AND ?`, [from_date, to_date]);
                    }
                    if (search_text) {
                        e.andWhereRaw(`LOWER(passport_name) LIKE ?`, [`%${search_text}%`])
                            .orWhereRaw(`LOWER(passport_passport_no) LIKE ?`, [
                            `%${search_text}%`,
                        ])
                            .orWhereRaw(`LOWER(passport_mobile_no) LIKE ?`, [
                            `%${search_text}%`,
                        ]);
                    }
                    if (client_id !== null) {
                        e.andWhere('passport_client_id', client_id);
                    }
                    if (combined_id !== null) {
                        e.andWhere('passport_combined_id', combined_id);
                    }
                });
            })
                .from('trabill_passport_details')
                .where('passport_is_deleted', 0)
                .andWhere('passport_org_agency', this.org_agency);
            return { count: row_count, data };
        });
    }
    getPassportsForSelect(search) {
        return __awaiter(this, void 0, void 0, function* () {
            const passports = yield this.query()
                .select('passport_id', 'passport_name', 'passport_passport_no')
                .from('trabill_passport_details')
                .whereNot('passport_is_deleted', 1)
                .whereNotNull('passport_passport_no')
                .andWhere('passport_org_agency', this.org_agency)
                .orderBy('passport_create_date', 'desc')
                .modify((event) => {
                if (search) {
                    event
                        .where('passport_passport_no', 'like', `%${search}%`)
                        .orWhere('passport_name', 'like', `%${search}%`);
                }
            })
                .orderBy('passport_passport_no');
            return passports;
        });
    }
    getAllPassports() {
        return __awaiter(this, void 0, void 0, function* () {
            const passports = yield this.query()
                .select('passport_id', 'passport_client_id', 'client_name', 'client_mobile', 'passport_name', 'passport_passport_no', 'passport_mobile_no', 'passport_date_of_birth', 'passport_date_of_issue', 'passport_date_of_expire', 'passport_email', 'passport_scan_copy')
                .leftJoin('trabill_clients', { client_id: 'passport_client_id' })
                .from('trabill_passport_details')
                .whereNot('passport_is_deleted', 1)
                .andWhere('passport_org_agency', this.org_agency)
                .orderBy('passport_create_date', 'desc');
            return passports;
        });
    }
    singlePassport(passport_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [passport] = yield this.query()
                .select(this.db.raw("CASE WHEN passport_client_id IS NOT NULL THEN CONCAT('client-',passport_client_id) ELSE CONCAT('combined-',passport_combined_id) END AS client_id"), 'passport_person_type', 'passport_id', 'passport_name as name', 'passport_passport_no as passport_no', 'passport_nid_no', 'passport_mobile_no as mobile_no', 'passport_date_of_birth as date_of_birth', 'passport_date_of_issue as date_of_issue', 'passport_date_of_expire as date_of_expire', 'passport_email as email', 'passport_scan_copy', 'passport_nid_no as nid', 'passport_upload_photo', 'passport_upload_others')
                .from('trabill_passport_details')
                .leftJoin('trabill_clients', { client_id: 'passport_client_id' })
                .where('passport_id', passport_id)
                .andWhereNot('passport_is_deleted', 1);
            return passport;
        });
    }
    passportScanCopy(passport_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [passports] = yield this.query()
                .select('passport_scan_copy', 'passport_upload_photo', 'passport_upload_others')
                .from('trabill_passport_details')
                .where('passport_id', passport_id)
                .andWhereNot('passport_is_deleted', 1)
                .orderBy('passport_create_date', 'desc');
            return passports;
        });
    }
    changePassportSts(passport_status_id, passport_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const status = yield this.query()
                .update({ passport_status_id })
                .into('trabill_passport_details')
                .where({ passport_id: passport_id });
            return status;
        });
    }
    statusPassport(data, passport_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const passport = yield this.query()
                .update(data)
                .into('trabill_passport_details')
                .where('passport_id', passport_id);
            return passport;
        });
    }
    smsLog(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const sms = yield this.query()
                .insert(Object.assign(Object.assign({}, data), { smslog_org_agency: this.org_agency }))
                .into('trabill_sms_logs');
            return sms[0];
        });
    }
    getPassportStatus(passport_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const status = yield this.query()
                .select('pstatus_name AS status_title', 'passport_client_id as client_id', 'passport_id', 'passport_name as name', 'passport_passport_no as passport_no', 'passport_mobile_no as mobile_no', 'passport_date_of_birth as date_of_birth', 'passport_date_of_issue as date_of_issue', 'passport_date_of_expire as date_of_expire', 'passport_email as email')
                .from('trabill_passport_details')
                .where('passport_id', passport_id);
            return status;
        });
    }
    updatePstatusId(status_id, pass_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update({ passport_status_id: status_id })
                .into('trabill_passport_details')
                .where('passport_id', pass_id);
        });
    }
    viewPassportDetails(passport_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [data] = (yield this.query()
                .select('passport_passport_no', 'passport_mobile_no', 'passport_email')
                .from('trabill_passport_details')
                .whereNot('passport_is_deleted', 1)
                .andWhere('passport_org_agency', this.org_agency)
                .andWhere('passport_id', passport_id));
            if (!data) {
                throw new customError_1.default('Please provide a valid id', 404, 'Bad request');
            }
            return data;
        });
    }
    getSingleStatus(status_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [data] = (yield this.query()
                .select('pstatus_name')
                .from('trabill_passport_status')
                .where({ pstatus_id: status_id }));
            return data;
        });
    }
    getOrganizationInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            const [data] = (yield this.query()
                .select('org_owner_full_name', 'org_owner_email', 'org_mobile_number', 'org_address1', 'org_name', 'org_logo')
                .from('trabill_agency_organization_information')
                .where('org_id', this.org_agency));
            return data;
        });
    }
}
exports.default = PassportModel;
//# sourceMappingURL=passport.models.js.map