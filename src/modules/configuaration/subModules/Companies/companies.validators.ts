import { check } from 'express-validator';
import AbstractValidator from '../../../../abstracts/abstract.validators';

class CompaniesValidator extends AbstractValidator {
  readCompanies = [this.permissions.check(this.resources.companies, 'read')];
  deleleCompanies = [
    this.permissions.check(this.resources.companies, 'delete'),
    check('deleted_by')
      .isInt()
      .withMessage('deleted by must be an integer value'),
  ];

  createCompanies = [
    this.permissions.check(this.resources.companies, 'create'),
    check('company_name')
      .notEmpty()
      .withMessage('Enter company name')
      .isLength({ max: 75 })
      .withMessage('Source title can be at most 75 characters.'),
    check('company_contact_person')
      .optional()
      .isLength({ max: 75 })
      .withMessage('Source title can be at most 75 characters.'),
    check('company_designation')
      .optional()
      .isLength({ max: 50 })
      .withMessage('Enter company designation')
      .withMessage('Source title can be at most 50 characters.'),
    check('company_phone')
      .optional()
      .isLength({ max: 20 })
      .withMessage('Source title can be at most 20 characters'),
    check('company_address')
      .optional()
      .isLength({ max: 255 })
      .withMessage('enter company address')
      .withMessage('Source title can be at most 255 characters.'),
    check('company_created_by')
      .notEmpty()
      .withMessage('must enter integer value')
      .isInt()
      .withMessage('must enter integer value'),
  ];

  editCompanies = [
    this.permissions.check(this.resources.companies, 'update'),
    check('company_name')
      .optional(true)
      .isLength({ max: 75 })
      .withMessage('Source title can be at most 75 characters.'),
    check('company_contact_person')
      .optional(true)
      .isLength({ max: 75 })
      .withMessage('Source title can be at most 75 characters.'),
    check('company_designation')
      .optional(true)
      .isLength({ max: 50 })
      .withMessage('Source title can be at most 50 characters.'),
    check('company_phone')
      .optional(true)
      .isLength({ max: 20 })
      .withMessage('Source title can be at most 20 characters'),
    check('company_address')
      .optional(true)
      .isLength({ max: 255 })
      .withMessage('Source title can be at most 255 characters.'),
  ];
}
export default CompaniesValidator;
