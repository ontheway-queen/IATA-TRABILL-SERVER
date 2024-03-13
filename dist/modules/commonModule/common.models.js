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
const abstract_models_1 = __importDefault(require("../../abstracts/abstract.models"));
class CommonModels extends abstract_models_1.default {
    constructor() {
        super(...arguments);
        this.generateVoucher = (voucher_type) => __awaiter(this, void 0, void 0, function* () {
            const [[[voucher]]] = yield this.db.raw(`call ${this.database}.get_voucher_num('${voucher_type}', ${this.org_agency})`);
            return voucher.voucher_number;
        });
        this.updateVoucher = (voucher_type) => __awaiter(this, void 0, void 0, function* () {
            yield this.db.raw(`call ${this.database}.updateVoucherNumber('${voucher_type}', ${this.org_agency})`);
        });
    }
    insertAuditData(audit_action, audit_content, audit_user_id, audit_module_type) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db
                .queryBuilder()
                .insert({
                audit_action,
                audit_content,
                audit_user_id,
                audit_module_type,
                audit_org_agency: this.org_agency,
            })
                .into('trabill_audit_history');
        });
    }
}
exports.default = CommonModels;
//# sourceMappingURL=common.models.js.map