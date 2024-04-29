import { check } from 'express-validator';
import AbstractValidator from '../../../abstracts/abstract.validators';

class chequesValidators extends AbstractValidator {
  readCheques = [
    this.permissions.check(this.resources.cheque_management, 'read'),
  ];

  updateChequeStatus = [
    this.permissions.check(this.resources.cheque_management, 'update'),
    check('cheque_id')
      .notEmpty()
      .withMessage('Please provide cheque id')
      .isInt()
      .withMessage('cheque id must be an integer value'),
    check('account_id')
      .optional()
      .customSanitizer((value) => (value === null ? undefined : value))
      .isInt()
      .withMessage('account id must be an integer value'),
    check('comb_vendor')
      .optional()
      .customSanitizer((value) => (value === null ? undefined : value))
      .customSanitizer((value) => (value === null ? undefined : value))
      .isString()
      .withMessage('Vendor must be an string value'),
    check('comb_client')
      .optional()
      .customSanitizer((value) => (value === null ? undefined : value))
      .isString()
      .withMessage('Client must be an string value'),
    check('cheque_type')
      .notEmpty()
      .withMessage('Please provide cheque type')
      .isIn([
        'MR_ADVR',
        'EXPENSE',
        'LOAN',
        'LOAN_PAYMENT',
        'LOAN_RECEIVED',
        'MONEY_RECEIPT',
        'PAYROLL',
        'VENDOR_ADVR',
        'VENDOR_PAYMENT',
      ])
      .withMessage('Please provide valid cheque type'),
    check('cheque_status')
      .notEmpty()
      .withMessage('Please provide cheque status')
      .isIn(['DEPOSIT', 'BOUNCE', 'RETURN'])
      .withMessage('Please provide valid cheque status'),
    check('cheque_amount')
      .notEmpty()
      .withMessage('Please provide cheque amount'),
    check('cheque_note')
      .optional()
      .customSanitizer((value) => (value === null ? undefined : value))
      .isString()
      .withMessage('Cheque not must be string value'),
    check('date')
      .notEmpty()
      .withMessage('Date is required! Please provide date')
      .toDate(),
    check('user_id')
      .notEmpty()
      .withMessage('User id is required! Please provide user id'),
  ];
}
export default chequesValidators;
