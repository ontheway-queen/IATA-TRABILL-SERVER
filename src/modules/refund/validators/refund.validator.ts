import { check, param, query } from 'express-validator';
import AbstractValidator from '../../../abstracts/abstract.validators';

class RefundValidator extends AbstractValidator {
  readAirticket = [
    this.permissions.check(this.resources.refund_airticket, 'read'),
  ];
  getAirTicketInfos = [
    this.permissions.check(this.resources.refund_airticket, 'read'),
    check('client_id')
      .notEmpty()
      .isString()
      .withMessage('Client must be string value'),
    check('ticket_no')
      .notEmpty()
      .isArray()
      .withMessage('ticket_no must be an array'),
  ];

  deleteAirTicketRefund = [
    this.permissions.check(this.resources.refund_airticket, 'delete'),
    param('refund_id'),
    check('deleted_by').isInt().withMessage('Please add user id'),
  ];

  restoreAirTicketRefund = [
    this.permissions.check(this.resources.refund_airticket, 'update'),
    param('refund_id'),
    check('refund_restored_by')
      .isInt()
      .withMessage('Must provide refund_restored_by'),
  ];

  readOtherClient = [
    this.permissions.check(this.resources.refund_other_invoice, 'read'),
  ];

  deleteOtherRefund = [
    this.permissions.check(this.resources.refund_other_invoice, 'delete'),
    param('refund_id'),
    check('refund_deleted_by')
      .isInt()
      .withMessage('Must provide refund_deleted_by'),
  ];

  restoreOtherRefund = [
    this.permissions.check(this.resources.refund_other_invoice, 'update'),
    param('refund_id'),
    check('refund_restored_by')
      .isInt()
      .withMessage('Must provide refund_restored_by'),
  ];

  readOtherVendor = [
    this.permissions.check(this.resources.refund_other_invoice, 'read'),
  ];

  deleteOtherVendor = [
    this.permissions.check(this.resources.refund_other_invoice, 'delete'),
  ];

  restoreOtherVendor = [
    this.permissions.check(this.resources.refund_other_invoice, 'update'),
  ];

  // readTourClientRefund = [this.permissions.check(this.resources.tours, 'read')];

  readTourPakageInfo = [
    this.permissions.check(this.resources.refund_tour_package, 'read'),
  ];

  deleteTourPakage = [
    this.permissions.check(this.resources.refund_tour_package, 'delete'),
    check('refund_deleted_by')
      .notEmpty()
      .withMessage('Please enter refund_delete_by')
      .isInt()
      .withMessage('Must be an integer value'),
  ];

  createTourPackRefund = [
    check('created_by').isInt().withMessage('Must provide created_by'),
    check('invoice_id').isInt().withMessage('Must provide invoice_id'),
    check('voucher_no').isString().withMessage('Must provide voucher_no'),
    check('invoice_category_id')
      .isInt()
      .withMessage('Must provide invoice_category_id'),

    check('comb_client')
      .isString()
      .notEmpty()
      .withMessage('Must provide Client id in string format'),
    check('client_refund_info.crefund_total_amount')
      .isNumeric()
      .withMessage('Must provide total_refund_amount'),
    check('client_refund_info.crefund_charge_amount')
      .isNumeric()
      .withMessage('Must provide total_refund_charge'),
    check('client_refund_info.crefund_return_amount')
      .isNumeric()
      .withMessage('return_amount must be numeric'),
    check('client_refund_info.crefund_payment_type')
      .isIn(['MONEY_RETURN', 'ADJUST'])
      .withMessage('must be either MONEY_RETURN or ADJUST'),
    check('client_refund_info.payment_method')
      .isIn([1, 2, 3, 4])
      .optional()
      .withMessage('must be either 1, 2, 3, 4'),
    check('client_refund_info.crefund_account_id')
      .isInt()
      .optional()
      .withMessage('crefund_account_id must be int'),
    check('client_refund_info.cheque_no')
      .isString()
      .optional()
      .withMessage('cheque_no must be string'),
    check('client_refund_info.date')
      .isDate({ format: 'YYYY-MM-DD' })
      .notEmpty()
      .withMessage('date must be in the format of YYYY-MM-DD'),
    check('client_refund_info.withdraw_date')
      .isDate({ format: 'YYYY-MM-DD' })
      .optional()
      .withMessage('withdraw_date must be in the format of YYYY-MM-DD'),
    check('client_refund_info.bank_name')
      .isString()
      .optional()
      .withMessage('bank_name must be string'),
  ];

  readInvoicesById = [
    this.permissions.check(this.resources.refund_other_invoice, 'read'),
  ];

  readManualRefunds = [
    this.permissions.check(this.resources.refund_other_invoice, 'read'),
  ];

  deleteManualRefund = [
    this.permissions.check(this.resources.refund_other_invoice, 'delete'),
    check('refund_deleted_by')
      .notEmpty()
      .withMessage('Please provide deleted by')
      .isInt()
      .withMessage('Must be an integer value'),
  ];

  restoreManualRefund = [
    this.permissions.check(this.resources.refund_other_invoice, 'update'),
    check('refund_restored_by')
      .notEmpty()
      .withMessage('Please provide restored by')
      .isInt()
      .withMessage('Must be an integer value'),
  ];

  /**
   * validator for `airticket refund` router
   */
  addAirTicketRefund = [
    this.permissions.check(this.resources.refund_airticket, 'create'),
    check('comb_client')
      .notEmpty()
      .isString()
      .withMessage('Client must be string value'),
    check('created_by').notEmpty().withMessage('Pleace add user id'),
    check('invoice_id').notEmpty().withMessage('Pleace add invoice id'),
    check('client_refund_info.crefund_payment_type')
      .isIn(['MONEY_RETURN', 'ADJUST'])
      .withMessage('must provide  client refund payment type'),
    check('client_refund_info.crefund_total_amount')
      .isNumeric()
      .withMessage('must provide  client refund total amount'),
    check('client_refund_info.crefund_charge_amount')
      .isNumeric()
      .withMessage('must provide client refund charge amount'),
    check('client_refund_info.crefund_return_amount')
      .isNumeric()
      .withMessage('must provide valid client refund return amount')
      .optional(),

    check('client_refund_info.type_id')
      .optional()
      .isInt()
      .withMessage('must provide valid refund chanrge amount'),
    check('client_refund_info.account_id')
      .optional()
      .isInt()
      .withMessage('refund chanrge amount'),
    check('client_refund_info.payment_type')
      .isIn(['CASH', 'CHEQUE'])
      .optional()
      .withMessage('must provide valid payment type'),

    check('client_refund_info.cheque_no')
      .isString()
      .optional()
      .withMessage('must provide valid cheque no'),
    check('client_refund_info.bank_name')
      .isString()
      .optional()
      .withMessage('must provide valid bank name'),

    check('vendor_refund_info.*.airticket_id')
      .isInt()
      .withMessage('must provide airticket id'),

    check('vendor_refund_info.*.airticket_vendor_id')
      .isString()
      .withMessage('must provide airticket vendor id')
      .optional(),
    check('vendor_refund_info.*.airticket_vendor_combine_id')
      .isString()
      .withMessage('must provide airticket vendor combine id')
      .optional(),

    check('vendor_refund_info.*.vrefund_charge_amount')
      .isNumeric()
      .withMessage('must provide vendor charge '),

    check('vendor_refund_info.*.vrefund_payment_type')
      .isIn(['MONEY_RETURN', 'ADJUST'])
      .withMessage('must provide vendor payment '),
    check('vendor_refund_info.*.vrefund_return_amount')
      .isNumeric()
      .withMessage('Must provide valid vrefund_return_amount')
      .optional(),
    check('vendor_refund_info.*.vrefund_adjust_amount')
      .isNumeric()
      .withMessage('must provide valid vrefund_adjust_amount')
      .optional(),
    check('vendor_refund_info.*.vrefund_total_amount')
      .isNumeric()
      .withMessage('must provide valid refund total amount'),
    check('vendor_refund_info.*.type_id')
      .isNumeric()
      .withMessage('must provide as valid type_id')
      .optional(),
    check('vendor_refund_info.*.account_id')
      .isNumeric()
      .withMessage('must provide as valid account_id')
      .optional(),
    check('vendor_refund_info.*.payment_type')
      .isIn(['CASH', 'CHEQUE'])
      .withMessage('must provide a valid payment type')
      .optional(),
    check('vendor_refund_info.*.cheque_no')
      .notEmpty()
      .withMessage('must provide as valid cheque_no')
      .optional(),
    check('vendor_refund_info.*.bank_name')
      .notEmpty()
      .withMessage('must provide as valid bank_name')
      .optional(),
    check('vendor_refund_info.*.withdraw_date')
      .notEmpty()
      .withMessage('must provide as valid withdraw_date')
      .optional(),
  ];

  /**
   * validator for `refund other client` router
   */
  addOtherRefund = [
    this.permissions.check(this.resources.refund_other_invoice, 'create'),
    check('created_by').isInt(),
    check('invoice_id').isInt(),
    check('voucher_no').isString(),
    check('date').optional().toDate(),
    check('comb_client').notEmpty().withMessage('Must Provide valid client ID'),
    check('client_refund_info.total_refund_amount')
      .isNumeric()
      .withMessage('Must Provide total_refund_amount'),
    check('client_refund_info.total_refund_charge')
      .isNumeric()
      .withMessage('Must Provide total_refund_charge'),
    check('client_refund_info.total_return_amount')
      .isNumeric()
      .withMessage('Must Provide return_amount'),
    check('client_refund_info.crefund_payment_type')
      .isIn(['MONEY_RETURN', 'ADJUST'])
      .withMessage(
        'crefund_payment_type Must be either MONEY_RETURN or ADJUST'
      ),
    check('client_refund_info.money_return_type')
      .isInt()
      .withMessage('money return type must be an integer value')
      .optional(),

    check('client_refund_info.account_id')
      .isInt()
      .withMessage('account_id Must be an integer value')
      .optional(),

    check('client_refund_info.cheque_no')
      .isString()
      .withMessage('cheque_no Must be an string value')
      .optional(),

    check('client_refund_info.bank_name')
      .isString()
      .withMessage('bank_name Must be an string value')
      .optional(),

    check('client_refund_info.withdraw_date')
      .isString()
      .withMessage('withdraw_date Must be an string value')
      .optional(),

    check('vendor_refund_info.*.comb_vendor_id')
      .isString()
      .withMessage('billing_id Must be an integer value'),

    check('vendor_refund_info.*.vrefund_bill_id')
      .isInt()
      .withMessage('billing_id Must be an integer value'),

    check('vendor_refund_info.*.vrefund_quantity')
      .isInt()
      .withMessage('billing_quantity Must be an integer value')
      .notEmpty()
      .withMessage('Please provide refund quantity'),

    check('vendor_refund_info.*.billing_remaining_quantity')
      .isInt()
      .withMessage('billing_remaining_quantity Must be an integer value')
      .notEmpty()
      .withMessage('Please provide billing remaining quantity'),

    check('vendor_refund_info.*.vrefund_product_id')
      .isInt()
      .withMessage('billing_product_id Must be an integer value'),

    check('vendor_refund_info.*.vrefund_charge')
      .isNumeric()
      .withMessage('refund_charge Must be an integer value'),

    check('vendor_refund_info.*.vrefund_amount')
      .isNumeric()
      .withMessage('refund_amount Must be an integer value'),

    check('vendor_refund_info.*.vrefund_return_amount')
      .isNumeric()
      .withMessage('return_amount Must be an integer value'),

    check('vendor_refund_info.*.vrefund_invoice_category_id')
      .isInt()
      .withMessage('vrefund_invoice_category_id Must be an integer value'),

    check('vendor_refund_info.*.vrefund_payment_type')
      .isIn(['MONEY_RETURN', 'ADJUST'])
      .withMessage('refund_payment_type Must be either MONEY_RETURN or ADJUST'),

    check('vendor_refund_info.*.type_id')
      .isInt()
      .withMessage('type_id Must be an integer value')
      .optional(),
    check('vendor_refund_info.*.vrefund_account_id')
      .isInt()
      .withMessage('account_id Must be an integer value')
      .optional(),
    check('vendor_refund_info.*.cheque_no')
      .isString()
      .withMessage('cheque_no Must be a string value')
      .optional(),

    check('vendor_refund_info.*.bank_name')
      .isString()
      .withMessage('bank_name Must be a string value')
      .optional(),

    check('vendor_refund_info.*.withdraw_date')
      .isString()
      .withMessage('withdraw_date Must be a string value')
      .optional(),
  ];

  /**
   * validator for `refund other vendor` router
   */
  addVendorRefund = [
    this.permissions.check(this.resources.refund_other_invoice, 'create'),
    check('vendor_id').isInt(),
    check('invoice_id').isInt(),
    check('vouchar_no').isString(),
    check('total_refund_charge').isInt(),
    check('net_total').isInt(),
    check('refund_payment_type').isIn(['MONEY_RETURN', 'ADJUST']),
    check('payment_type').isIn(['CASH', 'CHEQUE']).optional(),
    check('refund_info.*.billing_invoice_id').isInt(),
    check('refund_info.*.billing_product_id').isInt(),
    check('refund_info.*.refund_quantity').isInt(),
    check('refund_info.*.refund_charge').isInt(),
    check('refund_info.*.refund_amount').isInt(),
    check('refund_info.*.refund_price').isInt(),
  ];

  /**
   * manual refunds
   */
  createManualRefund = [
    this.permissions.check(this.resources.refund_other_invoice, 'create'),

    check('refund_invoice_id')
      .isInt()
      .withMessage('Must Provide an Invoice ID'),
    check('refund_created_by')
      .isInt()
      .withMessage('Must Provide Refund Created By'),
    check('refund_client_info.client_id')
      .isInt()
      .withMessage('Must Provide an Integer value')
      .optional(),
    check('refund_client_info.client_refund_amount')
      .isNumeric()
      .withMessage('Must Provide an Numeric value')
      .optional(),
    check('refund_client_info.client_refund_total')
      .isNumeric()
      .withMessage('Must Provide an Numeric value')
      .optional(),
    check('refund_client_info.client_refund_charge')
      .isNumeric()
      .withMessage('Must Provide an Numeric value')
      .optional(),
    check('refund_client_info.client_refund_type')
      .isIn(['ADJUST', 'MONEY_RETURN'])
      .withMessage('Either ADJUST or MONEY_RETURN')
      .optional(),
    check('refund_client_info.client_money_return_type')
      .isIn(['CASH', 'CHEQUE'])
      .withMessage('Either ADJUST or MONEY_RETURN')
      .optional(),
    check('refund_client_info.client_money_receipt_amount')
      .isNumeric()
      .withMessage('Must Provide an Numeric value')
      .optional({ nullable: true }),
    check('refund_client_info.crcheque_cheque_no').isString().optional(),
    check('refund_client_info.crcheque_withdraw_date')
      .isDate({ format: 'YYYY-MM-DD' })
      .withMessage('Must be in the format of YYYY-MM-DD')
      .optional(),
    check('refund_client_info.crefund_date')
      .isDate({ format: 'YYYY-MM-DD' })
      .withMessage('Must be in the format of YYYY-MM-DD')
      .optional(),
    check('refund_client_info.crcheque_bank_name').isString().optional(),
    check('refund_client_info.crcheque_note').isString().optional(),
    check('refund_client_info.caccount_type_id')
      .isInt()
      .withMessage('Must Be an Integer value')
      .optional(),
    check('refund_client_info.caccount_id')
      .isInt()
      .withMessage('Must Be an Integer value')
      .optional(),
    check('refund_client_info.crefund_note').isString().optional(),
    check('refund_vendor_info.vendor_id')
      .isInt()
      .withMessage('Must Provide an Integer value')
      .optional(),
    check('refund_vendor_info.vendor_refund_amount')
      .isNumeric()
      .withMessage('Must Provide an Numeric value')
      .optional(),
    check('refund_vendor_info.vendor_refund_total')
      .isNumeric()
      .withMessage('Must Provide an Numeric value')
      .optional(),
    check('refund_vendor_info.vendor_refund_charge')
      .isNumeric()
      .withMessage('Must Provide an Numeric value')
      .optional(),
    check('refund_vendor_info.vendor_refund_type')
      .isIn(['ADJUST', 'MONEY_RETURN'])
      .withMessage('Either ADJUST or MONEY_RETURN')
      .optional(),
    check('refund_vendor_info.vendor_money_return_type')
      .isIn(['CASH', 'CHEQUE'])
      .withMessage('Either ADJUST or MONEY_RETURN')
      .optional(),
    check('refund_vendor_info.vrcheque_cheque_no').isString().optional(),
    check('refund_vendor_info.vrcheque_withdraw_date')
      .isDate({ format: 'YYYY-MM-DD' })
      .withMessage('Must be in the format of YYYY-MM-DD')
      .optional(),
    check('refund_vendor_info.vrefund_date')
      .isDate({ format: 'YYYY-MM-DD' })
      .withMessage('Must be in the format of YYYY-MM-DD')
      .optional(),
    check('refund_vendor_info.vrcheque_bank_name').isString().optional(),
    check('refund_vendor_info.vrcheque_note').isString().optional(),
    check('refund_vendor_info.vaccount_type_id')
      .isInt()
      .withMessage('Must Be an Integer value')
      .optional(),
    check('refund_vendor_info.vaccount_id')
      .isInt()
      .withMessage('Must Be an Integer value')
      .optional(),
    check('refund_vendor_info.vrefund_note').isString().optional(),
  ];

  viewAllVisaHalfRefunds = [
    this.permissions.check(this.resources.refund_other_invoice, 'read'),
  ];

  createAirTicketHalfRefund = [
    this.permissions.check(this.resources.refund_other_invoice, 'create'),
    check('refund_invoice_id').isInt().withMessage('Must be an integer value'),
    check('refund_client_id').isInt().withMessage('Must be an integer value'),
    check('refund_vendor_id').isInt().withMessage('Must be an integer value'),
    check('refund_client_refund_amount')
      .isInt()
      .withMessage('Must be an integer value')
      .isLength({ max: 14 })
      .withMessage('client refund amount maximum 14 charecter'),
    check('refund_client_service_charge')
      .optional()
      .isInt()
      .withMessage('Must be an integer value')
      .isLength({ max: 12 })
      .withMessage('client service charge maximum 12 charecter'),
    check('refund_vendor_refund_amount')
      .isInt()
      .withMessage('Must be an integer value')
      .isLength({ max: 14 })
      .withMessage('vendor refund amount maximum 14 charecter'),
    check('refund_vendor_service_charge')
      .optional()
      .isInt()
      .withMessage('Must be an integer value')
      .isLength({ max: 12 })
      .withMessage('vendor service charge maximum 12 charecter'),
    check('refund_account_id').isInt().withMessage('Must be an integer value'),
    check('refund_created_by').isInt().withMessage('Must be an integer value'),
  ];

  deleteAitHalfRefund = [
    this.permissions.check(this.resources.refund_other_invoice, 'delete'),
  ];

  restoredAitHalfRefund = [
    this.permissions.check(this.resources.refund_other_invoice, 'update'),
  ];

  readAitHalfRefund = [
    this.permissions.check(this.resources.refund_other_invoice, 'read'),
  ];

  viewCheques = [
    this.permissions.check(this.resources.refund_other_invoice, 'read'),
    query('status')
      .isIn(['DEPOSIT', 'PENDING', 'BOUNCE', 'RETURN'])
      .withMessage('cheque status must be PENDING | DEPOSIT | BOUNCE | RETURN'),
  ];

  updateChequeStatus = [
    this.permissions.check(this.resources.refund_other_invoice, 'update'),
    query('status')
      .isIn(['DEPOSIT', 'BOUNCE', 'RETURN'])
      .withMessage('cheque status must be DEPOSIT | BOUNCE | RETURN'),
    check('account_id')
      .optional()
      .isInt()
      .withMessage('Account Id must be an integer value'),
    check('cheque_amount')
      .optional()
      .isFloat()
      .withMessage('Please provide valid cheque amount'),
    check('created_by')
      .notEmpty()
      .isInt()
      .withMessage('Created By must be an integer value'),
  ];

  addPersialRefund = [
    this.permissions.check(this.resources.refund_module, 'create'),
    check('invoice_id')
      .isInt()
      .withMessage('invoice id must be an integer value'),
    check('comb_client').notEmpty().withMessage('Please enter comb client'),
    check('created_by')
      .isInt()
      .withMessage('created by must be an integer value'),
    check('prfnd_account_id')
      .optional()
      .isInt()
      .withMessage('account id must be an integer value'),
    check('prfnd_charge_amount').optional(),
    check('prfnd_return_amount').optional(),
    check('prfnd_total_amount').optional(),
    check('date').optional().toDate(),
    check('note').optional(),
    check('prfnd_payment_type')
      .notEmpty()
      .withMessage('Please enter payment type')
      .isIn(['ADJUST', 'MONEY_RETURN'])
      .withMessage('payment type must be ADJUST or MONEY_RETURN'),
    check('vendor_refund_info.*.vprfnd_airticket_id')
      .notEmpty()
      .withMessage('Please provide airticket id')
      .isInt()
      .withMessage('account id must be an integer value'),
    check('vendor_refund_info.*.vprfnd_account_id')
      .optional()
      .isInt()
      .withMessage('account id must be an integer value'),
    check('vendor_refund_info.*.vprfnd_payment_type')
      .notEmpty()
      .withMessage('Please enter payment type')
      .isIn(['ADJUST', 'MONEY_RETURN'])
      .withMessage('payment type must be ADJUST or MONEY_RETURN'),
    check('vendor_refund_info.*.vprfnd_charge_amount').optional(),
    check('vendor_refund_info.*.vprfnd_return_amount').optional(),
    check('vendor_refund_info.*.prfnd_profit_amount').optional(),
    check('vendor_refund_info.*.vprfnd_total_amount').optional(),
    check('vendor_refund_info.*.comb_vendor')
      .notEmpty()
      .withMessage('Please enter comb vendor'),
  ];

  deletePersialRefund = [
    this.permissions.check(this.resources.refund_module, 'delete'),
    check('deleted_by')
      .notEmpty()
      .withMessage('Please enter deleted by')
      .isInt()
      .withMessage('deleted by must be an integer value'),
  ];

  readPersialRefund = [
    this.permissions.check(this.resources.refund_module, 'read'),
  ];
}

export default RefundValidator;
