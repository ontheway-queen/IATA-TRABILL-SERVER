import { check } from 'express-validator';
import AbstractValidator from '../../../abstracts/abstract.validators';

class PayrollValidator extends AbstractValidator {
  readPayroll = [this.permissions.check(this.resources.payroll, 'read')];

  createPayroll = [
    this.permissions.check(this.resources.payroll, 'create'),
    check('payroll_employee_id')
      .isInt()
      .withMessage('Must be an integer value'),
    check('payroll_account_id')
      .optional()
      .isInt()
      .withMessage('Must be an integer value'),
    check('payroll_pay_type').isInt().withMessage('Must be an integer value'),
    check('payroll_salary').optional(),
    check('payroll_net_amount').isInt().withMessage('Must be an integer value'),
    check('payroll_date')
      .isString()
      .withMessage('Must be a string value')
      .toDate(),
    check('payroll_created_by').isInt().withMessage('must be integer value'),
    check('cheque_withdraw_date').toDate(),
    check('payroll_deductions.*.pd_amount').isDecimal().optional(),
    check('payroll_deductions.*.pd_reason').isString().optional(),
    check('payroll_other1').isString().optional(),
    check('payroll_other2').isString().optional(),
    check('payroll_other3').isString().optional(),
  ];

  updatePayroll = [
    this.permissions.check(this.resources.payroll, 'update'),
    check('payroll_employee_id')
      .toInt()
      .isInt()
      .withMessage('Must be an integer value'),
    check('payroll_account_id')
      .optional()
      .isInt()
      .withMessage('Must be an integer value'),
    check('payroll_pay_type').isInt().withMessage('Must be an integer value'),
    check('payroll_salary').optional(),
    check('payroll_net_amount')
      .isFloat()
      .withMessage('Must be an integer value'),
    check('payroll_date').toDate(),
    check('payroll_updated_by').isInt().withMessage('must be integer value'),
    check('cheque_withdraw_date').toDate(),
    check('payroll_deductions.*.pd_id').isInt().optional(),
    check('payroll_deductions.*.pd_amount').isDecimal().optional(),
    check('payroll_deductions.*.pd_reason').isString().optional(),
    check('payroll_deductions.*.is_deleted').isInt().isIn([0, 1]).optional(),
    check('payroll_other1').isString().optional(),
    check('payroll_other2').isString().optional(),
    check('payroll_other3').isString().optional(),
  ];

  deletePayroll = [
    this.permissions.check(this.resources.payroll, 'delete'),
    check('payroll_deleted_by').isInt().withMessage('Must be an Integer value'),
  ];

  restorePayroll = [
    this.permissions.check(this.resources.payroll, 'update'),
    check('payroll_account_id').isInt().withMessage('Must be an integer value'),
    check('payroll_restored_by')
      .isInt()
      .withMessage('Must be an integer value'),
  ];
}
export default PayrollValidator;
