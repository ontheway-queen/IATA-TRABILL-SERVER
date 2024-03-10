import { check } from 'express-validator';

export const commonTourPackValidator = [
  check('invoice_combclient_id')
    .notEmpty()
    .withMessage('Client ID is required'),
  check('invoice_sales_man_id')
    .notEmpty()
    .withMessage('Salesman ID is required'),
  check('invoice_sales_date')
    .isISO8601()
    .withMessage('Invalid sales date')
    .toDate(),
  check('invoice_due_date').optional().toDate(),
  check('itour_group_id')
    .optional()
    .customSanitizer((value) => {
      return value ? value : undefined;
    })
    .isInt()
    .withMessage('Group id must be an integer'),
  check('itour_day')
    .optional()
    .customSanitizer((value) => {
      return value ? value : undefined;
    })
    .isInt()
    .withMessage('Group id must be an integer'),
  check('itour_night')
    .optional()
    .customSanitizer((value) => {
      return value ? value : undefined;
    })
    .isInt()
    .withMessage('Group id must be an integer'),
  check('invoice_agent_id')
    .optional()
    .customSanitizer((value) => {
      return value ? value : undefined;
    })
    .isInt()
    .withMessage('Group id must be an integer'),
  check('invoice_sub_total')
    .optional()
    .customSanitizer((value) => {
      return value ? value : undefined;
    })
    .isInt()
    .withMessage('Group id must be an integer'),
  check('invoice_discount')
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
  check('invoice_service_charge')
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
  check('invoice_vat')
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
  check('invoice_net_total')
    .notEmpty()
    .isInt()
    .withMessage('Group id must be an integer'),
  check('invoice_agent_com_amount')
    .optional()
    .customSanitizer((value: string) =>
      value === null ? undefined : parseFloat(value)
    )
    .toFloat(),

  check('invoice_created_by')
    .notEmpty()
    .withMessage('Pleace provide user id')
    .isInt()
    .withMessage('User id must be numaric value'),

  // BILLING
  check('tourBilling.*.billing_product_id')
    .notEmpty()
    .withMessage('Pleace provide billing product id')
    .isInt()
    .withMessage('Billing product id must be integer'),

  check('tourBilling.*.billing_total_sales')
    .notEmpty()
    .withMessage('Pleace provide sales price'),

  check('tourFoods')
    .optional()
    .isArray()
    .customSanitizer((value: []) => (value.length === 0 ? undefined : value)),
  check('tourFoods.*.food_itinerary_id').isInt(),
  check('tourFoods.*.food_cost_price').isInt(),
  check('tourFoods.*.food_comvendor_id').notEmpty(),

  check('tourAccms')
    .optional()
    .isArray()
    .customSanitizer((value: []) => (value.length === 0 ? undefined : value)),
  check('tourAccms.*.accm_itinerary_id').optional().isInt(),
  check('tourAccms.*.accm_description').isString().optional(),
  check('tourAccms.*.accm_cost_price').optional().isInt(),
  check('tourAccms.*.accm_checkin_date').optional().toDate(),
  check('tourAccms.*.accm_checkout_date').optional().toDate(),
  check('tourAccms.*.accm_comvendor_id')
    .optional()
    .isString()
    .withMessage('Vendor must be string...'),

  check('tourOtherTrans')
    .optional()
    .isArray()
    .customSanitizer((value: []) => (value.length === 0 ? undefined : value)),
  check('tourOtherTrans.*.other_trans_itinerary_id').optional().isInt(),
  check('tourOtherTrans.*.other_trans_description').optional().isString(),
  check('tourOtherTrans.*.other_trans_cost_price').optional().isInt(),
  check('tourOtherTrans.*.other_trans_comvendor_id')
    .optional()
    .isString()
    .withMessage('vendor must be string'),

  // Validate guide details
  check('guide_itinerary_id')
    .optional()
    .isInt()
    .withMessage('Guide itinerary ID is required'),
  check('guide_description')
    .optional()
    .isString()
    .withMessage('Guide description is required'),
  // ... Add more validations for guide details

  // Validate tour billing data
  check('tourBilling.*.billing_product_id')
    .notEmpty()
    .withMessage('Billing product ID is required'),
  check('tourBilling.*.billing_pax_name').optional(),

  check('ticket_journey_date')
    .optional()
    .customSanitizer((value) => {
      return value ? value : undefined;
    })
    .toDate(),

  check('ticket_return_date')
    .optional()
    .customSanitizer((value) => {
      return value ? value : undefined;
    })
    .toDate(),
];
