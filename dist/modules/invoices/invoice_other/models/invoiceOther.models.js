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
class InvoiceOther extends abstract_models_1.default {
    constructor() {
        super(...arguments);
        this.insertOtherInvoicePass = (data) => __awaiter(this, void 0, void 0, function* () {
            yield this.query().insert(data).into('trabill_other_invoices_passport');
        });
        this.updateOtherInvoicePass = (data, other_passport_id) => __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update(data)
                .into('trabill_other_invoices_passport')
                .where('other_pass_id', other_passport_id);
        });
        this.deleteOtherInvoicePass = (invoiceId, deleted_by) => __awaiter(this, void 0, void 0, function* () {
            const passId = yield this.query()
                .select('other_pass_passport_id')
                .from('trabill_other_invoices_passport')
                .where('other_pass_invoice_id', invoiceId);
            yield this.query()
                .update({ passport_is_deleted: 1, passport_deleted_by: deleted_by })
                .into('trabill_passport_details')
                .where('passport_id', passId);
            yield this.query()
                .update({ other_pass_is_deleted: 1, other_pass_deleted_by: deleted_by })
                .into('trabill_other_invoices_passport')
                .where('other_pass_invoice_id', invoiceId);
        });
        this.getPreviousBillingInfo = (billing_id) => __awaiter(this, void 0, void 0, function* () {
            return yield this.db('trabill_other_invoices_billing')
                .select('billing_combined_id as combined_id', 'billing_vendor_id as vendor_id', 'billing_vtrxn_id as prevTrxnId')
                .where('billing_id', billing_id)
                .andWhereNot('billing_is_deleted', 1);
        });
        // =============== GET REFUND INVOICE OTHERS BY CLIENT ID
        this.getRefundOthersInfo = (clientId) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .from('trabill_invoices')
                .select('invoice_no', 'billing_vendor_id', 'pax_name', 'billing_quantity', 'billing_unit_price', 'billing_subtotal', 'billing_subtotal', 'trabill_products.product_name')
                .where('invoice_client_id', clientId)
                .andWhere('invoice_category_id', 5)
                .andWhere('invoice_org_agency', this.org_agency)
                .andWhereNot('invoice_is_deleted', 1)
                .leftJoin('trabill_other_invoices_billing', {
                billing_invoice_id: 'invoice_id',
            })
                .leftJoin('trabill_products', { product_id: 'billing_product_id' })
                .andWhereNot('billing_is_deleted', 1);
            return data;
        });
        this.getInvoiceBilling = (id) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .from('trabill_other_invoices_billing')
                .select('billing_id', this.db.raw("CASE WHEN billing_vendor_id IS NOT NULL THEN CONCAT('vendor-',billing_vendor_id) ELSE CONCAT('combined-',billing_combined_id) END AS billing_comvendor"), 'billing_product_id', 'pax_name', 'billing_description', 'billing_quantity', 'billing_unit_price', 'billing_subtotal', 'billing_profit', 'billing_cost_price')
                .where('billing_invoice_id', id)
                .andWhereNot('billing_is_deleted', 1);
            return data;
        });
        this.getPrevOtherBilling = (invoiceId) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .from('trabill_other_invoices_billing')
                .select(this.db.raw("CASE WHEN billing_vendor_id IS NOT NULL THEN CONCAT('vendor-',billing_vendor_id) ELSE CONCAT('combined-',billing_combined_id) END AS prevComvendor"), this.db.raw('billing_quantity*billing_cost_price as total_cost_price'), 'billing_quantity', 'billing_vendor_id', 'billing_cost_price', 'billing_combined_id', 'billing_vtrxn_id as prevTrxnId')
                .where('billing_invoice_id', invoiceId)
                .andWhereNot('billing_is_deleted', 1);
            return data;
        });
        this.getPreviousSingleBilling = (billing_id) => __awaiter(this, void 0, void 0, function* () {
            const [data] = yield this.db('trabill_other_invoices_billing')
                .select('billing_vtrxn_id as prevTrxnId', this.db.raw(`CASE WHEN billing_vendor_id IS NOT NULL THEN CONCAT('vendor-',billing_vendor_id) ELSE CONCAT('combined-',billing_combined_id) END AS prevComvendor`))
                .where('billing_id', billing_id)
                .andWhereNot('billing_is_deleted', 1);
            return data;
        });
        this.getInvoiceBillingInfo = (id) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .from('trabill_other_invoices_billing')
                .select('pax_name', 'billing_description', 'billing_quantity', 'billing_remaining_quantity', 'billing_unit_price', 'billing_subtotal', 'billing_cost_price', 'billing_profit', 'product_name', this.db.raw('COALESCE(tv.vendor_name, tcc.combine_name) AS vendor_name'))
                .where('billing_invoice_id', id)
                .andWhereNot('billing_is_deleted', 1)
                .leftJoin('trabill_products', { product_id: 'billing_product_id' })
                .leftJoin('trabill_combined_clients as tcc', {
                combine_id: 'billing_combined_id',
            })
                .leftJoin('trabill_vendors as tv', { vendor_id: 'billing_vendor_id' });
            return data;
        });
        this.getInvoiceHotelInfo = (id) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select('hotel_name', 'hotel_reference_no', 'hotel_check_in_date', 'hotel_check_out_date', 'rtype_name')
                .from('trabill_other_invoices_hotel')
                .leftJoin('trabill_room_types', { rtype_id: 'hotel_room_type_id' })
                .where('hotel_invoice_id', id)
                .andWhereNot('hotel_is_deleted', 1);
            return data;
        });
        this.getInvoiceHotel = (id) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select('hotel_id', 'hotel_name', 'hotel_reference_no', 'hotel_check_in_date', 'hotel_check_out_date', 'hotel_room_type_id')
                .from('trabill_other_invoices_hotel')
                .where('hotel_invoice_id', id)
                .andWhereNot('hotel_is_deleted', 1);
            return data;
        });
        this.getTransportType = () => __awaiter(this, void 0, void 0, function* () {
            const by_client = yield this.query()
                .select('ttype_id', 'ttype_name')
                .from('trabill_transport_types')
                .andWhere('ttype_org_agency', null)
                .andWhereNot('ttype_has_deleted', 1);
            const by_default = yield this.query()
                .from('trabill_transport_types')
                .select('ttype_id', 'ttype_name')
                .andWhere('ttype_org_agency', this.org_agency)
                .andWhereNot('ttype_has_deleted', 1);
            return [...by_client, ...by_default];
        });
        this.getInvoiceTicketInfo = (id) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select('ticket_id', 'ticket_no', 'ticket_airline_id', 'ticket_route', 'ticket_pnr', 'ticket_reference_no', 'ticket_journey_date', 'ticket_return_date')
                .from('trabill_other_invoices_ticket')
                .leftJoin('trabill_airlines', 'trabill_airlines.airline_id', 'ticket_airline_id')
                .leftJoin('trabill_invoice_airticket_routes', {
                airoute_id: 'ticket_route',
            })
                .leftJoin('trabill_airports', 'trabill_airports.airline_id', 'airoute_route_sector_id')
                .where('ticket_invoice_id', id)
                .andWhereNot('ticket_is_deleted', 1);
            return data;
        });
        this.getInvoiceTransportInfo = (id) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select('transport_id', 'transport_type_id', 'transport_reference_no', 'transport_pickup_place', 'transport_pickup_time', 'transport_dropoff_place', 'transport_dropoff_time')
                .from('trabill_other_invoices_transport')
                .where('transport_other_invoice_id', id)
                .andWhereNot('transport_is_deleted', 1);
            return data;
        });
        this.getInvoiceOtherPass = (id) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select('other_pass_id', 'passport_id', 'passport_passport_no', 'passport_name', 'passport_mobile_no', 'passport_email', 'passport_date_of_birth', 'passport_date_of_issue', 'passport_date_of_expire', 'passport_visiting_country')
                .from('trabill_other_invoices_passport')
                .join('trabill_passport_details', {
                other_pass_passport_id: 'passport_id',
            })
                .where('other_pass_invoice_id', id)
                .andWhereNot('other_pass_is_deleted', 1)
                .andWhereNot('passport_is_deleted', 1);
            return data;
        });
        this.getInvoiceOtherPassInfo = (id) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select('passport_passport_no', 'passport_name', 'passport_mobile_no', 'passport_email', 'passport_date_of_birth', 'passport_date_of_issue', 'passport_date_of_expire', 'country_name')
                .from('trabill_other_invoices_passport')
                .join('trabill_passport_details', {
                other_pass_passport_id: 'passport_id',
            })
                .leftJoin('trabill_countries', {
                country_id: 'passport_visiting_country',
            })
                .where('other_pass_invoice_id', id)
                .andWhereNot('other_pass_is_deleted', 1)
                .andWhereNot('passport_is_deleted', 1);
            return data;
        });
        this.getAllInvoiceOtherList = (search_text, from_date, to_date, page = 1, size = 20) => __awaiter(this, void 0, void 0, function* () {
            search_text && search_text.toLowerCase();
            size = Number(size);
            page = Number(page);
            const offset = (page - 1) * size;
            const data = yield this.query()
                .select('*')
                .from('view_invoice_other_list')
                .modify((event) => {
                event
                    .andWhere(function () {
                    if (from_date && to_date) {
                        this.andWhereRaw(`DATE_FORMAT(invoice_date, '%Y-%m-%d') BETWEEN ? AND ?`, [from_date, to_date]);
                    }
                    if (search_text) {
                        this.andWhereRaw(`LOWER(invoice_no) LIKE ?`, [
                            `%${search_text}%`,
                        ]).orWhereRaw(`LOWER(client_name) LIKE ?`, [`%${search_text}%`]);
                    }
                })
                    .andWhere('invoice_org_agency', this.org_agency);
            })
                .where('invoice_org_agency', this.org_agency)
                .limit(size)
                .offset(offset);
            const [total] = (yield this.query()
                .count('* as count')
                .from('view_invoice_other_list')
                .modify((event) => {
                event
                    .andWhere(function () {
                    if (from_date && to_date) {
                        this.andWhereRaw(`DATE_FORMAT(invoice_date, '%Y-%m-%d') BETWEEN ? AND ?`, [from_date, to_date]);
                    }
                    if (search_text) {
                        this.andWhereRaw(`LOWER(invoice_no) LIKE ?`, [
                            `%${search_text}%`,
                        ]).orWhereRaw(`LOWER(client_name) LIKE ?`, [`%${search_text}%`]);
                    }
                })
                    .andWhere('invoice_org_agency', this.org_agency);
            })
                .where('invoice_org_agency', this.org_agency));
            return { data, count: total.count };
        });
    }
    // @Insert
    insertTicketInfo(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.query().insert(data).into('trabill_other_invoices_ticket');
        });
    }
    updateTicketInfo(data, ticket_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update(data)
                .into('trabill_other_invoices_ticket')
                .where('ticket_id', ticket_id);
        });
    }
    insertHotelInfo(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.query().insert(data).into('trabill_other_invoices_hotel');
        });
    }
    updatetHotelInfo(data, hotel_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update(data)
                .into('trabill_other_invoices_hotel')
                .where('hotel_id', hotel_id);
        });
    }
    insertTransportInfo(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.query().insert(data).into('trabill_other_invoices_transport');
        });
    }
    updateTransportInfo(data, transport_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update(data)
                .into('trabill_other_invoices_transport')
                .where('transport_id', transport_id);
        });
    }
    insertBillingInfo(data) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.query().insert(data).into('trabill_other_invoices_billing');
        });
    }
    updateBillingInfo(data, billing_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update(data)
                .into('trabill_other_invoices_billing')
                .where('billing_id', billing_id);
        });
    }
    deleteOtherSingleBillingInfo(billing_id, billing_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update({ billing_is_deleted: 1, billing_deleted_by })
                .into('trabill_other_invoices_billing')
                .where('billing_id', billing_id);
        });
    }
    // @Delete
    deleteTicketInfo(invoice_id, ticket_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update({ ticket_is_deleted: 1, ticket_deleted_by })
                .into('trabill_other_invoices_ticket')
                .where('ticket_invoice_id', invoice_id);
        });
    }
    deleteSingleTicket(ticket_id, ticket_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update({ ticket_is_deleted: 1, ticket_deleted_by })
                .into('trabill_other_invoices_ticket')
                .where('ticket_id', ticket_id);
        });
    }
    deleteHotelInfo(invoice_id, hotel_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update({ hotel_is_deleted: 1, hotel_deleted_by })
                .into('trabill_other_invoices_hotel')
                .where('hotel_invoice_id', invoice_id);
        });
    }
    deleteSingleHotelInfo(hotel_id, hotel_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update({ hotel_is_deleted: 1, hotel_deleted_by })
                .into('trabill_other_invoices_hotel')
                .where('hotel_id', hotel_id);
        });
    }
    deleteTransportInfo(invoice_id, transport_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update({ transport_is_deleted: 1, transport_deleted_by })
                .into('trabill_other_invoices_transport')
                .where('transport_other_invoice_id', invoice_id);
        });
    }
    deleteSingleTransportInfo(transport_id, transport_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update({ transport_is_deleted: 1, transport_deleted_by })
                .into('trabill_other_invoices_transport')
                .where('transport_id', transport_id);
        });
    }
    deleteBillingInfo(invocieId, billing_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update({ billing_is_deleted: 1, billing_deleted_by })
                .from('trabill_other_invoices_billing')
                .where('billing_invoice_id', invocieId);
        });
    }
    deleteOtherRefund(invocieId, refund_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update({ refund_is_deleted: 1, refund_deleted_by })
                .into('trabill_other_refunds')
                .where('refund_invoice_id', invocieId);
        });
    }
    deleteOtherPassport(invoice_id, deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            const passportId = yield this.query()
                .select('other_pass_passport_id')
                .from('trabill_other_invoices_passport')
                .where('other_pass_invoice_id', invoice_id)
                .andWhereNot('other_pass_is_deleted', 1);
            yield this.query()
                .update({ other_pass_is_deleted: 1, other_pass_deleted_by: deleted_by })
                .into('trabill_other_invoices_passport')
                .where('other_pass_invoice_id', invoice_id);
            for (const item of passportId) {
                yield this.query()
                    .update({ passport_is_deleted: 1, passport_deleted_by: deleted_by })
                    .into('trabill_passport_details')
                    .where('passport_id', item.other_pass_passport_id);
            }
        });
    }
    deleteSingleOtherPassport(other_pass_id, deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            const [{ other_pass_passport_id }] = yield this.query()
                .select('other_pass_passport_id')
                .from('trabill_other_invoices_passport')
                .where('other_pass_id', other_pass_id);
            yield this.query()
                .update({ other_pass_is_deleted: 1, other_pass_deleted_by: deleted_by })
                .into('trabill_other_invoices_passport')
                .where('other_pass_id', other_pass_id);
            yield this.query()
                .update({ passport_is_deleted: 1, passport_deleted_by: deleted_by })
                .into('trabill_passport_details')
                .where('passport_id', other_pass_passport_id);
        });
    }
    deleteUpdateBillingInfo(invoice_id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update({ billing_is_deleted: 1 })
                .into('trabill_other_invoices_billing')
                .where('billing_invoice_id', invoice_id);
        });
    }
}
exports.default = InvoiceOther;
//# sourceMappingURL=invoiceOther.models.js.map