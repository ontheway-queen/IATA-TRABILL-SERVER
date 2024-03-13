"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const abstract_validators_1 = __importDefault(require("../../../abstracts/abstract.validators"));
const customError_1 = __importDefault(require("../../../common/utils/errors/customError"));
class AccountsValidator extends abstract_validators_1.default {
    constructor() {
        super(...arguments);
        this.readOpeningBalance = [
            this.permissions.check(this.resources.account_opening_balance, 'read'),
        ];
        this.deleteOpeningBalance = [
            this.permissions.check(this.resources.account_opening_balance, 'delete'),
            (0, express_validator_1.check)('delete_by')
                .notEmpty()
                .withMessage('please provide user id')
                .isInt()
                .withMessage('deleted by must be an integer value'),
        ];
        this.readAddListOfAccounts = [
            this.permissions.check(this.resources.accounts_module, 'read'),
        ];
        this.deleteAddListOfAccounts = [
            this.permissions.check(this.resources.accounts_module, 'delete'),
            (0, express_validator_1.check)('delete_by')
                .notEmpty()
                .withMessage('please provide user id')
                .isInt()
                .withMessage('deleted by must be an integer value'),
        ];
        this.readTransactionHistory = [
            this.permissions.check(this.resources.accounts_module, 'read'),
            (0, express_validator_1.check)('account_id')
                .optional()
                .customSanitizer((value) => {
                return !value ? undefined : value;
            }),
        ];
        this.deleteTransactionHistory = [
            this.permissions.check(this.resources.accounts_module, 'delete'),
        ];
        this.readBalanceStatus = [
            this.permissions.check(this.resources.accounts_module, 'read'),
        ];
        this.deleteBalanceStatus = [
            this.permissions.check(this.resources.accounts_module, 'delete'),
        ];
        this.readBalanceTransfer = [
            this.permissions.check(this.resources.accounts_module, 'read'),
        ];
        this.restoreBalanceTransfer = [
            this.permissions.check(this.resources.accounts_module, 'update'),
            (0, express_validator_1.check)('transfer_created_by'),
        ];
        this.deleteBalanceTransfer = [
            this.permissions.check(this.resources.accounts_module, 'delete'),
            (0, express_validator_1.check)('created_by')
                .notEmpty()
                .withMessage('Please provide created by')
                .isInt()
                .withMessage('created by must be an integer value'),
        ];
        this.readNonInvoiceIncome = [
            this.permissions.check(this.resources.account_non_invoice_income, 'read'),
        ];
        this.restoreNonInvoiceIncome = [
            this.permissions.check(this.resources.account_non_invoice_income, 'update'),
        ];
        this.deleteNonInvoiceIncome = [
            this.permissions.check(this.resources.account_non_invoice_income, 'delete'),
            (0, express_validator_1.check)('deleted_by')
                .notEmpty()
                .withMessage('Please enter deleted by')
                .isInt()
                .withMessage('deleted by must be an integer value'),
        ];
        this.readIncentiveIncome = [
            this.permissions.check(this.resources.accounts_module, 'read'),
        ];
        this.restoreIncentiveIncome = [
            this.permissions.check(this.resources.accounts_module, 'update'),
        ];
        this.deleteIncentiveIncome = [
            this.permissions.check(this.resources.accounts_module, 'delete'),
            (0, express_validator_1.check)('deleted_by')
                .notEmpty()
                .withMessage('Please enter deleted by')
                .isInt()
                .withMessage('deleted by must be an integer value'),
        ];
        this.readClientBillAdjustment = [
            this.permissions.check(this.resources.account_bill_adjustment, 'read'),
        ];
        this.restoreClientBillAdjustment = [
            this.permissions.check(this.resources.account_bill_adjustment, 'update'),
        ];
        this.deleteClientBillAdjustment = [
            this.permissions.check(this.resources.account_bill_adjustment, 'delete'),
            (0, express_validator_1.check)('deleted_by')
                .notEmpty()
                .withMessage('Please provide deleted by')
                .isInt()
                .withMessage('deleted by must be an integer value'),
        ];
        this.readVendorBillAdjustment = [
            this.permissions.check(this.resources.account_bill_adjustment, 'read'),
        ];
        this.restoreVendorBillAdjustment = [
            this.permissions.check(this.resources.account_bill_adjustment, 'update'),
            (0, express_validator_1.check)('created_by')
                .notEmpty()
                .withMessage('Please enter created by')
                .isInt()
                .withMessage('created by must be an integer value'),
        ];
        this.deleteVendorBillAdjustment = [
            this.permissions.check(this.resources.account_bill_adjustment, 'delete'),
            (0, express_validator_1.check)('created_by')
                .notEmpty()
                .withMessage('Please enter created by')
                .isInt()
                .withMessage('created by must be an integer value'),
        ];
        this.readInvenstments = [
            this.permissions.check(this.resources.account_investments, 'read'),
        ];
        this.restoreInvenstments = [
            this.permissions.check(this.resources.account_investments, 'read'),
        ];
        this.deleteInvenstments = [
            this.permissions.check(this.resources.account_investments, 'delete'),
            (0, express_validator_1.check)('investment_created_by')
                .notEmpty()
                .withMessage('Please enter investment created by')
                .isInt()
                .withMessage('investment created by must be an integer value'),
        ];
        this.createAccount = [
            this.permissions.check(this.resources.accounts_module, 'create'),
            (0, express_validator_1.check)('account_created_by')
                .isInt()
                .withMessage('account_created_by must be an integer value'),
            (0, express_validator_1.check)('account_acctype_id')
                .isInt()
                .withMessage('acctype_id must be an integer value'),
            (0, express_validator_1.check)('account_name')
                .notEmpty()
                .isLength({ max: 65 })
                .withMessage('account_name must be provided and cannot be more than 65 characters'),
            (0, express_validator_1.check)('account_number')
                .optional()
                .isLength({ max: 20 })
                .withMessage('Account number can be at most 20'),
            (0, express_validator_1.check)('account_bank_name')
                .optional()
                .isLength({ max: 255 })
                .withMessage('Bank name can be of 255 characters most'),
            (0, express_validator_1.check)('account_branch_name')
                .optional()
                .isLength({ max: 65 })
                .withMessage('Branch name can be at most 65 characters long'),
            (0, express_validator_1.check)('opening_balance')
                .optional()
                .isDecimal()
                .withMessage('Opening Balance must be a decimal number'),
        ];
        this.editAccount = [
            this.permissions.check(this.resources.accounts_module, 'update'),
            (0, express_validator_1.check)('account_name')
                .optional()
                .isLength({ max: 65 })
                .withMessage('account_name must be provided and cannot be more than 65 characters'),
            (0, express_validator_1.check)('account_number')
                .optional()
                .isLength({ max: 20 })
                .withMessage('Account number can be at most 20'),
            (0, express_validator_1.check)('account_bank_name')
                .optional()
                .isLength({ max: 255 })
                .withMessage('Bank name can be of 255 characters most'),
            (0, express_validator_1.check)('opening_balance').optional().toFloat(),
        ];
        this.addAccountsOpening = [
            this.permissions.check(this.resources.account_opening_balance, 'create'),
            (0, express_validator_1.check)('type_id').isInt().withMessage('Enter acctype_id'),
            (0, express_validator_1.check)('account_id').isLength({ max: 65 }).withMessage('Enter account id'),
            (0, express_validator_1.check)('account_created_by')
                .isInt()
                .withMessage('Account created by is the user id'),
            (0, express_validator_1.check)('amount').isDecimal().withMessage('Ammount must be of decimal value'),
            (0, express_validator_1.check)('date').optional().isDate().withMessage('Enter Date'),
            (0, express_validator_1.check)('note').optional().isString().withMessage('Enter numeric value'),
            (0, express_validator_1.check)('transaction_type')
                .notEmpty()
                .withMessage('Field is required')
                .isIn(['DEBIT', 'CREDIT']),
        ];
        this.addClientOpening = [
            this.permissions.check(this.resources.account_opening_balance, 'create'),
            (0, express_validator_1.check)('client_id').isInt().withMessage('Enter client id'),
            (0, express_validator_1.check)('transaction_created_by')
                .isInt()
                .withMessage('Transaction created by is the user id'),
            (0, express_validator_1.check)('amount').isDecimal().withMessage('Amount must be of decimal value'),
            (0, express_validator_1.check)('transaction_type')
                .notEmpty()
                .withMessage('transaction_type is required and must be DEBIT or CREDIT')
                .isIn(['DEBIT', 'CREDIT']),
        ];
        this.addCombineOpening = [
            this.permissions.check(this.resources.account_opening_balance, 'create'),
            (0, express_validator_1.check)('combine_id').isInt().withMessage('Enter valid client ID'),
            (0, express_validator_1.check)('transaction_created_by')
                .isInt()
                .withMessage('Transaction created by is the user ID'),
            (0, express_validator_1.check)('transaction_type')
                .notEmpty()
                .withMessage('Field is required')
                .isIn(['DEBIT', 'CREDIT']),
            (0, express_validator_1.check)('date').optional().isDate().withMessage('Enter date'),
            (0, express_validator_1.check)('amount')
                .optional()
                .isDecimal()
                .withMessage('Amount must be of decimal value'),
        ];
        this.addVendorOpening = [
            this.permissions.check(this.resources.account_opening_balance, 'create'),
            (0, express_validator_1.check)('vendor_id').isInt().withMessage('Enter client id'),
            (0, express_validator_1.check)('transaction_created_by')
                .isInt()
                .withMessage('Transaction created by is the user id'),
            (0, express_validator_1.check)('amount').isDecimal().withMessage('Ammount must be of decimal value'),
            (0, express_validator_1.check)('transaction_type')
                .notEmpty()
                .withMessage('Field is required')
                .isIn(['DEBIT', 'CREDIT']),
        ];
        this.addBalanceTransfer = [
            this.permissions.check(this.resources.account_balance_transfer, 'create'),
            (0, express_validator_1.check)('transfer_from_id')
                .isInt()
                .withMessage('Enter transfer from account id'),
            (0, express_validator_1.check)('transfer_to_id').isInt().withMessage('Enter transfer to account id'),
            (0, express_validator_1.check)('transfer_created_by')
                .isInt()
                .withMessage('Transaction created by is the user id'),
            (0, express_validator_1.check)('transfer_amount')
                .isDecimal()
                .withMessage('Amount must be of decimal value'),
            (0, express_validator_1.check)('transfer_charge')
                .optional()
                .customSanitizer((value) => {
                return value === null ? undefined : value;
            }),
            (0, express_validator_1.check)('transfer_date')
                .isDate()
                .withMessage('transfer date must be of type date'),
            (0, express_validator_1.check)('transfer_note').optional().isString().withMessage('transfer note'),
        ];
        this.addNonInvoice = [
            this.permissions.check(this.resources.account_non_invoice_income, 'create'),
            (0, express_validator_1.check)('type_id').isInt().withMessage('Enter payment method id'),
            (0, express_validator_1.check)('company_id').isInt().withMessage('Enter company id'),
            (0, express_validator_1.check)('account_id').isInt().withMessage('Enter account id'),
            (0, express_validator_1.check)('amount').isDecimal().withMessage('Amount must be of decimal value'),
            (0, express_validator_1.check)('noninvoice_created_by')
                .isInt()
                .withMessage('Non invoice created by is the user id'),
            (0, express_validator_1.check)('cheque_no').optional().isString().withMessage('Enter cheque no'),
            (0, express_validator_1.check)('receipt_no').optional().isString().withMessage('Enter receipt no'),
            (0, express_validator_1.check)('date')
                .optional()
                .isDate()
                .withMessage('Non invoice create date must be of type date'),
            (0, express_validator_1.check)('note').optional().isString().withMessage('Non invoice create note'),
        ];
        this.editNonInvoice = [
            this.permissions.check(this.resources.account_non_invoice_income, 'update'),
            (0, express_validator_1.check)('type_id').optional().isInt().withMessage('Enter payment method id'),
            (0, express_validator_1.check)('company_id').optional().isInt().withMessage('Enter company id'),
            (0, express_validator_1.check)('account_id').optional().isInt().withMessage('Enter account id'),
            (0, express_validator_1.check)('amount')
                .optional()
                .isDecimal()
                .withMessage('Amount must be of decimal value'),
            (0, express_validator_1.check)('noninvoice_created_by')
                .isInt()
                .withMessage('Non invoice created by is the user id'),
            (0, express_validator_1.check)('cheque_no').optional().isString().withMessage('Enter cheque no'),
            (0, express_validator_1.check)('receipt_no').optional().isString().withMessage('Enter receipt no'),
            (0, express_validator_1.check)('date')
                .optional()
                .isDate()
                .withMessage('Non invoice create date must be of type date'),
            (0, express_validator_1.check)('note').optional().isString().withMessage('Non invoice create note'),
        ];
        this.addInvestment = [
            this.permissions.check(this.resources.account_investments, 'create'),
            (0, express_validator_1.check)('type_id').isInt().withMessage('Enter payment method id'),
            (0, express_validator_1.check)('company_id').isInt().withMessage('Enter company id'),
            (0, express_validator_1.check)('account_id').isInt().withMessage('Enter account id'),
            (0, express_validator_1.check)('amount').isDecimal().withMessage('Amount must be of decimal value'),
            (0, express_validator_1.check)('investment_created_by')
                .isInt()
                .withMessage('Investment created by is the user id'),
            (0, express_validator_1.check)('cheque_no').optional().isString().withMessage('Enter cheque no'),
            (0, express_validator_1.check)('receipt_no').optional().isString().withMessage('Enter receipt no'),
            (0, express_validator_1.check)('date')
                .optional()
                .isDate()
                .withMessage('Investment create date must be of type date'),
            (0, express_validator_1.check)('note').optional().isString().withMessage('Investment create note'),
        ];
        this.editInvestment = [
            this.permissions.check(this.resources.account_investments, 'update'),
            (0, express_validator_1.check)('type_id').optional().isInt().withMessage('Enter payment method id'),
            (0, express_validator_1.check)('company_id').optional().isInt().withMessage('Enter company id'),
            (0, express_validator_1.check)('account_id').optional().isInt().withMessage('Enter account id'),
            (0, express_validator_1.check)('amount')
                .optional()
                .isDecimal()
                .withMessage('Amount must be of decimal value'),
            (0, express_validator_1.check)('investment_created_by')
                .notEmpty()
                .isInt()
                .withMessage('Investment created by is the user id'),
            (0, express_validator_1.check)('cheque_no').optional().isString().withMessage('Enter cheque no'),
            (0, express_validator_1.check)('receipt_no').optional().isString().withMessage('Enter receipt no'),
            (0, express_validator_1.check)('date')
                .optional()
                .isDate()
                .withMessage('Investment create date must be of type date'),
            (0, express_validator_1.check)('note').optional().isString().withMessage('Investment create note'),
        ];
        this.addIncentive = [
            this.permissions.check(this.resources.accounts_module, 'create'),
            (0, express_validator_1.check)('type_id').optional().isInt().withMessage('Enter payment method id'),
            (0, express_validator_1.check)('vendor_id').isInt().withMessage('Enter vendor id'),
            (0, express_validator_1.check)('account_id')
                .custom((value, { req }) => {
                if (req.body.adjust_with_bill === 'NO' && !value) {
                    throw new customError_1.default('Please enter account ID', 400, 'Bad request');
                }
                return true;
            })
                .optional()
                .isInt()
                .withMessage('Enter account id'),
            (0, express_validator_1.check)('amount').isDecimal().withMessage('Amount must be of decimal value'),
            (0, express_validator_1.check)('incentive_created_by')
                .isInt()
                .withMessage('Incentive created by is the user id'),
            (0, express_validator_1.check)('adjust_with_bill')
                .isIn(['YES', 'NO'])
                .withMessage('Adjust with bill must be yes or no'),
            (0, express_validator_1.check)('date')
                .optional()
                .isDate()
                .withMessage('Investment create date must be of type date'),
            (0, express_validator_1.check)('note').optional().isString().withMessage('Investment create note'),
        ];
        this.editIncentive = [
            this.permissions.check(this.resources.accounts_module, 'update'),
            (0, express_validator_1.check)('type_id').optional().isInt().withMessage('Enter payment method id'),
            (0, express_validator_1.check)('vendor_id').optional().isInt().withMessage('Enter vendor id'),
            (0, express_validator_1.check)('account_id').optional().isInt().withMessage('Enter account id'),
            (0, express_validator_1.check)('amount')
                .optional()
                .isDecimal()
                .withMessage('Amount must be of decimal value'),
            (0, express_validator_1.check)('incentive_created_by')
                .optional()
                .isInt()
                .withMessage('Incentive created by is the user id'),
            (0, express_validator_1.check)('adjust_with_bill')
                .optional()
                .isIn(['YES', 'NO'])
                .withMessage('Adjust with bill must be yes or no'),
            (0, express_validator_1.check)('date')
                .optional()
                .isDate()
                .withMessage('Investment create date must be of type date'),
            (0, express_validator_1.check)('note').optional().isString().withMessage('Investment create note'),
            (0, express_validator_1.check)('incentive_created_by')
                .isInt()
                .withMessage('created by must be an integer value'),
        ];
        this.addClientBill = [
            this.permissions.check(this.resources.account_bill_adjustment, 'create'),
            (0, express_validator_1.check)('bill_client_id').isString().withMessage('Enter client id'),
            (0, express_validator_1.check)('bill_type')
                .isIn(['DECREASE', 'INCREASE'])
                .withMessage('Enter bill type'),
            (0, express_validator_1.check)('bill_amount')
                .isDecimal()
                .withMessage('bill amount must be of decimal value'),
            (0, express_validator_1.check)('bill_create_date').toDate(),
            (0, express_validator_1.check)('bill_created_by')
                .isInt()
                .withMessage('bill created by is the user id'),
            (0, express_validator_1.check)('note')
                .optional()
                .isString()
                .withMessage('bill note must be of type string'),
        ];
        this.addVendorBill = [
            this.permissions.check(this.resources.account_bill_adjustment, 'create'),
            (0, express_validator_1.check)('vendor_id').isInt().withMessage('Enter client id'),
            (0, express_validator_1.check)('bill_type')
                .isIn(['DECREASE', 'INCREASE'])
                .withMessage('Enter bill type'),
            (0, express_validator_1.check)('bill_amount')
                .isDecimal()
                .withMessage('bill amount must be of decimal value'),
            (0, express_validator_1.check)('bill_create_date').isDate().withMessage('provide bill create date'),
            (0, express_validator_1.check)('bill_created_by')
                .isInt()
                .withMessage('bill created by is the user id'),
            (0, express_validator_1.check)('note')
                .optional()
                .isString()
                .withMessage('bill note must be of type string'),
        ];
    }
}
exports.default = AccountsValidator;
//# sourceMappingURL=accounts.validator.js.map