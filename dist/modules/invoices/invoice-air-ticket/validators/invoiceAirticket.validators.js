"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const abstract_validators_1 = __importDefault(require("../../../../abstracts/abstract.validators"));
const commonAirticket_validator_1 = require("./commonAirticket.validator");
class InvoiceAirticketValidators extends abstract_validators_1.default {
    constructor() {
        super(...arguments);
        this.readInvoiceAirticket = [
            this.permissions.check(this.resources.invoice_airticket, 'read'),
        ];
        this.voidAirticket = [
            this.permissions.check(this.resources.invoice_airticket, 'delete'),
            (0, express_validator_1.check)('invoice_void_date').notEmpty().toDate(),
        ];
        this.deleteInvoiceAirticket = [
            this.permissions.check(this.resources.invoice_airticket, 'delete'),
            (0, express_validator_1.check)('invoice_has_deleted_by')
                .notEmpty()
                .isNumeric()
                .withMessage('Please enter admin or user id'),
        ];
        this.readEditData = [
            ...this.readInvoiceAirticket,
            (0, express_validator_1.param)('invoice')
                .exists()
                .isInt()
                .withMessage('Must provide invoice no as params'),
        ];
        this.validateSearchRequest = [
            (0, express_validator_1.check)('search_type')
                .exists()
                .withMessage('search_type is required')
                .isIn(['invoice_no', 'ticket_no', 'money_receipt', 'PNR'])
                .withMessage('Please provide right search type'),
            (0, express_validator_1.check)('search_text')
                .exists()
                .withMessage('search_text is required')
                .custom((value) => {
                // Check if search_text is a number or a string
                if (typeof value !== 'number' && typeof value !== 'string') {
                    throw new Error('search_text must be a number or a string');
                }
                return true;
            }),
        ];
        this.postInvoiceAirticket = [
            this.permissions.check(this.resources.invoice_airticket, 'create'),
            ...commonAirticket_validator_1.commonAirticketValidator,
        ];
        this.editInvoice = [
            this.permissions.check(this.resources.invoice_airticket, 'update'),
            ...commonAirticket_validator_1.commonAirticketValidator,
        ];
        // AIR TICKET TAX REFUND
        this.validateTaxRefund = [
            (0, express_validator_1.check)('refund_invoice_id').isInt(),
            (0, express_validator_1.check)('refund_date').toDate(),
            (0, express_validator_1.check)('comb_client').isString(),
            (0, express_validator_1.check)('ticket_info').isArray().notEmpty(),
            (0, express_validator_1.check)('ticket_info.*.airticket_id').isInt(),
            (0, express_validator_1.check)('ticket_info.*.comb_vendor').isString(),
            (0, express_validator_1.check)('ticket_info.*.refund_tax_amount').isNumeric(),
            (0, express_validator_1.check)('client_refund_type').isIn(['Return', 'Adjust']),
            (0, express_validator_1.check)('vendor_refund_type').isIn(['Return', 'Adjust']),
            (0, express_validator_1.check)('client_pay_type').isIn([1, 2, 3]).optional(),
            (0, express_validator_1.check)('vendor_pay_type').isIn([1, 2, 3]).optional(),
            (0, express_validator_1.check)('client_account_id').isInt().optional(),
            (0, express_validator_1.check)('vendor_account_id').isInt().optional(),
            (0, express_validator_1.check)('client_total_tax_refund').isNumeric(),
            (0, express_validator_1.check)('vendor_total_tax_refund').isNumeric(),
        ];
    }
}
exports.default = InvoiceAirticketValidators;
//# sourceMappingURL=invoiceAirticket.validators.js.map