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
class ServicesPassportStatus extends abstract_services_1.default {
    constructor() {
        super();
        // comment
        this.T_createPassportStatus = (req) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.models.configModel
                .passportStatusModel(req)
                .createPassportStatus(req.body);
            return { success: true, data: { pstatus_id: data } };
        });
        this.viewPassports = (req) => __awaiter(this, void 0, void 0, function* () {
            const { page, size, search, from_date, to_date } = req.query;
            const { client_id, combined_id } = req.body;
            const conn = this.models.passportModel(req);
            const data = yield conn.viewPassports(Number(page) || 1, Number(size) || 20, search, from_date, to_date, client_id, combined_id);
            return Object.assign({ success: true }, data);
        });
        this.getAllPassports = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.passportModel(req);
            const data = yield conn.getAllPassports();
            return { success: true, data };
        });
        this.T_updatePassportStatus = (req) => __awaiter(this, void 0, void 0, function* () {
            const { status_id } = req.params;
            const data = yield this.models.configModel
                .passportStatusModel(req)
                .updatePassportStatus(req.body, status_id);
            if (data === 0) {
                throw new customError_1.default('Please provide a valid Id to update', 400, 'Update failed');
            }
            return { success: true, data };
        });
        this.T_readPassportStatus = (req) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.models.configModel
                .passportStatusModel(req)
                .getAllPassportStatus();
            return { success: true, data };
        });
        this.T_deletePassportStatus = (req) => __awaiter(this, void 0, void 0, function* () {
            const { status_id } = req.params;
            const { deleted_by } = req.body;
            const data = yield this.models.configModel
                .passportStatusModel(req)
                .deletePassportStatus(status_id, deleted_by);
            return { success: true, data };
        });
    }
}
exports.default = ServicesPassportStatus;
//# sourceMappingURL=passportStatus.services.js.map