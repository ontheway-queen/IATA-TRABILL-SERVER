import { check } from 'express-validator';
import AbstractValidator from '../../../abstracts/abstract.validators';
import { commonInvoiceOtherValidator } from '../../invoices/invoice_other/validators/CommonOtherInvoice.Validators';

class QuotationValidator extends AbstractValidator {
  productCategory = [this.permissions.check(this.resources.quotation, 'read')];

  quotations = [this.permissions.check(this.resources.quotation, 'read')];

  deleteQuotation = [
    this.permissions.check(this.resources.quotation, 'delete'),
  ];

  accumulateInv = [
    this.permissions.check(this.resources.quotation, 'create'),

    check('q_number').isString().withMessage('q_number must be a string'),
    check('sales_date')
      .isISO8601()
      .toDate()
      .withMessage('sales_date must be a valid date in ISO8601 format'),
    check('discount')
      .isFloat({ min: 0 })
      .withMessage('discount must be a positive number'),
    check('payment')
      .isFloat({ min: 0 })
      .withMessage('payment must be a positive number'),
    check('comb_client')
      .isString()
      .notEmpty()
      .withMessage('comb_client cannot be empty'),
    check('invoices').isArray().withMessage('invoices must be an array'),
    check('invoices.*.invoices_id')
      .isInt({ min: 0 })
      .withMessage('invoices_id must be a positive integer'),
    check('invoices.*.category_id')
      .isInt({ min: 0 })
      .withMessage('category_id must be a positive integer'),
  ];

  /**
   * validator for `create quotation`
   */
  createQuotation = [
    this.permissions.check(this.resources.quotation, 'create'),
    check('client_id').isString().withMessage('client id must be string value'),
    check('q_number').isString(),
    check('date').isDate(),
    check('bill_info').isArray(),
    check('note').optional().isString(),
    check('discount').optional().isNumeric(),
    check('sub_total').isNumeric(),
    check('net_total').isNumeric(),
  ];

  confirmationQuotation = [
    this.permissions.check(this.resources.quotation, 'create'),
    ...commonInvoiceOtherValidator,
  ];

  /**
   * validator for `edit quotation`
   */
  editQuotation = [
    this.permissions.check(this.resources.quotation, 'update'),
    check('client_id').optional().isString(),
    check('q_number').optional().isString(),
    check('date').optional().isDate(),
    check('bill_info').optional().isArray(),
    check('note').optional().isString(),
    check('discount').optional().isNumeric(),
    check('sub_total').optional().isNumeric(),
    check('net_total').optional().isNumeric(),
  ];
}

export default QuotationValidator;
