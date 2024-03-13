"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const abstract_validators_1 = __importDefault(require("../../../abstracts/abstract.validators"));
class PayrollValidator extends abstract_validators_1.default {
    constructor() {
        super(...arguments);
        this.readPayroll = [this.permissions.check(this.resources.payroll, 'read')];
        this.createPayroll = [
            this.permissions.check(this.resources.payroll, 'create'),
            (0, express_validator_1.check)('payroll_employee_id')
                .isInt()
                .withMessage('Must be an integer value'),
            (0, express_validator_1.check)('payroll_account_id')
                .optional()
                .isInt()
                .withMessage('Must be an integer value'),
            (0, express_validator_1.check)('payroll_pay_type').isInt().withMessage('Must be an integer value'),
            (0, express_validator_1.check)('payroll_salary').optional(),
            (0, express_validator_1.check)('payroll_net_amount').isInt().withMessage('Must be an integer value'),
            (0, express_validator_1.check)('payroll_date')
                .isString()
                .withMessage('Must be a string value')
                .toDate(),
            (0, express_validator_1.check)('payroll_created_by').isInt().withMessage('must be integer value'),
            (0, express_validator_1.check)('cheque_withdraw_date').toDate(),
            (0, express_validator_1.check)('payroll_deductions.*.pd_amount').isDecimal().optional(),
            (0, express_validator_1.check)('payroll_deductions.*.pd_reason').isString().optional(),
            (0, express_validator_1.check)('payroll_other1').isString().optional(),
            (0, express_validator_1.check)('payroll_other2').isString().optional(),
            (0, express_validator_1.check)('payroll_other3').isString().optional(),
        ];
        this.updatePayroll = [
            this.permissions.check(this.resources.payroll, 'update'),
            (0, express_validator_1.check)('payroll_employee_id')
                .toInt()
                .isInt()
                .withMessage('Must be an integer value'),
            (0, express_validator_1.check)('payroll_account_id')
                .optional()
                .isInt()
                .withMessage('Must be an integer value'),
            (0, express_validator_1.check)('payroll_pay_type').isInt().withMessage('Must be an integer value'),
            (0, express_validator_1.check)('payroll_salary').optional(),
            (0, express_validator_1.check)('payroll_net_amount')
                .isFloat()
                .withMessage('Must be an integer value'),
            (0, express_validator_1.check)('payroll_date').toDate(),
            (0, express_validator_1.check)('payroll_updated_by').isInt().withMessage('must be integer value'),
            (0, express_validator_1.check)('cheque_withdraw_date').toDate(),
            (0, express_validator_1.check)('payroll_deductions.*.pd_id').isInt().optional(),
            (0, express_validator_1.check)('payroll_deductions.*.pd_amount').isDecimal().optional(),
            (0, express_validator_1.check)('payroll_deductions.*.pd_reason').isString().optional(),
            (0, express_validator_1.check)('payroll_deductions.*.is_deleted').isInt().isIn([0, 1]).optional(),
            (0, express_validator_1.check)('payroll_other1').isString().optional(),
            (0, express_validator_1.check)('payroll_other2').isString().optional(),
            (0, express_validator_1.check)('payroll_other3').isString().optional(),
        ];
        this.deletePayroll = [
            this.permissions.check(this.resources.payroll, 'delete'),
            (0, express_validator_1.check)('payroll_deleted_by').isInt().withMessage('Must be an Integer value'),
        ];
        this.restorePayroll = [
            this.permissions.check(this.resources.payroll, 'update'),
            (0, express_validator_1.check)('payroll_account_id').isInt().withMessage('Must be an integer value'),
            (0, express_validator_1.check)('payroll_restored_by')
                .isInt()
                .withMessage('Must be an integer value'),
        ];
    }
}
exports.default = PayrollValidator;
//# sourceMappingURL=payroll.validators.js.map