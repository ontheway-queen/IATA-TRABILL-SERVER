"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const abstract_validators_1 = __importDefault(require("../../../abstracts/abstract.validators"));
class AdminPanelValidators extends abstract_validators_1.default {
    constructor() {
        super(...arguments);
        this.readAll = [this.permissions.check(this.resources.agency, 'read')];
        this.commonRead = [this.permissions.check(this.resources.agency, 'read')];
        this.commonEdit = [this.permissions.check(this.resources.agency, 'update')];
        this.commonCreate = [this.permissions.check(this.resources.agency, 'create')];
        this.commonDelete = [this.permissions.check(this.resources.agency, 'delete')];
        this.deleteOrgAgency = [
            this.permissions.check(this.resources.agency, 'delete'),
            (0, express_validator_1.check)('agency_id').notEmpty().withMessage('Agency id cannot be empty'),
        ];
        this.deleteAdminAgency = [
            this.permissions.check(this.resources.agency, 'delete'),
            (0, express_validator_1.check)('deleted_by')
                .notEmpty()
                .withMessage('Please provide who delete agency')
                .isInt()
                .withMessage('deleted_by must be an integer value'),
        ];
        this.checkIsUnique = [
            (0, express_validator_1.check)('search_type')
                .isIn(['username', 'agency-email'])
                .withMessage('Your search type is incorrect!'),
            (0, express_validator_1.check)('search_text')
                .notEmpty()
                .withMessage('Please add search_text')
                .trim(),
        ];
        this.updateActivity = [
            (0, express_validator_1.check)('org_subscription_expired')
                .optional()
                .customSanitizer((value) => {
                return value ? value : undefined;
            })
                .toDate(),
        ];
        this.resetAgencyPassword = [
            (0, express_validator_1.check)('agency_email')
                .notEmpty()
                .withMessage('Please provide email address')
                .isEmail(),
            (0, express_validator_1.check)('new_password')
                .isLength({ min: 8 })
                .withMessage('Password must be at least 8 characters long')
                .matches(/^(?=.*[!@#$%^&*])(?=.*\d)/)
                .withMessage('Password must contain at least one special character and one number'),
        ];
        this.createModules = [
            (0, express_validator_1.check)('module_name').notEmpty().withMessage('Module name is required'),
            (0, express_validator_1.check)('module_created_by').notEmpty().withMessage('Please provide user id'),
            (0, express_validator_1.check)('module_status')
                .notEmpty()
                .withMessage('Status is required')
                .isIn([0, 1])
                .withMessage('Module status must be 0 or 1'),
        ];
        this.createAgency = [
            (0, express_validator_1.check)('user_first_name')
                .notEmpty()
                .withMessage('User first name is required'),
            (0, express_validator_1.check)('org_subscription_expired')
                .notEmpty()
                .withMessage('Please add agency expired date')
                .toDate(),
        ];
        this.updateAgency = [
            (0, express_validator_1.check)('org_name')
                .notEmpty()
                .withMessage('Organization name is required')
                .isString(),
            (0, express_validator_1.check)('user_first_name')
                .notEmpty()
                .withMessage('User first name is required'),
            (0, express_validator_1.check)('org_subscription_expired')
                .notEmpty()
                .withMessage('Please add agency expired date')
                .toDate(),
            (0, express_validator_1.check)('org_owner_email')
                .notEmpty()
                .withMessage('Organization owner email is required')
                .customSanitizer((value) => {
                return value.replace(/\s/g, '');
            })
                .isEmail()
                .withMessage('Please provide a valid email'),
            (0, express_validator_1.check)('org_address1')
                .notEmpty()
                .withMessage('Organization address is required'),
            (0, express_validator_1.check)('org_facebook')
                .optional()
                .customSanitizer((value) => {
                return value ? value : undefined;
            })
                .isString(),
            (0, express_validator_1.check)('org_website')
                .optional()
                .customSanitizer((value) => {
                return value ? value : undefined;
            })
                .isString(),
            (0, express_validator_1.check)('org_mobile_number')
                .isLength({ max: 255 })
                .withMessage('Mobile number maximum 255 character will take')
                .notEmpty()
                .withMessage('Mobile number is required'),
            (0, express_validator_1.check)('password')
                .optional()
                .isLength({ min: 8 })
                .withMessage('Password must be at least 8 characters long')
                .matches(/^(?=.*[!@#$%^&*])(?=.*\d)/)
                .withMessage('Password must contain at least one special character and one number'),
            (0, express_validator_1.check)('current_password')
                .optional()
                .isLength({ min: 8 })
                .withMessage('Password must be at least 8 characters long')
                .matches(/^(?=.*[!@#$%^&*])(?=.*\d)/)
                .withMessage('Password must contain at least one special character and one number'),
            (0, express_validator_1.check)('modules_id')
                .notEmpty()
                .withMessage('Modules id is required')
                .isArray()
                .withMessage('Module id must be is array'),
        ];
        this.updateSalesInfo = [(0, express_validator_1.check)('sbcript_sales_date').optional().toDate()];
        this.loginUser = [
            (0, express_validator_1.check)('username').notEmpty().withMessage('Enter your username'),
            (0, express_validator_1.check)('password').notEmpty().withMessage('Enter your password'),
        ];
        this.forgotUsernameOrPass = [
            (0, express_validator_1.check)('email')
                .notEmpty()
                .withMessage('Please provide your email')
                .isEmail()
                .withMessage('Please provide a valid email format'),
        ];
        this.verifyOtpChangeUsernamePass = [
            (0, express_validator_1.check)('otp').notEmpty().withMessage('Please provide OTP'),
            (0, express_validator_1.check)('email')
                .notEmpty()
                .withMessage('Please provide your email')
                .isEmail()
                .withMessage('Please provide a valid email format'),
            (0, express_validator_1.check)('password')
                .optional()
                .isLength({ min: 8 })
                .withMessage('Password must be at least 8 characters long')
                .matches(/^(?=.*[!@#$%^&*])(?=.*\d)/)
                .withMessage('Password must contain at least one special character and one number'),
        ];
        // CONFIG
        this.createClientCategory = [
            (0, express_validator_1.check)('category_title').notEmpty(),
            (0, express_validator_1.check)('category_prefix').notEmpty(),
        ];
        this.deleteClientCate = [(0, express_validator_1.check)('category_id').notEmpty().toInt()];
        this.createTrabillSalesman = [
            (0, express_validator_1.check)('salesman_name').notEmpty().withMessage('Please enter salesman name'),
            (0, express_validator_1.check)('salesman_number').optional(),
            (0, express_validator_1.check)('salesman_email')
                .optional()
                .isEmail()
                .withMessage('Please provide a valid email'),
        ];
        this.updateTrabillSalesman = [
            (0, express_validator_1.check)('salesman_name').notEmpty().withMessage('Please enter salesman name'),
            (0, express_validator_1.check)('salesman_number').optional(),
            (0, express_validator_1.check)('salesman_email')
                .optional()
                .isEmail()
                .withMessage('Please provide a valid email'),
        ];
        this.addNotice = [
            (0, express_validator_1.check)('ntc_txt').notEmpty().withMessage('Please provide notice text'),
        ];
    }
}
exports.default = AdminPanelValidators;
//# sourceMappingURL=adminPanel.validators.js.map