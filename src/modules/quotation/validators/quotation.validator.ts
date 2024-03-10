import { check } from 'express-validator';
import AbstractValidator from '../../../abstracts/abstract.validators';
import { commonInvoiceOtherValidator } from '../../invoices/invoice_other/validators/CommonOtherInvoice.Validators';

class QuotationValidator extends AbstractValidator {
  productCategory = [this.permissions.check(this.resources.quotation, 'read')];

  quotations = [this.permissions.check(this.resources.quotation, 'read')];

  deleteQuotation = [
    this.permissions.check(this.resources.quotation, 'delete'),
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
