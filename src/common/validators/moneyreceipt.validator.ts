import { check } from 'express-validator';

export const moneyReceiptValidator = [
  check('money_receipt.receipt_total_amount')
    .optional()
    .customSanitizer((item) => {
      return item === null ? undefined : item;
    })
    .isFloat()
    .withMessage('Invalid receipt amount')
    .toFloat(),
  check('money_receipt.receipt_payment_type')
    .optional()
    .isInt()
    .withMessage('Invalid payment type'),
  check('money_receipt.account_id')
    .optional()
    .isInt()
    .withMessage('Invalid account ID'),
  check('money_receipt.charge_amount')
    .optional()
    .isFloat()
    .withMessage('Invalid charge amount'),
  check('money_receipt.cheque_bank_name')
    .optional()
    .isString()
    .withMessage('Invalid bank name'),
  check('money_receipt.cheque_number').optional(),
  check('money_receipt.cheque_withdraw_date')
    .optional()
    .isISO8601()
    .withMessage('Invalid withdraw date'),
  check('money_receipt.receipt_money_receipt_no')
    .optional()
    .customSanitizer((item) => {
      return item === '' ? undefined : item;
    })
    .isNumeric()
    .withMessage('Invalid money receipt number'),
  check('money_receipt.receipt_note')
    .optional()
    .customSanitizer((item) => {
      return item === '' ? undefined : item;
    })
    .isString()
    .withMessage('Invalid receipt note'),

  check('money_receipt.trans_no')
    .isString()
    .optional()
    .withMessage('Invalid transaction number'),
  check('money_receipt.receipt_payment_date')
    .optional()
    .isISO8601()
    .withMessage('Invalid payment date'),
];
