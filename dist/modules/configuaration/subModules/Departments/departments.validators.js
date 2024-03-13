"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const abstract_validators_1 = __importDefault(require("../../../../abstracts/abstract.validators"));
class DepartmentsValidator extends abstract_validators_1.default {
    constructor() {
        super(...arguments);
        this.readDepartment = [this.permissions.check(this.resources.departments, 'read')];
        this.deleteDepartment = [
            this.permissions.check(this.resources.departments, 'delete'),
            (0, express_validator_1.check)('deleted_by')
                .isInt()
                .withMessage('deleted by must be an integer value'),
        ];
        this.createDepartment = [
            this.permissions.check(this.resources.departments, 'create'),
            (0, express_validator_1.check)('department_name')
                .isLength({ max: 65 })
                .withMessage('Department name can be at most 65 characters.'),
        ];
        this.updateDepartment = [
            this.permissions.check(this.resources.departments, 'update'),
            (0, express_validator_1.check)('department_name')
                .isLength({ max: 65 })
                .withMessage('Department name can be at most 65 characters.'),
        ];
    }
}
exports.default = DepartmentsValidator;
//# sourceMappingURL=departments.validators.js.map