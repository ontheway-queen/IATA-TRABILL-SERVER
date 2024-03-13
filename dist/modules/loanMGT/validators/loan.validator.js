"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const abstract_validators_1 = __importDefault(require("../../../abstracts/abstract.validators"));
class LoanValidator extends abstract_validators_1.default {
    constructor() {
        super(...arguments);
        this.readLoan = [
            this.permissions.check(this.resources.loan_management_authority, 'read'),
        ];
        this.deleteLoan = [
            this.permissions.check(this.resources.loan_management_authority, 'delete'),
            (0, express_validator_1.check)('deleted_by')
                .notEmpty()
                .withMessage('Please provide how delete load payment')
                .isInt()
                .withMessage('delete by must integer value'),
        ];
        /**
         * validator for `add loan loan_management_authority` router
         */
        this.addLoanAuthority = [
            this.permissions.check(this.resources.loan_management_authority, 'create'),
            (0, express_validator_1.check)('name')
                .isLength({ max: 35 })
                .withMessage('Authority name can be at most 35 characters'),
            (0, express_validator_1.check)('contact')
                .isLength({ max: 20 })
                .withMessage('Contact can be at most 20 characters'),
            (0, express_validator_1.check)('address')
                .isLength({ max: 100 })
                .withMessage('Address can be at most 100 characters'),
            (0, express_validator_1.check)('created_by').isInt(),
        ];
        /**
         * validator for `edit loan loan_management_authority` router
         */
        this.editLoanAuthority = [
            this.permissions.check(this.resources.loan_management_authority, 'update'),
            (0, express_validator_1.check)('name')
                .isLength({ max: 35 })
                .optional()
                .withMessage('Authority name can be at most 35 characters'),
            (0, express_validator_1.check)('contact')
                .isLength({ max: 20 })
                .optional()
                .withMessage('Contact can be at most 20 characters'),
            (0, express_validator_1.check)('address')
                .isLength({ max: 100 })
                .optional()
                .withMessage('Address can be at most 100 characters'),
        ];
        /**
         * validator for `add loan` router
         */
        this.addLoan = [
            this.permissions.check(this.resources.loan_management_loan, 'create'),
            (0, express_validator_1.check)('name')
                .isLength({ max: 85 })
                .withMessage('Loan name can be at most 85 characters'),
            (0, express_validator_1.check)('type').isIn(['TAKING', 'GIVING', 'ALREADY_TAKEN', 'ALREADY_GIVEN']),
            (0, express_validator_1.check)('amount').isDecimal().withMessage('Loan amount must be number'),
            (0, express_validator_1.check)('payment_type')
                .isIn([1, 2, 3, 4])
                .withMessage('payment type must be 1 | 2 | 3 | 4'),
        ];
        /**
         * validator for `edit loan` router
         */
        this.editLoan = [
            this.permissions.check(this.resources.loan_management_loan, 'update'),
            (0, express_validator_1.check)('name')
                .isLength({ max: 85 })
                .optional()
                .withMessage('Loan name can be at most 85 characters'),
            (0, express_validator_1.check)('type')
                .isIn(['TAKING', 'GIVING', 'ALREADY_TAKEN', 'ALREADY_GIVEN'])
                .optional(),
            (0, express_validator_1.check)('amount')
                .isDecimal()
                .optional()
                .withMessage('Loan amount must be number'),
            (0, express_validator_1.check)('payment_type')
                .optional()
                .isIn([1, 2, 3, 4])
                .withMessage('payment type must be 1 | 2 | 3 | 4'),
        ];
        /**
         * validator for `add payment`
         */
        this.addPayment = [
            this.permissions.check(this.resources.loan_management_payment, 'create'),
            (0, express_validator_1.check)('authority_id').isInt(),
            (0, express_validator_1.check)('loan_id').isInt(),
            (0, express_validator_1.check)('amount').isDecimal().withMessage('Loan amount must be number'),
            (0, express_validator_1.check)('payment_type')
                .isIn([1, 2, 3, 4])
                .withMessage('payment type must be 1 | 2 | 3 | 4'),
            (0, express_validator_1.check)('created_by')
                .isInt()
                .withMessage('created by must be an integer vlaue'),
        ];
        /**
         * validator for `edit payment`
         */
        this.editPayment = [
            this.permissions.check(this.resources.loan_management_payment, 'create'),
            (0, express_validator_1.check)('authority_id').isInt().optional(),
            (0, express_validator_1.check)('loan_id').isInt().optional(),
            (0, express_validator_1.check)('amount')
                .isDecimal()
                .optional()
                .withMessage('Loan amount must be number'),
            (0, express_validator_1.check)('payment_type')
                .optional()
                .isIn([1, 2, 3, 4])
                .withMessage('payment type must be 1 | 2 | 3 | 4'),
            (0, express_validator_1.check)('created_by')
                .isInt()
                .withMessage('Payment created by must be an integer value'),
        ];
        /**
         * validator for `add received`
         */
        this.addReceived = [
            this.permissions.check(this.resources.loan_management_receive, 'create'),
            (0, express_validator_1.check)('authority_id').isInt(),
            (0, express_validator_1.check)('loan_id').isInt(),
            (0, express_validator_1.check)('amount').isDecimal().withMessage('Loan amount must be number'),
            (0, express_validator_1.check)('payment_type')
                .isIn([1, 2, 3, 4])
                .withMessage('payment type must be 1 | 2 | 3 | 4'),
        ];
        /**
         * validator for `edit received`
         */
        this.editReceived = [
            this.permissions.check(this.resources.loan_management_receive, 'create'),
            (0, express_validator_1.check)('authority_id').isInt().optional(),
            (0, express_validator_1.check)('loan_id').isInt().optional(),
            (0, express_validator_1.check)('amount')
                .isDecimal()
                .optional()
                .withMessage('Loan amount must be number'),
            (0, express_validator_1.check)('payment_type')
                .optional()
                .isIn([1, 2, 3, 4])
                .withMessage('payment type must be 1 | 2 | 3 | 4'),
            (0, express_validator_1.check)('created_by')
                .isInt()
                .withMessage('receive created by must be an integer value'),
        ];
    }
}
exports.default = LoanValidator;
//# sourceMappingURL=loan.validator.js.map