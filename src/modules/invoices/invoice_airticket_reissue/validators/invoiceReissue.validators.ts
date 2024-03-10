import { check } from 'express-validator';
import AbstractValidator from '../../../../abstracts/abstract.validators';

class ReissueAirticket extends AbstractValidator {
  readResissueAirticket = [
    this.permissions.check(this.resources.invoice_reissue, 'read'),
  ];

  deleteResissueAirticket = [
    this.permissions.check(this.resources.invoice_reissue, 'delete'),
  ];

  addExistingClient = [
    this.permissions.check(this.resources.invoice_reissue, 'create'),

    check('invoice_combclient_id').notEmpty(),
    check('invoice_sales_man_id').isInt(),
    check('invoice_sales_date').toDate(),
    check('invoice_due_date').optional().toDate(),
    check('airticket_profit').isNumeric(),
    check('invoice_no').notEmpty(),
    check('invoice_created_by').isInt(),
    check('airticket_journey_date').isISO8601().toDate(),
    check('airticket_return_date').toDate(),
    check('airticket_vendor_charge')
      .optional()
      .customSanitizer((value) => {
        return value === null ? undefined : value;
      })
      .isNumeric(),
    check('airticket_client_charge')
      .optional()
      .customSanitizer((value) => {
        return value === null ? undefined : value;
      })
      .isNumeric(),
    check('airticket_service_charge')
      .optional()
      .customSanitizer((value) => {
        return value === null ? undefined : value;
      })
      .isNumeric(),
    check('invoice_note').optional().isString(),
  ];
  addReissueAirticket = [
    this.permissions.check(this.resources.invoice_reissue, 'create'),
    check('invoice_info.invoice_no')
      .notEmpty()
      .withMessage('Pleace provide your valid invoice number'),

    check('invoice_info.invoice_combclient_id')
      .notEmpty()
      .withMessage('Enter client id'),

    check('invoice_info.invoice_sales_man_id')
      .notEmpty()
      .withMessage('Enter sales man id'),
    check('invoice_info.invoice_sales_date')
      .notEmpty()
      .toDate()
      .withMessage('Date is required'),

    check('invoice_info.invoice_due_date').optional().toDate(),

    check('invoice_info.invoice_sub_total')
      .notEmpty()
      .isInt()
      .withMessage('Field is required'),
    check('invoice_info.invoice_net_total')
      .notEmpty()
      .isInt()
      .withMessage('Field is required'),
    check('invoice_info.invoice_total_profit')
      .notEmpty()
      .withMessage('Invoice total profit is required!')
      .isFloat()
      .withMessage('Invoice total profit must be an integer'),
    check('invoice_info.invoice_total_vendor_price')
      .notEmpty()
      .isInt()
      .withMessage('Field is required'),
    check('invoice_info.invoice_created_by')
      .notEmpty()
      .isInt()
      .withMessage('Field is required'),

    check('ticketInfo.*.ticket_details.airticket_ticket_no')
      .notEmpty()
      .withMessage('Enter Air-ticket number')
      .isLength({ max: 30 })
      .withMessage('Source title can be at most 30 characters'),

    check('ticketInfo.*.ticket_details.airticket_client_price')
      .notEmpty()
      .withMessage('Enter Air-ticket client price')
      .isInt()
      .withMessage('Enter integer value'),
    check('ticketInfo.*.ticket_details.airticket_purchase_price')
      .notEmpty()
      .withMessage('Purchase price is required!')
      .isFloat()
      .withMessage('Purchase price must be integer'),
    check('ticketInfo.*.flight_details.*.fltdetails_fly_date')
      .optional()
      .toDate(),
    check('ticketInfo.*.ticket_details.airticket_comvendor')
      .notEmpty()
      .withMessage('Vendor is required!')
      .isString()
      .withMessage('Invalid airticket vendor id'),
    check('ticketInfo.*.ticket_details.airticket_airline_id')
      .notEmpty()
      .isInt()
      .withMessage('This is feild is required and it must be an integer'),
    check('ticketInfo.*.ticket_details.airticket_profit')
      .notEmpty()
      .withMessage('Enter Air-ticket profit')
      .isNumeric()
      .withMessage('Enter Numeric value'),

    check('ticketInfo.*.ticket_details.airticket_route_or_sector')
      .optional()
      .isLength({ max: 100 })
      .withMessage('Source title can be at most 100 characters'),

    check('ticketInfo.*.ticket_details.airticket_pnr')
      .optional()
      .isLength({ max: 30 })
      .withMessage('Source title can be at most 30 characters'),
    check('ticketInfo.*.ticket_details.airticket_issue_date')
      .optional()
      .toDate(),
    check('ticketInfo.*.ticket_details.airticket_journey_date')
      .optional()
      .toDate(),
    check('ticketInfo.*.ticket_details.airticket_return_date')
      .optional()
      .toDate(),
    check('ticketInfo.*.pax_passport.*.passport_date_of_expire')
      .optional()
      .isISO8601()
      .toDate(),
    check('ticketInfo.*.pax_passport.*.passport_date_of_issue')
      .optional()
      .isISO8601()
      .toDate(),
    check('ticketInfo.*.pax_passport.*.passport_date_of_birth')
      .optional()
      .isISO8601()
      .toDate(),
    check('money_receipt.receipt_payment_date').optional().isISO8601().toDate(),
  ];

  editReissueAirticket = [
    this.permissions.check(this.resources.invoice_reissue, 'update'),

    check('invoice_info.invoice_combclient_id')
      .notEmpty()
      .withMessage('Enter client id'),

    check('invoice_info.invoice_sales_man_id')
      .notEmpty()
      .withMessage('Enter sales man id'),
    check('invoice_info.invoice_sales_date')
      .notEmpty()
      .withMessage('Date is required')
      .toDate(),
    check('invoice_info.invoice_due_date').optional().toDate(),
    check('invoice_info.invoice_sub_total')
      .notEmpty()
      .isInt()
      .withMessage('Field is required'),
    check('invoice_info.invoice_net_total')
      .notEmpty()
      .isInt()
      .withMessage('Field is required'),
    check('invoice_info.invoice_total_profit')
      .notEmpty()
      .withMessage('Invoice total profit is required!')
      .isFloat()
      .withMessage('Invoice total profit must be an integer'),
    check('invoice_info.invoice_total_vendor_price')
      .notEmpty()
      .isInt()
      .withMessage('Field is required'),
    check('invoice_info.invoice_created_by')
      .notEmpty()
      .isInt()
      .withMessage('Field is required'),

    check('ticketInfo.*.ticket_details.airticket_ticket_no')
      .notEmpty()
      .withMessage('Enter Air-ticket number')
      .isLength({ max: 30 })
      .withMessage('Source title can be at most 30 characters'),

    check('ticketInfo.*.ticket_details.airticket_client_price')
      .notEmpty()
      .withMessage('Enter Air-ticket client price')
      .isInt()
      .withMessage('Enter integer value'),
    check('ticketInfo.*.ticket_details.airticket_purchase_price')
      .notEmpty()
      .withMessage('Purchase price is required!')
      .isFloat()
      .withMessage('Purchase price must be integer'),

    check('ticketInfo.*.ticket_details.airticket_comvendor')
      .notEmpty()
      .withMessage('Vendor is  required!'),
    check('ticketInfo.*.ticket_details.airticket_airline_id')
      .notEmpty()
      .isInt()
      .withMessage('This is feild is required and it must be an integer'),
    check('ticketInfo.*.ticket_details.airticket_profit')
      .notEmpty()
      .withMessage('Enter Air-ticket profit')
      .isNumeric()
      .withMessage('Enter Numeric value'),

    check('ticketInfo.*.ticket_details.airticket_route_or_sector')
      .optional()
      .isLength({ max: 100 })
      .withMessage('Source title can be at most 100 characters'),

    check('ticketInfo.*.ticket_details.airticket_pnr')
      .optional()
      .isLength({ max: 30 })
      .withMessage('Source title can be at most 30 characters'),
    check('ticketInfo.*.ticket_details.airticket_issue_date')
      .optional()
      .toDate(),
    check('ticketInfo.*.ticket_details.airticket_journey_date')
      .optional()
      .toDate(),
    check('ticketInfo.*.ticket_details.airticket_return_date')
      .optional()
      .toDate(),
    check('ticketInfo.*.flight_details.*.fltdetails_fly_date')
      .optional()
      .toDate(),
    check('ticketInfo.*.pax_passport.*.passport_date_of_expire')
      .optional()
      .isISO8601()
      .toDate(),
    check('ticketInfo.*.pax_passport.*.passport_date_of_issue')
      .optional()
      .isISO8601()
      .toDate(),
    check('ticketInfo.*.pax_passport.*.passport_date_of_birth')
      .optional()
      .isISO8601()
      .toDate(),
  ];

  reissueRefundCreate = [
    check('comb_client').isString(),
    check('invoice_id').isInt(),
    check('ticket_info').isArray().notEmpty(),
    check('ticket_info.*.airticket_id').isInt(),
    check('ticket_info.*.airticket_client_price').isFloat(),
    check('ticket_info.*.airticket_purchase_price').isFloat(),
    check('ticket_info.*.comb_vendor').isString(),
    check('ticket_info.*.client_refund').isFloat(),
    check('ticket_info.*.vendor_refund').isFloat(),
    check('ticket_info.*.client_charge').optional().isFloat(),
    check('ticket_info.*.vendor_charge').optional().isFloat(),
    check('client_total_refund').isFloat(),
    check('client_refund_type').isIn(['Adjust', 'Return']),
    check('total_vendor_refund').isFloat(),
    check('vendor_refund_type').isIn(['Adjust', 'Return']),
    check('vendor_payment_method').optional().isInt(),
    check('vendor_payment_acc_id').optional().isInt(),
    check('client_payment_acc_id').optional().isInt(),
    check('client_payment_method').optional().isInt(),
    check('refund_date').isString().toDate(),
    check('created_by').isInt(),
  ];
}

export default ReissueAirticket;
