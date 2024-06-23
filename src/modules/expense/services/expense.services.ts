import { Request } from 'express';
import AbstractServices from '../../../abstracts/abstract.services';
import Trxns from '../../../common/helpers/Trxns';
import {
  IAcTrxn,
  IAcTrxnUpdate,
} from '../../../common/interfaces/Trxn.interfaces';
import { IOnlineTrxnCharge } from '../../accounts/types/account.interfaces';
import { TChequeStatus } from '../../cheques/types/cheques.interface';
import {
  IExpense,
  IExpenseChequeDetails,
  IExpenseReqBody,
} from '../types/expense.interfaces';
import ExpenseHelper from '../utils/expenseHelper';
import { getPaymentType } from '../../../common/utils/libraries/lib';

class ExpneseService extends AbstractServices {
  constructor() {
    super();
  }

  public addExpense = async (req: Request) => {
    const {
      expense_details,
      expense_payment_type,
      charge_amount,
      expense_accategory_id,
      expense_accounts_id,
      expense_cheque_no,
      expcheque_withdraw_date,
      expcheque_bank_name,
      expense_total_amount,
      expense_date,
      expense_note,
      expense_created_by,
    } = req.body as IExpenseReqBody;

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.expenseModel(req, trx);
      const trxns = new Trxns(req, trx);

      const files = req.files as Express.Multer.File[] | [];

      const expense_vouchar_no = await this.generateVoucher(req, 'EXP');

      let expense_charge_id: number | null = null;
      if (expense_payment_type === 3 && charge_amount) {
        const online_charge_trxn: IOnlineTrxnCharge = {
          charge_from_acc_id: expense_accounts_id,
          charge_amount: charge_amount,
          charge_purpose: `Expense`,
          charge_note: expense_note as string,
        };

        expense_charge_id = await this.models
          .vendorModel(req, trx)
          .insertOnlineTrxnCharge(online_charge_trxn);
      }

      const expenseInfo: IExpense = {
        expense_payment_type,
        expense_total_amount,
        expense_date,
        expense_created_by,
        expense_vouchar_no,
        expense_note,
        expense_charge_amount: charge_amount,
        expense_charge_id,
      };

      if (files) {
        files.map((item) => {
          if (item.fieldname === 'expense_voucher_url_1')
            expenseInfo.expense_voucher_url_1 = item.filename;
          if (item.fieldname === 'expense_voucher_url_2')
            expenseInfo.expense_voucher_url_2 = item.filename;
        });
      }

      if (expense_payment_type !== 4 && expense_accounts_id) {
        // account transaction

        let accPayType = getPaymentType(expense_payment_type);

        const AccTrxnBody: IAcTrxn = {
          acctrxn_ac_id: expense_accounts_id,
          acctrxn_type: 'DEBIT',
          acctrxn_voucher: expense_vouchar_no,
          acctrxn_amount: expense_total_amount,
          acctrxn_created_at: expense_date,
          acctrxn_created_by: expense_created_by,
          acctrxn_note: expense_note,
          acctrxn_particular_id: 72,
          acctrxn_particular_type: 'Expense create',
          acctrxn_pay_type: accPayType,
        };

        const expense_acctrxn_id = await trxns.AccTrxnInsert(AccTrxnBody);

        expenseInfo.expense_accategory_id = expense_accategory_id;
        expenseInfo.expense_accounts_id = expense_accounts_id;
        expenseInfo.expense_acctrxn_id = expense_acctrxn_id;
      }

      if (expense_payment_type == 4) {
        expenseInfo.expense_cheque_no = expense_cheque_no;
      }

      const expenseId = await conn.createExpense(expenseInfo);

      if (expense_payment_type == 4) {
        expenseInfo.expense_cheque_no = expense_cheque_no;

        const chequeInfo: IExpenseChequeDetails = {
          expcheque_number: String(expense_cheque_no),
          expcheque_bank_name: expcheque_bank_name,
          expcheque_withdraw_date: expcheque_withdraw_date,
          expcheque_amount: expense_total_amount,
          expcheque_expense_id: expenseId,
        };

        await conn.addExpenseCheque(chequeInfo);
      }

      const expenseDetailsInfo = ExpenseHelper.parseExpenseDetails(
        JSON.parse(String(expense_details)),
        expenseId
      );

      await conn.createExpenseDtls(expenseDetailsInfo);

      await this.insertAudit(
        req,
        'create',
        `Create expense ${expense_payment_type}:- ${expense_total_amount}/-`,
        expense_created_by,
        'EXPENSE'
      );

      await this.updateVoucher(req, 'EXP');

      return {
        success: true,
        message: 'Expense created successfull',
        expenseId,
      };
    });
  };

  public editExpense = async (req: Request) => {
    const {
      expense_details,
      expense_payment_type,
      expense_accategory_id,
      expense_accounts_id,
      expense_cheque_no,
      expcheque_withdraw_date,
      expcheque_bank_name,
      expense_total_amount,
      expense_date,
      expense_note,
      charge_amount,
      expense_created_by,
    } = req.body as IExpenseReqBody;

    const payType = Number(expense_payment_type);

    const { expense_id } = req.params;

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.expenseModel(req, trx);
      const trxns = new Trxns(req, trx);

      const files = req.files as Express.Multer.File[] | [];

      const {
        expense_payment_type: prev_ex_type,
        prevAccTrxnId,
        expense_charge_id,
        expense_voucher_url_1,
        expense_voucher_url_2,
      } = await conn.getExpense(expense_id);

      if (expense_charge_id) {
        await this.models
          .vendorModel(req, trx)
          .updateOnlineTrxnCharge(
            { charge_amount, charge_purpose: 'Expense charge' },
            expense_charge_id
          );
      }

      const expenseInfo: IExpense = {
        expense_payment_type,
        expense_total_amount,
        expense_date,
        expense_created_by,
        expense_note,
        expense_charge_amount: charge_amount,
        expense_charge_id: null,
      };

      if (files) {
        files.map((item) => {
          if (item.fieldname === 'expense_voucher_url_1') {
            expenseInfo.expense_voucher_url_1 = item.filename;
            if (expense_voucher_url_1)
              this.manageFile.deleteFromCloud([expense_voucher_url_1]);
          }
          if (item.fieldname === 'expense_voucher_url_2') {
            expenseInfo.expense_voucher_url_2 = item.filename;
            if (expense_voucher_url_2)
              this.manageFile.deleteFromCloud([expense_voucher_url_2]);
          }
        });
      }

      // account transaction
      if (payType !== 4) {
        const AccTrxnBody: IAcTrxnUpdate = {
          acctrxn_ac_id: expense_accounts_id as number,
          acctrxn_type: 'DEBIT',
          acctrxn_amount: expense_total_amount,
          acctrxn_created_at: expense_date,
          acctrxn_created_by: expense_created_by,
          acctrxn_note: expense_note,
          acctrxn_particular_id: 20,
          acctrxn_particular_type: 'Expense',
          acctrxn_pay_type: 'CASH',
          trxn_id: prevAccTrxnId,
        };

        const expense_acctrxn_id = await trxns.AccTrxnUpdate(AccTrxnBody);

        expenseInfo.expense_accategory_id = expense_accategory_id;
        expenseInfo.expense_accounts_id = expense_accounts_id;
        expenseInfo.expense_acctrxn_id = expense_acctrxn_id;
      } else {
        if (prev_ex_type !== 4) {
          await trxns.deleteAccTrxn(prevAccTrxnId);
        }
      }

      if (expense_payment_type == 4) {
        expenseInfo.expense_cheque_no = expense_cheque_no;

        if (prev_ex_type === 4) {
          await conn.deleteExpenseChq(expense_id, expense_created_by);
        }

        const chequeInfo: IExpenseChequeDetails = {
          expcheque_number: String(expense_cheque_no),
          expcheque_bank_name,
          expcheque_withdraw_date,
          expcheque_amount: expense_total_amount,
          expcheque_expense_id: expense_id,
        };

        await conn.editExpenseChq(chequeInfo, expense_id);
      }

      await conn.editExpense(expenseInfo, expense_id);

      const expenseDetailsInfo = ExpenseHelper.parseExpenseDetails(
        JSON.parse(String(expense_details)),
        expense_id
      );

      await conn.deleteExpenseDtls(expense_id, expense_created_by);

      await conn.createExpenseDtls(expenseDetailsInfo);

      await this.insertAudit(
        req,
        'update',
        `Update expense ${expense_payment_type}:- ${expense_total_amount}/-`,
        expense_created_by,
        'EXPENSE'
      );

      return {
        success: true,
        message: 'Expense edited successfull',
      };
    });
  };

  public allExpenses = async (req: Request) => {
    const { trash, page, size, search, from_date, to_date } = req.query as {
      trash: string;
      page: string;
      size: string;
      search: string;
      from_date: string;
      to_date: string;
    };

    const conn = this.models.expenseModel(req);

    const data = await conn.viewExpenses(
      Number(page) || 1,
      Number(size) || 20,
      search,
      from_date,
      to_date
    );

    return { success: true, ...data };
  };

  public singleExpenses = async (req: Request) => {
    const { expense_id } = req.params;

    const conn = this.models.expenseModel(req);

    const data = await conn.viewSingleExpenses(expense_id);

    return { success: true, data };
  };

  public deleteExpense = async (req: Request) => {
    const { expense_id } = req.params;

    const { expense_created_by, expense_date } = req.body;

    return await this.models.db.transaction(async (trx) => {
      const conn = this.models.expenseModel(req, trx);
      const trxns = new Trxns(req, trx);

      const {
        expense_payment_type,
        expense_acctrxn_id,
        expense_total_amount,
        expense_charge_id,
        expense_voucher_url_1,
        expense_voucher_url_2,
      } = await conn.getPreviousData(expense_id);

      if (expense_acctrxn_id) {
        await trxns.deleteAccTrxn(expense_acctrxn_id);
      }

      await conn.deleteExpense(expense_id, expense_created_by);

      await conn.deleteExpenseDtls(expense_id, expense_created_by);

      if (expense_payment_type == 4) {
        await conn.deleteExpenseChq(expense_id, expense_created_by);
      }

      if (expense_charge_id) {
        await this.models
          .vendorModel(req, trx)
          .deleteOnlineTrxnCharge(expense_charge_id);
      }

      if (expense_voucher_url_1)
        this.manageFile.deleteFromCloud([expense_voucher_url_1]);

      if (expense_voucher_url_2)
        this.manageFile.deleteFromCloud([expense_voucher_url_2]);

      await this.insertAudit(
        req,
        'delete',
        `Delete expense ${expense_payment_type}:- ${expense_total_amount}/-`,
        expense_created_by,
        'EXPENSE'
      );

      return { success: true, message: 'Expense deleted successfully' };
    });
  };

  public expenseInfos = async (req: Request) => {
    const { expense_id } = req.params;

    const conn = this.models.expenseModel(req);

    const data = await conn.headInfos(expense_id);

    return { success: true, data };
  };

  public expenseCheques = async (req: Request) => {
    const { status } = req.query;

    const conn = this.models.expenseModel(req);

    const data = await conn.getExpenseCheque(status as TChequeStatus);

    return { success: true, data };
  };
}

export default ExpneseService;
