"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moneyReceiptValidator = void 0;
const express_validator_1 = require("express-validator");
exports.moneyReceiptValidator = [
    (0, express_validator_1.check)('money_receipt.receipt_total_amount')
        .optional()
        .customSanitizer((item) => {
        return item === null ? undefined : item;
    })
        .isFloat()
        .withMessage('Invalid receipt amount')
        .toFloat(),
    (0, express_validator_1.check)('money_receipt.receipt_payment_type')
        .optional()
        .isInt()
        .withMessage('Invalid payment type'),
    (0, express_validator_1.check)('money_receipt.account_id')
        .optional()
        .isInt()
        .withMessage('Invalid account ID'),
    (0, express_validator_1.check)('money_receipt.charge_amount')
        .optional()
        .isFloat()
        .withMessage('Invalid charge amount'),
    (0, express_validator_1.check)('money_receipt.cheque_bank_name')
        .optional()
        .isString()
        .withMessage('Invalid bank name'),
    (0, express_validator_1.check)('money_receipt.cheque_number').optional(),
    (0, express_validator_1.check)('money_receipt.cheque_withdraw_date')
        .optional()
        .isISO8601()
        .withMessage('Invalid withdraw date'),
    (0, express_validator_1.check)('money_receipt.receipt_money_receipt_no')
        .optional()
        .customSanitizer((item) => {
        return item === '' ? undefined : item;
    })
        .isNumeric()
        .withMessage('Invalid money receipt number'),
    (0, express_validator_1.check)('money_receipt.receipt_note')
        .optional()
        .customSanitizer((item) => {
        return item === '' ? undefined : item;
    })
        .isString()
        .withMessage('Invalid receipt note'),
    (0, express_validator_1.check)('money_receipt.trans_no')
        .isString()
        .optional()
        .withMessage('Invalid transaction number'),
    (0, express_validator_1.check)('money_receipt.receipt_payment_date')
        .optional()
        .isISO8601()
        .withMessage('Invalid payment date'),
];
//# sourceMappingURL=moneyreceipt.validator.js.map