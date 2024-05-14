"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../../app/database");
const admin_auth_models_1 = __importDefault(require("../../auth/admin_auth.models"));
const Notification_Modal_1 = __importDefault(require("../../modules/Notifications/Models/Notification.Modal"));
const accounts_models_1 = __importDefault(require("../../modules/accounts/models/accounts.models"));
const adminPanel_models_1 = __importDefault(require("../../modules/adminPanel/Models/adminPanel.models"));
const cheques_models_1 = __importDefault(require("../../modules/cheques/models/cheques.models"));
const agent_profile_models_1 = __importDefault(require("../../modules/clients/agents_profile/Models/agent_profile.models"));
const client_models_1 = __importDefault(require("../../modules/clients/client/models/client.models"));
const combineClients_models_1 = __importDefault(require("../../modules/clients/combined_clients/models/combineClients.models"));
const common_models_1 = __importDefault(require("../../modules/commonModule/common.models"));
const TourItineray_model_1 = __importDefault(require("../../modules/configuaration/subModules/tourItinerary/TourItineray.model"));
const dashboard_models_1 = __importDefault(require("../../modules/dashboard/models/dashboard.models"));
const databaseReset_models_1 = __importDefault(require("../../modules/databaseReset/databaseReset.models"));
const expense_models_1 = __importDefault(require("../../modules/expense/models/expense.models"));
const HajjiMangement_Models_1 = __importDefault(require("../../modules/hajj_management/Models/HajjiMangement.Models"));
const invoiceAirticket_models_1 = __importDefault(require("../../modules/invoices/invoice-air-ticket/models/invoiceAirticket.models"));
const invoiceTour_models_1 = __importDefault(require("../../modules/invoices/invoice-tour/models/invoiceTour.models"));
const invoiceVisa_models_1 = __importDefault(require("../../modules/invoices/invoice-visa/models/invoiceVisa.models"));
const invoiceNonCommission_models_1 = __importDefault(require("../../modules/invoices/invoice_airticket_non_commission/models/invoiceNonCommission.models"));
const invoiceReissue_models_1 = __importDefault(require("../../modules/invoices/invoice_airticket_reissue/models/invoiceReissue.models"));
const InvoiceHajjPreReg_Models_1 = __importDefault(require("../../modules/invoices/invoice_hajj_pre_reg/Models/InvoiceHajjPreReg.Models"));
// import InvoiceHajjModels from '../../common/model/CommonInvoice.models';
const invoiceOther_models_1 = __importDefault(require("../../modules/invoices/invoice_other/models/invoiceOther.models"));
const InvoiceUmmrah_Models_1 = __importDefault(require("../../modules/invoices/invoice_ummrah/Models/InvoiceUmmrah.Models"));
const loan_models_1 = __importDefault(require("../../modules/loanMGT/models/loan.models"));
const MoneyReceipt_models_1 = __importDefault(require("../../modules/money-receipt/Models/MoneyReceipt.models"));
const passport_models_1 = __importDefault(require("../../modules/passportMGT/models/passport.models"));
const payroll_models_1 = __importDefault(require("../../modules/payroll/models/payroll.models"));
const quotation_models_1 = __importDefault(require("../../modules/quotation/models/quotation.models"));
const refund_models_1 = __importDefault(require("../../modules/refund/models/refund.models"));
const report_models_1 = __importDefault(require("../../modules/report/models/report.models"));
const sms_models_1 = __importDefault(require("../../modules/smsSystem/models/sms.models"));
const VendorModel_1 = __importDefault(require("../../modules/vendor/models/VendorModel"));
const CommonInvoice_models_1 = __importDefault(require("./CommonInvoice.models"));
const ConfigModels_1 = __importDefault(require("./ConfigModels"));
const salesPurchaseReport_models_1 = __importDefault(require("../../modules/report/models/salesPurchaseReport.models"));
const profitLossReport_1 = __importDefault(require("../../modules/report/models/profitLossReport"));
const feedback_models_1 = __importDefault(require("../../modules/feedback/feedback.models"));
const Trxn_models_1 = __importDefault(require("./Trxn.models"));
const InvoiceHajj_models_1 = __importDefault(require("../../modules/invoices/invoice_hajji/Models/InvoiceHajj.models"));
const pnr_details_models_1 = __importDefault(require("../../modules/invoices/invoice-air-ticket/models/pnr_details.models"));
class Models {
    constructor() {
        this.db = database_1.db;
        this.configModel = new ConfigModels_1.default(database_1.db);
    }
    adminAuthModel(req, trx) {
        return new admin_auth_models_1.default(trx || this.db, req);
    }
    dashboardModal(req, trx) {
        return new dashboard_models_1.default(trx || this.db, req);
    }
    clientModel(req, trx) {
        return new client_models_1.default(trx || this.db, req);
    }
    combineClientModel(req, trx) {
        return new combineClients_models_1.default(trx || this.db, req);
    }
    agentProfileModel(req, trx) {
        return new agent_profile_models_1.default(trx || this.db, req);
    }
    payrollModel(req, trx) {
        return new payroll_models_1.default(trx || this.db, req);
    }
    accountsModel(req, trx) {
        return new accounts_models_1.default(trx || this.db, req);
    }
    loanModel(req, trx) {
        return new loan_models_1.default(trx || this.db, req);
    }
    quotationModel(req, trx) {
        return new quotation_models_1.default(trx || this.db, req);
    }
    passportModel(req, trx) {
        return new passport_models_1.default(trx || this.db, req);
    }
    expenseModel(req, trx) {
        return new expense_models_1.default(trx || this.db, req);
    }
    smsModel(req, trx) {
        return new sms_models_1.default(trx || this.db, req);
    }
    refundModel(req, trx) {
        return new refund_models_1.default(trx || this.db, req);
    }
    reportModel(req, trx) {
        return new report_models_1.default(trx || this.db, req);
    }
    salesPurchasesReport(req, trx) {
        return new salesPurchaseReport_models_1.default(trx || this.db, req);
    }
    vendorModel(req, trx) {
        return new VendorModel_1.default(trx || this.db, req);
    }
    invoiceAirticketModel(req, trx) {
        return new invoiceAirticket_models_1.default(trx || this.db, req);
    }
    NotificationModals(req, trx) {
        return new Notification_Modal_1.default(trx || this.db, req);
    }
    invoiceNonCommission(req, trx) {
        return new invoiceNonCommission_models_1.default(trx || this.db, req);
    }
    reissueAirticket(req, trx) {
        return new invoiceReissue_models_1.default(trx || this.db, req);
    }
    invoiceOtherModel(req, trx) {
        return new invoiceOther_models_1.default(trx || this.db, req);
    }
    invoiceVisaModel(req, trx) {
        return new invoiceVisa_models_1.default(trx || this.db, req);
    }
    invoiceHajjPre(req, trx) {
        return new InvoiceHajjPreReg_Models_1.default(trx || this.db, req);
    }
    HajjiManagementModels(req, trx) {
        return new HajjiMangement_Models_1.default(trx || this.db, req);
    }
    InvoiceHajjModels(req, trx) {
        return new InvoiceHajj_models_1.default(trx || this.db, req);
    }
    InvoiceUmmarhModels(req, trx) {
        return new InvoiceUmmrah_Models_1.default(trx || this.db, req);
    }
    MoneyReceiptModels(req, trx) {
        return new MoneyReceipt_models_1.default(trx || this.db, req);
    }
    TourItinerayModels(req, trx) {
        return new TourItineray_model_1.default(trx || this.db, req);
    }
    invoiceTourModels(req, trx) {
        return new invoiceTour_models_1.default(trx || this.db, req);
    }
    CommonInvoiceModel(req, trx) {
        return new CommonInvoice_models_1.default(trx || this.db, req);
    }
    PnrDetailsModels(req, trx) {
        return new pnr_details_models_1.default(trx || this.db, req);
    }
    DatabaseResetModels(req, trx) {
        return new databaseReset_models_1.default(trx || this.db, req);
    }
    CommonModels(req, trx) {
        return new common_models_1.default(trx || this.db, req);
    }
    chequesModels(req, trx) {
        return new cheques_models_1.default(trx || this.db, req);
    }
    adminPanel(req, trx) {
        return new adminPanel_models_1.default(trx || this.db, req);
    }
    profitLossReport(req, trx) {
        return new profitLossReport_1.default(trx || this.db, req);
    }
    feedbackModels(req, trx) {
        return new feedback_models_1.default(trx || this.db, req);
    }
    trxnModels(req, trx) {
        return new Trxn_models_1.default(trx || this.db, req);
    }
}
exports.default = Models;
//# sourceMappingURL=Models.js.map