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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateTotalProfit = void 0;
const Trxns_1 = __importDefault(require("../../../../common/helpers/Trxns"));
const common_helper_1 = require("../../../../common/helpers/common.helper");
const invoice_helpers_1 = require("../../../../common/helpers/invoice.helpers");
const calculateTotalProfit = (tourBilling) => __awaiter(void 0, void 0, void 0, function* () {
    let invoice_total_profit = 0;
    tourBilling === null || tourBilling === void 0 ? void 0 : tourBilling.map((item) => {
        if (item.billing_profit) {
            invoice_total_profit += Number(item.billing_profit);
        }
    });
    return invoice_total_profit;
});
exports.calculateTotalProfit = calculateTotalProfit;
/**
 * addVendorCostBilling
 */
class InvoiceTourHelpers {
}
_a = InvoiceTourHelpers;
InvoiceTourHelpers.addVendorCostBilling = (req, conn, invoice_id, trx) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d, _e;
    const trxns = new Trxns_1.default(req, trx);
    const { tourTransports, tourFoods, tourAccms, tourBilling, tourOtherTrans, invoice_created_by, guide_id, guide_comvendor_id, guide_cost_price, guide_description, guide_itinerary_id, guide_is_deleted, ticket_id, ticket_comvendor_id, ticket_cost_price, ticket_description, ticket_itinerary_id, ticket_no, ticket_route, ticket_airline_id, ticket_pnr, ticket_journey_date, ticket_return_date, ticket_is_deleted, invoice_sales_date, invoice_no, } = req.body;
    // tour_transport
    if ((0, invoice_helpers_1.isNotEmpty)(tourTransports)) {
        const ctrxn_pax = tourBilling
            .map((item) => item.billing_pax_name)
            .join(' ,');
        for (const item of tourTransports) {
            const { transport_id, transport_comvendor_id, transport_cost_price, transport_description, transport_itinerary_id, transport_type_id, transport_picup_place, transport_picup_time, transport_dropoff_place, transport_dropoff_time, transport_is_deleted, } = item;
            const { combined_id, vendor_id } = (0, common_helper_1.separateCombClientToId)(transport_comvendor_id);
            let previousBillingInfo = [];
            if (transport_id) {
                previousBillingInfo = yield conn.getTransportData(transport_id);
            }
            const VTrxnBody = {
                comb_vendor: transport_comvendor_id,
                vtrxn_amount: transport_cost_price,
                vtrxn_created_at: invoice_sales_date,
                vtrxn_note: transport_description,
                vtrxn_particular_id: 155,
                vtrxn_particular_type: 'Invoice Tour Create',
                vtrxn_pax: ctrxn_pax,
                vtrxn_type: combined_id ? 'CREDIT' : 'DEBIT',
                vtrxn_user_id: invoice_created_by,
                vtrxn_voucher: invoice_no,
                vtrxn_pnr: ticket_pnr,
                vtrxn_airticket_no: ticket_no,
            };
            const transportData = {
                transport_cost_price,
                transport_description,
                transport_itinerary_id,
                transport_vendor_id: vendor_id,
                transport_combined_id: combined_id,
                transport_invoice_id: invoice_id,
                transport_type_id,
                transport_picup_place,
                transport_picup_time,
                transport_dropoff_place,
                transport_dropoff_time,
            };
            if (transport_is_deleted && transport_id) {
                yield conn.deleteTourTransport(transport_id, invoice_created_by);
                yield trxns.deleteInvVTrxn(previousBillingInfo);
            }
            if (!transport_id) {
                const transport_vtrxnid = yield trxns.VTrxnInsert(VTrxnBody);
                yield conn.insertTourTransport(Object.assign(Object.assign({}, transportData), { transport_vtrxnid }));
            }
            else {
                yield trxns.VTrxnUpdate(Object.assign(Object.assign({}, VTrxnBody), { trxn_id: (_b = previousBillingInfo[0]) === null || _b === void 0 ? void 0 : _b.prevTrxnId }));
                yield conn.updateTourTransport(transportData, transport_id);
            }
        }
    }
    // FOODS
    if ((0, invoice_helpers_1.isNotEmpty)(tourFoods)) {
        const ctrxn_pax = tourBilling
            .map((item) => item.billing_pax_name)
            .join(' ,');
        for (const item of tourFoods) {
            const { food_id, food_comvendor_id, food_cost_price, food_description, food_itinerary_id, food_menu, food_place, food_time, food_is_deleted, } = item;
            const { combined_id, vendor_id } = (0, common_helper_1.separateCombClientToId)(food_comvendor_id);
            let prevFoodBillingInfo = [];
            if (food_id) {
                prevFoodBillingInfo = yield conn.getTourFoodInfo(food_id);
            }
            const foodData = {
                food_combined_id: combined_id,
                food_vendor_id: vendor_id,
                food_cost_price,
                food_description,
                food_itinerary_id,
                food_invoice_id: invoice_id,
                food_menu,
                food_place,
                food_time,
            };
            const VTrxnBody = {
                comb_vendor: food_comvendor_id,
                vtrxn_amount: food_cost_price,
                vtrxn_created_at: invoice_sales_date,
                vtrxn_note: food_description,
                vtrxn_particular_id: 156,
                vtrxn_particular_type: 'Invoice Tour Create',
                vtrxn_pax: ctrxn_pax,
                vtrxn_type: combined_id ? 'CREDIT' : 'DEBIT',
                vtrxn_user_id: invoice_created_by,
                vtrxn_voucher: invoice_no,
                vtrxn_pnr: ticket_pnr,
                vtrxn_airticket_no: ticket_no,
            };
            if (food_is_deleted && food_id) {
                yield conn.deleteTourFoods(food_id, invoice_created_by);
                yield trxns.deleteInvVTrxn(prevFoodBillingInfo);
            }
            if (!food_id) {
                const food_vtrxnid = yield trxns.VTrxnInsert(VTrxnBody);
                yield conn.insertTourFoods(Object.assign(Object.assign({}, foodData), { food_vtrxnid }));
            }
            else {
                yield trxns.VTrxnUpdate(Object.assign(Object.assign({}, VTrxnBody), { trxn_id: prevFoodBillingInfo[0].prevTrxnId }));
                yield conn.updateTourFoods(foodData, food_id);
            }
        }
    }
    // ACCOMMODATION
    if ((0, invoice_helpers_1.isNotEmpty)(tourAccms)) {
        const ctrxn_pax = tourBilling
            .map((item) => item.billing_pax_name)
            .join(' ,');
        for (const item of tourAccms) {
            const { accm_id, accm_comvendor_id, accm_cost_price, accm_description, accm_itinerary_id, accm_room_type_id, accm_place, accm_num_of_room, accm_checkin_date, accm_checkout_date, accm_is_deleted, } = item;
            const { combined_id, vendor_id } = (0, common_helper_1.separateCombClientToId)(accm_comvendor_id);
            let prevTourAccmBilling = [];
            if (accm_id) {
                prevTourAccmBilling = yield conn.getTourAccmInfo(accm_id);
            }
            const accmData = {
                accm_invoice_id: invoice_id,
                accm_combined_id: combined_id,
                accm_vendor_id: vendor_id,
                accm_cost_price,
                accm_description,
                accm_itinerary_id,
                accm_room_type_id,
                accm_place,
                accm_num_of_room,
                accm_checkin_date,
                accm_checkout_date,
            };
            const VTrxnBody = {
                comb_vendor: accm_comvendor_id,
                vtrxn_amount: accm_cost_price,
                vtrxn_created_at: invoice_sales_date,
                vtrxn_note: accm_description,
                vtrxn_particular_id: 157,
                vtrxn_particular_type: 'Invoice Tour Create',
                vtrxn_pax: ctrxn_pax,
                vtrxn_type: combined_id ? 'CREDIT' : 'DEBIT',
                vtrxn_user_id: invoice_created_by,
                vtrxn_voucher: invoice_no,
                vtrxn_pnr: ticket_pnr,
                vtrxn_airticket_no: ticket_no,
            };
            if (accm_is_deleted && accm_id) {
                yield conn.deleteTourAccm(accm_id, invoice_created_by);
                yield trxns.deleteInvVTrxn(prevTourAccmBilling);
            }
            if (!accm_id) {
                const accm_vtrxnid = yield trxns.VTrxnInsert(VTrxnBody);
                yield conn.insertTourAccm(Object.assign(Object.assign({}, accmData), { accm_vtrxnid }));
            }
            else {
                yield trxns.VTrxnUpdate(Object.assign(Object.assign({}, VTrxnBody), { trxn_id: prevTourAccmBilling[0].prevTrxnId }));
                yield conn.updateTourAccm(accmData, accm_id);
            }
        }
    }
    // OTHER TRANSPORT
    if ((0, invoice_helpers_1.isNotEmpty)(tourOtherTrans)) {
        const ctrxn_pax = tourBilling
            .map((item) => item.billing_pax_name)
            .join(' ,');
        for (const item of tourOtherTrans) {
            const { other_trans_id, other_trans_comvendor_id, other_trans_cost_price, other_trans_description, other_trans_itinerary_id, other_trans_is_deleted, } = item;
            const { combined_id, vendor_id } = (0, common_helper_1.separateCombClientToId)(other_trans_comvendor_id);
            let prevOtherTransInfo = [];
            if (other_trans_id) {
                prevOtherTransInfo = yield conn.getTourOtherTransportInfo(other_trans_id);
            }
            const VTrxnBody = {
                comb_vendor: other_trans_comvendor_id,
                vtrxn_amount: other_trans_cost_price,
                vtrxn_created_at: invoice_sales_date,
                vtrxn_note: other_trans_description,
                vtrxn_particular_id: 158,
                vtrxn_particular_type: 'Invoice Tour Create',
                vtrxn_pax: ctrxn_pax,
                vtrxn_type: combined_id ? 'CREDIT' : 'DEBIT',
                vtrxn_user_id: invoice_created_by,
                vtrxn_voucher: invoice_no,
                vtrxn_pnr: ticket_pnr,
                vtrxn_airticket_no: ticket_no,
            };
            const otherTrans = {
                other_trans_invoice_id: invoice_id,
                other_trans_combined_id: combined_id,
                other_trans_vendor_id: vendor_id,
                other_trans_cost_price,
                other_trans_description,
                other_trans_itinerary_id,
            };
            if (other_trans_is_deleted && other_trans_id) {
                yield conn.deleteTourOtherTrans(other_trans_id, invoice_created_by);
                yield trxns.deleteInvVTrxn(prevOtherTransInfo);
            }
            if (!other_trans_id) {
                const other_trans_vtrxnid = yield trxns.VTrxnInsert(VTrxnBody);
                yield conn.insertTourOtherTrans(Object.assign(Object.assign({}, otherTrans), { other_trans_vtrxnid }));
            }
            else {
                yield trxns.VTrxnUpdate(Object.assign(Object.assign({}, VTrxnBody), { trxn_id: (_c = prevOtherTransInfo[0]) === null || _c === void 0 ? void 0 : _c.prevTrxnId }));
                yield conn.updateTourOtherTrans(otherTrans, other_trans_id);
            }
        }
    }
    // TOUR GUIDE
    if (guide_comvendor_id) {
        const ctrxn_pax = tourBilling
            .map((item) => item.billing_pax_name)
            .join(' ,');
        const { combined_id, vendor_id } = (0, common_helper_1.separateCombClientToId)(guide_comvendor_id);
        let prevGuideBillingInfo = [];
        if (guide_id) {
            prevGuideBillingInfo = yield conn.getTourGuideInfo(guide_id);
        }
        const VTrxnBody = {
            comb_vendor: guide_comvendor_id,
            vtrxn_amount: guide_cost_price,
            vtrxn_created_at: invoice_sales_date,
            vtrxn_note: guide_description,
            vtrxn_particular_id: 159,
            vtrxn_particular_type: 'Invoice Tour Create',
            vtrxn_pax: ctrxn_pax,
            vtrxn_type: combined_id ? 'CREDIT' : 'DEBIT',
            vtrxn_user_id: invoice_created_by,
            vtrxn_voucher: invoice_no,
            vtrxn_pnr: ticket_pnr,
            vtrxn_airticket_no: ticket_no,
        };
        const guideData = {
            guide_combined_id: combined_id,
            guide_vendor_id: vendor_id,
            guide_cost_price,
            guide_invoice_id: invoice_id,
            guide_description,
            guide_itinerary_id,
        };
        if (guide_is_deleted && guide_id) {
            yield conn.deleteTourGuide(guide_id, invoice_created_by);
            yield trxns.deleteInvVTrxn(prevGuideBillingInfo);
        }
        if (!guide_id) {
            const guide_vtrxnid = yield trxns.VTrxnInsert(VTrxnBody);
            yield conn.insertTourGuide(Object.assign(Object.assign({}, guideData), { guide_vtrxnid }));
        }
        else {
            yield trxns.VTrxnUpdate(Object.assign(Object.assign({}, VTrxnBody), { trxn_id: (_d = prevGuideBillingInfo[0]) === null || _d === void 0 ? void 0 : _d.prevTrxnId }));
            yield conn.updateTourGuide(guideData, guide_id);
        }
    }
    // TOUR TICKET
    if (ticket_comvendor_id) {
        const ctrxn_pax = tourBilling
            .map((item) => item.billing_pax_name)
            .join(' ,');
        const { combined_id, vendor_id } = (0, common_helper_1.separateCombClientToId)(ticket_comvendor_id);
        let prevTourTicketInfo = [];
        if (ticket_id) {
            prevTourTicketInfo = yield conn.getSignleTourTicketInfo(ticket_id);
        }
        const VTrxnBody = {
            comb_vendor: ticket_comvendor_id,
            vtrxn_amount: ticket_cost_price,
            vtrxn_created_at: invoice_sales_date,
            vtrxn_note: ticket_description,
            vtrxn_particular_id: 159,
            vtrxn_particular_type: 'Invoice Tour Create',
            vtrxn_pax: ctrxn_pax,
            vtrxn_type: combined_id ? 'CREDIT' : 'DEBIT',
            vtrxn_user_id: invoice_created_by,
            vtrxn_voucher: invoice_no,
            vtrxn_pnr: ticket_pnr,
            vtrxn_airticket_no: ticket_no,
        };
        const ticketData = {
            ticket_invoice_id: invoice_id,
            ticket_combined_id: combined_id,
            ticket_vendor_id: vendor_id,
            ticket_cost_price,
            ticket_description,
            ticket_itinerary_id,
            ticket_airline_id,
            ticket_no,
            ticket_pnr,
            ticket_journey_date,
            ticket_return_date,
        };
        if (ticket_is_deleted && ticket_id) {
            yield conn.deleteTourTicketInfo(ticket_id, invoice_created_by);
            yield trxns.deleteInvVTrxn(prevTourTicketInfo);
        }
        if (!ticket_id) {
            const ticket_vtrxnid = yield trxns.VTrxnInsert(VTrxnBody);
            yield conn.insertTourTicketInfo(Object.assign(Object.assign({}, ticketData), { ticket_vtrxnid }));
        }
        else {
            yield trxns.VTrxnUpdate(Object.assign(Object.assign({}, VTrxnBody), { trxn_id: (_e = prevTourTicketInfo[0]) === null || _e === void 0 ? void 0 : _e.prevTrxnId }));
            yield conn.updateTourTicketInfo(ticketData, ticket_id);
        }
        // delete previous route id
        yield conn.deletePrevAirticketRoute(invoice_id, invoice_created_by);
        // insert new airticket route
        if ((0, invoice_helpers_1.isNotEmpty)(ticket_route)) {
            const ticketRoute = [];
            ticket_route.forEach((element) => {
                ticketRoute.push({
                    airoute_invoice_id: invoice_id,
                    airoute_route_sector_id: element,
                });
            });
            yield conn.insertAirticketRoute(ticketRoute);
        }
    }
    // BILLING
    if ((0, invoice_helpers_1.isNotEmpty)(tourBilling)) {
        for (const item of tourBilling) {
            const { billing_id, billing_cost_price, billing_product_id, billing_profit, billing_pax_name, billing_country_id, billing_numof_room, billing_total_pax, billing_total_sales, is_deleted, } = item;
            const tourBillingData = {
                billing_cost_price,
                billing_product_id,
                billing_profit,
                billing_pax_name,
                billing_country_id,
                billing_numof_room,
                billing_total_pax,
                billing_total_sales,
                billing_invoice_id: invoice_id,
            };
            if (is_deleted && billing_id) {
                yield conn.deleteTourBilling(billing_id, invoice_created_by);
            }
            if (!billing_id) {
                yield conn.insertTourBilling(tourBillingData);
            }
            else {
                yield conn.updateTourBilling(tourBillingData, billing_id);
            }
        }
    }
});
exports.default = InvoiceTourHelpers;
//# sourceMappingURL=invoicetour.helpers.js.map