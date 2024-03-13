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
class AccountsModel extends abstract_models_1.default {
    constructor() {
        super(...arguments);
        // INSERT ACCOUNT
        this.insertAccount = (body) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const query1 = trx.raw(`CALL createAccount(?, ?, ?, ?, ?, ?, ?, ?,?, @account_id_param);`, [
                    this.org_agency,
                    body.account_acctype_id,
                    body.account_name,
                    body.account_number || '',
                    body.account_bank_name || '',
                    body.account_branch_name || '',
                    body.opening_balance || 0,
                    body.account_created_by,
                    body.account_routing_no || '',
                ]);
                const query2 = trx.raw('SELECT @account_id_param AS account_id;');
                const [data, totalRows] = yield Promise.all([query1, query2]);
                const account_id = totalRows[0][0].account_id;
                return { account_id };
            }));
            return result;
        });
        // SELECT ALL ACCOUNT STATEMENT
        this.getAccountStatements = (accountId, fromDate, toDate, pageNumber, pageSize) => __awaiter(this, void 0, void 0, function* () {
            const offset = (pageNumber - 1) * pageSize;
            fromDate = (0, moment_1.default)(new Date(fromDate)).format('YYYY-MM-DD');
            toDate = (0, moment_1.default)(new Date(toDate)).format('YYYY-MM-DD');
            const data = yield this.query()
                .select('*')
                .from('trxn.v_acc_trxn')
                .where('acctrxn_ac_id', accountId)
                .andWhere('acctrxn_agency_id', this.org_agency)
                .andWhere(function () {
                if (fromDate && toDate) {
                    this.andWhereRaw(`DATE_FORMAT(acctrxn_created_at,'%Y-%m-%d') BETWEEN ? AND ?`, [fromDate, toDate]);
                }
            })
                .limit(pageSize)
                .offset(offset);
            const [count] = (yield this.query()
                .count('* as total')
                .from('trxn.v_acc_trxn')
                .where('acctrxn_ac_id', accountId)
                .andWhere('acctrxn_agency_id', this.org_agency)
                .andWhere(function () {
                if (fromDate && toDate) {
                    this.andWhereRaw(`DATE_FORMAT(acctrxn_created_at,'%Y-%m-%d') BETWEEN ? AND ?`, [fromDate, toDate]);
                }
            }));
            return { count: count.total, data };
        });
        this.getOpeningBalance = (page, size, filter) => __awaiter(this, void 0, void 0, function* () {
            const page_number = (page - 1) * size;
            const data = yield this.query()
                .select(this.db.raw('COALESCE(op_date,op_created_date) as op_created_date'), 'op_amount', 'op_trxn_type', 'op_id', 'account_name', 'client_name', 'vendor_name', 'combine_name', 'account_routing_no', 'op_note')
                .from('trabill_opening_balance')
                .whereNot('op_is_deleted', 1)
                .leftJoin('trabill_accounts', { account_id: 'op_acc_id' })
                .leftJoin('trabill_vendors', { vendor_id: 'op_ven_id' })
                .leftJoin('trabill_combined_clients', { combine_id: 'op_com_id' })
                .leftJoin('trabill_clients', { client_id: 'op_cl_id' })
                .andWhere('op_org_agency', this.org_agency)
                .modify((value) => {
                if (filter) {
                    value.where('op_acctype', filter);
                }
            })
                .limit(size)
                .offset(page_number)
                .orderByRaw(`COALESCE(op_date, op_created_date) desc`);
            return data;
        });
        this.getPreviousOpeningBal = (id) => __awaiter(this, void 0, void 0, function* () {
            const [data] = yield this.query()
                .select('op_acctrxn_id', 'op_cltrxn_id', 'op_cl_id', 'op_comtrxn_id', 'op_com_id', 'op_ventrxn_id', 'op_ven_id')
                .from('trabill_opening_balance')
                .where('op_id', id);
            if (!data) {
                throw new customError_1.default('id not match', 400, 'ERROR');
            }
            return data;
        });
        this.deleteOpeningBalance = (id, op_deleted_by) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .update({ op_is_deleted: 1, op_deleted_by })
                .into('trabill_opening_balance')
                .where('op_id', id);
            return data;
        });
        this.getTrsfableAcc = () => __awaiter(this, void 0, void 0, function* () {
            const accounts = yield this.query()
                .from('trabill_accounts')
                .select('account_id', 'account_name', 'account_lbalance as accbalance_amount')
                .where('account_org_agency', this.org_agency)
                .andWhereNot('account_is_deleted', 1)
                .distinct()
                .orderBy('account_id', 'desc');
            return accounts;
        });
        this.addBalanceTransfer = (data) => __awaiter(this, void 0, void 0, function* () {
            const [id] = yield this.query()
                .insert(Object.assign(Object.assign({}, data), { btransfer_org_agency: this.org_agency }))
                .into('trabill_balance_transfers');
            return id;
        });
        this.allBalanceTransfer = (from_date, to_date, page, size, search_text) => __awaiter(this, void 0, void 0, function* () {
            search_text && search_text.toLowerCase();
            from_date
                ? (from_date = (0, moment_1.default)(new Date(from_date)).format('YYYY-MM-DD'))
                : null;
            to_date ? (to_date = (0, moment_1.default)(new Date(to_date)).format('YYYY-MM-DD')) : null;
            const page_number = (page - 1) * size;
            const data = yield this.query()
                .select('btransfer_id', 'btransfer_from_account_id', 'bt_from.account_name as btransfer_from_name', 'btransfer_to_account_id', 'bt_to.account_name as btransfer_to_name', 'btransfer_amount', 'btransfer_charge', 'btransfer_is_deleted', 'btransfer_date', 'btransfer_note', 'btransfer_vouchar_no')
                .leftJoin('trabill_accounts as bt_from', 'trabill_balance_transfers.btransfer_from_account_id', 'bt_from.account_id')
                .leftJoin('trabill_accounts as bt_to', 'trabill_balance_transfers.btransfer_to_account_id', 'bt_to.account_id')
                .from('trabill_balance_transfers')
                .where('trabill_balance_transfers.btransfer_is_deleted', 0)
                .andWhere('trabill_balance_transfers.btransfer_org_agency', this.org_agency)
                .modify((event) => {
                if (from_date && to_date) {
                    event.andWhereRaw('Date(btransfer_date) BETWEEN ? AND ?', [
                        from_date,
                        to_date,
                    ]);
                }
                if (search_text) {
                    event
                        .where('bt_from.account_name', 'like', `%${search_text}%`)
                        .orWhere('bt_to.account_name', 'like', `%${search_text}%`);
                }
            })
                .orderBy('btransfer_id', 'desc')
                .limit(size)
                .offset(page_number);
            const [{ row_count }] = yield this.query()
                .select(this.db.raw(`COUNT(*) AS row_count`))
                .leftJoin('trabill_accounts as bt_from', 'trabill_balance_transfers.btransfer_from_account_id', 'bt_from.account_id')
                .leftJoin('trabill_accounts as bt_to', 'trabill_balance_transfers.btransfer_to_account_id', 'bt_to.account_id')
                .from('trabill_balance_transfers')
                .where('btransfer_is_deleted', 0)
                .andWhere('trabill_balance_transfers.btransfer_org_agency', this.org_agency)
                .modify((event) => {
                if (from_date && to_date) {
                    event.andWhereRaw('Date(btransfer_date) BETWEEN ? AND ?', [
                        from_date,
                        to_date,
                    ]);
                }
            });
            return { count: row_count, data };
        });
        this.getBalanceTransferById = (balance_id) => __awaiter(this, void 0, void 0, function* () {
            const singleTransfer = (yield this.query()
                .select('btransfer_amount', 'btransfer_vouchar_no as voucher_no', 'btransfer_from_account_id', 'btransfer_to_account_id', 'btransfer_charge', 'user_first_name as created_by', 'btransfer_create_date as created_date', 'btransfer_note', this.db.raw("CONCAT(user_first_name,' ', user_last_name)  AS created_by"), 'btransfer_created_by')
                .from('trabill_balance_transfers')
                .leftJoin('trabill_users', { user_id: 'btransfer_created_by' })
                .where('btransfer_id', balance_id));
            if (singleTransfer) {
                return singleTransfer;
            }
            throw new customError_1.default('Please provide a valid balance Id', 400, 'Invalid Balance Id');
        });
        this.singleBalanceTransfer = (balance_id) => __awaiter(this, void 0, void 0, function* () {
            const singleTransfer = (yield this.query()
                .select('btransfer_amount', 'btransfer_from_account_id', 'btransfer_from_acc_trxn_id', 'btransfer_to_account_id', 'btransfer_to_acc_trxn_id', 'btransfer_charge', this.db.raw("concat(user_first_name,' ',user_last_name) as user_full_name"), 'btransfer_charge_id', 'btransfer_actransaction_id')
                .from('trabill_balance_transfers')
                .leftJoin('trabill_users', { user_id: 'btransfer_created_by' })
                .where('btransfer_id', balance_id));
            if (singleTransfer[0]) {
                return singleTransfer[0];
            }
            throw new customError_1.default('Please provide a valid balance Id', 400, 'Invalid Balance Id');
        });
        this.deleteBalanceTransfer = (balance_id, btransfer_deleted_by) => __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .into('trabill_balance_transfers')
                .update({ btransfer_is_deleted: 1, btransfer_deleted_by })
                .where('btransfer_id', balance_id);
        });
        this.viewCompanies = (page, size) => __awaiter(this, void 0, void 0, function* () {
            const page_number = (page - 1) * size;
            const data = yield this.query()
                .from('trabill_companies')
                .select('company_id', 'company_name')
                .where('company_org_agency', this.org_agency)
                .andWhereNot('company_is_deleted', 1)
                .limit(size)
                .offset(page_number);
            const [{ row_count }] = yield this.query()
                .select(this.db.raw('COUNT(*) as row_count'))
                .from('trabill_companies')
                .where('company_org_agency', this.org_agency)
                .andWhereNot('company_is_deleted', 1);
            return { count: row_count, data };
        });
        this.getCompanies = () => __awaiter(this, void 0, void 0, function* () {
            const company = yield this.query()
                .from('trabill_companies')
                .select('company_id', 'company_name')
                .where('company_org_agency', this.org_agency)
                .andWhereNot('company_is_deleted', 1);
            return company;
        });
        this.addNonInvoice = (data) => __awaiter(this, void 0, void 0, function* () {
            const income = yield this.query()
                .insert(Object.assign(Object.assign({}, data), { nonincome_org_agency: this.org_agency }))
                .into('trabill_noninvoice_income_details');
            return income[0];
        });
        this.editNonInvoice = (data, noninvoice_id) => __awaiter(this, void 0, void 0, function* () {
            const income = yield this.query()
                .into('trabill_noninvoice_income_details')
                .update(data)
                .where('nonincome_id', noninvoice_id);
            return income;
        });
        this.getAllNonInvoice = (page, size, search, from_date, to_date) => __awaiter(this, void 0, void 0, function* () {
            search && search.toLowerCase();
            const page_number = (page - 1) * size;
            from_date
                ? (from_date = (0, moment_1.default)(new Date(from_date)).format('YYYY-MM-DD'))
                : null;
            to_date ? (to_date = (0, moment_1.default)(new Date(to_date)).format('YYYY-MM-DD')) : null;
            const data = yield this.query()
                .from('trabill_noninvoice_income_details')
                .select('nonincome_id', 'nonincome_company_id', 'nonincome_amount', 'nonincome_cheque_no', 'nonincome_receipt_no', 'trabill_accounts.account_acctype_id', 'trabill_accounts.account_id', 'trabill_accounts.account_name', 'trabill_accounts.account_branch_name', 'trabill_accounts_type.acctype_name', 'trabill_companies.company_name', `${this.trxn}.acc_trxn.acctrxn_amount as actransaction_amount`, 'trabill_users.user_first_name as noninvoice_created_by', 'nonincome_created_date', 'nonincome_vouchar_no', 'nonincome_note')
                .leftJoin(`${this.trxn}.acc_trxn`, `${this.trxn}.acc_trxn.acctrxn_id`, `trabill_noninvoice_income_details.nonincome_actransaction_id`)
                .leftJoin('trabill_accounts', 'trabill_accounts.account_id', `${this.trxn}.acc_trxn.acctrxn_ac_id`)
                .leftJoin('trabill_accounts_type', 'trabill_accounts_type.acctype_id', 'trabill_accounts.account_acctype_id')
                .leftJoin('trabill_companies', 'trabill_companies.company_id', 'trabill_noninvoice_income_details.nonincome_company_id')
                .leftJoin('trabill_users', 'trabill_users.user_id', `${this.trxn}.acc_trxn.acctrxn_created_by`)
                .whereNot('nonincome_is_deleted', 1)
                .andWhere('nonincome_org_agency', this.org_agency)
                .modify((event) => {
                if (search) {
                    event
                        .andWhereRaw(`LOWER(account_name) LIKE ?`, [`%${search}%`])
                        .orWhereRaw(`LOWER(account_branch_name) LIKE ?`, [`%${search}%`])
                        .orWhereRaw(`LOWER(company_name) LIKE ?`, [`%${search}%`]);
                }
                if (from_date && to_date) {
                    event.andWhereRaw(`DATE_FORMAT(nonincome_created_date,'%Y-%m-%d') BETWEEN ? AND ?`, [from_date, to_date]);
                }
            })
                .orderBy('nonincome_id', 'desc')
                .limit(size)
                .offset(page_number);
            const [{ row_count }] = yield this.query()
                .select(this.db.raw(`COUNT(*) AS row_count`))
                .from('trabill_noninvoice_income_details')
                .leftJoin(`${this.trxn}.acc_trxn`, `${this.trxn}.acc_trxn.acctrxn_id`, `trabill_noninvoice_income_details.nonincome_actransaction_id`)
                .leftJoin('trabill_accounts', 'trabill_accounts.account_id', `${this.trxn}.acc_trxn.acctrxn_ac_id`)
                .leftJoin('trabill_companies', 'trabill_companies.company_id', 'trabill_noninvoice_income_details.nonincome_company_id')
                .whereNot('nonincome_is_deleted', 1)
                .andWhere('nonincome_org_agency', this.org_agency)
                .modify((event) => {
                if (search) {
                    event
                        .andWhereRaw(`LOWER(account_name) LIKE ?`, [`%${search}%`])
                        .orWhereRaw(`LOWER(account_branch_name) LIKE ?`, [`%${search}%`])
                        .orWhereRaw(`LOWER(company_name) LIKE ?`, [`%${search}%`]);
                }
                if (from_date && to_date) {
                    event.andWhereRaw(`DATE_FORMAT(nonincome_created_date,'%Y-%m-%d') BETWEEN ? AND ?`, [from_date, to_date]);
                }
            });
            return { count: row_count, data };
        });
        this.getAllNonInvoiceById = (nonInvoice_id) => __awaiter(this, void 0, void 0, function* () {
            const invoices = yield this.query()
                .from('trabill_noninvoice_income_details')
                .select('nonincome_id', 'nonincome_company_id', 'nonincome_amount', 'nonincome_cheque_no', 'nonincome_receipt_no', 'trabill_accounts.account_acctype_id', 'trabill_accounts.account_id', 'trabill_accounts.account_name', 'trabill_accounts.account_branch_name', 'trabill_accounts_type.acctype_name', 'trabill_companies.company_name', `${this.trxn}.acc_trxn.acctrxn_amount as actransaction_amount`, 'trabill_users.user_first_name as noninvoice_created_by', 'nonincome_is_deleted', 'nonincome_created_date')
                .leftJoin(`${this.trxn}.acc_trxn`, `${this.trxn}.acc_trxn.acctrxn_id`, `trabill_noninvoice_income_details.nonincome_actransaction_id`)
                .leftJoin('trabill_accounts', 'trabill_accounts.account_id', `${this.trxn}.acc_trxn.acctrxn_ac_id`)
                .leftJoin('trabill_accounts_type', 'trabill_accounts_type.acctype_id', 'trabill_accounts.account_acctype_id')
                .leftJoin('trabill_companies', 'trabill_companies.company_id', 'trabill_noninvoice_income_details.nonincome_company_id')
                .leftJoin('trabill_users', 'trabill_users.user_id', `${this.trxn}.acc_trxn.acctrxn_created_by`)
                .where('nonincome_id', nonInvoice_id);
            return invoices;
        });
        this.nonInvoiceIncome = (noninvoice_id) => __awaiter(this, void 0, void 0, function* () {
            const invoice = (yield this.query()
                .from('trabill_noninvoice_income_details')
                .select('nonincome_id', 'account_id', 'acctrxn_amount AS actransaction_amount', 'nonincome_actransaction_id', 'nonincome_created_date')
                .leftJoin(`${this.trxn}.acc_trxn`, `${this.trxn}.acc_trxn.acctrxn_id`, `trabill_noninvoice_income_details.nonincome_actransaction_id`)
                .leftJoin('trabill_accounts', 'trabill_accounts.account_id', `${this.trxn}.acc_trxn.acctrxn_ac_id`)
                .where('nonincome_id', noninvoice_id));
            return invoice[0];
        });
        this.deleteNonInvoice = (nonInvoice_id, nonincome_deleted_by) => __awaiter(this, void 0, void 0, function* () {
            const invoice = yield this.query()
                .into('trabill_noninvoice_income_details')
                .update({ nonincome_is_deleted: 1, nonincome_deleted_by })
                .where('nonincome_id', nonInvoice_id);
            if (invoice) {
                return invoice;
            }
            else {
                throw new customError_1.default(`You can't delete this non-invoice income`, 400, `Bad request`);
            }
        });
        this.addInvestments = (data) => __awaiter(this, void 0, void 0, function* () {
            const investment = yield this.query()
                .insert(Object.assign(Object.assign({}, data), { investment_org_agency: this.org_agency }))
                .into('trabill_investment_details');
            return investment[0];
        });
        this.editInvestment = (data, id) => __awaiter(this, void 0, void 0, function* () {
            const investment = yield this.query()
                .into('trabill_investment_details')
                .update(data)
                .where('investment_id', id);
            return investment;
        });
        this.getAllInvestment = (page, size, search, from_date, to_date) => __awaiter(this, void 0, void 0, function* () {
            search && search.toLowerCase();
            const page_number = (page - 1) * size;
            from_date
                ? (from_date = (0, moment_1.default)(new Date(from_date)).format('YYYY-MM-DD'))
                : null;
            to_date ? (to_date = (0, moment_1.default)(new Date(to_date)).format('YYYY-MM-DD')) : null;
            const data = yield this.query()
                .from('trabill_investment_details')
                .select('investment_id', 'investment_company_id', 'investment_cheque_no', 'investment_receipt_no', 'investment_created_by', 'investment_created_date', 'investment_is_deleted', 'investment_vouchar_no', 'investment_note', 'trabill_accounts.account_id', 'trabill_accounts.account_name', 'trabill_accounts.account_branch_name', 'trabill_accounts.account_acctype_id', 'trabill_accounts_type.acctype_name', 'trabill_companies.company_name', `${this.trxn}.acc_trxn.acctrxn_amount AS actransaction_amount`)
                .leftJoin(`${this.trxn}.acc_trxn`, `${this.trxn}.acc_trxn.acctrxn_id`, 'trabill_investment_details.investment_actransaction_id')
                .leftJoin('trabill_accounts', 'trabill_accounts.account_id', `${this.trxn}.acc_trxn.acctrxn_ac_id`)
                .leftJoin('trabill_accounts_type', 'trabill_accounts_type.acctype_id', 'trabill_accounts.account_acctype_id')
                .leftJoin('trabill_companies', 'trabill_companies.company_id', 'trabill_investment_details.investment_company_id')
                .leftJoin('trabill_users', 'trabill_users.user_id', 'trabill_investment_details.investment_created_by')
                .where('investment_is_deleted', 0)
                .modify((event) => {
                event
                    .andWhere('investment_org_agency', this.org_agency)
                    .andWhere(function () {
                    if (search) {
                        event
                            .andWhereRaw(`LOWER(investment_cheque_no) LIKE ?`, [
                            `%${search}%`,
                        ])
                            .orWhereRaw(`LOWER(account_name) LIKE ? `, [`%${search}%`])
                            .orWhereRaw(`LOWER(account_branch_name) LIKE ? `, [
                            `%${search}%`,
                        ])
                            .orWhereRaw(`LOWER(company_name) LIKE ? `, [`%${search}%`]);
                    }
                    if (from_date && to_date) {
                        event.andWhereRaw(`DATE_FORMAT(investment_created_date, '%Y-%m-%d') BETWEEN ? AND ?`, [from_date, to_date]);
                    }
                });
            })
                .andWhere('investment_org_agency', this.org_agency)
                .orderBy('investment_id', 'desc')
                .limit(size)
                .offset(page_number);
            const [{ row_count }] = yield this.query()
                .select(this.db.raw(`COUNT(*) as row_count`))
                .from('trabill_investment_details')
                .leftJoin(`${this.trxn}.acc_trxn`, `${this.trxn}.acc_trxn.acctrxn_id`, 'trabill_investment_details.investment_actransaction_id')
                .leftJoin('trabill_accounts', 'trabill_accounts.account_id', `${this.trxn}.acc_trxn.acctrxn_ac_id`)
                .leftJoin('trabill_companies', 'trabill_companies.company_id', 'trabill_investment_details.investment_company_id')
                .where('investment_is_deleted', 0)
                .andWhere('investment_org_agency', this.org_agency)
                .modify((event) => {
                if (search) {
                    event
                        .andWhereRaw(`LOWER(investment_cheque_no) LIKE ?`, [`%${search}%`])
                        .orWhereRaw(`LOWER(account_name) LIKE ? `, [`%${search}%`])
                        .orWhereRaw(`LOWER(account_branch_name) LIKE ? `, [`%${search}%`])
                        .orWhereRaw(`LOWER(company_name) LIKE ? `, [`%${search}%`]);
                }
                if (from_date && to_date) {
                    event.andWhereRaw(`DATE_FORMAT(investment_created_date, '%Y-%m-%d') BETWEEN ? AND ?`, [from_date, to_date]);
                }
            });
            return { count: row_count, data };
        });
        this.investmentByid = (id) => __awaiter(this, void 0, void 0, function* () {
            const investment = yield this.query()
                .from('trabill_investment_details')
                .select('investment_id', 'account_id', 'trabill_accounts.account_name', 'trabill_accounts.account_branch_name', 'trabill_accounts.account_acctype_id', 'trabill_accounts_type.acctype_name', 'trabill_companies.company_name', `${this.trxn}.acc_trxn.acctrxn_amount AS actransaction_amount`, 'investment_actransaction_id')
                .leftJoin(`${this.trxn}.acc_trxn`, `${this.trxn}.acc_trxn.acctrxn_id`, 'trabill_investment_details.investment_actransaction_id')
                .leftJoin('trabill_accounts', 'trabill_accounts.account_id', `${this.trxn}.acc_trxn.acctrxn_ac_id`)
                .leftJoin('trabill_accounts_type', 'trabill_accounts_type.acctype_id', 'trabill_accounts.account_acctype_id')
                .leftJoin('trabill_companies', 'trabill_companies.company_id', 'trabill_investment_details.investment_company_id')
                .leftJoin('trabill_users', 'trabill_users.user_id', 'trabill_investment_details.investment_created_by')
                .where('investment_id', id);
            return investment;
        });
        this.deleteInvestment = (id, delete_by) => __awaiter(this, void 0, void 0, function* () {
            const investment = yield this.query()
                .into('trabill_investment_details')
                .update({ investment_is_deleted: 1, investment_deleted_by: delete_by })
                .where('investment_id', id);
            if (investment) {
                return investment;
            }
            else {
                throw new customError_1.default(`You can't delete investment`, 400, `Bad request`);
            }
        });
        this.addClientBill = (data) => __awaiter(this, void 0, void 0, function* () {
            const [bill] = yield this.query()
                .insert(Object.assign(Object.assign({}, data), { cbilladjust_org_agency: this.org_agency }))
                .into('trabill_client_bill_adjustment');
            return bill;
        });
        this.viewClientBill = (page, size, search, from_date, to_date) => __awaiter(this, void 0, void 0, function* () {
            search && search.toLowerCase();
            const page_number = (page - 1) * size;
            from_date
                ? (from_date = (0, moment_1.default)(new Date(from_date)).format('YYYY-MM-DD'))
                : null;
            to_date ? (to_date = (0, moment_1.default)(new Date(to_date)).format('YYYY-MM-DD')) : null;
            const data = yield this.query()
                .select('cbilladjust_id', 'cbilladjust_client_id', this.db.raw('IFNULL(client_name, combine_name) as client_name'), this.db.raw('IFNULL(client_id, combine_id) as comb_client_id'), 'cbilladjust_ctrxn_id', 'cbilladjust_vouchar_no', 'cbilladjust_type', 'cbilladjust_amount', 'cbilladjust_create_date', 'cbilladjust_note', 'cbilladjust_is_deleted')
                .leftJoin('trabill_clients', 'trabill_client_bill_adjustment.cbilladjust_client_id', 'trabill_clients.client_id')
                .leftJoin('trabill_combined_clients', {
                combine_id: 'cbilladjust_combined_id',
            })
                .from('trabill_client_bill_adjustment')
                .whereNot('cbilladjust_is_deleted', 1)
                .andWhere('cbilladjust_org_agency', this.org_agency)
                .modify((event) => {
                if (search) {
                    event
                        .andWhereRaw(`LOWER(cbilladjust_vouchar_no) LIKE ?`, [
                        `%${search}%`,
                    ])
                        .orWhereRaw(`LOWER(client_name) LIKE ?`, [`%${search}%`]);
                }
                if (from_date && to_date) {
                    event.andWhereRaw("DATE_FORMAT(cbilladjust_create_date, '%Y-%m-%d') BETWEEN ? AND ?", [from_date, to_date]);
                }
            })
                .orderBy('cbilladjust_id', 'desc')
                .limit(size)
                .offset(page_number);
            const [{ row_count }] = yield this.query()
                .select(this.db.raw(`count(*) as row_count`))
                .from('trabill_client_bill_adjustment')
                .leftJoin('trabill_clients', 'trabill_client_bill_adjustment.cbilladjust_client_id', 'trabill_clients.client_id')
                .leftJoin('trabill_combined_clients', {
                combine_id: 'cbilladjust_combined_id',
            })
                .where('cbilladjust_is_deleted', 1)
                .andWhere('cbilladjust_org_agency', this.org_agency)
                .modify((event) => {
                if (search) {
                    event
                        .andWhereRaw(`LOWER(cbilladjust_vouchar_no) LIKE ?`, [
                        `%${search}%`,
                    ])
                        .orWhereRaw(`LOWER(client_name) LIKE ?`, [`%${search}%`])
                        .orWhereRaw(`LOWER(combine_name) LIKE ?`, [`%${search}%`]);
                }
                if (from_date && to_date) {
                    event.andWhereRaw("DATE_FORMAT(cbilladjust_create_date, '%Y-%m-%d') BETWEEN ? AND ?", [from_date, to_date]);
                }
            });
            return { count: row_count, data };
        });
        this.viewSingleClientBill = (bill_id) => __awaiter(this, void 0, void 0, function* () {
            const bill = (yield this.query()
                .select('cbilladjust_id', this.db.raw('CAST(cbilladjust_amount AS DECIMAL(15,2)) AS cbilladjust_amount'), this.db.raw("CASE WHEN cbilladjust_client_id IS NOT NULL THEN CONCAT('client-',cbilladjust_client_id) ELSE CONCAT('combined-',cbilladjust_combined_id) END AS prevCombClient"), 'cbilladjust_client_id', 'cbilladjust_combined_id', 'client_name', 'cbilladjust_ctrxn_id', 'cbilladjust_vouchar_no', 'cbilladjust_type', 'cbilladjust_note', 'cbilladjust_create_date')
                .leftJoin('trabill_clients', 'trabill_client_bill_adjustment.cbilladjust_client_id', 'trabill_clients.client_id')
                .from('trabill_client_bill_adjustment')
                .where('cbilladjust_id', bill_id));
            if (bill[0]) {
                return bill[0];
            }
            else {
                throw new customError_1.default('Please provide a valid Id', 400, 'Invalid Id');
            }
        });
        this.deleteClientBill = (bill_id, cbilladjust_deleted_by) => __awaiter(this, void 0, void 0, function* () {
            const deleted = yield this.query()
                .into('trabill_client_bill_adjustment')
                .update({ cbilladjust_is_deleted: 1, cbilladjust_deleted_by })
                .where('cbilladjust_id', bill_id);
            if (deleted) {
                return deleted;
            }
            else {
                throw new customError_1.default(`You can't delete client bill adjustment`, 400, 'Bad request');
            }
        });
        this.addVendorBill = (data) => __awaiter(this, void 0, void 0, function* () {
            const bill = yield this.query()
                .insert(Object.assign(Object.assign({}, data), { vbilladjust_org_agency: this.org_agency }))
                .into('trabill_vendor_bill_adjustment');
            return bill[0];
        });
        this.viewVendorBill = (page, size, search, from_date, to_date) => __awaiter(this, void 0, void 0, function* () {
            search && search.toLowerCase();
            const page_number = (page - 1) * size;
            from_date
                ? (from_date = (0, moment_1.default)(new Date(from_date)).format('YYYY-MM-DD'))
                : null;
            to_date ? (to_date = (0, moment_1.default)(new Date(to_date)).format('YYYY-MM-DD')) : null;
            const data = yield this.query()
                .select('vbilladjust_id', 'vbilladjust_vendor_id', 'vendor_name', 'vbilladjust_vtrxn_id', 'vbilladjust_type', 'vbilladjust_vouchar_no', 'vbilladjust_amount', 'vbilladjust_create_date', 'vbilladjust_note', 'vbilladjust_is_deleted')
                .leftJoin('trabill_vendors', 'trabill_vendor_bill_adjustment.vbilladjust_vendor_id', 'trabill_vendors.vendor_id')
                .from('trabill_vendor_bill_adjustment')
                .whereNot('vbilladjust_is_deleted', 1)
                .andWhere('vbilladjust_org_agency', this.org_agency)
                .modify((event) => {
                if (search) {
                    event
                        .andWhereRaw(`LOWER(vendor_name) LIKE ?`, [`%${search}%`])
                        .orWhereRaw(`LOWER(vbilladjust_vouchar_no) LIKE ?`, [
                        `%${search}%`,
                    ]);
                }
                if (from_date && to_date) {
                    event.andWhereRaw("DATE_FORMAT(vbilladjust_create_date, '%Y-%m-%d') BETWEEN ? AND ?", [from_date, to_date]);
                }
            })
                .orderBy('vbilladjust_id', 'desc')
                .limit(size)
                .offset(page_number);
            const [{ row_count }] = yield this.query()
                .select(this.db.raw(`count(*) as row_count`))
                .from('trabill_vendor_bill_adjustment')
                .leftJoin('trabill_vendors', 'trabill_vendor_bill_adjustment.vbilladjust_vendor_id', 'trabill_vendors.vendor_id')
                .whereNot('vbilladjust_is_deleted', 1)
                .andWhere('vbilladjust_org_agency', this.org_agency)
                .modify((event) => {
                if (search) {
                    event
                        .andWhereRaw(`LOWER(vendor_name) LIKE ?`, [`%${search}%`])
                        .orWhereRaw(`LOWER(vbilladjust_vouchar_no) LIKE ?`, [
                        `%${search}%`,
                    ]);
                }
                if (from_date && to_date) {
                    event.andWhereRaw("DATE_FORMAT(vbilladjust_create_date, '%Y-%m-%d') BETWEEN ? AND ?", [from_date, to_date]);
                }
            });
            return { count: row_count, data };
        });
        this.viewSingleVendorBill = (bill_id) => __awaiter(this, void 0, void 0, function* () {
            const bill = (yield this.query()
                .select('vbilladjust_id', 'vbilladjust_vendor_id', 'vendor_name', 'vbilladjust_vtrxn_id', 'vbilladjust_type', 'vbilladjust_amount', 'vbilladjust_note', 'vbilladjust_create_date')
                .leftJoin('trabill_vendors', 'trabill_vendor_bill_adjustment.vbilladjust_vendor_id', 'trabill_vendors.vendor_id')
                .from('trabill_vendor_bill_adjustment')
                .where('vbilladjust_id', bill_id));
            if (bill[0]) {
                return bill[0];
            }
            else {
                throw new customError_1.default('Please Provide a valid bill Id', 400, 'Invalid Bill Id');
            }
        });
        this.deleteVendorBill = (bill_id, vbilladjust_deleted_by) => __awaiter(this, void 0, void 0, function* () {
            const deleted = yield this.query()
                .from('trabill_vendor_bill_adjustment')
                .update({ vbilladjust_is_deleted: 1, vbilladjust_deleted_by })
                .where('vbilladjust_id', bill_id);
            if (deleted) {
                return deleted;
            }
            else {
                throw new customError_1.default(`You can't delete vendor bill adjustment`, 400, 'Bad request');
            }
        });
        this.addIncentiveInc = (data) => __awaiter(this, void 0, void 0, function* () {
            const [incentive] = yield this.query()
                .insert(Object.assign(Object.assign({}, data), { incentive_org_agency: this.org_agency }))
                .into('trabill_incentive_income_details');
            return incentive;
        });
        this.updateIncentiveIncome = (incentive_id, data) => __awaiter(this, void 0, void 0, function* () {
            const incentive = yield this.query()
                .update(data)
                .into('trabill_incentive_income_details')
                .where('incentive_id', incentive_id);
            return incentive;
        });
        this.viewAllIncentive = (incentive_id) => __awaiter(this, void 0, void 0, function* () {
            const incentive = yield this.query()
                .select('incentive_id', 'incentive_vendor_id', 'vendor_name', 'incentive_account_id', 'account_name', 'incentive_date', 'account_branch_name', 'incentive_adjust_bill', 'incentive_amount', 'incentive_note', 'incentive_trnxtype_id as type_id', 'trxntype_name', this.db.raw(`CASE WHEN incentive_account_category_id = 1 THEN 'Cash' WHEN incentive_account_category_id = 2 THEN 'Bank' WHEN incentive_account_category_id = 3 THEN 'Mobile Banking' WHEN incentive_account_category_id = 4 THEN 'Cheque' ELSE NULL END AS transaction_type`), 'incentive_account_category_id', 'user_first_name as incentive_created_by', 'incentive_created_date', 'incentive_is_deleted')
                .leftJoin('trabill_vendors', 'trabill_incentive_income_details.incentive_vendor_id', 'trabill_vendors.vendor_id')
                .leftJoin('trabill_accounts', 'trabill_incentive_income_details.incentive_account_id', 'trabill_accounts.account_id')
                .leftJoin('trabill_users', 'trabill_incentive_income_details.incentive_created_by', 'trabill_users.user_id')
                .leftJoin('trabill_transaction_type', {
                trxntype_id: 'incentive_trnxtype_id',
            })
                .from('trabill_incentive_income_details')
                .where('incentive_id', incentive_id);
            return incentive;
        });
        this.allIncentive = (page, size) => __awaiter(this, void 0, void 0, function* () {
            const page_number = (page - 1) * size;
            const data = yield this.query()
                .select('incentive_id', 'incentive_vendor_id', 'incentive_vouchar_no', 'vendor_name', 'incentive_account_id', 'account_name', 'account_branch_name', 'incentive_adjust_bill', 'incentive_amount', 'incentive_date', 'incentive_note', 'incentive_trnxtype_id as type_id', this.db.raw(`CASE WHEN incentive_account_category_id = 1 THEN 'Cash' WHEN incentive_account_category_id = 2 THEN 'Bank' WHEN incentive_account_category_id = 3 THEN 'Mobile Banking' WHEN incentive_account_category_id = 4 THEN 'Cheque' ELSE NULL END AS transaction_type`), 'incentive_account_category_id', 'user_first_name as incentive_created_by', 'incentive_created_date', 'incentive_is_deleted')
                .leftJoin('trabill_vendors', 'trabill_incentive_income_details.incentive_vendor_id', 'trabill_vendors.vendor_id')
                .leftJoin('trabill_accounts', 'trabill_incentive_income_details.incentive_account_id', 'trabill_accounts.account_id')
                .leftJoin('trabill_users', 'trabill_incentive_income_details.incentive_created_by', 'trabill_users.user_id')
                .from('trabill_incentive_income_details')
                .where('incentive_is_deleted', 0)
                .andWhere('incentive_type', 'VENDOR')
                .andWhere('incentive_org_agency', this.org_agency)
                .orderBy('incentive_id', 'desc')
                .limit(size)
                .offset(page_number);
            const [{ row_count }] = yield this.query()
                .select(this.db.raw(`count(*) as row_count`))
                .from('trabill_incentive_income_details')
                .where('incentive_is_deleted', 0)
                .andWhere('incentive_type', 'VENDOR')
                .andWhere('incentive_org_agency', this.org_agency);
            return { count: row_count, data };
        });
        this.editIncentive = (data, incentive_id) => __awaiter(this, void 0, void 0, function* () {
            const incentive = yield this.query()
                .into('trabill_incentive_income_details')
                .update(data)
                .where('incentive_id', incentive_id);
            return incentive;
        });
        this.incentiveByid = (id) => __awaiter(this, void 0, void 0, function* () {
            const incentive = (yield this.query()
                .select('incentive_id', 'incentive_amount', 'incentive_vendor_id', 'incentive_adjust_bill', 'incentive_created_by', 'incentive_account_id', 'incentive_trnxtype_id', 'incentive_account_category_id', 'incentive_actransaction_id', 'incentive_vtrxn_id')
                .from('trabill_incentive_income_details')
                .where('incentive_id', id)
                .andWhere('incentive_type', 'VENDOR'));
            if (incentive[0]) {
                return incentive[0];
            }
            throw new customError_1.default('Please privide a valid incentive ID', 400, 'Invalid Incentive Id');
        });
        this.deleteIncentive = (id, incentive_deleted_by) => __awaiter(this, void 0, void 0, function* () {
            const incentive = yield this.query()
                .into('trabill_incentive_income_details')
                .update({ incentive_is_deleted: 1, incentive_deleted_by })
                .where('incentive_id', id);
            if (incentive) {
                return incentive;
            }
            else {
                throw new customError_1.default(`You can't delete incentive income`, 400, 'Bad request');
            }
        });
    }
    // ACCOUNT CATEGORY
    getAccountCategoryType() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .from('trabill_accounts_type')
                .select('acctype_id', 'acctype_name')
                .where('acctype_is_deleted', 0);
        });
    }
    // SELECT ALL ACCOUNT
    getAllAccounts(is_deleted, page, size, search) {
        return __awaiter(this, void 0, void 0, function* () {
            const page_number = (page - 1) * size;
            const data = yield this.query()
                .select('*')
                .from('v_accounts')
                .where('account_org_agency', this.org_agency)
                .andWhere('account_is_deleted', is_deleted)
                .limit(size)
                .offset(page_number)
                .modify((event) => {
                if (search) {
                    event
                        .where('account_name', 'like', `%${search}%`)
                        .andWhere('account_org_agency', this.org_agency)
                        .andWhere('account_is_deleted', is_deleted);
                }
            });
            const [{ row_count }] = yield this.query()
                .select(this.db.raw(`COUNT(*) AS row_count`))
                .from('v_accounts')
                .where('account_org_agency', this.org_agency)
                .andWhere('account_is_deleted', is_deleted);
            return { count: row_count, data };
        });
    }
    // EDIT ACCOUNT
    editAccount(data, account_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const account = yield this.query()
                .into('trabill_accounts')
                .update(data)
                .where('account_id', account_id);
            if (account) {
                return account;
            }
            else {
                throw new customError_1.default("You can't edit this account", 400, 'Bad request');
            }
        });
    }
    // SELECT ACCOUNT TRAN ID
    getTraxn(account_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select('acctrxn_id')
                .from(`${this.trxn}.acc_trxn`)
                .where('acctrxn_ac_id', account_id)
                .andWhere('acctrxn_is_deleted', 0)
                .andWhereNot('acctrxn_particular_id', 11);
            return data;
        });
    }
    // DELETE ACCOUNT
    deleteAccount(account_id, delete_by) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db.raw("call deleteAccountByType('ACCOUNT', ?, ?);", [
                delete_by,
                account_id,
            ]);
        });
    }
    // SELECT SINGLE ACCOUNT
    getAccount(account_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const singleAccount = yield this.query()
                .select('account_name', 'account_lbalance as amount')
                .from('trabill_accounts')
                .where('account_id', account_id);
            return singleAccount[0];
        });
    }
    // SELECT ACCOUNT TRAN HISTORY
    getTransHistory(accountId, from_date, to_date, page, size) {
        return __awaiter(this, void 0, void 0, function* () {
            const page_number = (page - 1) * size;
            from_date
                ? (from_date = (0, moment_1.default)(new Date(from_date)).format('YYYY-MM-DD'))
                : null;
            to_date ? (to_date = (0, moment_1.default)(new Date(to_date)).format('YYYY-MM-DD')) : null;
            const data = yield this.query()
                .select('*')
                .from(`${this.trxn}.v_acc_trxn`)
                .modify((event) => {
                if (accountId && accountId !== 'all') {
                    event.andWhere('acctrxn_ac_id', accountId);
                }
                if (from_date && to_date) {
                    event.andWhereRaw('DATE_FORMAT(acctrxn_created_at,"%Y-%m-%d") BETWEEN ? AND ?', [from_date, to_date]);
                }
            })
                .andWhere('acctrxn_agency_id', this.org_agency)
                .limit(size)
                .offset(page_number);
            const [{ row_count }] = yield this.query()
                .select(this.db.raw(`COUNT(*) AS row_count`))
                .from(`${this.trxn}.v_acc_trxn`)
                .andWhere('acctrxn_agency_id', this.org_agency)
                .modify((event) => {
                if (accountId && accountId !== 'all') {
                    event.andWhere('acctrxn_ac_id', accountId);
                }
                if (from_date && to_date) {
                    event.andWhereRaw('DATE_FORMAT(acctrxn_created_at,"%Y-%m-%d") BETWEEN ? AND ?', [from_date, to_date]);
                }
            });
            return { count: row_count, data };
        });
    }
    // INSERT ACCOUNT OPENING BALANCE
    insertOpeningBal(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const [id] = yield this.query()
                .insert(Object.assign(Object.assign({}, data), { op_org_agency: this.org_agency }))
                .into('trabill_opening_balance');
            return id;
        });
    }
    countOpeningBalanceRow(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const [count] = yield this.query()
                .count('* as row_count')
                .from('trabill_opening_balance')
                .whereNot('op_is_deleted', 1)
                .modify((value) => {
                if (filter) {
                    value.andWhere('op_acctype', filter);
                }
            })
                .andWhere('op_org_agency', this.org_agency);
            return count;
        });
    }
    getAccountByType(type_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const account = yield this.query()
                .select('account_id', 'account_name', 'account_lbalance as last_balance')
                .from('trabill_accounts')
                .where('account_acctype_id', type_id)
                .andWhereNot('account_is_deleted', 1)
                .andWhere('account_org_agency', this.org_agency)
                .orderBy('account_create_date', 'desc')
                .groupBy('account_id', 'account_name', 'last_balance');
            return account;
        });
    }
    getBalanceStatus(actypeID, page, size) {
        return __awaiter(this, void 0, void 0, function* () {
            const page_number = (page - 1) * size;
            const temp = yield this.query()
                .from('trabill_accounts')
                .select('account_id', 'account_acctype_id', 'account_name', 'account_number', 'account_bank_name', 'account_branch_name', 'account_lbalance as accbalance_amount')
                .where('account_acctype_id', actypeID)
                .andWhere('account_org_agency', this.org_agency)
                .andWhereNot('account_is_deleted', 1)
                .orderBy('account_create_date', 'desc')
                .limit(size)
                .offset(page_number);
            return temp;
        });
    }
    countBalanceStatusDataRow(actypeID) {
        return __awaiter(this, void 0, void 0, function* () {
            const [count] = yield this.query()
                .select(this.db.raw(`COUNT(*) AS row_count`))
                .from('trabill_accounts')
                .where('account_acctype_id', actypeID)
                .andWhere('account_org_agency', this.org_agency)
                .andWhereNot('account_is_deleted', 1);
            return count;
        });
    }
    getAccountLastBalance(account_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const lastBalance = yield this.query()
                .select('account_lbalance as accbalance_amount')
                .from('trabill_accounts')
                .where('account_id', account_id);
            if (lastBalance[0]) {
                const balance = lastBalance[0];
                return Number(balance.accbalance_amount || 0);
            }
            else {
                throw new customError_1.default('Cannot find any account with this ID', 400, 'Bad requeest');
            }
        });
    }
    getAccountName(account_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select('account_name')
                .from('trabill_accounts')
                .where('account_id', account_id);
            if (data) {
                return data[0].account_name;
            }
            else {
                throw new customError_1.default('Please provide valid account ID', 400, 'Bad request');
            }
        });
    }
    viewPrevIncentiveInfo(incentive_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select('incentive_actransaction_id', 'incentive_account_id', 'incentive_amount', 'incentive_adjust_bill', 'incentive_agent_id', 'incentive_agent_trxn_id', this.db.raw(`CASE WHEN incentive_client_id IS NOT NULL THEN CONCAT('client-',incentive_client_id) ELSE CONCAT('combined-',incentive_combine_id) END as comb_client`), 'incentive_ctrxn_id', 'incentive_vendor_id', 'incentive_vtrxn_id', 'incentive_vouchar_no')
                .from('trabill_incentive_income_details')
                .where('incentive_id', incentive_id);
            if (data[0]) {
                const { incentive_actransaction_id, incentive_account_id, incentive_amount, incentive_adjust_bill, incentive_agent_id, incentive_agent_trxn_id, comb_client, incentive_ctrxn_id, incentive_vendor_id, incentive_vtrxn_id, incentive_vouchar_no, } = data[0];
                return {
                    prev_incentive_trxn_id: incentive_actransaction_id,
                    prev_incentive_acc_id: incentive_account_id,
                    prev_incentive_amount: incentive_amount,
                    prev_incentive_adjust_bill: incentive_adjust_bill,
                    prev_incentive_agent_id: incentive_agent_id,
                    prev_incentive_agent_trxn_id: incentive_agent_trxn_id,
                    prev_incentive_comb_client: comb_client,
                    prev_incentive_ctrxn_id: incentive_ctrxn_id,
                    prev_incentive_vendor_id: incentive_vendor_id,
                    prev_incentive_vtrxn_id: incentive_vtrxn_id,
                    prev_incentive_actransaction_id: incentive_actransaction_id,
                    prev_voucher_no: incentive_vouchar_no,
                };
            }
            else {
                throw new customError_1.default('Please provide a valid incentive id', 400, 'Bad ID');
            }
        });
    }
    getListOfAccounts() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .select('account_id', 'account_name', 'account_number', 'account_lbalance as amount')
                .from('trabill_accounts')
                .where('account_org_agency', this.org_agency)
                .andWhereNot('account_is_deleted', 1);
        });
    }
}
exports.default = AccountsModel;
//# sourceMappingURL=accounts.models.js.map