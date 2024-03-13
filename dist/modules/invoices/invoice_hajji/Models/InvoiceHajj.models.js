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
class InvoiceHajjModels extends abstract_models_1.default {
    constructor() {
        super(...arguments);
        this.deleteHajjiPassport = (invoiceId, haji_info_deleted_by) => __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update({ haji_info_is_deleted: 1, haji_info_deleted_by })
                .into('trabill_invoice_hajj_haji_infos')
                .where('haji_info_invoice_id', invoiceId);
        });
        this.getInvoiceHajjInfos = (id) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select('*')
                .from('trabill_invoice_hajj_haji_infos')
                .where('haji_info_invoice_id', id);
            return data;
        });
        this.insertInvoiceHajjHotelInfos = (data) => __awaiter(this, void 0, void 0, function* () {
            const hotel_id = yield this.query()
                .insert(data)
                .into('trabill_invoice_hajj_hotel_infos');
            return hotel_id[0];
        });
        this.updateInvoiceHajjHotelByHotelId = (data, hotelid) => __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update(data)
                .into('trabill_invoice_hajj_hotel_infos')
                .where('hotel_id', hotelid);
        });
        this.deleteInvoiceHajjHotelByHotelId = (hotelid, hotel_deleted_by) => __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update({ hotel_is_deleted: 1, hotel_deleted_by })
                .into('trabill_invoice_hajj_hotel_infos')
                .where('hotel_id', hotelid);
        });
        this.insertHajjHajiInfo = (data) => __awaiter(this, void 0, void 0, function* () {
            const [hajj_hajji_id] = yield this.query()
                .insert(data)
                .into('trabill_invoice_hajj_haji_infos');
            return hajj_hajji_id;
        });
        this.updateHajjHajiInfo = (data, hajiId) => __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update(data)
                .into('trabill_invoice_hajj_haji_infos')
                .where('haji_info_id', hajiId);
        });
        this.deleteHajjHajiInfoByHajiId = (hajiId, haji_info_deleted_by) => __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update({ haji_info_is_deleted: 1, haji_info_deleted_by })
                .into('trabill_invoice_hajj_haji_infos')
                .where('haji_info_id', hajiId);
        });
        this.insertHajjHajiInfoRoutes = (data) => __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .insert(data)
                .into('trabill_invoice_umrah_passenger_routes');
        });
        this.dleteHajjHajiInfoRoutes = (ih_haji_info_id, iu_deleted_by) => __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update({ iu_is_deleted: 1, iu_deleted_by })
                .into('trabill_invoice_umrah_passenger_routes')
                .where('ih_haji_info_id', ih_haji_info_id);
        });
        this.deleteInvoiceHajjHotelInfos = (invoiceId, hotel_deleted_by) => __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update({ hotel_is_deleted: 1, hotel_deleted_by })
                .into('trabill_invoice_hajj_hotel_infos')
                .where('hotel_invoice_id', invoiceId);
        });
        this.insertInTransportInfos = (data) => __awaiter(this, void 0, void 0, function* () {
            const transport_id = yield this.query()
                .insert(data)
                .into('trabill_invoice_hajj_transport_infos');
            return transport_id[0];
        });
        this.deleteHajjTranportByTransportId = (transId, transport_deleted_by) => __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update({ transport_is_deleted: 1, transport_deleted_by })
                .into('trabill_invoice_hajj_transport_infos')
                .where('transport_id', transId);
        });
        this.updateHajjTranportByTransportId = (data, transId) => __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update(data)
                .into('trabill_invoice_hajj_transport_infos')
                .where('transport_id', transId);
        });
        this.deleteInTransportInfos = (invoiceId, transport_deleted_by) => __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update({ transport_is_deleted: 1, transport_deleted_by })
                .into('trabill_invoice_hajj_transport_infos')
                .where('transport_invoice_id', invoiceId);
        });
        this.insertInBillingInfos = (data) => __awaiter(this, void 0, void 0, function* () {
            const billing_id = yield this.query()
                .insert(data)
                .into('trabill_invoice_hajj_billing_infos');
            return billing_id[0];
        });
        this.updateBillingInfosByBillingId = (data, billingId) => __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update(data)
                .into('trabill_invoice_hajj_billing_infos')
                .where('billing_id', billingId);
        });
        this.deleteBillingInfosByBillingId = (billingId, billing_deleted_by) => __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update({ billing_is_deleted: 1, billing_deleted_by })
                .into('trabill_invoice_hajj_billing_infos')
                .where('billing_id', billingId);
        });
        this.deleteInBillingInfos = (invoiceId, billing_deleted_by) => __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update({ billing_is_deleted: 1, billing_deleted_by })
                .into('trabill_invoice_hajj_billing_infos')
                .where('billing_invoice_id', invoiceId);
        });
        // ================ @Get Pilgrims Information
        this.getInvoiceHajjPilgrimsInfo = (invoiceId) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select('haji_info_id', 'haji_info_passport_id', 'hajiinfo_tracking_number', 'hajiinfo_serial', 'ticket_route', 'ticket_no', 'ticket_pnr', 'ticket_airline_id', 'airline_name', 'ticket_reference_no', 'ticket_journey_date', 'ticket_return_date', 'haji_info_invoice_id', 'haji_info_vouchar_no', 'passport_name', 'passport_passport_no', 'passport_mobile_no', 'passport_nid_no')
                .from('trabill_invoice_hajj_haji_infos')
                .leftJoin('trabill_airlines', { airline_id: 'ticket_airline_id' })
                .leftJoin('trabill_passport_details', {
                passport_id: 'haji_info_passport_id',
            })
                .where('haji_info_invoice_id', invoiceId)
                .andWhereNot('haji_info_is_deleted', 1)
                .groupBy('haji_info_id', 'haji_info_passport_id', 'hajiinfo_tracking_number', 'ticket_route', 'ticket_no', 'ticket_pnr', 'ticket_airline_id', 'ticket_reference_no', 'ticket_journey_date', 'ticket_return_date', 'haji_info_invoice_id', 'haji_info_vouchar_no', 'passport_name', 'passport_passport_no', 'passport_mobile_no', 'passport_nid_no', 'airline_name');
            let dataForReturn = [];
            for (const item of data) {
                const airlineId = yield this.query()
                    .select('iu_airport_id')
                    .from('trabill_invoice_umrah_passenger_routes')
                    .where('ih_haji_info_id', item.haji_info_id)
                    .andWhereNot('iu_is_deleted', 1);
                const ticket_route = airlineId.map((item) => item.iu_airport_id);
                dataForReturn.push(Object.assign(Object.assign({}, item), { ticket_route }));
            }
            return dataForReturn;
        });
        this.getInvoiceHajjInfo = (invoiceId) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select(this.db.raw("CASE WHEN invoice_client_id IS NOT NULL THEN CONCAT('client-',invoice_client_id) ELSE CONCAT('combined-',invoice_combined_id) END AS invoice_combclient_id"), 'invoice_net_total', 'invoice_no', 'invoice_reference', 'invoice_sales_date', 'invoice_due_date', 'invoice_sales_man_id', 'invoice_sub_total', 'invoice_note', 'invoice_agent_id', 'invoice_hajj_session', 'invoice_haji_group_id', 'invoice_vat', 'invoice_service_charge', 'invoice_discount', 'invoice_agent_com_amount', 'hajj_total_pax')
                .from('trabill_invoices')
                .leftJoin('trabill_invoices_extra_amounts', {
                invoice_id: 'extra_amount_invoice_id',
            })
                .where('invoice_id', invoiceId);
            return data[0];
        });
        this.getHajiHotelInfo = (invoiceId) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .from('trabill_invoice_hajj_hotel_infos')
                .select('hotel_id', 'hotel_name', 'hotel_check_in_date', 'hotel_check_out_date', 'hotel_room_type_id')
                .where('hotel_invoice_id', invoiceId)
                .andWhereNot('hotel_is_deleted', 1);
            return data;
        });
        this.getHajiTransportInfo = (invoiceId) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .from('trabill_invoice_hajj_transport_infos')
                .select('transport_id', 'transport_type_id', 'ttype_name', 'transport_pickup_place', 'transport_pickup_time', 'transport_dropoff_place', 'transport_dropoff_time')
                .where('transport_invoice_id', invoiceId)
                .andWhereNot('transport_is_deleted', 1)
                .leftJoin('trabill_transport_types', { ttype_id: 'transport_type_id' });
            return data;
        });
        this.getInvoiceHajjBillingView = (inovice_id) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select(this.db.raw('COALESCE(tv.vendor_name, tcc.combine_name) AS vendor_name'), 'billing_quantity', 'billing_unit_price', 'billing_subtotal', 'billing_cost_price', 'billing_profit', 'product_name', 'pax_name', 'billing_description')
                .from('trabill_invoice_hajj_billing_infos')
                .leftJoin('trabill_combined_clients as tcc', {
                combine_id: 'billing_combined_id',
            })
                .leftJoin('trabill_vendors as tv', { vendor_id: 'billing_vendor_id' })
                .leftJoin('trabill_products', { product_id: 'billing_product_id' })
                .where('billing_invoice_id', inovice_id)
                .andWhereNot('billing_is_deleted', 1);
            return data;
        });
        this.getHajiBillingInfo = (invoiceId) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .from('trabill_invoice_hajj_billing_infos')
                .select('billing_vendor_id as vendor_id', 'billing_combined_id as combined_id', this.db.raw('billing_cost_price * billing_quantity as prev_cost_price'), 'billing_vtrxn_id as prevTrxnId')
                .where('billing_invoice_id', invoiceId)
                .andWhereNot('billing_is_deleted', 1)
                .leftJoin('trabill_products', { billing_product_id: 'product_id' });
            return data;
        });
        this.getHajiBillingInfoByBillingId = (billingId) => __awaiter(this, void 0, void 0, function* () {
            const [data] = yield this.query()
                .from('trabill_invoice_hajj_billing_infos')
                .select(this.db.raw("coalesce(concat('vendor-',billing_vendor_id), concat('combined-',billing_combined_id)) as prevComvendor"), 'billing_vendor_id as vendor_id', 'billing_combined_id as combined_id', this.db.raw('billing_cost_price * billing_quantity as prev_cost_price'), 'billing_vtrxn_id as prevTrxnId')
                .where('billing_id', billingId);
            return data;
        });
        this.getForEditHajiBilling = (invoiceId) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .from('trabill_invoice_hajj_billing_infos')
                .select('billing_id', this.db.raw("CASE WHEN billing_vendor_id IS NOT NULL THEN CONCAT('vendor-',billing_vendor_id) ELSE CONCAT('combined-',billing_combined_id) END AS billing_comvendor"), 'billing_product_id', 'pax_name', 'billing_description', 'billing_quantity', 'billing_unit_price', 'billing_subtotal', 'billing_cost_price', 'billing_profit')
                .where('billing_invoice_id', invoiceId)
                .andWhereNot('billing_is_deleted', 1)
                .leftJoin('trabill_products', { billing_product_id: 'product_id' });
            return data;
        });
    }
    getHajjInfo(invoice_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select('billing_id', 'billing_vendor_id', 'billing_combined_id', this.db.raw(`COALESCE(concat('client-',invoice_client_id), concat('combined-',invoice_combined_id)) AS comb_client`), this.db.raw(`COALESCE(concat('vendor-',billing_vendor_id), concat('combined-',billing_vendor_id)) AS comb_vendor`), 'billing_product_id', 'product_name', 'billing_quantity', 'billing_remaining_quantity', 'pax_name', 'billing_unit_price', 'billing_cost_price')
                .from('trabill_invoice_hajj_billing_infos')
                .leftJoin('trabill_products', { product_id: 'billing_product_id' })
                .leftJoin('trabill_invoices', { invoice_id: 'billing_invoice_id' })
                .whereNot('billing_is_deleted', 1)
                .andWhereNot('billing_is_refund', 1)
                .andWhere('billing_remaining_quantity', '>', 0)
                .andWhere('billing_invoice_id', invoice_id);
            return data;
        });
    }
    createHajjRefund(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const [id] = yield this.query()
                .insert(data)
                .into('trabill_invoice_hajj_refund');
            return id;
        });
    }
    createHajjRefundItems(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .insert(data)
                .into('trabill_invoice_hajj_refund_items');
        });
    }
    updateHajjBillingRemainingQuantity(billing_id, refund_quantity) {
        return __awaiter(this, void 0, void 0, function* () {
            const [{ billing_remaining_quantity }] = (yield this.query()
                .select('billing_remaining_quantity')
                .from('trabill_invoice_hajj_billing_infos')
                .where({ billing_id }));
            const remaining_quantity = Number(billing_remaining_quantity) - refund_quantity;
            return yield this.query()
                .update({
                billing_remaining_quantity: remaining_quantity,
                billing_is_refund: remaining_quantity == 0 ? 1 : 0,
            })
                .into('trabill_invoice_hajj_billing_infos')
                .where({ billing_id });
        });
    }
    updateHajjInvoiceIsRefund(invoice_id, is_refund) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = (yield this.query()
                .select('billing_id')
                .from('trabill_invoice_hajj_billing_infos')
                .where('billing_invoice_id', invoice_id)
                .andWhereNot('billing_is_refund', is_refund)
                .andWhereNot('billing_is_deleted', 1));
            if (!data.length)
                yield this.query()
                    .update({ invoice_is_refund: is_refund })
                    .into('trabill_invoices')
                    .where({ invoice_id });
        });
    }
    getHajjInvoiceRefund(invoice_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .select('refund_id', this.db.raw(`COALESCE(client_name, combine_name) AS client_name`), 'refund_voucher_no', 'refund_client_total', 'refund_client_type', 'refund_client_payment_method', 'refund_client_acc_id', 'cl_acc.account_name AS client_account_name', 'v_acc.account_name AS vendor_account_name', 'refund_vendor_total', 'refund_vendor_type', 'refund_date')
                .from('trabill_invoice_hajj_refund')
                .leftJoin('trabill_clients', { client_id: 'refund_client_id' })
                .leftJoin('trabill_combined_clients', { combine_id: 'refund_combine_id' })
                .leftJoin('trabill_accounts AS cl_acc', {
                'cl_acc.account_id': 'refund_client_acc_id',
            })
                .leftJoin('trabill_accounts AS v_acc', {
                'v_acc.account_id': 'refund_vendor_acc_id',
            })
                .where('refund_org_agency', this.org_agency)
                .andWhere('refund_invoice_id', invoice_id)
                .andWhere('refund_is_deleted', 0);
        });
    }
    getHajjInvoiceRefundItems(invoice_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .select(this.db.raw(`COALESCE(vendor_name, combine_name) AS vendor_name`), 'ritem_quantity', 'ritem_unit_price', 'ritem_client_charge', 'ritem_client_refund', 'ritem_cost_price', 'ritem_vendor_charge', 'ritem_vendor_refund')
                .from('trabill_invoice_hajj_refund')
                .leftJoin('trabill_invoice_hajj_refund_items', (event) => {
                return event
                    .on('refund_id', '=', 'ritem_refund_id')
                    .andOn(this.db.raw(`ritem_is_deleted = 0`));
            })
                .leftJoin('trabill_vendors', { vendor_id: 'ritem_vendor_id' })
                .leftJoin('trabill_combined_clients', { combine_id: 'ritem_combine_id' })
                .where('ritem_is_deleted', 0)
                .andWhere('refund_invoice_id', invoice_id);
        });
    }
    getHajiInfoByTrackingNo(tracking_no) {
        return __awaiter(this, void 0, void 0, function* () {
            const [data] = (yield this.query()
                .select('invoice_client_id', 'invoice_combined_id', 'invoice_id', 'invoice_no', this.db.raw(`COALESCE(concat('client-',invoice_client_id),concat('combined-',invoice_combined_id)) AS comb_client`))
                .from('trabill_invoice_hajj_haji_infos')
                .leftJoin('trabill_invoices', { invoice_id: 'haji_info_invoice_id' })
                .whereNot('haji_info_is_deleted', 1)
                .andWhere('hajiinfo_tracking_number', tracking_no)
                .andWhere('invoice_org_agency', this.org_agency));
            return data;
        });
    }
}
exports.default = InvoiceHajjModels;
//# sourceMappingURL=InvoiceHajj.models.js.map