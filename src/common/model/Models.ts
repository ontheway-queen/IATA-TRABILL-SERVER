import { Request } from 'express';
import { Knex } from 'knex';
import { db } from '../../app/database';
import AdminAuthModel from '../../auth/admin_auth.models';
import NotificationModals from '../../modules/Notifications/Models/Notification.Modal';
import AccountsModel from '../../modules/accounts/models/accounts.models';
import AdminPanelModels from '../../modules/adminPanel/Models/adminPanel.models';
import chequesModels from '../../modules/cheques/models/cheques.models';
import AgentProfileModels from '../../modules/clients/agents_profile/Models/agent_profile.models';
import ClientModel from '../../modules/clients/client/models/client.models';
import CombineClientsModels from '../../modules/clients/combined_clients/models/combineClients.models';
import CommonModels from '../../modules/commonModule/common.models';
import TourItinerayModels from '../../modules/configuaration/subModules/tourItinerary/TourItineray.model';
import DashboardModels from '../../modules/dashboard/models/dashboard.models';
import DatabaseResetModels from '../../modules/databaseReset/databaseReset.models';
import ExpenseModel from '../../modules/expense/models/expense.models';
import HajjiManagementModels from '../../modules/hajj_management/Models/HajjiMangement.Models';
import InvoiceAirticketModel from '../../modules/invoices/invoice-air-ticket/models/invoiceAirticket.models';
import invoiceTourModels from '../../modules/invoices/invoice-tour/models/invoiceTour.models';
import InvoiceVisaModels from '../../modules/invoices/invoice-visa/models/invoiceVisa.models';
import InvoiceNonCommissionModel from '../../modules/invoices/invoice_airticket_non_commission/models/invoiceNonCommission.models';
import ReIssueAirticket from '../../modules/invoices/invoice_airticket_reissue/models/invoiceReissue.models';
import InvoiceHajjPreModels from '../../modules/invoices/invoice_hajj_pre_reg/Models/InvoiceHajjPreReg.Models';
// import InvoiceHajjModels from '../../common/model/CommonInvoice.models';
import InvoiceOther from '../../modules/invoices/invoice_other/models/invoiceOther.models';
import InvoiceUmmrah from '../../modules/invoices/invoice_ummrah/Models/InvoiceUmmrah.Models';
import LoanModel from '../../modules/loanMGT/models/loan.models';
import MoneyReceiptModels from '../../modules/money-receipt/Models/MoneyReceipt.models';
import PassportModel from '../../modules/passportMGT/models/passport.models';
import PayrollModel from '../../modules/payroll/models/payroll.models';
import QuotationModel from '../../modules/quotation/models/quotation.models';
import RefundModel from '../../modules/refund/models/refund.models';
import ReportModel from '../../modules/report/models/report.models';
import SmsModel from '../../modules/smsSystem/models/sms.models';
import VendorModel from '../../modules/vendor/models/VendorModel';
import { idType } from '../types/common.types';
import CommonInvoiceModel from './CommonInvoice.models';
import ConfigModel from './ConfigModels';
import SalesPurchasesReport from '../../modules/report/models/salesPurchaseReport.models';
import ProfitLossReport from '../../modules/report/models/profitLossReport';
import FeedbackModel from '../../modules/feedback/feedback.models';

import TrxnModels from './Trxn.models';
import InvoiceHajjModels from '../../modules/invoices/invoice_hajji/Models/InvoiceHajj.models';
import PnrDetailsModels from '../../modules/invoices/invoice-air-ticket/models/pnr_details.models';

export interface IUserRequest {
  user: string;
  agency_id: idType;
}

class Models {
  public db = db;

  public adminAuthModel(req: Request, trx?: Knex.Transaction) {
    return new AdminAuthModel(trx || this.db, req);
  }

  public dashboardModal(req: Request, trx?: Knex.Transaction) {
    return new DashboardModels(trx || this.db, req);
  }

  public clientModel(req: Request, trx?: Knex.Transaction) {
    return new ClientModel(trx || this.db, req);
  }

  public combineClientModel(req: Request, trx?: Knex.Transaction) {
    return new CombineClientsModels(trx || this.db, req);
  }

  public agentProfileModel(req: Request, trx?: Knex.Transaction) {
    return new AgentProfileModels(trx || this.db, req);
  }

  public payrollModel(req: Request, trx?: Knex.Transaction) {
    return new PayrollModel(trx || this.db, req);
  }

  public accountsModel(req: Request, trx?: Knex.Transaction) {
    return new AccountsModel(trx || this.db, req);
  }

  public loanModel(req: Request, trx?: Knex.Transaction) {
    return new LoanModel(trx || this.db, req);
  }

  public quotationModel(req: Request, trx?: Knex.Transaction) {
    return new QuotationModel(trx || this.db, req);
  }

  public passportModel(req: Request, trx?: Knex.Transaction) {
    return new PassportModel(trx || this.db, req);
  }

  public expenseModel(req: Request, trx?: Knex.Transaction) {
    return new ExpenseModel(trx || this.db, req);
  }

  public smsModel(req: Request, trx?: Knex.Transaction) {
    return new SmsModel(trx || this.db, req);
  }

  public refundModel(req: Request, trx?: Knex.Transaction) {
    return new RefundModel(trx || this.db, req);
  }

  public reportModel(req: Request, trx?: Knex.Transaction) {
    return new ReportModel(trx || this.db, req);
  }

  public salesPurchasesReport(req: Request, trx?: Knex.Transaction) {
    return new SalesPurchasesReport(trx || this.db, req);
  }

  public vendorModel(req: Request, trx?: Knex.Transaction) {
    return new VendorModel(trx || this.db, req);
  }

  public invoiceAirticketModel(req: Request, trx?: Knex.Transaction) {
    return new InvoiceAirticketModel(trx || this.db, req);
  }
  public NotificationModals(req: Request, trx?: Knex.Transaction) {
    return new NotificationModals(trx || this.db, req);
  }

  public invoiceNonCommission(req: Request, trx?: Knex.Transaction) {
    return new InvoiceNonCommissionModel(trx || this.db, req);
  }

  public reissueAirticket(req: Request, trx?: Knex.Transaction) {
    return new ReIssueAirticket(trx || this.db, req);
  }

  public invoiceOtherModel(req: Request, trx?: Knex.Transaction) {
    return new InvoiceOther(trx || this.db, req);
  }

  public invoiceVisaModel(req: Request, trx?: Knex.Transaction) {
    return new InvoiceVisaModels(trx || this.db, req);
  }

  public invoiceHajjPre(req: Request, trx?: Knex.Transaction) {
    return new InvoiceHajjPreModels(trx || this.db, req);
  }

  public HajjiManagementModels(req: Request, trx?: Knex.Transaction) {
    return new HajjiManagementModels(trx || this.db, req);
  }

  public InvoiceHajjModels(req: Request, trx?: Knex.Transaction) {
    return new InvoiceHajjModels(trx || this.db, req);
  }

  public InvoiceUmmarhModels(req: Request, trx?: Knex.Transaction) {
    return new InvoiceUmmrah(trx || this.db, req);
  }

  public MoneyReceiptModels(req: Request, trx?: Knex.Transaction) {
    return new MoneyReceiptModels(trx || this.db, req);
  }

  public TourItinerayModels(req: Request, trx?: Knex.Transaction) {
    return new TourItinerayModels(trx || this.db, req);
  }
  public invoiceTourModels(req: Request, trx?: Knex.Transaction) {
    return new invoiceTourModels(trx || this.db, req);
  }
  public CommonInvoiceModel(req: Request, trx?: Knex.Transaction) {
    return new CommonInvoiceModel(trx || this.db, req);
  }
  public PnrDetailsModels(req: Request, trx?: Knex.Transaction) {
    return new PnrDetailsModels(trx || this.db, req);
  }
  public DatabaseResetModels(req: Request, trx?: Knex.Transaction) {
    return new DatabaseResetModels(trx || this.db, req);
  }

  public CommonModels(req: Request, trx?: Knex.Transaction) {
    return new CommonModels(trx || this.db, req);
  }

  public chequesModels(req: Request, trx?: Knex.Transaction) {
    return new chequesModels(trx || this.db, req);
  }

  public adminPanel(req: Request, trx?: Knex.Transaction) {
    return new AdminPanelModels(trx || this.db, req);
  }

  public profitLossReport(req: Request, trx?: Knex.Transaction) {
    return new ProfitLossReport(trx || this.db, req);
  }

  public feedbackModels(req: Request, trx?: Knex.Transaction) {
    return new FeedbackModel(trx || this.db, req);
  }

  public trxnModels(req: Request, trx?: Knex.Transaction) {
    return new TrxnModels(trx || this.db, req);
  }

  public configModel = new ConfigModel(db);
}

export default Models;
