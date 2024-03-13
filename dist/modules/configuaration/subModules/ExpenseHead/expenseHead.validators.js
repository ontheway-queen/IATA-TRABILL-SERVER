"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const abstract_validators_1 = __importDefault(require("../../../../abstracts/abstract.validators"));
class ExpenseHeadValidator extends abstract_validators_1.default {
    constructor() {
        super(...arguments);
        this.readExpenseHead = [
            this.permissions.check(this.resources.expense_head, 'read'),
        ];
        this.deleteExpenseHead = [
            this.permissions.check(this.resources.expense_head, 'delete'),
            (0, express_validator_1.check)('deleted_by')
                .isInt()
                .withMessage('deleted by must be an integer value'),
        ];
        this.createExpenseHead = [
            this.permissions.check(this.resources.expense_head, 'create'),
            (0, express_validator_1.check)('head_name')
                .notEmpty()
                .withMessage('Enter ExpenseHead')
                .isLength({ max: 155 })
                .withMessage('Source title can be at most 155 characters.'),
            (0, express_validator_1.check)('head_created_by')
                .notEmpty()
                .withMessage('Must enter a value')
                .isInt()
                .withMessage('Enter integer value'),
        ];
        this.editExpenseHead = [
            this.permissions.check(this.resources.expense_head, 'update'),
            (0, express_validator_1.check)('head_name')
                .isLength({ max: 155 })
                .withMessage('Source title can be at most 155 characters.'),
        ];
    }
}
exports.default = ExpenseHeadValidator;
//# sourceMappingURL=expenseHead.validators.js.map