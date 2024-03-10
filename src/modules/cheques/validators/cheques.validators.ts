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
      .withMessage('Pleace provide cheque id')
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
      .withMessage('Pleace provide cheque type')
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
      .withMessage('Pleace provide valid cheque type'),
    check('cheque_status')
      .notEmpty()
      .withMessage('Pleace provide cheque status')
      .isIn(['DEPOSIT', 'BOUNCE', 'RETURN'])
      .withMessage('Pleace provide valid cheque status'),
    check('cheque_amount')
      .notEmpty()
      .withMessage('Pleace provide cheque amount'),
    check('cheque_note')
      .optional()
      .customSanitizer((value) => (value === null ? undefined : value))
      .isString()
      .withMessage('Cheque not must be string value'),
    check('date')
      .notEmpty()
      .withMessage('Date is required! pleace provide date')
      .toDate(),
    check('user_id')
      .notEmpty()
      .withMessage('User id is required! pleace provide user id'),
  ];
}
export default chequesValidators;
