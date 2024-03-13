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
class AppConfigServices extends abstract_services_1.default {
    constructor() {
        super();
        this.getAllOffice = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.configModel.appConfig(req);
            const data = yield conn.getAllOffice();
            return Object.assign({ success: true }, data);
        });
        this.getAllClientByOffice = (req) => __awaiter(this, void 0, void 0, function* () {
            const { page, size, search } = req.query;
            const { office_id } = req.params;
            const conn = this.models.configModel.appConfig(req);
            const data = yield conn.getAllClientByOffice(Number(page) || 1, Number(size) || 20, search, office_id);
            return Object.assign({ success: true }, data);
        });
        this.getAllOfficeForEdit = (req) => __awaiter(this, void 0, void 0, function* () {
            const { office_id } = req.params;
            const conn = this.models.configModel.appConfig(req);
            const data = yield conn.getAllOfficeForEdit(office_id);
            return { success: true, data };
        });
        this.viewAllOffice = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.configModel.appConfig(req);
            const data = yield conn.viewAllOffice();
            return { success: true, data };
        });
        this.createOffice = (req) => __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const { office_created_by } = req.body;
            const conn = this.models.configModel.appConfig(req);
            const data = yield conn.createOffice(body);
            const message = 'Office has been created';
            yield this.insertAudit(req, 'create', message, office_created_by, 'RCM');
            return { success: true, message: 'Office created successfully', data };
        });
        this.editOffice = (req) => __awaiter(this, void 0, void 0, function* () {
            const { office_id } = req.params;
            const body = req.body;
            const { office_updated_by } = req.body;
            const conn = this.models.configModel.appConfig(req);
            yield conn.editOffice(body, office_id);
            const message = 'Office has been updated';
            yield this.insertAudit(req, 'update', message, office_updated_by, 'RCM');
            return { success: true, message: 'Office updated successfully' };
        });
        this.deleteOffice = (req) => __awaiter(this, void 0, void 0, function* () {
            const { office_id } = req.params;
            const { deleted_by } = req.body;
            const conn = this.models.configModel.appConfig(req);
            yield conn.deleteOffice(office_id);
            const message = 'Office has been deleted';
            yield this.insertAudit(req, 'delete', message, deleted_by, 'RCM');
            return { success: true, message: 'Office deleted successfully' };
        });
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
    }
}
exports.default = AppConfigServices;
//# sourceMappingURL=appConfig.services.js.map