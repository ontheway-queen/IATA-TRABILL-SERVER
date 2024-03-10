import { check } from 'express-validator';
import AbstractValidator from '../../../../abstracts/abstract.validators';

class CombineClientsValidator extends AbstractValidator {
  createCombineClients = [
    this.permissions.check(this.resources.combined_clients, 'create'),

    check('combine_category_id')
      .isInt()
      .withMessage('Category id must be integer value')
      .optional(),
    check('combine_name')
      .notEmpty()
      .withMessage('Please provide combine name')
      .isLength({ max: 55 })
      .withMessage('name can be at most 55 character'),
    check('opening_balance_type')
      .optional()
      .isIn(['due', 'advance'])
      .withMessage('Opening balance must be due or advanced'),
    check('combine_company_name')
      .optional()
      .isLength({ max: 255 })
      .withMessage('Company name can be at most 255 character'),
    check('combine_gender')
      .optional()
      .isIn(['Male', 'Female'])
      .withMessage('Gender must be Male or Female'),
    check('combine_email')
      .optional()
      .isLength({ max: 100 })
      .withMessage('Email can be at most 100 character')
      .isEmail()
      .withMessage('Please provide a valid email'),
    check('combine_designation')
      .optional()
      .isLength({ max: 255 })
      .withMessage('Designation can be at most 255 character'),
    check('combine_mobile')
      .optional()
      .isLength({ max: 20 })
      .withMessage('Mobile number can be at most 20 character'),
    check('combine_address')
      .optional()
      .isLength({ max: 250 })
      .withMessage('Address can be at most 250 character'),
    check('combine_opening_balance')
      .optional()
      .isNumeric()
      .withMessage('opening balance must be number value'),
    check('combine_create_by')
      .notEmpty()
      .withMessage('Please provide create by'),
    check('combine_commission_rate')
      .optional()
      .isNumeric()
      .withMessage('commission rate must be integer value'),
  ];

  updateCombineClients = [
    this.permissions.check(this.resources.combined_clients, 'update'),
    check('combine_category_id')
      .isInt()
      .withMessage('Category id must be integer value')
      .optional(),
    check('combine_name')
      .optional()
      .isLength({ max: 25 })
      .withMessage('name can be at most 25 character'),
    check('combine_company_name')
      .optional()
      .isLength({ max: 255 })
      .withMessage('Company name can be at most 25 character'),
    check('combine_gender')
      .optional()
      .isIn(['Male', 'Female'])
      .withMessage('Gender must be Male or Female'),
    check('combine_email')
      .optional()
      .isLength({ max: 100 })
      .withMessage('Email can be at most 100 character')
      .isEmail()
      .withMessage('Please provide a valid email'),
    check('combine_designation')
      .optional()
      .isLength({ max: 255 })
      .withMessage('Designation can be at most 255 character'),
    check('combine_mobile')
      .optional()
      .isLength({ max: 20 })
      .withMessage('Mobile number can be at most 20 character'),
    check('combine_address')
      .optional()
      .isLength({ max: 250 })
      .withMessage('Address can be at most 250 character'),
    check('combine_opening_balance')
      .optional()
      .isNumeric()
      .withMessage('opening balance must be number value'),
    check('combine_update_by')
      .isInt()
      .withMessage('updated by must be an integer value'),
    check('combine_commission_rate')
      .optional()
      .isNumeric()
      .withMessage('commission rate must be integer value'),
  ];
  deleteCombineClient = [
    this.permissions.check(this.resources.combined_clients, 'delete'),
  ];

  readAllCombines = [
    this.permissions.check(this.resources.combined_clients, 'read'),
  ];

  updateClientStatus = [
    this.permissions.check(this.resources.combined_clients, 'update'),
    check('combine_client_status')
      .notEmpty()
      .withMessage('Please enter combined_clients status')
      .isIn([1, 0])
      .withMessage('Client status must be 0 or 1'),
    check('updated_by')
      .notEmpty()
      .withMessage('Please enter how update the combined_clients status')
      .isInt()
      .withMessage('updated by must be an integer value'),
  ];
}
export default CombineClientsValidator;
