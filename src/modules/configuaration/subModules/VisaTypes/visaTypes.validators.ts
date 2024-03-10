import { check } from 'express-validator';
import AbstractValidator from '../../../../abstracts/abstract.validators';

class VisaTypesValidator extends AbstractValidator {
  readVisaTypes = [this.permissions.check(this.resources.visa_type, 'read')];

  deleteVisaTypes = [
    this.permissions.check(this.resources.visa_type, 'delete'),
  ];

  createVisaTypes = [
    this.permissions.check(this.resources.visa_type, 'create'),
    check('type_name')
      .isLength({ max: 85 })
      .withMessage('Type name can be at most 85 characters.'),
    check('type_created_by')
      .isInt()
      .notEmpty()
      .withMessage('Visa must be created'),
  ];

  editVisaTypes = [
    this.permissions.check(this.resources.visa_type, 'update'),
    check('type_name')
      .isLength({ max: 85 })
      .withMessage('Type name can be at most 85 characters.'),
    check('type_created_by')
      .isInt()
      .optional(true)
      .withMessage('Visa must be created'),
  ];
}

export default VisaTypesValidator;
