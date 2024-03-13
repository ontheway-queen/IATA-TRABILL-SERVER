"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const abstract_validators_1 = __importDefault(require("../../../../abstracts/abstract.validators"));
class ProductsValidator extends abstract_validators_1.default {
    constructor() {
        super(...arguments);
        this.readProduct = [this.permissions.check(this.resources.products, 'read')];
        this.deleteProduct = [
            this.permissions.check(this.resources.products, 'delete'),
            (0, express_validator_1.check)('deleted_by')
                .notEmpty()
                .withMessage('Please provide deleted by')
                .isInt()
                .withMessage('deleted by must be an integer value'),
        ];
        this.createProducts = [
            this.permissions.check(this.resources.products, 'create'),
            (0, express_validator_1.check)('product_name')
                .isLength({ max: 65 })
                .withMessage('Product name can be at most 65 characters.'),
            (0, express_validator_1.check)('product_category_id')
                .isInt()
                .notEmpty()
                .withMessage('Product category id must be provided.'),
            (0, express_validator_1.check)('product_starting_from')
                .isLength({ max: 20 })
                .withMessage('Product starting from can be at most 20 characters.'),
            (0, express_validator_1.check)('product_created_by')
                .isInt()
                .notEmpty()
                .withMessage('Product must be created.'),
        ];
        this.editProducts = [
            this.permissions.check(this.resources.products, 'update'),
            (0, express_validator_1.check)('product_name')
                .isLength({ max: 65 })
                .withMessage('Product name can be at most 65 characters.'),
            (0, express_validator_1.check)('product_category_id')
                .isInt()
                .optional(true)
                .withMessage('Product category id must be provided.'),
            (0, express_validator_1.check)('product_starting_from')
                .isLength({ max: 20 })
                .withMessage('Product starting from can be at most 20 characters.'),
            (0, express_validator_1.check)('product_created_by')
                .isInt()
                .optional(true)
                .withMessage('Product must be created.'),
        ];
        this.createProductCategory = [
            this.permissions.check(this.resources.products, 'create'),
            (0, express_validator_1.check)('category_title')
                .isLength({ max: 55 })
                .withMessage('Category title can be at most 55 characters.'),
            (0, express_validator_1.check)('category_created_by')
                .isInt()
                .notEmpty()
                .withMessage('Category must be created.'),
        ];
        this.editProductCategory = [
            this.permissions.check(this.resources.products, 'update'),
            (0, express_validator_1.check)('category_title')
                .isLength({ max: 55 })
                .withMessage('Category title can be at most 55 characters.'),
            (0, express_validator_1.check)('category_created_by')
                .isInt()
                .optional(true)
                .withMessage('Category must be created.'),
        ];
    }
}
exports.default = ProductsValidator;
//# sourceMappingURL=products.validators.js.map