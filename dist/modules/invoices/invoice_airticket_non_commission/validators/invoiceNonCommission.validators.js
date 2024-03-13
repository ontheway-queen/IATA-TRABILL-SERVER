"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_validators_1 = __importDefault(require("../../../../abstracts/abstract.validators"));
const commonNonCommission_validator_1 = require("./commonNonCommission.validator");
class InvoiceNonCommissionValidators extends abstract_validators_1.default {
    constructor() {
        super(...arguments);
        this.readInvoiceNonComission = [
            this.permissions.check(this.resources.invoice_non_commission, 'read'),
        ];
        this.deleteInvoiceNonComission = [
            this.permissions.check(this.resources.invoice_non_commission, 'delete'),
        ];
        this.addInvoiceNonCommission = [
            this.permissions.check(this.resources.invoice_non_commission, 'create'),
            ...commonNonCommission_validator_1.commonNonCommissionValidator,
        ];
        this.editInvoiceNonCommission = [
            this.permissions.check(this.resources.invoice_non_commission, 'update'),
            ...commonNonCommission_validator_1.commonNonCommissionValidator,
        ];
    }
}
exports.default = InvoiceNonCommissionValidators;
//# sourceMappingURL=invoiceNonCommission.validators.js.map