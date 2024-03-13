"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const abstract_validators_1 = __importDefault(require("../../../../abstracts/abstract.validators"));
class AirlineValidator extends abstract_validators_1.default {
    constructor() {
        super(...arguments);
        this.readAirline = [this.permissions.check(this.resources.airline, 'read')];
        this.deleteAirline = [
            this.permissions.check(this.resources.airline, 'delete'),
            (0, express_validator_1.check)('deleted_by')
                .isInt()
                .withMessage('deleted by must be an integer value'),
        ];
        this.validatorAirlineCreate = [
            this.permissions.check(this.resources.airline, 'create'),
            (0, express_validator_1.check)('airline_name')
                .notEmpty()
                .withMessage('Enter airline_name')
                .isLength({ max: 100 })
                .withMessage('Source title can be at most 100 characters.'),
        ];
        this.validatorAirlineUpdate = [
            this.permissions.check(this.resources.airline, 'update'),
            (0, express_validator_1.check)('airline_name')
                .isLength({ max: 100 })
                .withMessage('Source title can be at most 100 characters.'),
        ];
    }
}
exports.default = AirlineValidator;
//# sourceMappingURL=airlines.validators.js.map