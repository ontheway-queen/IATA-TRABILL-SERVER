import { check } from 'express-validator';

export const commonInvoiceOtherValidator = [
  check('invoice_combclient_id')
    .notEmpty()
    .withMessage('Invoice client ID is required')
    .isString(),
  check('invoice_sales_man_id')
    .notEmpty()
    .withMessage('Invoice sales man ID is required')
    .isInt(),
  check('invoice_no')
    .notEmpty()
    .withMessage('Invoice number is required')
    .isString(),
  check('invoice_sales_date')
    .notEmpty()
    .withMessage('Invoice sales date is required')
    .toDate(),
  check('invoice_due_date').optional().toDate(),
  check('invoice_agent_com_amount').optional().toFloat(),
  check('invoice_agent_id')
    .optional()
    .customSanitizer((value: number) => (value === null ? undefined : value))
    .isInt(),
  check('passport_information.*.passport_passport_no').optional().isString(),
  check('passport_information.*.passport_name').optional().isString(),
  // check('passport_information.*.passport_mobile_no').optional().isString(),
  check('passport_information.*.passport_email')
    .optional()
    .customSanitizer((value) => (value = null ? undefined : value)),
  check('passport_information.*.passport_date_of_birth')
    .optional()
    .customSanitizer((value) => (value = null ? undefined : value))
    .isISO8601()
    .toDate(),
  check('passport_information.*.passport_date_of_issue')
    .optional()
    .isISO8601()
    .toDate(),
  check('passport_information.*.passport_date_of_expire')
    .optional()
    .isISO8601()
    .toDate(),
  check('passport_information.*.passport_visiting_country').optional().isInt(),
  check('ticketInfo.*.ticket_no').optional().isString(),
  check('ticketInfo.*.ticket_pnr').optional().isString(),
  // check('ticketInfo.*.ticket_route').optional().isInt(),
  check('ticketInfo.*.ticket_airline_id').optional().isInt(),
  check('ticketInfo.*.ticket_reference_no').optional().isString(),
  check('ticketInfo.*.ticket_journey_date').optional().isISO8601().toDate(),
  check('ticketInfo.*.ticket_return_date').optional().isISO8601().toDate(),
  check('hotel_information.*.hotel_name').optional().isString(),
  check('hotel_information.*.hotel_reference_no').optional().isString(),
  check('hotel_information.*.hotel_check_out_date').optional().isISO8601(),
  check('hotel_information.*.hotel_check_in_date').optional().isISO8601(),
  check('hotel_information.*.hotel_room_type_id').optional().isInt(),
  check('transport_information.*.transport_type_id').optional().isInt(),
  check('transport_information.*.transport_reference_no').optional().isString(),
  check('transport_information.*.transport_pickup_place').optional().isString(),
  check('transport_information.*.transport_pickup_time')
    .optional()
    .isISO8601()
    .toDate(),
  check('transport_information.*.transport_dropoff_place')
    .optional()
    .isString(),
  check('transport_information.*.transport_dropoff_time')
    .optional()
    .isISO8601()
    .toDate(),

  // BILLLING INFO VALIDATION

  check('billing_information.*.billing_profit').isNumeric(),

  check('billing_information.*.billing_product_id')
    .notEmpty()
    .withMessage('Billing product ID is required')
    .isInt(),

  check('billing_information.*.billing_quantity')
    .notEmpty()
    .withMessage('Billing quantity is required')
    .isInt()
    .toInt(),

  check('billing_information.*.billing_cost_price').optional().toInt(),

  check('billing_information.*.billing_comvendor').optional().isString(),

  check('invoice_sub_total')
    .notEmpty()
    .withMessage('Invoice subtotal is required')
    .isNumeric(),

  check('invoice_net_total')
    .notEmpty()
    .withMessage('Invoice net total is required')
    .isNumeric()
    .toFloat(),

  check('invoice_created_by').notEmpty().isInt(),

  check('money_receipt.receipt_payment_date').optional().isISO8601().toDate(),
];
