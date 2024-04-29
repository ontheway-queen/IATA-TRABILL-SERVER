import { check } from 'express-validator';
import AbstractValidator from '../../../../abstracts/abstract.validators';

class TourItinerayValidators extends AbstractValidator {
  readData = [this.permissions.check(this.resources.tour_itinerary, 'read')];
  deleteData = [
    this.permissions.check(this.resources.tour_itinerary, 'delete'),
    check('deleted_by')
      .notEmpty()
      .withMessage('Please provide deleted_by')
      .isInt()
      .withMessage('deleted_by must be an integer value'),
  ];

  deleteCity = [
    this.permissions.check(this.resources.tour_itinerary, 'delete'),
    check('deleted_by')
      .isInt()
      .withMessage('deleted by must be an integer value'),
  ];

  createTourGroups = [
    this.permissions.check(this.resources.tour_itinerary, 'create'),
    check('arr.*.group_name')
      .notEmpty()
      .withMessage('Please provide group name.'),
    check('arr.*.group_maximum_pax_allowed')
      .notEmpty()
      .withMessage('Provide maximum pax '),
    check('arr.*.group_created_by')
      .isInt()
      .notEmpty()
      .withMessage('Provide user id '),
  ];

  updateTourGroups = [
    this.permissions.check(this.resources.tour_itinerary, 'update'),
    check('group_name').notEmpty().withMessage('Please provide group name.'),

    check('group_maximum_pax_allowed')
      .notEmpty()
      .withMessage('Provide maximum pax '),

    check('group_updated_by')
      .notEmpty()
      .isInt()
      .withMessage('Provide user id '),
  ];

  createTourCities = [
    this.permissions.check(this.resources.tour_itinerary, 'create'),
    check('arr.*.city_country_id')
      .notEmpty()
      .withMessage('Please provide county id.'),

    check('arr.*.city_name').notEmpty().withMessage('City name '),

    check('arr.*.city_created_by')
      .notEmpty()
      .isInt()
      .withMessage('Provide user id '),
  ];

  updateTourCities = [
    this.permissions.check(this.resources.tour_itinerary, 'update'),
    check('city_country_id')
      .notEmpty()
      .withMessage('Please provide county id.'),

    check('city_name').notEmpty().withMessage('City name '),

    check('city_updated_by').notEmpty().isInt().withMessage('Provide user id '),
  ];

  creteTourTickets = [
    this.permissions.check(this.resources.tour_itinerary, 'create'),
    check('arr.*.itinerary_place_id')
      .notEmpty()
      .withMessage('Please provide place id.'),

    check('arr.*.itinerary_particular')
      .notEmpty()
      .withMessage('Enter itinerary particular '),

    check('arr.*.itinerary_created_by')
      .notEmpty()
      .isInt()
      .withMessage('Provide user id '),
  ];

  updateTourTickets = [
    this.permissions.check(this.resources.tour_itinerary, 'update'),
    check('itinerary_place_id')
      .notEmpty()
      .withMessage('Please provide place id.'),

    check('itinerary_particular')
      .notEmpty()
      .withMessage('Enter itinerary particular '),

    check('itinerary_updated_by')
      .notEmpty()
      .isInt()
      .withMessage('Provide user id '),
  ];

  createAccommodation = [
    this.permissions.check(this.resources.tour_itinerary, 'create'),
    check('arr.*.accommodation_country_id')
      .notEmpty()
      .withMessage('Please provide country id.'),
    check('arr.*.accommodation_city_id')
      .notEmpty()
      .withMessage('Please provide city id.'),
    check('arr.*.accommodation_room_type_id')
      .notEmpty()
      .withMessage('Please provide room type id.'),

    check('arr.*.accommodation_status')
      .notEmpty()
      .withMessage('Enter account status '),

    check('arr.*.accommodation_created_by')
      .notEmpty()
      .isInt()
      .withMessage('Provide user id '),
  ];
  updateAccommodation = [
    this.permissions.check(this.resources.tour_itinerary, 'update'),
    check('accommodation_country_id')
      .notEmpty()
      .withMessage('Please provide country id.'),
    check('accommodation_city_id')
      .notEmpty()
      .withMessage('Please provide city id.'),
    check('accommodation_room_type_id')
      .notEmpty()
      .withMessage('Please provide room type id.'),

    check('accommodation_status')
      .notEmpty()
      .withMessage('Enter account status '),

    check('accommodation_updated_by')
      .notEmpty()
      .isInt()
      .withMessage('Provide user id '),
  ];
  createPlaces = [
    this.permissions.check(this.resources.tour_itinerary, 'create'),
    check('arr.*.place_country_id')
      .notEmpty()
      .withMessage('Please provide country id.'),
    check('arr.*.place_city_id')
      .notEmpty()
      .withMessage('Please provide city id.'),
    check('arr.*.place_name')
      .notEmpty()
      .withMessage('Please enter place name.'),

    check('arr.*.place_status').notEmpty().withMessage('Enter place status '),

    check('arr.*.place_created_by')
      .notEmpty()
      .isInt()
      .withMessage('Provide user id '),
  ];
  updatePlaces = [
    this.permissions.check(this.resources.tour_itinerary, 'update'),
    check('place_country_id')
      .notEmpty()
      .withMessage('Please provide country id.'),
    check('place_city_id').notEmpty().withMessage('Please provide city id.'),
    check('place_name').notEmpty().withMessage('Please enter place name.'),

    check('place_status').notEmpty().withMessage('Enter place status '),

    check('place_created_by')
      .notEmpty()
      .isInt()
      .withMessage('Provide user id '),
  ];
}

export default TourItinerayValidators;
