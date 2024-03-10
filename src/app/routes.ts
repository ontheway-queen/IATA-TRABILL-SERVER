import { Application } from 'express';
import NotificationRouters from '../modules/Notifications/Notification.Routers';
import AccountsRouter from '../modules/accounts/routers/accounts.routers';
import AdminPanelRouters from '../modules/adminPanel/Routers/adminPanel.routers';
import chequesRoutes from '../modules/cheques/routes/cheques.routes';
import AgentProfileRoutes from '../modules/clients/agents_profile/Routers/agent_profile.routers';
import ClientRouter from '../modules/clients/client/routers/client.routers';
import CombineClientsRouters from '../modules/clients/combined_clients/routers/combineClients.routers';
import CommonRouters from '../modules/commonModule/common.routers';
import AppConfiguration from '../modules/configuaration/appConfiguration';
import RoutersRoomTypes from '../modules/configuaration/subModules/RoomTypes/roomTypes.routers';
import TransportTypeRouter from '../modules/configuaration/subModules/TransportType/transportType.Routers';
import TourItinerayRouters from '../modules/configuaration/subModules/tourItinerary/TourItineray.routers';
import DashboardRoutes from '../modules/dashboard/routes/dashboard.routes';
import DatabaseResetRouters from '../modules/databaseReset/databaseReset.routers';
import ExpenseRouter from '../modules/expense/routers/expense.routers';
import FeedbackRouter from '../modules/feedback/feedback.routers';
import HajjiManagementRouters from '../modules/hajj_management/Routers/HajjiManagement.Routers';
import InvoiceAirTicketRouter from '../modules/invoices/invoice-air-ticket/routers/invoiceAirticket.routers';
import InvoiceTourRouters from '../modules/invoices/invoice-tour/routers/InvoiceTour.routers';
import InvoiceVisaRouters from '../modules/invoices/invoice-visa/routers/invoiceVisa.routers';
import InvoiceNonCommission from '../modules/invoices/invoice_airticket_non_commission/routers/invoiceNonCommission.routers';
import ReIssueAirticketRoutes from '../modules/invoices/invoice_airticket_reissue/routers/invoiceReissue.routers';
import InoviceHajjPreRegRouters from '../modules/invoices/invoice_hajj_pre_reg/Routes/InvoiceHajjPreReg.Routes';
import InvoiceHajjRouters from '../modules/invoices/invoice_hajji/Routes/InvoiceHajj.Routes';
import InivoiceOtherRouters from '../modules/invoices/invoice_other/routers/invoiceOther.routers';
import InvoiceUmmrah from '../modules/invoices/invoice_ummrah/Routes/InvoiceUmmrah.Routers';
import LoanRouter from '../modules/loanMGT/routers/loan.routers';
import MoneyReceiptRouters from '../modules/money-receipt/Routes/MoneyReceipt.Routes';
import PassportRouter from '../modules/passportMGT/routers/passport.routers';
import PayrollRouters from '../modules/payroll/routers/payroll.routers';
import QuotationRouter from '../modules/quotation/routers/quotation.routers';
import RefundRouter from '../modules/refund/routers/refund.routers';
import ReportRouter from '../modules/report/routers/report.routers';
import SmsRouter from '../modules/smsSystem/routers/sms.routers';
import VendorRouter from '../modules/vendor/routers/vendor.routers';

const routes = (app: Application) => {
  // dashboard
  app.use('/api/v1/dashboard', new DashboardRoutes().routers);

  // accounts
  app.use('/api/v1/accounts', new AccountsRouter().routers);

  // clients
  app.use('/api/v1/client', new ClientRouter().routers);

  // combined client
  app.use('/api/v1/combine-clinets', new CombineClientsRouters().routers);

  // agent profile
  app.use('/api/v1/agent-profile', new AgentProfileRoutes().routers);

  // payroll
  app.use('/api/v1/payroll', new PayrollRouters().routers);

  // loan management
  app.use('/api/v1/loan-management', new LoanRouter().routers);

  // passport management
  app.use('/api/v1/passport-management', new PassportRouter().routers);

  // expense
  app.use('/api/v1/expense', new ExpenseRouter().routers);

  // quotation
  app.use('/api/v1/quotation', new QuotationRouter().routers);

  // sms system
  app.use('/api/v1/sms', new SmsRouter().routers);

  // refund
  app.use('/api/v1/refund', new RefundRouter().routers);

  // report
  app.use('/api/v1/report', new ReportRouter().routers);

  // configuration
  app.use('/api/v1/configuration', new AppConfiguration().app);

  // Hajji Management
  app.use('/api/v1/hajji_management', new HajjiManagementRouters().routers);

  // invoice hajj pre registration
  app.use('/api/v1/invoice_hajj_pre', new InoviceHajjPreRegRouters().routers);

  // invoice hajj
  app.use('/api/v1/invoic-hajj', new InvoiceHajjRouters().routers);

  // invoice ummrah
  app.use('/api/v1/invoice-ummrah', new InvoiceUmmrah().routers);

  // money receipt
  app.use('/api/v1/money-receipt', new MoneyReceiptRouters().routers);

  // invoice tour package
  app.use('/api/v1/tour-package', new InvoiceTourRouters().routers);

  // invoice air ticket
  app.use('/api/v1/invoice-air-ticket', new InvoiceAirTicketRouter().routers);

  // invoice non commission
  app.use('/api/v1/invoice-non-commission', new InvoiceNonCommission().routers);

  // invoice visa
  app.use('/api/v1/invoice-visa', new InvoiceVisaRouters().routers);

  // vendors
  app.use('/api/v1/vendors', new VendorRouter().routers);

  // invoice reissue
  app.use('/api/v1/reissue', new ReIssueAirticketRoutes().routers);

  // invoice others
  app.use('/api/v1/invoice-others', new InivoiceOtherRouters().routers);

  // configuration
  app.use('/api/v1/hotel-room', new RoutersRoomTypes().routers);

  app.use('/api/v1/tour-ittineray', new TourItinerayRouters().routers);

  app.use('/api/v1/transport-type', new TransportTypeRouter().routers);

  app.use('/api/v1/notification', new NotificationRouters().routers);

  app.use('/api/v1/databse', new DatabaseResetRouters().routers);

  app.use('/api/v1/cheques', new chequesRoutes().routers);

  app.use('/api/v1/admin-panel', new AdminPanelRouters().routers);

  app.use('/api/v1/common', new CommonRouters().routers);

  app.use('/api/v1/feedback', new FeedbackRouter().routers);
};

export default routes;
