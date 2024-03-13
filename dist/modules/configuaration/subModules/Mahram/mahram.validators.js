"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const abstract_validators_1 = __importDefault(require("../../../../abstracts/abstract.validators"));
class MahramValidator extends abstract_validators_1.default {
    constructor() {
        super(...arguments);
        this.readMahram = [this.permissions.check(this.resources.maharam, 'read')];
        this.deleteMahram = [
            this.permissions.check(this.resources.maharam, 'delete'),
            (0, express_validator_1.check)('deleted_by')
                .notEmpty()
                .withMessage('Please enter deleted by')
                .isInt()
                .withMessage('deleted_by must be an integer value'),
        ];
        this.createMahram = [
            this.permissions.check(this.resources.maharam, 'create'),
            (0, express_validator_1.check)('maharam_name')
                .notEmpty()
                .withMessage('Must enter maharam_name')
                .isLength({ max: 75 })
                .withMessage('Source title can be at most 75 characters.'),
            (0, express_validator_1.check)('maharam_created_by')
                .notEmpty()
                .withMessage('Must enter a value')
                .isInt()
                .withMessage('Enter numeric value'),
        ];
        this.editMahram = [
            this.permissions.check(this.resources.maharam, 'update'),
            (0, express_validator_1.check)('maharam_name')
                .optional(true)
                .isLength({ max: 75 })
                .withMessage('Source title can be at most 75 characters.'),
        ];
    }
}
exports.default = MahramValidator;
//# sourceMappingURL=mahram.validators.js.map