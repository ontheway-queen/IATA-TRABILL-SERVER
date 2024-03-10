import { check } from 'express-validator';
import AbstractValidator from '../../../abstracts/abstract.validators';

class SmsValidator extends AbstractValidator {
  readSms = [this.permissions.check(this.resources.sms_system, 'read')];

  createSms = [
    this.permissions.check(this.resources.sms_system, 'create'),
    check('.*.client_mobile').isAlphanumeric(),
    check('.*.text_type').isIn(['TEXT', 'UNICODE']),
    check('.*.message')
      .isString()
      .notEmpty()
      .withMessage('Please provide message'),
    check('.*.date').isDate().toDate(),
    check('.*.created_by')
      .notEmpty()
      .withMessage('Please enter created by')
      .isInt()
      .withMessage('created by must be an integer value'),
  ];
}

export default SmsValidator;
