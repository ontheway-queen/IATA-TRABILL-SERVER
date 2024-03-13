"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const abstract_validators_1 = __importDefault(require("../../../../abstracts/abstract.validators"));
class GroupsValidator extends abstract_validators_1.default {
    constructor() {
        super(...arguments);
        this.readGroup = [this.permissions.check(this.resources.groups, 'read')];
        this.deleteGroup = [
            this.permissions.check(this.resources.groups, 'delete'),
            (0, express_validator_1.check)('deleted_by')
                .notEmpty()
                .withMessage('Please enter deleted by ')
                .isInt()
                .withMessage('Deleted By must be an integer value'),
        ];
        this.createGroup = [
            this.permissions.check(this.resources.groups, 'create'),
            (0, express_validator_1.check)('group_name')
                .notEmpty()
                .withMessage('Please Enter Group Name ')
                .isLength({ max: 75 })
                .withMessage('Source title can be at most 75 characters.'),
            (0, express_validator_1.check)('group_type')
                .isIn(['UMRAH', 'HAJJ'])
                .withMessage('Enter UMRAH or HAJJ '),
            (0, express_validator_1.check)('group_created_by')
                .isInt()
                .optional(true)
                .withMessage('Enter numeric value'),
            (0, express_validator_1.check)('group_status')
                .isInt()
                .optional(true)
                .withMessage('Enter numeric value'),
        ];
        this.editGroup = [
            this.permissions.check(this.resources.groups, 'update'),
            (0, express_validator_1.check)('group_name')
                .isLength({ max: 75 })
                .optional(true)
                .withMessage('Source title can be at most 75 characters.'),
            (0, express_validator_1.check)('group_type')
                .isIn(['UMRAH', 'HAJJ'])
                .optional(true)
                .withMessage('Enter UMRAH or HAJJ '),
            (0, express_validator_1.check)('group_created_by')
                .isInt()
                .optional(true)
                .withMessage('Enter numeric value'),
            (0, express_validator_1.check)('group_status')
                .isInt()
                .optional(true)
                .withMessage('Enter numeric value'),
        ];
    }
}
exports.default = GroupsValidator;
//# sourceMappingURL=groups.validators.js.map