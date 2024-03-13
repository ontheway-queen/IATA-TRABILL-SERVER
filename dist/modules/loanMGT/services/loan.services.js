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
const Trxns_1 = __importDefault(require("../../../common/helpers/Trxns"));
const customError_1 = __importDefault(require("../../../common/utils/errors/customError"));
const addLoan_services_1 = __importDefault(require("./narrowServices/addLoan.services"));
const editLoan_services_1 = __importDefault(require("./narrowServices/editLoan.services"));
class LoanServices extends abstract_services_1.default {
    constructor() {
        super();
        this.addLoanAuthrity = (req) => __awaiter(this, void 0, void 0, function* () {
            const { name, contact, address, created_by } = req.body;
            const authorityData = {
                authority_name: name,
                authority_mobile: contact,
                authority_address: address,
                authority_created_by: created_by,
            };
            const conn = this.models.loanModel(req);
            const authorityId = yield conn.createAuthority(authorityData);
            // insert audit
            const message = 'Loan authority has been created';
            yield this.insertAudit(req, 'create', message, created_by, 'LOAN');
            return {
                success: true,
                message,
                data: authorityId,
            };
        });
        this.editLoanAuthority = (req) => __awaiter(this, void 0, void 0, function* () {
            const { authority_id } = req.params;
            const { name, contact, address, created_by } = req.body;
            const authorityData = {
                authority_name: name,
                authority_mobile: contact,
                authority_address: address,
                authority_created_by: created_by,
            };
            const conn = this.models.loanModel(req);
            const data = yield conn.editAuthority(authorityData, authority_id);
            // insert audit
            const message = 'Loan authority edited successfully';
            yield this.insertAudit(req, 'update', message, created_by, 'LOAN');
            return {
                success: true,
                message: 'Loan authority edited successfully',
                data,
            };
        });
        this.getLoanAuthorities = (req) => __awaiter(this, void 0, void 0, function* () {
            const { search } = req.query;
            const conn = this.models.loanModel(req);
            const data = yield conn.getLoanAuthorities(search);
            return { success: true, data };
        });
        this.getALLLoanAuthority = (req) => __awaiter(this, void 0, void 0, function* () {
            const { page, size, search, from_date, to_date } = req.query;
            const conn = this.models.loanModel(req);
            const data = yield conn.getALLLoanAuthority(Number(page || 1), Number(size || 20), search, from_date, to_date);
            return Object.assign({ success: true }, data);
        });
        this.deleteAuthority = (req) => __awaiter(this, void 0, void 0, function* () {
            const { authority_id } = req.params;
            const { deleted_by } = req.body;
            const conn = this.models.loanModel(req);
            const authority_used = yield conn.checkAuthorityHaveTransaction(authority_id);
            if (authority_used > 0) {
                throw new customError_1.default(`You can't delete this authority it's used somewhere`, 400, 'Bad request');
            }
            yield conn.deleteAuthority(authority_id, deleted_by);
            const message = 'Authority deleted successfully';
            yield this.insertAudit(req, 'delete', message, deleted_by, 'LOAN');
            return { success: true, message: 'Authority deleted successfully' };
        });
        this.getLoans = (req) => __awaiter(this, void 0, void 0, function* () {
            const { page, size, search, from_date, to_date } = req.query;
            const conn = this.models.loanModel(req);
            const data = yield conn.getLoans(Number(page) || 1, Number(size) || 20, search, from_date, to_date);
            return Object.assign({ success: true }, data);
        });
        /**
         * Get single loan
         */
        this.getLoan = (req) => __awaiter(this, void 0, void 0, function* () {
            const { loan_id } = req.params;
            const conn = this.models.loanModel(req);
            const data = yield conn.getLoan(+loan_id);
            return { success: true, data };
        });
        /**
         * Delete Loan
         */
        this.deleteLoan = (req) => __awaiter(this, void 0, void 0, function* () {
            let { loan_id } = req.params;
            loan_id = Number(loan_id);
            const { deleted_by } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.loanModel(req, trx);
                const { prev_loan_type, prev_pay_type, prevAccTrxnId, loan_charge_id } = yield conn.getPreviousLoan(loan_id);
                const payment = yield conn.getPaymentByLoan(loan_id);
                const received = yield conn.getReceivedByLoan(loan_id);
                if (payment || received) {
                    throw new customError_1.default('Loan cannot be deleted if payment/ received exists', 400, 'Bad Request');
                }
                yield conn.deleteLoanCheque(loan_id, deleted_by);
                yield conn.deleteLoan(loan_id, deleted_by);
                if (prev_pay_type !== 4 &&
                    ['GIVING', 'TAKING'].includes(prev_loan_type)) {
                    yield new Trxns_1.default(req, trx).deleteAccTrxn(prevAccTrxnId);
                }
                // insert audit
                const message = 'Loan deleted successfully';
                yield this.insertAudit(req, 'delete', message, deleted_by, 'LOAN');
                if (loan_charge_id) {
                    yield this.models
                        .vendorModel(req, trx)
                        .deleteOnlineTrxnCharge(loan_charge_id);
                }
                return { success: true, message: 'Loan deleted successfully' };
            }));
        });
        /**
         * Get loans by prev_loan_type: taking, already taken
         */
        this.loansForPayment = (req) => __awaiter(this, void 0, void 0, function* () {
            const { authority_id } = req.params;
            const conn = this.models.loanModel(req);
            const data = yield conn.loansTaking(+authority_id);
            return { success: true, data };
        });
        /**
         * Add Payment
         */
        this.addPayment = (req) => __awaiter(this, void 0, void 0, function* () {
            const { authority_id, loan_id, payment_type, charge_amount, cheque_no, withdraw_date, bank_name, accategory_id, account_id, amount, payment_date, payment_note, created_by, } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.loanModel(req, trx);
                const connAccount = this.models.accountsModel(req, trx);
                const connCheque = this.models.chequesModels(req, trx);
                const trxns = new Trxns_1.default(req, trx);
                const vouchar_no = yield this.generateVoucher(req, 'LNP');
                let payment_charge_id = null;
                if (payment_type === 3 && charge_amount) {
                    const online_charge_trxn = {
                        charge_from_acc_id: account_id,
                        charge_amount: charge_amount,
                        charge_purpose: `Loan payment`,
                        charge_note: payment_note,
                    };
                    payment_charge_id = yield this.models
                        .vendorModel(req, trx)
                        .insertOnlineTrxnCharge(online_charge_trxn);
                }
                const paymentData = {
                    payment_vouchar_no: vouchar_no,
                    payment_authority_id: authority_id,
                    payment_loan_id: loan_id,
                    payment_type,
                    payment_amount: amount,
                    payment_date,
                    payment_note,
                    payment_created_by: created_by,
                    payment_charge_amount: charge_amount,
                    payment_charge_id,
                };
                const loan = yield conn.getLoan(loan_id);
                let due_amount = Number(loan[0].loan_due_amount);
                if (due_amount <= 0) {
                    throw new customError_1.default('This Loan has no due left', 400, 'Bad Request');
                }
                due_amount = due_amount - amount;
                yield conn.updateLoanDue(due_amount, loan_id);
                if (payment_type == 4) {
                    paymentData.payment_cheque_no = cheque_no;
                    paymentData.payment_bank_name = bank_name;
                    paymentData.payment_withdraw_date = withdraw_date;
                }
                if (payment_type !== 4 && amount <= Number(loan[0].loan_due_amount)) {
                    let last_balance = yield connAccount.getAccountLastBalance(account_id);
                    if (Number(last_balance) < amount) {
                        throw new customError_1.default('Account balance insufficient for loan payment', 400, 'Bad Request');
                    }
                    paymentData.payment_accategory_id = accategory_id;
                    paymentData.payment_account_id = account_id;
                    let accPayType;
                    if (payment_type === 1) {
                        accPayType = 'CASH';
                    }
                    else if (payment_type === 2) {
                        accPayType = 'BANK';
                    }
                    else if (payment_type === 3) {
                        accPayType = 'MOBILE BANKING';
                    }
                    else {
                        accPayType = 'CASH';
                    }
                    const AccTrxnBody = {
                        acctrxn_ac_id: account_id,
                        acctrxn_type: 'DEBIT',
                        acctrxn_voucher: vouchar_no,
                        acctrxn_amount: amount,
                        acctrxn_created_at: payment_date,
                        acctrxn_created_by: created_by,
                        acctrxn_note: payment_note,
                        acctrxn_particular_id: 4,
                        acctrxn_particular_type: 'Loan',
                        acctrxn_pay_type: accPayType,
                    };
                    const payment_acctrxn_id = yield trxns.AccTrxnInsert(AccTrxnBody);
                    paymentData.payment_actransaction_id = payment_acctrxn_id;
                }
                const paymentId = yield conn.addPayment(paymentData);
                if (payment_type == 4) {
                    const payment_cheque = {
                        lpcheque_amount: amount,
                        lpcheque_number: cheque_no,
                        lpcheque_payment_id: paymentId,
                        lpcheque_bank_name: bank_name,
                        lpcheque_withdraw_date: withdraw_date,
                        lpcheque_status: 'PENDING',
                    };
                    yield connCheque.insertLPayChequeStatus(payment_cheque);
                }
                yield this.updateVoucher(req, 'LNP');
                // insert audit
                const message = 'Payment added successfully';
                yield this.insertAudit(req, 'create', message, created_by, 'LOAN');
                return {
                    success: true,
                    message: 'Payment added successfully',
                };
            }));
        });
        this.getPayments = (req) => __awaiter(this, void 0, void 0, function* () {
            const { page, size, search, from_date, to_date } = req.query;
            const conn = this.models.loanModel(req);
            const data = yield conn.getPayments(Number(page) || 1, Number(size) || 20, search, from_date, to_date);
            return Object.assign({ success: true }, data);
        });
        this.getPayment = (req) => __awaiter(this, void 0, void 0, function* () {
            const { payment_id } = req.params;
            const conn = this.models.loanModel(req);
            const data = yield conn.getPayment(+payment_id);
            return { success: true, data };
        });
        this.editPayment = (req) => __awaiter(this, void 0, void 0, function* () {
            const { payment_id } = req.params;
            const { authority_id, loan_id, accategory_id, account_id, amount, payment_type, cheque_no, bank_name, withdraw_date, created_by, payment_date, payment_note, charge_amount, } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.loanModel(req, trx);
                const vendor_conn = this.models.vendorModel(req, trx);
                const account_conn = this.models.accountsModel(req, trx);
                const connCheque = this.models.chequesModels(req, trx);
                const { prev_paytype, prev_payamount, prev_accountid, prev_actrxn_id, payment_charge_id: prev_payment_charge_id, } = yield conn.getPrevPaymentData(payment_id);
                let payment_charge_id = null;
                if (prev_payment_charge_id) {
                    yield vendor_conn.updateOnlineTrxnCharge({ charge_amount: charge_amount, charge_purpose: 'Loan payment' }, prev_payment_charge_id);
                }
                else {
                    const online_charge_trxn = {
                        charge_from_acc_id: account_id,
                        charge_amount: charge_amount,
                        charge_purpose: `Loan payment`,
                        charge_note: payment_note,
                    };
                    if (charge_amount) {
                        payment_charge_id = yield this.models
                            .vendorModel(req, trx)
                            .insertOnlineTrxnCharge(online_charge_trxn);
                    }
                }
                const paymentData = {
                    payment_authority_id: authority_id,
                    payment_loan_id: loan_id,
                    payment_type,
                    payment_amount: amount,
                    payment_created_by: created_by,
                    payment_date,
                    payment_note,
                    payment_charge_amount: charge_amount,
                    payment_charge_id,
                };
                const loan = yield conn.getLoan(loan_id);
                let due_amount = Number(loan[0].loan_due_amount);
                if (due_amount <= 0) {
                    throw new customError_1.default('This Loan has no due left', 400, 'Bad Request');
                }
                due_amount = Number(due_amount) + Number(prev_payamount) - Number(amount);
                yield conn.updateLoanDue(due_amount, loan_id);
                if (payment_type == 4) {
                    paymentData.payment_cheque_no = cheque_no;
                    paymentData.payment_bank_name = bank_name;
                    paymentData.payment_withdraw_date = withdraw_date;
                }
                if (payment_type !== 4 && amount <= Number(loan[0].loan_due_amount)) {
                    let last_balance = yield account_conn.getAccountLastBalance(account_id);
                    if (Number(last_balance) < amount) {
                        throw new customError_1.default('Account balance insufficient for loan payment', 400, 'Bad Request');
                    }
                    const AccTrxnBody = {
                        acctrxn_ac_id: account_id,
                        acctrxn_type: 'DEBIT',
                        acctrxn_amount: amount,
                        acctrxn_created_at: payment_date,
                        acctrxn_created_by: created_by,
                        acctrxn_note: payment_note,
                        acctrxn_particular_id: 88,
                        acctrxn_particular_type: 'Loan payment',
                        acctrxn_pay_type: 'CASH',
                        trxn_id: prev_actrxn_id,
                    };
                    const payment_trxn_id = yield new Trxns_1.default(req, trx).AccTrxnUpdate(AccTrxnBody);
                    paymentData.payment_actransaction_id = payment_trxn_id;
                    paymentData.payment_account_id = account_id;
                }
                if (payment_type == 4) {
                    const payment_cheque = {
                        lpcheque_amount: amount,
                        lpcheque_number: cheque_no,
                        lpcheque_payment_id: +payment_id,
                        lpcheque_bank_name: bank_name,
                        lpcheque_withdraw_date: withdraw_date,
                        lpcheque_status: 'PENDING',
                    };
                    yield connCheque.insertLPayChequeStatus(payment_cheque);
                }
                yield conn.editPayment(paymentData, +payment_id);
                // insert audit
                const message = 'Payment edited successfully';
                yield this.insertAudit(req, 'update', message, created_by, 'LOAN');
                return {
                    success: true,
                    message: 'Payment edited successfully',
                };
            }));
        });
        this.deletePayment = (req) => __awaiter(this, void 0, void 0, function* () {
            const { payment_id } = req.params;
            const { deleted_by } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.loanModel(req, trx);
                const trxns = new Trxns_1.default(req, trx);
                const { prev_paytype, prev_payamount, prev_actrxn_id, payment_loan_id, payment_charge_id, } = yield conn.getPrevPaymentData(payment_id);
                const { loanDueAmount } = yield conn.getPreviousLoan(payment_loan_id);
                const due_amount = Number(loanDueAmount) + Number(prev_payamount);
                yield conn.updateLoanDue(due_amount, payment_loan_id);
                yield conn.deletePayment(+payment_id, deleted_by);
                if (prev_paytype !== 4) {
                    yield trxns.deleteAccTrxn(prev_actrxn_id);
                }
                if (payment_charge_id) {
                    yield this.models
                        .vendorModel(req, trx)
                        .deleteOnlineTrxnCharge(payment_charge_id);
                }
                const message = `Loan payment has been deleted ${prev_payamount}/-`;
                yield this.insertAudit(req, 'delete', message, deleted_by, 'LOAN');
                return { success: true, message };
            }));
        });
        /**
         * Get loans by prev_loan_type: giving, already given
         */
        this.loansForReceive = (req) => __awaiter(this, void 0, void 0, function* () {
            const { authority_id } = req.params;
            const conn = this.models.loanModel(req);
            const data = yield conn.loansReceived(authority_id);
            return { success: true, data };
        });
        this.addRecieved = (req) => __awaiter(this, void 0, void 0, function* () {
            const { authority_id, loan_id, accategory_id, account_id, amount, payment_type, charge_amount, cheque_no, bank_name, withdraw_date, created_by, received_date, received_note, } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.loanModel(req, trx);
                const connCheque = this.models.chequesModels(req, trx);
                const trxns = new Trxns_1.default(req, trx);
                const vouchar_no = yield this.generateVoucher(req, 'LNR');
                let received_charge_id = null;
                if (payment_type === 3) {
                    const online_charge_trxn = {
                        charge_to_acc_id: account_id,
                        charge_amount: charge_amount,
                        charge_purpose: `Loan receive`,
                        charge_note: received_note,
                    };
                    received_charge_id = yield this.models
                        .vendorModel(req, trx)
                        .insertOnlineTrxnCharge(online_charge_trxn);
                }
                const receivedData = {
                    received_vouchar_no: vouchar_no,
                    received_authority_id: authority_id,
                    received_loan_id: loan_id,
                    received_payment_type: payment_type,
                    received_amount: amount,
                    received_created_by: created_by,
                    received_account_id: account_id,
                    received_date,
                    received_note,
                    received_charge_amount: charge_amount,
                    received_charge_id,
                };
                const loan = yield conn.getLoan(loan_id);
                let due_amount = Number(loan[0].loan_due_amount);
                if (due_amount <= 0) {
                    throw new customError_1.default('This Loan has no due left', 400, 'Bad Request');
                }
                due_amount = due_amount - amount;
                yield conn.updateLoanDue(due_amount, loan_id);
                if (payment_type == 4) {
                    receivedData.received_cheque_no = cheque_no;
                    receivedData.received_bank_name = bank_name;
                    receivedData.received_withdraw_date = withdraw_date;
                }
                if (payment_type !== 4 && amount <= Number(loan[0].loan_due_amount)) {
                    receivedData.received_accategory_id = accategory_id;
                    receivedData.received_account_id = account_id;
                    let accPayType;
                    if (payment_type === 1) {
                        accPayType = 'CASH';
                    }
                    else if (payment_type === 2) {
                        accPayType = 'BANK';
                    }
                    else if (payment_type === 3) {
                        accPayType = 'MOBILE BANKING';
                    }
                    else {
                        accPayType = 'CASH';
                    }
                    const AccTrxnBody = {
                        acctrxn_ac_id: account_id,
                        acctrxn_type: 'CREDIT',
                        acctrxn_voucher: vouchar_no,
                        acctrxn_amount: amount,
                        acctrxn_created_at: received_date,
                        acctrxn_created_by: created_by,
                        acctrxn_note: received_note,
                        acctrxn_particular_id: 3,
                        acctrxn_particular_type: 'Money receipt',
                        acctrxn_pay_type: accPayType,
                    };
                    const receipt_acctrxn_id = yield trxns.AccTrxnInsert(AccTrxnBody);
                    receivedData.received_actransaction_id = receipt_acctrxn_id;
                }
                const receivedId = yield conn.addReceived(receivedData);
                if (payment_type == 4) {
                    const received_cheque = {
                        lrcheque_amount: amount,
                        lrcheque_number: cheque_no,
                        lrcheque_received_id: receivedId,
                        lrcheque_bank_name: bank_name,
                        lrcheque_withdraw_date: withdraw_date,
                        lrcheque_status: 'PENDING',
                    };
                    yield connCheque.insertLReceiveChequeStatus(received_cheque);
                }
                const message = `Loan received has been created ${amount}/-`;
                yield this.updateVoucher(req, 'LNR');
                yield this.insertAudit(req, 'create', message, created_by, 'LOAN');
                return {
                    success: true,
                    message: 'Received added successfully',
                };
            }));
        });
        this.getReceived = (req) => __awaiter(this, void 0, void 0, function* () {
            const { trash, page, size, search, from_date, to_date } = req.query;
            const conn = this.models.loanModel(req);
            const data = yield conn.getReceived(Number(trash) || 0, Number(page) || 1, Number(size) || 10, search, from_date, to_date);
            return Object.assign({ success: true }, data);
        });
        this.getSingleReceived = (req) => __awaiter(this, void 0, void 0, function* () {
            const { received_id } = req.params;
            const conn = this.models.loanModel(req);
            const data = yield conn.getSingleReceived(+received_id);
            return { success: true, data };
        });
        this.editRecieved = (req) => __awaiter(this, void 0, void 0, function* () {
            const { received_id } = req.params;
            const { authority_id, loan_id, accategory_id, account_id, amount, payment_type, cheque_no, bank_name, withdraw_date, created_by, received_date, received_note, charge_amount, } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.loanModel(req, trx);
                const connAccount = this.models.accountsModel(req, trx);
                const connCheque = this.models.chequesModels(req, trx);
                const vendor_conn = this.models.vendorModel(req, trx);
                const { received_amount, received_actransaction_id, received_charge_id: prev_received_charge_id, } = yield conn.getReceivedInfo(received_id);
                let received_charge_id = null;
                if (prev_received_charge_id) {
                    yield vendor_conn.updateOnlineTrxnCharge({
                        charge_amount,
                        charge_purpose: 'Loan Receive',
                        charge_note: received_note,
                    }, prev_received_charge_id);
                }
                else {
                    const online_charge_trxn = {
                        charge_from_acc_id: account_id,
                        charge_amount,
                        charge_purpose: `Loan Receive`,
                        charge_note: received_note,
                    };
                    received_charge_id = yield vendor_conn.insertOnlineTrxnCharge(online_charge_trxn);
                }
                const receivedData = {
                    received_authority_id: authority_id,
                    received_loan_id: loan_id,
                    received_payment_type: payment_type,
                    received_amount: amount,
                    received_created_by: created_by,
                    received_date,
                    received_note,
                    received_charge_amount: charge_amount,
                    received_charge_id,
                };
                const loan = yield conn.getLoan(loan_id);
                let due_amount = Number(loan[0].loan_due_amount);
                if (due_amount <= 0) {
                    throw new customError_1.default('This Loan has no due left', 400, 'Bad Request');
                }
                due_amount =
                    Number(due_amount) + Number(received_amount) - Number(amount);
                yield conn.updateLoanDue(due_amount, loan_id);
                if (payment_type == 4) {
                    receivedData.received_cheque_no = cheque_no;
                    receivedData.received_bank_name = bank_name;
                    receivedData.received_withdraw_date = withdraw_date;
                }
                if (payment_type !== 4 && amount <= Number(loan[0].loan_due_amount)) {
                    let last_balance = yield connAccount.getAccountLastBalance(account_id);
                    if (Number(last_balance) < amount) {
                        throw new customError_1.default('Account balance insufficient for loan received', 400, 'Bad Request');
                    }
                    receivedData.received_accategory_id = accategory_id;
                    receivedData.received_account_id = account_id;
                    const AccTrxnBody = {
                        acctrxn_ac_id: account_id,
                        acctrxn_type: 'CREDIT',
                        acctrxn_amount: amount,
                        acctrxn_created_at: received_date,
                        acctrxn_created_by: created_by,
                        acctrxn_note: received_note,
                        acctrxn_particular_id: 89,
                        acctrxn_particular_type: 'Loan Received',
                        acctrxn_pay_type: 'CASH',
                        trxn_id: received_actransaction_id,
                    };
                    yield new Trxns_1.default(req, trx).AccTrxnUpdate(AccTrxnBody);
                }
                if (payment_type == 4) {
                    const received_cheque = {
                        lrcheque_amount: amount,
                        lrcheque_number: cheque_no,
                        lrcheque_received_id: +received_id,
                        lrcheque_bank_name: bank_name,
                        lrcheque_withdraw_date: withdraw_date,
                        lrcheque_status: 'PENDING',
                    };
                    yield connCheque.insertLReceiveChequeStatus(received_cheque);
                }
                yield conn.editReceived(receivedData, +received_id);
                const message = `Loan received has been updated ${amount}/-`;
                yield this.insertAudit(req, 'update', message, created_by, 'LOAN');
                return {
                    success: true,
                    message: 'Received edited successfully',
                };
            }));
        });
        this.deleteReceived = (req) => __awaiter(this, void 0, void 0, function* () {
            const { received_id } = req.params;
            const { deleted_by } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.loanModel(req);
                const { received_actransaction_id, received_amount, received_loan_id, received_charge_id, } = yield conn.getReceivedInfo(received_id);
                const { loanDueAmount } = yield conn.getPreviousLoan(received_loan_id);
                const due_amount = Number(loanDueAmount) + Number(received_amount);
                yield conn.updateLoanDue(due_amount, received_loan_id);
                yield conn.deleteReceived(+received_id, deleted_by);
                if (received_charge_id) {
                    yield this.models
                        .vendorModel(req, trx)
                        .deleteOnlineTrxnCharge(received_charge_id);
                }
                yield new Trxns_1.default(req, trx).deleteAccTrxn(received_actransaction_id);
                const message = `Loan received has been deleted ${received_amount}/-`;
                yield this.insertAudit(req, 'delete', message, deleted_by, 'LOAN');
                return { success: true, message: 'Received deleted successfully' };
            }));
        });
        this.addLoan = new addLoan_services_1.default().addLoan;
        this.editLoan = new editLoan_services_1.default().editLoan;
    }
}
exports.default = LoanServices;
//# sourceMappingURL=loan.services.js.map