"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_routers_1 = __importDefault(require("../../../../abstracts/abstract.routers"));
const client_controllers_1 = __importDefault(require("../controllers/client.controllers"));
class ClientRouter extends abstract_routers_1.default {
    constructor() {
        super();
        this.controllers = new client_controllers_1.default();
        this.callRouter();
    }
    callRouter() {
        this.routers.patch('/activate/:client_id', this.controllers.updateClientStatus);
        this.routers.get('/all', this.controllers.getAllClients);
        this.routers.post('/check-credit-limit', this.controllers.checkCreditLimit);
        this.routers.get('/view-all', this.controllers.viewAllClient);
        this.routers.get('/all-clients-combined', this.controllers.getAllClientAndCombined);
        this.routers.get('/clients-lastbalance/:client', this.controllers.getCombClientLBalance);
        this.routers.get('/:id', this.controllers.getSingleClient);
        this.routers.post('/create', this.controllers.addClient);
        this.routers.delete('/:client_id', this.controllers.deleteClient);
        this.routers.patch('/:client_id', this.controllers.editClient);
        this.routers.get('/report/excel', this.controllers.generateExcelReport);
        this.routers.get('/client-invoice/:client_id', this.controllers.clientAllInvoices);
        this.routers.get('/client-money-receipts/:client_id', this.controllers.clientAllMoneyReceipts);
        this.routers.get('/client-quotations/:client_id', this.controllers.clientAllQuotations);
        this.routers.get('/client-refund/:client_id', this.controllers.clientAllRefund);
        this.routers.get('/last-balance/:client_id', this.controllers.getClLastBalanceById);
        this.routers.get('/client-passport/:client_id', this.controllers.clientAllPassport);
        // send email
        this.routers.post('/send-email', this.controllers.sendEmailToClinet);
        /**
         * Incentive Income
         */
        this.routers
            .route('/incentive/income')
            .get(this.controllers.getClientCombinedIncentiveIncome)
            .post(this.controllers.addIncentiveIncomeClient);
        this.routers
            .route('/incentive/income/:incentive_id')
            .get(this.controllers.getSingleClientCombinedIncentiveIncome)
            .patch(this.controllers.editIncentiveIncomeCombClient)
            .delete(this.controllers.deleteIncentiveIncomeCombClient);
    }
}
exports.default = ClientRouter;
//# sourceMappingURL=client.routers.js.map