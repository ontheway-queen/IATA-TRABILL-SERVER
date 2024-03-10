import { check } from 'express-validator';
import AbstractValidator from '../../../../abstracts/abstract.validators';

class PassportStatusValidator extends AbstractValidator {
  readPassportStatus = [
    this.permissions.check(this.resources.passport_status, 'read'),
  ];

  deletePassportStatus = [
    this.permissions.check(this.resources.passport_status, 'delete'),
    check('deleted_by')
      .notEmpty()
      .withMessage('Please enter deleted by')
      .isInt()
      .withMessage('deleted_by must be an integer value'),
  ];

  createPassportStatus = [
    this.permissions.check(this.resources.passport_status, 'create'),
    check('pstatus_name')
      .isLength({ max: 155 })
      .withMessage('Passport Status can be at most 155 characters.'),
    check('pstatus_created_by')
      .notEmpty()
      .withMessage('Must enter a value')
      .isInt()
      .withMessage('Enter integer value'),
  ];

  editPassportStatus = [
    this.permissions.check(this.resources.passport_status, 'update'),
    check('pstatus_name')
      .isLength({ max: 155 })
      .withMessage('Passport Status can be at most 155 characters.'),
  ];
}

export default PassportStatusValidator;
