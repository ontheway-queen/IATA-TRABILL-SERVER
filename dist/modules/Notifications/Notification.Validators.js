"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const abstract_validators_1 = __importDefault(require("../../abstracts/abstract.validators"));
class NotificationValidators extends abstract_validators_1.default {
    constructor() {
        super(...arguments);
        this.readMoneyReceipt = [this.permissions.check(this.resources.database, 'read')];
        this.passport_expire = [this.permissions.check(this.resources.database, 'read')];
        this.updateCollectionCheque = [
            this.permissions.check(this.resources.cheque_management, 'update'),
            (0, express_validator_1.check)('user_id')
                .notEmpty()
                .withMessage('Please enter user id')
                .isInt()
                .withMessage('user id must be an integer value'),
        ];
        this.updatePaymentChequ = [
            this.permissions.check(this.resources.cheque_management, 'update'),
            (0, express_validator_1.check)('chequeTable')
                .isIn(['ADVR', 'EXPENSE', 'LOAN_PAYMENT', 'LOAN_RECEIVED', 'LOAN_CHEQUE'])
                .withMessage('cheque table must be ADVR | EXPENSE | LOAN_PAYMENT | LOAN_RECEIVED | LOAN_CHEQUE'),
            (0, express_validator_1.check)('user_id')
                .notEmpty()
                .withMessage('Please enter user id')
                .isInt()
                .withMessage('user id must be an integer value'),
        ];
        this.readPassport = [
            this.permissions.check(this.resources.passenger_list_report, 'read'),
        ];
        this.collectionCheque = [
            this.permissions.check(this.resources.cheque_management, 'read'),
        ];
        this.readVisa = [this.permissions.check(this.resources.invoice_visa, 'read')];
    }
}
exports.default = NotificationValidators;
//# sourceMappingURL=Notification.Validators.js.map