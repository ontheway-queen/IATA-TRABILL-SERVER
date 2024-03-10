import { check } from 'express-validator';
import AbstractValidator from '../../abstracts/abstract.validators';

class NotificationValidators extends AbstractValidator {
  readMoneyReceipt = [this.permissions.check(this.resources.database, 'read')];

  passport_expire = [this.permissions.check(this.resources.database, 'read')];

  updateCollectionCheque = [
    this.permissions.check(this.resources.cheque_management, 'update'),
    check('user_id')
      .notEmpty()
      .withMessage('Please enter user id')
      .isInt()
      .withMessage('user id must be an integer value'),
  ];

  updatePaymentChequ = [
    this.permissions.check(this.resources.cheque_management, 'update'),
    check('chequeTable')
      .isIn(['ADVR', 'EXPENSE', 'LOAN_PAYMENT', 'LOAN_RECEIVED', 'LOAN_CHEQUE'])
      .withMessage(
        'cheque table must be ADVR | EXPENSE | LOAN_PAYMENT | LOAN_RECEIVED | LOAN_CHEQUE'
      ),
    check('user_id')
      .notEmpty()
      .withMessage('Please enter user id')
      .isInt()
      .withMessage('user id must be an integer value'),
  ];

  readPassport = [
    this.permissions.check(this.resources.passenger_list_report, 'read'),
  ];

  collectionCheque = [
    this.permissions.check(this.resources.cheque_management, 'read'),
  ];

  readVisa = [this.permissions.check(this.resources.invoice_visa, 'read')];
}

export default NotificationValidators;
