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
const dashboard_services_1 = __importDefault(require("../services/dashboard.services"));
const dashboard_validators_1 = __importDefault(require("../validators/dashboard.validators"));
class DashboardControllers extends abstract_controllers_1.default {
    constructor() {
        super();
        this.services = new dashboard_services_1.default();
        this.validator = new dashboard_validators_1.default();
        /**
         * @Desc Dashboard summary data
         * @Method GET
         * @Api /api/v1/dashboard/summary
         */
        this.dashboardSummary = this.assyncWrapper.wrap(this.validator.readAllProducts, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.dashboardSummary(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('get all products...');
            }
        }));
        /**
         * @Desc Search all invoices by clients or invoice-info
         * @Method GET
         * @Api /api/v1/dashboard/search?search=
         */
        this.searchInvoices = this.assyncWrapper.wrap(this.validator.dashboardValidator, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.searchInvoices(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Search invoices');
            }
        }));
        this.getAccountBalanceData = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAccountBalanceData(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('getAccountBalanceData');
            }
        }));
        this.getExpenses = this.assyncWrapper.wrap(this.validator.dashboardValidator, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getExpenses(req);
            if (data.success) {
                res.status(200).json(data);
            }
        }));
        this.getMonthReport = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getMonthReport(req);
            if (data.success) {
                res.status(200).json(data);
            }
        }));
        // DAILY , MONTHLY & YEARLY TRANSACTIONS
        this.getTransactionInfo = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getTransactionInfo(req);
            if (data.success) {
                res.status(200).json(data);
            }
        }));
        this.getDailyPaymentPurchase = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getDailyPaymentPurchase(req);
            if (data.success) {
                res.status(200).json(data);
            }
        }));
        this.getMonthlyPaymentPurchase = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getMonthlyPaymentPurchase(req);
            if (data.success) {
                res.status(200).json(data);
            }
        }));
        this.getYearlyPaymentPurchase = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getYearlyPaymentPurchase(req);
            if (data.success) {
                res.status(200).json(data);
            }
        }));
        // BSP BILLING
        this.getBSPBilling = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getBSPBilling(req);
            if (data.success) {
                res.status(200).json(data);
            }
        }));
        this.getBspBillingSummary = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getBspBillingSummary(req);
            if (data.success) {
                res.status(200).json(data);
            }
        }));
        this.getVendorBankGuarantee = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getVendorBankGuarantee(req);
            if (data.success) {
                res.status(200).json(data);
            }
        }));
        this.getBestClients = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getBestClients(req);
            if (data.success) {
                res.status(200).json(data);
            }
        }));
        this.getBestEmployee = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getBestEmployee(req);
            if (data.success) {
                res.status(200).json(data);
            }
        }));
        this.iataBankGuaranteeLimit = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.iataBankGuaranteeLimit(req);
            if (data.success) {
                res.status(200).json(data);
            }
        }));
        this.bspBillingCrossCheck = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.bspBillingCrossCheck(req);
            if (data.success) {
                res.status(200).json(data);
            }
        }));
        this.uploadBSPDocs = this.assyncWrapper.wrap(this.validator.uploadBSP, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.uploadBSPDocs(req);
            if (data.success) {
                res.status(200).json(data);
            }
        }));
        this.deleteBSPDocs = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.deleteBSPDocs(req);
            if (data.success) {
                res.status(200).json(data);
            }
        }));
        this.selectBspFiles = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.selectBspFiles(req);
            if (data.success) {
                res.status(200).json(data);
            }
        }));
        this.bspFileList = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.bspFileList(req);
            if (data.success) {
                res.status(200).json(data);
            }
        }));
    }
}
exports.default = DashboardControllers;
//# sourceMappingURL=dashboard.controllers.js.map