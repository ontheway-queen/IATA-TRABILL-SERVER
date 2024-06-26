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
const dayjs_1 = __importDefault(require("dayjs"));
const abstract_services_1 = __importDefault(require("../../../abstracts/abstract.services"));
const invoice_helpers_1 = require("../../../common/helpers/invoice.helpers");
const sendEmail_helper_1 = __importDefault(require("../../../common/helpers/sendEmail.helper"));
const passportEmail_templates_1 = require("../../../common/templates/passportEmail.templates");
const customError_1 = __importDefault(require("../../../common/utils/errors/customError"));
const lib_1 = __importDefault(require("../../../common/utils/libraries/lib"));
class PassportServices extends abstract_services_1.default {
    constructor() {
        super();
        /**
         * Add/ Upload Passport
         */
        this.addPassport = (req) => __awaiter(this, void 0, void 0, function* () {
            const { client_id, passport_info, passport_created_by } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.passportModel(req, trx);
                const app_config_conn = this.models.configModel.appConfig(req, trx);
                const passportParseInfo = JSON.parse(passport_info);
                const files = req.files;
                const { org_name, org_address1, org_mobile_number, org_owner_email, org_logo, } = yield conn.getOrganizationInfo();
                const appConfig = yield app_config_conn.getAppConfig();
                const PassportData = {
                    passport_person_type: passportParseInfo.passport_person_type,
                    passport_passport_no: passportParseInfo.passport_no,
                    passport_name: passportParseInfo.name,
                    passport_mobile_no: passportParseInfo.mobile_no,
                    passport_date_of_birth: passportParseInfo.date_of_birth &&
                        (0, dayjs_1.default)(passportParseInfo.date_of_birth).format('YYYY-MM-DD HH:mm:ss.SSS'),
                    passport_date_of_issue: passportParseInfo.date_of_issue &&
                        (0, dayjs_1.default)(passportParseInfo.date_of_issue).format('YYYY-MM-DD HH:mm:ss.SSS'),
                    passport_date_of_expire: passportParseInfo.date_of_expire &&
                        (0, dayjs_1.default)(passportParseInfo.date_of_expire).format('YYYY-MM-DD HH:mm:ss.SSS'),
                    passport_email: passportParseInfo.email,
                    passport_nid_no: passportParseInfo.nid,
                    passport_created_by: passport_created_by,
                };
                if (files) {
                    files.map((item) => {
                        if (item.fieldname === 'passport_scan_copy')
                            PassportData.passport_scan_copy = item.filename;
                        if (item.fieldname === 'passport_upload_photo')
                            PassportData.passport_upload_photo = item.filename;
                        if (item.fieldname === 'passport_upload_others')
                            PassportData.passport_upload_others = item.filename;
                    });
                }
                const { email } = passportParseInfo;
                const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if ((appConfig === null || appConfig === void 0 ? void 0 : appConfig.tac_auto_email) === 1 && email && regex.test(email)) {
                    yield sendEmail_helper_1.default.sendEmail({
                        to: email,
                        subject: 'Your Passport',
                        html: (0, passportEmail_templates_1.createPassport)(passportParseInfo.passport_no, org_name, org_owner_email, org_mobile_number, org_logo, org_address1),
                    });
                }
                // // CLIENT AND COMBINED CLIENT
                if (client_id) {
                    const { invoice_client_id, invoice_combined_id } = (0, invoice_helpers_1.getClientOrCombId)(client_id);
                    PassportData.passport_client_id = invoice_client_id;
                    PassportData.passport_combined_id = invoice_combined_id;
                }
                const passport_id = yield conn.addPassport(PassportData);
                // insert audit
                const message = `ADDED PASSPORT, PASSPORT NO ${passportParseInfo.passport_no}`;
                yield this.insertAudit(req, 'create', message, passport_created_by, 'PASSPORT');
                return {
                    success: true,
                    message: 'Passport added successfully',
                    data: passport_id,
                };
            }));
        });
        /**
         * Edit Passport
         */
        this.editPassport = (req) => __awaiter(this, void 0, void 0, function* () {
            const { passport_no, name, mobile_no, date_of_birth, date_of_issue, date_of_expire, email, nid, passport_created_by, passport_person_type, } = req.body;
            const { passport_id } = req.params;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.passportModel(req, trx);
                const files = req.files;
                const { passport_scan_copy, passport_upload_others, passport_upload_photo, } = yield conn.getPassportInfo(passport_id);
                const passportInfo = {
                    passport_passport_no: passport_no,
                    passport_name: name,
                    passport_mobile_no: mobile_no,
                    passport_date_of_birth: date_of_birth,
                    passport_date_of_issue: date_of_issue,
                    passport_date_of_expire: date_of_expire,
                    passport_email: email,
                    passport_nid_no: nid,
                    passport_person_type,
                };
                if (files) {
                    files.map((item) => {
                        if (item.fieldname === 'passport_scan_copy') {
                            passportInfo.passport_scan_copy = item.filename;
                            if (passport_scan_copy)
                                this.manageFile.deleteFromCloud([passport_scan_copy]);
                        }
                        if (item.fieldname === 'passport_upload_photo') {
                            passportInfo.passport_upload_photo = item.filename;
                            if (passport_upload_photo)
                                this.manageFile.deleteFromCloud([passport_upload_photo]);
                        }
                        if (item.fieldname === 'passport_upload_others') {
                            passportInfo.passport_upload_others = item.filename;
                            if (passport_upload_others)
                                this.manageFile.deleteFromCloud([passport_upload_others]);
                        }
                    });
                }
                const passport_ids = yield conn.editPassport(passportInfo, passport_id);
                // insert audit
                const message = `Passport updated successfully`;
                yield this.insertAudit(req, 'update', message, passport_created_by, 'PASSPORT');
                return {
                    success: true,
                    message: 'Passport edited successfully',
                    data: passport_ids,
                };
            }));
        });
        this.allPassports = (req) => __awaiter(this, void 0, void 0, function* () {
            let { page, size, search, from_date, to_date, filter: client_id, } = req.query;
            let client = null;
            let combined = null;
            client_id = client_id === 'undefined' ? '' : client_id;
            if (client_id) {
                const { invoice_client_id, invoice_combined_id } = (0, invoice_helpers_1.getClientOrCombId)(client_id);
                client = invoice_client_id;
                combined = invoice_combined_id;
            }
            const conn = this.models.passportModel(req);
            const data = yield conn.viewPassports(Number(page) || 1, Number(size) || 20, search, from_date, to_date, client, combined);
            return Object.assign({ success: true }, data);
        });
        this.getPassportsForSelect = (req) => __awaiter(this, void 0, void 0, function* () {
            const { search } = req.query;
            const conn = this.models.passportModel(req);
            const data = yield conn.getPassportsForSelect(search);
            return { success: true, data };
        });
        this.singlePassport = (req) => __awaiter(this, void 0, void 0, function* () {
            const { passport_id } = req.params;
            const conn = this.models.passportModel(req);
            const data = yield conn.singlePassport(passport_id);
            return { success: true, data };
        });
        this.changePassportSts = (req) => __awaiter(this, void 0, void 0, function* () {
            const { status_pstatus_id, status_create_date, status_created_by, status_sms_content, status_sms_content_client, passport_holder_number, client_number, } = req.body;
            const { passport_id } = req.params;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.passportModel(req, trx);
                const sms_conn = this.models.smsModel(req, trx);
                const app_config_conn = this.models.configModel.appConfig(req, trx);
                const { tac_auto_email } = yield app_config_conn.getAppConfig();
                const { passport_email, passport_passport_no } = yield conn.viewPassportDetails(passport_id);
                const { org_sms_api_key, org_sms_client_id } = yield sms_conn.getSmsApiAndClientID();
                const { pstatus_name } = yield conn.getSingleStatus(status_pstatus_id);
                const { org_name, org_address1, org_mobile_number, org_owner_email, org_logo, } = yield conn.getOrganizationInfo();
                const smsInfo = {
                    smslog_for: 'PASSPORT_STATUS_CHANGE',
                    smslog_passport_id: passport_id,
                    smslog_delivery_status: 'DELIVERED',
                };
                if (passport_holder_number && org_sms_api_key && org_sms_client_id) {
                    lib_1.default.sendSms(passport_holder_number, status_sms_content, org_sms_api_key, org_sms_client_id);
                    smsInfo.smslog_mobile = passport_holder_number;
                    smsInfo.smslog_content = status_sms_content;
                }
                if (client_number && org_sms_api_key && org_sms_client_id) {
                    lib_1.default.sendSms(client_number, status_sms_content_client, org_sms_api_key, org_sms_client_id);
                    smsInfo.smslog_mobile = client_number;
                    smsInfo.smslog_content = status_sms_content_client;
                }
                const statusId = yield conn.changePassportSts(status_pstatus_id, passport_id);
                const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (pstatus_name.toLowerCase() === 'delhi' ||
                    pstatus_name.toLowerCase() === 'approved') {
                    if (tac_auto_email === 1 &&
                        passport_email &&
                        regex.test(passport_email)) {
                        yield sendEmail_helper_1.default.sendEmail({
                            to: passport_email,
                            subject: 'Your Passport',
                            html: pstatus_name.toLowerCase() === 'delhi'
                                ? (0, passportEmail_templates_1.updatePassportStatus)(passport_passport_no, org_name, org_owner_email, org_mobile_number, org_logo, org_address1)
                                : (0, passportEmail_templates_1.completePassportStatus)(passport_passport_no, org_name, org_owner_email, org_mobile_number, org_logo, org_address1),
                        });
                    }
                }
                // ======================
                const passporStatusUpdateInfo = {
                    passport_status_id: statusId,
                    passport_status_change_date: status_create_date,
                };
                yield conn.statusPassport(passporStatusUpdateInfo, passport_id);
                yield conn.smsLog(smsInfo);
                yield conn.updatePstatusId(status_pstatus_id, passport_id);
                const message = `UPDATED PASSPORT STATUS`;
                yield this.insertAudit(req, 'update', message, status_created_by, 'PASSPORT');
                return {
                    success: true,
                    message: 'Passport status changed successfully',
                    data: statusId,
                };
            }));
        });
        /**
         * Passport status
         */
        this.getStatus = (req) => __awaiter(this, void 0, void 0, function* () {
            const { passport_id } = req.params;
            const conn = this.models.passportModel(req);
            const data = yield conn.getPassportStatus(passport_id);
            return { success: true, data };
        });
        /**
         * Passport status
         */
        this.passportNumberIsUnique = (req) => __awaiter(this, void 0, void 0, function* () {
            const { passport_no } = req.params;
            if (!passport_no) {
                throw new customError_1.default('Please provide a passport_no', 400, 'Empty data');
            }
            const conn = this.models.passportModel(req);
            const data = yield conn.passportNumberIsUnique(passport_no);
            if (data > 0) {
                return {
                    success: true,
                    data: false,
                    message: 'Passport no. is exists',
                };
            }
            else {
                return {
                    success: true,
                    data: true,
                    message: 'Passport no. is unique',
                };
            }
        });
        this.deletePassport = (req) => __awaiter(this, void 0, void 0, function* () {
            const { passport_id } = req.params;
            const { deleted_by } = req.body;
            const conn = this.models.passportModel(req);
            const prev_files = yield conn.getPassportFiles(passport_id);
            prev_files.length && (yield this.manageFile.deleteFromCloud(prev_files));
            yield conn.deletePassport(passport_id, deleted_by);
            return {
                success: true,
                data: true,
                message: 'Passport no. is unique',
            };
        });
    }
}
exports.default = PassportServices;
//# sourceMappingURL=passport.services.js.map