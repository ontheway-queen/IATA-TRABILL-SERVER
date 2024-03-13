"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const abstract_validators_1 = __importDefault(require("../../../../abstracts/abstract.validators"));
class AppConfigValidators extends abstract_validators_1.default {
    constructor() {
        super(...arguments);
        this.readOffice = [
            this.permissions.check(this.resources.configuration_module, 'read'),
        ];
        this.createOffice = [
            this.permissions.check(this.resources.configuration_module, 'create'),
            (0, express_validator_1.check)('office_name').notEmpty().withMessage('Please enter office name'),
            (0, express_validator_1.check)('office_address').optional(),
            (0, express_validator_1.check)('office_email')
                .optional()
                .isEmail()
                .withMessage('Please enter a valid email'),
            (0, express_validator_1.check)('office_created_by')
                .notEmpty()
                .withMessage('Please enter office created by')
                .isInt()
                .withMessage('office created by must be an integer value'),
        ];
        this.editOffice = [
            this.permissions.check(this.resources.configuration_module, 'update'),
            (0, express_validator_1.check)('office_name').optional(),
            (0, express_validator_1.check)('office_address').optional(),
            (0, express_validator_1.check)('office_email')
                .optional()
                .isEmail()
                .withMessage('Please enter a valid email'),
            (0, express_validator_1.check)('office_updated_by')
                .notEmpty()
                .withMessage('Please enter office updated by')
                .isInt()
                .withMessage('office updated by must be an integer value'),
        ];
        this.deleteOffice = [
            this.permissions.check(this.resources.configuration_module, 'delete'),
            (0, express_validator_1.check)('deleted_by')
                .notEmpty()
                .withMessage('Please enter office deleted by')
                .isInt()
                .withMessage('office deleted by must be an integer value'),
        ];
        this.readAppConfig = [
            this.permissions.check(this.resources.configuration_module, 'read'),
        ];
    }
}
exports.default = AppConfigValidators;
//# sourceMappingURL=appConfig.validators.js.map