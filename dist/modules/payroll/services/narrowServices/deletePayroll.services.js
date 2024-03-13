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
const Trxns_1 = __importDefault(require("../../../../common/helpers/Trxns"));
class DeletePayroll extends abstract_services_1.default {
    constructor() {
        super();
        this.deletePayrollServices = (req) => __awaiter(this, void 0, void 0, function* () {
            const payrollId = req.params.id;
            const { payroll_deleted_by } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.payrollModel(req, trx);
                let { previous_net_balance, prev_acctrxn_id, prev_pay_type, prev_payroll_charge_id, } = yield conn.getPrevTransectionAmount(payrollId);
                if (prev_pay_type !== 4) {
                    yield new Trxns_1.default(req, trx).deleteAccTrxn(prev_acctrxn_id);
                }
                if (prev_pay_type == 4) {
                    yield conn.deletePrevPayrollCheque(payrollId, payroll_deleted_by);
                }
                if (prev_payroll_charge_id) {
                    yield this.models
                        .vendorModel(req, trx)
                        .deleteOnlineTrxnCharge(prev_payroll_charge_id);
                }
                yield conn.deletePayroll(payrollId, payroll_deleted_by);
                yield conn.deleteAllPayrollDeductions(payrollId, payroll_deleted_by);
                yield this.insertAudit(req, 'delete', `Payroll has been delete ${previous_net_balance}/-`, payroll_deleted_by, 'PAYROLL');
                return {
                    success: true,
                    message: 'Payroll deleted successfuly',
                };
            }));
        });
    }
}
exports.default = DeletePayroll;
//# sourceMappingURL=deletePayroll.services.js.map