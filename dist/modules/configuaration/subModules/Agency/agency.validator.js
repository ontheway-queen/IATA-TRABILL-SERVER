"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const abstract_validators_1 = __importDefault(require("../../../../abstracts/abstract.validators"));
class AgencyValidator extends abstract_validators_1.default {
    constructor() {
        super(...arguments);
        this.createAgency = [
            this.permissions.check(this.resources.agency, 'create'),
            (0, express_validator_1.check)('agency_name')
                .notEmpty()
                .withMessage('Please Enter agency_name')
                .isLength({ max: 95 })
                .withMessage('Source title can be at most 95 characters.'),
            (0, express_validator_1.check)('agency_created_by')
                .notEmpty()
                .withMessage('Must enter a value')
                .isInt()
                .withMessage('Enter integer value'),
        ];
        this.updateAgency = [
            this.permissions.check(this.resources.agency, 'update'),
            (0, express_validator_1.check)('agency_name')
                .isLength({ max: 95 })
                .optional()
                .withMessage('Source title can be at most 95 characters.'),
        ];
        this.getAllAgencies = [this.permissions.check(this.resources.agency, 'read')];
        this.deleteAgency = [
            this.permissions.check(this.resources.agency, 'delete'),
            (0, express_validator_1.check)('deleted_by').isInt().withMessage('Please provide deleted by'),
        ];
    }
}
exports.default = AgencyValidator;
//# sourceMappingURL=agency.validator.js.map