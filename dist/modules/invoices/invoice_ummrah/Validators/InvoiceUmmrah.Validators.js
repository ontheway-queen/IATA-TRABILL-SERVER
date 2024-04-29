"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const abstract_validators_1 = __importDefault(require("../../../../abstracts/abstract.validators"));
const commonInvoice_validators_1 = require("../../../../common/validators/commonInvoice.validators");
class InvoiceHajjValidators extends abstract_validators_1.default {
    constructor() {
        super(...arguments);
        this.commonRead = [this.permissions.check(this.resources.invoice_ummrah, 'read')];
        this.commonUpdate = [
            this.permissions.check(this.resources.invoice_ummrah, 'update'),
        ];
        this.commonDelete = [
            this.permissions.check(this.resources.invoice_ummrah, 'delete'),
            (0, express_validator_1.check)('invoice_has_deleted_by')
                .notEmpty()
                .withMessage('Please porvide who went to delete'),
        ];
        /**
         * @Invoice_Hajj_Post
         *
         */
        this.postInvoiceUmmrah = [
            this.permissions.check(this.resources.invoice_ummrah, 'create'),
            ...commonInvoice_validators_1.commonInvoiceValidator,
            // PASSENGER INFORMATION
            (0, express_validator_1.check)('passenget_info.*.passenger_passport_id')
                .optional()
                .isInt()
                .withMessage('Passport number must be a integer.')
                .toInt(),
            (0, express_validator_1.check)('passenget_info.*.passenger_tracking_number').optional(),
            (0, express_validator_1.check)('passenget_info.*.ticket_no').optional(),
            (0, express_validator_1.check)('passenget_info.*.ticket_route').optional(),
            (0, express_validator_1.check)('passenget_info.*.ticket_pnr').optional(),
            (0, express_validator_1.check)('passenget_info.*.ticket_airline_id').optional(),
            (0, express_validator_1.check)('passenget_info.*.ticket_reference_no')
                .optional()
                .isString()
                .withMessage('Reference number must be a string.'),
            (0, express_validator_1.check)('passenget_info.*.ticket_journey_date')
                .optional()
                .isISO8601()
                .withMessage('Invalid date format.')
                .toDate(),
            (0, express_validator_1.check)('passenget_info.*.ticket_return_date')
                .optional()
                .isISO8601()
                .withMessage('Invalid date format.')
                .toDate(),
            // HOTEL INFORMATION
            (0, express_validator_1.check)('hotel_information').optional().isArray(),
            (0, express_validator_1.check)('hotel_information.*.hotel_name')
                .isString()
                .withMessage('Hotel name must be a string.'),
            (0, express_validator_1.check)('hotel_information.*.hotel_check_in_date')
                .optional()
                .isISO8601()
                .withMessage('Invalid date format.')
                .toDate(),
            (0, express_validator_1.check)('hotel_information.*.hotel_check_out_date')
                .optional()
                .isISO8601()
                .withMessage('Invalid date format.')
                .toDate(),
            (0, express_validator_1.check)('hotel_information.*.hotel_room_type_id')
                .isNumeric()
                .withMessage('Room type ID must be a number.'),
            (0, express_validator_1.check)('invoice_discount')
                .optional()
                .custom((value, { req }) => {
                if (value === null || value === undefined) {
                    return true;
                }
                if (!Number.isInteger(value)) {
                    throw new Error('Invoice discount must be an integer');
                }
                return true;
            }),
            (0, express_validator_1.check)('invoice_created_by')
                .notEmpty()
                .isInt()
                .withMessage('Provide user id'),
        ];
        this.updateInvoiceUmmrah = [
            this.permissions.check(this.resources.invoice_ummrah, 'update'),
            ...commonInvoice_validators_1.commonInvoiceValidator,
            // PASSENGER INFORMATION
            (0, express_validator_1.check)('passenget_info.*.passenger_passport_id')
                .optional()
                .isInt()
                .withMessage('Passport number must be a integer.')
                .toInt(),
            (0, express_validator_1.check)('passenget_info.*.passenger_tracking_number').optional(),
            (0, express_validator_1.check)('passenget_info.*.ticket_no').optional(),
            (0, express_validator_1.check)('passenget_info.*.ticket_route').optional(),
            (0, express_validator_1.check)('passenget_info.*.ticket_pnr').optional(),
            (0, express_validator_1.check)('passenget_info.*.ticket_airline_id').optional(),
            (0, express_validator_1.check)('passenget_info.*.ticket_reference_no')
                .optional()
                .isString()
                .withMessage('Reference number must be a string.'),
            (0, express_validator_1.check)('passenget_info.*.ticket_journey_date')
                .optional()
                .isISO8601()
                .withMessage('Invalid date format.')
                .toDate(),
            (0, express_validator_1.check)('passenget_info.*.ticket_return_date')
                .optional()
                .isISO8601()
                .withMessage('Invalid date format.')
                .toDate(),
            // HOTEL INFORMATION
            (0, express_validator_1.check)('hotel_information').optional().isArray(),
            (0, express_validator_1.check)('hotel_information.*.hotel_name')
                .optional()
                .isString()
                .withMessage('Hotel name must be a string.'),
            (0, express_validator_1.check)('hotel_information.*.hotel_check_in_date')
                .optional()
                .isISO8601()
                .withMessage('Invalid date format.')
                .toDate(),
            (0, express_validator_1.check)('hotel_information.*.hotel_check_out_date')
                .optional()
                .isISO8601()
                .withMessage('Invalid date format.')
                .toDate(),
            (0, express_validator_1.check)('hotel_information.*.hotel_room_type_id')
                .optional()
                .isNumeric()
                .withMessage('Room type ID must be a number.'),
            (0, express_validator_1.check)('invoice_discount')
                .optional()
                .custom((value, { req }) => {
                if (value === null || value === undefined) {
                    return true;
                }
                if (!Number.isInteger(value)) {
                    throw new Error('Invoice discount must be an integer');
                }
                return true;
            }),
            (0, express_validator_1.check)('invoice_created_by')
                .notEmpty()
                .isInt()
                .withMessage('Provide user id'),
        ];
        this.createUmmrahRefund = [
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
//# sourceMappingURL=InvoiceUmmrah.Validators.js.map