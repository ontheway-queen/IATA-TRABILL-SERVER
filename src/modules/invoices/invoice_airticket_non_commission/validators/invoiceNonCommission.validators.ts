import AbstractValidator from '../../../../abstracts/abstract.validators';
import { commonNonCommissionValidator } from './commonNonCommission.validator';

class InvoiceNonCommissionValidators extends AbstractValidator {
  readInvoiceNonComission = [
    this.permissions.check(this.resources.invoice_non_commission, 'read'),
  ];

  deleteInvoiceNonComission = [
    this.permissions.check(this.resources.invoice_non_commission, 'delete'),
  ];

  addInvoiceNonCommission = [
    this.permissions.check(this.resources.invoice_non_commission, 'create'),

    ...commonNonCommissionValidator,
  ];

  editInvoiceNonCommission = [
    this.permissions.check(this.resources.invoice_non_commission, 'update'),

    ...commonNonCommissionValidator,
  ];
}

export default InvoiceNonCommissionValidators;
