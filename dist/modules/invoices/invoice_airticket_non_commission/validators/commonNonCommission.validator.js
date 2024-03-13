"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commonNonCommissionValidator = exports.voidInvoices = void 0;
const { check } = require('express-validator');
exports.voidInvoices = [
    check('invoice_has_deleted_by').notEmpty().withMessage('User id is required'),
    check('void_charge').notEmpty().withMessage('Void charge is required'),
];
exports.commonNonCommissionValidator = [
    check('invoice_info')
        .notEmpty()
        .withMessage('Invoice information is required!')
        .isObject()
        .withMessage('Invoice information must be an object'),
    check('invoice_info.invoice_combclient_id')
        .notEmpty()
        .withMessage('Invoice client ID is required!')
        .isString()
        .withMessage('Invoice client ID must be a string'),
    check('invoice_info.invoice_sales_man_id')
        .notEmpty()
        .withMessage('Invoice sales man ID is required!')
        .isNumeric()
        .withMessage('Invoice sales man ID must be an integer'),
    check('invoice_info.invoice_no')
        .notEmpty()
        .withMessage('Invoice number is required!')
        .isString()
        .withMessage('Invoice number must be a string'),
    check('invoice_info.invoice_sales_date')
        .notEmpty()
        .withMessage('Date is required')
        .toDate(),
    check('invoice_info.invoice_due_date').optional().toDate(),
    check('invoice_info.invoice_note')
        .optional()
        .isLength({ max: 255, min: 0 })
        .withMessage('Invoice note must be max 255 character'),
    check('invoice_info.invoice_sub_total')
        .notEmpty()
        .isFloat()
        .withMessage('Field is required and must be integer value')
        .isLength({ max: 14 })
        .withMessage('Sub total length not be greater then 14 digit')
        .toFloat(),
    check('invoice_info.invoice_net_total')
        .notEmpty()
        .isFloat()
        .withMessage('Field is required and must be integer value')
        .isLength({ max: 14 })
        .withMessage('Net total length not be greater then 14 digit')
        .toFloat(),
    check('invoice_info.invoice_agent_com_amount')
        .optional()
        .customSanitizer((value) => value === null ? undefined : parseFloat(value))
        .toFloat(),
    check('invoice_info.invoice_service_charge')
        .optional()
        .customSanitizer((value) => value === null ? undefined : parseFloat(value))
        .isNumeric()
        .withMessage('Invoice service charge must be an integer'),
    check('invoice_info.invoice_total_profit')
        .notEmpty()
        .withMessage('Invoice total profit is required!')
        .isFloat()
        .withMessage('Invoice total profit must be an integer'),
    check('invoice_info.invoice_total_vendor_price')
        .notEmpty()
        .withMessage('Invoice total vendor price is required!')
        .isNumeric()
        .withMessage('Invoice total vendor price must be a number'),
    check('invoice_info.invoice_created_by')
        .notEmpty()
        .withMessage('Invoice created by is required!')
        .isNumeric()
        .withMessage('Invoice created by must be an integer'),
    check('invoice_info.invoice_show_prev_due')
        .optional()
        .isIn(['0', '1'])
        .withMessage('Invoice show previous due must be 0 or 1'),
    check('invoice_info.invoice_show_passport_details')
        .optional()
        .isIn(['0', '1'])
        .withMessage('Invoice show previous due must be 0 or 1'),
    // pax_passport
    check('ticketInfo.*.pax_passport.*.passport_name')
        .optional()
        .isString()
        .withMessage('Passport name must be a string'),
    check('ticketInfo.*.pax_passport.*.passport_person_type')
        .optional()
        .customSanitizer((value) => value === null ? undefined : parseFloat(value))
        .isNumeric()
        .withMessage('Passport person type must be a integer'),
    check('ticketInfo.*.pax_passport.*.passport_passport_no')
        .optional()
        .isString()
        .withMessage('Passport passport no must be a string'),
    check('ticketInfo.*.pax_passport.*.passport_mobile_no')
        .optional()
        .isString()
        .withMessage('Passport mobile no must be a string'),
    check('ticketInfo.*.pax_passport.*.passport_email')
        .optional()
        .isString()
        .withMessage('Passport email must be a string'),
    check('ticketInfo.*.pax_passport.*.passport_nid_no')
        .optional()
        .isString()
        .withMessage('Passport nid no must be a string'),
    check('ticketInfo.*.pax_passport.*.passport_date_of_birth')
        .optional()
        .isString()
        .withMessage('Passport date of birth must be a string')
        .toDate(),
    check('ticketInfo.*.pax_passport.*.passport_date_of_issue')
        .optional()
        .isString()
        .withMessage('Passport date of issue must be a string')
        .toDate(),
    check('ticketInfo.*.pax_passport.*.passport_date_of_expire')
        .optional()
        .isString()
        .withMessage('Passport date of expire must be a string')
        .toDate(),
    // invoice_ticket_info
    check('ticketInfo.*.ticket_details.airticket_ticket_no')
        .notEmpty()
        .withMessage('Ticket no is required!')
        .isString()
        .withMessage('Airline ticket no must be a string'),
    check('ticketInfo.*.ticket_details.airticket_client_price')
        .notEmpty()
        .withMessage('Client price is required!')
        .isNumeric()
        .withMessage('Client price must be integer'),
    check('ticketInfo.*.ticket_details.airticket_purchase_price')
        .notEmpty()
        .withMessage('Purchase price is required!')
        .isFloat()
        .withMessage('Purchase price must be integer'),
    check('ticketInfo.*.ticket_details.airticket_comvendor')
        .notEmpty()
        .withMessage('Ticket info vendor is required!')
        .isString()
        .withMessage('Airline comvendor must be a string'),
    check('ticketInfo.*.ticket_details.airticket_airline_id')
        .notEmpty()
        .withMessage('Airline id is required!')
        .isNumeric()
        .withMessage('Airline ID must be an integer'),
    check('ticketInfo.*.ticket_details.airticket_extra_fee')
        .optional()
        .isNumeric()
        .withMessage('Airline extra fee must be an integer'),
    check('ticketInfo.*.ticket_details.airticket_pnr').optional().isString(),
    check('ticketInfo.*.ticket_details.airticket_issue_date').optional().toDate(),
    check('ticketInfo.*.ticket_details.airticket_journey_date')
        .optional()
        .toDate(),
    check('ticketInfo.*.ticket_details.airticket_return_date')
        .optional()
        .toDate(),
    check('money_receipt.receipt_payment_date').optional().isISO8601().toDate(),
];
//# sourceMappingURL=commonNonCommission.validator.js.map