"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const abstract_validators_1 = __importDefault(require("../../../abstracts/abstract.validators"));
const CommonOtherInvoice_Validators_1 = require("../../invoices/invoice_other/validators/CommonOtherInvoice.Validators");
class QuotationValidator extends abstract_validators_1.default {
    constructor() {
        super(...arguments);
        this.productCategory = [this.permissions.check(this.resources.quotation, 'read')];
        this.quotations = [this.permissions.check(this.resources.quotation, 'read')];
        this.deleteQuotation = [
            this.permissions.check(this.resources.quotation, 'delete'),
        ];
        this.accumulateInv = [
            this.permissions.check(this.resources.quotation, 'create'),
            (0, express_validator_1.check)('q_number').isString().withMessage('q_number must be a string'),
            (0, express_validator_1.check)('sales_date')
                .isISO8601()
                .toDate()
                .withMessage('sales_date must be a valid date in ISO8601 format'),
            (0, express_validator_1.check)('discount')
                .isFloat({ min: 0 })
                .withMessage('discount must be a positive number'),
            (0, express_validator_1.check)('payment')
                .isFloat({ min: 0 })
                .withMessage('payment must be a positive number'),
            (0, express_validator_1.check)('comb_client')
                .isString()
                .notEmpty()
                .withMessage('comb_client cannot be empty'),
            (0, express_validator_1.check)('invoices').isArray().withMessage('invoices must be an array'),
            (0, express_validator_1.check)('invoices.*.invoices_id')
                .isInt({ min: 0 })
                .withMessage('invoices_id must be a positive integer'),
            (0, express_validator_1.check)('invoices.*.category_id')
                .isInt({ min: 0 })
                .withMessage('category_id must be a positive integer'),
        ];
        /**
         * validator for `create quotation`
         */
        this.createQuotation = [
            this.permissions.check(this.resources.quotation, 'create'),
            (0, express_validator_1.check)('client_id').isString().withMessage('client id must be string value'),
            (0, express_validator_1.check)('q_number').isString(),
            (0, express_validator_1.check)('date').isDate(),
            (0, express_validator_1.check)('bill_info').isArray(),
            (0, express_validator_1.check)('note').optional().isString(),
            (0, express_validator_1.check)('discount').optional().isNumeric(),
            (0, express_validator_1.check)('sub_total').isNumeric(),
            (0, express_validator_1.check)('net_total').isNumeric(),
        ];
        this.confirmationQuotation = [
            this.permissions.check(this.resources.quotation, 'create'),
            ...CommonOtherInvoice_Validators_1.commonInvoiceOtherValidator,
        ];
        /**
         * validator for `edit quotation`
         */
        this.editQuotation = [
            this.permissions.check(this.resources.quotation, 'update'),
            (0, express_validator_1.check)('client_id').optional().isString(),
            (0, express_validator_1.check)('q_number').optional().isString(),
            (0, express_validator_1.check)('date').optional().isDate(),
            (0, express_validator_1.check)('bill_info').optional().isArray(),
            (0, express_validator_1.check)('note').optional().isString(),
            (0, express_validator_1.check)('discount').optional().isNumeric(),
            (0, express_validator_1.check)('sub_total').optional().isNumeric(),
            (0, express_validator_1.check)('net_total').optional().isNumeric(),
        ];
    }
}
exports.default = QuotationValidator;
//# sourceMappingURL=quotation.validator.js.map