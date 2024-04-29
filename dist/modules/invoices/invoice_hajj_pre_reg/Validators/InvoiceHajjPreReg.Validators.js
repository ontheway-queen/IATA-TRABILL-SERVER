"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const abstract_validators_1 = __importDefault(require("../../../../abstracts/abstract.validators"));
class InvoiceHajjPreRegValidators extends abstract_validators_1.default {
    constructor() {
        super(...arguments);
        this.commonRead = [
            this.permissions.check(this.resources.invoice_hajj_pre_reg, 'read'),
        ];
        this.commonUpdate = [
            this.permissions.check(this.resources.invoice_hajj_pre_reg, 'update'),
        ];
        this.commonDelete = [
            this.permissions.check(this.resources.invoice_hajj_pre_reg, 'delete'),
            (0, express_validator_1.check)('invoice_has_deleted_by')
                .notEmpty()
                .withMessage('Please porvide who went to delete'),
        ];
        this.hajiTrackingSerialCheck = [
            this.permissions.check(this.resources.invoice_hajj_pre_reg, 'read'),
            (0, express_validator_1.check)('data_for')
                .notEmpty()
                .isIn(['tracking', 'serial'])
                .withMessage('Data check onely for tracking or serial'),
            (0, express_validator_1.check)('value').notEmpty().withMessage('How can you check without value'),
        ];
        this.postInvoiceHajjPreReg = [
            this.permissions.check(this.resources.invoice_hajj_pre_reg, 'create'),
            (0, express_validator_1.check)('invoice_no')
                .notEmpty()
                .withMessage('Please provide your valid invoice number'),
            (0, express_validator_1.check)('invoice_combclient_id').notEmpty().withMessage('Enter client id'),
            (0, express_validator_1.check)('invoice_sales_man_id').notEmpty().withMessage('Enter sales man id'),
            (0, express_validator_1.check)('invoice_sales_date')
                .notEmpty()
                .isDate()
                .withMessage('Date is required'),
            (0, express_validator_1.check)('invoice_due_date').optional().toDate(),
            (0, express_validator_1.check)('invoice_sub_total')
                .notEmpty()
                .isInt()
                .withMessage('Field is required'),
            (0, express_validator_1.check)('invoice_net_total')
                .notEmpty()
                .isInt()
                .withMessage('Field is required'),
            (0, express_validator_1.check)('invoice_created_by')
                .notEmpty()
                .isInt()
                .withMessage('Field is required'),
            (0, express_validator_1.check)('haji_information.*.haji_info_reg_year')
                .notEmpty()
                .withMessage('Field is required'),
            (0, express_validator_1.check)('billing_information.*.billing_product_id')
                .notEmpty()
                .isInt()
                .withMessage('Field is required'),
            (0, express_validator_1.check)('billing_information.*.billing_unit_price')
                .notEmpty()
                .isInt()
                .withMessage('Field is required'),
        ];
        this.editInvoiceHajjPreReg = [
            this.permissions.check(this.resources.invoice_hajj_pre_reg, 'create'),
            (0, express_validator_1.check)('invoice_no')
                .notEmpty()
                .withMessage('Please provide your valid invoice number'),
            (0, express_validator_1.check)('invoice_combclient_id').notEmpty().withMessage('Enter client id'),
            (0, express_validator_1.check)('invoice_sales_man_id').notEmpty().withMessage('Enter sales man id'),
            (0, express_validator_1.check)('invoice_sales_date')
                .notEmpty()
                .isDate()
                .withMessage('Date is required'),
            (0, express_validator_1.check)('invoice_due_date').optional().toDate(),
            (0, express_validator_1.check)('invoice_sub_total')
                .notEmpty()
                .isInt()
                .withMessage('Field is required'),
            (0, express_validator_1.check)('invoice_net_total')
                .notEmpty()
                .withMessage('Invoice net total must be provide'),
            (0, express_validator_1.check)('invoice_created_by')
                .notEmpty()
                .isInt()
                .withMessage('Field is required'),
            (0, express_validator_1.check)('haji_information.*.haji_info_reg_year')
                .notEmpty()
                .withMessage('Field is required'),
            (0, express_validator_1.check)('billing_information.*.billing_product_id')
                .notEmpty()
                .isInt()
                .withMessage('Field is required'),
            (0, express_validator_1.check)('billing_information.*.billing_unit_price')
                .notEmpty()
                .isInt()
                .withMessage('Field is required'),
        ];
        this.updateHajjiInfoStatus = [
            this.permissions.check(this.resources.invoice_hajj_pre_reg, 'update'),
            (0, express_validator_1.check)('updated_by')
                .notEmpty()
                .withMessage('Please provide updated by')
                .isInt()
                .withMessage('update_by must be an integer value'),
            (0, express_validator_1.query)('status')
                .notEmpty()
                .withMessage('Please provide hajji info status')
                .isIn(['approved', 'canceled'])
                .withMessage('hajji info status must be in approved or canceled'),
        ];
    }
}
exports.default = InvoiceHajjPreRegValidators;
//# sourceMappingURL=InvoiceHajjPreReg.Validators.js.map