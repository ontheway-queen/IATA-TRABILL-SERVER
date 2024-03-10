import { check } from 'express-validator';
import AbstractValidator from '../../../abstracts/abstract.validators';
import CustomError from '../../../common/utils/errors/customError';

class AccountsValidator extends AbstractValidator {
  readOpeningBalance = [
    this.permissions.check(this.resources.account_opening_balance, 'read'),
  ];
  deleteOpeningBalance = [
    this.permissions.check(this.resources.account_opening_balance, 'delete'),
    check('delete_by')
      .notEmpty()
      .withMessage('please provide user id')
      .isInt()
      .withMessage('deleted by must be an integer value'),
  ];

  readAddListOfAccounts = [
    this.permissions.check(this.resources.accounts_module, 'read'),
  ];

  deleteAddListOfAccounts = [
    this.permissions.check(this.resources.accounts_module, 'delete'),
    check('delete_by')
      .notEmpty()
      .withMessage('please provide user id')
      .isInt()
      .withMessage('deleted by must be an integer value'),
  ];

  readTransactionHistory = [
    this.permissions.check(this.resources.accounts_module, 'read'),
    check('account_id')
      .optional()
      .customSanitizer((value) => {
        return !value ? undefined : value;
      }),
  ];

  deleteTransactionHistory = [
    this.permissions.check(this.resources.accounts_module, 'delete'),
  ];

  readBalanceStatus = [
    this.permissions.check(this.resources.accounts_module, 'read'),
  ];

  deleteBalanceStatus = [
    this.permissions.check(this.resources.accounts_module, 'delete'),
  ];

  readBalanceTransfer = [
    this.permissions.check(this.resources.accounts_module, 'read'),
  ];

  restoreBalanceTransfer = [
    this.permissions.check(this.resources.accounts_module, 'update'),
    check('transfer_created_by'),
  ];

  deleteBalanceTransfer = [
    this.permissions.check(this.resources.accounts_module, 'delete'),
    check('created_by')
      .notEmpty()
      .withMessage('Please provide created by')
      .isInt()
      .withMessage('created by must be an integer value'),
  ];

  readNonInvoiceIncome = [
    this.permissions.check(this.resources.account_non_invoice_income, 'read'),
  ];

  restoreNonInvoiceIncome = [
    this.permissions.check(this.resources.account_non_invoice_income, 'update'),
  ];

  deleteNonInvoiceIncome = [
    this.permissions.check(this.resources.account_non_invoice_income, 'delete'),
    check('deleted_by')
      .notEmpty()
      .withMessage('Please enter deleted by')
      .isInt()
      .withMessage('deleted by must be an integer value'),
  ];

  readIncentiveIncome = [
    this.permissions.check(this.resources.accounts_module, 'read'),
  ];

  restoreIncentiveIncome = [
    this.permissions.check(this.resources.accounts_module, 'update'),
  ];

  deleteIncentiveIncome = [
    this.permissions.check(this.resources.accounts_module, 'delete'),
    check('deleted_by')
      .notEmpty()
      .withMessage('Please enter deleted by')
      .isInt()
      .withMessage('deleted by must be an integer value'),
  ];

  readClientBillAdjustment = [
    this.permissions.check(this.resources.account_bill_adjustment, 'read'),
  ];

  restoreClientBillAdjustment = [
    this.permissions.check(this.resources.account_bill_adjustment, 'update'),
  ];

  deleteClientBillAdjustment = [
    this.permissions.check(this.resources.account_bill_adjustment, 'delete'),
    check('deleted_by')
      .notEmpty()
      .withMessage('Please provide deleted by')
      .isInt()
      .withMessage('deleted by must be an integer value'),
  ];

  readVendorBillAdjustment = [
    this.permissions.check(this.resources.account_bill_adjustment, 'read'),
  ];

  restoreVendorBillAdjustment = [
    this.permissions.check(this.resources.account_bill_adjustment, 'update'),
    check('created_by')
      .notEmpty()
      .withMessage('Please enter created by')
      .isInt()
      .withMessage('created by must be an integer value'),
  ];

  deleteVendorBillAdjustment = [
    this.permissions.check(this.resources.account_bill_adjustment, 'delete'),
    check('created_by')
      .notEmpty()
      .withMessage('Please enter created by')
      .isInt()
      .withMessage('created by must be an integer value'),
  ];

  readInvenstments = [
    this.permissions.check(this.resources.account_investments, 'read'),
  ];

  restoreInvenstments = [
    this.permissions.check(this.resources.account_investments, 'read'),
  ];

  deleteInvenstments = [
    this.permissions.check(this.resources.account_investments, 'delete'),
    check('investment_created_by')
      .notEmpty()
      .withMessage('Please enter investment created by')
      .isInt()
      .withMessage('investment created by must be an integer value'),
  ];

  createAccount = [
    this.permissions.check(this.resources.accounts_module, 'create'),
    check('account_created_by')
      .isInt()
      .withMessage('account_created_by must be an integer value'),
    check('account_acctype_id')
      .isInt()
      .withMessage('acctype_id must be an integer value'),
    check('account_name')
      .notEmpty()
      .isLength({ max: 65 })
      .withMessage(
        'account_name must be provided and cannot be more than 65 characters'
      ),
    check('account_number')
      .optional()
      .isLength({ max: 20 })
      .withMessage('Account number can be at most 20'),
    check('account_bank_name')
      .optional()
      .isLength({ max: 255 })
      .withMessage('Bank name can be of 255 characters most'),
    check('account_branch_name')
      .optional()
      .isLength({ max: 65 })
      .withMessage('Branch name can be at most 65 characters long'),
    check('opening_balance')
      .optional()
      .isDecimal()
      .withMessage('Opening Balance must be a decimal number'),
  ];

  editAccount = [
    this.permissions.check(this.resources.accounts_module, 'update'),
    check('account_name')
      .optional()
      .isLength({ max: 65 })
      .withMessage(
        'account_name must be provided and cannot be more than 65 characters'
      ),
    check('account_number')
      .optional()
      .isLength({ max: 20 })
      .withMessage('Account number can be at most 20'),
    check('account_bank_name')
      .optional()
      .isLength({ max: 255 })
      .withMessage('Bank name can be of 255 characters most'),
    check('opening_balance').optional().toFloat(),
  ];

  addAccountsOpening = [
    this.permissions.check(this.resources.account_opening_balance, 'create'),
    check('type_id').isInt().withMessage('Enter acctype_id'),
    check('account_id').isLength({ max: 65 }).withMessage('Enter account id'),
    check('account_created_by')
      .isInt()
      .withMessage('Account created by is the user id'),
    check('amount').isDecimal().withMessage('Ammount must be of decimal value'),
    check('date').optional().isDate().withMessage('Enter Date'),
    check('note').optional().isString().withMessage('Enter numeric value'),
    check('transaction_type')
      .notEmpty()
      .withMessage('Field is required')
      .isIn(['DEBIT', 'CREDIT']),
  ];

  addClientOpening = [
    this.permissions.check(this.resources.account_opening_balance, 'create'),
    check('client_id').isInt().withMessage('Enter client id'),
    check('transaction_created_by')
      .isInt()
      .withMessage('Transaction created by is the user id'),
    check('amount').isDecimal().withMessage('Amount must be of decimal value'),
    check('transaction_type')
      .notEmpty()
      .withMessage('transaction_type is required and must be DEBIT or CREDIT')
      .isIn(['DEBIT', 'CREDIT']),
  ];

  addCombineOpening = [
    this.permissions.check(this.resources.account_opening_balance, 'create'),
    check('combine_id').isInt().withMessage('Enter valid client ID'),
    check('transaction_created_by')
      .isInt()
      .withMessage('Transaction created by is the user ID'),
    check('transaction_type')
      .notEmpty()
      .withMessage('Field is required')
      .isIn(['DEBIT', 'CREDIT']),
    check('date').optional().isDate().withMessage('Enter date'),
    check('amount')
      .optional()
      .isDecimal()
      .withMessage('Amount must be of decimal value'),
  ];

  addVendorOpening = [
    this.permissions.check(this.resources.account_opening_balance, 'create'),
    check('vendor_id').isInt().withMessage('Enter client id'),
    check('transaction_created_by')
      .isInt()
      .withMessage('Transaction created by is the user id'),
    check('amount').isDecimal().withMessage('Ammount must be of decimal value'),
    check('transaction_type')
      .notEmpty()
      .withMessage('Field is required')
      .isIn(['DEBIT', 'CREDIT']),
  ];

  addBalanceTransfer = [
    this.permissions.check(this.resources.account_balance_transfer, 'create'),
    check('transfer_from_id')
      .isInt()
      .withMessage('Enter transfer from account id'),
    check('transfer_to_id').isInt().withMessage('Enter transfer to account id'),
    check('transfer_created_by')
      .isInt()
      .withMessage('Transaction created by is the user id'),
    check('transfer_amount')
      .isDecimal()
      .withMessage('Amount must be of decimal value'),
    check('transfer_charge')
      .optional()
      .customSanitizer((value) => {
        return value === null ? undefined : value;
      }),
    check('transfer_date')
      .isDate()
      .withMessage('transfer date must be of type date'),
    check('transfer_note').optional().isString().withMessage('transfer note'),
  ];

  addNonInvoice = [
    this.permissions.check(this.resources.account_non_invoice_income, 'create'),
    check('type_id').isInt().withMessage('Enter payment method id'),
    check('company_id').isInt().withMessage('Enter company id'),
    check('account_id').isInt().withMessage('Enter account id'),
    check('amount').isDecimal().withMessage('Amount must be of decimal value'),
    check('noninvoice_created_by')
      .isInt()
      .withMessage('Non invoice created by is the user id'),
    check('cheque_no').optional().isString().withMessage('Enter cheque no'),
    check('receipt_no').optional().isString().withMessage('Enter receipt no'),
    check('date')
      .optional()
      .isDate()
      .withMessage('Non invoice create date must be of type date'),
    check('note').optional().isString().withMessage('Non invoice create note'),
  ];

  editNonInvoice = [
    this.permissions.check(this.resources.account_non_invoice_income, 'update'),
    check('type_id').optional().isInt().withMessage('Enter payment method id'),
    check('company_id').optional().isInt().withMessage('Enter company id'),
    check('account_id').optional().isInt().withMessage('Enter account id'),
    check('amount')
      .optional()
      .isDecimal()
      .withMessage('Amount must be of decimal value'),
    check('noninvoice_created_by')
      .isInt()
      .withMessage('Non invoice created by is the user id'),
    check('cheque_no').optional().isString().withMessage('Enter cheque no'),
    check('receipt_no').optional().isString().withMessage('Enter receipt no'),
    check('date')
      .optional()
      .isDate()
      .withMessage('Non invoice create date must be of type date'),
    check('note').optional().isString().withMessage('Non invoice create note'),
  ];

  addInvestment = [
    this.permissions.check(this.resources.account_investments, 'create'),
    check('type_id').isInt().withMessage('Enter payment method id'),
    check('company_id').isInt().withMessage('Enter company id'),
    check('account_id').isInt().withMessage('Enter account id'),
    check('amount').isDecimal().withMessage('Amount must be of decimal value'),
    check('investment_created_by')
      .isInt()
      .withMessage('Investment created by is the user id'),
    check('cheque_no').optional().isString().withMessage('Enter cheque no'),
    check('receipt_no').optional().isString().withMessage('Enter receipt no'),
    check('date')
      .optional()
      .isDate()
      .withMessage('Investment create date must be of type date'),
    check('note').optional().isString().withMessage('Investment create note'),
  ];

  editInvestment = [
    this.permissions.check(this.resources.account_investments, 'update'),
    check('type_id').optional().isInt().withMessage('Enter payment method id'),
    check('company_id').optional().isInt().withMessage('Enter company id'),
    check('account_id').optional().isInt().withMessage('Enter account id'),
    check('amount')
      .optional()
      .isDecimal()
      .withMessage('Amount must be of decimal value'),
    check('investment_created_by')
      .notEmpty()
      .isInt()
      .withMessage('Investment created by is the user id'),
    check('cheque_no').optional().isString().withMessage('Enter cheque no'),
    check('receipt_no').optional().isString().withMessage('Enter receipt no'),
    check('date')
      .optional()
      .isDate()
      .withMessage('Investment create date must be of type date'),
    check('note').optional().isString().withMessage('Investment create note'),
  ];

  addIncentive = [
    this.permissions.check(this.resources.accounts_module, 'create'),
    check('type_id').optional().isInt().withMessage('Enter payment method id'),
    check('vendor_id').isInt().withMessage('Enter vendor id'),
    check('account_id')
      .custom((value, { req }) => {
        if (req.body.adjust_with_bill === 'NO' && !value) {
          throw new CustomError('Please enter account ID', 400, 'Bad request');
        }
        return true;
      })
      .optional()
      .isInt()
      .withMessage('Enter account id'),
    check('amount').isDecimal().withMessage('Amount must be of decimal value'),
    check('incentive_created_by')
      .isInt()
      .withMessage('Incentive created by is the user id'),
    check('adjust_with_bill')
      .isIn(['YES', 'NO'])
      .withMessage('Adjust with bill must be yes or no'),
    check('date')
      .optional()
      .isDate()
      .withMessage('Investment create date must be of type date'),
    check('note').optional().isString().withMessage('Investment create note'),
  ];

  editIncentive = [
    this.permissions.check(this.resources.accounts_module, 'update'),
    check('type_id').optional().isInt().withMessage('Enter payment method id'),
    check('vendor_id').optional().isInt().withMessage('Enter vendor id'),
    check('account_id').optional().isInt().withMessage('Enter account id'),
    check('amount')
      .optional()
      .isDecimal()
      .withMessage('Amount must be of decimal value'),
    check('incentive_created_by')
      .optional()
      .isInt()
      .withMessage('Incentive created by is the user id'),
    check('adjust_with_bill')
      .optional()
      .isIn(['YES', 'NO'])
      .withMessage('Adjust with bill must be yes or no'),
    check('date')
      .optional()
      .isDate()
      .withMessage('Investment create date must be of type date'),
    check('note').optional().isString().withMessage('Investment create note'),
    check('incentive_created_by')
      .isInt()
      .withMessage('created by must be an integer value'),
  ];

  addClientBill = [
    this.permissions.check(this.resources.account_bill_adjustment, 'create'),
    check('bill_client_id').isString().withMessage('Enter client id'),
    check('bill_type')
      .isIn(['DECREASE', 'INCREASE'])
      .withMessage('Enter bill type'),
    check('bill_amount')
      .isDecimal()
      .withMessage('bill amount must be of decimal value'),
    check('bill_create_date').toDate(),
    check('bill_created_by')
      .isInt()
      .withMessage('bill created by is the user id'),
    check('note')
      .optional()
      .isString()
      .withMessage('bill note must be of type string'),
  ];

  addVendorBill = [
    this.permissions.check(this.resources.account_bill_adjustment, 'create'),
    check('vendor_id').isInt().withMessage('Enter client id'),
    check('bill_type')
      .isIn(['DECREASE', 'INCREASE'])
      .withMessage('Enter bill type'),
    check('bill_amount')
      .isDecimal()
      .withMessage('bill amount must be of decimal value'),
    check('bill_create_date').isDate().withMessage('provide bill create date'),
    check('bill_created_by')
      .isInt()
      .withMessage('bill created by is the user id'),
    check('note')
      .optional()
      .isString()
      .withMessage('bill note must be of type string'),
  ];
}

export default AccountsValidator;
