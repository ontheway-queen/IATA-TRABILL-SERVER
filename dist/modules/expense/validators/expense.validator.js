"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const abstract_validators_1 = __importDefault(require("../../../abstracts/abstract.validators"));
class ExpenseValidator extends abstract_validators_1.default {
    constructor() {
        super(...arguments);
        this.readExpense = [this.permissions.check(this.resources.expense, 'read')];
        this.deleteExpense = [
            this.permissions.check(this.resources.expense, 'delete'),
            (0, express_validator_1.check)('note').optional(),
            (0, express_validator_1.check)('date').optional().isDate(),
        ];
        this.restoreExpense = [this.permissions.check(this.resources.expense, 'read')];
        /**
         * validation for `create expense`
         */
        this.createExpense = [
            this.permissions.check(this.resources.expense, 'create'),
            (0, express_validator_1.check)('expense_details.*.expdetails_head_id').isInt(),
            (0, express_validator_1.check)('expense_payment_type')
                .notEmpty()
                .withMessage('Payment method must be not null')
                .isIn([1, 2, 3, 4])
                .withMessage('Payment method value must be 1, 2, 3 or 4'),
            (0, express_validator_1.check)('expense_details.*.expdetails_amount').isNumeric(),
            (0, express_validator_1.check)('expense_total_amount').isNumeric(),
            (0, express_validator_1.check)('expense_date').toDate(),
            (0, express_validator_1.check)('expcheque_withdraw_date').toDate(),
        ];
        /**
         * validation for `update expense`
         */
        this.updateExpense = [
            this.permissions.check(this.resources.expense, 'update'),
            (0, express_validator_1.check)('expense_details.*.expdetails_head_id').isInt(),
            (0, express_validator_1.check)('expense_payment_type')
                .notEmpty()
                .withMessage('Payment method must be not null')
                .isIn([1, 2, 3, 4])
                .withMessage('Payment method value must be 1, 2, 3 or 4'),
            (0, express_validator_1.check)('expense_details.*.expdetails_amount').isNumeric(),
            (0, express_validator_1.check)('expense_total_amount').isNumeric(),
            (0, express_validator_1.check)('expense_date').toDate(),
            (0, express_validator_1.check)('expcheque_withdraw_date').toDate(),
        ];
    }
}
exports.default = ExpenseValidator;
//# sourceMappingURL=expense.validator.js.map