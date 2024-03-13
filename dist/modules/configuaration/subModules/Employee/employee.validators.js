"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const abstract_validators_1 = __importDefault(require("../../../../abstracts/abstract.validators"));
class EmployeeValidator extends abstract_validators_1.default {
    constructor() {
        super(...arguments);
        this.readEmployee = [this.permissions.check(this.resources.employee, 'read')];
        this.deleteEmployee = [
            this.permissions.check(this.resources.employee, 'delete'),
            (0, express_validator_1.check)('deleted_by')
                .isInt()
                .withMessage('deleted by must be an integer value'),
        ];
        this.createEmployee = [
            this.permissions.check(this.resources.employee, 'create'),
            (0, express_validator_1.check)('employee_card_id')
                .notEmpty()
                .isLength({ max: 30 })
                .withMessage('Source title can be at most 30 characters.'),
            (0, express_validator_1.check)('employee_department_id').isInt().withMessage('enter numeric value'),
            (0, express_validator_1.check)('employee_designation_id').isInt().withMessage('enter numeric value'),
            (0, express_validator_1.check)('employee_bloodgroup_id')
                .optional()
                .isInt()
                .withMessage('enter numeric value'),
            (0, express_validator_1.check)('employee_full_name')
                .notEmpty()
                .isLength({ max: 45 })
                .withMessage('Source title can be at most 45 characters.'),
            (0, express_validator_1.check)('employee_email')
                .optional()
                .isLength({ max: 75 })
                .withMessage('Source title can be at most 75 characters.'),
            (0, express_validator_1.check)('employee_mobile')
                .notEmpty()
                .isLength({ max: 20 })
                .withMessage('Source title can be at most 20 characters.'),
            (0, express_validator_1.check)('employee_birth_date')
                .optional()
                .isDate()
                .withMessage('Enter birth date'),
            (0, express_validator_1.check)('employee_apppoint_date')
                .optional()
                .isDate()
                .withMessage('Enter appoint date'),
            (0, express_validator_1.check)('employee_joining_date')
                .optional()
                .isDate()
                .withMessage('Enter joining date'),
            (0, express_validator_1.check)('employee_address')
                .optional()
                .isLength({ max: 100 })
                .withMessage('Source title can be at most 100 characters'),
            (0, express_validator_1.check)('employee_created_by')
                .optional()
                .isInt()
                .withMessage('Enter numeric value'),
        ];
        this.eidtEmployee = [
            this.permissions.check(this.resources.employee, 'update'),
            (0, express_validator_1.check)('employee_card_id')
                .optional(true)
                .isLength({ max: 30 })
                .withMessage('Source title can be at most 30 characters.'),
            (0, express_validator_1.check)('employee_department_id')
                .isInt()
                .optional(true)
                .withMessage('enter numeric value'),
            (0, express_validator_1.check)('employee_designation_id')
                .isInt()
                .optional(true)
                .withMessage('enter numeric value'),
            (0, express_validator_1.check)('employee_bloodgroup_id')
                .isInt()
                .optional()
                .withMessage('enter numeric value'),
            (0, express_validator_1.check)('employee_full_name')
                .optional(true)
                .isLength({ max: 45 })
                .withMessage('Source title can be at most 45 characters.'),
            (0, express_validator_1.check)('employee_email')
                .optional()
                .isLength({ max: 75 })
                .withMessage('Source title can be at most 75 characters.'),
            (0, express_validator_1.check)('employee_mobile')
                .optional(true)
                .isLength({ max: 20 })
                .withMessage('Source title can be at most 20 characters.'),
            (0, express_validator_1.check)('employee_birth_date')
                .optional()
                .isDate()
                .withMessage('Enter birth date'),
            (0, express_validator_1.check)('employee_apppoint_date')
                .optional()
                .isDate()
                .withMessage('Enter appoint date'),
            (0, express_validator_1.check)('employee_joining_date')
                .optional()
                .isDate()
                .withMessage('Enter joining date'),
            (0, express_validator_1.check)('employee_address')
                .optional()
                .isLength({ max: 100 })
                .withMessage('Source title can be at most 100 characters'),
        ];
    }
}
exports.default = EmployeeValidator;
//# sourceMappingURL=employee.validators.js.map