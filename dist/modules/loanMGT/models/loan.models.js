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
const moment_1 = __importDefault(require("moment"));
const abstract_models_1 = __importDefault(require("../../../abstracts/abstract.models"));
const customError_1 = __importDefault(require("../../../common/utils/errors/customError"));
class LoanModel extends abstract_models_1.default {
    createAuthority(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const authority = yield this.query()
                .into('trabill_loan_authorities')
                .insert(Object.assign(Object.assign({}, data), { authority_org_agency: this.org_agency }));
            return authority[0];
        });
    }
    editAuthority(data, authority_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const authority = yield this.query()
                .into('trabill_loan_authorities')
                .update(data)
                .where('authority_id', authority_id);
            return authority;
        });
    }
    getLoanAuthorities(search) {
        return __awaiter(this, void 0, void 0, function* () {
            search && search.toLowerCase();
            const data = yield this.query()
                .from('trabill_loan_authorities')
                .select('authority_id', 'authority_name', 'authority_mobile', 'authority_address', 'authority_create_date', 'authority_created_by')
                .whereNot('authority_is_deleted', 1)
                .andWhere('authority_org_agency', this.org_agency)
                .modify((event) => {
                if (search) {
                    event
                        .andWhereRaw('LOWER(authority_name) LIKE ?', [`%${search}%`])
                        .orWhereRaw('LOWER(authority_mobile) LIKE ?', [`%${search}%`]);
                }
            })
                .orderBy('authority_id', 'desc');
            return data;
        });
    }
    getALLLoanAuthority(page, size, search, from_date, to_date) {
        return __awaiter(this, void 0, void 0, function* () {
            search && search.toLowerCase();
            const offset = (page - 1) * size;
            from_date
                ? (from_date = (0, moment_1.default)(new Date(from_date)).format('YYYY-MM-DD'))
                : null;
            to_date ? (to_date = (0, moment_1.default)(new Date(to_date)).format('YYYY-MM-DD')) : null;
            const data = yield this.db('trabill_loan_authorities')
                .select('authority_id', 'authority_name', 'authority_mobile', 'authority_address', 'authority_create_date', 'authority_created_by')
                .whereNot('authority_is_deleted', 1)
                .andWhere('authority_org_agency', this.org_agency)
                .modify((event) => {
                if (search) {
                    event
                        .andWhereRaw('LOWER(authority_name) LIKE ?', [`%${search}%`])
                        .orWhereRaw('LOWER(authority_mobile) LIKE ?', [`%${search}%`]);
                }
                if (from_date && to_date) {
                    event.andWhereRaw(`DATE_FORMAT(authority_create_date, '%Y-%m-%d') BETWEEN ? AND ?`, [from_date, to_date]);
                }
            })
                .orderBy('authority_id', 'desc')
                .limit(size)
                .offset(offset);
            const [{ row_count }] = yield this.db('trabill_loan_authorities')
                .count('* as row_count')
                .whereNot('authority_is_deleted', 1)
                .andWhere('authority_org_agency', this.org_agency)
                .modify((event) => {
                if (search) {
                    event
                        .andWhereRaw('LOWER(authority_name) LIKE ?', [`%${search}%`])
                        .orWhereRaw('LOWER(authority_mobile) LIKE ?', [`%${search}%`]);
                }
                if (from_date && to_date) {
                    event.andWhereRaw(`DATE_FORMAT(authority_create_date, '%Y-%m-%d') BETWEEN ? AND ?`, [from_date, to_date]);
                }
            });
            return { count: row_count, data };
        });
    }
    deleteAuthority(authority_id, authority_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            const authority = yield this.query()
                .into('trabill_loan_authorities')
                .update({ authority_is_deleted: 1, authority_deleted_by })
                .where('authority_id', authority_id);
            return authority;
        });
    }
    checkAuthorityHaveTransaction(authority_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [{ loan_count }] = yield this.db('trabill_loans')
                .count('* as loan_count')
                .andWhere('loan_authority_id', authority_id)
                .andWhereNot('loan_is_deleted', 1);
            const [{ payment_count }] = yield this.db('trabill_loan_payment')
                .count('* as payment_count')
                .andWhere('payment_authority_id', authority_id)
                .andWhereNot('payment_is_deleted', 1);
            const [{ receive_count }] = yield this.db('trabill_loan_received')
                .count('* as loan_count')
                .andWhere('received_authority_id', authority_id)
                .andWhereNot('received_is_deleted', 1);
            const authority_used_count = Number(loan_count || 0) +
                Number(payment_count || 0) +
                Number(receive_count || 0);
            return authority_used_count;
        });
    }
    createLoan(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const loan = yield this.query()
                .into('trabill_loans')
                .insert(Object.assign(Object.assign({}, data), { loan_org_agency: this.org_agency }));
            return loan[0];
        });
    }
    getLoans(page, size, search, from_date, to_date) {
        return __awaiter(this, void 0, void 0, function* () {
            search && search.toLowerCase();
            const page_number = (page - 1) * size;
            from_date
                ? (from_date = (0, moment_1.default)(new Date(from_date)).format('YYYY-MM-DD'))
                : null;
            to_date ? (to_date = (0, moment_1.default)(new Date(to_date)).format('YYYY-MM-DD')) : null;
            const data = yield this.query()
                .from('trabill_loans')
                .select('loan_id', 'authority_name', 'loan_name', 'loan_type', 'loan_amount', 'loan_due_amount', 'loan_interest_percent', 'loan_payable_amount', 'account_name', 'loan_cheque_no', 'loan_withdraw_date', 'loan_bank_name', 'loan_receivable_amount', 'loan_payment_type', 'loan_installment', 'loan_installment_type', 'loan_installment_per_day', 'loan_installment_per_month', 'loan_installment_duration', 'loan_date', 'loan_note', this.db.raw('IFNULL(account_name, lcheque_status) as pay_details'))
                .leftJoin('trabill_loan_authorities', 'trabill_loan_authorities.authority_id', 'trabill_loans.loan_authority_id')
                .leftJoin('trabill_accounts', 'trabill_accounts.account_id', 'trabill_loans.loan_account_id')
                .leftJoin('trabill_loan_cheque_details', { lcheque_loan_id: 'loan_id' })
                .where((builder) => {
                builder.andWhere('loan_org_agency', this.org_agency).modify((e) => {
                    if (search) {
                        builder
                            .andWhereRaw('LOWER(account_name) LIKE ?', [`%${search}%`])
                            .orWhereRaw('LOWER(authority_name) LIKE ?', [`%${search}%`])
                            .orWhereRaw('LOWER(loan_name) LIKE ?', [`%${search}%`])
                            .where('loan_org_agency', this.org_agency);
                    }
                    if (from_date && to_date) {
                        builder
                            .andWhereRaw(`DATE_FORMAT(loan_date, '%Y-%m-%d') BETWEEN ? AND ? `, [from_date, to_date])
                            .where('loan_org_agency', this.org_agency);
                    }
                });
            })
                .andWhere('loan_org_agency', this.org_agency)
                .whereNot('loan_is_deleted', 1)
                .orderBy('loan_id', 'desc')
                .limit(size)
                .offset(page_number);
            const [{ row_count }] = yield this.query()
                .select(this.db.raw(`count(*) as row_count`))
                .from('trabill_loans')
                .leftJoin('trabill_accounts', 'trabill_accounts.account_id', 'trabill_loans.loan_account_id')
                .leftJoin('trabill_loan_authorities', 'trabill_loan_authorities.authority_id', 'trabill_loans.loan_authority_id')
                .where((builder) => {
                builder.andWhere('loan_org_agency', this.org_agency).modify((e) => {
                    if (search) {
                        builder
                            .andWhereRaw('LOWER(account_name) LIKE ?', [`%${search}%`])
                            .orWhereRaw('LOWER(authority_name) LIKE ?', [`%${search}%`])
                            .orWhereRaw('LOWER(loan_name) LIKE ?', [`%${search}%`])
                            .where('loan_org_agency', this.org_agency);
                    }
                    if (from_date && to_date) {
                        builder
                            .andWhereRaw(`DATE_FORMAT(loan_date, '%Y-%m-%d') BETWEEN ? AND ? `, [from_date, to_date])
                            .where('loan_org_agency', this.org_agency);
                    }
                });
            })
                .andWhere('loan_org_agency', this.org_agency)
                .whereNot('loan_is_deleted', 1);
            return { count: row_count, data };
        });
    }
    getLoan(loan_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const loan = yield this.query()
                .from('trabill_loans')
                .select('loan_id', 'loan_account_id', 'loan_actransaction_id', 'loan_vouchar', 'authority_name', 'loan_amount', 'loan_name', 'loan_type', 'loan_payment_type', 'loan_payable_amount', 'loan_receivable_amount', 'loan_due_amount', 'loan_interest_percent', 'loan_installment', 'loan_installment_type', 'loan_installment_per_day', 'loan_installment_per_month', 'loan_installment_duration', 'loan_date', 'loan_note')
                .leftJoin('trabill_loan_authorities', {
                authority_id: 'loan_authority_id',
            })
                .where('loan_id', loan_id);
            if (loan[0]) {
                return loan;
            }
            throw new customError_1.default('Please provide a valid loan Id', 400, 'Invalid Loan');
        });
    }
    getPreviousLoan(loan_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [loan] = yield this.query()
                .from('trabill_loans')
                .select('loan_account_id as prev_account_id', 'loan_amount as prev_amount', 'loan_type as prev_loan_type', 'loan_payment_type as prev_pay_type', 'loan_actransaction_id as prevAccTrxnId', 'loan_due_amount as loanDueAmount', 'loan_charge_id')
                .where('loan_id', loan_id);
            return loan;
        });
    }
    editLoan(data, loan_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const loan = yield this.query()
                .into('trabill_loans')
                .update(data)
                .where('loan_id', loan_id);
            return loan;
        });
    }
    deleteLoanCheque(loan_id, lcheque_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            const loan = yield this.query()
                .into('trabill_loan_cheque_details')
                .update({ lcheque_is_deleted: 1, lcheque_deleted_by })
                .where('lcheque_loan_id', loan_id);
            return loan;
        });
    }
    deleteLoan(loan_id, loan_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            const loan = yield this.query()
                .into('trabill_loans')
                .update({ loan_is_deleted: 1, loan_deleted_by })
                .where('loan_id', loan_id);
            return loan;
        });
    }
    updateLoanDue(amount, loan_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const update = yield this.query()
                .into('trabill_loans')
                .update({ loan_due_amount: amount })
                .where('loan_id', loan_id);
            return update;
        });
    }
    loansTaking(authority_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const loans = yield this.query()
                .select('loan_id', 'loan_name', 'loan_type', 'loan_payable_amount', 'loan_is_deleted', 'loan_receivable_amount')
                .leftJoin('trabill_loan_authorities', 'trabill_loan_authorities.authority_id', 'trabill_loans.loan_authority_id')
                .from('trabill_loans')
                .where('loan_org_agency', this.org_agency)
                .andWhere('loan_authority_id', authority_id)
                .andWhereNot('loan_is_deleted', 1)
                .orderBy('loan_name');
            return loans;
        });
    }
    loansReceived(authority_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const loans = yield this.query()
                .select('loan_id', 'loan_name', 'loan_type', 'loan_payable_amount', 'loan_is_deleted', 'loan_receivable_amount', 'loan_org_agency')
                .from('trabill_loans')
                .leftJoin('trabill_loan_authorities', 'trabill_loan_authorities.authority_id', 'trabill_loans.loan_authority_id')
                .where('loan_org_agency', this.org_agency)
                .andWhere('loan_authority_id', authority_id)
                .whereIn('loan_type', ['GIVING', 'ALREADY_GIVEN'])
                .andWhereNot('loan_is_deleted', 1)
                .orderBy('loan_name');
            return loans;
        });
    }
    addPayment(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const payment = yield this.query()
                .into('trabill_loan_payment')
                .insert(Object.assign(Object.assign({}, data), { payment_org_agency: this.org_agency }));
            return payment[0];
        });
    }
    getPayments(page, size, search, from_date, to_date) {
        return __awaiter(this, void 0, void 0, function* () {
            search && search.toLowerCase();
            const page_number = (page - 1) * size;
            from_date
                ? (from_date = (0, moment_1.default)(new Date(from_date)).format('YYYY-MM-DD'))
                : null;
            to_date ? (to_date = (0, moment_1.default)(new Date(to_date)).format('YYYY-MM-DD')) : null;
            const data = yield this.query()
                .from('trabill_loan_payment')
                .select('payment_id', 'authority_id', 'authority_name', 'loan_id', 'loan_name', 'payment_amount', 'payment_type', 'account_id', 'account_acctype_id as type_id', 'account_name', 'payment_cheque_no', 'payment_bank_name', 'payment_withdraw_date', 'payment_date', 'payment_note', this.db.raw('CASE WHEN payment_type = 4 THEN "Cheque" WHEN payment_type = 1 THEN "Cash" WHEN payment_type = 2 THEN "Bank" WHEN payment_type = 3 THEN "Mobile banking"  ELSE NULL END AS loan_pay_type'), this.db.raw('IFNULL(account_name, lpcheque_status) as pay_details'))
                .leftJoin('trabill_loan_authorities', 'trabill_loan_authorities.authority_id', 'trabill_loan_payment.payment_authority_id')
                .leftJoin('trabill_loans', 'trabill_loans.loan_id', 'trabill_loan_payment.payment_loan_id')
                .leftJoin('trabill_accounts', 'trabill_accounts.account_id', 'trabill_loan_payment.payment_account_id')
                .leftJoin(this.db.raw(`trabill_loan_payment_cheque_details ON lpcheque_payment_id = payment_id AND lpcheque_is_deleted = 0`))
                .where('payment_org_agency', this.org_agency)
                .andWhereNot('payment_is_deleted', 1)
                .modify((event) => {
                if (search) {
                    event
                        .andWhereRaw('LOWER(authority_name) LIKE ? ', [`%${search}%`])
                        .orWhereRaw('LOWER(loan_name) LIKE ? ', [`%${search}%`])
                        .orWhereRaw('LOWER(account_name) LIKE ? ', [`%${search}%`]);
                }
                if (from_date && to_date) {
                    event.andWhereRaw(`DATE_FORMAT(payment_date, '%Y-%m-%d') BETWEEN ? AND ?`, [from_date, to_date]);
                }
            })
                .orderBy('payment_id', 'desc')
                .limit(size)
                .offset(page_number);
            const [{ row_count }] = yield this.query()
                .select(this.db.raw(`count(*) as row_count`))
                .from('trabill_loan_payment')
                .leftJoin('trabill_loan_authorities', 'trabill_loan_authorities.authority_id', 'trabill_loan_payment.payment_authority_id')
                .leftJoin('trabill_loans', 'trabill_loans.loan_id', 'trabill_loan_payment.payment_loan_id')
                .leftJoin('trabill_accounts', 'trabill_accounts.account_id', 'trabill_loan_payment.payment_account_id')
                .where('payment_org_agency', this.org_agency)
                .andWhereNot('payment_is_deleted', 1)
                .modify((event) => {
                if (search) {
                    event
                        .andWhereRaw('LOWER(authority_name) LIKE ? ', [`%${search}%`])
                        .orWhereRaw('LOWER(loan_name) LIKE ? ', [`%${search}%`])
                        .orWhereRaw('LOWER(account_name) LIKE ? ', [`%${search}%`]);
                }
                if (from_date && to_date) {
                    event.andWhereRaw(`DATE_FORMAT(payment_date, '%Y-%m-%d') BETWEEN ? AND ?`, [from_date, to_date]);
                }
            });
            return { count: row_count, data };
        });
    }
    getPayment(payment_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const payments = yield this.query()
                .from('trabill_loan_payment')
                .select('authority_name', 'loan_amount', 'loan_name', 'loan_due_amount', 'payment_amount', 'loan_type', 'account_name', 'payment_date')
                .leftJoin('trabill_loan_authorities', 'trabill_loan_authorities.authority_id', 'trabill_loan_payment.payment_authority_id')
                .leftJoin('trabill_loans', 'trabill_loans.loan_id', 'trabill_loan_payment.payment_loan_id')
                .leftJoin('trabill_accounts', 'trabill_accounts.account_id', 'trabill_loan_payment.payment_account_id')
                .where('payment_id', payment_id);
            return payments;
        });
    }
    getPaymentByLoan(loan_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const payments = yield this.query()
                .select('payment_id')
                .from('trabill_loan_payment')
                .where('payment_loan_id', loan_id)
                .andWhereNot('payment_is_deleted', 1);
            return payments[0];
        });
    }
    editPayment(data, payment_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const payment = yield this.query()
                .into('trabill_loan_payment')
                .update(data)
                .where('payment_id', payment_id);
            return payment;
        });
    }
    getPrevPaymentData(payment_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const payment = yield this.query()
                .from('trabill_loan_payment')
                .select('payment_amount as prev_payamount', 'payment_type as prev_paytype', 'payment_account_id as prev_accountid', 'payment_actransaction_id as prev_actrxn_id', 'payment_loan_id', 'payment_charge_id')
                .where('payment_id', payment_id);
            return payment[0];
        });
    }
    deletePayment(payment_id, payment_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            const payment = yield this.query()
                .into('trabill_loan_payment')
                .update({ payment_is_deleted: 1, payment_deleted_by })
                .where('payment_id', payment_id);
            return payment;
        });
    }
    addReceived(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const received = yield this.query()
                .into('trabill_loan_received')
                .insert(Object.assign(Object.assign({}, data), { received_org_agency: this.org_agency }));
            return received[0];
        });
    }
    getReceived(is_deleted, page, size, search, from_date, to_date) {
        return __awaiter(this, void 0, void 0, function* () {
            search && search.toLowerCase();
            const page_number = (page - 1) * size;
            from_date
                ? (from_date = (0, moment_1.default)(new Date(from_date)).format('YYYY-MM-DD'))
                : null;
            to_date ? (to_date = (0, moment_1.default)(new Date(to_date)).format('YYYY-MM-DD')) : null;
            const data = yield this.query()
                .from('trabill_loan_received')
                .select('received_id', 'authority_id', 'authority_name', 'loan_id', 'loan_name', 'received_amount', 'received_payment_type as payment_type', 'account_id', 'account_acctype_id as type_id', 'account_name', 'received_cheque_no', 'received_bank_name', 'received_withdraw_date', 'received_date', 'received_note', this.db.raw('CASE WHEN received_payment_type = 4 THEN "Cheque" WHEN received_payment_type = 1 THEN "Cash" WHEN received_payment_type = 2 THEN "Bank" WHEN received_payment_type = 3 THEN "Mobile banking"  ELSE NULL END AS loan_pay_type'), this.db.raw('IFNULL(account_name, lrcheque_status) as pay_details'))
                .leftJoin('trabill_loan_authorities', 'trabill_loan_authorities.authority_id', 'trabill_loan_received.received_authority_id')
                .leftJoin('trabill_loans', 'trabill_loans.loan_id', 'trabill_loan_received.received_loan_id')
                .leftJoin('trabill_accounts', 'trabill_accounts.account_id', 'trabill_loan_received.received_account_id')
                .leftJoin(this.db.raw(`trabill_loan_received_cheque_details ON lrcheque_received_id = received_id AND lrcheque_is_deleted = 0`))
                .where('received_org_agency', this.org_agency)
                .andWhereNot('received_is_deleted', 1)
                .modify((event) => {
                if (search) {
                    event
                        .andWhereRaw(`LOWER(authority_name) LIKE ?`, [`%${search}%`])
                        .orWhereRaw(`LOWER(loan_name) LIKE ?`, [`%${search}%`])
                        .orWhereRaw(`LOWER(account_name) LIKE ?`, [`%${search}%`])
                        .orWhereRaw(`LOWER(received_bank_name) LIKE ?`, [`%${search}%`]);
                }
                if (from_date && to_date) {
                    event.andWhereRaw(`DATE_FORMAT(received_date,'%Y-%m-%d') BETWEEN ? AND ?`, [from_date, to_date]);
                }
            })
                .orderBy('received_id', 'desc')
                .limit(size)
                .offset(page_number);
            const [{ row_count }] = yield this.query()
                .select(this.db.raw(`count(*) as row_count`))
                .from('trabill_loan_received')
                .leftJoin('trabill_loan_authorities', 'trabill_loan_authorities.authority_id', 'trabill_loan_received.received_authority_id')
                .leftJoin('trabill_loans', 'trabill_loans.loan_id', 'trabill_loan_received.received_loan_id')
                .leftJoin('trabill_accounts', 'trabill_accounts.account_id', 'trabill_loan_received.received_account_id')
                .where('received_org_agency', this.org_agency)
                .andWhereNot('received_is_deleted', 1)
                .modify((event) => {
                if (search) {
                    event
                        .andWhereRaw(`LOWER(authority_name) LIKE ?`, [`%${search}%`])
                        .orWhereRaw(`LOWER(loan_name) LIKE ?`, [`%${search}%`])
                        .orWhereRaw(`LOWER(account_name) LIKE ?`, [`%${search}%`])
                        .orWhereRaw(`LOWER(received_bank_name) LIKE ?`, [`%${search}%`]);
                }
                if (from_date && to_date) {
                    event.andWhereRaw(`DATE_FORMAT(received_date,'%Y-%m-%d') BETWEEN ? AND ?`, [from_date, to_date]);
                }
            });
            return { count: row_count, data };
        });
    }
    getSingleReceived(received_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const received = yield this.query()
                .from('trabill_loan_received')
                .select('trabill_loan_received.received_payment_type', 'authority_name', 'loan_name', 'trabill_loan_received.received_amount', 'loan_type', 'account_name', 'trabill_loan_received.received_date', 'loan_amount', 'loan_due_amount')
                .leftJoin('trabill_loan_authorities', 'trabill_loan_authorities.authority_id', 'trabill_loan_received.received_authority_id')
                .leftJoin('trabill_loans', 'trabill_loans.loan_id', 'trabill_loan_received.received_loan_id')
                .leftJoin('trabill_accounts', 'trabill_accounts.account_id', 'trabill_loan_received.received_account_id')
                .where('trabill_loan_received.received_id', received_id);
            return received;
        });
    }
    getReceivedByLoan(loan_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const payments = yield this.query()
                .select('received_id')
                .from('trabill_loan_received')
                .where('received_loan_id', loan_id)
                .andWhereNot('received_is_deleted', 1);
            return payments[0];
        });
    }
    editReceived(data, received_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const received = yield this.query()
                .into('trabill_loan_received')
                .update(data)
                .where('received_id', received_id);
            return received;
        });
    }
    getReceivedInfo(received_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const loan_received = yield this.query()
                .select('received_amount', 'received_account_id', 'received_actransaction_id', 'received_payment_type', 'received_loan_id', 'received_charge_id')
                .from('trabill_loan_received')
                .where('received_id', received_id);
            if (loan_received[0]) {
                const received = loan_received[0];
                return received;
            }
            else {
                throw new customError_1.default('Please provide a valid received Id ', 400, 'Bad ID');
            }
        });
    }
    deleteReceived(received_id, received_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            const received = yield this.query()
                .into('trabill_loan_received')
                .update({ received_is_deleted: 1, received_deleted_by })
                .where('received_id', received_id);
            return received;
        });
    }
}
exports.default = LoanModel;
//# sourceMappingURL=loan.models.js.map