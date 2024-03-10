import { check } from 'express-validator';
import AbstractValidator from '../../../../abstracts/abstract.validators';

class AgencyValidator extends AbstractValidator {
  createAgency = [
    this.permissions.check(this.resources.agency, 'create'),
    check('agency_name')
      .notEmpty()
      .withMessage('Please Enter agency_name')
      .isLength({ max: 95 })
      .withMessage('Source title can be at most 95 characters.'),
    check('agency_created_by')
      .notEmpty()
      .withMessage('Must enter a value')
      .isInt()
      .withMessage('Enter integer value'),
  ];

  updateAgency = [
    this.permissions.check(this.resources.agency, 'update'),
    check('agency_name')
      .isLength({ max: 95 })
      .optional()
      .withMessage('Source title can be at most 95 characters.'),
  ];

  getAllAgencies = [this.permissions.check(this.resources.agency, 'read')];

  deleteAgency = [
    this.permissions.check(this.resources.agency, 'delete'),
    check('deleted_by').isInt().withMessage('Please provide deleted by'),
  ];
}
export default AgencyValidator;
