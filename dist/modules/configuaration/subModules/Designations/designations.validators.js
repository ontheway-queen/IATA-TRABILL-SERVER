"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const abstract_validators_1 = __importDefault(require("../../../../abstracts/abstract.validators"));
class DesignationsValidator extends abstract_validators_1.default {
    constructor() {
        super(...arguments);
        this.readDesignation = [
            this.permissions.check(this.resources.designations, 'read'),
        ];
        this.deleteDesignation = [
            this.permissions.check(this.resources.designations, 'delete'),
            (0, express_validator_1.check)('deleted_by')
                .notEmpty()
                .withMessage('Please provide deleted by')
                .isInt()
                .withMessage('deleted by must be an integer value'),
        ];
        this.createDesignation = [
            this.permissions.check(this.resources.designations, 'create'),
            (0, express_validator_1.check)('designation_name')
                .isLength({ max: 65 })
                .withMessage('Designations name can be at most 65 characters.'),
        ];
        this.editDesignation = [
            this.permissions.check(this.resources.designations, 'update'),
            (0, express_validator_1.check)('designation_name')
                .isLength({ max: 65 })
                .withMessage('Designations name can be at most 65 characters.'),
            (0, express_validator_1.check)('designation_created_by')
                .isInt()
                .optional(true)
                .withMessage('Designation must be created'),
        ];
    }
}
exports.default = DesignationsValidator;
//# sourceMappingURL=designations.validators.js.map