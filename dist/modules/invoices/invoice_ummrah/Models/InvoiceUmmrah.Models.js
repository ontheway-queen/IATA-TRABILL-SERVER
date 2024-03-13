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
const customError_1 = __importDefault(require("../../../../common/utils/errors/customError"));
class InvoiceUmmrah extends abstract_models_1.default {
    constructor() {
        super(...arguments);
        this.insertUmmrahPassengerInfo = (data) => __awaiter(this, void 0, void 0, function* () {
            const [passenger_id] = yield this.query()
                .insert(data)
                .into('trabill_invoice_umrah_passenger_info');
            return passenger_id;
        });
        this.updateUmmrahPassengerInfo = (data, passenger_id) => __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update(data)
                .into('trabill_invoice_umrah_passenger_info')
                .where('passenger_id', passenger_id);
            return passenger_id;
        });
        this.deleteUmmrahPassenger = (passenger_id, passenger_deleted_by) => __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update({ passenger_is_deleted: 1, passenger_deleted_by })
                .into('trabill_invoice_umrah_passenger_info')
                .where('passenger_id', passenger_id);
            return passenger_id;
        });
        this.deleteUmmrahPassengerRoutes = (iu_passenger_id, iu_deleted_by) => __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update({ iu_is_deleted: 1, iu_deleted_by })
                .into('trabill_invoice_umrah_passenger_routes')
                .where('iu_passenger_id', iu_passenger_id);
        });
        this.deleteUmmrahRoutesByInvoiceId = (invoiceId, deleted_by) => __awaiter(this, void 0, void 0, function* () {
            const passenger_id = yield this.query()
                .select('passenger_id')
                .from('trabill_invoice_umrah_passenger_info')
                .where('passenger_invoice_id', invoiceId)
                .andWhereNot('passenger_is_deleted', 1);
            for (const item of passenger_id) {
                yield this.query()
                    .update({ iu_is_deleted: 1, iu_deleted_by: deleted_by })
                    .into('trabill_invoice_umrah_passenger_routes')
                    .where('iu_passenger_id', item.passenger_id);
            }
        });
        this.insertUmmrahPassengerRoutes = (data) => __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .insert(data)
                .into('trabill_invoice_umrah_passenger_routes');
        });
        this.getIUmmrahPassengerInfos = (invoiceId) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select('passenger_id', 'passenger_passport_id', 'passenger_tracking_number', 'ticket_pnr', 'ticket_airline_id', 'ticket_no', 'ticket_reference_no', 'ticket_journey_date', 'ticket_return_date')
                .from('trabill_invoice_umrah_passenger_info')
                .where('passenger_invoice_id', invoiceId)
                .andWhereNot('passenger_is_deleted', 1);
            let dataForReturn = [];
            for (const item of data) {
                const airlineId = yield this.query()
                    .select('iu_airport_id')
                    .from('trabill_invoice_umrah_passenger_routes')
                    .where('iu_passenger_id', item.passenger_id)
                    .andWhereNot('iu_is_deleted', 1);
                const ticket_route = airlineId.map((item) => item.iu_airport_id);
                dataForReturn.push(Object.assign(Object.assign({}, item), { ticket_route }));
            }
            return dataForReturn;
        });
        this.viewIUmmrahPassengerInfos = (invoiceId) => __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .select('passenger_passport_id', 'passenger_tracking_number', 'passport_passport_no', 'passport_name', 'passport_mobile_no', 'passport_email', 'passport_date_of_birth', 'passport_date_of_issue', 'passport_date_of_expire', 'ticket_pnr', 'ticket_airline_id', 'ticket_no', 'ticket_reference_no', 'ticket_journey_date', 'ticket_return_date')
                .from('trabill_invoice_umrah_passenger_info')
                .where('passenger_invoice_id', invoiceId)
                .andWhereNot('passenger_is_deleted', 1)
                .leftJoin('trabill_passport_details', 'trabill_invoice_umrah_passenger_info.passenger_passport_id', 'trabill_passport_details.passport_id');
        });
        this.deletePassengerInfo = (invoiceId, passenger_deleted_by) => __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update({ passenger_is_deleted: 1, passenger_deleted_by })
                .into('trabill_invoice_umrah_passenger_info')
                .where('passenger_invoice_id', invoiceId);
        });
        // @INVOICE_UMMRAH_HOTEL_INFOS
        this.insertIUHotelInfos = (data) => __awaiter(this, void 0, void 0, function* () {
            const hotel_id = yield this.query()
                .insert(data)
                .into('trabill_invoice_umrah_hotel_infos');
            return hotel_id[0];
        });
        this.updateIUHotelInfo = (data, hotelId) => __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update(data)
                .into('trabill_invoice_umrah_hotel_infos')
                .where('hotel_id', hotelId);
        });
        this.deleteIUHotelInfo = (hotelId, hotel_deleted_by) => __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update({ hotel_is_deleted: 1, hotel_deleted_by })
                .into('trabill_invoice_umrah_hotel_infos')
                .where('hotel_id', hotelId);
        });
        this.getIUHotelInfos = (invoiceId) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select('hotel_id', 'hotel_name', 'hotel_check_in_date', 'hotel_check_out_date', 'hotel_room_type_id', 'rtype_name as hotel_room_type')
                .from('trabill_invoice_umrah_hotel_infos')
                .leftJoin('trabill_room_types', { rtype_id: 'hotel_room_type_id' })
                .where('hotel_invoice_id', invoiceId)
                .andWhereNot('hotel_is_deleted', 1);
            return data;
        });
        this.deleteIUHotelInfosByInvoiceId = (invoiceId, hotel_deleted_by) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .update({ hotel_is_deleted: 1, hotel_deleted_by })
                .into('trabill_invoice_umrah_hotel_infos')
                .where('hotel_invoice_id', invoiceId);
            return data;
        });
        // @INVOICE_UMMRAH_BILLING_INFOS
        this.insertIUBillingInfos = (data) => __awaiter(this, void 0, void 0, function* () {
            const billing_id = yield this.query()
                .insert(data)
                .into('trabill_invoice_umrah_billing_infos');
            return billing_id[0];
        });
        this.updateIUBillingInfo = (data, billing_id) => __awaiter(this, void 0, void 0, function* () {
            return yield this.db('trabill_invoice_umrah_billing_infos')
                .update(data)
                .where('billing_id', billing_id);
        });
        this.getIUBillingInfos = (invoiceId, view) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select(view ? 'vendor_name' : 'billing_vendor_id', 'billing_combined_id', 'pax_name', 'billing_quantity', 'billing_unit_price', 'billing_subtotal', 'billing_cost_price', 'billing_profit', view ? 'product_name' : 'billing_product_id')
                .from('trabill_invoice_umrah_billing_infos')
                .where('billing_invoice_id', invoiceId)
                .andWhereNot('billing_is_deleted', 1)
                .leftJoin('trabill_vendors', { vendor_id: 'billing_vendor_id' })
                .leftJoin('trabill_products', { billing_product_id: 'product_id' });
            return data;
        });
        this.getPrevIUBilling = (invoiceId) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select('billing_combined_id as combined_id', 'billing_vendor_id as vendor_id', this.db.raw('billing_cost_price * billing_quantity as prev_cost_price'), 'billing_vtrxn_id as prevTrxnId')
                .from('trabill_invoice_umrah_billing_infos')
                .where('billing_invoice_id', invoiceId)
                .andWhereNot('billing_is_deleted', 1);
            return data;
        });
        this.getUmrahBillingInfo = (billing_id) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select('billing_combined_id as combined_id', 'billing_vendor_id as vendor_id', this.db.raw('billing_cost_price * billing_quantity as prev_cost_price'), 'billing_vtrxn_id as prevTrxnId', this.db.raw(`CASE WHEN billing_vendor_id IS NOT NULL THEN CONCAT('vendor-', billing_vendor_id) ELSE CONCAT('combined-', billing_combined_id) END AS prevComvendor`))
                .from('trabill_invoice_umrah_billing_infos')
                .where('billing_id', billing_id)
                .andWhereNot('billing_is_deleted', 1);
            return data;
        });
        this.getForEditBilling = (invoiceId) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select('billing_id', this.db.raw("CASE WHEN billing_vendor_id IS NOT NULL THEN CONCAT('vendor-',billing_vendor_id) ELSE CONCAT('combined-',billing_combined_id) END AS billing_comvendor"), 'pax_name', 'billing_description', 'billing_product_id', 'billing_quantity', 'billing_unit_price', 'billing_subtotal', 'billing_cost_price', 'billing_profit')
                .from('trabill_invoice_umrah_billing_infos')
                .where('billing_invoice_id', invoiceId)
                .andWhereNot('billing_is_deleted', 1);
            return data;
        });
        this.deleteIUBillingInfos = (invoiceId, billing_deleted_by) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .update({ billing_is_deleted: 1, billing_deleted_by })
                .into('trabill_invoice_umrah_billing_infos')
                .where('billing_invoice_id', invoiceId);
            return data;
        });
        this.deleteIUSingleBilling = (billing_id, billing_deleted_by) => __awaiter(this, void 0, void 0, function* () {
            if (!billing_id) {
                throw new customError_1.default('please valid billing ID', 400, 'Bad ID');
            }
            return yield this.query()
                .update({ billing_is_deleted: 1, billing_deleted_by })
                .into('trabill_invoice_umrah_billing_infos')
                .where('billing_id', billing_id);
        });
    }
    createUmmrahRefund(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const [id] = yield this.query()
                .insert(data)
                .into('trabill_invoice_ummrah_refund');
            return id;
        });
    }
    createUmmrahRefundItems(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .insert(data)
                .into('trabill_invoice_ummrah_refund_items');
        });
    }
    updateUmmrahBillingRemainingQuantity(billing_id, refund_quantity) {
        return __awaiter(this, void 0, void 0, function* () {
            const [{ billing_remaining_quantity }] = (yield this.query()
                .select('billing_remaining_quantity')
                .from('trabill_invoice_umrah_billing_infos')
                .where({ billing_id }));
            const remaining_quantity = Number(billing_remaining_quantity) - refund_quantity;
            return yield this.query()
                .update({
                billing_remaining_quantity: remaining_quantity,
                billing_is_refund: remaining_quantity == 0 ? 1 : 0,
            })
                .into('trabill_invoice_umrah_billing_infos')
                .where({ billing_id });
        });
    }
    updateUmmrahInvoiceIsRefund(invoice_id, is_refund) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = (yield this.query()
                .select('billing_id')
                .from('trabill_invoice_umrah_billing_infos')
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
    getBillingInfo(invoice_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .select('billing_id', this.db.raw(`COALESCE(concat('client-', invoice_client_id), concat('combined-', invoice_combined_id)) AS comb_client`), this.db.raw(`COALESCE(concat('vendor-', billing_vendor_id), concat('combined-', billing_combined_id)) AS comb_vendor`), 'billing_product_id', 'product_name', 'billing_quantity', 'billing_remaining_quantity', 'billing_unit_price', 'billing_subtotal', 'billing_cost_price', 'billing_profit')
                .from('trabill_invoice_umrah_billing_infos')
                .leftJoin('trabill_products', { product_id: 'billing_product_id' })
                .leftJoin('trabill_invoices', {
                'trabill_invoices.invoice_id': 'billing_invoice_id',
            })
                .where('billing_invoice_id', invoice_id)
                .andWhereNot('billing_is_deleted', 1)
                .andWhereNot('billing_is_refund', 1);
        });
    }
    getUmmrahRefund(invoice_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .select('refund_id', this.db.raw(`COALESCE(client_name, combine_name) AS client_name`), 'refund_voucher_no', 'refund_client_total', 'refund_client_type', 'refund_client_payment_method', 'refund_client_acc_id', 'cl_acc.account_name AS client_account_name', 'v_acc.account_name AS vendor_account_name', 'refund_vendor_total', 'refund_vendor_type', 'refund_date')
                .from('trabill_invoice_ummrah_refund')
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
    getUmmrahRefundItems(invoice_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .select(this.db.raw(`COALESCE(vendor_name, combine_name) AS vendor_name`), 'ritem_quantity', 'ritem_unit_price', 'ritem_client_charge', 'ritem_client_refund', 'ritem_cost_price', 'ritem_vendor_charge', 'ritem_vendor_refund')
                .from('trabill_invoice_ummrah_refund')
                .leftJoin('trabill_invoice_ummrah_refund_items', (event) => {
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
}
exports.default = InvoiceUmmrah;
//# sourceMappingURL=InvoiceUmmrah.Models.js.map