"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const abstract_validators_1 = __importDefault(require("../../../../abstracts/abstract.validators"));
const moneyreceipt_validator_1 = require("../../../../common/validators/moneyreceipt.validator");
const commonInvoiceVisa_validator_1 = require("./commonInvoiceVisa.validator");
class InvoiceVisaValidators extends abstract_validators_1.default {
    constructor() {
        super(...arguments);
        this.readInvoiceVisa = [
            this.permissions.check(this.resources.invoice_visa, 'read'),
        ];
        this.updateVisaStatus = [
            (0, express_validator_1.check)('status')
                .notEmpty()
                .isIn(['Approved', 'Rejected'])
                .withMessage('Status must be Approved or Rejected'),
        ];
        this.deleteInvoiceVisa = [
            this.permissions.check(this.resources.invoice_visa, 'delete'),
            (0, express_validator_1.check)('invoice_has_deleted_by')
                .notEmpty()
                .withMessage('Pleace provide admin id invoice_has_deleted_by'),
        ];
        this.addInvoiceVisa = [
            this.permissions.check(this.resources.invoice_visa, 'create'),
            ...moneyreceipt_validator_1.moneyReceiptValidator,
            ...commonInvoiceVisa_validator_1.commonInvoiceVisaValidator,
        ];
        this.editInvoice = [
            this.permissions.check(this.resources.invoice_visa, 'update'),
            ...commonInvoiceVisa_validator_1.commonInvoiceVisaValidator,
        ];
    }
}
exports.default = InvoiceVisaValidators;
//# sourceMappingURL=invoiceVisa.validators.js.js.map