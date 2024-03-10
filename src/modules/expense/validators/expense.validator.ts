import { check } from 'express-validator';
import AbstractValidator from '../../../abstracts/abstract.validators';

class ExpenseValidator extends AbstractValidator {
  readExpense = [this.permissions.check(this.resources.expense, 'read')];

  deleteExpense = [
    this.permissions.check(this.resources.expense, 'delete'),
    check('note').optional(),
    check('date').optional().isDate(),
  ];

  restoreExpense = [this.permissions.check(this.resources.expense, 'read')];

  /**
   * validation for `create expense`
   */
  createExpense = [
    this.permissions.check(this.resources.expense, 'create'),
    check('expense_details.*.expdetails_head_id').isInt(),
    check('expense_payment_type')
      .notEmpty()
      .withMessage('Payment method must be not null')
      .isIn([1, 2, 3, 4])
      .withMessage('Payment method value must be 1, 2, 3 or 4'),
    check('expense_details.*.expdetails_amount').isNumeric(),
    check('expense_total_amount').isNumeric(),
    check('expense_date').toDate(),
    check('expcheque_withdraw_date').toDate(),
  ];

  /**
   * validation for `update expense`
   */
  updateExpense = [
    this.permissions.check(this.resources.expense, 'update'),
    check('expense_details.*.expdetails_head_id').isInt(),
    check('expense_payment_type')
      .notEmpty()
      .withMessage('Payment method must be not null')
      .isIn([1, 2, 3, 4])
      .withMessage('Payment method value must be 1, 2, 3 or 4'),
    check('expense_details.*.expdetails_amount').isNumeric(),
    check('expense_total_amount').isNumeric(),
    check('expense_date').toDate(),
    check('expcheque_withdraw_date').toDate(),
  ];
}

export default ExpenseValidator;
