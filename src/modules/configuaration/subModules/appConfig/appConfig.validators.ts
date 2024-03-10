import { check } from 'express-validator';
import AbstractValidator from '../../../../abstracts/abstract.validators';

class AppConfigValidators extends AbstractValidator {
  readOffice = [
    this.permissions.check(this.resources.configuration_module, 'read'),
  ];

  createOffice = [
    this.permissions.check(this.resources.configuration_module, 'create'),
    check('office_name').notEmpty().withMessage('Please enter office name'),
    check('office_address').optional(),
    check('office_email')
      .optional()
      .isEmail()
      .withMessage('Please enter a valid email'),
    check('office_created_by')
      .notEmpty()
      .withMessage('Please enter office created by')
      .isInt()
      .withMessage('office created by must be an integer value'),
  ];

  editOffice = [
    this.permissions.check(this.resources.configuration_module, 'update'),
    check('office_name').optional(),
    check('office_address').optional(),
    check('office_email')
      .optional()
      .isEmail()
      .withMessage('Please enter a valid email'),
    check('office_updated_by')
      .notEmpty()
      .withMessage('Please enter office updated by')
      .isInt()
      .withMessage('office updated by must be an integer value'),
  ];

  deleteOffice = [
    this.permissions.check(this.resources.configuration_module, 'delete'),
    check('deleted_by')
      .notEmpty()
      .withMessage('Please enter office deleted by')
      .isInt()
      .withMessage('office deleted by must be an integer value'),
  ];

  readAppConfig = [
    this.permissions.check(this.resources.configuration_module, 'read'),
  ];
}
export default AppConfigValidators;
