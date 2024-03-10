import { check } from 'express-validator';
import AbstractValidator from '../../../abstracts/abstract.validators';

const commonVendorPost = [
  check('vendor_address')
    .isLength({ max: 255 })
    .withMessage('Source title can be at most 255 characters.')
    .optional(true),
  check('vendor_registration_date')
    .notEmpty()
    .isDate()
    .withMessage('Enter vendors registration date'),

  check('vendor_name')
    .notEmpty()
    .withMessage('Enter vendors name')
    .isLength({ max: 65 })
    .withMessage('Source title can be at most 65 characters.'),

  check('dailCode')
    .isLength({ max: 20 })
    .withMessage('Source title can be at most 20 characters'),
  check('number')
    .isLength({ max: 20 })
    .withMessage('Source title can be at most 20 characters'),

  check('vendor_email')
    .isLength({ max: 50 })
    .withMessage('Source title can be at most 100 characters')
    .customSanitizer((value) => {
      return value ? value : undefined;
    })
    .isEmail()
    .withMessage('Enter valid email.')
    .optional(true),

  check('vendor_opening_balance')
    .isNumeric()
    .withMessage('Enter Numeric value')
    .optional(true),

  check('vendor_commission_rate')
    .isNumeric()
    .withMessage('Enter Numeric value')
    .optional(true),
  check('vendor_opening_balance_pay_type').optional(true).isString(),
  check('vendor_products_id').optional(true).isArray(),
  check('vendor_bank_guarantee')
    .customSanitizer((value) => {
      return value ? value : undefined;
    })
    .optional()
    .isDecimal(),
  check('vendor_start_date').optional().toDate(),
  check('vendor_end_date').optional().toDate(),
];

const commonVendorAdvanceReturn = [
  // check('comb_vendor')
  //   .notEmpty()
  //   .isString()
  //   .withMessage('Combined vendors should be string value.'),

  check('advr_payment_type')
    .notEmpty()
    .isInt()
    .withMessage('Pleace provide payment type.'),

  check('advance_amount')
    .notEmpty()
    .isFloat()
    .withMessage('Pleace provide advance amount.'),

  check('cheque_number')
    .optional()
    .isInt()
    .withMessage('Cheque number should be numeric value.'),

  check('cheque_bank_name')
    .isLength({ max: 85 })
    .withMessage('Cheque bank name can be at most 10 characters.'),

  check('cheque_bounce_date')
    .isDate()
    .optional(true)
    .withMessage('Cheque bounce date must be a valid date.'),
  check('cheque_return_date')
    .isDate()
    .optional(true)
    .withMessage('Cheque return date must be a valid date.'),

  check('note')
    .isLength({ max: 255 })
    .optional(true)
    .withMessage('Cheque return note can be at most 255 characters.'),
  check('advr_created_by')
    .notEmpty()
    .withMessage('Please provide advr created by')
    .isInt()
    .withMessage('advr created by must be an integer value'),
];

const commonVendorPayment = [
  check('vpay_payment_to')
    .notEmpty()
    .isIn(['INVOICE', 'VENDOR'])
    .withMessage('Vendor payment to should be invoice or vendor'),
  check('invoice_id').optional().isInt().withMessage('Invoice id is required'),
  check('account_id').isInt().withMessage('Enter account id').optional(),

  check('payment_method_id')
    .isInt()
    .withMessage('Enter numeric value')
    .notEmpty(),

  check('payment_amount').notEmpty().withMessage('Payment amunt is required'),

  check('online_charge').optional(),

  check('vendor_ait').optional(),

  check('vpay_has_refered_passport')
    .optional()
    .isIn(['YES', 'NO'])
    .withMessage('Enter YES or NO'),

  check('note')
    .isLength({ max: 255 })
    .optional(true)
    .withMessage('Cheque return note can be at most 255 characters.'),
  check('vpay_creadit_card_no')
    .optional()
    .isInt()
    .withMessage('Must be an integer value')
    .toInt(),
];

class VendorValidator extends AbstractValidator {
  commonRead = [this.permissions.check(this.resources.vendors, 'read')];

  commonUpdate = [this.permissions.check(this.resources.vendors, 'update')];

  commonDelete = [this.permissions.check(this.resources.vendors, 'delete')];

  addVendor = [
    this.permissions.check(this.resources.vendors, 'create'),
    ...commonVendorPost,
    check('vendor_created_by').isNumeric(),
  ];

  editVendor = [
    this.permissions.check(this.resources.vendors, 'update'),
    ...commonVendorPost,
    check('vendor_updated_by')
      .isNumeric()
      .notEmpty()
      .withMessage('Vendor updated user id is required'),
  ];

  addAdvanceReturn = [
    this.permissions.check(this.resources.vendor_advr, 'create'),

    ...commonVendorAdvanceReturn,
  ];

  editAdvanceReturn = [
    this.permissions.check(this.resources.vendor_advr, 'update'),

    ...commonVendorAdvanceReturn,
  ];

  updatedAdvanceReturnCheque = [
    this.permissions.check(this.resources.vendor_advr, 'update'),
    check('updated_by')
      .notEmpty()
      .withMessage('Please provide how updated the cheque status')
      .isInt()
      .withMessage('updated by must be an integer value'),
  ];

  addVendorPayment = [
    this.permissions.check(this.resources.vendors, 'create'),
    ...commonVendorPayment,

    check('created_by')
      .notEmpty()
      .withMessage('Vendor pay created user id is required'),
  ];

  editVendorPayment = [
    this.permissions.check(this.resources.vendors, 'update'),

    ...commonVendorPayment,

    check('created_by')
      .notEmpty()
      .withMessage('Vendor pay updated user id is required'),
  ];
}

export default VendorValidator;
