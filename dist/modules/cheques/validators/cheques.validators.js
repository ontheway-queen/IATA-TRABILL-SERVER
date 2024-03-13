"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const abstract_validators_1 = __importDefault(require("../../../abstracts/abstract.validators"));
class chequesValidators extends abstract_validators_1.default {
    constructor() {
        super(...arguments);
        this.readCheques = [
            this.permissions.check(this.resources.cheque_management, 'read'),
        ];
        this.updateChequeStatus = [
            this.permissions.check(this.resources.cheque_management, 'update'),
            (0, express_validator_1.check)('cheque_id')
                .notEmpty()
                .withMessage('Pleace provide cheque id')
                .isInt()
                .withMessage('cheque id must be an integer value'),
            (0, express_validator_1.check)('account_id')
                .optional()
                .customSanitizer((value) => (value === null ? undefined : value))
                .isInt()
                .withMessage('account id must be an integer value'),
            (0, express_validator_1.check)('comb_vendor')
                .optional()
                .customSanitizer((value) => (value === null ? undefined : value))
                .customSanitizer((value) => (value === null ? undefined : value))
                .isString()
                .withMessage('Vendor must be an string value'),
            (0, express_validator_1.check)('comb_client')
                .optional()
                .customSanitizer((value) => (value === null ? undefined : value))
                .isString()
                .withMessage('Client must be an string value'),
            (0, express_validator_1.check)('cheque_type')
                .notEmpty()
                .withMessage('Pleace provide cheque type')
                .isIn([
                'MR_ADVR',
                'EXPENSE',
                'LOAN',
                'LOAN_PAYMENT',
                'LOAN_RECEIVED',
                'MONEY_RECEIPT',
                'PAYROLL',
                'VENDOR_ADVR',
                'VENDOR_PAYMENT',
            ])
                .withMessage('Pleace provide valid cheque type'),
            (0, express_validator_1.check)('cheque_status')
                .notEmpty()
                .withMessage('Pleace provide cheque status')
                .isIn(['DEPOSIT', 'BOUNCE', 'RETURN'])
                .withMessage('Pleace provide valid cheque status'),
            (0, express_validator_1.check)('cheque_amount')
                .notEmpty()
                .withMessage('Pleace provide cheque amount'),
            (0, express_validator_1.check)('cheque_note')
                .optional()
                .customSanitizer((value) => (value === null ? undefined : value))
                .isString()
                .withMessage('Cheque not must be string value'),
            (0, express_validator_1.check)('date')
                .notEmpty()
                .withMessage('Date is required! pleace provide date')
                .toDate(),
            (0, express_validator_1.check)('user_id')
                .notEmpty()
                .withMessage('User id is required! pleace provide user id'),
        ];
    }
}
exports.default = chequesValidators;
//# sourceMappingURL=cheques.validators.js.map