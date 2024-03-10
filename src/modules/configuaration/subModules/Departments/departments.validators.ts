import { check } from 'express-validator';
import AbstractValidator from '../../../../abstracts/abstract.validators';

class DepartmentsValidator extends AbstractValidator {
  readDepartment = [this.permissions.check(this.resources.departments, 'read')];

  deleteDepartment = [
    this.permissions.check(this.resources.departments, 'delete'),
    check('deleted_by')
      .isInt()
      .withMessage('deleted by must be an integer value'),
  ];

  createDepartment = [
    this.permissions.check(this.resources.departments, 'create'),
    check('department_name')
      .isLength({ max: 65 })
      .withMessage('Department name can be at most 65 characters.'),
  ];

  updateDepartment = [
    this.permissions.check(this.resources.departments, 'update'),
    check('department_name')
      .isLength({ max: 65 })
      .withMessage('Department name can be at most 65 characters.'),
  ];
}

export default DepartmentsValidator;
