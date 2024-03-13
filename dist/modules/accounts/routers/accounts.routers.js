"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_routers_1 = __importDefault(require("../../../abstracts/abstract.routers"));
const accounts_controllers_1 = __importDefault(require("../controllers/accounts.controllers"));
class AccountsRouter extends abstract_routers_1.default {
    constructor() {
        super();
        this.controllers = new accounts_controllers_1.default();
        this.callRouter();
    }
    callRouter() {
        // GET ACCOUNT CATEGORY AND CREATE ACCOUNT
        this.routers
            .get('/account-category', this.controllers.getAccountCategoryType)
            .post('/create', this.controllers.createAccount);
        // GET ALL ACCOUNT
        this.routers.get('/all', this.controllers.getAllAccounts);
        // EDIT ACCOUNT BY ACCOUNT_ID
        this.routers.patch('/edit/:account_id', this.controllers.editAccount);
        // DELETE ACCOUNT
        this.routers.delete('/:account_id', this.controllers.deleteAccount);
        // ACCOUNT STATEMENT
        this.routers.get('/account-statement/:account_id', this.controllers.accountStatement);
        // GET SINGLE ACCOUNT
        this.routers.get('/single-account/:account_id', this.controllers.getSingleAccount);
        // Transaction History
        this.routers.get('/transaction-history/:account_id', this.controllers.accountTransaction);
        // POST ACCOUNT OPENING BALANCE
        this.routers.post('/account-opening', this.controllers.accountOpening);
        this.routers.get('/opening-balance', this.controllers.accOpeningBalance);
        this.routers.delete('/opening-balance/:id', this.controllers.deleteAccOpeningBalance);
        this.routers.route('/client-opening').post(this.controllers.clientOpening);
        this.routers.route('/vendor-opening').post(this.controllers.vendorOpening);
        // combine opening
        this.routers
            .route('/combine-opening')
            .post(this.controllers.addCombineOpeningBalance);
        // Balance status
        this.routers.get('/balance-status', this.controllers.balanceStatus);
        // Balance transfer
        this.routers.get('/transferable-accounts', this.controllers.getTrasnfrbleAcc);
        this.routers
            .route('/balance-transfer')
            .post(this.controllers.addBalanceTransfer)
            .get(this.controllers.allBalanceTransfers);
        // delete balance transfer
        this.routers
            .route('/balance-transfer/:balance_id')
            .get(this.controllers.singleBalanceTransfer)
            .patch(this.controllers.deleteBalanceTransfer);
        // Non Invoice Income
        this.routers.get('/get-companies', this.controllers.getCompanies);
        this.routers.get('/companies', this.controllers.viewCompanies);
        this.routers.get('/account-by-type/:type_id', this.controllers.getAccountByType);
        this.routers
            .route('/non-invoice-income')
            .post(this.controllers.addNonInvoice)
            .get(this.controllers.allNonInvoice);
        this.routers
            .route('/non-invoice-income/:noninvoice_id')
            .get(this.controllers.getNonInvoiceById)
            .patch(this.controllers.editNonInvoice)
            .delete(this.controllers.deleteNonInvoice);
        this.routers.get('/test/:noninvoice_id', this.controllers.noninvoice);
        // Investments
        this.routers
            .route('/investments')
            .post(this.controllers.addInvestment)
            .get(this.controllers.allInvestments);
        this.routers
            .route('/investments/:id')
            .get(this.controllers.getInvestmentById)
            .patch(this.controllers.editInvestment)
            .delete(this.controllers.deleteInvestment);
        // Incentive Income
        this.routers.get('/get-vendors', this.controllers.getVendors);
        this.routers
            .route('/incentive-income')
            .post(this.controllers.incentiveIncome)
            .get(this.controllers.allIncentiveIncome);
        this.routers
            .route('/incentive-income/:id')
            .get(this.controllers.getIncentiveIncomeById)
            .patch(this.controllers.editIncentive)
            .delete(this.controllers.deleteIncentive);
        // Client Bill adjustment
        this.routers
            .route('/client-bill-adjustment')
            .post(this.controllers.clientBillAdj)
            .get(this.controllers.viewClientBill);
        this.routers
            .route('/client-bill-adjustment/:bill_id')
            .get(this.controllers.singleClientBill)
            .delete(this.controllers.deleteClientBill);
        // Vendor Bill adjustment
        this.routers
            .route('/vendor-bill-adjustment')
            .post(this.controllers.vendorBillAdj)
            .get(this.controllers.viewVendorBill);
        this.routers
            .route('/vendor-bill-adjustment/:bill_id')
            .get(this.controllers.singleVendorBill)
            .delete(this.controllers.deleteVendorBill);
        this.routers.get('/account-list', this.controllers.getListOfAccounts);
    }
}
exports.default = AccountsRouter;
//# sourceMappingURL=accounts.routers.js.map