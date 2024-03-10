import { check } from 'express-validator';
import AbstractValidator from '../../../abstracts/abstract.validators';

class LoanValidator extends AbstractValidator {
  readLoan = [
    this.permissions.check(this.resources.loan_management_authority, 'read'),
  ];

  deleteLoan = [
    this.permissions.check(this.resources.loan_management_authority, 'delete'),
    check('deleted_by')
      .notEmpty()
      .withMessage('Please provide how delete load payment')
      .isInt()
      .withMessage('delete by must integer value'),
  ];

  /**
   * validator for `add loan loan_management_authority` router
   */
  addLoanAuthority = [
    this.permissions.check(this.resources.loan_management_authority, 'create'),
    check('name')
      .isLength({ max: 35 })
      .withMessage('Authority name can be at most 35 characters'),
    check('contact')
      .isLength({ max: 20 })
      .withMessage('Contact can be at most 20 characters'),
    check('address')
      .isLength({ max: 100 })
      .withMessage('Address can be at most 100 characters'),
    check('created_by').isInt(),
  ];

  /**
   * validator for `edit loan loan_management_authority` router
   */
  editLoanAuthority = [
    this.permissions.check(this.resources.loan_management_authority, 'update'),
    check('name')
      .isLength({ max: 35 })
      .optional()
      .withMessage('Authority name can be at most 35 characters'),
    check('contact')
      .isLength({ max: 20 })
      .optional()
      .withMessage('Contact can be at most 20 characters'),
    check('address')
      .isLength({ max: 100 })
      .optional()
      .withMessage('Address can be at most 100 characters'),
  ];

  /**
   * validator for `add loan` router
   */
  addLoan = [
    this.permissions.check(this.resources.loan_management_loan, 'create'),
    check('name')
      .isLength({ max: 85 })
      .withMessage('Loan name can be at most 85 characters'),
    check('type').isIn(['TAKING', 'GIVING', 'ALREADY_TAKEN', 'ALREADY_GIVEN']),
    check('amount').isDecimal().withMessage('Loan amount must be number'),
    check('payment_type')
      .isIn([1, 2, 3, 4])
      .withMessage('payment type must be 1 | 2 | 3 | 4'),
  ];

  /**
   * validator for `edit loan` router
   */
  editLoan = [
    this.permissions.check(this.resources.loan_management_loan, 'update'),
    check('name')
      .isLength({ max: 85 })
      .optional()
      .withMessage('Loan name can be at most 85 characters'),
    check('type')
      .isIn(['TAKING', 'GIVING', 'ALREADY_TAKEN', 'ALREADY_GIVEN'])
      .optional(),
    check('amount')
      .isDecimal()
      .optional()
      .withMessage('Loan amount must be number'),
    check('payment_type')
      .optional()
      .isIn([1, 2, 3, 4])
      .withMessage('payment type must be 1 | 2 | 3 | 4'),
  ];

  /**
   * validator for `add payment`
   */
  addPayment = [
    this.permissions.check(this.resources.loan_management_payment, 'create'),
    check('authority_id').isInt(),
    check('loan_id').isInt(),
    check('amount').isDecimal().withMessage('Loan amount must be number'),
    check('payment_type')
      .isIn([1, 2, 3, 4])
      .withMessage('payment type must be 1 | 2 | 3 | 4'),
    check('created_by')
      .isInt()
      .withMessage('created by must be an integer vlaue'),
  ];

  /**
   * validator for `edit payment`
   */
  editPayment = [
    this.permissions.check(this.resources.loan_management_payment, 'create'),
    check('authority_id').isInt().optional(),
    check('loan_id').isInt().optional(),
    check('amount')
      .isDecimal()
      .optional()
      .withMessage('Loan amount must be number'),
    check('payment_type')
      .optional()
      .isIn([1, 2, 3, 4])
      .withMessage('payment type must be 1 | 2 | 3 | 4'),
    check('created_by')
      .isInt()
      .withMessage('Payment created by must be an integer value'),
  ];

  /**
   * validator for `add received`
   */
  addReceived = [
    this.permissions.check(this.resources.loan_management_receive, 'create'),
    check('authority_id').isInt(),
    check('loan_id').isInt(),
    check('amount').isDecimal().withMessage('Loan amount must be number'),
    check('payment_type')
      .isIn([1, 2, 3, 4])
      .withMessage('payment type must be 1 | 2 | 3 | 4'),
  ];

  /**
   * validator for `edit received`
   */
  editReceived = [
    this.permissions.check(this.resources.loan_management_receive, 'create'),
    check('authority_id').isInt().optional(),
    check('loan_id').isInt().optional(),
    check('amount')
      .isDecimal()
      .optional()
      .withMessage('Loan amount must be number'),
    check('payment_type')
      .optional()
      .isIn([1, 2, 3, 4])
      .withMessage('payment type must be 1 | 2 | 3 | 4'),
    check('created_by')
      .isInt()
      .withMessage('receive created by must be an integer value'),
  ];
}

export default LoanValidator;
