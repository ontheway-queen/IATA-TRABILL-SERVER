import { check } from 'express-validator';
import AbstractValidator from '../../../../abstracts/abstract.validators';

class EmployeeValidator extends AbstractValidator {
  readEmployee = [this.permissions.check(this.resources.employee, 'read')];
  deleteEmployee = [
    this.permissions.check(this.resources.employee, 'delete'),
    check('deleted_by')
      .isInt()
      .withMessage('deleted by must be an integer value'),
  ];

  createEmployee = [
    this.permissions.check(this.resources.employee, 'create'),
    check('employee_card_id')
      .notEmpty()
      .isLength({ max: 30 })
      .withMessage('Source title can be at most 30 characters.'),
    check('employee_department_id').isInt().withMessage('enter numeric value'),
    check('employee_designation_id').isInt().withMessage('enter numeric value'),
    check('employee_bloodgroup_id')
      .optional()
      .isInt()
      .withMessage('enter numeric value'),
    check('employee_full_name')
      .notEmpty()
      .isLength({ max: 45 })
      .withMessage('Source title can be at most 45 characters.'),
    check('employee_email')
      .optional()
      .isLength({ max: 75 })
      .withMessage('Source title can be at most 75 characters.'),
    check('employee_mobile')
      .notEmpty()
      .isLength({ max: 20 })
      .withMessage('Source title can be at most 20 characters.'),
    check('employee_birth_date')
      .optional()
      .isDate()
      .withMessage('Enter birth date'),
    check('employee_apppoint_date')
      .optional()
      .isDate()
      .withMessage('Enter appoint date'),
    check('employee_joining_date')
      .optional()
      .isDate()
      .withMessage('Enter joining date'),
    check('employee_address')
      .optional()
      .isLength({ max: 100 })
      .withMessage('Source title can be at most 100 characters'),

    check('employee_created_by')
      .optional()
      .isInt()
      .withMessage('Enter numeric value'),
  ];

  eidtEmployee = [
    this.permissions.check(this.resources.employee, 'update'),
    check('employee_card_id')
      .optional(true)
      .isLength({ max: 30 })
      .withMessage('Source title can be at most 30 characters.'),
    check('employee_department_id')
      .isInt()
      .optional(true)
      .withMessage('enter numeric value'),
    check('employee_designation_id')
      .isInt()
      .optional(true)
      .withMessage('enter numeric value'),
    check('employee_bloodgroup_id')
      .isInt()
      .optional()
      .withMessage('enter numeric value'),
    check('employee_full_name')
      .optional(true)
      .isLength({ max: 45 })
      .withMessage('Source title can be at most 45 characters.'),
    check('employee_email')
      .optional()
      .isLength({ max: 75 })
      .withMessage('Source title can be at most 75 characters.'),
    check('employee_mobile')
      .optional(true)
      .isLength({ max: 20 })
      .withMessage('Source title can be at most 20 characters.'),
    check('employee_birth_date')
      .optional()
      .isDate()
      .withMessage('Enter birth date'),
    check('employee_apppoint_date')
      .optional()
      .isDate()
      .withMessage('Enter appoint date'),
    check('employee_joining_date')
      .optional()
      .isDate()
      .withMessage('Enter joining date'),
    check('employee_address')
      .optional()
      .isLength({ max: 100 })
      .withMessage('Source title can be at most 100 characters'),
  ];
}
export default EmployeeValidator;
