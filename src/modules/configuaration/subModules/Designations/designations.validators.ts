import { check } from 'express-validator';
import AbstractValidator from '../../../../abstracts/abstract.validators';

class DesignationsValidator extends AbstractValidator {
  readDesignation = [
    this.permissions.check(this.resources.designations, 'read'),
  ];

  deleteDesignation = [
    this.permissions.check(this.resources.designations, 'delete'),
    check('deleted_by')
      .notEmpty()
      .withMessage('Please provide deleted by')
      .isInt()
      .withMessage('deleted by must be an integer value'),
  ];

  createDesignation = [
    this.permissions.check(this.resources.designations, 'create'),
    check('designation_name')
      .isLength({ max: 65 })
      .withMessage('Designations name can be at most 65 characters.'),
  ];

  editDesignation = [
    this.permissions.check(this.resources.designations, 'update'),
    check('designation_name')
      .isLength({ max: 65 })
      .withMessage('Designations name can be at most 65 characters.'),
    check('designation_created_by')
      .isInt()
      .optional(true)
      .withMessage('Designation must be created'),
  ];
}

export default DesignationsValidator;
