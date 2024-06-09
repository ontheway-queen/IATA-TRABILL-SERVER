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
const abstract_services_1 = __importDefault(require("../../../../../abstracts/abstract.services"));
const Trxns_1 = __importDefault(require("../../../../../common/helpers/Trxns"));
const invoice_helpers_1 = require("../../../../../common/helpers/invoice.helpers");
const common_helper_1 = require("../../../../../common/helpers/common.helper");
class CommonHajjDetailsInsert extends abstract_services_1.default {
    constructor() {
        super();
        this.CommonHajjDetailsInsert = (req, invoice_id, trx) => __awaiter(this, void 0, void 0, function* () {
            const { invoice_created_by, billing_information, hotel_information, pilgrims_information, transport_info, invoice_sales_date, invoice_no, } = req.body;
            return yield this.models.db.transaction(() => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                const common_conn = this.models.CommonInvoiceModel(req, trx);
                const conn = this.models.InvoiceHajjModels(req, trx);
                const trxns = new Trxns_1.default(req, trx);
                const ctrxn_pnr = pilgrims_information[0] &&
                    pilgrims_information.map((item) => item.ticket_pnr).join(', ');
                const ctrnx_ticket_no = pilgrims_information[0] &&
                    pilgrims_information.map((item) => item.ticket_no).join(', ');
                const routes = pilgrims_information &&
                    pilgrims_information.map((item) => item.ticket_route);
                const flattenedRoutes = [].concat(...routes);
                let ctrxn_route;
                if (flattenedRoutes.length > 0) {
                    ctrxn_route = yield common_conn.getRoutesInfo(flattenedRoutes);
                }
                if ((0, invoice_helpers_1.isNotEmpty)(pilgrims_information)) {
                    for (const item of pilgrims_information) {
                        const haji_info_vouchar_no = (0, invoice_helpers_1.generateVoucherNumber)(4);
                        const pilgrimsId = item.haji_info_id;
                        const hajjHajjiInfo = {
                            hajiinfo_gender: item.hajiinfo_gender,
                            haji_info_invoice_id: invoice_id,
                            haji_info_passport_id: item.haji_info_passport_id,
                            hajiinfo_serial: item.hajiinfo_serial,
                            hajiinfo_tracking_number: item.hajiinfo_tracking_number,
                            ticket_airline_id: item.ticket_airline_id,
                            ticket_journey_date: item.ticket_journey_date,
                            ticket_no: item.ticket_no,
                            ticket_pnr: item.ticket_pnr,
                            ticket_reference_no: item.ticket_reference_no,
                            ticket_return_date: item.ticket_return_date,
                            haji_info_vouchar_no,
                        };
                        if (pilgrimsId && item.is_deleted) {
                            yield conn.dleteHajjHajiInfoRoutes(pilgrimsId, invoice_created_by);
                            yield conn.deleteHajjHajiInfoByHajiId(pilgrimsId, invoice_created_by);
                        }
                        else if (pilgrimsId) {
                            yield conn.dleteHajjHajiInfoRoutes(pilgrimsId, invoice_created_by);
                            yield conn.updateHajjHajiInfo(hajjHajjiInfo, pilgrimsId);
                            const ummrahPassengerRoutes = (_a = item === null || item === void 0 ? void 0 : item.ticket_route) === null || _a === void 0 ? void 0 : _a.map((airpot) => {
                                return { ih_haji_info_id: pilgrimsId, iu_airport_id: airpot };
                            });
                            if (ummrahPassengerRoutes === null || ummrahPassengerRoutes === void 0 ? void 0 : ummrahPassengerRoutes.length) {
                                yield conn.insertHajjHajiInfoRoutes(ummrahPassengerRoutes);
                            }
                        }
                        else {
                            const hajj_haji_id = yield conn.insertHajjHajiInfo(hajjHajjiInfo);
                            const ummrahPassengerRoutes = (_b = item === null || item === void 0 ? void 0 : item.ticket_route) === null || _b === void 0 ? void 0 : _b.map((airpot) => {
                                return { ih_haji_info_id: hajj_haji_id, iu_airport_id: airpot };
                            });
                            if (ummrahPassengerRoutes === null || ummrahPassengerRoutes === void 0 ? void 0 : ummrahPassengerRoutes.length) {
                                yield conn.insertHajjHajiInfoRoutes(ummrahPassengerRoutes);
                            }
                        }
                    }
                }
                // HOTEL INFORMATION
                if ((0, invoice_helpers_1.isNotEmpty)(hotel_information)) {
                    for (const item of hotel_information) {
                        const hotel_id = item.hotel_id;
                        const hotelData = {
                            hotel_invoice_id: invoice_id,
                            hotel_check_in_date: item.hotel_check_in_date,
                            hotel_check_out_date: item.hotel_check_out_date,
                            hotel_name: item.hotel_name,
                            hotel_reference_no: item.hotel_reference_no,
                            hotel_room_type_id: item.hotel_room_type_id,
                        };
                        if (hotel_id && item.is_deleted) {
                            yield conn.deleteInvoiceHajjHotelByHotelId(hotel_id, invoice_created_by);
                        }
                        else if (hotel_id) {
                            yield conn.updateInvoiceHajjHotelByHotelId(hotelData, hotel_id);
                        }
                        else {
                            yield conn.insertInvoiceHajjHotelInfos(hotelData);
                        }
                    }
                }
                // TRANSPORT INFORMATION
                if ((0, invoice_helpers_1.isNotEmpty)(transport_info)) {
                    for (const item of transport_info) {
                        const transport_id = item.transport_id;
                        const transportData = {
                            transport_invoice_id: invoice_id,
                            transport_dropoff_place: item.transport_dropoff_place,
                            transport_dropoff_time: item.transport_dropoff_time,
                            transport_pickup_place: item.transport_pickup_place,
                            transport_pickup_time: item.transport_pickup_time,
                            transport_type_id: item.transport_type_id,
                        };
                        if (transport_id && item.is_deleted) {
                            yield conn.deleteHajjTranportByTransportId(transport_id, invoice_created_by);
                        }
                        else if (transport_id) {
                            yield conn.updateHajjTranportByTransportId(transportData, transport_id);
                        }
                        else {
                            yield conn.insertInTransportInfos(transportData);
                        }
                    }
                }
                // BILLING & PURCHASES INFORMATION
                for (const item of billing_information) {
                    const { billing_id, is_deleted, billing_comvendor, billing_cost_price, billing_quantity, billing_product_id, billing_profit, billing_unit_price, pax_name, billing_description, } = item;
                    const billing_subtotal = billing_quantity * billing_unit_price;
                    const billingInfoData = {
                        billing_invoice_id: invoice_id,
                        billing_sales_date: invoice_sales_date,
                        billing_remaining_quantity: billing_quantity,
                        billing_cost_price,
                        billing_quantity,
                        billing_subtotal,
                        billing_product_id,
                        billing_profit,
                        billing_unit_price,
                        pax_name,
                        billing_description,
                    };
                    let VTrxnBody = null;
                    if (billing_cost_price && billing_comvendor) {
                        const billing_total_cost = billing_cost_price * billing_quantity;
                        const { combined_id, vendor_id } = (0, common_helper_1.separateCombClientToId)(billing_comvendor);
                        billingInfoData.billing_vendor_id = vendor_id;
                        billingInfoData.billing_combined_id = combined_id;
                        VTrxnBody = {
                            comb_vendor: billing_comvendor,
                            vtrxn_amount: billing_total_cost,
                            vtrxn_created_at: invoice_sales_date,
                            vtrxn_note: billing_description,
                            vtrxn_particular_id: 152,
                            vtrxn_particular_type: 'Invoice hajj create',
                            vtrxn_pax: pax_name,
                            vtrxn_type: combined_id ? 'CREDIT' : 'DEBIT',
                            vtrxn_user_id: invoice_created_by,
                            vtrxn_voucher: invoice_no,
                            vtrxn_airticket_no: ctrnx_ticket_no,
                            vtrxn_pnr: ctrxn_pnr,
                            vtrxn_route: ctrxn_route,
                        };
                    }
                    if (billing_id) {
                        const previousBillingInfo = yield conn.getHajiBillingInfoByBillingId(billing_id);
                        // DELETE BILLING INFORMATION
                        if (is_deleted) {
                            yield conn.deleteBillingInfosByBillingId(billing_id, invoice_created_by);
                            yield trxns.deleteInvVTrxn([previousBillingInfo]);
                        }
                        else if (VTrxnBody) {
                            if (previousBillingInfo === null || previousBillingInfo === void 0 ? void 0 : previousBillingInfo.prevTrxnId) {
                                yield trxns.VTrxnUpdate(Object.assign(Object.assign({}, VTrxnBody), { trxn_id: previousBillingInfo === null || previousBillingInfo === void 0 ? void 0 : previousBillingInfo.prevTrxnId }));
                                billingInfoData.billing_vtrxn_id =
                                    previousBillingInfo === null || previousBillingInfo === void 0 ? void 0 : previousBillingInfo.prevTrxnId;
                            }
                            else {
                                billingInfoData.billing_vtrxn_id = yield trxns.VTrxnInsert(VTrxnBody);
                            }
                            yield conn.updateBillingInfosByBillingId(billingInfoData, billing_id);
                        }
                        else {
                            billingInfoData.billing_vendor_id = null;
                            billingInfoData.billing_combined_id = null;
                            billingInfoData.billing_vtrxn_id = null;
                            billingInfoData.billing_cost_price = 0;
                            yield trxns.deleteVTrxn(previousBillingInfo === null || previousBillingInfo === void 0 ? void 0 : previousBillingInfo.prevTrxnId, previousBillingInfo === null || previousBillingInfo === void 0 ? void 0 : previousBillingInfo.prevComvendor);
                            yield conn.updateBillingInfosByBillingId(billingInfoData, billing_id);
                        }
                    }
                    else {
                        if (VTrxnBody) {
                            billingInfoData.billing_vtrxn_id = yield trxns.VTrxnInsert(VTrxnBody);
                        }
                        yield conn.insertInBillingInfos(billingInfoData);
                    }
                }
            }));
        });
    }
}
exports.default = CommonHajjDetailsInsert;
//# sourceMappingURL=CommonHajjDetailsInsert.js.map