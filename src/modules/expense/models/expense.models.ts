import moment from 'moment';
import AbstractModels from '../../../abstracts/abstract.models';
import { idType } from '../../../common/types/common.types';
import CustomError from '../../../common/utils/errors/customError';
import { TChequeStatus } from '../../cheques/types/cheques.interface';
import {
  IExpense,
  IExpenseChequeDetails,
  IExpenseDetails,
  IGetExpenseDetails,
  IGetSingleExpense,
} from '../types/expense.interfaces';

class ExpenseModel extends AbstractModels {
  public async createExpense(data: IExpense) {
    const expense = await this.query()
      .insert({ ...data, expense_org_agency: this.org_agency })
      .into('trabill_expenses');

    return expense[0];
  }

  public async expenseImagesUrl(id: number | string) {
    const [urlList] = await this.query()
      .select('expense_voucher_url_1', 'expense_voucher_url_2')
      .from('trabill_expenses')
      .where('expense_id', id)
      .andWhereNot('expense_is_deleted', 1);

    return urlList as {
      expense_voucher_url_1: string;
      expense_voucher_url_2: string;
    };
  }

  public async editExpense(data: IExpense, expense_id: number | string) {
    const expense = await this.query()
      .update(data)
      .into('trabill_expenses')
      .where('expense_id', expense_id);
    if (expense) {
      return expense;
    } else {
      throw new CustomError(`You can't edit this expense`, 400, `Bad Id`);
    }
  }

  public async deleteExpense(expense_id: idType, expense_deleted_by: idType) {
    const expense = await this.query()
      .update({ expense_is_deleted: 1, expense_deleted_by })
      .into('trabill_expenses')
      .where('expense_id', expense_id);

    expense;
  }

  public async createExpenseDtls(data: IExpenseDetails[]) {
    const expense = await this.query()
      .insert(data)
      .into('trabill_expense_details');

    return expense[0];
  }

  public async deleteExpenseDtls(
    expense_id: idType,
    expdetails_deleted_by: idType
  ) {
    const expense = await this.query()
      .update({ expdetails_is_deleted: 1, expdetails_deleted_by })
      .into('trabill_expense_details')
      .where('expdetails_expense_id', expense_id);

    return expense;
  }

  public async addExpenseCheque(data: IExpenseChequeDetails) {
    const cheque = await this.query()
      .insert(data)
      .into('trabill_expense_cheque_details');

    return cheque[0];
  }

  public async deleteExpenseChq(
    expense_id: idType,
    expcheque_deleted_by: idType
  ) {
    const cheque = await this.query()
      .update({ expcheque_is_deleted: 1, expcheque_deleted_by })
      .into('trabill_expense_cheque_details')
      .where('expcheque_expense_id', expense_id);

    return cheque;
  }

  public async editExpenseChq(data: IExpenseChequeDetails, expense_id: idType) {
    const cheque = await this.query()
      .update(data)
      .into('trabill_expense_cheque_details')
      .where('expcheque_expense_id', expense_id);

    return cheque;
  }

  public async viewExpenses(
    page: number,
    size: number,
    search: string,
    from_date: string,
    to_date: string
  ) {
    search && search.toLowerCase();
    const page_number = (page - 1) * size;
    from_date
      ? (from_date = moment(new Date(from_date)).format('YYYY-MM-DD'))
      : null;
    to_date ? (to_date = moment(new Date(to_date)).format('YYYY-MM-DD')) : null;

    const data = await this.query()
      .select(
        'expense_id',
        'expense_vouchar_no',
        'expense_payment_type',
        'expcheque_status',
        'account_name',
        'acctype_name',
        'expense_total_amount',
        'expense_date',
        'expense_note',
        'expense_is_deleted',
        'expense_created_date',
        'expense_voucher_url_1',
        'expense_voucher_url_2',
        'acctype_name'
      )
      .from('trabill_expenses')
      .distinct()
      .leftJoin(
        'trabill_accounts',
        'trabill_accounts.account_id',
        'trabill_expenses.expense_accounts_id'
      )
      .leftJoin(
        'trabill_expense_cheque_details',
        'trabill_expense_cheque_details.expcheque_expense_id',
        'trabill_expenses.expense_id'
      )
      .leftJoin(
        'trabill_accounts_type',
        'trabill_accounts_type.acctype_id',
        'trabill_expenses.expense_payment_type'
      )
      .where('expense_is_deleted', 0)
      .andWhere((e) => {
        e.andWhere('expense_org_agency', this.org_agency).modify((event) => {
          if (search) {
            event
              .andWhereRaw('LOWER(account_name) LIKE ?', [`%${search}%`])
              .orWhereRaw('LOWER(expense_vouchar_no) LIKE ? ', [`%${search}%`]);
          }
          if (from_date && to_date) {
            event.andWhereRaw(
              `DATE_FORMAT(expense_date, '%Y-%m-%d') BETWEEN ? AND ? `,
              [from_date, to_date]
            );
          }
        });
      })
      .andWhere('expense_org_agency', this.org_agency)
      .orderBy('expense_created_date', 'desc')
      .limit(size)
      .offset(page_number);

    const [{ row_count }] = await this.query()
      .select(this.db.raw(`count(*) as row_count`))
      .from('trabill_expenses')
      .leftJoin(
        'trabill_accounts',
        'trabill_accounts.account_id',
        'trabill_expenses.expense_accounts_id'
      )
      .where('expense_is_deleted', 0)
      .andWhere((e) => {
        e.andWhere('expense_org_agency', this.org_agency).modify((event) => {
          if (search) {
            event
              .andWhereRaw('LOWER(account_name) LIKE ?', [`%${search}%`])
              .orWhereRaw('LOWER(expense_vouchar_no) LIKE ? ', [`%${search}%`]);
          }
          if (from_date && to_date) {
            event.andWhereRaw(
              `DATE_FORMAT(expense_date, '%Y-%m-%d') BETWEEN ? AND ? `,
              [from_date, to_date]
            );
          }
        });
      })
      .andWhere('expense_org_agency', this.org_agency);

    return { count: row_count, data };
  }

  public async viewSingleExpenses(expense_id: idType) {
    const expense = (await this.query()
      .select(
        'expense_id',
        'expense_vouchar_no',
        'expense_payment_type',
        'expcheque_number as expense_cheque_no',
        'expcheque_bank_name',
        'expcheque_withdraw_date',
        'expcheque_status',
        'expense_accounts_id',
        'account_id',
        'account_name',
        'acctype_id',
        'acctype_name',
        'expense_total_amount',
        'expense_date',
        'expense_voucher_url_1',
        'expense_voucher_url_2',
        'expense_note',
        'expense_acctrxn_id'
      )
      .leftJoin(
        'trabill_accounts',
        'trabill_accounts.account_id',
        'trabill_expenses.expense_accounts_id'
      )
      .leftJoin(
        'trabill_expense_cheque_details',
        'trabill_expense_cheque_details.expcheque_expense_id',
        'trabill_expenses.expense_id'
      )
      .leftJoin(
        'trabill_accounts_type',
        'trabill_accounts_type.acctype_id',
        'trabill_expenses.expense_accategory_id'
      )
      .from('trabill_expenses')
      .andWhere('expense_id', expense_id)) as IGetSingleExpense[];

    const expense_details = (await this.query()
      .select('expdetails_head_id', 'head_name', 'expdetails_amount')
      .leftJoin(
        'trabill_expense_head',
        'trabill_expense_head.head_id',
        'trabill_expense_details.expdetails_head_id'
      )
      .from('trabill_expense_details')
      .andWhere('expdetails_expense_id', expense_id)
      .andWhere('expdetails_is_deleted', 0)) as IGetExpenseDetails[];

    if (expense[0]) {
      return {
        ...expense[0],
        ...(expense[0].expense_id && { expense_details }),
      };
    } else {
      throw new CustomError(
        'Cannot find any expense with this ID',
        400,
        'Bad Request'
      );
    }
  }

  public async getPreviousData(expense_id: idType) {
    const [expense] = await this.query()
      .select(
        'expense_payment_type',
        'expense_acctrxn_id',
        'expense_total_amount',
        'expense_charge_id',
        'expense_voucher_url_1',
        'expense_voucher_url_2'
      )
      .from('trabill_expenses')
      .where('expense_id', expense_id);

    return expense as {
      expense_payment_type: 1 | 2 | 3 | 4;
      expense_acctrxn_id: number;
      expense_total_amount: number;
      expense_charge_id: number;
      expense_voucher_url_1: string;
      expense_voucher_url_2: string;
    };
  }

  public async getExpenseCheque(status: TChequeStatus) {
    const cheques = await this.query()
      .select(
        'expcheque_id as cheque_id',
        'expcheque_number as cheque_number',
        'expcheque_withdraw_date as cheque_withdraw_date',
        'expcheque_amount as cheque_amount',
        'expcheque_bank_name as cheque_bank',
        'expcheque_status as cheque_status'
      )
      .from('trabill_expense_cheque_details')
      .leftJoin('trabill_expenses', { expense_id: 'expcheque_expense_id' })
      .where('expcheque_is_deleted', 0)
      .andWhere('expense_org_agency', this.org_agency)
      .andWhere('expcheque_status', status);

    return cheques;
  }

  public async headInfos(expens_id: number | string) {
    const infos = await this.query()
      .select(
        'head_name',
        'expdetails_amount',
        'expense.expense_payment_type',
        this.db.raw(
          'CASE WHEN expense_payment_type = 4 THEN "Cheque" WHEN expense_payment_type = 1 THEN "Cash" WHEN expense_payment_type = 2 THEN "Bank" WHEN expense_payment_type = 3 THEN "Mobile banking"  ELSE NULL END AS expense_pay_type'
        ),
        'expense.expense_note',
        'expense_cheque_no',
        'expcheque_withdraw_date',
        'expcheque_bank_name',
        'expense.expense_vouchar_no',
        'expense.expense_total_amount',
        'account_name'
      )
      .from('trabill_expense_details')

      .leftJoin(
        'trabill_expense_head',
        'trabill_expense_head.head_id',
        'trabill_expense_details.expdetails_head_id'
      )

      .leftJoin('trabill_expenses as expense', {
        'expense.expense_id': 'expdetails_expense_id',
      })
      .leftJoin('trabill_accounts', {
        account_id: 'expense.expense_accounts_id',
      })
      .leftJoin('trabill_expense_cheque_details', {
        expcheque_expense_id: 'expense_id',
      })
      .where('expense.expense_org_agency', this.org_agency)
      .andWhere('expense.expense_id', expens_id)
      .andWhereNot('expense.expense_is_deleted', 1)
      .andWhereNot('expdetails_is_deleted', 1);

    return infos;
  }
  public async getExpense(expens_id: idType) {
    const infos = await this.query()
      .select(
        'expense_total_amount',
        'expense_payment_type',
        'expense_acctrxn_id as prevAccTrxnId',
        'expense_accounts_id as prevAccId',
        'expense_charge_amount',
        'expense_charge_id',
        'expense_voucher_url_1',
        'expense_voucher_url_2'
      )

      .from('trabill_expenses')
      .where('expense_id', expens_id);

    if (infos[0]) {
      return infos[0] as {
        expense_total_amount: string;
        expense_payment_type: number;
        prevAccTrxnId: number;
        prevAccId: number;
        expense_charge_amount: number;
        expense_charge_id: number;
        expense_voucher_url_1: string;
        expense_voucher_url_2: string;
      };
    }

    throw new CustomError('Cannot find any expense', 400, 'Bad request');
  }

  public async getExpenseChequeAmount(cheque_id: idType) {
    const lastBalance = await this.query()
      .select('expcheque_amount')
      .from('trabill_expense_cheque_details')
      .where('expcheque_id', cheque_id);
    if (lastBalance[0]) {
      const id = lastBalance[0] as { expcheque_amount: string };

      return Number(id.expcheque_amount);
    } else {
      throw new CustomError(
        'Cannot find any account with this ID',
        400,
        'Bad requeest'
      );
    }
  }
}

export default ExpenseModel;
