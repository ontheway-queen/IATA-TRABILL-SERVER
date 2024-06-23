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
const abstract_services_1 = __importDefault(require("../../../../abstracts/abstract.services"));
const customError_1 = __importDefault(require("../../../../common/utils/errors/customError"));
class AppConfigServices extends abstract_services_1.default {
    constructor() {
        super();
        this.getAppConfig = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.configModel.appConfig(req);
            const data = yield conn.getAppConfig();
            return { success: true, data };
        });
        this.updateAppConfig = (req) => __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const conn = this.models.configModel.appConfig(req);
            yield conn.updateAppConfig(body);
            return { success: true, message: 'App configuration updated successfully' };
        });
        this.updateAppConfigSignature = (req) => __awaiter(this, void 0, void 0, function* () {
            const files = req.files;
            const customBody = {};
            const conn = this.models.configModel.appConfig(req);
            const { tac_sig_url, tac_wtr_mark_url } = yield conn.getAppConfigInfo();
            if (files) {
                files.map((item) => {
                    if (item.fieldname === 'tac_sig_url') {
                        customBody.tac_sig_url = item.filename;
                        if (tac_sig_url)
                            this.manageFile.deleteFromCloud([tac_sig_url]);
                    }
                    if (item.fieldname === 'tac_wtr_mark_url') {
                        customBody.tac_wtr_mark_url = item.filename;
                        if (tac_wtr_mark_url)
                            this.manageFile.deleteFromCloud([tac_wtr_mark_url]);
                    }
                });
            }
            yield conn.updateAppConfigSignature(customBody);
            return { success: true, message: 'App configuration updated successfully' };
        });
        // SIGNATURE
        this.addSignature = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.configModel.appConfig(req);
            const body = req.body;
            const files = req.files;
            if (body.sig_type === 'AUTHORITY') {
                const count = yield conn.checkSignatureTypeIsExist();
                if (count) {
                    yield this.manageFile.deleteFromCloud([files[0].filename]);
                    throw new customError_1.default('An authority signature already exists!', 400, 'Authority exists');
                }
            }
            const sig_data = {
                sig_employee_id: body.sig_employee_id,
                sig_user_id: body.sig_user_id,
                sig_type: body.sig_type,
                sig_name_title: body.sig_name_title,
                sig_position: body.sig_position,
                sig_company_name: body.sig_company_name,
                sig_address: body.sig_address,
                sig_city: body.sig_city,
                sig_state: body.sig_state,
                sig_zip_code: body.sig_zip_code,
                sig_email: body.sig_email,
                sig_signature: files[0].filename,
                sig_org_id: req.agency_id,
                sig_created_by: req.user_id,
                sig_phone_no: body.sig_phone_no,
            };
            yield conn.insertSignature(sig_data);
            return { success: true, imageUrlObj: files[0].filename };
        });
        this.updateSignature = (req) => __awaiter(this, void 0, void 0, function* () {
            const sig_id = req.params.sig_id;
            const conn = this.models.configModel.appConfig(req);
            const body = req.body;
            const files = req.files;
            const sig_data = {
                sig_employee_id: body.sig_employee_id,
                sig_user_id: body.sig_user_id,
                sig_type: body.sig_type,
                sig_name_title: body.sig_name_title,
                sig_position: body.sig_position,
                sig_company_name: body.sig_company_name,
                sig_address: body.sig_address,
                sig_city: body.sig_city,
                sig_state: body.sig_state,
                sig_zip_code: body.sig_zip_code,
                sig_email: body.sig_email,
                sig_org_id: req.agency_id,
                sig_created_by: req.user_id,
                sig_phone_no: body.sig_phone_no,
            };
            if (files[0].filename)
                sig_data.sig_signature = files[0].filename;
            yield conn.updateSignature(sig_data, sig_id);
            // DELETE PREVIOUS SIGNATURE
            if (files[0].filename) {
                const signature = yield conn.previousSignature(sig_id);
                signature && (yield this.manageFile.deleteFromCloud([signature]));
            }
            return { success: true, imageUrlObj: files[0].filename };
        });
        this.updateSignatureStatus = (req) => __awaiter(this, void 0, void 0, function* () {
            const sig_id = req.params.sig_id;
            const conn = this.models.configModel.appConfig(req);
            const { status } = req.body;
            yield conn.updateSignatureStatus(status, sig_id);
            return { success: true };
        });
        this.getSignatures = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.configModel.appConfig(req);
            const data = yield conn.selectSignature();
            return Object.assign({ success: true }, data);
        });
    }
}
exports.default = AppConfigServices;
//# sourceMappingURL=appConfig.services.js.map