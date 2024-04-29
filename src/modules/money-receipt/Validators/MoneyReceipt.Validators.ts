import { check } from 'express-validator';
import AbstractValidator from '../../../abstracts/abstract.validators';

class InvoiceCostValidators extends AbstractValidator {
  readMoneyReceipt = [
    this.permissions.check(this.resources.money_receipt, 'read'),
  ];
  commonUpdate = [
    this.permissions.check(this.resources.money_receipt, 'update'),
  ];
  commonDelete = [
    this.permissions.check(this.resources.money_receipt, 'delete'),
    check('receipt_deleted_by')
      .notEmpty()
      .withMessage('Please porvide who went to delete'),
  ];

  /**
   * @Invoice_Hajj_Post
   *
   */

  addInvoiceMoneyReceipt = [
    this.permissions.check(this.resources.money_receipt, 'create'),

    check('invoice_combclient_id')
      .notEmpty()
      .withMessage('Client is required')
      .isString(),

    check('invoice_created_by')
      .notEmpty()
      .withMessage('Please provide user id'),

    check('money_receipt.receipt_payment_type')
      .notEmpty()
      .withMessage('Please provide payment method'),

    check('money_receipt.account_id')
      .optional()
      .isInt()
      .withMessage('Please provide account id'),

    check('money_receipt.receipt_payment_date')
      .notEmpty()
      .withMessage('Payment date not be empty')
      .toDate(),

    check('money_receipt.invoice_agent_id')
      .optional()
      .isInt()
      .withMessage('Agent id must be integer'),
    check('money_receipt.invoice_agent_com_amount')
      .optional()
      .isInt()
      .withMessage('Agent id must be integer')
      .toFloat(),
  ];
  chequeStatusUpdate = [
    this.permissions.check(this.resources.money_receipt, 'create'),

    check('created_by').notEmpty().withMessage('Please provide user id'),
    check('receipt_id').notEmpty().withMessage('Please provide receipt_id'),
    check('payment_date').notEmpty().withMessage('Please provide payment_date'),
    check('cheque_status')
      .notEmpty()
      .isIn(['DEPOSIT', 'BOUNCE', 'RETURN'])
      .withMessage('Cheque status cannot valid'),
  ];

  commonMoneyReceiptFields = [
    check('receipt_combclient')
      .notEmpty()
      .withMessage('client is required')
      .isString(),
    check('receipt_payment_to')
      .isIn(['INVOICE', 'TICKET', 'OVERALL'])
      .notEmpty(),
    check('receipt_total_amount').isNumeric().notEmpty(),
    check('receipt_payment_type').isNumeric().notEmpty(),
    check('receipt_payment_date').isDate().notEmpty().toDate(),
    check('receipt_note').optional().isString(),
    // account_id is required when receipt_payment_type is 1
    check('account_id').optional().isInt(),

    check('cheque_number').optional(),
    check('cheque_withdraw_date').optional().isDate(),
    check('cheque_bank_name').optional().notEmpty(),
    check('receipt_created_by').isNumeric().notEmpty(),
    check('trans_no').optional().notEmpty(),
    check('invoices').optional().isArray(),
    check('invoices.*.invoice_id').isNumeric().notEmpty(),
    check('invoices.*.invoice_amount').isNumeric().notEmpty(),
    check('tickets').optional().isArray(),
    check('tickets.*.ticket_no').notEmpty(),
    check('tickets.*.invoice_id').isNumeric().notEmpty(),
    check('tickets.*.invoice_amount').isNumeric().notEmpty(),
  ];

  postMoneyReceipt = [
    this.permissions.check(this.resources.money_receipt, 'create'),

    ...this.commonMoneyReceiptFields,
  ];
  updateMoneyReceipt = [
    this.permissions.check(this.resources.money_receipt, 'update'),

    ...this.commonMoneyReceiptFields,
  ];

  agentCommissionAdd = [
    this.permissions.check(this.resources.money_receipt, 'create'),
    check('receipt_payment_type')
      .notEmpty()
      .withMessage('Please provide payment method'),
    check('receipt_agent_id')
      .notEmpty()
      .withMessage('Please provide agent id')
      .isInt()
      .withMessage('Agent id must be an integer value'),
    check('receipt_agent_amount')
      .notEmpty()
      .withMessage('Please provide agent amount'),
    check('invoice_id')
      .optional()
      .isInt()
      .withMessage('Please provide invoice id'),
    check('receipt_created_by')
      .notEmpty()
      .withMessage('Please enter receipt created by')
      .isInt()
      .withMessage('receipt created by must be an integer value'),
    check('cheque_withdraw_date').optional().toDate(),
  ];

  deleteAgentCommission = [
    this.permissions.check(this.resources.money_receipt, 'delete'),
    check('deleted_by')
      .notEmpty()
      .withMessage('Please provide who delete money receipt')
      .isInt()
      .withMessage('deleted_by must be an integer value'),
  ];

  commonAdvanceReturnFiels = [
    check('advr_combclient')
      .notEmpty()
      .withMessage('Enter client id')
      .isString(),
    check('advr_payment_type')
      .notEmpty()
      .isInt()
      .withMessage('Please provide Payment Type'),
    check('advr_created_by')
      .notEmpty()
      .isInt()
      .withMessage('Please provide who create this money receipt'),
    check('advr_account_id').optional().isInt().withMessage('Enter account id'),
    check('advr_amount')
      .isNumeric()
      .isInt()
      .notEmpty()
      .withMessage('Enter Client Amount'),
    check('advr_trxn_charge')
      .isNumeric()
      .optional()
      .withMessage('Transaction charge must be numaric'),
  ];
  postAdvanceReturn = [
    this.permissions.check(this.resources.money_receipt_advr, 'create'),
    ...this.commonAdvanceReturnFiels,
  ];
  editAdvanceReturn = [
    this.permissions.check(this.resources.money_receipt_advr, 'update'),
    ...this.commonAdvanceReturnFiels,
  ];
  advrDelete = [
    this.permissions.check(this.resources.money_receipt_advr, 'delete'),
  ];
  adveUpdate = [
    this.permissions.check(this.resources.money_receipt_advr, 'update'),
  ];
  adveRead = [
    this.permissions.check(this.resources.money_receipt_advr, 'read'),
  ];
}

export default InvoiceCostValidators;
