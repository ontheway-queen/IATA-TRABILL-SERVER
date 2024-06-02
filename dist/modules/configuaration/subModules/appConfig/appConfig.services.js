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
            const imageList = req.imgUrl;
            const getImageWithURL = imageList.reduce((acc, image) => Object.assign(acc, image), { tac_sig_url: '', tac_wtr_mark_url: '' });
            const customBody = {};
            if (getImageWithURL.tac_sig_url) {
                customBody.tac_sig_url = getImageWithURL.tac_sig_url;
            }
            if (getImageWithURL.tac_wtr_mark_url) {
                customBody.tac_wtr_mark_url = getImageWithURL.tac_wtr_mark_url;
            }
            const conn = this.models.configModel.appConfig(req);
            yield conn.updateAppConfigSignature(customBody);
            return { success: true, message: 'App configuration updated successfully' };
        });
        // SIGNATURE
        this.addSignature = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.configModel.appConfig(req);
            const body = req.body;
            const imageList = req.imgUrl;
            const imageUrlObj = Object.assign({}, ...imageList);
            if (body.sig_type === 'AUTHORITY') {
                const count = yield conn.checkSignatureTypeIsExist();
                if (count) {
                    yield this.deleteFile.delete_image(imageUrlObj.sig_signature);
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
                sig_signature: imageUrlObj.sig_signature,
                sig_org_id: req.agency_id,
                sig_created_by: req.user_id,
            };
            yield conn.insertSignature(sig_data);
            return { success: true, imageUrlObj };
        });
        this.updateSignature = (req) => __awaiter(this, void 0, void 0, function* () {
            const sig_id = req.params.sig_id;
            const conn = this.models.configModel.appConfig(req);
            const body = req.body;
            const imageList = req.imgUrl;
            const imageUrlObj = Object.assign({}, ...imageList);
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
                sig_signature: (body === null || body === void 0 ? void 0 : body.sig_signature) || (imageUrlObj === null || imageUrlObj === void 0 ? void 0 : imageUrlObj.sig_signature) || null,
                sig_org_id: req.agency_id,
                sig_created_by: req.user_id,
            };
            yield conn.updateSignature(sig_data, sig_id);
            // DELETE PREVIOUS SIGNATURE
            if (!(body === null || body === void 0 ? void 0 : body.sig_signature)) {
                const signature = yield conn.previousSignature(sig_id);
                yield this.deleteFile.delete_image(signature);
            }
            return { success: true, imageUrlObj };
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