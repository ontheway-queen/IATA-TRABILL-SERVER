import { check, param, query } from 'express-validator';
import AbstractValidator from '../../../../abstracts/abstract.validators';

class InvoiceHajjPreRegValidators extends AbstractValidator {
  commonRead = [
    this.permissions.check(this.resources.invoice_hajj_pre_reg, 'read'),
  ];
  commonUpdate = [
    this.permissions.check(this.resources.invoice_hajj_pre_reg, 'update'),
  ];
  commonDelete = [
    this.permissions.check(this.resources.invoice_hajj_pre_reg, 'delete'),
    check('invoice_has_deleted_by')
      .notEmpty()
      .withMessage('Pleace porvide who went to delete'),
  ];

  hajiTrackingSerialCheck = [
    this.permissions.check(this.resources.invoice_hajj_pre_reg, 'read'),

    check('data_for')
      .notEmpty()
      .isIn(['tracking', 'serial'])
      .withMessage('Data check onely for tracking or serial'),
    check('value').notEmpty().withMessage('How can you check without value'),
  ];

  postInvoiceHajjPreReg = [
    this.permissions.check(this.resources.invoice_hajj_pre_reg, 'create'),

    check('invoice_no')
      .notEmpty()
      .withMessage('Pleace provide your valid invoice number'),

    check('invoice_combclient_id').notEmpty().withMessage('Enter client id'),

    check('invoice_sales_man_id').notEmpty().withMessage('Enter sales man id'),
    check('invoice_sales_date')
      .notEmpty()
      .isDate()
      .withMessage('Date is required'),
    check('invoice_due_date').optional().toDate(),
    check('invoice_sub_total')
      .notEmpty()
      .isInt()
      .withMessage('Field is required'),
    check('invoice_net_total')
      .notEmpty()
      .isInt()
      .withMessage('Field is required'),

    check('invoice_created_by')
      .notEmpty()
      .isInt()
      .withMessage('Field is required'),

    check('haji_information.*.haji_info_reg_year')
      .notEmpty()
      .withMessage('Field is required'),

    check('billing_information.*.billing_product_id')
      .notEmpty()
      .isInt()
      .withMessage('Field is required'),

    check('billing_information.*.billing_unit_price')
      .notEmpty()
      .isInt()
      .withMessage('Field is required'),
  ];
  editInvoiceHajjPreReg = [
    this.permissions.check(this.resources.invoice_hajj_pre_reg, 'create'),

    check('invoice_no')
      .notEmpty()
      .withMessage('Pleace provide your valid invoice number'),

    check('invoice_combclient_id').notEmpty().withMessage('Enter client id'),

    check('invoice_sales_man_id').notEmpty().withMessage('Enter sales man id'),
    check('invoice_sales_date')
      .notEmpty()
      .isDate()
      .withMessage('Date is required'),
    check('invoice_due_date').optional().toDate(),
    check('invoice_sub_total')
      .notEmpty()
      .isInt()
      .withMessage('Field is required'),
    check('invoice_net_total')
      .notEmpty()
      .withMessage('Invoice net total must be provide'),

    check('invoice_created_by')
      .notEmpty()
      .isInt()
      .withMessage('Field is required'),

    check('haji_information.*.haji_info_reg_year')
      .notEmpty()
      .withMessage('Field is required'),

    check('billing_information.*.billing_product_id')
      .notEmpty()
      .isInt()
      .withMessage('Field is required'),

    check('billing_information.*.billing_unit_price')
      .notEmpty()
      .isInt()
      .withMessage('Field is required'),
  ];

  updateHajjiInfoStatus = [
    this.permissions.check(this.resources.invoice_hajj_pre_reg, 'update'),
    check('updated_by')
      .notEmpty()
      .withMessage('Please provide updated by')
      .isInt()
      .withMessage('update_by must be an integer value'),
    query('status')
      .notEmpty()
      .withMessage('Please provide hajji info status')
      .isIn(['approved', 'canceled'])
      .withMessage('hajji info status must be in approved or canceled'),
  ];
}

export default InvoiceHajjPreRegValidators;
