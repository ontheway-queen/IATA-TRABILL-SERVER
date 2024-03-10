import { check } from 'express-validator';

export const commonInvoiceVisaValidator = [
  check('invoice_combclient_id')
    .notEmpty()
    .withMessage('Client id is required'),
  check('invoice_sales_man_id').isNumeric(),
  check('invoice_no').notEmpty(),
  check('invoice_sales_date').toDate().isISO8601(),
  check('invoice_due_date').optional().toDate(),
  check('invoice_agent_id')
    .optional()
    .customSanitizer((value) => {
      return value === null ? undefined : value;
    })
    .isNumeric(),

  check('invoice_created_by').notEmpty().withMessage('User id is required'),
  check('billing_information.*.billing_product_id').isNumeric(),
  check('billing_information.*.billing_visiting_country_id').isNumeric(),
  check('billing_information.*.billing_visa_type_id').isNumeric(),
  check('billing_information.*.billing_token')
    .optional()
    .customSanitizer((value) => {
      return value === null ? undefined : value;
    }),
  check('billing_information.*.billing_delivery_date')
    .optional()
    .toDate()
    .isISO8601(),
  check('billing_information.*.billing_quantity').isNumeric(),
  check('billing_information.*.billing_unit_price').isNumeric(),
  check('billing_information.*.billing_subtotal').isNumeric(),
  check('billing_information.*.billing_cost_price').optional().toInt(),
  check('billing_information.*.billing_profit').isNumeric(),
  check('billing_information.*.billing_comvendor').optional().isString(),
  check('billing_information.*.billing_status').notEmpty(),
  check('invoice_sub_total').isNumeric(),
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
  check('invoice_net_total').isNumeric(),
  check('invoice_agent_com_amount').optional().toFloat(),
  check('passport_information').optional().isArray(),
  check('invoice_created_by').isNumeric(),
];
