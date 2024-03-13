"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const abstract_validators_1 = __importDefault(require("../../../abstracts/abstract.validators"));
class InvoiceCostValidators extends abstract_validators_1.default {
    constructor() {
        super(...arguments);
        this.readMoneyReceipt = [
            this.permissions.check(this.resources.money_receipt, 'read'),
        ];
        this.commonUpdate = [
            this.permissions.check(this.resources.money_receipt, 'update'),
        ];
        this.commonDelete = [
            this.permissions.check(this.resources.money_receipt, 'delete'),
            (0, express_validator_1.check)('receipt_deleted_by')
                .notEmpty()
                .withMessage('Pleace porvide who went to delete'),
        ];
        /**
         * @Invoice_Hajj_Post
         *
         */
        this.addInvoiceMoneyReceipt = [
            this.permissions.check(this.resources.money_receipt, 'create'),
            (0, express_validator_1.check)('invoice_combclient_id')
                .notEmpty()
                .withMessage('Client is required')
                .isString(),
            (0, express_validator_1.check)('invoice_created_by')
                .notEmpty()
                .withMessage('Pleace provide user id'),
            (0, express_validator_1.check)('money_receipt.receipt_payment_type')
                .notEmpty()
                .withMessage('Pleace provide payment method'),
            (0, express_validator_1.check)('money_receipt.account_id')
                .optional()
                .isInt()
                .withMessage('Pleace provide account id'),
            (0, express_validator_1.check)('money_receipt.receipt_payment_date')
                .notEmpty()
                .withMessage('Payment date not be empty')
                .toDate(),
            (0, express_validator_1.check)('money_receipt.invoice_agent_id')
                .optional()
                .isInt()
                .withMessage('Agent id must be integer'),
            (0, express_validator_1.check)('money_receipt.invoice_agent_com_amount')
                .optional()
                .isInt()
                .withMessage('Agent id must be integer')
                .toFloat(),
        ];
        this.chequeStatusUpdate = [
            this.permissions.check(this.resources.money_receipt, 'create'),
            (0, express_validator_1.check)('created_by').notEmpty().withMessage('Pleace provide user id'),
            (0, express_validator_1.check)('receipt_id').notEmpty().withMessage('Pleace provide receipt_id'),
            (0, express_validator_1.check)('payment_date').notEmpty().withMessage('Pleace provide payment_date'),
            (0, express_validator_1.check)('cheque_status')
                .notEmpty()
                .isIn(['DEPOSIT', 'BOUNCE', 'RETURN'])
                .withMessage('Cheque status cannot valid'),
        ];
        this.commonMoneyReceiptFields = [
            (0, express_validator_1.check)('receipt_combclient')
                .notEmpty()
                .withMessage('client is required')
                .isString(),
            (0, express_validator_1.check)('receipt_payment_to')
                .isIn(['INVOICE', 'TICKET', 'OVERALL'])
                .notEmpty(),
            (0, express_validator_1.check)('receipt_total_amount').isNumeric().notEmpty(),
            (0, express_validator_1.check)('receipt_payment_type').isNumeric().notEmpty(),
            (0, express_validator_1.check)('receipt_payment_date').isDate().notEmpty().toDate(),
            (0, express_validator_1.check)('receipt_note').optional().isString(),
            // account_id is required when receipt_payment_type is 1
            (0, express_validator_1.check)('account_id').optional().isInt(),
            (0, express_validator_1.check)('cheque_number').optional(),
            (0, express_validator_1.check)('cheque_withdraw_date').optional().isDate(),
            (0, express_validator_1.check)('cheque_bank_name').optional().notEmpty(),
            (0, express_validator_1.check)('receipt_created_by').isNumeric().notEmpty(),
            (0, express_validator_1.check)('trans_no').optional().notEmpty(),
            (0, express_validator_1.check)('invoices').optional().isArray(),
            (0, express_validator_1.check)('invoices.*.invoice_id').isNumeric().notEmpty(),
            (0, express_validator_1.check)('invoices.*.invoice_amount').isNumeric().notEmpty(),
            (0, express_validator_1.check)('tickets').optional().isArray(),
            (0, express_validator_1.check)('tickets.*.ticket_no').notEmpty(),
            (0, express_validator_1.check)('tickets.*.invoice_id').isNumeric().notEmpty(),
            (0, express_validator_1.check)('tickets.*.invoice_amount').isNumeric().notEmpty(),
        ];
        this.postMoneyReceipt = [
            this.permissions.check(this.resources.money_receipt, 'create'),
            ...this.commonMoneyReceiptFields,
        ];
        this.updateMoneyReceipt = [
            this.permissions.check(this.resources.money_receipt, 'update'),
            ...this.commonMoneyReceiptFields,
        ];
        this.agentCommissionAdd = [
            this.permissions.check(this.resources.money_receipt, 'create'),
            (0, express_validator_1.check)('receipt_payment_type')
                .notEmpty()
                .withMessage('Pleace provide payment method'),
            (0, express_validator_1.check)('receipt_agent_id')
                .notEmpty()
                .withMessage('Pleace provide agent id')
                .isInt()
                .withMessage('Agent id must be an integer value'),
            (0, express_validator_1.check)('receipt_agent_amount')
                .notEmpty()
                .withMessage('Pleace provide agent amount'),
            (0, express_validator_1.check)('invoice_id')
                .optional()
                .isInt()
                .withMessage('Please provide invoice id'),
            (0, express_validator_1.check)('receipt_created_by')
                .notEmpty()
                .withMessage('Please enter receipt created by')
                .isInt()
                .withMessage('receipt created by must be an integer value'),
            (0, express_validator_1.check)('cheque_withdraw_date').optional().toDate(),
        ];
        this.deleteAgentCommission = [
            this.permissions.check(this.resources.money_receipt, 'delete'),
            (0, express_validator_1.check)('deleted_by')
                .notEmpty()
                .withMessage('Please provide who delete money receipt')
                .isInt()
                .withMessage('deleted_by must be an integer value'),
        ];
        this.commonAdvanceReturnFiels = [
            (0, express_validator_1.check)('advr_combclient')
                .notEmpty()
                .withMessage('Enter client id')
                .isString(),
            (0, express_validator_1.check)('advr_payment_type')
                .notEmpty()
                .isInt()
                .withMessage('Pleace provide Payment Type'),
            (0, express_validator_1.check)('advr_created_by')
                .notEmpty()
                .isInt()
                .withMessage('Pleace provide who create this money receipt'),
            (0, express_validator_1.check)('advr_account_id').optional().isInt().withMessage('Enter account id'),
            (0, express_validator_1.check)('advr_amount')
                .isNumeric()
                .isInt()
                .notEmpty()
                .withMessage('Enter Client Amount'),
            (0, express_validator_1.check)('advr_trxn_charge')
                .isNumeric()
                .optional()
                .withMessage('Transaction charge must be numaric'),
        ];
        this.postAdvanceReturn = [
            this.permissions.check(this.resources.money_receipt_advr, 'create'),
            ...this.commonAdvanceReturnFiels,
        ];
        this.editAdvanceReturn = [
            this.permissions.check(this.resources.money_receipt_advr, 'update'),
            ...this.commonAdvanceReturnFiels,
        ];
        this.advrDelete = [
            this.permissions.check(this.resources.money_receipt_advr, 'delete'),
        ];
        this.adveUpdate = [
            this.permissions.check(this.resources.money_receipt_advr, 'update'),
        ];
        this.adveRead = [
            this.permissions.check(this.resources.money_receipt_advr, 'read'),
        ];
    }
}
exports.default = InvoiceCostValidators;
//# sourceMappingURL=MoneyReceipt.Validators.js.map