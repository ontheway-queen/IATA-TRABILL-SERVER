import { check } from 'express-validator';
import AbstractValidator from '../../../../abstracts/abstract.validators';
import { moneyReceiptValidator } from '../../../../common/validators/moneyreceipt.validator';
import { commonInvoiceVisaValidator } from './commonInvoiceVisa.validator';

class InvoiceVisaValidators extends AbstractValidator {
  readInvoiceVisa = [
    this.permissions.check(this.resources.invoice_visa, 'read'),
  ];

  updateVisaStatus = [
    check('status')
      .notEmpty()
      .isIn(['Approved', 'Rejected'])
      .withMessage('Status must be Approved or Rejected'),
  ];

  deleteInvoiceVisa = [
    this.permissions.check(this.resources.invoice_visa, 'delete'),
    check('invoice_has_deleted_by')
      .notEmpty()
      .withMessage('Pleace provide admin id invoice_has_deleted_by'),
  ];

  addInvoiceVisa = [
    this.permissions.check(this.resources.invoice_visa, 'create'),
    ...moneyReceiptValidator,
    ...commonInvoiceVisaValidator,
  ];

  editInvoice = [
    this.permissions.check(this.resources.invoice_visa, 'update'),
    ...commonInvoiceVisaValidator,
  ];
}

export default InvoiceVisaValidators;
