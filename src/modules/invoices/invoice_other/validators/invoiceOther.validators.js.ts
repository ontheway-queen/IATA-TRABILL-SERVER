import { check } from 'express-validator';
import AbstractValidator from '../../../../abstracts/abstract.validators';
import { commonInvoiceOtherValidator } from './CommonOtherInvoice.Validators';

class InvoiceOtherValidators extends AbstractValidator {
  readInvoiceOthers = [
    this.permissions.check(this.resources.invoice_other, 'read'),
  ];

  deleteInvoiceOthers = [
    this.permissions.check(this.resources.invoice_other, 'delete'),
    check('invoice_has_deleted_by')
      .notEmpty()
      .withMessage('Pleace provide admin id invoice_has_deleted_by'),
  ];

  addInvoiceOthers = [
    this.permissions.check(this.resources.invoice_other, 'create'),
    ...commonInvoiceOtherValidator,
  ];

  editInviceOthers = [
    this.permissions.check(this.resources.invoice_other, 'update'),

    ...commonInvoiceOtherValidator,
  ];
}

export default InvoiceOtherValidators;
