"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commonInvoiceValidator = void 0;
const express_validator_1 = require("express-validator");
exports.commonInvoiceValidator = [
    (0, express_validator_1.check)('invoice_combclient_id')
        .notEmpty()
        .withMessage('Invoice client is a required')
        .isString()
        .withMessage('Client must be string value'),
    (0, express_validator_1.check)('invoice_sales_man_id')
        .notEmpty()
        .isInt()
        .withMessage('Enter sales man id'),
    (0, express_validator_1.check)('invoice_sales_date').toDate().isISO8601(),
    (0, express_validator_1.check)('invoice_due_date').optional().toDate(),
    (0, express_validator_1.check)('invoice_sub_total')
        .notEmpty()
        .isLength({ max: 10 })
        .isInt()
        .withMessage('Enter invoice sub total'),
    (0, express_validator_1.check)('invoice_net_total')
        .notEmpty()
        .isLength({ max: 10 })
        .withMessage('Enter invoice net total'),
    (0, express_validator_1.check)('invoice_note')
        .isLength({ max: 255 })
        .withMessage('Invoice can be at most 255 characters.')
        .optional(true),
];
//# sourceMappingURL=commonInvoice.validators.js.map