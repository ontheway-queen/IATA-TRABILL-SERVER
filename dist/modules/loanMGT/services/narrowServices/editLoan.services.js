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
class EditLoan extends abstract_services_1.default {
    constructor() {
        super();
        /**
         * Edit Loan
         */
        this.editLoan = (req) => __awaiter(this, void 0, void 0, function* () {
            const loan_id = Number(req.params.loan_id);
            const { authority_id, name, type, amount, interest_percent, pay_amount, receive_amount, installment, installment_type, installment_duration, installment_per_month, installment_per_day, payment_type, accategory_id, account_id, cheque_no, charge_amount, withdraw_date, bank_name, date, note, loan_created_by, } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.loanModel(req, trx);
                const connCheque = this.models.chequesModels(req, trx);
                const vendor_conn = this.models.vendorModel(req, trx);
                const { prev_account_id, prevAccTrxnId, loan_charge_id: prev_loan_charge_id, } = yield conn.getPreviousLoan(loan_id);
                let loan_charge_id = null;
                if (charge_amount) {
                    if (prev_loan_charge_id) {
                        yield vendor_conn.updateOnlineTrxnCharge({
                            charge_amount,
                            charge_purpose: `${type} loan`,
                            charge_note: note,
                        }, prev_loan_charge_id);
                    }
                    else {
                        const online_charge_trxn = {
                            charge_from_acc_id: account_id,
                            charge_amount: charge_amount,
                            charge_purpose: `${type} loan`,
                            charge_note: note,
                        };
                        loan_charge_id = yield this.models
                            .vendorModel(req, trx)
                            .insertOnlineTrxnCharge(online_charge_trxn);
                    }
                }
                const loanData = {
                    loan_authority_id: authority_id,
                    loan_name: name,
                    loan_type: type,
                    loan_amount: Number(amount),
                    loan_due_amount: pay_amount || receive_amount,
                    loan_interest_percent: interest_percent,
                    loan_payment_type: payment_type,
                    loan_date: date,
                    loan_note: note,
                    loan_created_by,
                    loan_charge_amount: charge_amount,
                    loan_charge_id: null,
                };
                const takingLoan = type === 'TAKING' || type === 'ALREADY_TAKEN';
                const givingLoan = type === 'GIVING' || type === 'ALREADY_GIVEN';
                if (takingLoan) {
                    loanData.loan_payable_amount = pay_amount;
                }
                if (givingLoan) {
                    loanData.loan_receivable_amount = receive_amount;
                }
                if (payment_type == 4) {
                    loanData.loan_cheque_no = cheque_no;
                    loanData.loan_withdraw_date = withdraw_date;
                    loanData.loan_bank_name = bank_name;
                }
                if (payment_type !== 4 && ['TAKING', 'GIVING'].includes(type)) {
                    const AccTrxnBody = {
                        acctrxn_ac_id: account_id,
                        acctrxn_type: takingLoan ? 'CREDIT' : 'DEBIT',
                        acctrxn_amount: Number(amount),
                        acctrxn_created_at: date,
                        acctrxn_created_by: loan_created_by,
                        acctrxn_note: note,
                        acctrxn_particular_id: takingLoan ? 52 : 53,
                        acctrxn_pay_type: 'CASH',
                        trxn_id: prevAccTrxnId,
                    };
                    const acc_trxn_id = yield new Trxns_1.default(req, trx).AccTrxnUpdate(AccTrxnBody);
                    loanData.loan_actransaction_id = acc_trxn_id;
                    loanData.loan_payment_type = payment_type;
                    loanData.loan_accategory_id = accategory_id;
                    loanData.loan_account_id = account_id;
                }
                if (installment == 'YES') {
                    loanData.loan_installment = 'YES';
                    if (installment_type == 'MONTHLY') {
                        loanData.loan_installment_type = 'MONTHLY';
                        loanData.loan_installment_duration = installment_duration;
                        loanData.loan_installment_per_month = installment_per_month;
                    }
                    else {
                        loanData.loan_installment_type = 'DAILY';
                        loanData.loan_installment_duration = installment_duration;
                        loanData.loan_installment_per_day = installment_per_day;
                    }
                }
                yield conn.editLoan(loanData, loan_id);
                if (payment_type == 4) {
                    const loanCheque = {
                        lcheque_amount: Number(amount),
                        lcheque_bank_name: bank_name,
                        lcheque_loan_id: loan_id,
                        lcheque_number: cheque_no,
                        lcheque_withdraw_date: withdraw_date,
                        lcheque_status: 'PENDING',
                        lcheque_create_date: date,
                    };
                    yield connCheque.insertLoanCheque(loanCheque);
                }
                const message = `Loan has been update ${amount}/- BDT`;
                yield this.insertAudit(req, 'update', message, loan_created_by, 'LOAN');
                return {
                    success: true,
                    message: 'Loan edited successfully',
                };
            }));
        });
    }
}
exports.default = EditLoan;
//# sourceMappingURL=editLoan.services.js.map