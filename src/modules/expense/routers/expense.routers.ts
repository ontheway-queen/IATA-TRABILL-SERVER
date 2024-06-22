import AbstractRouter from '../../../abstracts/abstract.routers';
import ExpenseContorller from '../controllers/expense.controllers';

class ExpenseRouter extends AbstractRouter {
  private controllers = new ExpenseContorller();

  constructor() {
    super();

    this.callRouter();
  }

  private callRouter() {
    this.routers.route('/cheque').get(this.controllers.expenseCheques);

    this.routers
      .route('/')
      .post(
        this.uploader.cloudUploadRaw(this.fileFolder.TRABILL_FILE),
        this.controllers.createExpense
      )
      .get(this.controllers.allExpenses);

    this.routers
      .route('/:expense_id')
      .get(this.controllers.singleExpenses)
      .patch(
        this.uploader.cloudUploadRaw(this.fileFolder.TRABILL_FILE),
        this.controllers.editExpense
      )
      .delete(this.controllers.deleteExpense);

    this.routers.get(
      '/expense-infos/:expense_id',
      this.controllers.expenseInfos
    );
  }
}

export default ExpenseRouter;
