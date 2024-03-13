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
const abstract_services_1 = __importDefault(require("../../../abstracts/abstract.services"));
const chequeManagement_helpers_1 = __importDefault(require("../utils/chequeManagement.helpers"));
class chequesServices extends abstract_services_1.default {
    constructor() {
        super();
        // get all cheques
        this.getAllCheques = (req) => __awaiter(this, void 0, void 0, function* () {
            const { status } = req.query;
            const { page, size } = req.query;
            const conn = this.models.chequesModels(req);
            const data = yield conn.getAllCheques(status, Number(page) || 1, Number(size) || 20);
            return Object.assign({ success: true, message: 'All cheques' }, data);
        });
        // UPDATE CHEQUE STATUS
        this.updateChequeStatus = (req) => __awaiter(this, void 0, void 0, function* () {
            const { cheque_type, user_id } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.chequesModels(req, trx);
                const agent_conn = this.models.agentProfileModel(req, trx);
                let message = 'Cheque updated';
                if (cheque_type === 'MR_ADVR') {
                    message = yield chequeManagement_helpers_1.default.moneyReceiptAdvrChequeStatus(req, conn, trx);
                }
                else if (cheque_type === 'EXPENSE') {
                    message = yield chequeManagement_helpers_1.default.expenseChequeStatus(req, conn, trx);
                }
                else if (cheque_type === 'LOAN') {
                    message = yield chequeManagement_helpers_1.default.loanChequeStatusUpdate(req, conn, trx);
                }
                else if (cheque_type === 'LOAN_PAYMENT') {
                    message = yield chequeManagement_helpers_1.default.loanPaymentChequeStatus(req, conn, trx);
                }
                else if (cheque_type === 'LOAN_RECEIVED') {
                    message = yield chequeManagement_helpers_1.default.loanReceivedChequeStatus(req, conn, trx);
                }
                else if (cheque_type === 'MONEY_RECEIPT') {
                    message = yield chequeManagement_helpers_1.default.moneyReceiptChequeUpdate(req, conn, trx, agent_conn);
                }
                else if (cheque_type === 'PAYROLL') {
                    message = yield chequeManagement_helpers_1.default.payrollChequeUpdate(req, conn, trx);
                }
                else if (cheque_type === 'VENDOR_ADVR') {
                    message = yield chequeManagement_helpers_1.default.vendorAdvanceRetrundCheque(req, conn, trx);
                }
                else if (cheque_type === 'VENDOR_PAYMENT') {
                    message = yield chequeManagement_helpers_1.default.vendorPaymentCheque(req, conn, trx);
                }
                yield this.insertAudit(req, 'update', message, user_id, 'CHEQUE');
                return { success: true, message };
            }));
        });
    }
}
exports.default = chequesServices;
//# sourceMappingURL=cheques.services.js.map