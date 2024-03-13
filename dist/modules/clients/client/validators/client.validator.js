"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const abstract_validators_1 = __importDefault(require("../../../../abstracts/abstract.validators"));
class ClientValidator extends abstract_validators_1.default {
    constructor() {
        super(...arguments);
        this.readClient = [this.permissions.check(this.resources.clients, 'read')];
        this.deleteClient = [this.permissions.check(this.resources.clients, 'delete')];
        this.restoreClient = [this.permissions.check(this.resources.clients, 'update')];
        // ACTIVE STATUS UPDATE VALIDATOR
        this.activeStatus = [
            this.permissions.check(this.resources.clients, 'update'),
            (0, express_validator_1.check)('status')
                .isIn(['active', 'inactive'])
                .withMessage('Client active status must be given'),
            (0, express_validator_1.check)('created_by')
                .notEmpty()
                .withMessage('please provide created by')
                .isInt()
                .withMessage('created by must be an integer value'),
        ];
        // CREATE AND UPDATE CLIENT VALIDATOR
        this.addEditClient = [
            this.permissions.check(this.resources.clients, 'create'),
            (0, express_validator_1.check)('client_category_id').notEmpty().isInt(),
            (0, express_validator_1.check)('client_type')
                .notEmpty()
                .isIn(['INDIVIDUAL', 'CORPORATE'])
                .withMessage('Client type must be of type INDIVIDUAL or CORPORATE'),
            (0, express_validator_1.check)('client_designation').optional().isString(),
            (0, express_validator_1.check)('opening_balance_type').optional().isIn(['CREDIT', 'DEBIT']),
            (0, express_validator_1.check)('client_credit_limit').optional(),
            (0, express_validator_1.check)('opening_balance').optional().isDecimal(),
            (0, express_validator_1.check)('client_gender')
                .optional()
                .isIn(['Male', 'Female'])
                .withMessage('Client gender can be at most 10 characters.'),
            (0, express_validator_1.check)('client_created_by').notEmpty().toInt(),
            (0, express_validator_1.check)('client_trade_license').optional(),
            (0, express_validator_1.check)('client_address').optional().isString(),
            (0, express_validator_1.check)('client_mobile').optional().isString(),
            (0, express_validator_1.check)('client_email').optional(),
            (0, express_validator_1.check)('client_name').notEmpty().isString(),
        ];
        this.checkCreditLimit = [
            (0, express_validator_1.check)('amount').notEmpty(),
            (0, express_validator_1.check)('combClient').notEmpty(),
        ];
        this.readClientAllInvoices = [
            this.permissions.check(this.resources.clients, 'read'),
        ];
        this.readClientAllMoneyReceipt = [
            this.permissions.check(this.resources.money_receipt, 'read'),
        ];
        this.readClientAllQuotations = [
            this.permissions.check(this.resources.clients, 'read'),
        ];
        this.readClientAllRefunds = [
            this.permissions.check(this.resources.clients, 'read'),
        ];
        this.readClientAllPassport = [
            this.permissions.check(this.resources.passport_management, 'read'),
        ];
        this.readCombClientIncentive = [
            this.permissions.check(this.resources.account_investments, 'read'),
        ];
        this.deleteCombClientIncentive = [
            this.permissions.check(this.resources.account_investments, 'delete'),
            (0, express_validator_1.check)('incentive_deleted_by')
                .notEmpty()
                .withMessage('Please enter incentive_deleted_by')
                .isInt()
                .withMessage('incentive_deleted_by must be an integer value'),
        ];
        this.createCombClientIncentive = [
            this.permissions.check(this.resources.account_investments, 'create'),
            (0, express_validator_1.check)('comb_client').optional(),
            (0, express_validator_1.check)('account_id')
                .optional()
                .isInt()
                .withMessage('account_id must be an interger value'),
            (0, express_validator_1.check)('adjust_with_bill')
                .notEmpty()
                .withMessage('Please enter adjust with bill')
                .isIn(['YES', 'NO'])
                .withMessage('adjust_with_bill must be YES | NO'),
            (0, express_validator_1.check)('type_id')
                .optional()
                .isIn([1, 2, 3, 4])
                .withMessage('type must be 1 | 2 | 3 or 4'),
            (0, express_validator_1.check)('amount').optional(),
            (0, express_validator_1.check)('incentive_created_by')
                .notEmpty()
                .withMessage('Please enter incentive created by')
                .isInt()
                .withMessage('incentive created by must be an integer value'),
            (0, express_validator_1.check)('date').optional(),
            (0, express_validator_1.check)('note').optional(),
        ];
        this.editCombClientIncentive = [
            this.permissions.check(this.resources.account_investments, 'create'),
            (0, express_validator_1.check)('comb_client').notEmpty().withMessage('Please enter comb_client'),
            (0, express_validator_1.check)('account_id')
                .optional()
                .isInt()
                .withMessage('account_id must be an interger value'),
            (0, express_validator_1.check)('adjust_with_bill')
                .optional()
                .isIn(['YES', 'NO'])
                .withMessage('adjust_with_bill must be YES | NO'),
            (0, express_validator_1.check)('type_id')
                .optional()
                .isIn([1, 2, 3, 4])
                .withMessage('type must be 1 | 2 | 3 or 4'),
            (0, express_validator_1.check)('amount').optional(),
            (0, express_validator_1.check)('incentive_created_by')
                .optional()
                .isInt()
                .withMessage('incentive created by must be an integer value'),
            (0, express_validator_1.check)('date').optional(),
            (0, express_validator_1.check)('note').optional(),
        ];
    }
}
exports.default = ClientValidator;
//# sourceMappingURL=client.validator.js.map