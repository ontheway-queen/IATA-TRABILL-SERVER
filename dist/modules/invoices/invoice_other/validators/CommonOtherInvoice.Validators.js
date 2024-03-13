"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commonInvoiceOtherValidator = void 0;
const express_validator_1 = require("express-validator");
exports.commonInvoiceOtherValidator = [
    (0, express_validator_1.check)('invoice_combclient_id')
        .notEmpty()
        .withMessage('Invoice client ID is required')
        .isString(),
    (0, express_validator_1.check)('invoice_sales_man_id')
        .notEmpty()
        .withMessage('Invoice sales man ID is required')
        .isInt(),
    (0, express_validator_1.check)('invoice_no')
        .notEmpty()
        .withMessage('Invoice number is required')
        .isString(),
    (0, express_validator_1.check)('invoice_sales_date')
        .notEmpty()
        .withMessage('Invoice sales date is required')
        .toDate(),
    (0, express_validator_1.check)('invoice_due_date').optional().toDate(),
    (0, express_validator_1.check)('invoice_agent_com_amount').optional().toFloat(),
    (0, express_validator_1.check)('invoice_agent_id')
        .optional()
        .customSanitizer((value) => (value === null ? undefined : value))
        .isInt(),
    (0, express_validator_1.check)('passport_information.*.passport_passport_no').optional().isString(),
    (0, express_validator_1.check)('passport_information.*.passport_name').optional().isString(),
    // check('passport_information.*.passport_mobile_no').optional().isString(),
    (0, express_validator_1.check)('passport_information.*.passport_email')
        .optional()
        .customSanitizer((value) => (value = null ? undefined : value)),
    (0, express_validator_1.check)('passport_information.*.passport_date_of_birth')
        .optional()
        .customSanitizer((value) => (value = null ? undefined : value))
        .isISO8601()
        .toDate(),
    (0, express_validator_1.check)('passport_information.*.passport_date_of_issue')
        .optional()
        .isISO8601()
        .toDate(),
    (0, express_validator_1.check)('passport_information.*.passport_date_of_expire')
        .optional()
        .isISO8601()
        .toDate(),
    (0, express_validator_1.check)('passport_information.*.passport_visiting_country').optional().isInt(),
    (0, express_validator_1.check)('ticketInfo.*.ticket_no').optional().isString(),
    (0, express_validator_1.check)('ticketInfo.*.ticket_pnr').optional().isString(),
    // check('ticketInfo.*.ticket_route').optional().isInt(),
    (0, express_validator_1.check)('ticketInfo.*.ticket_airline_id').optional().isInt(),
    (0, express_validator_1.check)('ticketInfo.*.ticket_reference_no').optional().isString(),
    (0, express_validator_1.check)('ticketInfo.*.ticket_journey_date').optional().isISO8601().toDate(),
    (0, express_validator_1.check)('ticketInfo.*.ticket_return_date').optional().isISO8601().toDate(),
    (0, express_validator_1.check)('hotel_information.*.hotel_name').optional().isString(),
    (0, express_validator_1.check)('hotel_information.*.hotel_reference_no').optional().isString(),
    (0, express_validator_1.check)('hotel_information.*.hotel_check_out_date').optional().isISO8601(),
    (0, express_validator_1.check)('hotel_information.*.hotel_check_in_date').optional().isISO8601(),
    (0, express_validator_1.check)('hotel_information.*.hotel_room_type_id').optional().isInt(),
    (0, express_validator_1.check)('transport_information.*.transport_type_id').optional().isInt(),
    (0, express_validator_1.check)('transport_information.*.transport_reference_no').optional().isString(),
    (0, express_validator_1.check)('transport_information.*.transport_pickup_place').optional().isString(),
    (0, express_validator_1.check)('transport_information.*.transport_pickup_time')
        .optional()
        .isISO8601()
        .toDate(),
    (0, express_validator_1.check)('transport_information.*.transport_dropoff_place')
        .optional()
        .isString(),
    (0, express_validator_1.check)('transport_information.*.transport_dropoff_time')
        .optional()
        .isISO8601()
        .toDate(),
    // BILLLING INFO VALIDATION
    (0, express_validator_1.check)('billing_information.*.billing_profit').isNumeric(),
    (0, express_validator_1.check)('billing_information.*.billing_product_id')
        .notEmpty()
        .withMessage('Billing product ID is required')
        .isInt(),
    (0, express_validator_1.check)('billing_information.*.billing_quantity')
        .notEmpty()
        .withMessage('Billing quantity is required')
        .isInt()
        .toInt(),
    (0, express_validator_1.check)('billing_information.*.billing_cost_price').optional().toInt(),
    (0, express_validator_1.check)('billing_information.*.billing_comvendor').optional().isString(),
    (0, express_validator_1.check)('invoice_sub_total')
        .notEmpty()
        .withMessage('Invoice subtotal is required')
        .isNumeric(),
    (0, express_validator_1.check)('invoice_net_total')
        .notEmpty()
        .withMessage('Invoice net total is required')
        .isNumeric()
        .toFloat(),
    (0, express_validator_1.check)('invoice_created_by').notEmpty().isInt(),
    (0, express_validator_1.check)('money_receipt.receipt_payment_date').optional().isISO8601().toDate(),
];
//# sourceMappingURL=CommonOtherInvoice.Validators.js.map