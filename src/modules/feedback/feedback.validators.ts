import AbstractValidator from "../../abstracts/abstract.validators";
import { check } from 'express-validator';

class FeedbackValidator extends AbstractValidator {


  createFeedback = [
    // this.permissions.check(this.resources.expense, 'create'),
    // check('expense_details.*.expdetails_head_id').isInt(),
    // check('expense_payment_type')
    //   .notEmpty()
    //   .withMessage('Payment method must be not null')
    //   .isIn([1, 2, 3, 4])
    //   .withMessage('Payment method value must be 1, 2, 3 or 4'),
    // check('expense_details.*.expdetails_amount').isNumeric(),
    // check('expcheque_withdraw_date').optional().isDate(),
    // check('expense_total_amount').isNumeric(),
    // check('expense_date').isDate(),
  ];
    
  }
  
  export default FeedbackValidator;