import { check } from 'express-validator';
import AbstractValidator from '../../../../abstracts/abstract.validators';

class ExpenseHeadValidator extends AbstractValidator {
  readExpenseHead = [
    this.permissions.check(this.resources.expense_head, 'read'),
  ];

  deleteExpenseHead = [
    this.permissions.check(this.resources.expense_head, 'delete'),
    check('deleted_by')
      .isInt()
      .withMessage('deleted by must be an integer value'),
  ];

  createExpenseHead = [
    this.permissions.check(this.resources.expense_head, 'create'),
    check('head_name')
      .notEmpty()
      .withMessage('Enter ExpenseHead')
      .isLength({ max: 155 })
      .withMessage('Source title can be at most 155 characters.'),

    check('head_created_by')
      .notEmpty()
      .withMessage('Must enter a value')
      .isInt()
      .withMessage('Enter integer value'),
  ];

  editExpenseHead = [
    this.permissions.check(this.resources.expense_head, 'update'),
    check('head_name')
      .isLength({ max: 155 })
      .withMessage('Source title can be at most 155 characters.'),
  ];
}
export default ExpenseHeadValidator;
