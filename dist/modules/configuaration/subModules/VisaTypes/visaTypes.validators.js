"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const abstract_validators_1 = __importDefault(require("../../../../abstracts/abstract.validators"));
class VisaTypesValidator extends abstract_validators_1.default {
    constructor() {
        super(...arguments);
        this.readVisaTypes = [this.permissions.check(this.resources.visa_type, 'read')];
        this.deleteVisaTypes = [
            this.permissions.check(this.resources.visa_type, 'delete'),
        ];
        this.createVisaTypes = [
            this.permissions.check(this.resources.visa_type, 'create'),
            (0, express_validator_1.check)('type_name')
                .isLength({ max: 85 })
                .withMessage('Type name can be at most 85 characters.'),
            (0, express_validator_1.check)('type_created_by')
                .isInt()
                .notEmpty()
                .withMessage('Visa must be created'),
        ];
        this.editVisaTypes = [
            this.permissions.check(this.resources.visa_type, 'update'),
            (0, express_validator_1.check)('type_name')
                .isLength({ max: 85 })
                .withMessage('Type name can be at most 85 characters.'),
            (0, express_validator_1.check)('type_created_by')
                .isInt()
                .optional(true)
                .withMessage('Visa must be created'),
        ];
    }
}
exports.default = VisaTypesValidator;
//# sourceMappingURL=visaTypes.validators.js.map