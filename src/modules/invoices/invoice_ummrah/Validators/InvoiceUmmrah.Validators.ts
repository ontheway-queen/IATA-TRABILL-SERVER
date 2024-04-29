import { check } from 'express-validator';
import AbstractValidator from '../../../../abstracts/abstract.validators';
import { commonInvoiceValidator } from '../../../../common/validators/commonInvoice.validators';

class InvoiceHajjValidators extends AbstractValidator {
  commonRead = [this.permissions.check(this.resources.invoice_ummrah, 'read')];
  commonUpdate = [
    this.permissions.check(this.resources.invoice_ummrah, 'update'),
  ];
  commonDelete = [
    this.permissions.check(this.resources.invoice_ummrah, 'delete'),
    check('invoice_has_deleted_by')
      .notEmpty()
      .withMessage('Please porvide who went to delete'),
  ];

  /**
   * @Invoice_Hajj_Post
   *
   */
  postInvoiceUmmrah = [
    this.permissions.check(this.resources.invoice_ummrah, 'create'),

    ...commonInvoiceValidator,

    // PASSENGER INFORMATION
    check('passenget_info.*.passenger_passport_id')
      .optional()
      .isInt()
      .withMessage('Passport number must be a integer.')
      .toInt(),

    check('passenget_info.*.passenger_tracking_number').optional(),

    check('passenget_info.*.ticket_no').optional(),
    check('passenget_info.*.ticket_route').optional(),
    check('passenget_info.*.ticket_pnr').optional(),
    check('passenget_info.*.ticket_airline_id').optional(),
    check('passenget_info.*.ticket_reference_no')
      .optional()
      .isString()
      .withMessage('Reference number must be a string.'),
    check('passenget_info.*.ticket_journey_date')
      .optional()
      .isISO8601()
      .withMessage('Invalid date format.')
      .toDate(),
    check('passenget_info.*.ticket_return_date')
      .optional()
      .isISO8601()
      .withMessage('Invalid date format.')
      .toDate(),

    // HOTEL INFORMATION
    check('hotel_information').optional().isArray(),

    check('hotel_information.*.hotel_name')
      .isString()
      .withMessage('Hotel name must be a string.'),
    check('hotel_information.*.hotel_check_in_date')
      .optional()
      .isISO8601()
      .withMessage('Invalid date format.')
      .toDate(),
    check('hotel_information.*.hotel_check_out_date')
      .optional()
      .isISO8601()
      .withMessage('Invalid date format.')
      .toDate(),
    check('hotel_information.*.hotel_room_type_id')
      .isNumeric()
      .withMessage('Room type ID must be a number.'),

    check('invoice_discount')
      .optional()
      .custom((value, { req }) => {
        if (value === null || value === undefined) {
          return true;
        }

        if (!Number.isInteger(value)) {
          throw new Error('Invoice discount must be an integer');
        }

        return true;
      }),

    check('invoice_created_by')
      .notEmpty()
      .isInt()
      .withMessage('Provide user id'),
  ];

  updateInvoiceUmmrah = [
    this.permissions.check(this.resources.invoice_ummrah, 'update'),

    ...commonInvoiceValidator,

    // PASSENGER INFORMATION

    check('passenget_info.*.passenger_passport_id')
      .optional()
      .isInt()
      .withMessage('Passport number must be a integer.')
      .toInt(),

    check('passenget_info.*.passenger_tracking_number').optional(),

    check('passenget_info.*.ticket_no').optional(),
    check('passenget_info.*.ticket_route').optional(),
    check('passenget_info.*.ticket_pnr').optional(),
    check('passenget_info.*.ticket_airline_id').optional(),
    check('passenget_info.*.ticket_reference_no')
      .optional()
      .isString()
      .withMessage('Reference number must be a string.'),
    check('passenget_info.*.ticket_journey_date')
      .optional()
      .isISO8601()
      .withMessage('Invalid date format.')
      .toDate(),
    check('passenget_info.*.ticket_return_date')
      .optional()
      .isISO8601()
      .withMessage('Invalid date format.')
      .toDate(),

    // HOTEL INFORMATION
    check('hotel_information').optional().isArray(),

    check('hotel_information.*.hotel_name')
      .optional()
      .isString()
      .withMessage('Hotel name must be a string.'),
    check('hotel_information.*.hotel_check_in_date')
      .optional()
      .isISO8601()
      .withMessage('Invalid date format.')
      .toDate(),
    check('hotel_information.*.hotel_check_out_date')
      .optional()
      .isISO8601()
      .withMessage('Invalid date format.')
      .toDate(),
    check('hotel_information.*.hotel_room_type_id')
      .optional()
      .isNumeric()
      .withMessage('Room type ID must be a number.'),

    check('invoice_discount')
      .optional()
      .custom((value, { req }) => {
        if (value === null || value === undefined) {
          return true;
        }

        if (!Number.isInteger(value)) {
          throw new Error('Invoice discount must be an integer');
        }

        return true;
      }),
    check('invoice_created_by')
      .notEmpty()
      .isInt()
      .withMessage('Provide user id'),
  ];

  public createUmmrahRefund = [
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
