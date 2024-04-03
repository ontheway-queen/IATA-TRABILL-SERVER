import { check, param } from 'express-validator';
import AbstractValidator from '../../../abstracts/abstract.validators';

class AdminPanelValidators extends AbstractValidator {
  readAll = [this.permissions.check(this.resources.agency, 'read')];
  commonRead = [this.permissions.check(this.resources.agency, 'read')];
  commonEdit = [this.permissions.check(this.resources.agency, 'update')];
  commonCreate = [this.permissions.check(this.resources.agency, 'create')];
  commonDelete = [this.permissions.check(this.resources.agency, 'delete')];
  deleteOrgAgency = [
    this.permissions.check(this.resources.agency, 'delete'),
    check('agency_id').notEmpty().withMessage('Agency id cannot be empty'),
  ];

  deleteAdminAgency = [
    this.permissions.check(this.resources.agency, 'delete'),
    check('deleted_by')
      .notEmpty()
      .withMessage('Please provide who delete agency')
      .isInt()
      .withMessage('deleted_by must be an integer value'),
  ];

  checkIsUnique = [
    check('search_type')
      .isIn(['username', 'agency-email'])
      .withMessage('Your search type is incorrect!'),
    check('search_text')
      .notEmpty()
      .withMessage('Please add search_text')
      .trim(),
  ];
  updateActivity = [
    check('org_subscription_expired')
      .optional()
      .customSanitizer((value) => {
        return value ? value : undefined;
      })
      .toDate(),
  ];
  resetAgencyPassword = [
    check('agency_email')
      .notEmpty()
      .withMessage('Please provide email address')
      .isEmail(),
    check('new_password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/^(?=.*[!@#$%^&*])(?=.*\d)/)
      .withMessage(
        'Password must contain at least one special character and one number'
      ),
  ];

  createModules = [
    check('module_name').notEmpty().withMessage('Module name is required'),
    check('module_created_by').notEmpty().withMessage('Please provide user id'),
    check('module_status')
      .notEmpty()
      .withMessage('Status is required')
      .isIn([0, 1])
      .withMessage('Module status must be 0 or 1'),
  ];

  createAgency = [
    check('user_first_name')
      .notEmpty()
      .withMessage('User first name is required'),

    check('org_subscription_expired')
      .notEmpty()
      .withMessage('Please add agency expired date')
      .toDate(),
  ];

  updateAgency = [
    check('org_name')
      .notEmpty()
      .withMessage('Organization name is required')
      .isString(),
    check('user_first_name')
      .notEmpty()
      .withMessage('User first name is required'),
    check('org_subscription_expired')
      .notEmpty()
      .withMessage('Please add agency expired date')
      .toDate(),

    check('org_owner_email')
      .notEmpty()
      .withMessage('Organization owner email is required')
      .customSanitizer((value) => {
        return value.replace(/\s/g, '');
      })
      .isEmail()
      .withMessage('Please provide a valid email'),

    check('org_address1')
      .notEmpty()
      .withMessage('Organization address is required'),

    check('org_facebook')
      .optional()
      .customSanitizer((value) => {
        return value ? value : undefined;
      })
      .isString(),

    check('org_website')
      .optional()
      .customSanitizer((value) => {
        return value ? value : undefined;
      })
      .isString(),

    check('org_mobile_number')
      .isLength({ max: 255 })
      .withMessage('Mobile number maximum 255 character will take')
      .notEmpty()
      .withMessage('Mobile number is required'),

    check('password')
      .optional()
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/^(?=.*[!@#$%^&*])(?=.*\d)/)
      .withMessage(
        'Password must contain at least one special character and one number'
      ),

    check('current_password')
      .optional()
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/^(?=.*[!@#$%^&*])(?=.*\d)/)
      .withMessage(
        'Password must contain at least one special character and one number'
      ),

    check('modules_id')
      .notEmpty()
      .withMessage('Modules id is required')
      .isArray()
      .withMessage('Module id must be is array'),
  ];

  updateSalesInfo = [check('sbcript_sales_date').optional().toDate()];

  loginUser = [
    check('username').notEmpty().withMessage('Enter your username'),
    check('password').notEmpty().withMessage('Enter your password'),
  ];

  forgotUsernameOrPass = [
    check('email')
      .notEmpty()
      .withMessage('Please provide your email')
      .isEmail()
      .withMessage('Please provide a valid email format'),
  ];

  verifyOtpChangeUsernamePass = [
    check('otp').notEmpty().withMessage('Please provide OTP'),
    check('email')
      .notEmpty()
      .withMessage('Please provide your email')
      .isEmail()
      .withMessage('Please provide a valid email format'),
    check('password')
      .optional()
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/^(?=.*[!@#$%^&*])(?=.*\d)/)
      .withMessage(
        'Password must contain at least one special character and one number'
      ),
  ];

  // CONFIG
  createClientCategory = [
    check('category_title').notEmpty(),
    check('category_prefix').notEmpty(),
  ];
  deleteClientCate = [check('category_id').notEmpty().toInt()];

  createTrabillSalesman = [
    check('salesman_name').notEmpty().withMessage('Please enter salesman name'),
    check('salesman_number').optional(),
    check('salesman_email')
      .optional()
      .isEmail()
      .withMessage('Please provide a valid email'),
  ];
  updateTrabillSalesman = [
    check('salesman_name').notEmpty().withMessage('Please enter salesman name'),
    check('salesman_number').optional(),
    check('salesman_email')
      .optional()
      .isEmail()
      .withMessage('Please provide a valid email'),
  ];

  addNotice = [
    check('ntc_txt').notEmpty().withMessage('Please provide notice text'),
  ];

  updateAgencyProfile = [
    check('org_name').optional().isString(),
    check('org_owner_full_name').optional().isString(),
    check('org_owner_email')
      .isEmail()
      .withMessage('Please provide a valid email')
      .optional(),
    check('org_address1').isString().optional(),
    check('org_address2').isString().optional(),
    check('org_dial_code').optional().isString(),
    check('org_mobile_number').isInt().optional(),
    check('org_facebook').isString().optional(),
    check('org_website').isString().optional(),
    check('org_extra_info').isString().optional(),
  ];
}

export default AdminPanelValidators;
