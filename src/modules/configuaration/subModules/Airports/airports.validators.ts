import { check } from 'express-validator';
import AbstractValidator from '../../../../abstracts/abstract.validators';

class AirportsValidator extends AbstractValidator {
  readAirports = [this.permissions.check(this.resources.airports, 'read')];
  deleteAirports = [this.permissions.check(this.resources.airports, 'delete')];

  createAirports = [
    this.permissions.check(this.resources.airports, 'create'),
    check('airline_country_id')
      .isInt()
      .withMessage('Airline country id must be integer.'),
    check('airline_airport')
      .isLength({ max: 185 })
      .withMessage('Airport can be at most 185 characters.'),
    check('airline_iata_code')
      .isLength({ max: 10 })
      .withMessage('Airline iata Code can be at most 10 characters.'),
    check('airline_created_by')
      .isInt()
      .notEmpty()
      .withMessage('Airline must be created.'),
  ];
  editAirports = [
    this.permissions.check(this.resources.airports, 'update'),
    check('airline_country_id')
      .isInt()
      .withMessage('Airline country id must be integer.'),
    check('airline_airport')
      .isLength({ max: 185 })
      .withMessage('Airport can be at most 185 characters.'),
    check('airline_iata_code')
      .isLength({ max: 10 })
      .withMessage('Airline iata Code can be at most 10 characters.'),
    check('airline_created_by')
      .isInt()
      .optional(true)
      .withMessage('Airline must be created.'),
    check('airline_update_by')
      .isInt()
      .optional(true)
      .withMessage('Airline deleted by.'),
  ];
}

export default AirportsValidator;
