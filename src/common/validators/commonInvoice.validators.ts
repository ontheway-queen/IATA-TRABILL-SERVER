import { check } from 'express-validator';

export const commonInvoiceValidator = [
  check('invoice_combclient_id')
    .notEmpty()
    .withMessage('Invoice client is a required')
    .isString()
    .withMessage('Client must be string value'),

  check('invoice_sales_man_id')
    .notEmpty()
    .isInt()
    .withMessage('Enter sales man id'),

  check('invoice_sales_date').toDate().isISO8601(),
  check('invoice_due_date').optional().toDate(),

  check('invoice_sub_total')
    .notEmpty()
    .isLength({ max: 10 })
    .isInt()
    .withMessage('Enter invoice sub total'),

  check('invoice_net_total')
    .notEmpty()
    .isLength({ max: 10 })
    .withMessage('Enter invoice net total'),

  check('invoice_note')
    .isLength({ max: 255 })
    .withMessage('Invoice can be at most 255 characters.')
    .optional(true),
];
