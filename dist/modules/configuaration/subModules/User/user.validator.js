"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const abstract_validators_1 = __importDefault(require("../../../../abstracts/abstract.validators"));
class UserValidator extends abstract_validators_1.default {
    constructor() {
        super(...arguments);
        this.readRole = [];
        this.commonModule = [];
        this.createRole = [
            // this.permissions.check(this.resources.users, "create"),
            (0, express_validator_1.check)('role_name')
                .isString()
                .notEmpty()
                .withMessage('Please provide Role Name'),
            (0, express_validator_1.check)('role_permissions')
                .isString()
                .notEmpty()
                .withMessage('Please provide Role Persimissions'),
            (0, express_validator_1.check)('role_status')
                .optional()
                .isIn([0, 1])
                .withMessage('Please provide either `0` or `1` for Role status'),
            (0, express_validator_1.check)('user_role')
                .notEmpty()
                .withMessage('Please enter user_role')
                .isIn(['EMPLOYEE', 'ACCOUNT', 'ADMIN'])
                .withMessage('user_role must be in EMPLOYEE | ACCOUNT |  ADMIN'),
        ];
        this.createUser = [
            (0, express_validator_1.check)('user_role_id').isInt().withMessage('Role id must be integer'),
            (0, express_validator_1.check)('user_first_name')
                .isString()
                .notEmpty()
                .withMessage('Please add your first name'),
            (0, express_validator_1.check)('user_last_name')
                .optional()
                .isString()
                .withMessage('Please add your last name'),
            (0, express_validator_1.check)('user_email')
                .optional()
                .customSanitizer((value) => {
                return value === null ? undefined : value.replace(/\s/g, '');
            })
                .isEmail(),
            (0, express_validator_1.check)('user_dial_code')
                .optional()
                .customSanitizer((value) => (value === null ? undefined : value)),
            (0, express_validator_1.check)('user_mobile')
                .optional()
                .customSanitizer((value) => (value === null ? undefined : value)),
            (0, express_validator_1.check)('user_username')
                .isString()
                .notEmpty()
                .withMessage('Please add your user name')
                .customSanitizer((value) => {
                return value.replace(/\s/g, '');
            }),
            (0, express_validator_1.check)('password')
                .isLength({ min: 8 })
                .withMessage('Password must be at least 8 characters long'),
        ];
        this.updateUser = [
            // this.permissions.check(this.resources.users, "update"),
            (0, express_validator_1.check)('user_role_id').isInt().withMessage('Role id must be integer'),
            (0, express_validator_1.check)('user_first_name')
                .isString()
                .notEmpty()
                .withMessage('Please add your first name'),
            (0, express_validator_1.check)('user_last_name')
                .optional()
                .isString()
                .withMessage('Please add your last name'),
            (0, express_validator_1.check)('user_email')
                .optional()
                .customSanitizer((value) => (value === null ? undefined : value))
                .isEmail(),
            (0, express_validator_1.check)('user_dial_code')
                .optional()
                .customSanitizer((value) => (value === null ? undefined : value)),
            (0, express_validator_1.check)('user_mobile')
                .optional()
                .customSanitizer((value) => (value === null ? undefined : value)),
            (0, express_validator_1.check)('user_username')
                .isString()
                .notEmpty()
                .withMessage('Please add your user name'),
        ];
        this.deleteUser = [];
        this.resetPassword = [
            // this.permissions.check(this.resources.users, "update"),
            (0, express_validator_1.check)('current_password')
                .isLength({ min: 8 })
                .withMessage('Password must be at least 8 characters long'),
            (0, express_validator_1.check)('password')
                .isLength({ min: 8 })
                .withMessage('Password must be at least 8 characters long'),
        ];
    }
}
exports.default = UserValidator;
//# sourceMappingURL=user.validator.js.map