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
class ExpenseModel extends abstract_models_1.default {
    createExpense(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const expense = yield this.query()
                .insert(Object.assign(Object.assign({}, data), { expense_org_agency: this.org_agency }))
                .into('trabill_expenses');
            return expense[0];
        });
    }
    expenseImagesUrl(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [urlList] = yield this.query()
                .select('expense_voucher_url_1', 'expense_voucher_url_2')
                .from('trabill_expenses')
                .where('expense_id', id)
                .andWhereNot('expense_is_deleted', 1);
            return urlList;
        });
    }
    editExpense(data, expense_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const expense = yield this.query()
                .update(data)
                .into('trabill_expenses')
                .where('expense_id', expense_id);
            if (expense) {
                return expense;
            }
            else {
                throw new customError_1.default(`You can't edit this expense`, 400, `Bad Id`);
            }
        });
    }
    deleteExpense(expense_id, expense_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            const expense = yield this.query()
                .update({ expense_is_deleted: 1, expense_deleted_by })
                .into('trabill_expenses')
                .where('expense_id', expense_id);
            expense;
        });
    }
    createExpenseDtls(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const expense = yield this.query()
                .insert(data)
                .into('trabill_expense_details');
            return expense[0];
        });
    }
    deleteExpenseDtls(expense_id, expdetails_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            const expense = yield this.query()
                .update({ expdetails_is_deleted: 1, expdetails_deleted_by })
                .into('trabill_expense_details')
                .where('expdetails_expense_id', expense_id);
            return expense;
        });
    }
    addExpenseCheque(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const cheque = yield this.query()
                .insert(data)
                .into('trabill_expense_cheque_details');
            return cheque[0];
        });
    }
    deleteExpenseChq(expense_id, expcheque_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            const cheque = yield this.query()
                .update({ expcheque_is_deleted: 1, expcheque_deleted_by })
                .into('trabill_expense_cheque_details')
                .where('expcheque_expense_id', expense_id);
            return cheque;
        });
    }
    editExpenseChq(data, expense_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const cheque = yield this.query()
                .update(data)
                .into('trabill_expense_cheque_details')
                .where('expcheque_expense_id', expense_id);
            return cheque;
        });
    }
    viewExpenses(page, size, search, from_date, to_date) {
        return __awaiter(this, void 0, void 0, function* () {
            search && search.toLowerCase();
            const page_number = (page - 1) * size;
            from_date
                ? (from_date = (0, moment_1.default)(new Date(from_date)).format('YYYY-MM-DD'))
                : null;
            to_date ? (to_date = (0, moment_1.default)(new Date(to_date)).format('YYYY-MM-DD')) : null;
            const data = yield this.query()
                .select('expense_id', 'expense_vouchar_no', 'expense_payment_type', 'expcheque_status', 'account_name', 'acctype_name', 'expense_total_amount', 'expense_date', 'expense_note', 'expense_is_deleted', 'expense_created_date', 'expense_voucher_url_1', 'expense_voucher_url_2', 'acctype_name')
                .from('trabill_expenses')
                .distinct()
                .leftJoin('trabill_accounts', 'trabill_accounts.account_id', 'trabill_expenses.expense_accounts_id')
                .leftJoin('trabill_expense_cheque_details', 'trabill_expense_cheque_details.expcheque_expense_id', 'trabill_expenses.expense_id')
                .leftJoin('trabill_accounts_type', 'trabill_accounts_type.acctype_id', 'trabill_expenses.expense_payment_type')
                .where('expense_is_deleted', 0)
                .andWhere((e) => {
                e.andWhere('expense_org_agency', this.org_agency).modify((event) => {
                    if (search) {
                        event
                            .andWhereRaw('LOWER(account_name) LIKE ?', [`%${search}%`])
                            .orWhereRaw('LOWER(expense_vouchar_no) LIKE ? ', [`%${search}%`]);
                    }
                    if (from_date && to_date) {
                        event.andWhereRaw(`DATE_FORMAT(expense_date, '%Y-%m-%d') BETWEEN ? AND ? `, [from_date, to_date]);
                    }
                });
            })
                .andWhere('expense_org_agency', this.org_agency)
                .orderBy('expense_created_date', 'desc')
                .limit(size)
                .offset(page_number);
            const [{ row_count }] = yield this.query()
                .select(this.db.raw(`count(*) as row_count`))
                .from('trabill_expenses')
                .leftJoin('trabill_accounts', 'trabill_accounts.account_id', 'trabill_expenses.expense_accounts_id')
                .where('expense_is_deleted', 0)
                .andWhere((e) => {
                e.andWhere('expense_org_agency', this.org_agency).modify((event) => {
                    if (search) {
                        event
                            .andWhereRaw('LOWER(account_name) LIKE ?', [`%${search}%`])
                            .orWhereRaw('LOWER(expense_vouchar_no) LIKE ? ', [`%${search}%`]);
                    }
                    if (from_date && to_date) {
                        event.andWhereRaw(`DATE_FORMAT(expense_date, '%Y-%m-%d') BETWEEN ? AND ? `, [from_date, to_date]);
                    }
                });
            })
                .andWhere('expense_org_agency', this.org_agency);
            return { count: row_count, data };
        });
    }
    viewSingleExpenses(expense_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const expense = (yield this.query()
                .select('expense_id', 'expense_vouchar_no', 'expense_payment_type', 'expcheque_number as expense_cheque_no', 'expcheque_bank_name', 'expcheque_withdraw_date', 'expcheque_status', 'expense_accounts_id', 'account_id', 'account_name', 'acctype_id', 'acctype_name', 'expense_total_amount', 'expense_date', 'expense_voucher_url_1', 'expense_voucher_url_2', 'expense_note', 'expense_acctrxn_id')
                .leftJoin('trabill_accounts', 'trabill_accounts.account_id', 'trabill_expenses.expense_accounts_id')
                .leftJoin('trabill_expense_cheque_details', 'trabill_expense_cheque_details.expcheque_expense_id', 'trabill_expenses.expense_id')
                .leftJoin('trabill_accounts_type', 'trabill_accounts_type.acctype_id', 'trabill_expenses.expense_accategory_id')
                .from('trabill_expenses')
                .andWhere('expense_id', expense_id));
            const expense_details = (yield this.query()
                .select('expdetails_head_id', 'head_name', 'expdetails_amount')
                .leftJoin('trabill_expense_head', 'trabill_expense_head.head_id', 'trabill_expense_details.expdetails_head_id')
                .from('trabill_expense_details')
                .andWhere('expdetails_expense_id', expense_id)
                .andWhere('expdetails_is_deleted', 0));
            if (expense[0]) {
                return Object.assign(Object.assign({}, expense[0]), (expense[0].expense_id && { expense_details }));
            }
            else {
                throw new customError_1.default('Cannot find any expense with this ID', 400, 'Bad Request');
            }
        });
    }
    getPreviousData(expense_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [expense] = yield this.query()
                .select('expense_payment_type', 'expense_acctrxn_id', 'expense_total_amount', 'expense_charge_id')
                .from('trabill_expenses')
                .where('expense_id', expense_id);
            return expense;
        });
    }
    getExpenseCheque(status) {
        return __awaiter(this, void 0, void 0, function* () {
            const cheques = yield this.query()
                .select('expcheque_id as cheque_id', 'expcheque_number as cheque_number', 'expcheque_withdraw_date as cheque_withdraw_date', 'expcheque_amount as cheque_amount', 'expcheque_bank_name as cheque_bank', 'expcheque_status as cheque_status')
                .from('trabill_expense_cheque_details')
                .leftJoin('trabill_expenses', { expense_id: 'expcheque_expense_id' })
                .where('expcheque_is_deleted', 0)
                .andWhere('expense_org_agency', this.org_agency)
                .andWhere('expcheque_status', status);
            return cheques;
        });
    }
    headInfos(expens_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const infos = yield this.query()
                .select('head_name', 'expdetails_amount', 'expense.expense_payment_type', this.db.raw('CASE WHEN expense_payment_type = 4 THEN "Cheque" WHEN expense_payment_type = 1 THEN "Cash" WHEN expense_payment_type = 2 THEN "Bank" WHEN expense_payment_type = 3 THEN "Mobile banking"  ELSE NULL END AS expense_pay_type'), 'expense.expense_note', 'expense_cheque_no', 'expcheque_withdraw_date', 'expcheque_bank_name', 'expense.expense_vouchar_no', 'expense.expense_total_amount', 'account_name')
                .leftJoin('trabill_expense_head', 'trabill_expense_head.head_id', 'trabill_expense_details.expdetails_head_id')
                .from('trabill_expense_details')
                .leftJoin('trabill_expenses as expense', {
                'expense.expense_id': 'expdetails_expense_id',
            })
                .leftJoin('trabill_accounts', {
                account_id: 'expense.expense_accounts_id',
            })
                .leftJoin('trabill_expense_cheque_details', {
                expcheque_expense_id: 'expense_id',
            })
                .where('head_org_agency', this.org_agency)
                .andWhere('expdetails_expense_id', expens_id)
                .andWhereNot('expdetails_is_deleted', 1);
            return infos;
        });
    }
    getExpense(expens_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const infos = yield this.query()
                .select('expense_total_amount', 'expense_payment_type', 'expense_acctrxn_id as prevAccTrxnId', 'expense_accounts_id as prevAccId', 'expense_charge_amount', 'expense_charge_id')
                .from('trabill_expenses')
                .where('expense_id', expens_id);
            if (infos[0]) {
                return infos[0];
            }
            throw new customError_1.default('Cannot find any expense', 400, 'Bad request');
        });
    }
    getExpenseChequeAmount(cheque_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const lastBalance = yield this.query()
                .select('expcheque_amount')
                .from('trabill_expense_cheque_details')
                .where('expcheque_id', cheque_id);
            if (lastBalance[0]) {
                const id = lastBalance[0];
                return Number(id.expcheque_amount);
            }
            else {
                throw new customError_1.default('Cannot find any account with this ID', 400, 'Bad requeest');
            }
        });
    }
}
exports.default = ExpenseModel;
//# sourceMappingURL=expense.models.js.map