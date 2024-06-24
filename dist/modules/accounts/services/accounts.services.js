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
const accountOpening_services_1 = __importDefault(require("./narrowServices/accountOpening.services"));
const addBalanceTrns_services_1 = __importDefault(require("./narrowServices/addBalanceTrns.services"));
const addClientBill_services_1 = __importDefault(require("./narrowServices/addClientBill.services"));
const addInvestment_services_1 = __importDefault(require("./narrowServices/addInvestment.services"));
const addNonInvoice_services_1 = __importDefault(require("./narrowServices/addNonInvoice.services"));
const addVendorBill_services_1 = __importDefault(require("./narrowServices/addVendorBill.services"));
const clientOpening_services_1 = __importDefault(require("./narrowServices/clientOpening.services"));
const combineOpening_1 = __importDefault(require("./narrowServices/combineOpening"));
const incentiveIncome_services_1 = __importDefault(require("./narrowServices/incentiveIncome.services"));
const vendorOpening_services_1 = __importDefault(require("./narrowServices/vendorOpening.services"));
class AccountsServices extends abstract_services_1.default {
    constructor() {
        super();
        // ACCOUNT CATEGORY
        this.getAccountCategoryType = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.accountsModel(req);
            const data = yield conn.getAccountCategoryType();
            if (data) {
                return { success: true, data };
            }
        });
        // CREATE ACCOUNT
        this.createAccount = (req) => __awaiter(this, void 0, void 0, function* () {
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.accountsModel(req);
                const body = req.body;
                const { account_id } = yield conn.insertAccount(body);
                return {
                    success: true,
                    message: 'Account created successfully!',
                    data: { account_id },
                };
            }));
        });
        // GET ALL ACCOUNT
        this.getAllAccounts = (req) => __awaiter(this, void 0, void 0, function* () {
            const { trash, page, size, search } = req.query;
            const conn = this.models.accountsModel(req);
            const accounts = yield conn.getAllAccounts(Number(trash) || 0, Number(page) || 1, Number(size) || 20, search);
            return Object.assign({ success: true }, accounts);
        });
        // EDIT ACCOUNT
        this.editAccount = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.accountsModel(req);
            const { account_id } = req.params;
            const { account_name, account_bank_name, account_branch_name, account_number, account_updated_by, account_acctype_id, account_routing_no, } = req.body;
            const accountInfo = {
                account_name,
                account_bank_name,
                account_branch_name,
                account_number,
                account_updated_by,
                account_acctype_id,
                account_routing_no,
            };
            yield conn.editAccount(accountInfo, account_id);
            const message = 'Account has been updated';
            yield this.insertAudit(req, 'update', message, account_updated_by, 'ACCOUNTS');
            return { success: true, message: 'Account updated successfully' };
        });
        // DELETE ACCOUNT
        this.deleteAccount = (req) => __awaiter(this, void 0, void 0, function* () {
            const { account_id } = req.params;
            const { delete_by } = req.body;
            const accountId = Number(account_id);
            if (!accountId) {
                throw new customError_1.default('Account id not valid', 400, 'Bad Request');
            }
            const conn = this.models.accountsModel(req);
            const accountTrnx = yield conn.getTraxn(accountId);
            if (accountTrnx.length === 0) {
                yield conn.deleteAccount(accountId, delete_by);
                const message = 'Account has been deleted';
                yield this.insertAudit(req, 'delete', message, delete_by, 'ACCOUNTS');
            }
            else {
                throw new customError_1.default('Account has a valid transaction', 400, 'Bad Request');
            }
            return { success: true, message: 'Account deleted successfully' };
        });
        // GET SINGLE ACCOUNT
        this.getAccount = (req) => __awaiter(this, void 0, void 0, function* () {
            const { account_id } = req.params;
            const conn = this.models.accountsModel(req);
            const data = yield conn.getAccount(account_id);
            return { success: true, data };
        });
        // ACCOUNT TRAN HISTORY
        this.getTransHistory = (req) => __awaiter(this, void 0, void 0, function* () {
            const { from_date, to_date, page, size } = req.query;
            let account_id = req.params.account_id;
            account_id = account_id === 'all' ? undefined : account_id;
            const conn = this.models.accountsModel(req);
            let data;
            data = yield conn.getTransHistory(account_id, from_date, to_date, Number(page) || 1, Number(size) || 20);
            return Object.assign({ success: true }, data);
        });
        this.accOpeningBalance = (req) => __awaiter(this, void 0, void 0, function* () {
            const { page, size, filter } = req.query;
            const conn = this.models.accountsModel(req);
            const data = yield conn.getOpeningBalance(Number(page) || 1, Number(size) || 20, filter);
            const count = yield conn.countOpeningBalanceRow(filter);
            return {
                success: true,
                count: count.row_count,
                message: 'All opening balance',
                data,
            };
        });
        this.DeleteAccOpeningBalance = (req) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { delete_by } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.accountsModel(req, trx);
                const trxns = new Trxns_1.default(req, trx);
                const { op_acctrxn_id, op_cltrxn_id, op_cl_id, op_comtrxn_id, op_com_id, op_ventrxn_id, op_ven_id, } = yield conn.getPreviousOpeningBal(id);
                if (op_acctrxn_id) {
                    yield trxns.deleteAccTrxn(op_acctrxn_id);
                }
                else if (op_ventrxn_id) {
                    yield trxns.deleteVTrxn(op_ventrxn_id, `vendor-${op_ven_id}`);
                }
                else if (op_cltrxn_id) {
                    yield trxns.deleteClTrxn(op_cltrxn_id, `client-${op_cl_id}`);
                }
                else if (op_comtrxn_id) {
                    yield trxns.deleteClTrxn(op_comtrxn_id, `combined-${op_com_id}`);
                }
                yield conn.deleteOpeningBalance(id, delete_by);
                yield this.insertAudit(req, 'delete', 'opening balance deleted', delete_by, 'ACCOUNTS');
                return {
                    success: true,
                    message: 'Opening Balance Deleted Successfully',
                };
            }));
        });
        this.getAccountByType = (req) => __awaiter(this, void 0, void 0, function* () {
            const { type_id } = req.params;
            const conn = this.models.accountsModel(req);
            const data = yield conn.getAccountByType(type_id);
            return { success: true, data };
        });
        this.getAccStatement = (req) => __awaiter(this, void 0, void 0, function* () {
            const account_id = Number(req.params.account_id);
            const { from_date, to_date, page, size } = req.query;
            const conn = this.models.accountsModel(req);
            const data = yield conn.getAccountStatements(account_id, String(from_date), String(to_date), Number(page) || 1, Number(size) || 20);
            return Object.assign({ success: true, message: 'Account transaction statement' }, data);
        });
        this.getTransferableAcc = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.accountsModel(req);
            let data = yield conn.getTrsfableAcc();
            data = data.filter((acc) => acc.accbalance_amount);
            return { success: true, data };
        });
        this.getAllBTransfers = (req) => __awaiter(this, void 0, void 0, function* () {
            const { page, size, from_date, to_date, search } = req.query;
            const conn = this.models.accountsModel(req);
            const data = yield conn.allBalanceTransfer(from_date, to_date, Number(page) || 1, Number(size) || 20, search);
            return Object.assign({ success: true }, data);
        });
        this.deleteBTransfer = (req) => __awaiter(this, void 0, void 0, function* () {
            const { balance_id } = req.params;
            const { created_by } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.accountsModel(req, trx);
                const trxns = new Trxns_1.default(req, trx);
                const { btransfer_amount, btransfer_from_acc_trxn_id, btransfer_to_acc_trxn_id, btransfer_charge_id, btransfer_actransaction_id, } = yield conn.singleBalanceTransfer(balance_id);
                yield conn.deleteBalanceTransfer(balance_id, created_by);
                yield trxns.deleteAccTrxn(btransfer_from_acc_trxn_id);
                yield trxns.deleteAccTrxn(btransfer_to_acc_trxn_id);
                yield trxns.deleteAccTrxn(btransfer_actransaction_id);
                if (btransfer_charge_id) {
                    yield this.models
                        .vendorModel(req, trx)
                        .deleteOnlineTrxnCharge(btransfer_charge_id);
                }
                const message = `Account balance transfer has been deleted ${btransfer_amount}/-`;
                yield this.insertAudit(req, 'delete', message, created_by, 'ACCOUNTS');
                return {
                    success: true,
                    message: 'Balance transfer deleted successfully',
                };
            }));
        });
        this.singleBalanceTransfer = (req) => __awaiter(this, void 0, void 0, function* () {
            const { balance_id } = req.params;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.accountsModel(req, trx);
                let data = [];
                const transferBalance = yield conn.getBalanceTransferById(balance_id);
                for (const item of transferBalance) {
                    const from_account_name = yield conn.getAccountName(item.btransfer_from_account_id);
                    const to_account_name = yield conn.getAccountName(item.btransfer_to_account_id);
                    data.push(Object.assign(Object.assign({}, item), { from_account_name, to_account_name }));
                }
                return { success: true, data };
            }));
        });
        this.balanceStatus = (req) => __awaiter(this, void 0, void 0, function* () {
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { page, size } = req.query;
                const conn = this.models.accountsModel(req, trx);
                const accTypeOne = yield conn.getBalanceStatus(1, Number(page) || 1, Number(size) || 20);
                const accTypeOneCount = yield conn.countBalanceStatusDataRow(1);
                const accTypeTwo = yield conn.getBalanceStatus(2, Number(page) || 1, Number(size) || 20);
                const accTypeTwoCount = yield conn.countBalanceStatusDataRow(2);
                const accTypeThree = yield conn.getBalanceStatus(3, Number(page) || 1, Number(size) || 20);
                const accTypeThreeCount = yield conn.countBalanceStatusDataRow(3);
                return {
                    success: true,
                    count: { accTypeOneCount, accTypeTwoCount, accTypeThreeCount },
                    data: { accTypeOne, accTypeTwo, accTypeThree },
                };
            }));
        });
        this.viewCompanies = (req) => __awaiter(this, void 0, void 0, function* () {
            const { page, size } = req.query;
            const conn = this.models.accountsModel(req);
            const data = yield conn.viewCompanies(Number(page) || 1, Number(size) || 20);
            return Object.assign({ success: true }, data);
        });
        this.getCompanies = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.accountsModel(req);
            const data = yield conn.getCompanies();
            return { success: true, data };
        });
        this.getnonInvoice = (req) => __awaiter(this, void 0, void 0, function* () {
            const { noninvoice_id } = req.params;
            const conn = this.models.accountsModel(req);
            const data = yield conn.nonInvoiceIncome(noninvoice_id);
            return { success: true, data };
        });
        this.editNonInvoice = (req) => __awaiter(this, void 0, void 0, function* () {
            const { noninvoice_id } = req.params;
            const { company_id, type_id, account_id, amount, noninvoice_created_by, cheque_no, receipt_no, date, note, } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.accountsModel(req, trx);
                const data = yield conn.nonInvoiceIncome(noninvoice_id);
                const AccTrxnBody = {
                    acctrxn_ac_id: account_id,
                    acctrxn_type: 'CREDIT',
                    acctrxn_amount: amount,
                    acctrxn_created_at: date,
                    acctrxn_created_by: noninvoice_created_by,
                    acctrxn_note: note,
                    acctrxn_particular_id: 35,
                    acctrxn_pay_type: 'CASH',
                    trxn_id: data.nonincome_actransaction_id,
                };
                const acctrxn_id = yield new Trxns_1.default(req, trx).AccTrxnUpdate(AccTrxnBody);
                const nonInvoiceincomeInfo = {
                    nonincome_actransaction_id: acctrxn_id,
                    nonincome_amount: amount,
                    nonincome_company_id: company_id,
                    nonincome_created_date: date,
                    nonincome_cheque_no: cheque_no,
                    nonincome_receipt_no: receipt_no,
                    nonincome_created_by: noninvoice_created_by,
                    nonincome_note: note,
                };
                yield conn.editNonInvoice(nonInvoiceincomeInfo, noninvoice_id);
                const message = `Non invoice income has been updated ${amount}/-`;
                yield this.insertAudit(req, 'update', message, noninvoice_created_by, 'ACCOUNTS');
                return {
                    success: true,
                    message: 'Non invoice edited successfully',
                };
            }));
        });
        this.viewAllNonInvoice = (req) => __awaiter(this, void 0, void 0, function* () {
            const { page, size, search, from_date, to_date } = req.query;
            const conn = this.models.accountsModel(req);
            const data = yield conn.getAllNonInvoice(Number(page) || 1, Number(size) || 20, search, from_date, to_date);
            return Object.assign({ success: true }, data);
        });
        this.getNonInvoiceById = (req) => __awaiter(this, void 0, void 0, function* () {
            const { noninvoice_id } = req.params;
            const conn = this.models.accountsModel(req);
            const data = yield conn.getAllNonInvoiceById(noninvoice_id);
            return { success: true, data };
        });
        this.deleteNonInvoice = (req) => __awaiter(this, void 0, void 0, function* () {
            const { noninvoice_id } = req.params;
            const { deleted_by } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.accountsModel(req, trx);
                const data = yield conn.nonInvoiceIncome(noninvoice_id);
                yield new Trxns_1.default(req, trx).deleteAccTrxn(data.nonincome_actransaction_id);
                const deleted = yield conn.deleteNonInvoice(noninvoice_id, deleted_by);
                const message = `Non invoice income has been delete ${Number(data.actransaction_amount)}/-`;
                yield this.insertAudit(req, 'delete', message, deleted_by, 'ACCOUNTS');
                if (!deleted) {
                    throw new customError_1.default('Please provide a valid Id to delete a client', 400, 'Invalid client Id');
                }
                return {
                    success: true,
                    message: 'Non invoice income deleted successfully',
                };
            }));
        });
        this.editInvestment = (req) => __awaiter(this, void 0, void 0, function* () {
            const { company_id, type_id, amount, investment_created_by, account_id, cheque_no, receipt_no, date, note, } = req.body;
            const { id } = req.params;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.accountsModel(req, trx);
                const data = yield conn.investmentByid(id);
                const AccTrxnBody = {
                    acctrxn_ac_id: account_id,
                    acctrxn_type: 'CREDIT',
                    acctrxn_amount: amount,
                    acctrxn_created_at: date,
                    acctrxn_created_by: investment_created_by,
                    acctrxn_note: note,
                    acctrxn_particular_id: 31,
                    acctrxn_pay_type: 'CASH',
                    trxn_id: data[0].investment_actransaction_id,
                };
                const transactionId = yield new Trxns_1.default(req, trx).AccTrxnUpdate(AccTrxnBody);
                const investmentInfo = {
                    investment_actransaction_id: transactionId,
                    investment_company_id: company_id,
                    investment_cheque_no: cheque_no,
                    investment_created_by: investment_created_by,
                    investment_created_date: date,
                    investment_receipt_no: receipt_no,
                    investment_note: note,
                };
                yield conn.editInvestment(investmentInfo, id);
                const message = `Investment has been updated ${amount}/-`;
                yield this.insertAudit(req, 'update', message, investment_created_by, 'ACCOUNTS');
                return {
                    success: true,
                    message: 'Investment edited successfully',
                };
            }));
        });
        this.viewInvestment = (req) => __awaiter(this, void 0, void 0, function* () {
            const { page, size, search, from_date, to_date } = req.query;
            const conn = this.models.accountsModel(req);
            const data = yield conn.getAllInvestment(Number(page) || 1, Number(size) || 20, search, from_date, to_date);
            return Object.assign({ success: true }, data);
        });
        this.getInvestmentById = (req) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const conn = this.models.accountsModel(req);
            const data = yield conn.investmentByid(id);
            return { success: true, data };
        });
        this.deleteInvestment = (req) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { investment_created_by } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.accountsModel(req, trx);
                const data = yield conn.investmentByid(id);
                yield new Trxns_1.default(req, trx).deleteAccTrxn(data[0].investment_actransaction_id);
                const deleted = yield conn.deleteInvestment(id, investment_created_by);
                const message = `Investment has been deleted ${data[0].actransaction_amount}/-`;
                yield this.insertAudit(req, 'delete', message, investment_created_by, 'ACCOUNTS');
                if (!deleted) {
                    throw new customError_1.default('Please provide a valid Id to delete a client', 400, 'Invalid client Id');
                }
                return { success: true, message: 'Investment deleted successfully!' };
            }));
        });
        this.viewClientBill = (req) => __awaiter(this, void 0, void 0, function* () {
            const { trash, page, size, search, from_date, to_date } = req.query;
            const conn = this.models.accountsModel(req);
            const data = yield conn.viewClientBill(Number(page) || 1, Number(size) || 20, search, from_date, to_date);
            return Object.assign({ success: true }, data);
        });
        this.viewSingleClientBill = (req) => __awaiter(this, void 0, void 0, function* () {
            const { bill_id } = req.params;
            const conn = this.models.accountsModel(req);
            const data = yield conn.viewSingleClientBill(bill_id);
            return { success: true, data };
        });
        this.deleteClientBill = (req) => __awaiter(this, void 0, void 0, function* () {
            const { bill_id } = req.params;
            const { deleted_by } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.accountsModel(req, trx);
                const trxns = new Trxns_1.default(req, trx);
                const { cbilladjust_amount, cbilladjust_ctrxn_id, prevCombClient } = yield conn.viewSingleClientBill(bill_id);
                yield trxns.deleteClTrxn(cbilladjust_ctrxn_id, prevCombClient);
                yield conn.deleteClientBill(bill_id, deleted_by);
                const message = `Client bill adjustment has been deleted ${cbilladjust_amount}/-`;
                yield this.insertAudit(req, 'delete', message, deleted_by, 'ACCOUNTS');
                return {
                    success: true,
                    message: 'Client Bill Adjustment deleted successfully',
                };
            }));
        });
        this.viewVendorBill = (req) => __awaiter(this, void 0, void 0, function* () {
            const { page, size, search, from_date, to_date } = req.query;
            const conn = this.models.accountsModel(req);
            const data = yield conn.viewVendorBill(Number(page) || 1, Number(size) || 20, search, from_date, to_date);
            return Object.assign({ success: true }, data);
        });
        this.viewSingleVendorBill = (req) => __awaiter(this, void 0, void 0, function* () {
            const { bill_id } = req.params;
            const conn = this.models.accountsModel(req);
            const data = yield conn.viewSingleVendorBill(bill_id);
            return { success: true, data };
        });
        this.deleteVendorBill = (req) => __awaiter(this, void 0, void 0, function* () {
            const { bill_id } = req.params;
            const { created_by } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.accountsModel(req, trx);
                const trxns = new Trxns_1.default(req, trx);
                const { vbilladjust_vtrxn_id, vbilladjust_amount, vbilladjust_vendor_id, } = yield conn.viewSingleVendorBill(bill_id);
                yield trxns.deleteVTrxn(vbilladjust_vtrxn_id, `vendor-${vbilladjust_vendor_id}`);
                yield conn.deleteVendorBill(bill_id, created_by);
                const message = `Vendor bill adjustment has been deleted ${vbilladjust_amount}/-`;
                yield this.insertAudit(req, 'delete', message, created_by, 'ACCOUNTS');
                return {
                    success: true,
                    message: 'Vendor bill adjustment deleted successfully',
                };
            }));
        });
        this.getAllVendors = (req) => __awaiter(this, void 0, void 0, function* () {
            const { trash, size, page, search } = req.query;
            const vendor_conn = this.models.vendorModel(req);
            const data = yield vendor_conn.getAllVendors(Number(page) || 1, Number(size) || 20, search);
            return { success: true, data };
        });
        this.allIncentiveIncome = (req) => __awaiter(this, void 0, void 0, function* () {
            const { page, size } = req.query;
            const conn = this.models.accountsModel(req);
            const data = yield conn.allIncentive(Number(page) || 1, Number(size) || 20);
            return Object.assign({ success: true }, data);
        });
        this.getIncentiveIncomeById = (req) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const conn = this.models.accountsModel(req);
            const data = yield conn.viewAllIncentive(id);
            return { success: true, data };
        });
        this.editIncentiveIncome = (req) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { vendor_id, type_id, account_id, adjust_with_bill, amount, incentive_created_by, date, note, } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.accountsModel(req, trx);
                const trxns = new Trxns_1.default(req, trx);
                const incentiveInfo = {
                    incentive_vendor_id: vendor_id,
                    incentive_adjust_bill: adjust_with_bill,
                    incentive_amount: amount,
                    incentive_trnxtype_id: type_id,
                    incentive_account_id: account_id,
                    incentive_created_by: incentive_created_by,
                    incentive_created_date: date,
                    incentive_note: note,
                };
                const { prev_incentive_acc_id, prev_incentive_adjust_bill, prev_incentive_vtrxn_id, prev_incentive_actransaction_id, } = yield conn.viewPrevIncentiveInfo(id);
                function updateVendorBalance() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const VTrxnBody = {
                            comb_vendor: `vendor-${vendor_id}`,
                            vtrxn_amount: amount,
                            vtrxn_created_at: date,
                            vtrxn_note: note,
                            vtrxn_particular_id: 37,
                            vtrxn_type: 'CREDIT',
                            vtrxn_user_id: incentive_created_by,
                            vtrxn_voucher: '',
                            trxn_id: prev_incentive_vtrxn_id,
                        };
                        yield trxns.VTrxnUpdate(VTrxnBody);
                    });
                }
                function updateAccountBalance() {
                    return __awaiter(this, void 0, void 0, function* () {
                        const AccTrxnBody = {
                            acctrxn_ac_id: account_id,
                            acctrxn_type: 'CREDIT',
                            acctrxn_amount: amount,
                            acctrxn_created_at: date,
                            acctrxn_created_by: incentive_created_by,
                            acctrxn_note: note,
                            acctrxn_particular_id: 37,
                            acctrxn_pay_type: 'CASH',
                            trxn_id: prev_incentive_actransaction_id,
                        };
                        const incentive_acctrxn_id = yield trxns.AccTrxnUpdate(AccTrxnBody);
                        incentiveInfo.incentive_actransaction_id = incentive_acctrxn_id;
                    });
                }
                if (adjust_with_bill === prev_incentive_adjust_bill) {
                    if (adjust_with_bill === 'YES') {
                        yield updateVendorBalance();
                    }
                    else {
                        yield updateAccountBalance();
                    }
                }
                else {
                    if (adjust_with_bill === 'YES') {
                        yield updateVendorBalance();
                    }
                    else {
                        yield updateAccountBalance();
                    }
                }
                yield conn.editIncentive(incentiveInfo, id);
                const message = `Investment has been updated ${amount}/-`;
                yield this.insertAudit(req, 'update', message, incentive_created_by, 'ACCOUNTS');
                return {
                    success: true,
                    message: 'Incentive income edited successfully',
                };
            }));
        });
        this.deleteIncentive = (req) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { deleted_by } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.accountsModel(req, trx);
                const trxns = new Trxns_1.default(req, trx);
                const { incentive_actransaction_id, incentive_adjust_bill, incentive_amount, incentive_vtrxn_id, incentive_vendor_id, } = yield conn.incentiveByid(id);
                yield conn.deleteIncentive(id, deleted_by);
                if (incentive_adjust_bill == 'YES') {
                    yield trxns.deleteVTrxn(incentive_vtrxn_id, `vendor-${incentive_vendor_id}`);
                }
                else {
                    yield trxns.deleteAccTrxn(incentive_actransaction_id);
                }
                const message = `Investment has been deleted ${incentive_amount}/-`;
                yield this.insertAudit(req, 'delete', message, deleted_by, 'ACCOUNTS');
                return {
                    success: true,
                    message: 'Incentive income deleted successfully',
                };
            }));
        });
        this.getListOfAccounts = (req) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.models.accountsModel(req).getListOfAccounts();
            return { success: true, data };
        });
        this.addAccountOpening = new accountOpening_services_1.default()
            .addAccountOpeningBalance;
        this.addClientOpening = new clientOpening_services_1.default()
            .addClientOpeningBalance;
        this.addVendorOpening = new vendorOpening_services_1.default()
            .addVendorOpeningBalance;
        this.addIncentiveIncome = new incentiveIncome_services_1.default()
            .addIncentiveIncomeService;
        this.addBTransfer = new addBalanceTrns_services_1.default().addBTransfer;
        this.addNonInvoice = new addNonInvoice_services_1.default().addNonInvoice;
        this.addInvestment = new addInvestment_services_1.default().addInvestment;
        this.clientBillAdj = new addClientBill_services_1.default().clientBillAdj;
        this.vendorBillAdj = new addVendorBill_services_1.default().vendorBillAdj;
        this.addCombineOpeningBalance = new combineOpening_1.default()
            .addCombineOpeningBalance;
    }
}
exports.default = AccountsServices;
//# sourceMappingURL=accounts.services.js.map