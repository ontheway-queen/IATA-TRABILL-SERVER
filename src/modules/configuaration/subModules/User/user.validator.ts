import { check } from 'express-validator';
import AbstractValidator from '../../../../abstracts/abstract.validators';

class UserValidator extends AbstractValidator {
  readRole = [];

  commonModule = [];

  createRole = [
    // this.permissions.check(this.resources.users, "create"),
    check('role_name')
      .isString()
      .notEmpty()
      .withMessage('Please provide Role Name'),
    check('role_permissions')
      .isString()
      .notEmpty()
      .withMessage('Please provide Role Persimissions'),
    check('role_status')
      .optional()
      .isIn([0, 1])
      .withMessage('Please provide either `0` or `1` for Role status'),
    check('user_role')
      .notEmpty()
      .withMessage('Please enter user_role')
      .isIn(['EMPLOYEE', 'ACCOUNT', 'ADMIN'])
      .withMessage('user_role must be in EMPLOYEE | ACCOUNT |  ADMIN'),
  ];

  createUser = [
    check('user_role_id').isInt().withMessage('Role id must be integer'),

    check('user_first_name')
      .isString()
      .notEmpty()
      .withMessage('Please add your first name'),

    check('user_last_name')
      .optional()
      .isString()
      .withMessage('Please add your last name'),

    check('user_email')
      .optional()
      .customSanitizer((value) => {
        return value === null ? undefined : value.replace(/\s/g, '');
      })
      .isEmail(),

    check('user_dial_code')
      .optional()
      .customSanitizer((value) => (value === null ? undefined : value)),

    check('user_mobile')
      .optional()
      .customSanitizer((value) => (value === null ? undefined : value)),

    check('user_username')
      .isString()
      .notEmpty()
      .withMessage('Please add your user name')
      .customSanitizer((value) => {
        return value.replace(/\s/g, '');
      }),
    check('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long'),
  ];
  updateUser = [
    // this.permissions.check(this.resources.users, "update"),

    check('user_role_id').isInt().withMessage('Role id must be integer'),

    check('user_first_name')
      .isString()
      .notEmpty()
      .withMessage('Please add your first name'),

    check('user_last_name')
      .optional()
      .isString()
      .withMessage('Please add your last name'),

    check('user_email')
      .optional()
      .customSanitizer((value) => (value === null ? undefined : value))
      .isEmail(),

    check('user_dial_code')
      .optional()
      .customSanitizer((value) => (value === null ? undefined : value)),

    check('user_mobile')
      .optional()
      .customSanitizer((value) => (value === null ? undefined : value)),

    check('user_username')
      .isString()
      .notEmpty()
      .withMessage('Please add your user name'),
  ];
  deleteUser = [];
  resetPassword = [
    // this.permissions.check(this.resources.users, "update"),
    check('current_password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long'),
    check('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long'),
  ];
}

export default UserValidator;
