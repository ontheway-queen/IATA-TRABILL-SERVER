"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const abstract_validators_1 = __importDefault(require("../../../../abstracts/abstract.validators"));
class CombineClientsValidator extends abstract_validators_1.default {
    constructor() {
        super(...arguments);
        this.createCombineClients = [
            this.permissions.check(this.resources.combined_clients, 'create'),
            (0, express_validator_1.check)('combine_category_id')
                .isInt()
                .withMessage('Category id must be integer value')
                .optional(),
            (0, express_validator_1.check)('combine_name')
                .notEmpty()
                .withMessage('Please provide combine name')
                .isLength({ max: 55 })
                .withMessage('name can be at most 55 character'),
            (0, express_validator_1.check)('opening_balance_type')
                .optional()
                .isIn(['due', 'advance'])
                .withMessage('Opening balance must be due or advanced'),
            (0, express_validator_1.check)('combine_company_name')
                .optional()
                .isLength({ max: 255 })
                .withMessage('Company name can be at most 255 character'),
            (0, express_validator_1.check)('combine_gender')
                .optional()
                .isIn(['Male', 'Female'])
                .withMessage('Gender must be Male or Female'),
            (0, express_validator_1.check)('combine_email')
                .optional()
                .isLength({ max: 100 })
                .withMessage('Email can be at most 100 character')
                .isEmail()
                .withMessage('Please provide a valid email'),
            (0, express_validator_1.check)('combine_designation')
                .optional()
                .isLength({ max: 255 })
                .withMessage('Designation can be at most 255 character'),
            (0, express_validator_1.check)('combine_mobile')
                .optional()
                .isLength({ max: 20 })
                .withMessage('Mobile number can be at most 20 character'),
            (0, express_validator_1.check)('combine_address')
                .optional()
                .isLength({ max: 250 })
                .withMessage('Address can be at most 250 character'),
            (0, express_validator_1.check)('combine_opening_balance')
                .optional()
                .isNumeric()
                .withMessage('opening balance must be number value'),
            (0, express_validator_1.check)('combine_create_by')
                .notEmpty()
                .withMessage('Please provide create by'),
            (0, express_validator_1.check)('combine_commission_rate')
                .optional()
                .isNumeric()
                .withMessage('commission rate must be integer value'),
        ];
        this.updateCombineClients = [
            this.permissions.check(this.resources.combined_clients, 'update'),
            (0, express_validator_1.check)('combine_category_id')
                .isInt()
                .withMessage('Category id must be integer value')
                .optional(),
            (0, express_validator_1.check)('combine_name')
                .optional()
                .isLength({ max: 25 })
                .withMessage('name can be at most 25 character'),
            (0, express_validator_1.check)('combine_company_name')
                .optional()
                .isLength({ max: 255 })
                .withMessage('Company name can be at most 25 character'),
            (0, express_validator_1.check)('combine_gender')
                .optional()
                .isIn(['Male', 'Female'])
                .withMessage('Gender must be Male or Female'),
            (0, express_validator_1.check)('combine_email')
                .optional()
                .isLength({ max: 100 })
                .withMessage('Email can be at most 100 character')
                .isEmail()
                .withMessage('Please provide a valid email'),
            (0, express_validator_1.check)('combine_designation')
                .optional()
                .isLength({ max: 255 })
                .withMessage('Designation can be at most 255 character'),
            (0, express_validator_1.check)('combine_mobile')
                .optional()
                .isLength({ max: 20 })
                .withMessage('Mobile number can be at most 20 character'),
            (0, express_validator_1.check)('combine_address')
                .optional()
                .isLength({ max: 250 })
                .withMessage('Address can be at most 250 character'),
            (0, express_validator_1.check)('combine_opening_balance')
                .optional()
                .isNumeric()
                .withMessage('opening balance must be number value'),
            (0, express_validator_1.check)('combine_update_by')
                .isInt()
                .withMessage('updated by must be an integer value'),
            (0, express_validator_1.check)('combine_commission_rate')
                .optional()
                .isNumeric()
                .withMessage('commission rate must be integer value'),
        ];
        this.deleteCombineClient = [
            this.permissions.check(this.resources.combined_clients, 'delete'),
        ];
        this.readAllCombines = [
            this.permissions.check(this.resources.combined_clients, 'read'),
        ];
        this.updateClientStatus = [
            this.permissions.check(this.resources.combined_clients, 'update'),
            (0, express_validator_1.check)('combine_client_status')
                .notEmpty()
                .withMessage('Please enter combined_clients status')
                .isIn([1, 0])
                .withMessage('Client status must be 0 or 1'),
            (0, express_validator_1.check)('updated_by')
                .notEmpty()
                .withMessage('Please enter how update the combined_clients status')
                .isInt()
                .withMessage('updated by must be an integer value'),
        ];
    }
}
exports.default = CombineClientsValidator;
//# sourceMappingURL=combineClients.validators.js.map