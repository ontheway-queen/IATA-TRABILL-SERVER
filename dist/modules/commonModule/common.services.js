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
Object.defineProperty(exports, "__esModule", { value: true });
class CommonServices {
    constructor(conn) {
        this.generateVouchers = (req) => __awaiter(this, void 0, void 0, function* () {
            const voucher_type = req.params.type;
            const data = yield this.conn.generateVoucher(voucher_type);
            return {
                success: true,
                message: `Voucher number for ${voucher_type}`,
                data,
            };
        });
        this.insertAudit = (audit_action, audit_content, audit_user_id, audit_module_type) => __awaiter(this, void 0, void 0, function* () {
            yield this.conn.insertAuditData(audit_action, audit_content, audit_user_id, audit_module_type);
        });
        this.generateVoucher = (req, type) => __awaiter(this, void 0, void 0, function* () {
            return yield this.conn.generateVoucher(type);
        });
        this.updateVoucher = (req, type) => __awaiter(this, void 0, void 0, function* () {
            return yield this.conn.updateVoucher(type);
        });
        this.conn = conn;
    }
}
exports.default = CommonServices;
//# sourceMappingURL=common.services.js.map