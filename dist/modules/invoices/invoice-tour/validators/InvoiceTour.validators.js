"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const abstract_validators_1 = __importDefault(require("../../../../abstracts/abstract.validators"));
const commonTrourPack_1 = require("./commons/commonTrourPack");
class InvoiceTourValidator extends abstract_validators_1.default {
    constructor() {
        super(...arguments);
        this.readInvoiceTour = [
            this.permissions.check(this.resources.invoice_tour_package, 'read'),
        ];
        this.deleteInvoiceTour = [
            this.permissions.check(this.resources.invoice_tour_package, 'delete'),
            (0, express_validator_1.check)('invoice_has_deleted_by')
                .notEmpty()
                .withMessage('Pleace provide current user id'),
        ];
        this.createTourPackage = [
            this.permissions.check(this.resources.invoice_tour_package, 'create'),
            ...commonTrourPack_1.commonTourPackValidator,
        ];
        this.updateTourPackage = [
            this.permissions.check(this.resources.invoice_tour_package, 'update'),
            ...commonTrourPack_1.commonTourPackValidator,
        ];
        this.addCostingTour = [
            this.permissions.check(this.resources.invoice_tour_package, 'create'),
            (0, express_validator_1.check)('invoice_created_by')
                .notEmpty()
                .withMessage('Pleace provide user id')
                .isInt()
                .withMessage('User id must be numaric value'),
            (0, express_validator_1.check)('tourGuide')
                .optional()
                .isObject()
                .custom((value, { req }) => {
                if ((value && !value.guide_itinerary_id) ||
                    !value.guide_comvendor_id ||
                    !value.guide_cost_price) {
                    throw new Error('itinerary_id, vendor adn guide cost price is required when tourGuide exists');
                }
                return true;
            }),
            (0, express_validator_1.check)('ticket_journey_date').optional().toDate(),
            (0, express_validator_1.check)('ticket_return_date').optional().toDate(),
            (0, express_validator_1.check)('tourTicket')
                .optional()
                .isObject()
                .custom((value, { req }) => {
                if ((value && !value.ticket_itinerary_id) ||
                    !value.ticket_comvendor_id ||
                    !value.ticket_cost_price) {
                    throw new Error('itinerary_id, vendor adn guide cost price is required when tourTicket exists');
                }
                return true;
            }),
            (0, express_validator_1.check)('tourTransports').optional().isArray(),
            (0, express_validator_1.check)('tourTransports.*.transport_itinerary_id')
                .notEmpty()
                .withMessage('Transport itinerary id is requiede')
                .isInt(),
            (0, express_validator_1.check)('tourTransports.*.transport_description').optional().isString(),
            (0, express_validator_1.check)('tourTransports.*.transport_cost_price').notEmpty().isInt(),
            (0, express_validator_1.check)('tourTransports.*.transport_comvendor_id')
                .notEmpty()
                .withMessage('vendor id is required')
                .isString(),
            (0, express_validator_1.check)('tourFoods').optional().isArray(),
            (0, express_validator_1.check)('tourFoods.*.food_itinerary_id').isInt(),
            (0, express_validator_1.check)('tourFoods.*.food_description').optional().isString(),
            (0, express_validator_1.check)('tourFoods.*.food_cost_price').isInt(),
            (0, express_validator_1.check)('tourFoods.*.food_comvendor_id').notEmpty(),
            (0, express_validator_1.check)('tourAccms').optional().isArray(),
            (0, express_validator_1.check)('tourAccms.*.accm_itinerary_id').optional().isInt(),
            (0, express_validator_1.check)('tourAccms.*.accm_description').isString().optional(),
            (0, express_validator_1.check)('tourAccms.*.accm_checkin_date').optional().toDate(),
            (0, express_validator_1.check)('tourAccms.*.accm_checkout_date').optional().toDate(),
            (0, express_validator_1.check)('tourAccms.*.accm_cost_price').optional().isInt(),
            (0, express_validator_1.check)('tourAccms.*.accm_comvendor_id')
                .optional()
                .isString()
                .withMessage('Vendor must be string...'),
            (0, express_validator_1.check)('tourOtherTrans').optional().isArray(),
            (0, express_validator_1.check)('tourOtherTrans.*.other_trans_itinerary_id').optional().isInt(),
            (0, express_validator_1.check)('tourOtherTrans.*.other_trans_description').optional().isString(),
            (0, express_validator_1.check)('tourOtherTrans.*.other_trans_cost_price').optional().isInt(),
            (0, express_validator_1.check)('tourOtherTrans.*.other_trans_comvendor_id')
                .optional()
                .isString()
                .withMessage('vendor must be string'),
        ];
    }
}
exports.default = InvoiceTourValidator;
//# sourceMappingURL=InvoiceTour.validators.js.map