import { check } from 'express-validator';
import AbstractValidator from '../../../../abstracts/abstract.validators';

class InvoiceHajjValidators extends AbstractValidator {
  commonRead = [this.permissions.check(this.resources.invoice_hajj, 'read')];
  commonUpdate = [
    this.permissions.check(this.resources.invoice_hajj, 'update'),
  ];
  commonDelete = [
    this.permissions.check(this.resources.invoice_hajj, 'delete'),
    check('invoice_has_deleted_by')
      .notEmpty()
      .withMessage('Please porvide who went to delete'),
  ];

  postInvoiceHajj = [
    this.permissions.check(this.resources.invoice_hajj, 'create'),

    check('invoice_combclient_id').notEmpty().withMessage('Enter client id'),
    check('invoice_sales_man_id')
      .notEmpty()
      .isNumeric()
      .withMessage('Enter sales man id'),

    check('invoice_hajj_session')
      .notEmpty()
      .withMessage('Year is required')
      .isISO8601()
      .withMessage('Year must be a valid date')
      .custom((value) => {
        const year = new Date(value).getFullYear();
        if (isNaN(year) || year < 1000 || year > 9999) {
          throw new Error('Year must be a valid four-digit year');
        }
        return year;
      }),

    check('invoice_sales_date')
      .notEmpty()
      .withMessage('Date is required')
      .isISO8601()
      .withMessage('Invalid date')
      .toDate(),
    check('invoice_due_date').optional().toDate(),
    check('invoice_sub_total')
      .notEmpty()
      .isInt()
      .withMessage('Field is required'),
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
    check('invoice_net_total')
      .notEmpty()
      .isInt()
      .withMessage('Enter Invoice net total '),
    check('invoice_note')
      .optional()
      .isLength({ max: 255 })
      .withMessage('invoice note can be at most 250 characters'),
    check('invoice_created_by')
      .notEmpty()
      .isInt()
      .withMessage('Provide user id'),

    // PILGRIMS INFORMATION
    check('pilgrims_information')
      .optional()
      .isArray()
      .withMessage('Pilgrims is required !'),

    check('pilgrims_information.*.ticket_journey_date')
      .optional()
      .isISO8601()
      .withMessage('Invalid journey date format')
      .toDate(),
    check('pilgrims_information.*.ticket_return_date')
      .optional()
      .isISO8601()
      .withMessage('Invalid return date format')
      .toDate(),

    // HOTEL INFORMATION
    check('hotel_information').optional().isArray(),
    check('hotel_information.*.hotel_name')
      .notEmpty()
      .withMessage('Hotel name is required'),
    check('hotel_information.*.hotel_check_in_date').optional().toDate(),
    check('hotel_information.*.hotel_check_out_date').optional().toDate(),
    check('hotel_information.*.hotel_room_type_id')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Room type ID is required and must be a positive integer'),

    // TRANSPORT INFORMATION
    check('transport_info').optional().isArray(),
    check('transport_info.*.transport_type_id')
      .optional()
      .isInt()
      .withMessage('Transport type id must be integer'),

    check('transport_info.*.transport_pickup_time')
      .optional()
      .isISO8601()
      .withMessage('Invalid type for transport_pickup_time')
      .toDate()
      .withMessage('Invalid time format. Use ISO 8601 format.')
      .customSanitizer((value) => {
        const time = new Date(value).toLocaleTimeString('en-US');
        return time;
      }),

    check('transport_info.*.transport_dropoff_time')
      .optional()
      .isISO8601()
      .withMessage('Must be date value.')
      .toDate()
      .withMessage('Invalid time format. Use ISO 8601 format.')
      .customSanitizer((value) => {
        const time = new Date(value).toLocaleTimeString('en-US');
        return time;
      }),
  ];

  public createHajjRefund = [
    this.permissions.check(this.resources.invoice_hajj, 'create'),
    check('comb_client').isString(),
    check('invoice_id').isInt(),
    check('billing_info').isArray().notEmpty(),
    check('billing_info.*.billing_id').isInt(),
    check('billing_info.*.billing_unit_price').isFloat(),
    check('billing_info.*.billing_cost_price').isFloat(),
    check('billing_info.*.comb_vendor').isString(),
    check('billing_info.*.refund_quantity').isInt(),
    check('billing_info.*.client_refund').isFloat(),
    check('billing_info.*.vendor_refund').isFloat(),
    check('billing_info.*.client_charge').optional().isFloat(),
    check('billing_info.*.vendor_charge').optional().isFloat(),
    check('client_total_refund').isFloat(),
    check('client_refund_type').isIn(['Adjust', 'Return']),
    check('vendor_total_refund').isFloat(),
    check('vendor_refund_type').isIn(['Adjust', 'Return']),
    check('vendor_payment_method').optional().isInt(),
    check('vendor_payment_acc_id').optional().isInt(),
    check('client_payment_acc_id').optional().isInt(),
    check('client_payment_method').optional().isInt(),
    check('refund_date').isString().toDate(),
    check('created_by').isInt(),
  ];
}

export default InvoiceHajjValidators;
