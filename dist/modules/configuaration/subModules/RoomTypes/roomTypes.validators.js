"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const abstract_validators_1 = __importDefault(require("../../../../abstracts/abstract.validators"));
class RoomTypesValidator extends abstract_validators_1.default {
    constructor() {
        super(...arguments);
        this.readRoomTypes = [this.permissions.check(this.resources.room_types, 'read')];
        this.deleteRoomTypes = [
            this.permissions.check(this.resources.room_types, 'delete'),
            (0, express_validator_1.check)('deleted_by')
                .notEmpty()
                .withMessage('Please enter deleted by')
                .isInt()
                .withMessage('deleted by must be an integer value'),
        ];
        this.createRoomTypes = [
            this.permissions.check(this.resources.room_types, 'create'),
            (0, express_validator_1.check)('rtype_name')
                .isLength({ max: 85 })
                .withMessage('Room type name can be at most 85 characters.'),
        ];
        this.editRoomTypes = [
            this.permissions.check(this.resources.room_types, 'update'),
            (0, express_validator_1.check)('rtype_name')
                .isLength({ max: 85 })
                .withMessage('Room type name can be at most 85 characters.'),
        ];
    }
}
exports.default = RoomTypesValidator;
//# sourceMappingURL=roomTypes.validators.js.map