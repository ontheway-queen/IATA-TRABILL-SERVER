"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const abstract_validators_1 = __importDefault(require("../../../abstracts/abstract.validators"));
class PassportValidator extends abstract_validators_1.default {
    constructor() {
        super(...arguments);
        this.readPassport = [
            this.permissions.check(this.resources.passport_management, 'read'),
        ];
        this.readPassportStatus = [
            this.permissions.check(this.resources.passport_status, 'read'),
        ];
        /**
         * validator for `add passport` router
         */
        this.addPassport = [
            this.permissions.check(this.resources.passport_management, 'create'),
            // check('client_id').notEmpty().withMessage('Client is requierd').isString(),
            (0, express_validator_1.check)('passport_created_by').notEmpty().withMessage('Pleace add user id!'),
            (0, express_validator_1.check)('passport_info.*.passport_no')
                .isLength({ max: 35 })
                .withMessage('Passport no can be at most 35 characters'),
            (0, express_validator_1.check)('passport_info.*.name')
                .isLength({ max: 45 })
                .withMessage('Passport name can be at most 45 characters'),
            (0, express_validator_1.check)('passport_info.*.mobile_no')
                .isLength({ max: 20 })
                .withMessage('Mobile no can be at most 20 characters'),
            (0, express_validator_1.check)('passport_info.*.email')
                .optional()
                .isEmail()
                .withMessage('Email can be at most 75 characters'),
        ];
        /**
         * validator for `edit passport` router
         */
        this.editPassport = [
            this.permissions.check(this.resources.passport_management, 'update'),
            (0, express_validator_1.check)('passport_no')
                .optional()
                .isLength({ max: 35 })
                .withMessage('Passport no can be at most 35 characters'),
            (0, express_validator_1.check)('name')
                .optional()
                .isLength({ max: 45 })
                .withMessage('Passport name can be at most 45 characters'),
            (0, express_validator_1.check)('mobile_no')
                .optional()
                .isLength({ max: 20 })
                .withMessage('Mobile no can be at most 20 characters'),
            (0, express_validator_1.check)('date_of_birth').optional().isISO8601(),
            (0, express_validator_1.check)('date_of_issue').optional().isISO8601(),
            (0, express_validator_1.check)('date_of_expire').optional().isISO8601(),
            (0, express_validator_1.check)('email')
                .optional()
                .isEmail()
                .withMessage('Email can be at most 75 characters'),
        ];
        /**
         * validator for `change passport status` router
         */
        this.changePassport = [
            this.permissions.check(this.resources.passport_status, 'create'),
            (0, express_validator_1.check)('status_title')
                .isLength({ max: 55 })
                .withMessage('Status title can be at most 35 characters'),
            (0, express_validator_1.check)('status_create_date').isDate(),
            (0, express_validator_1.check)('status_sms_content')
                .optional()
                .isLength({ max: 255 })
                .withMessage('Status sms content can be at most 255 characters'),
            (0, express_validator_1.check)('status_sms_content_client')
                .optional()
                .isLength({ max: 255 })
                .withMessage('Status sms content client can be at most 255 characters'),
            (0, express_validator_1.check)('sms_passport_holder').optional().isIn(['true', '']),
            (0, express_validator_1.check)('sms_client').optional().isIn(['true', '']),
        ];
    }
}
exports.default = PassportValidator;
//# sourceMappingURL=passport.validator.js.map