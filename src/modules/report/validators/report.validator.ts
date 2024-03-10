import { check, query } from 'express-validator';
import AbstractValidator from '../../../abstracts/abstract.validators';

class ReportValidator extends AbstractValidator {
  readClientLedger = [
    this.permissions.check(this.resources.report_ledgers, 'read'),
  ];

  readVendorLedger = [
    this.permissions.check(this.resources.report_ledgers, 'read'),
  ];

  readCollectionSales = [
    this.permissions.check(this.resources.sales_report, 'read'),
  ];

  readActivityLogs = [
    this.permissions.check(this.resources.audit_trail, 'read'),
  ];

  readUserLoginHistory = [
    this.permissions.check(this.resources.user_login_history, 'read'),
  ];
  readTrashHistory = [
    this.permissions.check(this.resources.trash_list, 'read'),
  ];

  readPreRegistration = [
    this.permissions.check(this.resources.report_module, 'read'),
  ];

  readClientWisePassengerList = [
    this.permissions.check(this.resources.passenger_list_report, 'read'),
  ];

  readGroupWisePassengerList = [
    this.permissions.check(this.resources.passenger_list_report, 'read'),
  ];

  readVendorCategoryDestinationReport = [
    this.permissions.check(this.resources.report_module, 'read'),
  ];

  readCountryWiseReport = [
    this.permissions.check(this.resources.country_wise_report, 'read'),
  ];

  readPassportWiseReport = [
    this.permissions.check(this.resources.passport_report, 'read'),
  ];

  readPassportStatusReport = [
    this.permissions.check(this.resources.passport_report, 'read'),
  ];

  readMonthlySummary = [this.permissions.check(this.resources.summary, 'read')];

  readDailySummary = [this.permissions.check(this.resources.summary, 'read')];

  readRefundReport = [
    this.permissions.check(this.resources.refund_report, 'read'),
  ];

  readHeadWiseExpenseReort = [
    this.permissions.check(this.resources.expense_report, 'read'),
  ];

  readExpenseReport = [
    this.permissions.check(this.resources.expense_report, 'read'),
  ];

  readAcountReport = [
    this.permissions.check(this.resources.accounts_report, 'read'),
  ];

  readSalesReportCollectionDue = [
    this.permissions.check(this.resources.sales_report, 'read'),
  ];

  readAuditTrail = [this.permissions.check(this.resources.audit_trail, 'read')];

  readSalesManReportCollectionDue = [
    this.permissions.check(this.resources.sales_report, 'read'),
  ];

  readSalesReportItemSalesman = [
    this.permissions.check(this.resources.sales_report, 'read'),
    check('item_id')
      .optional()
      .customSanitizer((value) => {
        return value === null ? undefined : value;
      }),
  ];

  readPayroll = [this.permissions.check(this.resources.payroll, 'read')];

  readReport = [this.permissions.check(this.resources.report_module, 'read')];
  report_ledgers = [
    this.permissions.check(this.resources.report_ledgers, 'read'),
  ];

  readAITReport = [this.permissions.check(this.resources.ait_report, 'read')];

  readSalesCommissionReport = [
    this.permissions.check(this.resources.sales_report, 'read'),
  ];

  readAirlineWiseSalesReport = [
    this.permissions.check(this.resources.report_module, 'create'),
  ];

  readClientDiscount = [
    this.permissions.check(this.resources.client_discount, 'read'),
  ];

  readJournyDateWiseClientReport = [
    this.permissions.check(this.resources.journey_date_wise_report, 'read'),
  ];

  readTicketWiseProfitLoss = [];

  readAllTicketNo = [
    this.permissions.check(this.resources.profit_loss_report, 'read'),
  ];

  readAllProductWiseProfitLossLedger = [];

  readSessionWiseProfitLoss = [
    this.permissions.check(this.resources.profit_loss_report, 'read'),
  ];

  readAgentsReport = [
    this.permissions.check(this.resources.report_ledgers, 'read'),
  ];
}

export default ReportValidator;
