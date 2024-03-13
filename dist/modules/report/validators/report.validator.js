"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const abstract_validators_1 = __importDefault(require("../../../abstracts/abstract.validators"));
class ReportValidator extends abstract_validators_1.default {
    constructor() {
        super(...arguments);
        this.readClientLedger = [
            this.permissions.check(this.resources.report_ledgers, 'read'),
        ];
        this.readVendorLedger = [
            this.permissions.check(this.resources.report_ledgers, 'read'),
        ];
        this.readCollectionSales = [
            this.permissions.check(this.resources.sales_report, 'read'),
        ];
        this.readActivityLogs = [
            this.permissions.check(this.resources.audit_trail, 'read'),
        ];
        this.readUserLoginHistory = [
            this.permissions.check(this.resources.user_login_history, 'read'),
        ];
        this.readTrashHistory = [
            this.permissions.check(this.resources.trash_list, 'read'),
        ];
        this.readPreRegistration = [
            this.permissions.check(this.resources.report_module, 'read'),
        ];
        this.readClientWisePassengerList = [
            this.permissions.check(this.resources.passenger_list_report, 'read'),
        ];
        this.readGroupWisePassengerList = [
            this.permissions.check(this.resources.passenger_list_report, 'read'),
        ];
        this.readVendorCategoryDestinationReport = [
            this.permissions.check(this.resources.report_module, 'read'),
        ];
        this.readCountryWiseReport = [
            this.permissions.check(this.resources.country_wise_report, 'read'),
        ];
        this.readPassportWiseReport = [
            this.permissions.check(this.resources.passport_report, 'read'),
        ];
        this.readPassportStatusReport = [
            this.permissions.check(this.resources.passport_report, 'read'),
        ];
        this.readMonthlySummary = [this.permissions.check(this.resources.summary, 'read')];
        this.readDailySummary = [this.permissions.check(this.resources.summary, 'read')];
        this.readRefundReport = [
            this.permissions.check(this.resources.refund_report, 'read'),
        ];
        this.readHeadWiseExpenseReort = [
            this.permissions.check(this.resources.expense_report, 'read'),
        ];
        this.readExpenseReport = [
            this.permissions.check(this.resources.expense_report, 'read'),
        ];
        this.readAcountReport = [
            this.permissions.check(this.resources.accounts_report, 'read'),
        ];
        this.readSalesReportCollectionDue = [
            this.permissions.check(this.resources.sales_report, 'read'),
        ];
        this.readAuditTrail = [this.permissions.check(this.resources.audit_trail, 'read')];
        this.readSalesManReportCollectionDue = [
            this.permissions.check(this.resources.sales_report, 'read'),
        ];
        this.readSalesReportItemSalesman = [
            this.permissions.check(this.resources.sales_report, 'read'),
            (0, express_validator_1.check)('item_id')
                .optional()
                .customSanitizer((value) => {
                return value === null ? undefined : value;
            }),
        ];
        this.readPayroll = [this.permissions.check(this.resources.payroll, 'read')];
        this.readReport = [this.permissions.check(this.resources.report_module, 'read')];
        this.report_ledgers = [
            this.permissions.check(this.resources.report_ledgers, 'read'),
        ];
        this.readAITReport = [this.permissions.check(this.resources.ait_report, 'read')];
        this.readSalesCommissionReport = [
            this.permissions.check(this.resources.sales_report, 'read'),
        ];
        this.readAirlineWiseSalesReport = [
            this.permissions.check(this.resources.report_module, 'create'),
        ];
        this.readClientDiscount = [
            this.permissions.check(this.resources.client_discount, 'read'),
        ];
        this.readJournyDateWiseClientReport = [
            this.permissions.check(this.resources.journey_date_wise_report, 'read'),
        ];
        this.readTicketWiseProfitLoss = [];
        this.readAllTicketNo = [
            this.permissions.check(this.resources.profit_loss_report, 'read'),
        ];
        this.readAllProductWiseProfitLossLedger = [];
        this.readSessionWiseProfitLoss = [
            this.permissions.check(this.resources.profit_loss_report, 'read'),
        ];
        this.readAgentsReport = [
            this.permissions.check(this.resources.report_ledgers, 'read'),
        ];
    }
}
exports.default = ReportValidator;
//# sourceMappingURL=report.validator.js.map