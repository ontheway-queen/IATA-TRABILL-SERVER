"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const abstract_validators_1 = __importDefault(require("../../../../abstracts/abstract.validators"));
class CompaniesValidator extends abstract_validators_1.default {
    constructor() {
        super(...arguments);
        this.readCompanies = [this.permissions.check(this.resources.companies, 'read')];
        this.deleleCompanies = [
            this.permissions.check(this.resources.companies, 'delete'),
            (0, express_validator_1.check)('deleted_by')
                .isInt()
                .withMessage('deleted by must be an integer value'),
        ];
        this.createCompanies = [
            this.permissions.check(this.resources.companies, 'create'),
            (0, express_validator_1.check)('company_name')
                .notEmpty()
                .withMessage('Enter company name')
                .isLength({ max: 75 })
                .withMessage('Source title can be at most 75 characters.'),
            (0, express_validator_1.check)('company_contact_person')
                .optional()
                .isLength({ max: 75 })
                .withMessage('Source title can be at most 75 characters.'),
            (0, express_validator_1.check)('company_designation')
                .optional()
                .isLength({ max: 50 })
                .withMessage('Enter company designation')
                .withMessage('Source title can be at most 50 characters.'),
            (0, express_validator_1.check)('company_phone')
                .optional()
                .isLength({ max: 20 })
                .withMessage('Source title can be at most 20 characters'),
            (0, express_validator_1.check)('company_address')
                .optional()
                .isLength({ max: 255 })
                .withMessage('enter company address')
                .withMessage('Source title can be at most 255 characters.'),
            (0, express_validator_1.check)('company_created_by')
                .notEmpty()
                .withMessage('must enter integer value')
                .isInt()
                .withMessage('must enter integer value'),
        ];
        this.editCompanies = [
            this.permissions.check(this.resources.companies, 'update'),
            (0, express_validator_1.check)('company_name')
                .optional(true)
                .isLength({ max: 75 })
                .withMessage('Source title can be at most 75 characters.'),
            (0, express_validator_1.check)('company_contact_person')
                .optional(true)
                .isLength({ max: 75 })
                .withMessage('Source title can be at most 75 characters.'),
            (0, express_validator_1.check)('company_designation')
                .optional(true)
                .isLength({ max: 50 })
                .withMessage('Source title can be at most 50 characters.'),
            (0, express_validator_1.check)('company_phone')
                .optional(true)
                .isLength({ max: 20 })
                .withMessage('Source title can be at most 20 characters'),
            (0, express_validator_1.check)('company_address')
                .optional(true)
                .isLength({ max: 255 })
                .withMessage('Source title can be at most 255 characters.'),
        ];
    }
}
exports.default = CompaniesValidator;
//# sourceMappingURL=companies.validators.js.map