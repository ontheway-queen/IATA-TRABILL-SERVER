"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_models_1 = __importDefault(require("../../../../abstracts/abstract.models"));
class InvoiceNonCommissionModel extends abstract_models_1.default {
    constructor() {
        super(...arguments);
        this.getNonComTickets = (invoiceId) => __awaiter(this, void 0, void 0, function* () {
            const tickets = yield this.query()
                .select(this.db.raw("CASE WHEN airticket_vendor_id IS NOT NULL THEN CONCAT('vendor-',airticket_vendor_id) ELSE CONCAT('combined-',airticket_vendor_combine_id) END AS airticket_comvendor"), 'airticket_id', 'airticket_classes', 'airticket_passport_id', 'airticket_ticket_no', 'airticket_client_price', 'airticket_purchase_price', 'airticket_airline_id', 'airticket_extra_fee', 'airticket_pnr', 'airticket_issue_date', 'airticket_journey_date', 'airticket_return_date', 'airticket_profit')
                .from('trabill_invoice_noncom_airticket_items')
                .where('airticket_invoice_id', invoiceId)
                .andWhereNot('airticket_is_deleted', 1);
            const data = [];
            for (const ticket of tickets) {
                const { airticket_id } = ticket;
                const airticketRoutesId = yield this.query()
                    .select('airoute_route_sector_id')
                    .from('trabill_invoice_airticket_routes')
                    .where('airoute_invoice_id', invoiceId)
                    .andWhere('airoute_airticket_id', airticket_id)
                    .andWhereNot('airoute_is_deleted', 1);
                const airticket_route_or_sector = airticketRoutesId.map((item) => item.airoute_route_sector_id);
                const pax_passport = yield this.query()
                    .select('p_passport_id as passport_id', 'p_passport_name as passport_name', 'p_passport_type as passport_person_type', 'p_mobile_no AS passport_mobile_no', 'p_email AS passport_email')
                    .from('trabill_invoice_airticket_pax')
                    .where('p_invoice_id', invoiceId)
                    .andWhere('p_airticket_id', airticket_id)
                    .andWhereNot('p_is_deleted', 1);
                const flight_details = yield this.query()
                    .select('fltdetails_id', 'fltdetails_from_airport_id', 'fltdetails_to_airport_id', 'fltdetails_airline_id', 'fltdetails_flight_no', 'fltdetails_fly_date', 'fltdetails_departure_time', 'fltdetails_arrival_time')
                    .from('trabill_invoice_noncom_airticket_items_flight_details')
                    .where('fltdetails_airticket_id', airticket_id)
                    .andWhereNot('fltdetails_is_deleted', 1);
                data.push({
                    ticket_details: Object.assign(Object.assign({}, ticket), { airticket_route_or_sector }),
                    pax_passport,
                    flight_details,
                });
            }
            return data;
        });
        this.deleteNonCommissionItems = (invoice_id, deleted_by) => __awaiter(this, void 0, void 0, function* () {
            // 1. flight details
            yield this.query()
                .update({ fltdetails_is_deleted: 1, fltdetails_deleted_by: deleted_by })
                .into('trabill_invoice_noncom_airticket_items_flight_details')
                .where('fltdetails_invoice_id', invoice_id);
            // 2. airticket items
            yield this.query()
                .update({ airticket_is_deleted: 1, airticket_deleted_by: deleted_by })
                .into('trabill_invoice_noncom_airticket_items')
                .where('airticket_invoice_id', invoice_id);
            // 3. prerequire
            yield this.query()
                .update({
                invoice_show_is_deleted: 1,
                invoice_show_deleted_by: deleted_by,
            })
                .into('trabill_invoices_airticket_prerequire')
                .where('airticket_invoice_id', invoice_id);
        });
        this.getViewAirticketNonCom = (invoiceId) => __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .select('airticket_id', 'airticket_classes', 'airticket_ticket_no', 'airticket_client_price', 'airticket_purchase_price', 'airticket_profit', 'airticket_extra_fee', 'airticket_pnr', 'airticket_issue_date', 'airticket_journey_date', 'airticket_return_date', this.db.raw('COALESCE(vendor_name, combine_name) AS vendor_name'), 'airline_name', 'passport_name', 'passport_person_type ', 'passport_passport_no', 'passport_mobile_no ', 'passport_email ', 'passport_nid_no ', 'airticket_routes')
                .from('trabill_invoice_noncom_airticket_items as airticketitem')
                .where('airticket_invoice_id', invoiceId)
                .andWhereNot('airticketitem.airticket_is_deleted', 1)
                .leftJoin('trabill_combined_clients', {
                airticket_vendor_combine_id: 'combine_id',
            })
                .leftJoin('view_airticket_routes', function () {
                this.on('view_airticket_routes.airoute_invoice_id', '=', 'airticketitem.airticket_invoice_id').andOn('view_airticket_routes.airoute_airticket_id', '=', 'airticketitem.airticket_id');
            })
                .leftJoin('trabill_vendors', {
                airticket_vendor_id: 'vendor_id',
            })
                .leftJoin('trabill_airlines', {
                airline_id: 'airticket_airline_id',
            })
                .leftJoin('trabill_passport_details', {
                passport_id: 'airticket_passport_id',
            });
        });
        this.getFlightDetails = (invoiceId) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .from('trabill_invoice_noncom_airticket_items_flight_details')
                .select('fltdetails_fly_date as fltdetails_fly_date', 'fltdetails_arrival_time as fltdetails_arrival_time', 'fltdetails_departure_time as fltdetails_departure_time', 'trabill_airlines.airline_name', 'from.airline_airport as flight_from', 'to.airline_airport as flight_to')
                .where('fltdetails_invoice_id', invoiceId)
                .andWhereNot('fltdetails_is_deleted', 1)
                .leftJoin('trabill_airlines', {
                'trabill_airlines.airline_id': 'fltdetails_airline_id',
            })
                .leftJoin('trabill_airports as from', {
                'from.airline_id': 'fltdetails_from_airport_id',
            })
                .leftJoin('trabill_airports as to', {
                'to.airline_id': 'fltdetails_to_airport_id',
            });
            return data;
        });
    }
    getPrevNonComVendor(invoice_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .from('trabill_invoice_noncom_airticket_items')
                .select('airticket_vendor_id as vendor_id', 'airticket_vendor_combine_id as combined_id', 'airticket_purchase_price as prev_cost_price', 'airticket_vtrxn_id as prevTrxnId')
                .where('airticket_invoice_id', invoice_id)
                .andWhereNot('airticket_is_deleted', 1);
            return data;
        });
    }
    // @non commission invoice items
    insertInvoiceNonCommissionItems(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = yield this.query()
                .insert(Object.assign(Object.assign({}, data), { airticket_org_agency: this.org_agency }))
                .into('trabill_invoice_noncom_airticket_items');
            return id[0];
        });
    }
    deleteNonComTicketItemAndPass(invoiceId, deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update({ p_is_deleted: 1, p_deleted_by: deleted_by })
                .into('trabill_invoice_airticket_pax')
                .where('p_invoice_id', invoiceId);
            yield this.query()
                .update({ airticket_is_deleted: 1, airticket_deleted_by: deleted_by })
                .into('trabill_invoice_noncom_airticket_items')
                .where('airticket_invoice_id', invoiceId);
        });
    }
    // @non commission invoice flight details
    insertInvoiceNonComeFlightDetails(invoiceFlightDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .into('trabill_invoice_noncom_airticket_items_flight_details')
                .insert(invoiceFlightDetails);
        });
    }
    updateInvoiceNonComeFlightDetails(invoiceFlightDetails, flight_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .into('trabill_invoice_noncom_airticket_items_flight_details')
                .update(invoiceFlightDetails)
                .where('fltdetails_id', flight_id);
        });
    }
    deleteInvoiceNonComeFlightDetails(flight_id, fltdetails_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update({ fltdetails_is_deleted: 1, fltdetails_deleted_by })
                .into('trabill_invoice_noncom_airticket_items_flight_details')
                .where('fltdetails_id', flight_id);
        });
    }
}
exports.default = InvoiceNonCommissionModel;
//# sourceMappingURL=invoiceNonCommission.models.js.map