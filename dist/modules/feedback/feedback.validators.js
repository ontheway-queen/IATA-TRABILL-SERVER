"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_validators_1 = __importDefault(require("../../abstracts/abstract.validators"));
class FeedbackValidator extends abstract_validators_1.default {
    constructor() {
        super(...arguments);
        this.createFeedback = [
        // this.permissions.check(this.resources.expense, 'create'),
        // check('expense_details.*.expdetails_head_id').isInt(),
        // check('expense_payment_type')
        //   .notEmpty()
        //   .withMessage('Payment method must be not null')
        //   .isIn([1, 2, 3, 4])
        //   .withMessage('Payment method value must be 1, 2, 3 or 4'),
        // check('expense_details.*.expdetails_amount').isNumeric(),
        // check('expcheque_withdraw_date').optional().isDate(),
        // check('expense_total_amount').isNumeric(),
        // check('expense_date').isDate(),
        ];
    }
}
exports.default = FeedbackValidator;
//# sourceMappingURL=feedback.validators.js.map