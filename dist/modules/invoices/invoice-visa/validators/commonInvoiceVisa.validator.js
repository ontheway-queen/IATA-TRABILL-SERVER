"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commonInvoiceVisaValidator = void 0;
const express_validator_1 = require("express-validator");
exports.commonInvoiceVisaValidator = [
    (0, express_validator_1.check)('invoice_combclient_id')
        .notEmpty()
        .withMessage('Client id is required'),
    (0, express_validator_1.check)('invoice_sales_man_id').isNumeric(),
    (0, express_validator_1.check)('invoice_no').notEmpty(),
    (0, express_validator_1.check)('invoice_sales_date').toDate().isISO8601(),
    (0, express_validator_1.check)('invoice_due_date').optional().toDate(),
    (0, express_validator_1.check)('invoice_agent_id')
        .optional()
        .customSanitizer((value) => {
        return value === null ? undefined : value;
    })
        .isNumeric(),
    (0, express_validator_1.check)('invoice_created_by').notEmpty().withMessage('User id is required'),
    (0, express_validator_1.check)('billing_information.*.billing_product_id').isNumeric(),
    (0, express_validator_1.check)('billing_information.*.billing_visiting_country_id').isNumeric(),
    (0, express_validator_1.check)('billing_information.*.billing_visa_type_id').isNumeric(),
    (0, express_validator_1.check)('billing_information.*.billing_token')
        .optional()
        .customSanitizer((value) => {
        return value === null ? undefined : value;
    }),
    (0, express_validator_1.check)('billing_information.*.billing_delivery_date')
        .optional()
        .toDate()
        .isISO8601(),
    (0, express_validator_1.check)('billing_information.*.billing_quantity').isNumeric(),
    (0, express_validator_1.check)('billing_information.*.billing_unit_price').isNumeric(),
    (0, express_validator_1.check)('billing_information.*.billing_subtotal').isNumeric(),
    (0, express_validator_1.check)('billing_information.*.billing_cost_price').optional().toInt(),
    (0, express_validator_1.check)('billing_information.*.billing_profit').isNumeric(),
    (0, express_validator_1.check)('billing_information.*.billing_comvendor').optional().isString(),
    (0, express_validator_1.check)('billing_information.*.billing_status').notEmpty(),
    (0, express_validator_1.check)('invoice_sub_total').isNumeric(),
    (0, express_validator_1.check)('invoice_discount')
        .optional()
        .custom((value, { req }) => {
        // If the value is null, it's considered valid
        if (value === null || value === undefined) {
            return true;
        }
        // Check if the value is an integer
        if (!Number.isInteger(value)) {
            throw new Error('Invoice discount must be an integer');
        }
        return true;
    }),
    (0, express_validator_1.check)('invoice_service_charge')
        .optional()
        .custom((value, { req }) => {
        // If the value is null, it's considered valid
        if (value === null || value === undefined) {
            return true;
        }
        // Check if the value is an integer
        if (!Number.isInteger(value)) {
            throw new Error('Invoice service charge must be an integer');
        }
        return true;
    }),
    (0, express_validator_1.check)('invoice_vat')
        .optional()
        .custom((value, { req }) => {
        // If the value is null, it's considered valid
        if (value === null || value === undefined) {
            return true;
        }
        // Check if the value is an integer
        if (!Number.isInteger(value)) {
            throw new Error('Invoice vat must be an integer');
        }
        return true;
    }),
    (0, express_validator_1.check)('invoice_net_total').isNumeric(),
    (0, express_validator_1.check)('invoice_agent_com_amount').optional().toFloat(),
    (0, express_validator_1.check)('passport_information').optional().isArray(),
    (0, express_validator_1.check)('invoice_created_by').isNumeric(),
];
//# sourceMappingURL=commonInvoiceVisa.validator.js.map