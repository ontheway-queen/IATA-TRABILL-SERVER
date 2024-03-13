"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const abstract_validators_1 = __importDefault(require("../../../abstracts/abstract.validators"));
class SmsValidator extends abstract_validators_1.default {
    constructor() {
        super(...arguments);
        this.readSms = [this.permissions.check(this.resources.sms_system, 'read')];
        this.createSms = [
            this.permissions.check(this.resources.sms_system, 'create'),
            (0, express_validator_1.check)('.*.client_mobile').isAlphanumeric(),
            (0, express_validator_1.check)('.*.text_type').isIn(['TEXT', 'UNICODE']),
            (0, express_validator_1.check)('.*.message')
                .isString()
                .notEmpty()
                .withMessage('Please provide message'),
            (0, express_validator_1.check)('.*.date').isDate().toDate(),
            (0, express_validator_1.check)('.*.created_by')
                .notEmpty()
                .withMessage('Please enter created by')
                .isInt()
                .withMessage('created by must be an integer value'),
        ];
    }
}
exports.default = SmsValidator;
//# sourceMappingURL=sms.validator.js.map