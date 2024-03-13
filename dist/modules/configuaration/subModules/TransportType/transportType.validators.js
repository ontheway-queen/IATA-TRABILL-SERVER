"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const abstract_validators_1 = __importDefault(require("../../../../abstracts/abstract.validators"));
class TransportTypeValidator extends abstract_validators_1.default {
    constructor() {
        super(...arguments);
        this.readTransportType = [
            this.permissions.check(this.resources.room_types, 'read'),
        ];
        this.deleteTransportType = [
            this.permissions.check(this.resources.room_types, 'delete'),
            (0, express_validator_1.check)('deleted_by')
                .notEmpty()
                .withMessage('Please provide deleted by')
                .isInt()
                .withMessage('deleted_by must be an integer value'),
        ];
        this.createTransportType = [
            this.permissions.check(this.resources.room_types, 'create'),
            (0, express_validator_1.check)('ttype_name')
                .isLength({ max: 85 })
                .withMessage('Room type name can be at most 85 characters.'),
            (0, express_validator_1.check)('ttype_status').isIn([0, 1]).withMessage('Status must be 0 or 1.'),
        ];
        this.editTransportType = [
            this.permissions.check(this.resources.room_types, 'update'),
            (0, express_validator_1.check)('ttype_name')
                .isLength({ max: 85 })
                .withMessage('Room type name can be at most 85 characters.'),
            (0, express_validator_1.check)('ttype_status').isIn([0, 1]).withMessage('Status must be 0 or 1.'),
        ];
    }
}
exports.default = TransportTypeValidator;
//# sourceMappingURL=transportType.validators.js.map