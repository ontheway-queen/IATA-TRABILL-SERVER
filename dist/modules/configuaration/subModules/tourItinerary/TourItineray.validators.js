"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const abstract_validators_1 = __importDefault(require("../../../../abstracts/abstract.validators"));
class TourItinerayValidators extends abstract_validators_1.default {
    constructor() {
        super(...arguments);
        this.readData = [this.permissions.check(this.resources.tour_itinerary, 'read')];
        this.deleteData = [
            this.permissions.check(this.resources.tour_itinerary, 'delete'),
            (0, express_validator_1.check)('deleted_by')
                .notEmpty()
                .withMessage('Please provide deleted_by')
                .isInt()
                .withMessage('deleted_by must be an integer value'),
        ];
        this.deleteCity = [
            this.permissions.check(this.resources.tour_itinerary, 'delete'),
            (0, express_validator_1.check)('deleted_by')
                .isInt()
                .withMessage('deleted by must be an integer value'),
        ];
        this.createTourGroups = [
            this.permissions.check(this.resources.tour_itinerary, 'create'),
            (0, express_validator_1.check)('arr.*.group_name')
                .notEmpty()
                .withMessage('Please provide group name.'),
            (0, express_validator_1.check)('arr.*.group_maximum_pax_allowed')
                .notEmpty()
                .withMessage('Provide maximum pax '),
            (0, express_validator_1.check)('arr.*.group_created_by')
                .isInt()
                .notEmpty()
                .withMessage('Provide user id '),
        ];
        this.updateTourGroups = [
            this.permissions.check(this.resources.tour_itinerary, 'update'),
            (0, express_validator_1.check)('group_name').notEmpty().withMessage('Please provide group name.'),
            (0, express_validator_1.check)('group_maximum_pax_allowed')
                .notEmpty()
                .withMessage('Provide maximum pax '),
            (0, express_validator_1.check)('group_updated_by')
                .notEmpty()
                .isInt()
                .withMessage('Provide user id '),
        ];
        this.createTourCities = [
            this.permissions.check(this.resources.tour_itinerary, 'create'),
            (0, express_validator_1.check)('arr.*.city_country_id')
                .notEmpty()
                .withMessage('Please provide county id.'),
            (0, express_validator_1.check)('arr.*.city_name').notEmpty().withMessage('City name '),
            (0, express_validator_1.check)('arr.*.city_created_by')
                .notEmpty()
                .isInt()
                .withMessage('Provide user id '),
        ];
        this.updateTourCities = [
            this.permissions.check(this.resources.tour_itinerary, 'update'),
            (0, express_validator_1.check)('city_country_id')
                .notEmpty()
                .withMessage('Please provide county id.'),
            (0, express_validator_1.check)('city_name').notEmpty().withMessage('City name '),
            (0, express_validator_1.check)('city_updated_by').notEmpty().isInt().withMessage('Provide user id '),
        ];
        this.creteTourTickets = [
            this.permissions.check(this.resources.tour_itinerary, 'create'),
            (0, express_validator_1.check)('arr.*.itinerary_place_id')
                .notEmpty()
                .withMessage('Please provide place id.'),
            (0, express_validator_1.check)('arr.*.itinerary_particular')
                .notEmpty()
                .withMessage('Enter itinerary particular '),
            (0, express_validator_1.check)('arr.*.itinerary_created_by')
                .notEmpty()
                .isInt()
                .withMessage('Provide user id '),
        ];
        this.updateTourTickets = [
            this.permissions.check(this.resources.tour_itinerary, 'update'),
            (0, express_validator_1.check)('itinerary_place_id')
                .notEmpty()
                .withMessage('Please provide place id.'),
            (0, express_validator_1.check)('itinerary_particular')
                .notEmpty()
                .withMessage('Enter itinerary particular '),
            (0, express_validator_1.check)('itinerary_updated_by')
                .notEmpty()
                .isInt()
                .withMessage('Provide user id '),
        ];
        this.createAccommodation = [
            this.permissions.check(this.resources.tour_itinerary, 'create'),
            (0, express_validator_1.check)('arr.*.accommodation_country_id')
                .notEmpty()
                .withMessage('Please provide country id.'),
            (0, express_validator_1.check)('arr.*.accommodation_city_id')
                .notEmpty()
                .withMessage('Please provide city id.'),
            (0, express_validator_1.check)('arr.*.accommodation_room_type_id')
                .notEmpty()
                .withMessage('Please provide room type id.'),
            (0, express_validator_1.check)('arr.*.accommodation_status')
                .notEmpty()
                .withMessage('Enter account status '),
            (0, express_validator_1.check)('arr.*.accommodation_created_by')
                .notEmpty()
                .isInt()
                .withMessage('Provide user id '),
        ];
        this.updateAccommodation = [
            this.permissions.check(this.resources.tour_itinerary, 'update'),
            (0, express_validator_1.check)('accommodation_country_id')
                .notEmpty()
                .withMessage('Please provide country id.'),
            (0, express_validator_1.check)('accommodation_city_id')
                .notEmpty()
                .withMessage('Please provide city id.'),
            (0, express_validator_1.check)('accommodation_room_type_id')
                .notEmpty()
                .withMessage('Please provide room type id.'),
            (0, express_validator_1.check)('accommodation_status')
                .notEmpty()
                .withMessage('Enter account status '),
            (0, express_validator_1.check)('accommodation_updated_by')
                .notEmpty()
                .isInt()
                .withMessage('Provide user id '),
        ];
        this.createPlaces = [
            this.permissions.check(this.resources.tour_itinerary, 'create'),
            (0, express_validator_1.check)('arr.*.place_country_id')
                .notEmpty()
                .withMessage('Please provide country id.'),
            (0, express_validator_1.check)('arr.*.place_city_id')
                .notEmpty()
                .withMessage('Please provide city id.'),
            (0, express_validator_1.check)('arr.*.place_name')
                .notEmpty()
                .withMessage('Please enter place name.'),
            (0, express_validator_1.check)('arr.*.place_status').notEmpty().withMessage('Enter place status '),
            (0, express_validator_1.check)('arr.*.place_created_by')
                .notEmpty()
                .isInt()
                .withMessage('Provide user id '),
        ];
        this.updatePlaces = [
            this.permissions.check(this.resources.tour_itinerary, 'update'),
            (0, express_validator_1.check)('place_country_id')
                .notEmpty()
                .withMessage('Please provide country id.'),
            (0, express_validator_1.check)('place_city_id').notEmpty().withMessage('Please provide city id.'),
            (0, express_validator_1.check)('place_name').notEmpty().withMessage('Please enter place name.'),
            (0, express_validator_1.check)('place_status').notEmpty().withMessage('Enter place status '),
            (0, express_validator_1.check)('place_created_by')
                .notEmpty()
                .isInt()
                .withMessage('Provide user id '),
        ];
    }
}
exports.default = TourItinerayValidators;
//# sourceMappingURL=TourItineray.validators.js.map