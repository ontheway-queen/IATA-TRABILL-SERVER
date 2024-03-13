"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const abstract_validators_1 = __importDefault(require("../../../../abstracts/abstract.validators"));
class ClientCategoryValidator extends abstract_validators_1.default {
    constructor() {
        super(...arguments);
        this.readClientCategory = [this.permissions.check(this.resources.clients, 'read')];
        this.deleteClientCategory = [
            this.permissions.check(this.resources.client_category, 'delete'),
        ];
        this.createClientCategory = [
            this.permissions.check(this.resources.client_category, 'create'),
            (0, express_validator_1.check)('category_title')
                .isLength({ max: 65 })
                .withMessage('Category title can be at most 65 characters.'),
            (0, express_validator_1.check)('category_prefix')
                .isLength({ max: 10 })
                .withMessage('Category title can be at most 10 characters.'),
        ];
        this.editClientCategory = [
            this.permissions.check(this.resources.client_category, 'update'),
            (0, express_validator_1.check)('category_title')
                .isLength({ max: 65 })
                .withMessage('Category title can be at most 65 characters.'),
            (0, express_validator_1.check)('category_prefix')
                .isLength({ max: 10 })
                .withMessage('Category title can be at most 10 characters.'),
            (0, express_validator_1.check)('category_created_by')
                .isInt()
                .optional(true)
                .withMessage('Category title can be at most 20 characters.'),
        ];
    }
}
exports.default = ClientCategoryValidator;
//# sourceMappingURL=clientCategories.validators.js.map