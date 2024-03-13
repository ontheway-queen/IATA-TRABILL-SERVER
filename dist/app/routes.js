"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Notification_Routers_1 = __importDefault(require("../modules/Notifications/Notification.Routers"));
const accounts_routers_1 = __importDefault(require("../modules/accounts/routers/accounts.routers"));
const adminPanel_routers_1 = __importDefault(require("../modules/adminPanel/Routers/adminPanel.routers"));
const cheques_routes_1 = __importDefault(require("../modules/cheques/routes/cheques.routes"));
const agent_profile_routers_1 = __importDefault(require("../modules/clients/agents_profile/Routers/agent_profile.routers"));
const client_routers_1 = __importDefault(require("../modules/clients/client/routers/client.routers"));
const combineClients_routers_1 = __importDefault(require("../modules/clients/combined_clients/routers/combineClients.routers"));
const common_routers_1 = __importDefault(require("../modules/commonModule/common.routers"));
const appConfiguration_1 = __importDefault(require("../modules/configuaration/appConfiguration"));
const roomTypes_routers_1 = __importDefault(require("../modules/configuaration/subModules/RoomTypes/roomTypes.routers"));
const transportType_Routers_1 = __importDefault(require("../modules/configuaration/subModules/TransportType/transportType.Routers"));
const TourItineray_routers_1 = __importDefault(require("../modules/configuaration/subModules/tourItinerary/TourItineray.routers"));
const dashboard_routes_1 = __importDefault(require("../modules/dashboard/routes/dashboard.routes"));
const databaseReset_routers_1 = __importDefault(require("../modules/databaseReset/databaseReset.routers"));
const expense_routers_1 = __importDefault(require("../modules/expense/routers/expense.routers"));
const feedback_routers_1 = __importDefault(require("../modules/feedback/feedback.routers"));
const HajjiManagement_Routers_1 = __importDefault(require("../modules/hajj_management/Routers/HajjiManagement.Routers"));
const invoiceAirticket_routers_1 = __importDefault(require("../modules/invoices/invoice-air-ticket/routers/invoiceAirticket.routers"));
const InvoiceTour_routers_1 = __importDefault(require("../modules/invoices/invoice-tour/routers/InvoiceTour.routers"));
const invoiceVisa_routers_1 = __importDefault(require("../modules/invoices/invoice-visa/routers/invoiceVisa.routers"));
const invoiceNonCommission_routers_1 = __importDefault(require("../modules/invoices/invoice_airticket_non_commission/routers/invoiceNonCommission.routers"));
const invoiceReissue_routers_1 = __importDefault(require("../modules/invoices/invoice_airticket_reissue/routers/invoiceReissue.routers"));
const InvoiceHajjPreReg_Routes_1 = __importDefault(require("../modules/invoices/invoice_hajj_pre_reg/Routes/InvoiceHajjPreReg.Routes"));
const InvoiceHajj_Routes_1 = __importDefault(require("../modules/invoices/invoice_hajji/Routes/InvoiceHajj.Routes"));
const invoiceOther_routers_1 = __importDefault(require("../modules/invoices/invoice_other/routers/invoiceOther.routers"));
const InvoiceUmmrah_Routers_1 = __importDefault(require("../modules/invoices/invoice_ummrah/Routes/InvoiceUmmrah.Routers"));
const loan_routers_1 = __importDefault(require("../modules/loanMGT/routers/loan.routers"));
const MoneyReceipt_Routes_1 = __importDefault(require("../modules/money-receipt/Routes/MoneyReceipt.Routes"));
const passport_routers_1 = __importDefault(require("../modules/passportMGT/routers/passport.routers"));
const payroll_routers_1 = __importDefault(require("../modules/payroll/routers/payroll.routers"));
const quotation_routers_1 = __importDefault(require("../modules/quotation/routers/quotation.routers"));
const refund_routers_1 = __importDefault(require("../modules/refund/routers/refund.routers"));
const report_routers_1 = __importDefault(require("../modules/report/routers/report.routers"));
const sms_routers_1 = __importDefault(require("../modules/smsSystem/routers/sms.routers"));
const vendor_routers_1 = __importDefault(require("../modules/vendor/routers/vendor.routers"));
const routes = (app) => {
    // dashboard
    app.use('/api/v1/dashboard', new dashboard_routes_1.default().routers);
    // accounts
    app.use('/api/v1/accounts', new accounts_routers_1.default().routers);
    // clients
    app.use('/api/v1/client', new client_routers_1.default().routers);
    // combined client
    app.use('/api/v1/combine-clinets', new combineClients_routers_1.default().routers);
    // agent profile
    app.use('/api/v1/agent-profile', new agent_profile_routers_1.default().routers);
    // payroll
    app.use('/api/v1/payroll', new payroll_routers_1.default().routers);
    // loan management
    app.use('/api/v1/loan-management', new loan_routers_1.default().routers);
    // passport management
    app.use('/api/v1/passport-management', new passport_routers_1.default().routers);
    // expense
    app.use('/api/v1/expense', new expense_routers_1.default().routers);
    // quotation
    app.use('/api/v1/quotation', new quotation_routers_1.default().routers);
    // sms system
    app.use('/api/v1/sms', new sms_routers_1.default().routers);
    // refund
    app.use('/api/v1/refund', new refund_routers_1.default().routers);
    // report
    app.use('/api/v1/report', new report_routers_1.default().routers);
    // configuration
    app.use('/api/v1/configuration', new appConfiguration_1.default().app);
    // Hajji Management
    app.use('/api/v1/hajji_management', new HajjiManagement_Routers_1.default().routers);
    // invoice hajj pre registration
    app.use('/api/v1/invoice_hajj_pre', new InvoiceHajjPreReg_Routes_1.default().routers);
    // invoice hajj
    app.use('/api/v1/invoic-hajj', new InvoiceHajj_Routes_1.default().routers);
    // invoice ummrah
    app.use('/api/v1/invoice-ummrah', new InvoiceUmmrah_Routers_1.default().routers);
    // money receipt
    app.use('/api/v1/money-receipt', new MoneyReceipt_Routes_1.default().routers);
    // invoice tour package
    app.use('/api/v1/tour-package', new InvoiceTour_routers_1.default().routers);
    // invoice air ticket
    app.use('/api/v1/invoice-air-ticket', new invoiceAirticket_routers_1.default().routers);
    // invoice non commission
    app.use('/api/v1/invoice-non-commission', new invoiceNonCommission_routers_1.default().routers);
    // invoice visa
    app.use('/api/v1/invoice-visa', new invoiceVisa_routers_1.default().routers);
    // vendors
    app.use('/api/v1/vendors', new vendor_routers_1.default().routers);
    // invoice reissue
    app.use('/api/v1/reissue', new invoiceReissue_routers_1.default().routers);
    // invoice others
    app.use('/api/v1/invoice-others', new invoiceOther_routers_1.default().routers);
    // configuration
    app.use('/api/v1/hotel-room', new roomTypes_routers_1.default().routers);
    app.use('/api/v1/tour-ittineray', new TourItineray_routers_1.default().routers);
    app.use('/api/v1/transport-type', new transportType_Routers_1.default().routers);
    app.use('/api/v1/notification', new Notification_Routers_1.default().routers);
    app.use('/api/v1/databse', new databaseReset_routers_1.default().routers);
    app.use('/api/v1/cheques', new cheques_routes_1.default().routers);
    app.use('/api/v1/admin-panel', new adminPanel_routers_1.default().routers);
    app.use('/api/v1/common', new common_routers_1.default().routers);
    app.use('/api/v1/feedback', new feedback_routers_1.default().routers);
};
exports.default = routes;
//# sourceMappingURL=routes.js.map