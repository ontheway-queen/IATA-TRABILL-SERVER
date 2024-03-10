import { check, param } from 'express-validator';
import AbstractValidator from '../../../../abstracts/abstract.validators';
import { commonAirticketValidator } from './commonAirticket.validator';

class InvoiceAirticketValidators extends AbstractValidator {
  readInvoiceAirticket = [
    this.permissions.check(this.resources.invoice_airticket, 'read'),
  ];
  voidAirticket = [
    this.permissions.check(this.resources.invoice_airticket, 'delete'),
    check('invoice_has_deleted_by')
      .notEmpty()
      .withMessage('User id is required'),
    check('void_charge').notEmpty().withMessage('Void charge is required'),
  ];

  deleteInvoiceAirticket = [
    this.permissions.check(this.resources.invoice_airticket, 'delete'),
    check('invoice_has_deleted_by')
      .notEmpty()
      .isNumeric()
      .withMessage('Pleace enter admin or user id'),
  ];

  readEditData = [
    ...this.readInvoiceAirticket,
    param('invoice')
      .exists()
      .isInt()
      .withMessage('Must provide invoice no as params'),
  ];

  validateSearchRequest = [
    check('search_type')
      .exists()
      .withMessage('search_type is required')
      .isIn(['invoice_no', 'ticket_no', 'money_receipt', 'PNR'])
      .withMessage('Pleace provide right search type'),
    check('search_text')
      .exists()
      .withMessage('search_text is required')
      .custom((value) => {
        // Check if search_text is a number or a string
        if (typeof value !== 'number' && typeof value !== 'string') {
          throw new Error('search_text must be a number or a string');
        }
        return true;
      }),
  ];

  postInvoiceAirticket = [
    this.permissions.check(this.resources.invoice_airticket, 'create'),

    ...commonAirticketValidator,
  ];

  editInvoice = [
    this.permissions.check(this.resources.invoice_airticket, 'update'),

    ...commonAirticketValidator,
  ];

  // AIR TICKET TAX REFUND
  validateTaxRefund = [
    check('refund_invoice_id').isInt(),
    check('refund_date').toDate(),
    check('comb_client').isString(),
    check('ticket_info').isArray().notEmpty(),
    check('ticket_info.*.airticket_id').isInt(),
    check('ticket_info.*.comb_vendor').isString(),
    check('ticket_info.*.refund_tax_amount').isNumeric(),
    check('client_refund_type').isIn(['Return', 'Adjust']),
    check('vendor_refund_type').isIn(['Return', 'Adjust']),
    check('client_pay_type').isIn([1, 2, 3]).optional(),
    check('vendor_pay_type').isIn([1, 2, 3]).optional(),
    check('client_account_id').isInt().optional(),
    check('vendor_account_id').isInt().optional(),
    check('client_total_tax_refund').isNumeric(),
    check('vendor_total_tax_refund').isNumeric(),
  ];
}

export default InvoiceAirticketValidators;
