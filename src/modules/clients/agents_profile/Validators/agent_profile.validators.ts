import { check } from 'express-validator';
import AbstractValidator from '../../../../abstracts/abstract.validators';

class AgentProfileValidator extends AbstractValidator {
  updateAgentStatus = [
    this.permissions.check(this.resources.agents, 'update'),
    check('status')
      .isIn(['active', 'inactive'])
      .withMessage('status must be active or inactive'),
    check('created_by')
      .notEmpty()
      .withMessage('Please enter created by')
      .isInt()
      .withMessage('created by must be an integer value'),
  ];
  createAgentProfile = [
    this.permissions.check(this.resources.agents, 'create'),
    check('agent_name').isString().notEmpty().withMessage('please enter name'),
    check('agent_email')
      .optional()
      .isEmail()
      .withMessage('Please provide a valid email'),
    check('agent_mobile')
      .optional()
      .isLength({ max: 15 })
      .withMessage('mobile number digit maximum 15'),
    check('agent_commission_rate')
      .optional()
      .isNumeric()
      .withMessage('commission rate must be integer value'),
    check('agent_created_by')
      .notEmpty()
      .withMessage('Please provide who creating agent')
      .isInt()
      .withMessage('created by must be integer value'),
    check('agent_date_of_birth').toDate(),
  ];

  readAllAgents = [this.permissions.check(this.resources.agents, 'read')];

  updateAgentProfile = [
    this.permissions.check(this.resources.agents, 'update'),
    check('agent_name')
      .optional()
      .isString()
      .withMessage('please enter valid name'),
    check('agent_email')
      .optional()
      .isEmail()
      .withMessage('Please provide a valid email'),
    check('agent_mobile')
      .optional()
      .isLength({ max: 15 })
      .withMessage('mobile number digit maximum 15'),
    check('agent_commission_rate')
      .optional()
      .isNumeric()
      .withMessage('commission rate must be integer value'),
    check('agent_updated_by')
      .notEmpty()
      .isInt()
      .withMessage('created by must be integer value'),
    check('agent_date_of_birth').toDate(),
  ];

  deleteAgentProfile = [
    this.permissions.check(this.resources.agents, 'delete'),
    check('agent_deleted_by')
      .notEmpty()
      .withMessage('Please provide who delete agent')
      .isInt()
      .withMessage('Must be an integer value'),
  ];

  restoreAgentProfile = [
    this.permissions.check(this.resources.agents, 'update'),
    check('updated_by')
      .notEmpty()
      .withMessage('Please provide who update the agent')
      .isInt()
      .withMessage('updated by must an integer value'),
  ];

  readAgentIncentive = [
    this.permissions.check(this.resources.accounts_module, 'read'),
  ];
  createAgentIncentive = [
    this.permissions.check(this.resources.accounts_module, 'create'),
    check('agent_id')
      .notEmpty()
      .withMessage('Please provide agent id')
      .isInt()
      .withMessage('agent_id must be an integer value'),
    check('account_id')
      .optional()
      .isInt()
      .withMessage('account_id must be an integer value'),
    check('type_id')
      .optional()
      .isIn([1, 2, 3, 4])
      .withMessage('type_id must be 1 | 2 | 3 or 4'),
    check('amount').optional(),
    check('incentive_created_by')
      .notEmpty()
      .withMessage('Please provide incentive created by')
      .isInt()
      .withMessage('incentive created by must be an integer value'),
    check('date').optional(),
    check('note').optional(),
  ];

  editAgentIncentive = [
    this.permissions.check(this.resources.accounts_module, 'update'),
    check('agent_id')
      .optional()
      .isInt()
      .withMessage('agent_id must be an integer value'),
    check('account_id')
      .optional()
      .isInt()
      .withMessage('account_id must be an integer value'),
    check('type_id')
      .optional()
      .isIn([1, 2, 3, 4])
      .withMessage('type_id must be 1 | 2 | 3 or 4'),
    check('amount').optional(),
    check('incentive_created_by')
      .notEmpty()
      .withMessage('Please provide incentive created by')
      .isInt()
      .withMessage('incentive created by must be an integer value'),
    check('date').optional(),
    check('note').optional(),
  ];

  deleteAgentIncentive = [
    this.permissions.check(this.resources.accounts_module, 'delete'),
    check('incentive_deleted_by')
      .notEmpty()
      .withMessage('Please provide incentive deleted by')
      .isInt()
      .withMessage('incentive deleted by must be an integer value'),
  ];
}
export default AgentProfileValidator;
