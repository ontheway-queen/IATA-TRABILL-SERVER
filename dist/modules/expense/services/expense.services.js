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
const expenseHelper_1 = __importDefault(require("../utils/expenseHelper"));
class ExpneseService extends abstract_services_1.default {
    constructor() {
        super();
        this.addExpense = (req) => __awaiter(this, void 0, void 0, function* () {
            const { expense_details, expense_payment_type, charge_amount, expense_accategory_id, expense_accounts_id, expense_cheque_no, expcheque_withdraw_date, expcheque_bank_name, expense_total_amount, expense_date, expense_note, expense_created_by, } = req.body;
            const imageList = req.imgUrl;
            const imageUrlObj = Object.assign({}, ...imageList);
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.expenseModel(req, trx);
                const trxns = new Trxns_1.default(req, trx);
                const expense_vouchar_no = yield this.generateVoucher(req, 'EXP');
                let expense_charge_id = null;
                if (expense_payment_type === 3 && charge_amount) {
                    const online_charge_trxn = {
                        charge_from_acc_id: expense_accounts_id,
                        charge_amount: charge_amount,
                        charge_purpose: `Expense`,
                        charge_note: expense_note,
                    };
                    expense_charge_id = yield this.models
                        .vendorModel(req, trx)
                        .insertOnlineTrxnCharge(online_charge_trxn);
                }
                const expenseInfo = Object.assign({ expense_payment_type,
                    expense_total_amount,
                    expense_date,
                    expense_created_by,
                    expense_vouchar_no,
                    expense_note, expense_charge_amount: charge_amount, expense_charge_id }, imageUrlObj);
                if (expense_payment_type !== 4 && expense_accounts_id) {
                    // account transaction
                    let accPayType;
                    if (expense_payment_type === 1) {
                        accPayType = 'CASH';
                    }
                    else if (expense_payment_type === 2) {
                        accPayType = 'BANK';
                    }
                    else if (expense_payment_type === 3) {
                        accPayType = 'MOBILE BANKING';
                    }
                    else {
                        accPayType = 'CASH';
                    }
                    const AccTrxnBody = {
                        acctrxn_ac_id: expense_accounts_id,
                        acctrxn_type: 'DEBIT',
                        acctrxn_voucher: expense_vouchar_no,
                        acctrxn_amount: expense_total_amount,
                        acctrxn_created_at: expense_date,
                        acctrxn_created_by: expense_created_by,
                        acctrxn_note: expense_note,
                        acctrxn_particular_id: 72,
                        acctrxn_particular_type: 'Expense create',
                        acctrxn_pay_type: accPayType,
                    };
                    const expense_acctrxn_id = yield trxns.AccTrxnInsert(AccTrxnBody);
                    expenseInfo.expense_accategory_id = expense_accategory_id;
                    expenseInfo.expense_accounts_id = expense_accounts_id;
                    expenseInfo.expense_acctrxn_id = expense_acctrxn_id;
                }
                if (expense_payment_type == 4) {
                    expenseInfo.expense_cheque_no = expense_cheque_no;
                }
                const expenseId = yield conn.createExpense(expenseInfo);
                if (expense_payment_type == 4) {
                    expenseInfo.expense_cheque_no = expense_cheque_no;
                    const chequeInfo = {
                        expcheque_number: String(expense_cheque_no),
                        expcheque_bank_name: expcheque_bank_name,
                        expcheque_withdraw_date: expcheque_withdraw_date,
                        expcheque_amount: expense_total_amount,
                        expcheque_expense_id: expenseId,
                    };
                    yield conn.addExpenseCheque(chequeInfo);
                }
                const expenseDetailsInfo = expenseHelper_1.default.parseExpenseDetails(JSON.parse(String(expense_details)), expenseId);
                yield conn.createExpenseDtls(expenseDetailsInfo);
                yield this.insertAudit(req, 'create', `Create expense ${expense_payment_type}:- ${expense_total_amount}/-`, expense_created_by, 'EXPENSE');
                yield this.updateVoucher(req, 'EXP');
                return {
                    success: true,
                    message: 'Expense created successfull',
                    expenseId,
                };
            }));
        });
        this.editExpense = (req) => __awaiter(this, void 0, void 0, function* () {
            const { expense_details, expense_payment_type, expense_accategory_id, expense_accounts_id, expense_cheque_no, expcheque_withdraw_date, expcheque_bank_name, expense_total_amount, expense_date, expense_note, charge_amount, expense_created_by, } = req.body;
            const payType = Number(expense_payment_type);
            const { expense_id } = req.params;
            const imageList = req.imgUrl;
            const imageUrlObj = Object.assign({}, ...imageList);
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.expenseModel(req, trx);
                const trxns = new Trxns_1.default(req, trx);
                const { expense_payment_type: prev_ex_type, prevAccTrxnId, expense_charge_id, } = yield conn.getExpense(expense_id);
                if (expense_charge_id) {
                    yield this.models
                        .vendorModel(req, trx)
                        .updateOnlineTrxnCharge({ charge_amount, charge_purpose: 'Expense charge' }, expense_charge_id);
                }
                if (imageUrlObj.expense_voucher_url_1) {
                    const data = yield conn.expenseImagesUrl(expense_id);
                    yield this.deleteFile.delete_image(data === null || data === void 0 ? void 0 : data.expense_voucher_url_1);
                }
                if (imageUrlObj.expense_voucher_url_2) {
                    const data = yield conn.expenseImagesUrl(expense_id);
                    yield this.deleteFile.delete_image(data === null || data === void 0 ? void 0 : data.expense_voucher_url_2);
                }
                const expenseInfo = Object.assign({ expense_payment_type,
                    expense_total_amount,
                    expense_date,
                    expense_created_by,
                    expense_note, expense_charge_amount: charge_amount, expense_charge_id: null }, imageUrlObj);
                // account transaction
                if (payType !== 4) {
                    const AccTrxnBody = {
                        acctrxn_ac_id: expense_accounts_id,
                        acctrxn_type: 'DEBIT',
                        acctrxn_amount: expense_total_amount,
                        acctrxn_created_at: expense_date,
                        acctrxn_created_by: expense_created_by,
                        acctrxn_note: expense_note,
                        acctrxn_particular_id: 20,
                        acctrxn_particular_type: 'Expense',
                        acctrxn_pay_type: 'CASH',
                        trxn_id: prevAccTrxnId,
                    };
                    const expense_acctrxn_id = yield trxns.AccTrxnUpdate(AccTrxnBody);
                    expenseInfo.expense_accategory_id = expense_accategory_id;
                    expenseInfo.expense_accounts_id = expense_accounts_id;
                    expenseInfo.expense_acctrxn_id = expense_acctrxn_id;
                }
                else {
                    if (prev_ex_type !== 4) {
                        yield trxns.deleteAccTrxn(prevAccTrxnId);
                    }
                }
                if (expense_payment_type == 4) {
                    expenseInfo.expense_cheque_no = expense_cheque_no;
                    if (prev_ex_type === 4) {
                        yield conn.deleteExpenseChq(expense_id, expense_created_by);
                    }
                    const chequeInfo = {
                        expcheque_number: String(expense_cheque_no),
                        expcheque_bank_name,
                        expcheque_withdraw_date,
                        expcheque_amount: expense_total_amount,
                        expcheque_expense_id: expense_id,
                    };
                    yield conn.editExpenseChq(chequeInfo, expense_id);
                }
                yield conn.editExpense(expenseInfo, expense_id);
                const expenseDetailsInfo = expenseHelper_1.default.parseExpenseDetails(JSON.parse(String(expense_details)), expense_id);
                yield conn.deleteExpenseDtls(expense_id, expense_created_by);
                yield conn.createExpenseDtls(expenseDetailsInfo);
                yield this.insertAudit(req, 'update', `Update expense ${expense_payment_type}:- ${expense_total_amount}/-`, expense_created_by, 'EXPENSE');
                return {
                    success: true,
                    message: 'Expense edited successfull',
                };
            }));
        });
        this.allExpenses = (req) => __awaiter(this, void 0, void 0, function* () {
            const { trash, page, size, search, from_date, to_date } = req.query;
            const conn = this.models.expenseModel(req);
            const data = yield conn.viewExpenses(Number(page) || 1, Number(size) || 20, search, from_date, to_date);
            return Object.assign({ success: true }, data);
        });
        this.singleExpenses = (req) => __awaiter(this, void 0, void 0, function* () {
            const { expense_id } = req.params;
            const conn = this.models.expenseModel(req);
            const data = yield conn.viewSingleExpenses(expense_id);
            return { success: true, data };
        });
        this.deleteExpense = (req) => __awaiter(this, void 0, void 0, function* () {
            const { expense_id } = req.params;
            const { expense_created_by, expense_date } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.expenseModel(req, trx);
                const trxns = new Trxns_1.default(req, trx);
                const { expense_payment_type, expense_acctrxn_id, expense_total_amount, expense_charge_id, } = yield conn.getPreviousData(expense_id);
                if (expense_acctrxn_id) {
                    yield trxns.deleteAccTrxn(expense_acctrxn_id);
                }
                yield conn.deleteExpense(expense_id, expense_created_by);
                yield conn.deleteExpenseDtls(expense_id, expense_created_by);
                if (expense_payment_type == 4) {
                    yield conn.deleteExpenseChq(expense_id, expense_created_by);
                }
                if (expense_charge_id) {
                    yield this.models
                        .vendorModel(req, trx)
                        .deleteOnlineTrxnCharge(expense_charge_id);
                }
                yield this.insertAudit(req, 'delete', `Delete expense ${expense_payment_type}:- ${expense_total_amount}/-`, expense_created_by, 'EXPENSE');
                return { success: true, message: 'Expense deleted successfully' };
            }));
        });
        this.expenseInfos = (req) => __awaiter(this, void 0, void 0, function* () {
            const { expense_id } = req.params;
            const conn = this.models.expenseModel(req);
            const data = yield conn.headInfos(expense_id);
            console.log({ data, expense_id });
            return { success: true, data };
        });
        this.expenseCheques = (req) => __awaiter(this, void 0, void 0, function* () {
            const { status } = req.query;
            const conn = this.models.expenseModel(req);
            const data = yield conn.getExpenseCheque(status);
            return { success: true, data };
        });
    }
}
exports.default = ExpneseService;
//# sourceMappingURL=expense.services.js.map