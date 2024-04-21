"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const abstract_validators_1 = __importDefault(require("../../../abstracts/abstract.validators"));
class RefundValidator extends abstract_validators_1.default {
    constructor() {
        super(...arguments);
        this.readAirticket = [
            this.permissions.check(this.resources.refund_airticket, 'read'),
        ];
        this.getAirTicketInfos = [
            this.permissions.check(this.resources.refund_airticket, 'read'),
            (0, express_validator_1.check)('client_id')
                .notEmpty()
                .isString()
                .withMessage('Client must be string value'),
            (0, express_validator_1.check)('ticket_no')
                .notEmpty()
                .isArray()
                .withMessage('ticket_no must be an array'),
        ];
        this.deleteAirTicketRefund = [
            this.permissions.check(this.resources.refund_airticket, 'delete'),
            (0, express_validator_1.param)('refund_id'),
            (0, express_validator_1.check)('deleted_by').isInt().withMessage('Please add user id'),
        ];
        this.restoreAirTicketRefund = [
            this.permissions.check(this.resources.refund_airticket, 'update'),
            (0, express_validator_1.param)('refund_id'),
            (0, express_validator_1.check)('refund_restored_by')
                .isInt()
                .withMessage('Must provide refund_restored_by'),
        ];
        this.readOtherClient = [
            this.permissions.check(this.resources.refund_other_invoice, 'read'),
        ];
        this.deleteOtherRefund = [
            this.permissions.check(this.resources.refund_other_invoice, 'delete'),
            (0, express_validator_1.param)('refund_id'),
            (0, express_validator_1.check)('refund_deleted_by')
                .isInt()
                .withMessage('Must provide refund_deleted_by'),
        ];
        this.restoreOtherRefund = [
            this.permissions.check(this.resources.refund_other_invoice, 'update'),
            (0, express_validator_1.param)('refund_id'),
            (0, express_validator_1.check)('refund_restored_by')
                .isInt()
                .withMessage('Must provide refund_restored_by'),
        ];
        this.readOtherVendor = [
            this.permissions.check(this.resources.refund_other_invoice, 'read'),
        ];
        this.deleteOtherVendor = [
            this.permissions.check(this.resources.refund_other_invoice, 'delete'),
        ];
        this.restoreOtherVendor = [
            this.permissions.check(this.resources.refund_other_invoice, 'update'),
        ];
        // readTourClientRefund = [this.permissions.check(this.resources.tours, 'read')];
        this.readTourPakageInfo = [
            this.permissions.check(this.resources.refund_tour_package, 'read'),
        ];
        this.deleteTourPackage = [
            this.permissions.check(this.resources.refund_tour_package, 'delete'),
            (0, express_validator_1.check)('refund_deleted_by')
                .notEmpty()
                .withMessage('Please enter refund_delete_by')
                .isInt()
                .withMessage('Must be an integer value'),
        ];
        this.createTourPackRefund = [
            (0, express_validator_1.check)('created_by').isInt().withMessage('Must provide created_by'),
            (0, express_validator_1.check)('invoice_id').isInt().withMessage('Must provide invoice_id'),
            (0, express_validator_1.check)('voucher_no').isString().withMessage('Must provide voucher_no'),
            (0, express_validator_1.check)('invoice_category_id')
                .isInt()
                .withMessage('Must provide invoice_category_id'),
            (0, express_validator_1.check)('comb_client')
                .isString()
                .notEmpty()
                .withMessage('Must provide Client id in string format'),
            (0, express_validator_1.check)('client_refund_info.crefund_total_amount')
                .isNumeric()
                .withMessage('Must provide total_refund_amount'),
            (0, express_validator_1.check)('client_refund_info.crefund_charge_amount')
                .isNumeric()
                .withMessage('Must provide total_refund_charge'),
            (0, express_validator_1.check)('client_refund_info.crefund_return_amount')
                .isNumeric()
                .withMessage('return_amount must be numeric'),
            (0, express_validator_1.check)('client_refund_info.crefund_payment_type')
                .isIn(['MONEY_RETURN', 'ADJUST'])
                .withMessage('must be either MONEY_RETURN or ADJUST'),
            (0, express_validator_1.check)('client_refund_info.payment_method')
                .isIn([1, 2, 3, 4])
                .optional()
                .withMessage('must be either 1, 2, 3, 4'),
            (0, express_validator_1.check)('client_refund_info.crefund_account_id')
                .isInt()
                .optional()
                .withMessage('crefund_account_id must be int'),
            (0, express_validator_1.check)('client_refund_info.cheque_no')
                .isString()
                .optional()
                .withMessage('cheque_no must be string'),
            (0, express_validator_1.check)('client_refund_info.date')
                .isDate({ format: 'YYYY-MM-DD' })
                .notEmpty()
                .withMessage('date must be in the format of YYYY-MM-DD'),
            (0, express_validator_1.check)('client_refund_info.withdraw_date')
                .isDate({ format: 'YYYY-MM-DD' })
                .optional()
                .withMessage('withdraw_date must be in the format of YYYY-MM-DD'),
            (0, express_validator_1.check)('client_refund_info.bank_name')
                .isString()
                .optional()
                .withMessage('bank_name must be string'),
        ];
        this.readInvoicesById = [
            this.permissions.check(this.resources.refund_other_invoice, 'read'),
        ];
        this.readManualRefunds = [
            this.permissions.check(this.resources.refund_other_invoice, 'read'),
        ];
        this.deleteManualRefund = [
            this.permissions.check(this.resources.refund_other_invoice, 'delete'),
            (0, express_validator_1.check)('refund_deleted_by')
                .notEmpty()
                .withMessage('Please provide deleted by')
                .isInt()
                .withMessage('Must be an integer value'),
        ];
        this.restoreManualRefund = [
            this.permissions.check(this.resources.refund_other_invoice, 'update'),
            (0, express_validator_1.check)('refund_restored_by')
                .notEmpty()
                .withMessage('Please provide restored by')
                .isInt()
                .withMessage('Must be an integer value'),
        ];
        /**
         * validator for `airticket refund` router
         */
        this.addAirTicketRefund = [
            this.permissions.check(this.resources.refund_airticket, 'create'),
            (0, express_validator_1.check)('comb_client')
                .notEmpty()
                .isString()
                .withMessage('Client must be string value'),
            (0, express_validator_1.check)('created_by').notEmpty().withMessage('Pleace add user id'),
            (0, express_validator_1.check)('invoice_id').notEmpty().withMessage('Pleace add invoice id'),
            (0, express_validator_1.check)('client_refund_info.crefund_payment_type')
                .isIn(['MONEY_RETURN', 'ADJUST'])
                .withMessage('must provide  client refund payment type'),
            (0, express_validator_1.check)('client_refund_info.crefund_total_amount')
                .isNumeric()
                .withMessage('must provide  client refund total amount'),
            (0, express_validator_1.check)('client_refund_info.crefund_charge_amount')
                .isNumeric()
                .withMessage('must provide client refund charge amount'),
            (0, express_validator_1.check)('client_refund_info.crefund_return_amount')
                .isNumeric()
                .withMessage('must provide valid client refund return amount')
                .optional(),
            (0, express_validator_1.check)('client_refund_info.type_id')
                .optional()
                .isInt()
                .withMessage('must provide valid refund chanrge amount'),
            (0, express_validator_1.check)('client_refund_info.account_id')
                .optional()
                .isInt()
                .withMessage('refund chanrge amount'),
            (0, express_validator_1.check)('client_refund_info.payment_type')
                .isIn(['CASH', 'CHEQUE'])
                .optional()
                .withMessage('must provide valid payment type'),
            (0, express_validator_1.check)('client_refund_info.cheque_no')
                .isString()
                .optional()
                .withMessage('must provide valid cheque no'),
            (0, express_validator_1.check)('client_refund_info.bank_name')
                .isString()
                .optional()
                .withMessage('must provide valid bank name'),
            (0, express_validator_1.check)('vendor_refund_info.*.airticket_id')
                .isInt()
                .withMessage('must provide airticket id'),
            (0, express_validator_1.check)('vendor_refund_info.*.airticket_vendor_id')
                .isString()
                .withMessage('must provide airticket vendor id')
                .optional(),
            (0, express_validator_1.check)('vendor_refund_info.*.airticket_vendor_combine_id')
                .isString()
                .withMessage('must provide airticket vendor combine id')
                .optional(),
            (0, express_validator_1.check)('vendor_refund_info.*.vrefund_charge_amount')
                .isNumeric()
                .withMessage('must provide vendor charge '),
            (0, express_validator_1.check)('vendor_refund_info.*.vrefund_payment_type')
                .isIn(['MONEY_RETURN', 'ADJUST'])
                .withMessage('must provide vendor payment '),
            (0, express_validator_1.check)('vendor_refund_info.*.vrefund_return_amount')
                .isNumeric()
                .withMessage('Must provide valid vrefund_return_amount')
                .optional(),
            (0, express_validator_1.check)('vendor_refund_info.*.vrefund_adjust_amount')
                .isNumeric()
                .withMessage('must provide valid vrefund_adjust_amount')
                .optional(),
            (0, express_validator_1.check)('vendor_refund_info.*.vrefund_total_amount')
                .isNumeric()
                .withMessage('must provide valid refund total amount'),
            (0, express_validator_1.check)('vendor_refund_info.*.type_id')
                .isNumeric()
                .withMessage('must provide as valid type_id')
                .optional(),
            (0, express_validator_1.check)('vendor_refund_info.*.account_id')
                .isNumeric()
                .withMessage('must provide as valid account_id')
                .optional(),
            (0, express_validator_1.check)('vendor_refund_info.*.payment_type')
                .isIn(['CASH', 'CHEQUE'])
                .withMessage('must provide a valid payment type')
                .optional(),
            (0, express_validator_1.check)('vendor_refund_info.*.cheque_no')
                .notEmpty()
                .withMessage('must provide as valid cheque_no')
                .optional(),
            (0, express_validator_1.check)('vendor_refund_info.*.bank_name')
                .notEmpty()
                .withMessage('must provide as valid bank_name')
                .optional(),
            (0, express_validator_1.check)('vendor_refund_info.*.withdraw_date')
                .notEmpty()
                .withMessage('must provide as valid withdraw_date')
                .optional(),
        ];
        /**
         * validator for `refund other client` router
         */
        this.addOtherRefund = [
            this.permissions.check(this.resources.refund_other_invoice, 'create'),
            (0, express_validator_1.check)('created_by').isInt(),
            (0, express_validator_1.check)('invoice_id').isInt(),
            (0, express_validator_1.check)('voucher_no').isString(),
            (0, express_validator_1.check)('date').optional().toDate(),
            (0, express_validator_1.check)('comb_client').notEmpty().withMessage('Must Provide valid client ID'),
            (0, express_validator_1.check)('client_refund_info.total_refund_amount')
                .isNumeric()
                .withMessage('Must Provide total_refund_amount'),
            (0, express_validator_1.check)('client_refund_info.total_refund_charge')
                .isNumeric()
                .withMessage('Must Provide total_refund_charge'),
            (0, express_validator_1.check)('client_refund_info.total_return_amount')
                .isNumeric()
                .withMessage('Must Provide return_amount'),
            (0, express_validator_1.check)('client_refund_info.crefund_payment_type')
                .isIn(['MONEY_RETURN', 'ADJUST'])
                .withMessage('crefund_payment_type Must be either MONEY_RETURN or ADJUST'),
            (0, express_validator_1.check)('client_refund_info.money_return_type')
                .isInt()
                .withMessage('money return type must be an integer value')
                .optional(),
            (0, express_validator_1.check)('client_refund_info.account_id')
                .isInt()
                .withMessage('account_id Must be an integer value')
                .optional(),
            (0, express_validator_1.check)('client_refund_info.cheque_no')
                .isString()
                .withMessage('cheque_no Must be an string value')
                .optional(),
            (0, express_validator_1.check)('client_refund_info.bank_name')
                .isString()
                .withMessage('bank_name Must be an string value')
                .optional(),
            (0, express_validator_1.check)('client_refund_info.withdraw_date')
                .isString()
                .withMessage('withdraw_date Must be an string value')
                .optional(),
            (0, express_validator_1.check)('vendor_refund_info.*.comb_vendor_id')
                .isString()
                .withMessage('billing_id Must be an integer value'),
            (0, express_validator_1.check)('vendor_refund_info.*.vrefund_bill_id')
                .isInt()
                .withMessage('billing_id Must be an integer value'),
            (0, express_validator_1.check)('vendor_refund_info.*.vrefund_quantity')
                .isInt()
                .withMessage('billing_quantity Must be an integer value')
                .notEmpty()
                .withMessage('Please provide refund quantity'),
            (0, express_validator_1.check)('vendor_refund_info.*.billing_remaining_quantity')
                .isInt()
                .withMessage('billing_remaining_quantity Must be an integer value')
                .notEmpty()
                .withMessage('Please provide billing remaining quantity'),
            (0, express_validator_1.check)('vendor_refund_info.*.vrefund_product_id')
                .isInt()
                .withMessage('billing_product_id Must be an integer value'),
            (0, express_validator_1.check)('vendor_refund_info.*.vrefund_charge')
                .isNumeric()
                .withMessage('refund_charge Must be an integer value'),
            (0, express_validator_1.check)('vendor_refund_info.*.vrefund_amount')
                .isNumeric()
                .withMessage('refund_amount Must be an integer value'),
            (0, express_validator_1.check)('vendor_refund_info.*.vrefund_return_amount')
                .isNumeric()
                .withMessage('return_amount Must be an integer value'),
            (0, express_validator_1.check)('vendor_refund_info.*.vrefund_invoice_category_id')
                .isInt()
                .withMessage('vrefund_invoice_category_id Must be an integer value'),
            (0, express_validator_1.check)('vendor_refund_info.*.vrefund_payment_type')
                .isIn(['MONEY_RETURN', 'ADJUST'])
                .withMessage('refund_payment_type Must be either MONEY_RETURN or ADJUST'),
            (0, express_validator_1.check)('vendor_refund_info.*.type_id')
                .isInt()
                .withMessage('type_id Must be an integer value')
                .optional(),
            (0, express_validator_1.check)('vendor_refund_info.*.vrefund_account_id')
                .isInt()
                .withMessage('account_id Must be an integer value')
                .optional(),
            (0, express_validator_1.check)('vendor_refund_info.*.cheque_no')
                .isString()
                .withMessage('cheque_no Must be a string value')
                .optional(),
            (0, express_validator_1.check)('vendor_refund_info.*.bank_name')
                .isString()
                .withMessage('bank_name Must be a string value')
                .optional(),
            (0, express_validator_1.check)('vendor_refund_info.*.withdraw_date')
                .isString()
                .withMessage('withdraw_date Must be a string value')
                .optional(),
        ];
        /**
         * validator for `refund other vendor` router
         */
        this.addVendorRefund = [
            this.permissions.check(this.resources.refund_other_invoice, 'create'),
            (0, express_validator_1.check)('vendor_id').isInt(),
            (0, express_validator_1.check)('invoice_id').isInt(),
            (0, express_validator_1.check)('vouchar_no').isString(),
            (0, express_validator_1.check)('total_refund_charge').isInt(),
            (0, express_validator_1.check)('net_total').isInt(),
            (0, express_validator_1.check)('refund_payment_type').isIn(['MONEY_RETURN', 'ADJUST']),
            (0, express_validator_1.check)('payment_type').isIn(['CASH', 'CHEQUE']).optional(),
            (0, express_validator_1.check)('refund_info.*.billing_invoice_id').isInt(),
            (0, express_validator_1.check)('refund_info.*.billing_product_id').isInt(),
            (0, express_validator_1.check)('refund_info.*.refund_quantity').isInt(),
            (0, express_validator_1.check)('refund_info.*.refund_charge').isInt(),
            (0, express_validator_1.check)('refund_info.*.refund_amount').isInt(),
            (0, express_validator_1.check)('refund_info.*.refund_price').isInt(),
        ];
        /**
         * manual refunds
         */
        this.createManualRefund = [
            this.permissions.check(this.resources.refund_other_invoice, 'create'),
            (0, express_validator_1.check)('refund_invoice_id')
                .isInt()
                .withMessage('Must Provide an Invoice ID'),
            (0, express_validator_1.check)('refund_created_by')
                .isInt()
                .withMessage('Must Provide Refund Created By'),
            (0, express_validator_1.check)('refund_client_info.client_id')
                .isInt()
                .withMessage('Must Provide an Integer value')
                .optional(),
            (0, express_validator_1.check)('refund_client_info.client_refund_amount')
                .isNumeric()
                .withMessage('Must Provide an Numeric value')
                .optional(),
            (0, express_validator_1.check)('refund_client_info.client_refund_total')
                .isNumeric()
                .withMessage('Must Provide an Numeric value')
                .optional(),
            (0, express_validator_1.check)('refund_client_info.client_refund_charge')
                .isNumeric()
                .withMessage('Must Provide an Numeric value')
                .optional(),
            (0, express_validator_1.check)('refund_client_info.client_refund_type')
                .isIn(['ADJUST', 'MONEY_RETURN'])
                .withMessage('Either ADJUST or MONEY_RETURN')
                .optional(),
            (0, express_validator_1.check)('refund_client_info.client_money_return_type')
                .isIn(['CASH', 'CHEQUE'])
                .withMessage('Either ADJUST or MONEY_RETURN')
                .optional(),
            (0, express_validator_1.check)('refund_client_info.client_money_receipt_amount')
                .isNumeric()
                .withMessage('Must Provide an Numeric value')
                .optional({ nullable: true }),
            (0, express_validator_1.check)('refund_client_info.crcheque_cheque_no').isString().optional(),
            (0, express_validator_1.check)('refund_client_info.crcheque_withdraw_date')
                .isDate({ format: 'YYYY-MM-DD' })
                .withMessage('Must be in the format of YYYY-MM-DD')
                .optional(),
            (0, express_validator_1.check)('refund_client_info.crefund_date')
                .isDate({ format: 'YYYY-MM-DD' })
                .withMessage('Must be in the format of YYYY-MM-DD')
                .optional(),
            (0, express_validator_1.check)('refund_client_info.crcheque_bank_name').isString().optional(),
            (0, express_validator_1.check)('refund_client_info.crcheque_note').isString().optional(),
            (0, express_validator_1.check)('refund_client_info.caccount_type_id')
                .isInt()
                .withMessage('Must Be an Integer value')
                .optional(),
            (0, express_validator_1.check)('refund_client_info.caccount_id')
                .isInt()
                .withMessage('Must Be an Integer value')
                .optional(),
            (0, express_validator_1.check)('refund_client_info.crefund_note').isString().optional(),
            (0, express_validator_1.check)('refund_vendor_info.vendor_id')
                .isInt()
                .withMessage('Must Provide an Integer value')
                .optional(),
            (0, express_validator_1.check)('refund_vendor_info.vendor_refund_amount')
                .isNumeric()
                .withMessage('Must Provide an Numeric value')
                .optional(),
            (0, express_validator_1.check)('refund_vendor_info.vendor_refund_total')
                .isNumeric()
                .withMessage('Must Provide an Numeric value')
                .optional(),
            (0, express_validator_1.check)('refund_vendor_info.vendor_refund_charge')
                .isNumeric()
                .withMessage('Must Provide an Numeric value')
                .optional(),
            (0, express_validator_1.check)('refund_vendor_info.vendor_refund_type')
                .isIn(['ADJUST', 'MONEY_RETURN'])
                .withMessage('Either ADJUST or MONEY_RETURN')
                .optional(),
            (0, express_validator_1.check)('refund_vendor_info.vendor_money_return_type')
                .isIn(['CASH', 'CHEQUE'])
                .withMessage('Either ADJUST or MONEY_RETURN')
                .optional(),
            (0, express_validator_1.check)('refund_vendor_info.vrcheque_cheque_no').isString().optional(),
            (0, express_validator_1.check)('refund_vendor_info.vrcheque_withdraw_date')
                .isDate({ format: 'YYYY-MM-DD' })
                .withMessage('Must be in the format of YYYY-MM-DD')
                .optional(),
            (0, express_validator_1.check)('refund_vendor_info.vrefund_date')
                .isDate({ format: 'YYYY-MM-DD' })
                .withMessage('Must be in the format of YYYY-MM-DD')
                .optional(),
            (0, express_validator_1.check)('refund_vendor_info.vrcheque_bank_name').isString().optional(),
            (0, express_validator_1.check)('refund_vendor_info.vrcheque_note').isString().optional(),
            (0, express_validator_1.check)('refund_vendor_info.vaccount_type_id')
                .isInt()
                .withMessage('Must Be an Integer value')
                .optional(),
            (0, express_validator_1.check)('refund_vendor_info.vaccount_id')
                .isInt()
                .withMessage('Must Be an Integer value')
                .optional(),
            (0, express_validator_1.check)('refund_vendor_info.vrefund_note').isString().optional(),
        ];
        this.viewAllVisaHalfRefunds = [
            this.permissions.check(this.resources.refund_other_invoice, 'read'),
        ];
        this.createAirTicketHalfRefund = [
            this.permissions.check(this.resources.refund_other_invoice, 'create'),
            (0, express_validator_1.check)('refund_invoice_id').isInt().withMessage('Must be an integer value'),
            (0, express_validator_1.check)('refund_client_id').isInt().withMessage('Must be an integer value'),
            (0, express_validator_1.check)('refund_vendor_id').isInt().withMessage('Must be an integer value'),
            (0, express_validator_1.check)('refund_client_refund_amount')
                .isInt()
                .withMessage('Must be an integer value')
                .isLength({ max: 14 })
                .withMessage('client refund amount maximum 14 charecter'),
            (0, express_validator_1.check)('refund_client_service_charge')
                .optional()
                .isInt()
                .withMessage('Must be an integer value')
                .isLength({ max: 12 })
                .withMessage('client service charge maximum 12 charecter'),
            (0, express_validator_1.check)('refund_vendor_refund_amount')
                .isInt()
                .withMessage('Must be an integer value')
                .isLength({ max: 14 })
                .withMessage('vendor refund amount maximum 14 charecter'),
            (0, express_validator_1.check)('refund_vendor_service_charge')
                .optional()
                .isInt()
                .withMessage('Must be an integer value')
                .isLength({ max: 12 })
                .withMessage('vendor service charge maximum 12 charecter'),
            (0, express_validator_1.check)('refund_account_id').isInt().withMessage('Must be an integer value'),
            (0, express_validator_1.check)('refund_created_by').isInt().withMessage('Must be an integer value'),
        ];
        this.deleteAitHalfRefund = [
            this.permissions.check(this.resources.refund_other_invoice, 'delete'),
        ];
        this.restoredAitHalfRefund = [
            this.permissions.check(this.resources.refund_other_invoice, 'update'),
        ];
        this.readAitHalfRefund = [
            this.permissions.check(this.resources.refund_other_invoice, 'read'),
        ];
        this.viewCheques = [
            this.permissions.check(this.resources.refund_other_invoice, 'read'),
            (0, express_validator_1.query)('status')
                .isIn(['DEPOSIT', 'PENDING', 'BOUNCE', 'RETURN'])
                .withMessage('cheque status must be PENDING | DEPOSIT | BOUNCE | RETURN'),
        ];
        this.updateChequeStatus = [
            this.permissions.check(this.resources.refund_other_invoice, 'update'),
            (0, express_validator_1.query)('status')
                .isIn(['DEPOSIT', 'BOUNCE', 'RETURN'])
                .withMessage('cheque status must be DEPOSIT | BOUNCE | RETURN'),
            (0, express_validator_1.check)('account_id')
                .optional()
                .isInt()
                .withMessage('Account Id must be an integer value'),
            (0, express_validator_1.check)('cheque_amount')
                .optional()
                .isFloat()
                .withMessage('Please provide valid cheque amount'),
            (0, express_validator_1.check)('created_by')
                .notEmpty()
                .isInt()
                .withMessage('Created By must be an integer value'),
        ];
        this.addPartialRefund = [
            this.permissions.check(this.resources.refund_module, 'create'),
            (0, express_validator_1.check)('invoice_id')
                .isInt()
                .withMessage('invoice id must be an integer value'),
            (0, express_validator_1.check)('comb_client').notEmpty().withMessage('Please enter comb client'),
            (0, express_validator_1.check)('created_by')
                .isInt()
                .withMessage('created by must be an integer value'),
            (0, express_validator_1.check)('prfnd_account_id')
                .optional()
                .isInt()
                .withMessage('account id must be an integer value'),
            (0, express_validator_1.check)('prfnd_charge_amount').optional(),
            (0, express_validator_1.check)('prfnd_return_amount').optional(),
            (0, express_validator_1.check)('prfnd_total_amount').optional(),
            (0, express_validator_1.check)('date').optional().toDate(),
            (0, express_validator_1.check)('note').optional(),
            (0, express_validator_1.check)('prfnd_payment_type')
                .notEmpty()
                .withMessage('Please enter payment type')
                .isIn(['ADJUST', 'MONEY_RETURN'])
                .withMessage('payment type must be ADJUST or MONEY_RETURN'),
            (0, express_validator_1.check)('vendor_refund_info.*.vprfnd_airticket_id')
                .notEmpty()
                .withMessage('Please provide airticket id')
                .isInt()
                .withMessage('account id must be an integer value'),
            (0, express_validator_1.check)('vendor_refund_info.*.vprfnd_account_id')
                .optional()
                .isInt()
                .withMessage('account id must be an integer value'),
            (0, express_validator_1.check)('vendor_refund_info.*.vprfnd_payment_type')
                .notEmpty()
                .withMessage('Please enter payment type')
                .isIn(['ADJUST', 'MONEY_RETURN'])
                .withMessage('payment type must be ADJUST or MONEY_RETURN'),
            (0, express_validator_1.check)('vendor_refund_info.*.vprfnd_charge_amount').optional(),
            (0, express_validator_1.check)('vendor_refund_info.*.vprfnd_return_amount').optional(),
            (0, express_validator_1.check)('vendor_refund_info.*.prfnd_profit_amount').optional(),
            (0, express_validator_1.check)('vendor_refund_info.*.vprfnd_total_amount').optional(),
            (0, express_validator_1.check)('vendor_refund_info.*.comb_vendor')
                .notEmpty()
                .withMessage('Please enter comb vendor'),
        ];
        this.DeletePartialRefund = [
            this.permissions.check(this.resources.refund_module, 'delete'),
            (0, express_validator_1.check)('deleted_by')
                .notEmpty()
                .withMessage('Please enter deleted by')
                .isInt()
                .withMessage('deleted by must be an integer value'),
        ];
        this.readPersialRefund = [
            this.permissions.check(this.resources.refund_module, 'read'),
        ];
    }
}
exports.default = RefundValidator;
//# sourceMappingURL=refund.validator.js.map