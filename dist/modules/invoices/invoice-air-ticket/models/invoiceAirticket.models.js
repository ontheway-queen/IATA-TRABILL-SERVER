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
class InvoiceAirticketModel extends abstract_models_1.default {
    constructor() {
        super(...arguments);
        // CHECK TICKET NUMBER UNIQUE
        this.isTicketNumberExist = (ticketNo) => __awaiter(this, void 0, void 0, function* () {
            const ticket_info = yield this.db('view_all_airticket_details')
                .select('airticket_ticket_no')
                .andWhere('airticket_org_agency', this.org_agency);
            const data = ticket_info.map((item) => item.airticket_ticket_no);
            return data.includes(ticketNo);
        });
        this.getPreviousTicketItems = (airticketId) => __awaiter(this, void 0, void 0, function* () {
            const [data] = yield this.query()
                .select(this.db.raw(this.db.raw("coalesce(concat('vendor-',airticket_vendor_id), concat('combined-',airticket_vendor_combine_id)) as comb_vendor")), 'airticket_vtrxn_id')
                .from('trabill_invoice_airticket_items')
                .where('airticket_id', airticketId);
            return data;
        });
        this.deleteAirticketFlightsAndPaxByTicketId = (airticketId, deleted_by) => __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update({ fltdetails_is_deleted: 1, fltdetails_deleted_by: deleted_by })
                .into('trabill_invoice_airticket_items_flight_details')
                .where('fltdetails_airticket_id', airticketId);
            yield this.query()
                .update({ p_is_deleted: 1, p_deleted_by: deleted_by })
                .into('trabill_invoice_airticket_pax')
                .where('p_airticket_id', airticketId);
            yield this.query()
                .update({ airticket_is_deleted: 1, airticket_deleted_by: deleted_by })
                .into('trabill_invoice_airticket_items')
                .where('airticket_id', airticketId);
        });
        this.deleteAirticketPax = (passportId, p_deleted_by) => __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update({ p_is_deleted: 1, p_deleted_by })
                .into('trabill_invoice_airticket_pax')
                .where('p_passport_id', passportId);
        });
        this.getPassportIdByInvoiceId = (invoice_id) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .from('trabill_invoice_airticket_items as passport_id')
                .select('airticket_passport_id')
                .where('invoice_id', invoice_id)
                .andWhereNot('airticket_is_deleted', 1);
            if (data.length) {
                return data[0].invpassport_passport_id;
            }
            return false;
        });
        this.getAirTicketFlights = (invoiceId) => __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .from('trabill_invoice_airticket_items_flight_details')
                .select('fltdetails_fly_date', 'fltdetails_arrival_time', 'fltdetails_departure_time', 'airline_name', this.db.raw("concat(airport_from.airline_iata_code, ' ',airport_from.airline_airport) as flight_from"), this.db.raw("concat(airport_to.airline_iata_code, ' ',airport_to.airline_airport) as flight_to"))
                .where('fltdetails_invoice_id', invoiceId)
                .andWhereNot('fltdetails_is_deleted', 1)
                .leftJoin('trabill_airlines', {
                airline_id: 'fltdetails_airline_id',
            })
                .leftJoin('trabill_airports as airport_from', {
                'airport_from.airline_id': 'trabill_invoice_airticket_items_flight_details.fltdetails_from_airport_id',
            })
                .leftJoin('trabill_airports as airport_to', {
                'airport_to.airline_id': 'trabill_invoice_airticket_items_flight_details.fltdetails_to_airport_id',
            });
        });
        this.getViewAirticketItems = (invoiceId) => __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .select('view_airticket_details.*', 'client_total_tax_refund', 'vendor_total_tax_refund', 'created_at')
                .from('view_airticket_details')
                .leftJoin('trabill_airticket_tax_refund', {
                refund_invoice_id: 'airticket_invoice_id',
            })
                .where('airticket_invoice_id', invoiceId);
        });
        this.getAirticketItems = (invoiceId) => __awaiter(this, void 0, void 0, function* () {
            const ticket_details = yield this.query()
                .select('airticket_id', this.db.raw("CASE WHEN airticket_vendor_id IS NOT NULL THEN CONCAT('vendor-',airticket_vendor_id) ELSE CONCAT('combined-',airticket_vendor_combine_id) END AS airticket_comvendor"), 'airticket_ticket_type', 'airticket_classes', 'airticket_ait_from', 'airticket_passport_id', 'airticket_ticket_no', 'airticket_pax_name', 'airticket_pnr', 'airticket_gross_fare', 'airticket_base_fare', 'airticket_tax', 'airticket_tax1', 'airticket_ait', 'airticket_discount_type', 'airticket_vat', 'airticket_commission_percent', 'airticket_net_commssion', 'airticket_segment', 'airticket_gds_id', 'airticket_client_price', 'airticket_discount_total', 'airticket_extra_fee', 'airticket_purchase_price', 'airticket_other_expense', 'airticket_other_bonus_total', 'airticket_other_bonus_type', 'airticket_profit', 'airticket_issue_date', 'airticket_journey_date', 'airticket_return_date', 'airticket_airline_id', 'airticket_es_charge', 'airticket_ut_charge', 'airticket_xt_charge', 'airticket_bd_charge', 'airticket_ow_charge', 'airticket_pz_charge', 'airticket_qa_charge', 'airticket_e5_charge', 'airticket_g4_charge', 'airticket_p7_charge', 'airticket_p8_charge', 'airticket_r9_charge', 'airticket_total_taxes_commission', 'airticket_commission_percent_total', 'airticket_is_refund')
                .from('trabill_invoice_airticket_items')
                .where('airticket_invoice_id', invoiceId)
                .andWhereNot('airticket_is_deleted', 1);
            const ticketInfo = [];
            for (const ticket of ticket_details) {
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
                    .from('trabill_invoice_airticket_items_flight_details')
                    .where('fltdetails_airticket_id', airticket_id)
                    .andWhereNot('fltdetails_is_deleted', 1);
                const taxes_commission = yield this.query()
                    .select('airline_taxes', 'airline_commission', 'airline_tax_type')
                    .from('trabill_invoice_airticket_airline_commission')
                    .where('airline_airticket_id', airticket_id)
                    .andWhereNot('is_deleted', 1);
                ticketInfo.push({
                    ticket_details: Object.assign(Object.assign({}, ticket), { airticket_route_or_sector }),
                    pax_passport,
                    flight_details,
                    taxes_commission,
                });
            }
            return ticketInfo;
        });
        this.getInvoiceActivity = (id) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select(this.db.raw("concat(user_first_name, ' ', user_last_name) AS user_full_name"), 'history_activity_type', 'history_create_date', 'invoice_no', 'invoicelog_content')
                .from('trabill_invoices_history')
                .where('history_invoice_id', id)
                .leftJoin('trabill_invoices', { invoice_id: 'history_invoice_id' })
                .leftJoin('trabill_users', { user_id: 'history_created_by' });
            return data;
        });
        this.deleteAirticketItems = (invoice_id, deleted_by) => __awaiter(this, void 0, void 0, function* () {
            // 1. flight details
            yield this.query()
                .update({ fltdetails_is_deleted: 1, fltdetails_deleted_by: deleted_by })
                .into('trabill_invoice_airticket_items_flight_details')
                .where('fltdetails_invoice_id', invoice_id);
            // 2. airticket items
            yield this.query()
                .update({ airticket_is_deleted: 1, airticket_deleted_by: deleted_by })
                .into('trabill_invoice_airticket_items')
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
        // EMAIL SEND QUERYS
        this.getInvoiceClientInfo = (invoice_id) => __awaiter(this, void 0, void 0, function* () {
            const [data] = yield this.db('trabill_invoices')
                .select('invoice_client_id as client_id', 'invoice_combined_id as combined_id', 'invoice_org_agency', 'invoice_no', 'invoice_sales_date')
                .where('invoice_id', invoice_id);
            return data;
        });
        this.getClientCombineClientMail = (client_id, combine_id) => __awaiter(this, void 0, void 0, function* () {
            const [data] = yield this.db('trabill_clients')
                .select('client_email')
                .where('client_id', client_id)
                .unionAll([
                this.db('trabill_combined_clients')
                    .select('combine_email as client_email')
                    .where('combine_id', combine_id),
            ]);
            return data;
        });
        this.getAgencyInfo = (agency_id) => __awaiter(this, void 0, void 0, function* () {
            const [data] = yield this.db('trabill_agency_organization_information')
                .select('org_name', 'org_owner_email', 'org_logo', 'org_address1', 'org_mobile_number')
                .where('org_id', agency_id);
            return data;
        });
        // SELECT CUSTOM AIR TICKET REPORT
        this.selectCustomAirTicketReport = (fields, page, size, from_date, to_date) => __awaiter(this, void 0, void 0, function* () {
            const offset = (Number(page || 1) - 1) * Number(size || 20);
            const data = yield this.query()
                .select(fields)
                .from('view_all_airticket_details')
                .modify((event) => {
                event.andWhere(function () {
                    if (from_date && to_date) {
                        this.andWhereRaw(`DATE_FORMAT(create_date, '%Y-%m-%d') BETWEEN ? AND ?`, [from_date, to_date]);
                    }
                });
            })
                .where('airticket_org_agency', this.org_agency)
                .limit(Number(size || 20))
                .offset(offset);
            return data;
        });
        this.selectCustomAirTicketReportCount = (from_date, to_date) => __awaiter(this, void 0, void 0, function* () {
            const [{ count }] = (yield this.query()
                .count('* as count')
                .from('view_all_airticket_details')
                .modify((event) => {
                event.andWhere(function () {
                    if (from_date && to_date) {
                        this.andWhereRaw(`DATE_FORMAT(create_date, '%Y-%m-%d') BETWEEN ? AND ?`, [from_date, to_date]);
                    }
                });
            })
                .where('airticket_org_agency', this.org_agency));
            return count;
        });
        // AIR TICKET INFO
        this.selectAirTicketTax = (invoiceId) => __awaiter(this, void 0, void 0, function* () {
            const results = yield this.query()
                .select('airticket_id', 'airticket_ticket_no', 'airticket_client_price', 'airticket_purchase_price', 'airticket_tax', this.db.raw("coalesce(CONCAT('client-',airticket_client_id), CONCAT('combined-',airticket_combined_id)) as comb_client"), this.db.raw("coalesce(CONCAT('vendor-',airticket_vendor_id), CONCAT('combined-',airticket_vendor_combine_id)) as comb_vendor"))
                .from('trabill_invoice_airticket_items')
                .where('airticket_org_agency', this.org_agency)
                .andWhere('airticket_invoice_id', invoiceId)
                .andWhereNot('airticket_is_refund', 1)
                .andWhereNot('airticket_is_reissued', 1)
                .andWhereNot('airticket_is_deleted', 1)
                .unionAll([
                this.db
                    .select('airticket_id', 'airticket_ticket_no', this.db.raw('coalesce(airticket_after_reissue_client_price, airticket_client_price) as airticket_client_price'), this.db.raw('coalesce(airticket_after_reissue_purchase_price, airticket_purchase_price) as airticket_purchase_price'), this.db.raw('coalesce(airticket_after_reissue_taxes, airticket_tax) as airticket_tax'), this.db.raw("coalesce(CONCAT('client-',airticket_client_id), CONCAT('combined-',airticket_combined_id)) as comb_client"), this.db.raw("coalesce(CONCAT('vendor-',airticket_vendor_id), CONCAT('combined-',airticket_vendor_combine_id)) as comb_vendor"))
                    .from('trabill_invoice_reissue_airticket_items')
                    .where('airticket_org_agency', this.org_agency)
                    .andWhere('airticket_invoice_id', invoiceId)
                    .andWhereNot('airticket_is_refund', 1)
                    .andWhereNot('airticket_is_reissued', 1)
                    .andWhereNot('airticket_is_deleted', 1),
            ]);
            return results;
        });
        this.insertAirTicketTaxRefund = (data) => __awaiter(this, void 0, void 0, function* () {
            const [id] = yield this.query()
                .insert(data)
                .into('trabill_airticket_tax_refund');
            return id;
        });
        this.insertAirTicketTaxRefundItem = (data) => __awaiter(this, void 0, void 0, function* () {
            yield this.query().insert(data).into('trabill_airticket_tax_refund_items');
        });
        this.updateAirTicketItemRefund = (airTicketId, category_id) => __awaiter(this, void 0, void 0, function* () {
            if (category_id === 1) {
                yield this.query()
                    .update({ airticket_is_refund: 1 })
                    .from('trabill_invoice_airticket_items')
                    .where('airticket_id', airTicketId);
            }
            else if (category_id === 3) {
                yield this.query()
                    .update({ airticket_is_refund: 1 })
                    .from('trabill_invoice_reissue_airticket_items')
                    .where('airticket_id', airTicketId);
            }
        });
        this.updateInvoiceRefund = (invoiceId) => __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update({ invoice_is_refund: 1 })
                .from('trabill_invoices')
                .where('invoice_id', invoiceId);
        });
        this.viewAirTicketTaxRefund = (invoiceId) => __awaiter(this, void 0, void 0, function* () {
            const [refunds] = yield this.query()
                .select('refund_id', 'client_refund_type', 'vendor_refund_type', 'client_total_tax_refund', 'vendor_total_tax_refund', 'refund_profit', 'created_at', 'cl_ac.account_name as client_account', 'v_ac.account_name as vendor_account')
                .from('trabill_airticket_tax_refund')
                .leftJoin('trabill_accounts as cl_ac', 'cl_ac.account_id', '=', 'client_account_id')
                .leftJoin('trabill_accounts as v_ac', 'v_ac.account_id', '=', 'vendor_account_id')
                .where({
                refund_agency_id: this.org_agency,
                refund_invoice_id: invoiceId,
                is_deleted: 0,
            });
            if (refunds) {
                const ticket_info = yield this.query()
                    .select('airticket_ticket_no', 'airticket_gds_id', 'refund_tax_amount', this.db.raw('coalesce(vendor_name, combine_name) as vendor_name'))
                    .from('trabill_airticket_tax_refund_items')
                    .leftJoin('trabill_invoice_airticket_items', 'airticket_id', '=', 'refund_airticket_id')
                    .leftJoin('trabill_vendors', 'vendor_id', '=', 'refund_vendor_id')
                    .leftJoin('trabill_combined_clients', 'combine_id', '=', 'refund_combined_id')
                    .where('refund_id', refunds.refund_id);
                return Object.assign(Object.assign({}, refunds), { ticket_info });
            }
            return {};
        });
    }
    // INVOICE AIRTICKET ITEM
    insertInvoiceAirticketItem(invoiceAirticketItems) {
        return __awaiter(this, void 0, void 0, function* () {
            const [airticket_id] = yield this.query()
                .into('trabill_invoice_airticket_items')
                .insert(Object.assign(Object.assign({}, invoiceAirticketItems), { airticket_org_agency: this.org_agency }));
            return airticket_id;
        });
    }
    updateInvoiceAirticketItem(invoiceAirticketItems, airticketId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .into('trabill_invoice_airticket_items')
                .update(invoiceAirticketItems)
                .where('airticket_id', airticketId);
        });
    }
    getPassportByAirticket(pass_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .from('trabill_passport_details')
                .select('passport_passport_no', 'passport_name', 'passport_mobile_no', 'passport_email', 'passport_visiting_country', this.db.raw("DATE_FORMAT(passport_date_of_birth, '%Y-%c-%e') as passport_date_of_birth"), this.db.raw("DATE_FORMAT(passport_date_of_issue, '%Y-%c-%e') as passport_date_of_issue"), this.db.raw("DATE_FORMAT(passport_date_of_expire, '%Y-%c-%e') as passport_date_of_expire"))
                .where('passport_id', pass_id)
                .andWhere('passport_org_agency', this.org_agency);
            return data;
        });
    }
    insertAirTicketFlightDetails(flight_details) {
        return __awaiter(this, void 0, void 0, function* () {
            const fltdetails_id = yield this.query()
                .into('trabill_invoice_airticket_items_flight_details')
                .insert(flight_details);
            return fltdetails_id[0];
        });
    }
    insertAirTicketAirlineCommissions(taxes_commission) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .into('trabill_invoice_airticket_airline_commission')
                .insert(taxes_commission);
        });
    }
    deleteAirTicketAirlineCommissions(invoiceId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update('is_deleted', 1)
                .into('trabill_invoice_airticket_airline_commission')
                .where('airline_invoice_id', invoiceId);
        });
    }
    selectAirTicketAirlineCommissions(invoiceId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .select('airline_taxes', 'airline_commission', 'airline_tax_type')
                .from('trabill_invoice_airticket_airline_commission')
                .where('airline_invoice_id', invoiceId)
                .andWhereNot('is_deleted', 1);
        });
    }
    deleteAirticketFlightByFlightId(fltdetails_id, fltdetails_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .into('trabill_invoice_airticket_items_flight_details')
                .update({ fltdetails_is_deleted: 1, fltdetails_deleted_by })
                .where('fltdetails_id', fltdetails_id);
        });
    }
    updateAirticketFlightByFlightId(flight_details, fltdetails_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .into('trabill_invoice_airticket_items_flight_details')
                .update(flight_details)
                .where('fltdetails_id', fltdetails_id);
        });
    }
    getPrevAirticketVendor(invoice_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .from('trabill_invoice_airticket_items')
                .select('airticket_vendor_id as vendor_id', 'airticket_vendor_combine_id as combined_id', 'airticket_purchase_price as prev_cost_price', 'airticket_vtrxn_id as prevTrxnId')
                .where('airticket_invoice_id', invoice_id)
                .andWhereNot('airticket_is_deleted', 1);
            return data;
        });
    }
    airticketItemsInfo(invoice_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .from('trabill_invoice_airticket_items')
                .select('airticket_vendor_id as vendor_id', 'invoice_no', 'airticket_vendor_combine_id as combined_id', 'airticket_purchase_price as prev_cost_price', 'airticket_vtrxn_id as prevTrxnId', 'airticket_ticket_no as ticket_no', this.db.raw("COALESCE(CONCAT('vendor-', airticket_vendor_id), CONCAT('vendor-', airticket_vendor_combine_id)) as comb_vendor"))
                .leftJoin('trabill_invoices', { invoice_id: 'airticket_invoice_id' })
                .where('airticket_invoice_id', invoice_id)
                .andWhereNot('airticket_is_deleted', 1);
            return data;
        });
    }
    getInvoiceInfoForVoid(invoice_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const [data] = yield this.query()
                .select('invoice_id', 'invoice_no', 'client_name', 'comb_client', 'net_total')
                .from('view_invoices')
                .where({ invoice_id });
            const vendors = yield this.query()
                .select('vendor_name', 'comb_vendor', 'cost_price', 'airticket_ticket_no')
                .from('view_invoices_cost')
                .where({ invoice_id });
            return Object.assign(Object.assign({}, data), { vendors });
        });
    }
}
exports.default = InvoiceAirticketModel;
//# sourceMappingURL=invoiceAirticket.models.js.map