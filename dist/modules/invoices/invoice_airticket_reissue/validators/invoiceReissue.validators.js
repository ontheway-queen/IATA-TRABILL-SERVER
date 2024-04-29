"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const abstract_validators_1 = __importDefault(require("../../../../abstracts/abstract.validators"));
class ReissueAirticket extends abstract_validators_1.default {
    constructor() {
        super(...arguments);
        this.readResissueAirticket = [
            this.permissions.check(this.resources.invoice_reissue, 'read'),
        ];
        this.deleteResissueAirticket = [
            this.permissions.check(this.resources.invoice_reissue, 'delete'),
        ];
        this.addExistingClient = [
            this.permissions.check(this.resources.invoice_reissue, 'create'),
            (0, express_validator_1.check)('invoice_combclient_id').notEmpty(),
            (0, express_validator_1.check)('comb_vendor').notEmpty(),
            (0, express_validator_1.check)('invoice_sales_man_id').isInt(),
            (0, express_validator_1.check)('invoice_due_date').optional().toDate(),
            (0, express_validator_1.check)('airticket_profit').isNumeric(),
            (0, express_validator_1.check)('airticket_journey_date').optional().toDate(),
            (0, express_validator_1.check)('airticket_return_date').optional().toDate(),
            (0, express_validator_1.check)('invoice_sales_date').optional().toDate(),
            (0, express_validator_1.check)('airticket_ticket_no').notEmpty(),
            (0, express_validator_1.check)('airticket_penalties').isNumeric(),
            (0, express_validator_1.check)('airticket_fare_difference').isNumeric(),
            (0, express_validator_1.check)('airticket_commission_percent').isNumeric(),
            (0, express_validator_1.check)('airticket_ait').isNumeric(),
            (0, express_validator_1.check)('airticket_client_price').isNumeric(),
            (0, express_validator_1.check)('airticket_purchase_price').isNumeric(),
            (0, express_validator_1.check)('airticket_issue_date').optional().toDate(),
            (0, express_validator_1.check)('airticket_classes').notEmpty(),
            (0, express_validator_1.check)('invoice_note')
                .optional()
                .customSanitizer((item) => {
                item === undefined ? null : item;
            })
                .isString(),
            (0, express_validator_1.check)('airticket_existing_airticket_id').optional().isInt(),
            (0, express_validator_1.check)('airticket_existing_invoiceid').notEmpty(),
        ];
        this.addReissueAirticket = [
            this.permissions.check(this.resources.invoice_reissue, 'create'),
            (0, express_validator_1.check)('invoice_info.invoice_no')
                .notEmpty()
                .withMessage('Please provide your valid invoice number'),
            (0, express_validator_1.check)('invoice_info.invoice_combclient_id')
                .notEmpty()
                .withMessage('Enter client id'),
            (0, express_validator_1.check)('invoice_info.invoice_sales_man_id')
                .notEmpty()
                .withMessage('Enter sales man id'),
            (0, express_validator_1.check)('invoice_info.invoice_sales_date')
                .notEmpty()
                .toDate()
                .withMessage('Date is required'),
            (0, express_validator_1.check)('invoice_info.invoice_due_date').optional().toDate(),
            (0, express_validator_1.check)('invoice_info.invoice_sub_total')
                .notEmpty()
                .isInt()
                .withMessage('Field is required'),
            (0, express_validator_1.check)('invoice_info.invoice_net_total')
                .notEmpty()
                .isInt()
                .withMessage('Field is required'),
            (0, express_validator_1.check)('invoice_info.invoice_total_profit')
                .notEmpty()
                .withMessage('Invoice total profit is required!')
                .isFloat()
                .withMessage('Invoice total profit must be an integer'),
            (0, express_validator_1.check)('invoice_info.invoice_total_vendor_price')
                .notEmpty()
                .isInt()
                .withMessage('Field is required'),
            (0, express_validator_1.check)('invoice_info.invoice_created_by')
                .notEmpty()
                .isInt()
                .withMessage('Field is required'),
            (0, express_validator_1.check)('ticketInfo.*.ticket_details.airticket_ticket_no')
                .notEmpty()
                .withMessage('Enter Air-ticket number')
                .isLength({ max: 30 })
                .withMessage('Source title can be at most 30 characters'),
            (0, express_validator_1.check)('ticketInfo.*.ticket_details.airticket_client_price')
                .notEmpty()
                .withMessage('Enter Air-ticket client price')
                .isInt()
                .withMessage('Enter integer value'),
            (0, express_validator_1.check)('ticketInfo.*.ticket_details.airticket_purchase_price')
                .notEmpty()
                .withMessage('Purchase price is required!')
                .isFloat()
                .withMessage('Purchase price must be integer'),
            (0, express_validator_1.check)('ticketInfo.*.flight_details.*.fltdetails_fly_date')
                .optional()
                .toDate(),
            (0, express_validator_1.check)('ticketInfo.*.ticket_details.airticket_comvendor')
                .notEmpty()
                .withMessage('Vendor is required!')
                .isString()
                .withMessage('Invalid airticket vendor id'),
            (0, express_validator_1.check)('ticketInfo.*.ticket_details.airticket_airline_id')
                .notEmpty()
                .isInt()
                .withMessage('This is feild is required and it must be an integer'),
            (0, express_validator_1.check)('ticketInfo.*.ticket_details.airticket_profit')
                .notEmpty()
                .withMessage('Enter Air-ticket profit')
                .isNumeric()
                .withMessage('Enter Numeric value'),
            (0, express_validator_1.check)('ticketInfo.*.ticket_details.airticket_route_or_sector')
                .optional()
                .isLength({ max: 100 })
                .withMessage('Source title can be at most 100 characters'),
            (0, express_validator_1.check)('ticketInfo.*.ticket_details.airticket_pnr')
                .optional()
                .isLength({ max: 30 })
                .withMessage('Source title can be at most 30 characters'),
            (0, express_validator_1.check)('ticketInfo.*.ticket_details.airticket_issue_date')
                .optional()
                .toDate(),
            (0, express_validator_1.check)('ticketInfo.*.ticket_details.airticket_journey_date')
                .optional()
                .toDate(),
            (0, express_validator_1.check)('ticketInfo.*.ticket_details.airticket_return_date')
                .optional()
                .toDate(),
            (0, express_validator_1.check)('ticketInfo.*.pax_passport.*.passport_date_of_expire')
                .optional()
                .isISO8601()
                .toDate(),
            (0, express_validator_1.check)('ticketInfo.*.pax_passport.*.passport_date_of_issue')
                .optional()
                .isISO8601()
                .toDate(),
            (0, express_validator_1.check)('ticketInfo.*.pax_passport.*.passport_date_of_birth')
                .optional()
                .isISO8601()
                .toDate(),
            (0, express_validator_1.check)('money_receipt.receipt_payment_date').optional().isISO8601().toDate(),
        ];
        this.editReissueAirticket = [
            this.permissions.check(this.resources.invoice_reissue, 'update'),
            (0, express_validator_1.check)('invoice_info.invoice_combclient_id')
                .notEmpty()
                .withMessage('Enter client id'),
            (0, express_validator_1.check)('invoice_info.invoice_sales_man_id')
                .notEmpty()
                .withMessage('Enter sales man id'),
            (0, express_validator_1.check)('invoice_info.invoice_sales_date')
                .notEmpty()
                .withMessage('Date is required')
                .toDate(),
            (0, express_validator_1.check)('invoice_info.invoice_due_date').optional().toDate(),
            (0, express_validator_1.check)('invoice_info.invoice_sub_total')
                .notEmpty()
                .isInt()
                .withMessage('Field is required'),
            (0, express_validator_1.check)('invoice_info.invoice_net_total')
                .notEmpty()
                .isInt()
                .withMessage('Field is required'),
            (0, express_validator_1.check)('invoice_info.invoice_total_profit')
                .notEmpty()
                .withMessage('Invoice total profit is required!')
                .isFloat()
                .withMessage('Invoice total profit must be an integer'),
            (0, express_validator_1.check)('invoice_info.invoice_total_vendor_price')
                .notEmpty()
                .isInt()
                .withMessage('Field is required'),
            (0, express_validator_1.check)('invoice_info.invoice_created_by')
                .notEmpty()
                .isInt()
                .withMessage('Field is required'),
            (0, express_validator_1.check)('ticketInfo.*.ticket_details.airticket_ticket_no')
                .notEmpty()
                .withMessage('Enter Air-ticket number')
                .isLength({ max: 30 })
                .withMessage('Source title can be at most 30 characters'),
            (0, express_validator_1.check)('ticketInfo.*.ticket_details.airticket_client_price')
                .notEmpty()
                .withMessage('Enter Air-ticket client price')
                .isInt()
                .withMessage('Enter integer value'),
            (0, express_validator_1.check)('ticketInfo.*.ticket_details.airticket_purchase_price')
                .notEmpty()
                .withMessage('Purchase price is required!')
                .isFloat()
                .withMessage('Purchase price must be integer'),
            (0, express_validator_1.check)('ticketInfo.*.ticket_details.airticket_comvendor')
                .notEmpty()
                .withMessage('Vendor is  required!'),
            (0, express_validator_1.check)('ticketInfo.*.ticket_details.airticket_airline_id')
                .notEmpty()
                .isInt()
                .withMessage('This is feild is required and it must be an integer'),
            (0, express_validator_1.check)('ticketInfo.*.ticket_details.airticket_profit')
                .notEmpty()
                .withMessage('Enter Air-ticket profit')
                .isNumeric()
                .withMessage('Enter Numeric value'),
            (0, express_validator_1.check)('ticketInfo.*.ticket_details.airticket_route_or_sector')
                .optional()
                .isLength({ max: 100 })
                .withMessage('Source title can be at most 100 characters'),
            (0, express_validator_1.check)('ticketInfo.*.ticket_details.airticket_pnr')
                .optional()
                .isLength({ max: 30 })
                .withMessage('Source title can be at most 30 characters'),
            (0, express_validator_1.check)('ticketInfo.*.ticket_details.airticket_issue_date')
                .optional()
                .toDate(),
            (0, express_validator_1.check)('ticketInfo.*.ticket_details.airticket_journey_date')
                .optional()
                .toDate(),
            (0, express_validator_1.check)('ticketInfo.*.ticket_details.airticket_return_date')
                .optional()
                .toDate(),
            (0, express_validator_1.check)('ticketInfo.*.flight_details.*.fltdetails_fly_date')
                .optional()
                .toDate(),
            (0, express_validator_1.check)('ticketInfo.*.pax_passport.*.passport_date_of_expire')
                .optional()
                .isISO8601()
                .toDate(),
            (0, express_validator_1.check)('ticketInfo.*.pax_passport.*.passport_date_of_issue')
                .optional()
                .isISO8601()
                .toDate(),
            (0, express_validator_1.check)('ticketInfo.*.pax_passport.*.passport_date_of_birth')
                .optional()
                .isISO8601()
                .toDate(),
        ];
        this.reissueRefundCreate = [
            (0, express_validator_1.check)('comb_client').isString(),
            (0, express_validator_1.check)('invoice_id').isInt(),
            (0, express_validator_1.check)('ticket_info').isArray().notEmpty(),
            (0, express_validator_1.check)('ticket_info.*.airticket_id').isInt(),
            (0, express_validator_1.check)('ticket_info.*.airticket_client_price').isFloat(),
            (0, express_validator_1.check)('ticket_info.*.airticket_purchase_price').isFloat(),
            (0, express_validator_1.check)('ticket_info.*.comb_vendor').isString(),
            (0, express_validator_1.check)('ticket_info.*.client_refund').isFloat(),
            (0, express_validator_1.check)('ticket_info.*.vendor_refund').isFloat(),
            (0, express_validator_1.check)('ticket_info.*.client_charge').optional().isFloat(),
            (0, express_validator_1.check)('ticket_info.*.vendor_charge').optional().isFloat(),
            (0, express_validator_1.check)('client_total_refund').isFloat(),
            (0, express_validator_1.check)('client_refund_type').isIn(['Adjust', 'Return']),
            (0, express_validator_1.check)('total_vendor_refund').isFloat(),
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
exports.default = ReissueAirticket;
//# sourceMappingURL=invoiceReissue.validators.js.map