import { check } from 'express-validator';
import AbstractValidator from '../../../../abstracts/abstract.validators';

class AirlineValidator extends AbstractValidator {
  readAirline = [this.permissions.check(this.resources.airline, 'read')];
  deleteAirline = [
    this.permissions.check(this.resources.airline, 'delete'),
    check('deleted_by')
      .isInt()
      .withMessage('deleted by must be an integer value'),
  ];

  validatorAirlineCreate = [
    this.permissions.check(this.resources.airline, 'create'),
    check('airline_name')
      .notEmpty()
      .withMessage('Enter airline_name')
      .isLength({ max: 100 })
      .withMessage('Source title can be at most 100 characters.'),
  ];

  validatorAirlineUpdate = [
    this.permissions.check(this.resources.airline, 'update'),
    check('airline_name')
      .isLength({ max: 100 })
      .withMessage('Source title can be at most 100 characters.'),
  ];
}

export default AirlineValidator;
