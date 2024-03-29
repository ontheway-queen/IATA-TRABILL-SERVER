"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_routers_1 = __importDefault(require("../../../abstracts/abstract.routers"));
const dashboard_controllers_1 = __importDefault(require("../controllers/dashboard.controllers"));
class DashboardRoutes extends abstract_routers_1.default {
    constructor() {
        super();
        this.controllers = new dashboard_controllers_1.default();
        this.callRouter();
    }
    callRouter() {
        this.routers.get('/summary', this.controllers.dashboardSummary);
        this.routers.get('/month-report', this.controllers.getMonthReport);
        this.routers.get('/acc-details', this.controllers.getAccountBalanceData);
        this.routers.get('/search', this.controllers.searchInvoices);
        this.routers.get('/expenses', this.controllers.getExpenses);
        // DAILY, MONTHLY & YEARLY REPORT
        this.routers.get('/tr_info', this.controllers.getTransactionInfo);
        this.routers.get('/daily-pay-pur', this.controllers.getDailyPaymentPurchase);
        this.routers.get('/monthly-pay-pur', this.controllers.getMonthlyPaymentPurchase);
        this.routers.get('/yearly-pay-pur', this.controllers.getYearlyPaymentPurchase);
        // BSP BILLING
        this.routers.get('/air_ticket-summary', this.controllers.getAirTicketSummary);
        this.routers.get('/vendors', this.controllers.getVendorBankGuarantee);
        this.routers.get('/best-clients', this.controllers.getBestClients);
        this.routers.get('/best-employee', this.controllers.getBestEmployee);
        this.routers.get('/iata-limit', this.controllers.iataBankGuaranteeLimit);
    }
}
exports.default = DashboardRoutes;
//# sourceMappingURL=dashboard.routes.js.map