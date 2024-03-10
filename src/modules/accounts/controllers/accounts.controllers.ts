import { Request, Response } from 'express';
import AbstractController from '../../../abstracts/abstract.controllers';
import AccountsServices from '../services/accounts.services';
import AccountsValidator from '../validators/accounts.validator';

class AccountsControllers extends AbstractController {
  private validator = new AccountsValidator();
  private services = new AccountsServices();

  constructor() {
    super();
  }

  // ACCOUNT CATEGORY
  public getAccountCategoryType = this.assyncWrapper.wrap(
    this.validator.readAddListOfAccounts,
    async (req: Request, res: Response) => {
      const data = await this.services.getAccountCategoryType(req);

      if (data?.success) {
        res.status(200).json(data);
      } else {
        this.error('Get all account category type');
      }
    }
  );

  // CREATE ACCOUNT
  public createAccount = this.assyncWrapper.wrap(
    this.validator.createAccount,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.services.createAccount(req);

      if (data.success) {
        res.status(201).json(data);
      } else {
        this.error('Add accounts controller');
      }
    }
  );

  // GET ALL ACCOUNT
  public getAllAccounts = this.assyncWrapper.wrap(
    this.validator.readAddListOfAccounts,
    async (req: Request, res: Response) => {
      const data = await this.services.getAllAccounts(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('get all clients');
      }
    }
  );

  // EDIT ACCOUNT
  public editAccount = this.assyncWrapper.wrap(
    this.validator.editAccount,
    async (req: Request, res: Response) => {
      const data = await this.services.editAccount(req);

      if (data.success) {
        res.status(200).json(data);
      }
    }
  );

  // DELETE ACCOUNT
  public deleteAccount = this.assyncWrapper.wrap(
    this.validator.deleteAddListOfAccounts,
    async (req: Request, res: Response) => {
      const data = await this.services.deleteAccount(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Error delete account');
      }
    }
  );
  // ACCOUNT STATEMENT
  public accountStatement = this.assyncWrapper.wrap(
    this.validator.readAddListOfAccounts,
    async (req: Request, res: Response) => {
      const data = await this.services.getAccStatement(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Account statement');
      }
    }
  );

  // GET SINGLE ACCOUNT
  public getSingleAccount = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.services.getAccount(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('get single account');
      }
    }
  );

  // ACCOUNT TRAN HISTORY
  public accountTransaction = this.assyncWrapper.wrap(
    this.validator.readTransactionHistory,
    async (req: Request, res: Response) => {
      const data = await this.services.getTransHistory(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Account transaction history');
      }
    }
  );

  // POST ACCOUNT OPENING BALANCE
  public accountOpening = this.assyncWrapper.wrap(
    this.validator.addAccountsOpening,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.services.addAccountOpening(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public getAccountByType = this.assyncWrapper.wrap(
    [],
    async (req: Request, res: Response) => {
      const data = await this.services.getAccountByType(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('get account by type');
      }
    }
  );

  public balanceStatus = this.assyncWrapper.wrap(
    this.validator.readBalanceStatus,
    async (req: Request, res: Response) => {
      const data = await this.services.balanceStatus(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Balance Status');
      }
    }
  );

  public accOpeningBalance = this.assyncWrapper.wrap(
    this.validator.readOpeningBalance,
    async (req: Request, res: Response) => {
      const data = await this.services.accOpeningBalance(req);
      if (data?.success) {
        res.status(200).json(data);
      } else {
        this.error('Get all account opening balances');
      }
    }
  );

  public deleteAccOpeningBalance = this.assyncWrapper.wrap(
    this.validator.deleteOpeningBalance,
    async (req: Request, res: Response) => {
      const data = await this.services.DeleteAccOpeningBalance(req);
      if (data?.success) {
        res.status(200).json(data);
      } else {
        this.error('Something happen to wrong');
      }
    }
  );

  public addCombineOpeningBalance = this.assyncWrapper.wrap(
    this.validator.addCombineOpening,
    async (req: Request, res: Response) => {
      const data = await this.services.addCombineOpeningBalance(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public clientOpening = this.assyncWrapper.wrap(
    this.validator.addClientOpening,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.services.addClientOpening(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public vendorOpening = this.assyncWrapper.wrap(
    this.validator.addVendorOpening,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.services.addVendorOpening(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public getTrasnfrbleAcc = this.assyncWrapper.wrap(
    this.validator.readBalanceTransfer,
    async (req: Request, res: Response) => {
      const data = await this.services.getTransferableAcc(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Transferable acoounts');
      }
    }
  );

  public addBalanceTransfer = this.assyncWrapper.wrap(
    this.validator.addBalanceTransfer,
    async (req: Request, res: Response): Promise<void> => {
      const data = await this.services.addBTransfer(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );

  public allBalanceTransfers = this.assyncWrapper.wrap(
    this.validator.readBalanceTransfer,
    async (req: Request, res: Response) => {
      const data = await this.services.getAllBTransfers(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('view all balance transfers');
      }
    }
  );

  public deleteBalanceTransfer = this.assyncWrapper.wrap(
    this.validator.deleteBalanceTransfer,
    async (req: Request, res: Response) => {
      const data = await this.services.deleteBTransfer(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Delete balance transfer');
      }
    }
  );

  public singleBalanceTransfer = this.assyncWrapper.wrap(
    this.validator.readBalanceTransfer,
    async (req: Request, res: Response) => {
      const data = await this.services.singleBalanceTransfer(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('get balance transfer');
      }
    }
  );

  public viewCompanies = this.assyncWrapper.wrap(
    this.validator.readNonInvoiceIncome,
    async (req: Request, res: Response) => {
      const data = await this.services.viewCompanies(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Get Companies');
      }
    }
  );
  public getCompanies = this.assyncWrapper.wrap(
    this.validator.readNonInvoiceIncome,
    async (req: Request, res: Response) => {
      const data = await this.services.getCompanies(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Get Companies');
      }
    }
  );

  public addNonInvoice = this.assyncWrapper.wrap(
    this.validator.addNonInvoice,
    async (req: Request, res: Response) => {
      const invoice = await this.services.addNonInvoice(req);

      if (invoice.success) {
        res.status(200).json(invoice);
      } else {
        this.error('Non Invoice income');
      }
    }
  );

  public allNonInvoice = this.assyncWrapper.wrap(
    this.validator.readNonInvoiceIncome,
    async (req: Request, res: Response) => {
      const invoice = await this.services.viewAllNonInvoice(req);

      if (invoice.success) {
        res.status(200).json(invoice);
      } else {
        this.error('All Non invoice income');
      }
    }
  );

  public getNonInvoiceById = this.assyncWrapper.wrap(
    this.validator.readNonInvoiceIncome,
    async (req: Request, res: Response) => {
      const invoice = await this.services.getNonInvoiceById(req);

      if (invoice.success) {
        res.status(200).json(invoice);
      } else {
        this.error('All Non invoice income');
      }
    }
  );

  public editNonInvoice = this.assyncWrapper.wrap(
    this.validator.editNonInvoice,
    async (req: Request, res: Response) => {
      const invoice = await this.services.editNonInvoice(req);

      if (invoice.success) {
        res.status(200).json(invoice);
      } else {
        this.error('Edit Invoice');
      }
    }
  );

  public deleteNonInvoice = this.assyncWrapper.wrap(
    this.validator.deleteNonInvoiceIncome,
    async (req: Request, res: Response) => {
      const invoice = await this.services.deleteNonInvoice(req);

      if (invoice.success) {
        res.status(200).json(invoice);
      } else {
        this.error('delete Non invoice income');
      }
    }
  );

  public noninvoice = this.assyncWrapper.wrap(
    this.validator.readNonInvoiceIncome,
    async (req: Request, res: Response) => {
      const data = await this.services.getnonInvoice(req);

      res.status(200).json(data);
    }
  );

  public addInvestment = this.assyncWrapper.wrap(
    this.validator.addInvestment,
    async (req: Request, res: Response) => {
      const investment = await this.services.addInvestment(req);

      if (investment.success) {
        res.status(200).json(investment);
      } else {
        this.error('Add Investment');
      }
    }
  );

  public allInvestments = this.assyncWrapper.wrap(
    this.validator.readInvenstments,
    async (req: Request, res: Response) => {
      const investment = await this.services.viewInvestment(req);

      if (investment.success) {
        res.status(200).json(investment);
      } else {
        this.error('All Investments');
      }
    }
  );

  public getInvestmentById = this.assyncWrapper.wrap(
    this.validator.readInvenstments,
    async (req: Request, res: Response) => {
      const investment = await this.services.getInvestmentById(req);

      if (investment.success) {
        res.status(200).json(investment);
      } else {
        this.error('Investments by id');
      }
    }
  );

  public editInvestment = this.assyncWrapper.wrap(
    this.validator.editInvestment,
    async (req: Request, res: Response) => {
      const investment = await this.services.editInvestment(req);

      if (investment.success) {
        res.status(200).json(investment);
      } else {
        this.error('Edit Investment');
      }
    }
  );

  public deleteInvestment = this.assyncWrapper.wrap(
    this.validator.deleteInvenstments,
    async (req: Request, res: Response) => {
      const invoice = await this.services.deleteInvestment(req);

      if (invoice.success) {
        res.status(200).json(invoice);
      } else {
        this.error('delete investment');
      }
    }
  );

  public getVendors = this.assyncWrapper.wrap(
    this.validator.readIncentiveIncome,
    async (req: Request, res: Response) => {
      const data = await this.services.getAllVendors(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Get vendors');
      }
    }
  );

  public incentiveIncome = this.assyncWrapper.wrap(
    this.validator.addIncentive,
    async (req: Request, res: Response) => {
      const data = await this.services.addIncentiveIncome(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('add incentive income');
      }
    }
  );

  public allIncentiveIncome = this.assyncWrapper.wrap(
    this.validator.readIncentiveIncome,
    async (req: Request, res: Response) => {
      const data = await this.services.allIncentiveIncome(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('all incentive income');
      }
    }
  );

  public getIncentiveIncomeById = this.assyncWrapper.wrap(
    this.validator.readIncentiveIncome,
    async (req: Request, res: Response) => {
      const data = await this.services.getIncentiveIncomeById(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('view incentive income by id');
      }
    }
  );

  public editIncentive = this.assyncWrapper.wrap(
    this.validator.editIncentive,
    async (req: Request, res: Response) => {
      const data = await this.services.editIncentiveIncome(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('edit incentive income');
      }
    }
  );

  public deleteIncentive = this.assyncWrapper.wrap(
    this.validator.deleteIncentiveIncome,
    async (req: Request, res: Response) => {
      const data = await this.services.deleteIncentive(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Delete incentive income');
      }
    }
  );

  public clientBillAdj = this.assyncWrapper.wrap(
    this.validator.addClientBill,
    async (req: Request, res: Response) => {
      const data = await this.services.clientBillAdj(req);

      if (data.success) {
        res.status(201).json(data);
      } else {
        this.error('Client Bill Adjustment');
      }
    }
  );

  public viewClientBill = this.assyncWrapper.wrap(
    this.validator.readClientBillAdjustment,
    async (req: Request, res: Response) => {
      const data = await this.services.viewClientBill(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('View Client bill');
      }
    }
  );

  public singleClientBill = this.assyncWrapper.wrap(
    this.validator.readClientBillAdjustment,
    async (req: Request, res: Response) => {
      const data = await this.services.viewSingleClientBill(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('View single client bill');
      }
    }
  );

  public deleteClientBill = this.assyncWrapper.wrap(
    this.validator.deleteClientBillAdjustment,
    async (req: Request, res: Response) => {
      const data = await this.services.deleteClientBill(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Delete client Bill');
      }
    }
  );

  public vendorBillAdj = this.assyncWrapper.wrap(
    this.validator.addVendorBill,
    async (req: Request, res: Response) => {
      const data = await this.services.vendorBillAdj(req);

      if (data.success) {
        res.status(201).json(data);
      } else {
        this.error('Vendor Bill Adjustment');
      }
    }
  );

  public viewVendorBill = this.assyncWrapper.wrap(
    this.validator.readVendorBillAdjustment,
    async (req: Request, res: Response) => {
      const data = await this.services.viewVendorBill(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('View vendor bill');
      }
    }
  );

  public singleVendorBill = this.assyncWrapper.wrap(
    this.validator.readVendorBillAdjustment,
    async (req: Request, res: Response) => {
      const data = await this.services.viewSingleVendorBill(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('View Single vendor');
      }
    }
  );

  public deleteVendorBill = this.assyncWrapper.wrap(
    this.validator.deleteVendorBillAdjustment,
    async (req: Request, res: Response) => {
      const data = await this.services.deleteVendorBill(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error('Delete Vendor Bill');
      }
    }
  );

  public getListOfAccounts = this.assyncWrapper.wrap(
    this.validator.readAddListOfAccounts,
    async (req: Request, res: Response) => {
      const data = await this.services.getListOfAccounts(req);

      if (data.success) {
        res.status(200).json(data);
      } else {
        this.error();
      }
    }
  );
}

export default AccountsControllers;
