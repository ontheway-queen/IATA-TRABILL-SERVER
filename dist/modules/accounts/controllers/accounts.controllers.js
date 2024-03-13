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
const abstract_controllers_1 = __importDefault(require("../../../abstracts/abstract.controllers"));
const accounts_services_1 = __importDefault(require("../services/accounts.services"));
const accounts_validator_1 = __importDefault(require("../validators/accounts.validator"));
class AccountsControllers extends abstract_controllers_1.default {
    constructor() {
        super();
        this.validator = new accounts_validator_1.default();
        this.services = new accounts_services_1.default();
        // ACCOUNT CATEGORY
        this.getAccountCategoryType = this.assyncWrapper.wrap(this.validator.readAddListOfAccounts, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAccountCategoryType(req);
            if (data === null || data === void 0 ? void 0 : data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Get all account category type');
            }
        }));
        // CREATE ACCOUNT
        this.createAccount = this.assyncWrapper.wrap(this.validator.createAccount, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.createAccount(req);
            if (data.success) {
                res.status(201).json(data);
            }
            else {
                this.error('Add accounts controller');
            }
        }));
        // GET ALL ACCOUNT
        this.getAllAccounts = this.assyncWrapper.wrap(this.validator.readAddListOfAccounts, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAllAccounts(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('get all clients');
            }
        }));
        // EDIT ACCOUNT
        this.editAccount = this.assyncWrapper.wrap(this.validator.editAccount, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.editAccount(req);
            if (data.success) {
                res.status(200).json(data);
            }
        }));
        // DELETE ACCOUNT
        this.deleteAccount = this.assyncWrapper.wrap(this.validator.deleteAddListOfAccounts, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.deleteAccount(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Error delete account');
            }
        }));
        // ACCOUNT STATEMENT
        this.accountStatement = this.assyncWrapper.wrap(this.validator.readAddListOfAccounts, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAccStatement(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Account statement');
            }
        }));
        // GET SINGLE ACCOUNT
        this.getSingleAccount = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAccount(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('get single account');
            }
        }));
        // ACCOUNT TRAN HISTORY
        this.accountTransaction = this.assyncWrapper.wrap(this.validator.readTransactionHistory, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getTransHistory(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Account transaction history');
            }
        }));
        // POST ACCOUNT OPENING BALANCE
        this.accountOpening = this.assyncWrapper.wrap(this.validator.addAccountsOpening, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.addAccountOpening(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getAccountByType = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAccountByType(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('get account by type');
            }
        }));
        this.balanceStatus = this.assyncWrapper.wrap(this.validator.readBalanceStatus, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.balanceStatus(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Balance Status');
            }
        }));
        this.accOpeningBalance = this.assyncWrapper.wrap(this.validator.readOpeningBalance, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.accOpeningBalance(req);
            if (data === null || data === void 0 ? void 0 : data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Get all account opening balances');
            }
        }));
        this.deleteAccOpeningBalance = this.assyncWrapper.wrap(this.validator.deleteOpeningBalance, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.DeleteAccOpeningBalance(req);
            if (data === null || data === void 0 ? void 0 : data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Something happen to wrong');
            }
        }));
        this.addCombineOpeningBalance = this.assyncWrapper.wrap(this.validator.addCombineOpening, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.addCombineOpeningBalance(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.clientOpening = this.assyncWrapper.wrap(this.validator.addClientOpening, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.addClientOpening(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.vendorOpening = this.assyncWrapper.wrap(this.validator.addVendorOpening, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.addVendorOpening(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getTrasnfrbleAcc = this.assyncWrapper.wrap(this.validator.readBalanceTransfer, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getTransferableAcc(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Transferable acoounts');
            }
        }));
        this.addBalanceTransfer = this.assyncWrapper.wrap(this.validator.addBalanceTransfer, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.addBTransfer(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.allBalanceTransfers = this.assyncWrapper.wrap(this.validator.readBalanceTransfer, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAllBTransfers(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('view all balance transfers');
            }
        }));
        this.deleteBalanceTransfer = this.assyncWrapper.wrap(this.validator.deleteBalanceTransfer, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.deleteBTransfer(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Delete balance transfer');
            }
        }));
        this.singleBalanceTransfer = this.assyncWrapper.wrap(this.validator.readBalanceTransfer, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.singleBalanceTransfer(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('get balance transfer');
            }
        }));
        this.viewCompanies = this.assyncWrapper.wrap(this.validator.readNonInvoiceIncome, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.viewCompanies(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Get Companies');
            }
        }));
        this.getCompanies = this.assyncWrapper.wrap(this.validator.readNonInvoiceIncome, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getCompanies(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Get Companies');
            }
        }));
        this.addNonInvoice = this.assyncWrapper.wrap(this.validator.addNonInvoice, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const invoice = yield this.services.addNonInvoice(req);
            if (invoice.success) {
                res.status(200).json(invoice);
            }
            else {
                this.error('Non Invoice income');
            }
        }));
        this.allNonInvoice = this.assyncWrapper.wrap(this.validator.readNonInvoiceIncome, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const invoice = yield this.services.viewAllNonInvoice(req);
            if (invoice.success) {
                res.status(200).json(invoice);
            }
            else {
                this.error('All Non invoice income');
            }
        }));
        this.getNonInvoiceById = this.assyncWrapper.wrap(this.validator.readNonInvoiceIncome, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const invoice = yield this.services.getNonInvoiceById(req);
            if (invoice.success) {
                res.status(200).json(invoice);
            }
            else {
                this.error('All Non invoice income');
            }
        }));
        this.editNonInvoice = this.assyncWrapper.wrap(this.validator.editNonInvoice, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const invoice = yield this.services.editNonInvoice(req);
            if (invoice.success) {
                res.status(200).json(invoice);
            }
            else {
                this.error('Edit Invoice');
            }
        }));
        this.deleteNonInvoice = this.assyncWrapper.wrap(this.validator.deleteNonInvoiceIncome, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const invoice = yield this.services.deleteNonInvoice(req);
            if (invoice.success) {
                res.status(200).json(invoice);
            }
            else {
                this.error('delete Non invoice income');
            }
        }));
        this.noninvoice = this.assyncWrapper.wrap(this.validator.readNonInvoiceIncome, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getnonInvoice(req);
            res.status(200).json(data);
        }));
        this.addInvestment = this.assyncWrapper.wrap(this.validator.addInvestment, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const investment = yield this.services.addInvestment(req);
            if (investment.success) {
                res.status(200).json(investment);
            }
            else {
                this.error('Add Investment');
            }
        }));
        this.allInvestments = this.assyncWrapper.wrap(this.validator.readInvenstments, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const investment = yield this.services.viewInvestment(req);
            if (investment.success) {
                res.status(200).json(investment);
            }
            else {
                this.error('All Investments');
            }
        }));
        this.getInvestmentById = this.assyncWrapper.wrap(this.validator.readInvenstments, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const investment = yield this.services.getInvestmentById(req);
            if (investment.success) {
                res.status(200).json(investment);
            }
            else {
                this.error('Investments by id');
            }
        }));
        this.editInvestment = this.assyncWrapper.wrap(this.validator.editInvestment, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const investment = yield this.services.editInvestment(req);
            if (investment.success) {
                res.status(200).json(investment);
            }
            else {
                this.error('Edit Investment');
            }
        }));
        this.deleteInvestment = this.assyncWrapper.wrap(this.validator.deleteInvenstments, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const invoice = yield this.services.deleteInvestment(req);
            if (invoice.success) {
                res.status(200).json(invoice);
            }
            else {
                this.error('delete investment');
            }
        }));
        this.getVendors = this.assyncWrapper.wrap(this.validator.readIncentiveIncome, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAllVendors(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Get vendors');
            }
        }));
        this.incentiveIncome = this.assyncWrapper.wrap(this.validator.addIncentive, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.addIncentiveIncome(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('add incentive income');
            }
        }));
        this.allIncentiveIncome = this.assyncWrapper.wrap(this.validator.readIncentiveIncome, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.allIncentiveIncome(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('all incentive income');
            }
        }));
        this.getIncentiveIncomeById = this.assyncWrapper.wrap(this.validator.readIncentiveIncome, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getIncentiveIncomeById(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('view incentive income by id');
            }
        }));
        this.editIncentive = this.assyncWrapper.wrap(this.validator.editIncentive, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.editIncentiveIncome(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('edit incentive income');
            }
        }));
        this.deleteIncentive = this.assyncWrapper.wrap(this.validator.deleteIncentiveIncome, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.deleteIncentive(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Delete incentive income');
            }
        }));
        this.clientBillAdj = this.assyncWrapper.wrap(this.validator.addClientBill, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.clientBillAdj(req);
            if (data.success) {
                res.status(201).json(data);
            }
            else {
                this.error('Client Bill Adjustment');
            }
        }));
        this.viewClientBill = this.assyncWrapper.wrap(this.validator.readClientBillAdjustment, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.viewClientBill(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('View Client bill');
            }
        }));
        this.singleClientBill = this.assyncWrapper.wrap(this.validator.readClientBillAdjustment, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.viewSingleClientBill(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('View single client bill');
            }
        }));
        this.deleteClientBill = this.assyncWrapper.wrap(this.validator.deleteClientBillAdjustment, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.deleteClientBill(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Delete client Bill');
            }
        }));
        this.vendorBillAdj = this.assyncWrapper.wrap(this.validator.addVendorBill, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.vendorBillAdj(req);
            if (data.success) {
                res.status(201).json(data);
            }
            else {
                this.error('Vendor Bill Adjustment');
            }
        }));
        this.viewVendorBill = this.assyncWrapper.wrap(this.validator.readVendorBillAdjustment, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.viewVendorBill(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('View vendor bill');
            }
        }));
        this.singleVendorBill = this.assyncWrapper.wrap(this.validator.readVendorBillAdjustment, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.viewSingleVendorBill(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('View Single vendor');
            }
        }));
        this.deleteVendorBill = this.assyncWrapper.wrap(this.validator.deleteVendorBillAdjustment, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.deleteVendorBill(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Delete Vendor Bill');
            }
        }));
        this.getListOfAccounts = this.assyncWrapper.wrap(this.validator.readAddListOfAccounts, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getListOfAccounts(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
    }
}
exports.default = AccountsControllers;
//# sourceMappingURL=accounts.controllers.js.map