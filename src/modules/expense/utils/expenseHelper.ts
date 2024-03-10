import { IExpenseDetails } from '../types/expense.interfaces';

class ExpenseHelper {
  /**
   * accpets array of expense details object from the request body
   * @returns parsed array of object ready to insert into database
   *
   * @param export_details IExpenseDetails[]
   *
   */
  public static parseExpenseDetails(
    expense_details: IExpenseDetails[],
    expense_id: number | string
  ) {
    const expenseDetailsInfo: IExpenseDetails[] = [];

    for (let i = 0; i < expense_details.length; i++) {
      const element = expense_details[i];

      const toPush: IExpenseDetails = {
        expdetails_expense_id: expense_id,
        expdetails_head_id: element.expdetails_head_id,
        expdetails_amount: element.expdetails_amount,
      };

      expenseDetailsInfo.push(toPush);
    }

    return expenseDetailsInfo;
  }
}

export default ExpenseHelper;
