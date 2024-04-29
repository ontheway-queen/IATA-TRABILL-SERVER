import { check } from 'express-validator';
import AbstractValidator from '../../../abstracts/abstract.validators';

class PassportValidator extends AbstractValidator {
  readPassport = [
    this.permissions.check(this.resources.passport_management, 'read'),
  ];

  readPassportStatus = [
    this.permissions.check(this.resources.passport_status, 'read'),
  ];

  /**
   * validator for `add passport` router
   */
  addPassport = [
    this.permissions.check(this.resources.passport_management, 'create'),

    // check('client_id').notEmpty().withMessage('Client is requierd').isString(),
    check('passport_created_by').notEmpty().withMessage('Please add user id!'),

    check('passport_info.*.passport_no')
      .isLength({ max: 35 })
      .withMessage('Passport no can be at most 35 characters'),
    check('passport_info.*.name')
      .isLength({ max: 45 })
      .withMessage('Passport name can be at most 45 characters'),
    check('passport_info.*.mobile_no')
      .isLength({ max: 20 })
      .withMessage('Mobile no can be at most 20 characters'),

    check('passport_info.*.email')
      .optional()
      .isEmail()
      .withMessage('Email can be at most 75 characters'),
  ];

  /**
   * validator for `edit passport` router
   */
  editPassport = [
    this.permissions.check(this.resources.passport_management, 'update'),
    check('passport_no')
      .optional()
      .isLength({ max: 35 })
      .withMessage('Passport no can be at most 35 characters'),
    check('name')
      .optional()
      .isLength({ max: 45 })
      .withMessage('Passport name can be at most 45 characters'),
    check('mobile_no')
      .optional()
      .isLength({ max: 20 })
      .withMessage('Mobile no can be at most 20 characters'),
    check('date_of_birth').optional().isISO8601(),
    check('date_of_issue').optional().isISO8601(),
    check('date_of_expire').optional().isISO8601(),
    check('email')
      .optional()
      .isEmail()
      .withMessage('Email can be at most 75 characters'),
  ];

  /**
   * validator for `change passport status` router
   */
  changePassport = [
    this.permissions.check(this.resources.passport_status, 'create'),
    check('status_title')
      .isLength({ max: 55 })
      .withMessage('Status title can be at most 35 characters'),
    check('status_create_date').isDate(),
    check('status_sms_content')
      .optional()
      .isLength({ max: 255 })
      .withMessage('Status sms content can be at most 255 characters'),
    check('status_sms_content_client')
      .optional()
      .isLength({ max: 255 })
      .withMessage('Status sms content client can be at most 255 characters'),
    check('sms_passport_holder').optional().isIn(['true', '']),
    check('sms_client').optional().isIn(['true', '']),
  ];
}

export default PassportValidator;
