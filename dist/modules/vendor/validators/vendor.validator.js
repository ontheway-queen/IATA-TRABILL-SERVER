"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const abstract_validators_1 = __importDefault(require("../../../abstracts/abstract.validators"));
const commonVendorPost = [
    (0, express_validator_1.check)('vendor_address')
        .isLength({ max: 255 })
        .withMessage('Source title can be at most 255 characters.')
        .optional(true),
    (0, express_validator_1.check)('vendor_registration_date')
        .notEmpty()
        .isDate()
        .withMessage('Enter vendors registration date'),
    (0, express_validator_1.check)('vendor_name')
        .notEmpty()
        .withMessage('Enter vendors name')
        .isLength({ max: 65 })
        .withMessage('Source title can be at most 65 characters.'),
    (0, express_validator_1.check)('dailCode')
        .isLength({ max: 20 })
        .withMessage('Source title can be at most 20 characters'),
    (0, express_validator_1.check)('number')
        .isLength({ max: 20 })
        .withMessage('Source title can be at most 20 characters'),
    (0, express_validator_1.check)('vendor_email')
        .isLength({ max: 50 })
        .withMessage('Source title can be at most 100 characters')
        .customSanitizer((value) => {
        return value ? value : undefined;
    })
        .isEmail()
        .withMessage('Enter valid email.')
        .optional(true),
    (0, express_validator_1.check)('vendor_opening_balance')
        .isNumeric()
        .withMessage('Enter Numeric value')
        .optional(true),
    (0, express_validator_1.check)('vendor_commission_rate')
        .isNumeric()
        .withMessage('Enter Numeric value')
        .optional(true),
    (0, express_validator_1.check)('vendor_opening_balance_pay_type').optional(true).isString(),
    (0, express_validator_1.check)('vendor_products_id').optional(true).isArray(),
    (0, express_validator_1.check)('vendor_bank_guarantee')
        .customSanitizer((value) => {
        return value ? value : undefined;
    })
        .optional()
        .isDecimal(),
    (0, express_validator_1.check)('vendor_start_date').optional().toDate(),
    (0, express_validator_1.check)('vendor_end_date').optional().toDate(),
];
const commonVendorAdvanceReturn = [
    // check('comb_vendor')
    //   .notEmpty()
    //   .isString()
    //   .withMessage('Combined vendors should be string value.'),
    (0, express_validator_1.check)('advr_payment_type')
        .notEmpty()
        .isInt()
        .withMessage('Pleace provide payment type.'),
    (0, express_validator_1.check)('advance_amount')
        .notEmpty()
        .isFloat()
        .withMessage('Pleace provide advance amount.'),
    (0, express_validator_1.check)('cheque_number')
        .optional()
        .isInt()
        .withMessage('Cheque number should be numeric value.'),
    (0, express_validator_1.check)('cheque_bank_name')
        .isLength({ max: 85 })
        .withMessage('Cheque bank name can be at most 10 characters.'),
    (0, express_validator_1.check)('cheque_bounce_date')
        .isDate()
        .optional(true)
        .withMessage('Cheque bounce date must be a valid date.'),
    (0, express_validator_1.check)('cheque_return_date')
        .isDate()
        .optional(true)
        .withMessage('Cheque return date must be a valid date.'),
    (0, express_validator_1.check)('note')
        .isLength({ max: 255 })
        .optional(true)
        .withMessage('Cheque return note can be at most 255 characters.'),
    (0, express_validator_1.check)('advr_created_by')
        .notEmpty()
        .withMessage('Please provide advr created by')
        .isInt()
        .withMessage('advr created by must be an integer value'),
];
const commonVendorPayment = [
    (0, express_validator_1.check)('vpay_payment_to')
        .notEmpty()
        .isIn(['INVOICE', 'VENDOR'])
        .withMessage('Vendor payment to should be invoice or vendor'),
    (0, express_validator_1.check)('invoice_id').optional().isInt().withMessage('Invoice id is required'),
    (0, express_validator_1.check)('account_id').isInt().withMessage('Enter account id').optional(),
    (0, express_validator_1.check)('payment_method_id')
        .isInt()
        .withMessage('Enter numeric value')
        .notEmpty(),
    (0, express_validator_1.check)('payment_amount').notEmpty().withMessage('Payment amunt is required'),
    (0, express_validator_1.check)('online_charge').optional(),
    (0, express_validator_1.check)('vendor_ait').optional(),
    (0, express_validator_1.check)('vpay_has_refered_passport')
        .optional()
        .isIn(['YES', 'NO'])
        .withMessage('Enter YES or NO'),
    (0, express_validator_1.check)('note')
        .isLength({ max: 255 })
        .optional(true)
        .withMessage('Cheque return note can be at most 255 characters.'),
    (0, express_validator_1.check)('vpay_creadit_card_no')
        .optional()
        .isInt()
        .withMessage('Must be an integer value')
        .toInt(),
];
class VendorValidator extends abstract_validators_1.default {
    constructor() {
        super(...arguments);
        this.commonRead = [this.permissions.check(this.resources.vendors, 'read')];
        this.commonUpdate = [this.permissions.check(this.resources.vendors, 'update')];
        this.commonDelete = [this.permissions.check(this.resources.vendors, 'delete')];
        this.addVendor = [
            this.permissions.check(this.resources.vendors, 'create'),
            ...commonVendorPost,
            (0, express_validator_1.check)('vendor_created_by').isNumeric(),
        ];
        this.editVendor = [
            this.permissions.check(this.resources.vendors, 'update'),
            ...commonVendorPost,
            (0, express_validator_1.check)('vendor_updated_by')
                .isNumeric()
                .notEmpty()
                .withMessage('Vendor updated user id is required'),
        ];
        this.addAdvanceReturn = [
            this.permissions.check(this.resources.vendor_advr, 'create'),
            ...commonVendorAdvanceReturn,
        ];
        this.editAdvanceReturn = [
            this.permissions.check(this.resources.vendor_advr, 'update'),
            ...commonVendorAdvanceReturn,
        ];
        this.updatedAdvanceReturnCheque = [
            this.permissions.check(this.resources.vendor_advr, 'update'),
            (0, express_validator_1.check)('updated_by')
                .notEmpty()
                .withMessage('Please provide how updated the cheque status')
                .isInt()
                .withMessage('updated by must be an integer value'),
        ];
        this.addVendorPayment = [
            this.permissions.check(this.resources.vendors, 'create'),
            ...commonVendorPayment,
            (0, express_validator_1.check)('created_by')
                .notEmpty()
                .withMessage('Vendor pay created user id is required'),
        ];
        this.editVendorPayment = [
            this.permissions.check(this.resources.vendors, 'update'),
            ...commonVendorPayment,
            (0, express_validator_1.check)('created_by')
                .notEmpty()
                .withMessage('Vendor pay updated user id is required'),
        ];
    }
}
exports.default = VendorValidator;
//# sourceMappingURL=vendor.validator.js.map