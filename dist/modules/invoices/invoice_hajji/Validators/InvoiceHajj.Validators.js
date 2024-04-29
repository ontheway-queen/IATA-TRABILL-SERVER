"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const abstract_validators_1 = __importDefault(require("../../../../abstracts/abstract.validators"));
class InvoiceHajjValidators extends abstract_validators_1.default {
    constructor() {
        super(...arguments);
        this.commonRead = [this.permissions.check(this.resources.invoice_hajj, 'read')];
        this.commonUpdate = [
            this.permissions.check(this.resources.invoice_hajj, 'update'),
        ];
        this.commonDelete = [
            this.permissions.check(this.resources.invoice_hajj, 'delete'),
            (0, express_validator_1.check)('invoice_has_deleted_by')
                .notEmpty()
                .withMessage('Please porvide who went to delete'),
        ];
        this.postInvoiceHajj = [
            this.permissions.check(this.resources.invoice_hajj, 'create'),
            (0, express_validator_1.check)('invoice_combclient_id').notEmpty().withMessage('Enter client id'),
            (0, express_validator_1.check)('invoice_sales_man_id')
                .notEmpty()
                .isNumeric()
                .withMessage('Enter sales man id'),
            (0, express_validator_1.check)('invoice_hajj_session')
                .notEmpty()
                .withMessage('Year is required')
                .isISO8601()
                .withMessage('Year must be a valid date')
                .custom((value) => {
                const year = new Date(value).getFullYear();
                if (isNaN(year) || year < 1000 || year > 9999) {
                    throw new Error('Year must be a valid four-digit year');
                }
                return year;
            }),
            (0, express_validator_1.check)('invoice_sales_date')
                .notEmpty()
                .withMessage('Date is required')
                .isISO8601()
                .withMessage('Invalid date')
                .toDate(),
            (0, express_validator_1.check)('invoice_due_date').optional().toDate(),
            (0, express_validator_1.check)('invoice_sub_total')
                .notEmpty()
                .isInt()
                .withMessage('Field is required'),
            (0, express_validator_1.check)('invoice_discount')
                .optional()
                .custom((value, { req }) => {
                // If the value is null, it's considered valid
                if (value === null || value === undefined) {
                    return true;
                }
                // Check if the value is an integer
                if (!Number.isInteger(value)) {
                    throw new Error('Invoice discount must be an integer');
                }
                return true;
            }),
            (0, express_validator_1.check)('invoice_net_total')
                .notEmpty()
                .isInt()
                .withMessage('Enter Invoice net total '),
            (0, express_validator_1.check)('invoice_note')
                .optional()
                .isLength({ max: 255 })
                .withMessage('invoice note can be at most 250 characters'),
            (0, express_validator_1.check)('invoice_created_by')
                .notEmpty()
                .isInt()
                .withMessage('Provide user id'),
            // PILGRIMS INFORMATION
            (0, express_validator_1.check)('pilgrims_information')
                .optional()
                .isArray()
                .withMessage('Pilgrims is required !'),
            (0, express_validator_1.check)('pilgrims_information.*.ticket_journey_date')
                .optional()
                .isISO8601()
                .withMessage('Invalid journey date format')
                .toDate(),
            (0, express_validator_1.check)('pilgrims_information.*.ticket_return_date')
                .optional()
                .isISO8601()
                .withMessage('Invalid return date format')
                .toDate(),
            // HOTEL INFORMATION
            (0, express_validator_1.check)('hotel_information').optional().isArray(),
            (0, express_validator_1.check)('hotel_information.*.hotel_name')
                .notEmpty()
                .withMessage('Hotel name is required'),
            (0, express_validator_1.check)('hotel_information.*.hotel_check_in_date').optional().toDate(),
            (0, express_validator_1.check)('hotel_information.*.hotel_check_out_date').optional().toDate(),
            (0, express_validator_1.check)('hotel_information.*.hotel_room_type_id')
                .optional()
                .isInt({ min: 1 })
                .withMessage('Room type ID is required and must be a positive integer'),
            // TRANSPORT INFORMATION
            (0, express_validator_1.check)('transport_info').optional().isArray(),
            (0, express_validator_1.check)('transport_info.*.transport_type_id')
                .optional()
                .isInt()
                .withMessage('Transport type id must be integer'),
            (0, express_validator_1.check)('transport_info.*.transport_pickup_time')
                .optional()
                .isISO8601()
                .withMessage('Invalid type for transport_pickup_time')
                .toDate()
                .withMessage('Invalid time format. Use ISO 8601 format.')
                .customSanitizer((value) => {
                const time = new Date(value).toLocaleTimeString('en-US');
                return time;
            }),
            (0, express_validator_1.check)('transport_info.*.transport_dropoff_time')
                .optional()
                .isISO8601()
                .withMessage('Must be date value.')
                .toDate()
                .withMessage('Invalid time format. Use ISO 8601 format.')
                .customSanitizer((value) => {
                const time = new Date(value).toLocaleTimeString('en-US');
                return time;
            }),
        ];
        this.createHajjRefund = [
            this.permissions.check(this.resources.invoice_hajj, 'create'),
            (0, express_validator_1.check)('comb_client').isString(),
            (0, express_validator_1.check)('invoice_id').isInt(),
            (0, express_validator_1.check)('billing_info').isArray().notEmpty(),
            (0, express_validator_1.check)('billing_info.*.billing_id').isInt(),
            (0, express_validator_1.check)('billing_info.*.billing_unit_price').isFloat(),
            (0, express_validator_1.check)('billing_info.*.billing_cost_price').isFloat(),
            (0, express_validator_1.check)('billing_info.*.comb_vendor').isString(),
            (0, express_validator_1.check)('billing_info.*.refund_quantity').isInt(),
            (0, express_validator_1.check)('billing_info.*.client_refund').isFloat(),
            (0, express_validator_1.check)('billing_info.*.vendor_refund').isFloat(),
            (0, express_validator_1.check)('billing_info.*.client_charge').optional().isFloat(),
            (0, express_validator_1.check)('billing_info.*.vendor_charge').optional().isFloat(),
            (0, express_validator_1.check)('client_total_refund').isFloat(),
            (0, express_validator_1.check)('client_refund_type').isIn(['Adjust', 'Return']),
            (0, express_validator_1.check)('vendor_total_refund').isFloat(),
            (0, express_validator_1.check)('vendor_refund_type').isIn(['Adjust', 'Return']),
            (0, express_validator_1.check)('vendor_payment_method').optional().isInt(),
            (0, express_validator_1.check)('vendor_payment_acc_id').optional().isInt(),
            (0, express_validator_1.check)('client_payment_acc_id').optional().isInt(),
            (0, express_validator_1.check)('client_payment_method').optional().isInt(),
            (0, express_validator_1.check)('refund_date').isString().toDate(),
            (0, express_validator_1.check)('created_by').isInt(),
        ];
    }
}
exports.default = InvoiceHajjValidators;
//# sourceMappingURL=InvoiceHajj.Validators.js.map