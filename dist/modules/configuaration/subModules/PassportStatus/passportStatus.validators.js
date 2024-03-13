"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const abstract_validators_1 = __importDefault(require("../../../../abstracts/abstract.validators"));
class PassportStatusValidator extends abstract_validators_1.default {
    constructor() {
        super(...arguments);
        this.readPassportStatus = [
            this.permissions.check(this.resources.passport_status, 'read'),
        ];
        this.deletePassportStatus = [
            this.permissions.check(this.resources.passport_status, 'delete'),
            (0, express_validator_1.check)('deleted_by')
                .notEmpty()
                .withMessage('Please enter deleted by')
                .isInt()
                .withMessage('deleted_by must be an integer value'),
        ];
        this.createPassportStatus = [
            this.permissions.check(this.resources.passport_status, 'create'),
            (0, express_validator_1.check)('pstatus_name')
                .isLength({ max: 155 })
                .withMessage('Passport Status can be at most 155 characters.'),
            (0, express_validator_1.check)('pstatus_created_by')
                .notEmpty()
                .withMessage('Must enter a value')
                .isInt()
                .withMessage('Enter integer value'),
        ];
        this.editPassportStatus = [
            this.permissions.check(this.resources.passport_status, 'update'),
            (0, express_validator_1.check)('pstatus_name')
                .isLength({ max: 155 })
                .withMessage('Passport Status can be at most 155 characters.'),
        ];
    }
}
exports.default = PassportStatusValidator;
//# sourceMappingURL=passportStatus.validators.js.map