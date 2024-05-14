import { check, param } from 'express-validator';
import AbstractValidator from '../../../../abstracts/abstract.validators';
import { commonAirticketValidator } from './commonAirticket.validator';

class InvoiceAirticketValidators extends AbstractValidator {
  readInvoiceAirticket = [
    this.permissions.check(this.resources.invoice_airticket, 'read'),
  ];
  voidAirticket = [
    this.permissions.check(this.resources.invoice_airticket, 'delete'),
    check('invoice_void_date').notEmpty().toDate(),
  ];

  deleteInvoiceAirticket = [
    this.permissions.check(this.resources.invoice_airticket, 'delete'),
    check('invoice_has_deleted_by')
      .notEmpty()
      .isNumeric()
      .withMessage('Please enter admin or user id'),
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
      .withMessage('Please provide right search type'),
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

  public createInvoiceInfo = [
    this.permissions.check(this.resources.invoice_airticket, 'create'),
    check('ti_invoice_id').isInt().notEmpty(),
    check('ti_invoice_total_due').isDecimal().optional(),
    check('ti_net_total').isDecimal().optional(),
    check('ti_sub_total').isDecimal().optional(),
    check('ti_total_discount').isDecimal().optional(),
    check('ti_total_payment').isDecimal().optional(),
    check('infos.*.tii_billing_id').isInt().optional(),
    check('infos.*.tii_airticket_id').isInt().optional(),
    check('infos.*.tii_airticket_no').isString().optional(),
    check('infos.*.tii_airticket_discount').isDecimal().optional(),
    check('infos.*.tii_airticket_class').isString().optional(),
    check('infos.*.tii_airticket_class_type').isString().optional(),
    check('infos.*.tii_airticket_pnr').isString().optional(),
    check('infos.*.tii_airticket_route').isString().optional(),
    check('infos.*.tii_total_discount').isDecimal().optional(),
    check('infos.*.tii_product_name').isString().optional(),
    check('infos.*.tii_pax_name').isString().optional(),
    check('infos.*.tii_quantity').isInt().optional(),
    check('infos.*.tii_unit_price').isDecimal().optional(),
    check('infos.*.tii_sub_total').isDecimal().optional(),
    check('infos.*.tii_visiting_country').isString().optional(),
    check('infos.*.tii_visa_type').isString().optional(),
    check('infos.*.tii_token_no').isString().optional(),
    check('infos.*.tii_status').isString().optional(),
    check('infos.*.tii_journey_date').toDate().optional(),
    check('infos.*.tii_total_room').isInt().optional(),
  ];
}

export default InvoiceAirticketValidators;
