import { check } from 'express-validator';
import AbstractValidator from '../../../../abstracts/abstract.validators';
import { ITourGuide, ITourTicket } from '../types/invouceTour.interfaces';
import { commonTourPackValidator } from './commons/commonTrourPack';

class InvoiceTourValidator extends AbstractValidator {
  readInvoiceTour = [
    this.permissions.check(this.resources.invoice_tour_package, 'read'),
  ];

  deleteInvoiceTour = [
    this.permissions.check(this.resources.invoice_tour_package, 'delete'),
    check('invoice_has_deleted_by')
      .notEmpty()
      .withMessage('Pleace provide current user id'),
  ];

  createTourPackage = [
    this.permissions.check(this.resources.invoice_tour_package, 'create'),

    ...commonTourPackValidator,
  ];

  updateTourPackage = [
    this.permissions.check(this.resources.invoice_tour_package, 'update'),

    ...commonTourPackValidator,
  ];

  addCostingTour = [
    this.permissions.check(this.resources.invoice_tour_package, 'create'),

    check('invoice_created_by')
      .notEmpty()
      .withMessage('Pleace provide user id')
      .isInt()
      .withMessage('User id must be numaric value'),

    check('tourGuide')
      .optional()
      .isObject()
      .custom((value: ITourGuide, { req }) => {
        if (
          (value && !value.guide_itinerary_id) ||
          !value.guide_comvendor_id ||
          !value.guide_cost_price
        ) {
          throw new Error(
            'itinerary_id, vendor adn guide cost price is required when tourGuide exists'
          );
        }
        return true;
      }),

    check('ticket_journey_date').optional().toDate(),
    check('ticket_return_date').optional().toDate(),
    check('tourTicket')
      .optional()
      .isObject()
      .custom((value: ITourTicket, { req }) => {
        if (
          (value && !value.ticket_itinerary_id) ||
          !value.ticket_comvendor_id ||
          !value.ticket_cost_price
        ) {
          throw new Error(
            'itinerary_id, vendor adn guide cost price is required when tourTicket exists'
          );
        }
        return true;
      }),

    check('tourTransports').optional().isArray(),
    check('tourTransports.*.transport_itinerary_id')
      .notEmpty()
      .withMessage('Transport itinerary id is requiede')
      .isInt(),
    check('tourTransports.*.transport_description').optional().isString(),
    check('tourTransports.*.transport_cost_price').notEmpty().isInt(),
    check('tourTransports.*.transport_comvendor_id')
      .notEmpty()
      .withMessage('vendor id is required')
      .isString(),

    check('tourFoods').optional().isArray(),
    check('tourFoods.*.food_itinerary_id').isInt(),
    check('tourFoods.*.food_description').optional().isString(),
    check('tourFoods.*.food_cost_price').isInt(),
    check('tourFoods.*.food_comvendor_id').notEmpty(),

    check('tourAccms').optional().isArray(),
    check('tourAccms.*.accm_itinerary_id').optional().isInt(),
    check('tourAccms.*.accm_description').isString().optional(),
    check('tourAccms.*.accm_checkin_date').optional().toDate(),
    check('tourAccms.*.accm_checkout_date').optional().toDate(),
    check('tourAccms.*.accm_cost_price').optional().isInt(),
    check('tourAccms.*.accm_comvendor_id')
      .optional()
      .isString()
      .withMessage('Vendor must be string...'),

    check('tourOtherTrans').optional().isArray(),
    check('tourOtherTrans.*.other_trans_itinerary_id').optional().isInt(),
    check('tourOtherTrans.*.other_trans_description').optional().isString(),
    check('tourOtherTrans.*.other_trans_cost_price').optional().isInt(),
    check('tourOtherTrans.*.other_trans_comvendor_id')
      .optional()
      .isString()
      .withMessage('vendor must be string'),
  ];
}

export default InvoiceTourValidator;
