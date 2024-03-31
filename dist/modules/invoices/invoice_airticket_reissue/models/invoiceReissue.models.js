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
const common_helper_1 = require("../../../../common/helpers/common.helper");
class ReIssueAirticket extends abstract_models_1.default {
    constructor() {
        super(...arguments);
        this.deleteReissueTicketItems = (invoiceId, deleted_by) => __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update({ p_is_deleted: 1, p_deleted_by: deleted_by })
                .into('trabill_invoice_airticket_pax')
                .where('p_invoice_id', invoiceId);
            yield this.query()
                .into('trabill_invoice_reissue_airticket_items_flight_details')
                .update({ fltdetails_is_deleted: 1, fltdetails_deleted_by: deleted_by })
                .where('fltdetails_invoice_id', invoiceId);
            yield this.query()
                .update({ airticket_is_deleted: 1, airticket_deleted_by: deleted_by })
                .into('trabill_invoice_reissue_airticket_items')
                .where('airticket_invoice_id', invoiceId);
        });
        this.getInvoiceReissuePaxDetails = (invoiceId) => __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .select('passport_date_of_birth', 'passport_date_of_expire', 'passport_date_of_issue', 'passport_email', 'passport_mobile_no', 'passport_name', 'passport_nid_no', 'passport_passport_no', 'passport_person_type')
                .from('trabill_invoice_reissue_airticket_items as reissue_ait_item')
                .where('airticket_invoice_id', invoiceId)
                .andWhereNot('airticket_is_deleted', 1)
                .leftJoin('trabill_passport_details', {
                airticket_passport_id: 'passport_id',
            })
                .leftJoin('trabill_airports', {
                'trabill_airports.airline_id': 'reissue_ait_item.airticket_route_or_sector',
            });
        });
        this.getFlightDetails = (invoiceId) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .from('trabill_invoice_reissue_airticket_items_flight_details')
                .select('fltdetails_fly_date', 'fltdetails_arrival_time', 'fltdetails_departure_time', 'trabill_airlines.airline_name', 'from.airline_airport as flight_from', 'to.airline_airport as flight_to')
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
        this.getInvoiceReissueData = (invoiceId) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select(this.db.raw("CASE WHEN invoice_client_id IS NOT NULL THEN CONCAT('client-',invoice_client_id) ELSE CONCAT('combined-',invoice_combined_id) END AS invoice_combclient_id"), 'invoice_net_total', 'invoice_reference', 'invoice_no', 'invoice_sales_date', 'invoice_due_date', 'invoice_sales_man_id', 'invoice_sub_total', 'invoice_note', 'invoice_agent_id', 'invoice_show_passport_details', 'invoice_reissue_client_type', 'invoice_show_prev_due', 'invoice_vat', 'invoice_service_charge', 'invoice_discount', 'invoice_agent_id', 'invoice_agent_com_amount')
                .from('trabill_invoices')
                .where('invoice_id', invoiceId)
                .leftJoin('trabill_invoices_extra_amounts', {
                extra_amount_invoice_id: 'invoice_id',
            })
                .leftJoin('trabill_invoices_airticket_prerequire', {
                airticket_invoice_id: 'invoice_id',
            });
            return data[0];
        });
        this.getReissueAirticketsForEdit = (invoiceId) => __awaiter(this, void 0, void 0, function* () {
            const airtickets = yield this.query()
                .select(this.db.raw("CASE WHEN airticket_vendor_id IS NOT NULL THEN CONCAT('vendor-',airticket_vendor_id) ELSE CONCAT('combined-',airticket_vendor_combine_id) END AS airticket_comvendor"), 'airticket_penalties', 'airticket_commission_percent', 'airticket_fare_difference', 'airticket_id', 'airticket_passport_id', 'airticket_issue_date', 'airticket_journey_date', 'airticket_return_date', 'airticket_ticket_no', 'airticket_client_price', 'airticket_purchase_price', 'airticket_airline_id', 'airticket_extra_fee', 'airticket_pnr', 'airticket_profit', 'airticket_classes')
                .from('trabill_invoice_reissue_airticket_items')
                .where('airticket_invoice_id', invoiceId)
                .andWhereNot('airticket_is_deleted', 1);
            const data = [];
            for (const ticket of airtickets) {
                const { airticket_id } = ticket;
                const pax_passport = yield this.query()
                    .select('p_passport_id as passport_id', 'p_passport_name as passport_name', 'p_passport_type as passport_person_type', 'p_mobile_no AS passport_mobile_no', 'p_email AS passport_email')
                    .from('trabill_invoice_airticket_pax')
                    .where('p_invoice_id', invoiceId)
                    .andWhere('p_airticket_id', airticket_id)
                    .andWhereNot('p_is_deleted', 1);
                const flight_details = yield this.query()
                    .select('fltdetails_from_airport_id', 'fltdetails_to_airport_id', 'fltdetails_airline_id', 'fltdetails_flight_no', 'fltdetails_fly_date', 'fltdetails_departure_time', 'fltdetails_arrival_time')
                    .from('trabill_invoice_reissue_airticket_items_flight_details')
                    .where('fltdetails_airticket_id', airticket_id)
                    .andWhereNot('fltdetails_is_deleted', 1);
                const airticketRoutesId = yield this.query()
                    .select('airoute_route_sector_id')
                    .from('trabill_invoice_airticket_routes')
                    .where('airoute_invoice_id', invoiceId)
                    .andWhere('airoute_airticket_id', airticket_id)
                    .andWhereNot('airoute_is_deleted', 1);
                const airticket_route_or_sector = airticketRoutesId.map((item) => item.airoute_route_sector_id);
                data.push({
                    ticket_details: Object.assign(Object.assign({}, ticket), { airticket_route_or_sector }),
                    pax_passport,
                    flight_details,
                });
            }
            return data;
        });
        this.getReissueTicketInfo = (invoiceId) => __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .select('airticket_id', 'airticket_org_agency', 'airticket_ticket_no', this.db.raw('COALESCE(airticket_after_reissue_client_price, airticket_client_price) AS airticket_client_price'), this.db.raw('COALESCE(airticket_after_reissue_purchase_price, airticket_purchase_price) AS airticket_purchase_price'), this.db.raw("coalesce( concat('client-', airticket_client_id), concat('combined-', airticket_combined_id)) as comb_client"), this.db.raw('coalesce( concat("vendor-", airticket_vendor_id), concat("combined-", airticket_vendor_combine_id)) as comb_vendor'))
                .from('trabill_invoice_reissue_airticket_items')
                .where('airticket_invoice_id', invoiceId)
                .andWhereNot('airticket_is_refund', 1)
                .andWhereNot('airticket_is_deleted', 1);
        });
        // REISSUE REFUND
        this.insertReissueRefund = (data) => __awaiter(this, void 0, void 0, function* () {
            const id = yield this.query()
                .insert(data)
                .into('trabill_invoice_reissue_refund');
            if (id) {
                return id[0];
            }
        });
        this.deleteReissueRefund = (id) => __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .update({ refund_is_deleted: 1 })
                .from('trabill_invoice_reissue_refund')
                .where('refund_id', id);
        });
        this.insertReissueRefundItem = (data) => __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .insert(data)
                .into('trabill_invoice_reissue_refund_items');
        });
        this.deleteReissueRefundItem = (id) => __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .update({ ritem_is_deleted: 1 })
                .from('trabill_invoice_reissue_refund_items')
                .where('ritem_refund_id', id);
        });
        this.reissueItemRefundUpdate = (airticketId) => __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update({ airticket_is_refund: 1 })
                .from('trabill_invoice_reissue_airticket_items')
                .where('airticket_id', airticketId)
                .whereNot('airticket_is_deleted', 1)
                .andWhereNot('airticket_is_refund', 1);
        });
        this.updateInvoiceIsRefund = (invoiceId) => __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update({ invoice_is_refund: 1 })
                .from('trabill_invoices')
                .where('invoice_id', invoiceId)
                .whereNot('invoice_is_refund', 1)
                .andWhereNot('invoice_is_deleted', 1);
        });
        this.getReissueRefundData = (invoiceId) => __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .select(this.db.raw('COALESCE(client_name, combine_name) AS client_name'), 'refund_voucher', 'refund_client_total', 'refund_client_type', 'refund_client_payment_method', 'refund_vendor_total', 'refund_vendor_type', 'refund_vendor_payment_method', 'refund_date', 'refund_create_at', 'cl_acc.account_name as client_refund_account', 'v_acc.account_name as vendor_refund_account')
                .from('trabill_invoice_reissue_refund')
                .leftJoin('trabill_clients', { client_id: 'refund_client_id' })
                .leftJoin('trabill_combined_clients', {
                combine_id: 'refund_combined_id',
            })
                .leftJoin('trabill_accounts as cl_acc', {
                'cl_acc.account_id': 'refund_client_account_id',
            })
                .leftJoin('trabill_accounts as v_acc', {
                'v_acc.account_id': 'refund_vendor_account_id',
            })
                .where('refund_invoice_id', invoiceId)
                .whereNot('refund_is_deleted', 1);
        });
        this.getReissueRefundItems = (invoiceId) => __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .select(this.db.raw('COALESCE(vendor_name,combine_name) AS vendor_name'), 'ritem_sales', 'ritem_client_charge', 'ritem_client_refund', 'ritem_purchase', 'ritem_vendor_charge', 'ritem_vendor_refund')
                .from('trabill_invoice_reissue_refund')
                .leftJoin('trabill_invoice_reissue_refund_items', {
                refund_id: 'ritem_refund_id',
            })
                .leftJoin('trabill_vendors', { vendor_id: 'ritem_vendor_id' })
                .leftJoin('trabill_combined_clients', { combine_id: 'ritem_combined_id' })
                .where('refund_invoice_id', invoiceId)
                .whereNot('refund_is_deleted', 1)
                .andWhereNot('ritem_is_deleted', 1);
        });
        this.updateInvoiceIsReissued = (invoiceId, is_reissued) => __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update('invoice_is_reissued', is_reissued)
                .from('trabill_invoices')
                .where('invoice_id', invoiceId);
        });
        this.getExistingInvCateId = (invoiceId) => __awaiter(this, void 0, void 0, function* () {
            const [data] = yield this.query()
                .select('invoice_category_id')
                .from('trabill_invoices')
                .where('invoice_id', invoiceId);
            return data === null || data === void 0 ? void 0 : data.invoice_category_id;
        });
        this.updateAirTicketIsReissued = (categoryId, airTicketId, is_reissued) => __awaiter(this, void 0, void 0, function* () {
            if (categoryId === 1) {
                yield this.query()
                    .update('airticket_is_reissued', is_reissued)
                    .from('trabill_invoice_airticket_items')
                    .where('airticket_id', airTicketId);
            }
            else if (categoryId === 2) {
                yield this.query()
                    .update('airticket_is_reissued', is_reissued)
                    .from('trabill_invoice_noncom_airticket_items')
                    .where('airticket_id', airTicketId);
            }
            else if (categoryId === 3) {
                yield this.query()
                    .update('airticket_is_reissued', is_reissued)
                    .from('trabill_invoice_reissue_airticket_items')
                    .where('airticket_id', airTicketId);
            }
        });
        this.getPreviousAirTicketData = (categoryId, airTicketId) => __awaiter(this, void 0, void 0, function* () {
            let data = [];
            if (categoryId === 1) {
                data = yield this.query()
                    .select('airticket_client_price as cl_price', 'airticket_purchase_price as purchase', 'airticket_profit', 'airticket_tax as taxes')
                    .from('trabill_invoice_airticket_items')
                    .where('airticket_id', airTicketId);
            }
            else if (categoryId === 2) {
                data = yield this.query()
                    .select('airticket_after_reissue_client_price as cl_price', 'airticket_after_reissue_purchase_price as purchase', 'airticket_after_reissue_profit as airticket_profit', 'airticket_after_reissue_taxes as taxes')
                    .from('trabill_invoice_noncom_airticket_items')
                    .where('airticket_id', airTicketId);
            }
            else if (categoryId === 3) {
                data = yield this.query()
                    .select('airticket_client_price as cl_price', 'airticket_purchase_price as purchase', 'airticket_profit', 'airticket_tax as taxes')
                    .from('trabill_invoice_reissue_airticket_items')
                    .where('airticket_id', airTicketId);
            }
            if (data.length) {
                return data[0];
            }
            return {
                cl_price: 0,
                purchase: 0,
                airticket_profit: 0,
                taxes: 0,
            };
        });
    }
    insertReissueAirTicketItems(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = yield this.query()
                .insert(Object.assign(Object.assign({}, data), { airticket_org_agency: this.org_agency }))
                .into('trabill_invoice_reissue_airticket_items');
            return id[0];
        });
    }
    insertReissueFlightDetails(invoiceFlightDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .into('trabill_invoice_reissue_airticket_items_flight_details')
                .insert(invoiceFlightDetails);
        });
    }
    deleteAirticketReissue(invoice_id, airticket_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .into('trabill_invoice_reissue_airticket_items')
                .update({ airticket_is_deleted: 1, airticket_deleted_by })
                .where('airticket_invoice_id', invoice_id);
        });
    }
    deleteReissueFlightDetails(invoice_id, fltdetails_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .into('trabill_invoice_reissue_airticket_items_flight_details')
                .update({ fltdetails_is_deleted: 1, fltdetails_deleted_by })
                .where('fltdetails_invoice_id', invoice_id);
        });
    }
    getReissuePrevVendors(invoice_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .from('trabill_invoice_reissue_airticket_items')
                .select('airticket_vendor_id as vendor_id', 'airticket_vendor_combine_id as combined_id', 'airticket_purchase_price as prev_cost_price', 'airticket_vtrxn_id as prevTrxnId', 'airticket_existing_airticket_id as ex_airticket_id', 'airticket_existing_invoiceid as ex_inv_id')
                .where('airticket_invoice_id', invoice_id)
                .andWhereNot('airticket_is_deleted', 1);
            return data;
        });
    }
    updateInvoiceReissueAirticket(invoice_id, updated_data) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .into('trabill_invoice_reissue_airticket_items')
                .update(updated_data)
                .where('airticket_invoice_id', invoice_id);
            return data;
        });
    }
    getReissueAirticketInfo(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .select('airticket_penalties', 'airticket_classes', 'airticket_commission_percent', 'airticket_fare_difference', 'airticket_id', 'airticket_ticket_no', 'airticket_pnr', 'airticket_client_price', 'airticket_extra_fee', 'airticket_purchase_price', 'airticket_profit', 'airticket_journey_date', 'airticket_return_date', 'airticket_issue_date', 'airticket_sales_date', 'airticket_existing_invoiceid', 'airticket_existing_airticket_id', 'airticket_after_reissue_client_price', 'airticket_after_reissue_purchase_price', 'airticket_after_reissue_profit', 'airticket_after_reissue_taxes', 'airticket_ait', 'airticket_tax', this.db.raw('COALESCE(vendor_name, combine_name) vendor_name'), 'airline_name', 'passport_name', 'view_airticket_routes.airticket_routes')
                .from('trabill_invoice_reissue_airticket_items as airticketitem')
                .where('airticket_invoice_id', id)
                .andWhereNot('airticket_is_deleted', 1)
                .leftJoin('trabill_vendors', { vendor_id: 'airticket_vendor_id' })
                .leftJoin('trabill_combined_clients', {
                combine_id: 'airticket_vendor_combine_id',
            })
                .leftJoin('trabill_airlines', { airline_id: 'airticket_airline_id' })
                .leftJoin('trabill_passport_details', {
                passport_id: 'airticket_passport_id',
            })
                .leftJoin('view_airticket_routes', function () {
                this.on('view_airticket_routes.airoute_invoice_id', '=', 'airticketitem.airticket_invoice_id').andOn('view_airticket_routes.airoute_airticket_id', '=', 'airticketitem.airticket_id');
            });
        });
    }
    getExistingClientAirticket(client, table_name) {
        return __awaiter(this, void 0, void 0, function* () {
            const { client_id, combined_id } = (0, common_helper_1.separateCombClientToId)(client);
            const data1 = yield this.query()
                .from(`${table_name}_airticket_items`)
                .select('airticket_id', 'airticket_invoice_id', this.db.raw("CASE WHEN airticket_client_id IS NOT NULL THEN CONCAT('client-',airticket_client_id) ELSE CONCAT('combined-',airticket_combined_id) END AS airticket_client_id"), this.db.raw("coalesce(concat('vendor-',airticket_vendor_id), concat('combined-',airticket_vendor_combine_id)) as comb_vendor"), this.db.raw('COALESCE(passport_name, p_passport_name) AS passport_name'), 'airticket_ticket_no', 'vendor_name', 'airticket_purchase_price', 'airticket_client_price', 'airticket_profit', 'airline_name', 'airticket_pnr', this.db.raw("DATE_FORMAT(airticket_issue_date, '%Y %M %e') as airticket_issue_date"), this.db.raw("DATE_FORMAT(airticket_journey_date, '%Y %M %e') as airticket_journey_date"), this.db.raw("DATE_FORMAT(airticket_return_date, '%Y %M %e') as airticket_return_date"))
                .leftJoin('trabill_invoice_airticket_pax', {
                p_airticket_id: 'airticket_id',
                airticket_invoice_id: 'p_invoice_id',
            })
                .leftJoin('trabill_passport_details', { passport_id: 'p_passport_id' })
                .leftJoin('trabill_vendors', { vendor_id: 'airticket_vendor_id' })
                .leftJoin('trabill_airlines', { airline_id: 'airticket_airline_id' })
                .where('airticket_client_id', client_id)
                .andWhere('airticket_combined_id', combined_id)
                .andWhereNot('airticket_is_deleted', 1)
                .andWhereNot('airticket_is_refund', 1)
                .andWhereNot('airticket_is_reissued', 1);
            return data1;
        });
    }
    getExistingClTicketInfo(invoice_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select(this.db.raw("CASE WHEN airticket_vendor_id IS NOT NULL THEN CONCAT('vendor-',airticket_vendor_id) ELSE CONCAT('combined-',airticket_vendor_combine_id) END AS comb_vendor"), 'airticket_sales_date', 'airticket_profit', 'airticket_journey_date', 'airticket_return_date', 'airticket_purchase_price', 'airticket_client_price', 'airticket_ticket_no', 'airticket_existing_invoiceid', 'airticket_existing_airticket_id', 'airticket_penalties', 'airticket_fare_difference', 'airticket_commission_percent', 'airticket_ait', 'airticket_issue_date', 'airticket_classes', 'airticket_tax', 'airticket_extra_fee')
                .from('trabill_invoice_reissue_airticket_items')
                .where('airticket_invoice_id', invoice_id)
                .andWhereNot('airticket_is_deleted', 1);
            return data[0];
        });
    }
}
exports.default = ReIssueAirticket;
//# sourceMappingURL=invoiceReissue.models.js.map