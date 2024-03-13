"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const abstract_validators_1 = __importDefault(require("../../../../abstracts/abstract.validators"));
class AgentProfileValidator extends abstract_validators_1.default {
    constructor() {
        super(...arguments);
        this.updateAgentStatus = [
            this.permissions.check(this.resources.agents, 'update'),
            (0, express_validator_1.check)('status')
                .isIn(['active', 'inactive'])
                .withMessage('status must be active or inactive'),
            (0, express_validator_1.check)('created_by')
                .notEmpty()
                .withMessage('Please enter created by')
                .isInt()
                .withMessage('created by must be an integer value'),
        ];
        this.createAgentProfile = [
            this.permissions.check(this.resources.agents, 'create'),
            (0, express_validator_1.check)('agent_name').isString().notEmpty().withMessage('please enter name'),
            (0, express_validator_1.check)('agent_email')
                .optional()
                .isEmail()
                .withMessage('Please provide a valid email'),
            (0, express_validator_1.check)('agent_mobile')
                .optional()
                .isLength({ max: 15 })
                .withMessage('mobile number digit maximum 15'),
            (0, express_validator_1.check)('agent_commission_rate')
                .optional()
                .isNumeric()
                .withMessage('commission rate must be integer value'),
            (0, express_validator_1.check)('agent_created_by')
                .notEmpty()
                .withMessage('Please provide who creating agent')
                .isInt()
                .withMessage('created by must be integer value'),
            (0, express_validator_1.check)('agent_date_of_birth').toDate(),
        ];
        this.readAllAgents = [this.permissions.check(this.resources.agents, 'read')];
        this.updateAgentProfile = [
            this.permissions.check(this.resources.agents, 'update'),
            (0, express_validator_1.check)('agent_name')
                .optional()
                .isString()
                .withMessage('please enter valid name'),
            (0, express_validator_1.check)('agent_email')
                .optional()
                .isEmail()
                .withMessage('Please provide a valid email'),
            (0, express_validator_1.check)('agent_mobile')
                .optional()
                .isLength({ max: 15 })
                .withMessage('mobile number digit maximum 15'),
            (0, express_validator_1.check)('agent_commission_rate')
                .optional()
                .isNumeric()
                .withMessage('commission rate must be integer value'),
            (0, express_validator_1.check)('agent_updated_by')
                .notEmpty()
                .isInt()
                .withMessage('created by must be integer value'),
            (0, express_validator_1.check)('agent_date_of_birth').toDate(),
        ];
        this.deleteAgentProfile = [
            this.permissions.check(this.resources.agents, 'delete'),
            (0, express_validator_1.check)('agent_deleted_by')
                .notEmpty()
                .withMessage('Please provide who delete agent')
                .isInt()
                .withMessage('Must be an integer value'),
        ];
        this.restoreAgentProfile = [
            this.permissions.check(this.resources.agents, 'update'),
            (0, express_validator_1.check)('updated_by')
                .notEmpty()
                .withMessage('Please provide who update the agent')
                .isInt()
                .withMessage('updated by must an integer value'),
        ];
        this.readAgentIncentive = [
            this.permissions.check(this.resources.accounts_module, 'read'),
        ];
        this.createAgentIncentive = [
            this.permissions.check(this.resources.accounts_module, 'create'),
            (0, express_validator_1.check)('agent_id')
                .notEmpty()
                .withMessage('Please provide agent id')
                .isInt()
                .withMessage('agent_id must be an integer value'),
            (0, express_validator_1.check)('account_id')
                .optional()
                .isInt()
                .withMessage('account_id must be an integer value'),
            (0, express_validator_1.check)('type_id')
                .optional()
                .isIn([1, 2, 3, 4])
                .withMessage('type_id must be 1 | 2 | 3 or 4'),
            (0, express_validator_1.check)('amount').optional(),
            (0, express_validator_1.check)('incentive_created_by')
                .notEmpty()
                .withMessage('Please provide incentive created by')
                .isInt()
                .withMessage('incentive created by must be an integer value'),
            (0, express_validator_1.check)('date').optional(),
            (0, express_validator_1.check)('note').optional(),
        ];
        this.editAgentIncentive = [
            this.permissions.check(this.resources.accounts_module, 'update'),
            (0, express_validator_1.check)('agent_id')
                .optional()
                .isInt()
                .withMessage('agent_id must be an integer value'),
            (0, express_validator_1.check)('account_id')
                .optional()
                .isInt()
                .withMessage('account_id must be an integer value'),
            (0, express_validator_1.check)('type_id')
                .optional()
                .isIn([1, 2, 3, 4])
                .withMessage('type_id must be 1 | 2 | 3 or 4'),
            (0, express_validator_1.check)('amount').optional(),
            (0, express_validator_1.check)('incentive_created_by')
                .notEmpty()
                .withMessage('Please provide incentive created by')
                .isInt()
                .withMessage('incentive created by must be an integer value'),
            (0, express_validator_1.check)('date').optional(),
            (0, express_validator_1.check)('note').optional(),
        ];
        this.deleteAgentIncentive = [
            this.permissions.check(this.resources.accounts_module, 'delete'),
            (0, express_validator_1.check)('incentive_deleted_by')
                .notEmpty()
                .withMessage('Please provide incentive deleted by')
                .isInt()
                .withMessage('incentive deleted by must be an integer value'),
        ];
    }
}
exports.default = AgentProfileValidator;
//# sourceMappingURL=agent_profile.validators.js.map