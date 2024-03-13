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
const Models_1 = __importDefault(require("../common/model/Models"));
const customError_1 = __importDefault(require("../common/utils/errors/customError"));
const deleteFIle_1 = __importDefault(require("../common/utils/fileRemover/deleteFIle"));
class AbstractServices {
    constructor() {
        this.deleteFile = new deleteFIle_1.default();
        // @Models
        this.models = new Models_1.default();
        this.generateVoucher = (req, type) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.CommonModels(req);
            const voucher = yield conn.generateVoucher(type);
            return voucher;
        });
        this.updateVoucher = (req, type) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.CommonModels(req);
            yield conn.updateVoucher(type);
        });
        this.insertAudit = (req, audit_action, audit_content, audit_user_id, audit_module_type) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.CommonModels(req);
            if (!audit_user_id) {
                throw new customError_1.default('Please provide user id for add audit', 400, 'Empty user id');
            }
            yield conn.insertAuditData(audit_action, audit_content, audit_user_id, audit_module_type);
        });
    }
}
exports.default = AbstractServices;
//# sourceMappingURL=abstract.services.js.map