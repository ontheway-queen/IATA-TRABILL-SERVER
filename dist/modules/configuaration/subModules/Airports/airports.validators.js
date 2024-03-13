"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const abstract_validators_1 = __importDefault(require("../../../../abstracts/abstract.validators"));
class AirportsValidator extends abstract_validators_1.default {
    constructor() {
        super(...arguments);
        this.readAirports = [this.permissions.check(this.resources.airports, 'read')];
        this.deleteAirports = [this.permissions.check(this.resources.airports, 'delete')];
        this.createAirports = [
            this.permissions.check(this.resources.airports, 'create'),
            (0, express_validator_1.check)('airline_country_id')
                .isInt()
                .withMessage('Airline country id must be integer.'),
            (0, express_validator_1.check)('airline_airport')
                .isLength({ max: 185 })
                .withMessage('Airport can be at most 185 characters.'),
            (0, express_validator_1.check)('airline_iata_code')
                .isLength({ max: 10 })
                .withMessage('Airline iata Code can be at most 10 characters.'),
            (0, express_validator_1.check)('airline_created_by')
                .isInt()
                .notEmpty()
                .withMessage('Airline must be created.'),
        ];
        this.editAirports = [
            this.permissions.check(this.resources.airports, 'update'),
            (0, express_validator_1.check)('airline_country_id')
                .isInt()
                .withMessage('Airline country id must be integer.'),
            (0, express_validator_1.check)('airline_airport')
                .isLength({ max: 185 })
                .withMessage('Airport can be at most 185 characters.'),
            (0, express_validator_1.check)('airline_iata_code')
                .isLength({ max: 10 })
                .withMessage('Airline iata Code can be at most 10 characters.'),
            (0, express_validator_1.check)('airline_created_by')
                .isInt()
                .optional(true)
                .withMessage('Airline must be created.'),
            (0, express_validator_1.check)('airline_update_by')
                .isInt()
                .optional(true)
                .withMessage('Airline deleted by.'),
        ];
    }
}
exports.default = AirportsValidator;
//# sourceMappingURL=airports.validators.js.map