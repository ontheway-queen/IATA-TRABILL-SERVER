"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const abstract_validators_1 = __importDefault(require("../../../../abstracts/abstract.validators"));
const CommonOtherInvoice_Validators_1 = require("./CommonOtherInvoice.Validators");
class InvoiceOtherValidators extends abstract_validators_1.default {
    constructor() {
        super(...arguments);
        this.readInvoiceOthers = [
            this.permissions.check(this.resources.invoice_other, 'read'),
        ];
        this.deleteInvoiceOthers = [
            this.permissions.check(this.resources.invoice_other, 'delete'),
            (0, express_validator_1.check)('invoice_has_deleted_by')
                .notEmpty()
                .withMessage('Please provide admin id invoice_has_deleted_by'),
        ];
        this.addInvoiceOthers = [
            this.permissions.check(this.resources.invoice_other, 'create'),
            ...CommonOtherInvoice_Validators_1.commonInvoiceOtherValidator,
        ];
        this.editInviceOthers = [
            this.permissions.check(this.resources.invoice_other, 'update'),
            ...CommonOtherInvoice_Validators_1.commonInvoiceOtherValidator,
        ];
    }
}
exports.default = InvoiceOtherValidators;
//# sourceMappingURL=invoiceOther.validators.js.js.map