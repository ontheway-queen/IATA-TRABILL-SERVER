import multer from 'multer';
import AbstractRouter from '../../../abstracts/abstract.routers';
import ExpenseContorller from '../controllers/expense.controllers';
import { uploadImageToAzure_trabill } from '../../../common/helpers/ImageUploadToAzure_trabill';

const storage = multer.memoryStorage();
const upload = multer({ storage });

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
        upload.fields([
          { name: 'expense_voucher_url_1', maxCount: 1 },
          { name: 'expense_voucher_url_2', maxCount: 1 },
        ]),
        uploadImageToAzure_trabill,
        this.controllers.createExpense
      )
      .get(this.controllers.allExpenses);

    this.routers
      .route('/:expense_id')
      .get(this.controllers.singleExpenses)
      .patch(
        upload.fields([
          { name: 'expense_voucher_url_1', maxCount: 1 },
          { name: 'expense_voucher_url_2', maxCount: 1 },
        ]),
        uploadImageToAzure_trabill,
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
