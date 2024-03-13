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
const abstract_models_1 = __importDefault(require("../../../abstracts/abstract.models"));
class chequesModels extends abstract_models_1.default {
    constructor() {
        super(...arguments);
        this.updateExpenceChequeStatus = (updatedData, chequeId) => __awaiter(this, void 0, void 0, function* () {
            const success = yield this.query()
                .update(updatedData)
                .into('trabill_expense_cheque_details')
                .where('expcheque_id', chequeId);
            return success;
        });
        this.updateExpenseAccoutInfo = (data, cheque_id) => __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .update(data)
                .into('trabill_expenses')
                .leftJoin('trabill_expense_cheque_details', {
                'trabill_expense_cheque_details.expcheque_expense_id': 'trabill_expenses.expense_id',
            })
                .where('expcheque_id', cheque_id);
        });
        this.getExpenseInfoForCheque = (cheque_id) => __awaiter(this, void 0, void 0, function* () {
            const [data] = (yield this.query()
                .select('expense_vouchar_no')
                .from('trabill_expense_cheque_details')
                .leftJoin('trabill_expenses', { expense_id: 'expcheque_expense_id' })
                .where('expcheque_id', cheque_id));
            return data;
        });
        this.updateAdvrChequeStatus = (updatedData, chequeId) => __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .update(updatedData)
                .into('trabill_advance_return_cheque_details')
                .where('cheque_id', chequeId);
        });
        this.updateAdvrChequeAccountClientInfo = (data, cheque_id) => __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .update(data)
                .into('trabill_advance_return')
                .leftJoin('trabill_advance_return_cheque_details', {
                'trabill_advance_return.advr_id': 'trabill_advance_return_cheque_details.cheque_advr_id',
            })
                .where('cheque_id', cheque_id)
                .andWhere('advr_org_agency', this.org_agency);
        });
        this.loanChequeUpdate = (updatedData, chequeId) => __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .update(updatedData)
                .into('trabill_loan_cheque_details')
                .where('lcheque_id', chequeId);
        });
        this.updateLoanAccountInfo = (data, cheque_id) => __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .update(data)
                .into('trabill_loans')
                .leftJoin('trabill_loan_cheque_details', {
                'trabill_loan_cheque_details.lcheque_loan_id': 'trabill_loans.loan_id',
            })
                .where('lcheque_id', cheque_id);
        });
        this.insertLoanCheque = (updatedData) => __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .insert(updatedData)
                .into('trabill_loan_cheque_details')
                .onConflict('lcheque_id')
                .merge();
        });
        this.updateLPayChequeStatus = (updatedData, chequeId) => __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .update(updatedData)
                .into('trabill_loan_payment_cheque_details')
                .where('lpcheque_id', chequeId);
        });
        this.updateLoanPaymentAccountInfo = (data, cheque_id) => __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .update(data)
                .into('trabill_loan_payment')
                .leftJoin('trabill_loan_payment_cheque_details', {
                'trabill_loan_payment_cheque_details.lpcheque_payment_id': 'trabill_loan_payment.payment_id',
            })
                .where('lpcheque_id', cheque_id);
        });
        this.getLoanPaymentInfoForChq = (cheque_id) => __awaiter(this, void 0, void 0, function* () {
            const [data] = (yield this.query()
                .select('payment_vouchar_no')
                .from('trabill_loan_payment_cheque_details')
                .leftJoin('trabill_loan_payment', { payment_id: 'lpcheque_payment_id' })
                .where('lpcheque_id', cheque_id));
            return data;
        });
        this.insertLPayChequeStatus = (updatedData) => __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .insert(updatedData)
                .into('trabill_loan_payment_cheque_details')
                .onConflict('lpcheque_id')
                .merge();
        });
        this.updateLReceiveChequeStatus = (updatedData, chequeId) => __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .update(updatedData)
                .into('trabill_loan_received_cheque_details')
                .where('lrcheque_id', chequeId);
        });
        this.updateLoanReceiveAccountInfo = (data, cheque_id) => __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .update(data)
                .into('trabill_loan_received')
                .leftJoin('trabill_loan_received_cheque_details', {
                'trabill_loan_received_cheque_details.lrcheque_received_id': 'trabill_loan_received.received_id',
            })
                .where('lrcheque_id', cheque_id);
        });
        this.getLoanReciveInfoForChq = (cheque_id) => __awaiter(this, void 0, void 0, function* () {
            const [data] = (yield this.query()
                .select('received_vouchar_no')
                .from('trabill_loan_received_cheque_details')
                .leftJoin('trabill_loan_received', {
                received_id: 'lrcheque_received_id',
            })
                .where('lrcheque_id', cheque_id));
            return data;
        });
        this.insertLReceiveChequeStatus = (updatedData) => __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .insert(updatedData)
                .into('trabill_loan_received_cheque_details')
                .onConflict('lrcheque_id')
                .merge();
        });
        this.updateMoneyReceiptCheque = (updatedData, chequeId) => __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .update(updatedData)
                .into('trabill_money_receipts_cheque_details')
                .where('cheque_id', chequeId);
        });
        this.updateMoneyReceiptAccountInfo = (data, cheque_id) => __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .update(data)
                .into('trabill_money_receipts')
                .leftJoin('trabill_money_receipts_cheque_details', {
                'trabill_money_receipts_cheque_details.cheque_receipt_id': 'trabill_money_receipts.receipt_id',
            })
                .where('cheque_id', cheque_id);
        });
        this.updatePayrollAccountInfo = (data, cheque_id) => __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .update(data)
                .into('trabill_payroll')
                .leftJoin('trabill_payroll_cheque_details', {
                'trabill_payroll_cheque_details.pcheque_payroll_id': 'trabill_payroll.payroll_id',
            })
                .where('pcheque_id', cheque_id);
        });
        this.getPayrollInfoForChq = (cheque_id) => __awaiter(this, void 0, void 0, function* () {
            const [data] = (yield this.query()
                .select('payroll_vouchar_no')
                .from('trabill_payroll_cheque_details')
                .leftJoin('trabill_payroll', { payroll_id: 'pcheque_payroll_id' })
                .where('pcheque_id', cheque_id));
            return data;
        });
        this.updateVendorAdvrAccountInfo = (data, cheque_id) => __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .update(data)
                .into('trabill_vendor_advance_return')
                .leftJoin('trabill_vendor_advance_return_cheque_details', {
                'trabill_vendor_advance_return_cheque_details.cheque_advr_id': 'trabill_vendor_advance_return.advr_id',
            })
                .where('cheque_id', cheque_id);
        });
        this.getVAdvrInfoForChq = (cheque_id) => __awaiter(this, void 0, void 0, function* () {
            const [data] = (yield this.query()
                .select('advr_vouchar_no')
                .from('trabill_vendor_advance_return_cheque_details')
                .leftJoin('trabill_vendor_advance_return', { advr_id: 'cheque_advr_id' })
                .where({ cheque_id }));
            return data;
        });
        this.updateVendorPaymentAccountInfo = (data, cheque_id) => __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .update(data)
                .into('trabill_vendor_payments')
                .leftJoin('trabill_vendor_payments_cheques', {
                'trabill_vendor_payments_cheques.vpcheque_vpay_id': 'trabill_vendor_payments.vpay_id',
            })
                .where('vpcheque_id', cheque_id);
        });
        this.getMoneyReceiptChequeInfo = (cheque_id) => __awaiter(this, void 0, void 0, function* () {
            const [data] = (yield this.query()
                .select('receipt_agent_id as prevAgentId', 'agent_last_balance', 'receipt_vouchar_no')
                .from('trabill_money_receipts_cheque_details')
                .leftJoin('trabill_money_receipts', { receipt_id: 'cheque_receipt_id' })
                .leftJoin('trabill_agents_profile', { agent_id: 'receipt_agent_id' })
                .where('cheque_id', cheque_id)
                .andWhereNot('cheque_is_deleted', 1));
            return data;
        });
    }
    // get all cheques
    getAllCheques(status, page, size) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const query1 = trx.raw(`CALL get_all_cheques('${status}','${this.org_agency}', ${page}, ${size}, @total_rows);`);
                const query2 = trx.raw('SELECT @total_rows AS total_rows;');
                const [[[data]], [[totalRows]]] = yield Promise.all([query1, query2]);
                const totalCount = totalRows.total_rows;
                return { count: totalCount, data };
            }));
            return result;
        });
    }
    getAdvChequeInfo(cheque_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [data] = (yield this.query()
                .select('advr_vouchar_no')
                .from('trabill_advance_return_cheque_details')
                .leftJoin('trabill_advance_return', { advr_id: 'cheque_advr_id' })
                .where('cheque_id', cheque_id));
            return data;
        });
    }
    singleLoanCheque(cheque_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [cheque] = (yield this.query()
                .from('trabill_loan_cheque_details')
                .select('lcheque_amount', 'loan_type', 'loan_vouchar_no')
                .where('lcheque_id', cheque_id)
                .andWhereNot('lcheque_is_deleted', 1)
                .leftJoin('trabill_loans', { loan_id: 'lcheque_loan_id' }));
            return cheque;
        });
    }
    updatePayrollCheque(chequeData, cheque_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .update(chequeData)
                .into('trabill_payroll_cheque_details')
                .where('pcheque_id', cheque_id);
            return data;
        });
    }
    updateVendorAdvrCheque(chequeInfo, cheque_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .update(chequeInfo)
                .into('trabill_vendor_advance_return_cheque_details')
                .where('cheque_id', cheque_id);
            return data;
        });
    }
    updateVendorPaymentCheque(chequeInfo, cheque_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .update(chequeInfo)
                .into('trabill_vendor_payments_cheques')
                .where('vpcheque_id', cheque_id);
            return data;
        });
    }
}
exports.default = chequesModels;
//# sourceMappingURL=cheques.models.js.map