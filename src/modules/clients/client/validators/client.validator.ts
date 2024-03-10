import { check } from 'express-validator';
import AbstractValidator from '../../../../abstracts/abstract.validators';

class ClientValidator extends AbstractValidator {
  readClient = [this.permissions.check(this.resources.clients, 'read')];

  deleteClient = [this.permissions.check(this.resources.clients, 'delete')];

  restoreClient = [this.permissions.check(this.resources.clients, 'update')];

  // ACTIVE STATUS UPDATE VALIDATOR
  activeStatus = [
    this.permissions.check(this.resources.clients, 'update'),
    check('status')
      .isIn(['active', 'inactive'])
      .withMessage('Client active status must be given'),
    check('created_by')
      .notEmpty()
      .withMessage('please provide created by')
      .isInt()
      .withMessage('created by must be an integer value'),
  ];

  // CREATE AND UPDATE CLIENT VALIDATOR
  addEditClient = [
    this.permissions.check(this.resources.clients, 'create'),
    check('client_category_id').notEmpty().isInt(),
    check('client_type')
      .notEmpty()
      .isIn(['INDIVIDUAL', 'CORPORATE'])
      .withMessage('Client type must be of type INDIVIDUAL or CORPORATE'),

    check('client_designation').optional().isString(),
    check('opening_balance_type').optional().isIn(['CREDIT', 'DEBIT']),
    check('client_credit_limit').optional(),
    check('opening_balance').optional().isDecimal(),

    check('client_gender')
      .optional()
      .isIn(['Male', 'Female'])
      .withMessage('Client gender can be at most 10 characters.'),

    check('client_created_by').notEmpty().toInt(),

    check('client_trade_license').optional(),
    check('client_address').optional().isString(),
    check('client_mobile').optional().isString(),
    check('client_email').optional(),
    check('client_name').notEmpty().isString(),
  ];

  checkCreditLimit = [
    check('amount').notEmpty(),
    check('combClient').notEmpty(),
  ];

  readClientAllInvoices = [
    this.permissions.check(this.resources.clients, 'read'),
  ];
  readClientAllMoneyReceipt = [
    this.permissions.check(this.resources.money_receipt, 'read'),
  ];
  readClientAllQuotations = [
    this.permissions.check(this.resources.clients, 'read'),
  ];
  readClientAllRefunds = [
    this.permissions.check(this.resources.clients, 'read'),
  ];
  readClientAllPassport = [
    this.permissions.check(this.resources.passport_management, 'read'),
  ];

  readCombClientIncentive = [
    this.permissions.check(this.resources.account_investments, 'read'),
  ];
  deleteCombClientIncentive = [
    this.permissions.check(this.resources.account_investments, 'delete'),
    check('incentive_deleted_by')
      .notEmpty()
      .withMessage('Please enter incentive_deleted_by')
      .isInt()
      .withMessage('incentive_deleted_by must be an integer value'),
  ];
  createCombClientIncentive = [
    this.permissions.check(this.resources.account_investments, 'create'),
    check('comb_client').optional(),
    check('account_id')
      .optional()
      .isInt()
      .withMessage('account_id must be an interger value'),
    check('adjust_with_bill')
      .notEmpty()
      .withMessage('Please enter adjust with bill')
      .isIn(['YES', 'NO'])
      .withMessage('adjust_with_bill must be YES | NO'),
    check('type_id')
      .optional()
      .isIn([1, 2, 3, 4])
      .withMessage('type must be 1 | 2 | 3 or 4'),
    check('amount').optional(),
    check('incentive_created_by')
      .notEmpty()
      .withMessage('Please enter incentive created by')
      .isInt()
      .withMessage('incentive created by must be an integer value'),
    check('date').optional(),
    check('note').optional(),
  ];

  editCombClientIncentive = [
    this.permissions.check(this.resources.account_investments, 'create'),
    check('comb_client').notEmpty().withMessage('Please enter comb_client'),
    check('account_id')
      .optional()
      .isInt()
      .withMessage('account_id must be an interger value'),
    check('adjust_with_bill')
      .optional()
      .isIn(['YES', 'NO'])
      .withMessage('adjust_with_bill must be YES | NO'),
    check('type_id')
      .optional()
      .isIn([1, 2, 3, 4])
      .withMessage('type must be 1 | 2 | 3 or 4'),
    check('amount').optional(),
    check('incentive_created_by')
      .optional()
      .isInt()
      .withMessage('incentive created by must be an integer value'),
    check('date').optional(),
    check('note').optional(),
  ];
}

export default ClientValidator;
