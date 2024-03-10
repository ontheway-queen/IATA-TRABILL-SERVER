import { Request } from 'express';
import AbstractServices from '../../../abstracts/abstract.services';
import Trxns from '../../../common/helpers/Trxns';
import {
  IAcTrxnUpdate,
  IVTrxnUpdate,
} from '../../../common/interfaces/Trxn.interfaces';
import { idType } from '../../../common/types/common.types';
import CustomError from '../../../common/utils/errors/customError';
import {
  IAccountReqBody,
  IAccounts,
  IIncentiveIncome,
  IInvestmentReqBody,
  IInvestments,
  INonInvoiceIncome,
  INonInvoiceIncomeReqBody,
  IVendorIncentiveIncomeReqBody,
} from '../types/account.interfaces';
import AddAccountOpeningService from './narrowServices/accountOpening.services';
import AddBalanceTrasnfer from './narrowServices/addBalanceTrns.services';
import AddClientBillAdjustment from './narrowServices/addClientBill.services';
import AddInvestment from './narrowServices/addInvestment.services';
import AddNonInvoice from './narrowServices/addNonInvoice.services';
import AddVendorBillAdjustment from './narrowServices/addVendorBill.services';
import AddClientOpeningService from './narrowServices/clientOpening.services';
import AddCombineOpeningBalanceService from './narrowServices/combineOpening';
import AddIncentiveService from './narrowServices/incentiveIncome.services';
import AddVendorOpeningService from './narrowServices/vendorOpening.services';

class AccountsServices extends AbstractServices {
  constructor() {
    super();
  }

  // ACCOUNT CATEGORY
  public getAccountCategoryType = async (req: Request) => {
    const conn = this.models.accountsModel(req);

    const data = await conn.getAccountCategoryType();

    if (data) {
      return { success: true, data };
    }
  };

  // CREATE ACCOUNT
  public createAccount = async (req: Request) => {
    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.accountsModel(req);

      const body = req.body as IAccountReqBody;

      const { account_id } = await conn.insertAccount(body);

      return {
        success: true,
        message: 'Account created successfully!',
        data: { account_id },
      };
    });
  };

  // GET ALL ACCOUNT
  public getAllAccounts = async (req: Request) => {
    const { trash, page, size, search } = req.query;
    const conn = this.models.accountsModel(req);

    const accounts = await conn.getAllAccounts(
      Number(trash) || 0,
      Number(page) || 1,
      Number(size) || 20,
      search
    );

    return { success: true, ...accounts };
  };

  // EDIT ACCOUNT
  public editAccount = async (req: Request) => {
    const conn = this.models.accountsModel(req);

    const { account_id } = req.params as { account_id: string };

    const {
      account_name,
      account_bank_name,
      account_branch_name,
      account_number,
      account_updated_by,
      account_acctype_id,
      account_routing_no,
    } = req.body as IAccountReqBody;

    const accountInfo: IAccounts = {
      account_name,
      account_bank_name,
      account_branch_name,
      account_number,
      account_updated_by,
      account_acctype_id,
      account_routing_no,
    };

    await conn.editAccount(accountInfo, account_id);

    const message = 'Account has been updated';
    await this.insertAudit(
      req,
      'update',
      message,
      account_updated_by as number,
      'ACCOUNTS'
    );

    return { success: true, message: 'Account updated successfully' };
  };

  // DELETE ACCOUNT
  public deleteAccount = async (req: Request) => {
    const { account_id } = req.params;

    const { delete_by } = req.body as { delete_by: idType };

    const accountId = Number(account_id);

    if (!accountId) {
      throw new CustomError('Account id not valid', 400, 'Bad Request');
    }

    const conn = this.models.accountsModel(req);

    const accountTrnx = await conn.getTraxn(accountId);

    if (accountTrnx.length === 0) {
      await conn.deleteAccount(accountId, delete_by);

      const message = 'Account has been deleted';
      await this.insertAudit(
        req,
        'delete',
        message,
        delete_by as number,
        'ACCOUNTS'
      );
    } else {
      throw new CustomError(
        'Account has a valid transaction',
        400,
        'Bad Request'
      );
    }

    return { success: true, message: 'Account deleted successfully' };
  };

  // GET SINGLE ACCOUNT
  public getAccount = async (req: Request) => {
    const { account_id } = req.params;

    const conn = this.models.accountsModel(req);

    const data = await conn.getAccount(account_id);

    return { success: true, data };
  };

  // ACCOUNT TRAN HISTORY
  public getTransHistory = async (req: Request) => {
    const { from_date, to_date, page, size } = req.query;

    let account_id: string | undefined = req.params.account_id;

    account_id = account_id === 'all' ? undefined : account_id;

    const conn = this.models.accountsModel(req);

    let data;

    data = await conn.getTransHistory(
      account_id,
      from_date as string,
      to_date as string,
      Number(page) || 1,
      Number(size) || 20
    );

    return { success: true, ...data };
  };

  public accOpeningBalance = async (req: Request) => {
    const { page, size, filter } = req.query;

    const conn = this.models.accountsModel(req);

    const data = await conn.getOpeningBalance(
      Number(page) || 1,
      Number(size) || 20,
      filter as string
    );

    const count = await conn.countOpeningBalanceRow(filter as string);

    return {
      success: true,
      count: count.row_count,
      message: 'All opening balance',
      data,
    };
  };

  public DeleteAccOpeningBalance = async (req: Request) => {
    const { id } = req.params;
    const { delete_by } = req.body as { delete_by: idType };

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.accountsModel(req, trx);
      const trxns = new Trxns(req, trx);

      const {
        op_acctrxn_id,
        op_cltrxn_id,
        op_cl_id,
        op_comtrxn_id,
        op_com_id,
        op_ventrxn_id,
        op_ven_id,
      } = await conn.getPreviousOpeningBal(id);

      if (op_acctrxn_id) {
        await trxns.deleteAccTrxn(op_acctrxn_id);
      } else if (op_ventrxn_id) {
        await trxns.deleteVTrxn(op_ventrxn_id, `vendor-${op_ven_id}`);
      } else if (op_cltrxn_id) {
        await trxns.deleteClTrxn(op_cltrxn_id, `client-${op_cl_id}`);
      } else if (op_comtrxn_id) {
        await trxns.deleteClTrxn(op_comtrxn_id, `combined-${op_com_id}`);
      }

      await conn.deleteOpeningBalance(id, delete_by);

      await this.insertAudit(
        req,
        'delete',
        'opening balance deleted',
        delete_by as number,
        'ACCOUNTS'
      );

      return {
        success: true,
        message: 'Opening Balance Deleted Successfully',
      };
    });
  };

  public getAccountByType = async (req: Request) => {
    const { type_id } = req.params;

    const conn = this.models.accountsModel(req);

    const data = await conn.getAccountByType(type_id);

    return { success: true, data };
  };

  public getAccStatement = async (req: Request) => {
    const account_id = Number(req.params.account_id);

    const { from_date, to_date, page, size } = req.query as {
      from_date: string;
      to_date: string;
      page: string;
      size: string;
    };

    const conn = this.models.accountsModel(req);
    const data = await conn.getAccountStatements(
      account_id,
      String(from_date),
      String(to_date),
      Number(page) || 1,
      Number(size) || 20
    );

    return {
      success: true,
      message: 'Account transaction statement',
      ...data,
    };
  };

  public getTransferableAcc = async (req: Request) => {
    const conn = this.models.accountsModel(req);

    let data = await conn.getTrsfableAcc();

    data = data.filter((acc) => acc.accbalance_amount);

    return { success: true, data };
  };

  public getAllBTransfers = async (req: Request) => {
    const { page, size, from_date, to_date, search } = req.query as {
      page: string;
      size: string;
      from_date: string;
      to_date: string;
      search: string;
    };

    const conn = this.models.accountsModel(req);

    const data = await conn.allBalanceTransfer(
      from_date,
      to_date,
      Number(page) || 1,
      Number(size) || 20,
      search
    );

    return { success: true, ...data };
  };

  public deleteBTransfer = async (req: Request) => {
    const { balance_id } = req.params;
    const { created_by } = req.body as { created_by: number };

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.accountsModel(req, trx);
      const trxns = new Trxns(req, trx);

      const {
        btransfer_amount,
        btransfer_from_acc_trxn_id,
        btransfer_to_acc_trxn_id,
        btransfer_charge_id,
        btransfer_actransaction_id,
      } = await conn.singleBalanceTransfer(balance_id);

      await conn.deleteBalanceTransfer(balance_id, created_by);

      await trxns.deleteAccTrxn(btransfer_from_acc_trxn_id);
      await trxns.deleteAccTrxn(btransfer_to_acc_trxn_id);
      await trxns.deleteAccTrxn(btransfer_actransaction_id);

      if (btransfer_charge_id) {
        await this.models
          .vendorModel(req, trx)
          .deleteOnlineTrxnCharge(btransfer_charge_id);
      }

      const message = `Account balance transfer has been deleted ${btransfer_amount}/-`;
      await this.insertAudit(req, 'delete', message, created_by, 'ACCOUNTS');

      return {
        success: true,
        message: 'Balance transfer deleted successfully',
      };
    });
  };

  public singleBalanceTransfer = async (req: Request) => {
    const { balance_id } = req.params;

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.accountsModel(req, trx);

      let data: any[] = [];
      const transferBalance = await conn.getBalanceTransferById(balance_id);

      for (const item of transferBalance) {
        const from_account_name = await conn.getAccountName(
          item.btransfer_from_account_id
        );
        const to_account_name = await conn.getAccountName(
          item.btransfer_to_account_id
        );

        data.push({ ...item, from_account_name, to_account_name });
      }

      return { success: true, data };
    });
  };

  public balanceStatus = async (req: Request) => {
    return await this.models.db.transaction(async (trx) => {
      const { page, size } = req.query as { page: string; size: string };

      const conn = this.models.accountsModel(req, trx);

      const accTypeOne = await conn.getBalanceStatus(
        1,
        Number(page) || 1,
        Number(size) || 20
      );

      const accTypeOneCount = await conn.countBalanceStatusDataRow(1);

      const accTypeTwo = await conn.getBalanceStatus(
        2,
        Number(page) || 1,
        Number(size) || 20
      );

      const accTypeTwoCount = await conn.countBalanceStatusDataRow(2);

      const accTypeThree = await conn.getBalanceStatus(
        3,
        Number(page) || 1,
        Number(size) || 20
      );

      const accTypeThreeCount = await conn.countBalanceStatusDataRow(3);

      return {
        success: true,
        count: { accTypeOneCount, accTypeTwoCount, accTypeThreeCount },
        data: { accTypeOne, accTypeTwo, accTypeThree },
      };
    });
  };

  public viewCompanies = async (req: Request) => {
    const { page, size } = req.query;

    const conn = this.models.accountsModel(req);

    const data = await conn.viewCompanies(
      Number(page) || 1,
      Number(size) || 20
    );

    return { success: true, ...data };
  };

  public getCompanies = async (req: Request) => {
    const conn = this.models.accountsModel(req);

    const data = await conn.getCompanies();

    return { success: true, data };
  };

  public getnonInvoice = async (req: Request) => {
    const { noninvoice_id } = req.params;

    const conn = this.models.accountsModel(req);

    const data = await conn.nonInvoiceIncome(noninvoice_id);

    return { success: true, data };
  };

  public editNonInvoice = async (req: Request) => {
    const { noninvoice_id } = req.params;

    const {
      company_id,
      type_id,
      account_id,
      amount,
      noninvoice_created_by,
      cheque_no,
      receipt_no,
      date,
      note,
    } = req.body as INonInvoiceIncomeReqBody;

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.accountsModel(req, trx);

      const data = await conn.nonInvoiceIncome(noninvoice_id);

      const AccTrxnBody: IAcTrxnUpdate = {
        acctrxn_ac_id: account_id,
        acctrxn_type: 'CREDIT',
        acctrxn_amount: amount,
        acctrxn_created_at: date,
        acctrxn_created_by: noninvoice_created_by,
        acctrxn_note: note,
        acctrxn_particular_id: 27,
        acctrxn_particular_type: 'Non invoice income',
        acctrxn_pay_type: 'CASH',
        trxn_id: data.nonincome_actransaction_id as number,
      };

      const acctrxn_id = await new Trxns(req, trx).AccTrxnUpdate(AccTrxnBody);

      const nonInvoiceincomeInfo: INonInvoiceIncome = {
        nonincome_actransaction_id: acctrxn_id,
        nonincome_amount: amount,
        nonincome_company_id: company_id,
        nonincome_created_date: date,
        nonincome_cheque_no: cheque_no,
        nonincome_receipt_no: receipt_no,
        nonincome_created_by: noninvoice_created_by,
        nonincome_note: note,
      };

      await conn.editNonInvoice(nonInvoiceincomeInfo, noninvoice_id);

      const message = `Non invoice income has been updated ${amount}/-`;
      await this.insertAudit(
        req,
        'update',
        message,
        noninvoice_created_by,
        'ACCOUNTS'
      );

      return {
        success: true,
        message: 'Non invoice edited successfully',
      };
    });
  };

  public viewAllNonInvoice = async (req: Request) => {
    const { page, size, search, from_date, to_date } = req.query as {
      page: string;
      size: string;
      search: string;
      from_date: string;
      to_date: string;
    };

    const conn = this.models.accountsModel(req);

    const data = await conn.getAllNonInvoice(
      Number(page) || 1,
      Number(size) || 20,
      search,
      from_date,
      to_date
    );

    return { success: true, ...data };
  };

  public getNonInvoiceById = async (req: Request) => {
    const { noninvoice_id } = req.params as { noninvoice_id: idType };

    const conn = this.models.accountsModel(req);

    const data = await conn.getAllNonInvoiceById(noninvoice_id);

    return { success: true, data };
  };

  public deleteNonInvoice = async (req: Request) => {
    const { noninvoice_id } = req.params;

    const { deleted_by } = req.body;

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.accountsModel(req, trx);

      const data = await conn.nonInvoiceIncome(noninvoice_id);

      await new Trxns(req, trx).deleteAccTrxn(data.nonincome_actransaction_id);

      const deleted = await conn.deleteNonInvoice(noninvoice_id, deleted_by);

      const message = `Non invoice income has been delete ${Number(
        data.actransaction_amount
      )}/-`;
      await this.insertAudit(req, 'delete', message, deleted_by, 'ACCOUNTS');

      if (!deleted) {
        throw new CustomError(
          'Please provide a valid Id to delete a client',
          400,
          'Invalid client Id'
        );
      }

      return {
        success: true,
        message: 'Non invoice income deleted successfully',
      };
    });
  };

  public editInvestment = async (req: Request) => {
    const {
      company_id,
      type_id,
      amount,
      investment_created_by,
      account_id,
      cheque_no,
      receipt_no,
      date,
      note,
    } = req.body as IInvestmentReqBody;

    const { id } = req.params;

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.accountsModel(req, trx);

      const data = await conn.investmentByid(id);

      const AccTrxnBody: IAcTrxnUpdate = {
        acctrxn_ac_id: account_id,
        acctrxn_type: 'CREDIT',
        acctrxn_amount: amount,
        acctrxn_created_at: date,
        acctrxn_created_by: investment_created_by,
        acctrxn_note: note,
        acctrxn_particular_id: 56,
        acctrxn_particular_type: 'Money receipt',
        acctrxn_pay_type: 'CASH',
        trxn_id: data[0].investment_actransaction_id,
      };

      const transactionId = await new Trxns(req, trx).AccTrxnUpdate(
        AccTrxnBody
      );

      const investmentInfo: IInvestments = {
        investment_actransaction_id: transactionId,
        investment_company_id: company_id,
        investment_cheque_no: cheque_no,
        investment_created_by: investment_created_by,
        investment_created_date: date,
        investment_receipt_no: receipt_no,
        investment_note: note,
      };

      await conn.editInvestment(investmentInfo, id);

      const message = `Investment has been updated ${amount}/-`;
      await this.insertAudit(
        req,
        'update',
        message,
        investment_created_by,
        'ACCOUNTS'
      );
      return {
        success: true,
        message: 'Investment edited successfully',
      };
    });
  };

  public viewInvestment = async (req: Request) => {
    const { page, size, search, from_date, to_date } = req.query as {
      page: string;
      size: string;
      search: string;
      from_date: string;
      to_date: string;
    };

    const conn = this.models.accountsModel(req);

    const data = await conn.getAllInvestment(
      Number(page) || 1,
      Number(size) || 20,
      search,
      from_date,
      to_date
    );

    return { success: true, ...data };
  };

  public getInvestmentById = async (req: Request) => {
    const { id } = req.params as { id: string };

    const conn = this.models.accountsModel(req);

    const data = await conn.investmentByid(id);

    return { success: true, data };
  };

  public deleteInvestment = async (req: Request) => {
    const { id } = req.params;

    const { investment_created_by } = req.body;

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.accountsModel(req, trx);

      const data = await conn.investmentByid(id);

      await new Trxns(req, trx).deleteAccTrxn(
        data[0].investment_actransaction_id
      );

      const deleted = await conn.deleteInvestment(id, investment_created_by);

      const message = `Investment has been deleted ${data[0].actransaction_amount}/-`;
      await this.insertAudit(
        req,
        'delete',
        message,
        investment_created_by,
        'ACCOUNTS'
      );

      if (!deleted) {
        throw new CustomError(
          'Please provide a valid Id to delete a client',
          400,
          'Invalid client Id'
        );
      }

      return { success: true, message: 'Investment deleted successfully!' };
    });
  };

  public viewClientBill = async (req: Request) => {
    const { trash, page, size, search, from_date, to_date } = req.query as {
      trash: string;
      page: string;
      size: string;
      search: string;
      from_date: string;
      to_date: string;
    };

    const conn = this.models.accountsModel(req);

    const data = await conn.viewClientBill(
      Number(page) || 1,
      Number(size) || 20,
      search,
      from_date,
      to_date
    );

    return { success: true, ...data };
  };

  public viewSingleClientBill = async (req: Request) => {
    const { bill_id } = req.params;

    const conn = this.models.accountsModel(req);

    const data = await conn.viewSingleClientBill(bill_id);

    return { success: true, data };
  };

  public deleteClientBill = async (req: Request) => {
    const { bill_id } = req.params;
    const { deleted_by } = req.body as {
      deleted_by: number;
    };

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.accountsModel(req, trx);
      const trxns = new Trxns(req, trx);

      const { cbilladjust_amount, cbilladjust_ctrxn_id, prevCombClient } =
        await conn.viewSingleClientBill(bill_id);

      await trxns.deleteClTrxn(cbilladjust_ctrxn_id, prevCombClient);

      await conn.deleteClientBill(bill_id, deleted_by);

      const message = `Client bill adjustment has been deleted ${cbilladjust_amount}/-`;
      await this.insertAudit(req, 'delete', message, deleted_by, 'ACCOUNTS');

      return {
        success: true,
        message: 'Client Bill Adjustment deleted successfully',
      };
    });
  };

  public viewVendorBill = async (req: Request) => {
    const { page, size, search, from_date, to_date } = req.query as {
      page: string;
      size: string;
      search: string;
      from_date: string;
      to_date: string;
    };

    const conn = this.models.accountsModel(req);

    const data = await conn.viewVendorBill(
      Number(page) || 1,
      Number(size) || 20,
      search,
      from_date,
      to_date
    );

    return { success: true, ...data };
  };

  public viewSingleVendorBill = async (req: Request) => {
    const { bill_id } = req.params;

    const conn = this.models.accountsModel(req);

    const data = await conn.viewSingleVendorBill(bill_id);

    return { success: true, data };
  };

  public deleteVendorBill = async (req: Request) => {
    const { bill_id } = req.params;
    const { created_by } = req.body as { created_by: number };

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.accountsModel(req, trx);
      const trxns = new Trxns(req, trx);

      const {
        vbilladjust_vtrxn_id,
        vbilladjust_amount,
        vbilladjust_vendor_id,
      } = await conn.viewSingleVendorBill(bill_id);

      await trxns.deleteVTrxn(
        vbilladjust_vtrxn_id,
        `vendor-${vbilladjust_vendor_id}`
      );

      await conn.deleteVendorBill(bill_id, created_by);

      const message = `Vendor bill adjustment has been deleted ${vbilladjust_amount}/-`;
      await this.insertAudit(req, 'delete', message, created_by, 'ACCOUNTS');

      return {
        success: true,
        message: 'Vendor bill adjustment deleted successfully',
      };
    });
  };

  public getAllVendors = async (req: Request) => {
    const { trash, size, page, search } = req.query as {
      trash: string;
      size: string;
      page: string;
      search: string;
    };

    const vendor_conn = this.models.vendorModel(req);

    const data = await vendor_conn.getAllVendors(
      Number(page) || 1,
      Number(size) || 20,
      search
    );

    return { success: true, data };
  };

  public allIncentiveIncome = async (req: Request) => {
    const { page, size } = req.query;

    const conn = this.models.accountsModel(req);

    const data = await conn.allIncentive(Number(page) || 1, Number(size) || 20);

    return { success: true, ...data };
  };

  public getIncentiveIncomeById = async (req: Request) => {
    const { id } = req.params as { id: idType };

    const conn = this.models.accountsModel(req);

    const data = await conn.viewAllIncentive(id);

    return { success: true, data };
  };

  public editIncentiveIncome = async (req: Request) => {
    const { id } = req.params;

    const {
      vendor_id,
      type_id,
      account_id,
      adjust_with_bill,
      amount,
      incentive_created_by,
      date,
      note,
    } = req.body as IVendorIncentiveIncomeReqBody;

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.accountsModel(req, trx);
      const trxns = new Trxns(req, trx);

      const incentiveInfo: IIncentiveIncome = {
        incentive_vendor_id: vendor_id,
        incentive_adjust_bill: adjust_with_bill,
        incentive_amount: amount,
        incentive_trnxtype_id: type_id,
        incentive_account_id: account_id,
        incentive_created_by: incentive_created_by,
        incentive_created_date: date,
        incentive_note: note,
      };

      const {
        prev_incentive_acc_id,
        prev_incentive_adjust_bill,
        prev_incentive_vtrxn_id,
        prev_incentive_actransaction_id,
      } = await conn.viewPrevIncentiveInfo(id);

      async function updateVendorBalance() {
        const VTrxnBody: IVTrxnUpdate = {
          comb_vendor: `vendor-${vendor_id}`,
          vtrxn_amount: amount,
          vtrxn_created_at: date,
          vtrxn_note: note,
          vtrxn_particular_id: 126,
          vtrxn_particular_type: 'Incentive income',
          vtrxn_type: 'CREDIT',
          vtrxn_user_id: incentive_created_by,
          vtrxn_voucher: '',
          trxn_id: prev_incentive_vtrxn_id,
        };
        await trxns.VTrxnUpdate(VTrxnBody);
      }

      async function updateAccountBalance() {
        const AccTrxnBody: IAcTrxnUpdate = {
          acctrxn_ac_id: account_id,
          acctrxn_type: 'CREDIT',
          acctrxn_amount: amount,
          acctrxn_created_at: date,
          acctrxn_created_by: incentive_created_by,
          acctrxn_note: note,
          acctrxn_particular_id: 124,
          acctrxn_particular_type: 'Incentive income',
          acctrxn_pay_type: 'CASH',
          trxn_id: prev_incentive_actransaction_id as number,
        };

        const incentive_acctrxn_id = await trxns.AccTrxnUpdate(AccTrxnBody);

        incentiveInfo.incentive_actransaction_id = incentive_acctrxn_id;
      }

      if (adjust_with_bill === prev_incentive_adjust_bill) {
        if (adjust_with_bill === 'YES') {
          await updateVendorBalance();
        } else {
          await updateAccountBalance();
        }
      } else {
        if (adjust_with_bill === 'YES') {
          await updateVendorBalance();
        } else {
          await updateAccountBalance();
        }
      }

      await conn.editIncentive(incentiveInfo, id);

      const message = `Investment has been updated ${amount}/-`;
      await this.insertAudit(
        req,
        'update',
        message,
        incentive_created_by,
        'ACCOUNTS'
      );

      return {
        success: true,
        message: 'Incentive income edited successfully',
      };
    });
  };

  public deleteIncentive = async (req: Request) => {
    const { id } = req.params;

    const { deleted_by } = req.body;

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.accountsModel(req, trx);
      const trxns = new Trxns(req, trx);

      const {
        incentive_actransaction_id,
        incentive_adjust_bill,
        incentive_amount,
        incentive_vtrxn_id,
        incentive_vendor_id,
      } = await conn.incentiveByid(id);

      await conn.deleteIncentive(id, deleted_by);

      if (incentive_adjust_bill == 'YES') {
        await trxns.deleteVTrxn(
          incentive_vtrxn_id,
          `vendor-${incentive_vendor_id}`
        );
      } else {
        await trxns.deleteAccTrxn(incentive_actransaction_id);
      }

      const message = `Investment has been deleted ${incentive_amount}/-`;
      await this.insertAudit(req, 'delete', message, deleted_by, 'ACCOUNTS');
      return {
        success: true,
        message: 'Incentive income deleted successfully',
      };
    });
  };

  public getListOfAccounts = async (req: Request) => {
    const data = await this.models.accountsModel(req).getListOfAccounts();

    return { success: true, data };
  };

  public addAccountOpening = new AddAccountOpeningService()
    .addAccountOpeningBalance;

  public addClientOpening = new AddClientOpeningService()
    .addClientOpeningBalance;

  public addVendorOpening = new AddVendorOpeningService()
    .addVendorOpeningBalance;

  public addIncentiveIncome = new AddIncentiveService()
    .addIncentiveIncomeService;

  public addBTransfer = new AddBalanceTrasnfer().addBTransfer;

  public addNonInvoice = new AddNonInvoice().addNonInvoice;

  public addInvestment = new AddInvestment().addInvestment;

  public clientBillAdj = new AddClientBillAdjustment().clientBillAdj;

  public vendorBillAdj = new AddVendorBillAdjustment().vendorBillAdj;

  public addCombineOpeningBalance = new AddCombineOpeningBalanceService()
    .addCombineOpeningBalance;
}

export default AccountsServices;
