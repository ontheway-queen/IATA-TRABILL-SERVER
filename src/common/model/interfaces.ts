import { Knex } from 'knex';
import AdminAuthModel from '../../auth/admin_auth.models';
import AccountsModel from '../../modules/accounts/models/accounts.models';
import ClientModel from '../../modules/clients/client/models/client.models';
import LoanModel from '../../modules/loanMGT/models/loan.models';
import VendorModel from '../../modules/vendor/models/VendorModel';
import ReIssueAirticket from '../../modules/invoices/invoice_airticket_reissue/models/invoiceReissue.models';
import InvoiceAirticketModel from '../../modules/invoices/invoice-air-ticket/models/invoiceAirticket.models';
import InvoiceNonCommissionModel from '../../modules/invoices/invoice_airticket_non_commission/models/invoiceNonCommission.models';
import InvoiceOther from '../../modules/invoices/invoice_other/models/invoiceOther.models';
import InvoiceVisaModels from '../../modules/invoices/invoice-visa/models/invoiceVisa.models';

export interface IModels {
  adminAuthModel(schema: string, trx?: Knex.Transaction): AdminAuthModel;
  accountsModel(schema: string, trx?: Knex.Transaction): AccountsModel;
  loanModel(schema: string, trx?: Knex.Transaction): LoanModel;
  reissueAirticket(schema: string, trx?: Knex.Transaction): ReIssueAirticket;
  vendorModel(schema: string, trx?: Knex.Transaction): VendorModel;
  clientModel(schema: string, trx?: Knex.Transaction): ClientModel;
  invoiceAirticketModel(
    schema: string,
    trx?: Knex.Transaction
  ): InvoiceAirticketModel;
  invoiceNonCommission(
    schema: string,
    trx?: Knex.Transaction
  ): InvoiceNonCommissionModel;
  invoiceOtherModel(schema: string, trx?: Knex.Transaction): InvoiceOther;
  invoiceVisa(schema: string, trx?: Knex.Transaction): InvoiceVisaModels;
}
