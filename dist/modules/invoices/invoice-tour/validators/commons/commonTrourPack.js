"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commonTourPackValidator = void 0;
const express_validator_1 = require("express-validator");
exports.commonTourPackValidator = [
    (0, express_validator_1.check)('invoice_combclient_id')
        .notEmpty()
        .withMessage('Client ID is required'),
    (0, express_validator_1.check)('invoice_sales_man_id')
        .notEmpty()
        .withMessage('Salesman ID is required'),
    (0, express_validator_1.check)('invoice_sales_date')
        .isISO8601()
        .withMessage('Invalid sales date')
        .toDate(),
    (0, express_validator_1.check)('invoice_due_date').optional().toDate(),
    (0, express_validator_1.check)('itour_group_id')
        .optional()
        .customSanitizer((value) => {
        return value ? value : undefined;
    })
        .isInt()
        .withMessage('Group id must be an integer'),
    (0, express_validator_1.check)('itour_day')
        .optional()
        .customSanitizer((value) => {
        return value ? value : undefined;
    })
        .isInt()
        .withMessage('Group id must be an integer'),
    (0, express_validator_1.check)('itour_night')
        .optional()
        .customSanitizer((value) => {
        return value ? value : undefined;
    })
        .isInt()
        .withMessage('Group id must be an integer'),
    (0, express_validator_1.check)('invoice_agent_id')
        .optional()
        .customSanitizer((value) => {
        return value ? value : undefined;
    })
        .isInt()
        .withMessage('Group id must be an integer'),
    (0, express_validator_1.check)('invoice_sub_total')
        .optional()
        .customSanitizer((value) => {
        return value ? value : undefined;
    })
        .isInt()
        .withMessage('Group id must be an integer'),
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
    (0, express_validator_1.check)('invoice_net_total')
        .notEmpty()
        .isInt()
        .withMessage('Group id must be an integer'),
    (0, express_validator_1.check)('invoice_agent_com_amount')
        .optional()
        .customSanitizer((value) => value === null ? undefined : parseFloat(value))
        .toFloat(),
    (0, express_validator_1.check)('invoice_created_by')
        .notEmpty()
        .withMessage('Please provide user id')
        .isInt()
        .withMessage('User id must be numaric value'),
    // BILLING
    (0, express_validator_1.check)('tourBilling.*.billing_product_id')
        .notEmpty()
        .withMessage('Please provide billing product id')
        .isInt()
        .withMessage('Billing product id must be integer'),
    (0, express_validator_1.check)('tourBilling.*.billing_total_sales')
        .notEmpty()
        .withMessage('Please provide sales price'),
    (0, express_validator_1.check)('tourFoods')
        .optional()
        .isArray()
        .customSanitizer((value) => (value.length === 0 ? undefined : value)),
    (0, express_validator_1.check)('tourFoods.*.food_itinerary_id').isInt(),
    (0, express_validator_1.check)('tourFoods.*.food_cost_price').isInt(),
    (0, express_validator_1.check)('tourFoods.*.food_comvendor_id').notEmpty(),
    (0, express_validator_1.check)('tourAccms')
        .optional()
        .isArray()
        .customSanitizer((value) => (value.length === 0 ? undefined : value)),
    (0, express_validator_1.check)('tourAccms.*.accm_itinerary_id').optional().isInt(),
    (0, express_validator_1.check)('tourAccms.*.accm_description').isString().optional(),
    (0, express_validator_1.check)('tourAccms.*.accm_cost_price').optional().isInt(),
    (0, express_validator_1.check)('tourAccms.*.accm_checkin_date').optional().toDate(),
    (0, express_validator_1.check)('tourAccms.*.accm_checkout_date').optional().toDate(),
    (0, express_validator_1.check)('tourAccms.*.accm_comvendor_id')
        .optional()
        .isString()
        .withMessage('Vendor must be string...'),
    (0, express_validator_1.check)('tourOtherTrans')
        .optional()
        .isArray()
        .customSanitizer((value) => (value.length === 0 ? undefined : value)),
    (0, express_validator_1.check)('tourOtherTrans.*.other_trans_itinerary_id').optional().isInt(),
    (0, express_validator_1.check)('tourOtherTrans.*.other_trans_description').optional().isString(),
    (0, express_validator_1.check)('tourOtherTrans.*.other_trans_cost_price').optional().isInt(),
    (0, express_validator_1.check)('tourOtherTrans.*.other_trans_comvendor_id')
        .optional()
        .isString()
        .withMessage('vendor must be string'),
    // Validate guide details
    (0, express_validator_1.check)('guide_itinerary_id')
        .optional()
        .isInt()
        .withMessage('Guide itinerary ID is required'),
    (0, express_validator_1.check)('guide_description')
        .optional()
        .isString()
        .withMessage('Guide description is required'),
    // ... Add more validations for guide details
    // Validate tour billing data
    (0, express_validator_1.check)('tourBilling.*.billing_product_id')
        .notEmpty()
        .withMessage('Billing product ID is required'),
    (0, express_validator_1.check)('tourBilling.*.billing_pax_name').optional(),
    (0, express_validator_1.check)('ticket_journey_date')
        .optional()
        .customSanitizer((value) => {
        return value ? value : undefined;
    })
        .toDate(),
    (0, express_validator_1.check)('ticket_return_date')
        .optional()
        .customSanitizer((value) => {
        return value ? value : undefined;
    })
        .toDate(),
];
//# sourceMappingURL=commonTrourPack.js.map