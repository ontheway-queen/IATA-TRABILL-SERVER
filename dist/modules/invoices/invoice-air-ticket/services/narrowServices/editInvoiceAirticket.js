"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_services_1 = __importDefault(require("../../../../../abstracts/abstract.services"));
const common_helper_1 = require("../../../../../common/helpers/common.helper");
const invoice_helpers_1 = __importStar(require("../../../../../common/helpers/invoice.helpers"));
const Trxns_1 = __importDefault(require("../../../../../common/helpers/Trxns"));
const lib_1 = require("../../../../../common/utils/libraries/lib");
const invoice_utils_1 = require("../../../utils/invoice.utils");
class EditInvoiceAirticket extends abstract_services_1.default {
    constructor() {
        super();
        this.editInvoiceAirTicket = (req) => __awaiter(this, void 0, void 0, function* () {
            const { invoice_info, ticketInfo } = req.body;
            const { invoice_combclient_id, invoice_created_by, invoice_net_total, invoice_sales_date, invoice_due_date, invoice_sales_man_id, invoice_sub_total, invoice_note, invoice_vat, invoice_service_charge, invoice_discount, invoice_agent_id, invoice_agent_com_amount, invoice_show_discount, invoice_show_passport_details, invoice_show_prev_due, invoice_show_unit, invoice_no, invoice_walking_customer_name, invoice_reference, } = invoice_info;
            let invoice_total_profit = 0;
            let invoice_total_vendor_price = 0;
            for (const { ticket_details } of ticketInfo) {
                const vendor = ticket_details.airticket_comvendor;
                invoice_total_profit += ticket_details.airticket_profit;
                invoice_total_vendor_price += ticket_details.airticket_purchase_price;
                yield (0, invoice_helpers_1.ValidateClientAndVendor)(invoice_combclient_id, vendor);
            }
            // VALIDATE CLIENT AND VENDOR
            for (const ticket of ticketInfo) {
                const vendor = ticket.ticket_details.airticket_comvendor;
                yield (0, invoice_helpers_1.ValidateClientAndVendor)(invoice_combclient_id, vendor);
            }
            // CLIENT AND COMBINED CLIENT
            const { invoice_client_id, invoice_combined_id } = (0, invoice_helpers_1.getClientOrCombId)(invoice_combclient_id);
            const invoice_id = Number(req.params.invoice_id);
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c, _d, _e;
                const conn = this.models.invoiceAirticketModel(req, trx);
                const common_conn = this.models.CommonInvoiceModel(req, trx);
                const utils = new invoice_utils_1.InvoiceUtils(invoice_info, common_conn);
                const trxns = new Trxns_1.default(req, trx);
                // CLIENT COMBINED TRANSACTIONS
                const { prevCtrxnId, prevClChargeTransId } = yield common_conn.getPreviousInvoices(invoice_id);
                const ctrxn_pnr = ticketInfo === null || ticketInfo === void 0 ? void 0 : ticketInfo.map((item) => item.ticket_details.airticket_pnr);
                const ticket_no = ticketInfo[0] &&
                    ticketInfo
                        .map((item) => item.ticket_details.airticket_ticket_no)
                        .join(', ');
                const routes = ticketInfo === null || ticketInfo === void 0 ? void 0 : ticketInfo.map((item) => { var _a; return (_a = item === null || item === void 0 ? void 0 : item.ticket_details) === null || _a === void 0 ? void 0 : _a.airticket_route_or_sector; });
                const uniqueRoutes = [
                    ...new Set(routes
                        .filter((route) => route !== undefined)
                        .map((route) => JSON.stringify(route))),
                ].map((route) => JSON.parse(route));
                let ctrxn_route = '';
                for (const iterator of uniqueRoutes) {
                    const route = yield common_conn.getRoutesInfo(iterator);
                    ctrxn_route += route + '\n';
                }
                // CLIENT TRANSACTIONS
                const clientTransId = yield utils.updateClientTrans(trxns, {
                    ctrxn_pnr: (0, lib_1.uniqueArrJoin)(ctrxn_pnr),
                    ctrxn_route: ctrxn_route,
                    tr_type: 1,
                    dis_tr_type: 2,
                    invoice_no,
                    prevClChargeTransId,
                    prevCtrxnId,
                    ticket_no,
                });
                // AGENT TRANSACTION
                if (invoice_agent_id) {
                    yield invoice_helpers_1.default.invoiceAgentTransactions(this.models.agentProfileModel(req, trx), req.agency_id, invoice_agent_id, invoice_id, invoice_no, invoice_created_by, invoice_agent_com_amount, 'UPDATE', 91, 'INVOICE AIR TICKET');
                }
                else {
                    yield invoice_helpers_1.default.deleteAgentTransactions(this.models.agentProfileModel(req, trx), invoice_id, invoice_created_by);
                }
                // INVOICE INFORMATION UPDATE
                const invoice_information = Object.assign(Object.assign({}, clientTransId), { invoice_client_id,
                    invoice_sub_total,
                    invoice_sales_man_id,
                    invoice_net_total,
                    invoice_sales_date,
                    invoice_due_date, invoice_updated_by: invoice_created_by, invoice_note,
                    invoice_combined_id,
                    invoice_walking_customer_name,
                    invoice_reference,
                    invoice_total_profit,
                    invoice_total_vendor_price });
                yield common_conn.updateInvoiceInformation(invoice_id, invoice_information);
                const invoiceExtraAmount = {
                    extra_amount_invoice_id: invoice_id,
                    invoice_vat,
                    invoice_service_charge,
                    invoice_discount,
                    invoice_agent_id,
                    invoice_agent_com_amount,
                };
                yield common_conn.updateInvoiceExtraAmount(invoiceExtraAmount, invoice_id);
                const invoicePreData = {
                    airticket_invoice_id: invoice_id,
                    invoice_show_discount,
                    invoice_show_passport_details,
                    invoice_show_prev_due,
                    invoice_show_unit,
                };
                yield common_conn.updateAirticketPreData(invoicePreData, invoice_id);
                // DELETE PREVIOUS TAXES COMMISSION
                yield conn.deleteAirTicketAirlineCommissions(invoice_id);
                // air tickets
                for (const ticket of ticketInfo) {
                    const { flight_details, pax_passports, ticket_details, taxes_commission, total_taxes_commission, } = ticket;
                    const { airticket_id, is_deleted, airticket_comvendor, airticket_route_or_sector, airticket_purchase_price, airticket_ticket_no, airticket_pnr } = ticket_details, restAirticketData = __rest(ticket_details, ["airticket_id", "is_deleted", "airticket_comvendor", "airticket_route_or_sector", "airticket_purchase_price", "airticket_ticket_no", "airticket_pnr"]);
                    let prevAirticket;
                    let airticketId = airticket_id;
                    if (airticket_id) {
                        prevAirticket = yield conn.getPreviousTicketItems(airticket_id);
                    }
                    // CHECK IS VENDOR OR COMBINED
                    let airticket_vendor_combine_id = null;
                    let airticket_vendor_id = null;
                    if (airticket_comvendor) {
                        const { combined_id, vendor_id } = (0, common_helper_1.separateCombClientToId)(airticket_comvendor);
                        airticket_vendor_combine_id = combined_id;
                        airticket_vendor_id = vendor_id;
                    }
                    let vtrxn_route;
                    if (ticket_details.airticket_route_or_sector &&
                        ((_a = ticket_details.airticket_route_or_sector) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                        vtrxn_route = yield common_conn.getRoutesInfo(ticket_details.airticket_route_or_sector);
                    }
                    const pax_names = (_d = (_c = (_b = pax_passports === null || pax_passports === void 0 ? void 0 : pax_passports.filter((item) => item !== null)) === null || _b === void 0 ? void 0 : _b.filter((item) => item.is_deleted !== 1)) === null || _c === void 0 ? void 0 : _c.map((item2) => item2 === null || item2 === void 0 ? void 0 : item2.passport_name)) === null || _d === void 0 ? void 0 : _d.join(',');
                    // VENDOR TRANSACTION
                    const VTrxnBody = {
                        comb_vendor: airticket_comvendor,
                        vtrxn_amount: airticket_purchase_price,
                        vtrxn_created_at: invoice_sales_date,
                        vtrxn_note: invoice_note,
                        vtrxn_particular_id: 1,
                        vtrxn_pax: pax_names,
                        vtrxn_type: airticket_vendor_combine_id ? 'CREDIT' : 'DEBIT',
                        vtrxn_user_id: invoice_created_by,
                        vtrxn_voucher: invoice_no,
                        vtrxn_pnr: airticket_pnr,
                        vtrxn_route: vtrxn_route,
                        vtrxn_airticket_no: airticket_ticket_no,
                    };
                    const invoiceAirticketItems = Object.assign(Object.assign({}, restAirticketData), { airticket_purchase_price, airticket_client_id: invoice_client_id, airticket_combined_id: invoice_combined_id, airticket_invoice_id: invoice_id, airticket_sales_date: invoice_sales_date, airticket_vendor_id,
                        airticket_vendor_combine_id,
                        airticket_ticket_no,
                        airticket_pnr, airticket_total_taxes_commission: total_taxes_commission });
                    if (airticket_id && is_deleted && prevAirticket) {
                        yield common_conn.deleteAirticketRouteByTicketIdAndInvoice(invoice_id, airticket_id, invoice_created_by);
                        yield conn.deleteAirticketFlightsAndPaxByTicketId(airticket_id, invoice_created_by);
                        yield trxns.deleteVTrxn(prevAirticket === null || prevAirticket === void 0 ? void 0 : prevAirticket.airticket_vtrxn_id, prevAirticket === null || prevAirticket === void 0 ? void 0 : prevAirticket.comb_vendor);
                        continue;
                    }
                    else if (airticket_id) {
                        yield common_conn.deleteAirticketRouteByTicketIdAndInvoice(invoice_id, airticket_id, invoice_created_by);
                        yield conn.updateInvoiceAirticketItem(invoiceAirticketItems, airticket_id);
                        yield trxns.VTrxnUpdate(Object.assign(Object.assign({}, VTrxnBody), { trxn_id: prevAirticket === null || prevAirticket === void 0 ? void 0 : prevAirticket.airticket_vtrxn_id }));
                    }
                    else {
                        const airticket_vtrxn_id = yield trxns.VTrxnInsert(VTrxnBody);
                        airticketId = yield conn.insertInvoiceAirticketItem(Object.assign(Object.assign({}, invoiceAirticketItems), { airticket_vtrxn_id }));
                    }
                    // INSERT PAX PASSPORT INFO
                    yield common_conn.deletePreviousPax(invoice_id, airticketId);
                    if ((pax_passports === null || pax_passports === void 0 ? void 0 : pax_passports.length) && pax_passports[0] && airticketId) {
                        for (const passport of pax_passports) {
                            if (passport.passport_id && passport.is_deleted) {
                                yield common_conn.deleteInvoiceAirTicketPax(invoice_id, airticketId, passport.passport_id);
                            }
                            else if (passport.passport_id) {
                                yield common_conn.insertPaxIfNotExist(invoice_id, airticketId, passport.passport_id);
                            }
                            else if ((passport === null || passport === void 0 ? void 0 : passport.passport_name) && passport.is_deleted !== 1) {
                                yield common_conn.insertInvoiceAirticketPaxName(invoice_id, airticketId, passport === null || passport === void 0 ? void 0 : passport.passport_name, passport.passport_person_type, passport.passport_mobile_no, passport.passport_email);
                            }
                        }
                    }
                    // airticket routes insert
                    if ((0, invoice_helpers_1.isNotEmpty)(airticket_route_or_sector)) {
                        const airticketRoutes = airticket_route_or_sector.map((airoute_route_sector_id) => {
                            return {
                                airoute_invoice_id: invoice_id,
                                airoute_airticket_id: airticketId,
                                airoute_route_sector_id,
                            };
                        });
                        yield common_conn.insertAirticketRoute(airticketRoutes);
                    }
                    // flight details
                    if ((flight_details === null || flight_details === void 0 ? void 0 : flight_details.length) && ((_e = flight_details[0]) === null || _e === void 0 ? void 0 : _e.fltdetails_flight_no)) {
                        for (const item of flight_details) {
                            const { fltdetails_id, is_deleted } = item, restFlightsData = __rest(item, ["fltdetails_id", "is_deleted"]);
                            const flightsData = Object.assign(Object.assign({}, restFlightsData), { fltdetails_airticket_id: airticketId, fltdetails_invoice_id: invoice_id });
                            if (fltdetails_id && is_deleted) {
                                yield conn.deleteAirticketFlightByFlightId(fltdetails_id, invoice_created_by);
                            }
                            else if (fltdetails_id) {
                                yield conn.updateAirticketFlightByFlightId(flightsData, fltdetails_id);
                            }
                            else {
                                yield conn.insertAirTicketFlightDetails(flightsData);
                            }
                        }
                    }
                    // TAXES COMMISSION
                    if (taxes_commission &&
                        (0, invoice_helpers_1.isNotEmpty)(taxes_commission[0]) &&
                        airticketId) {
                        const taxesCommission = taxes_commission === null || taxes_commission === void 0 ? void 0 : taxes_commission.map((item) => {
                            return Object.assign(Object.assign({}, item), { airline_airticket_id: airticketId, airline_invoice_id: invoice_id });
                        });
                        yield conn.insertAirTicketAirlineCommissions(taxesCommission);
                    }
                }
                const content = `INV AIR TICKET UPDATED, VOUCHER ${invoice_no}, BDT ${invoice_net_total}/-`;
                const history_data = {
                    history_activity_type: 'INVOICE_UPDATED',
                    history_created_by: invoice_created_by,
                    history_invoice_id: invoice_id,
                    history_invoice_payment_amount: invoice_net_total,
                    invoicelog_content: `AIR TICKET UPDATED, BDT ${invoice_net_total}/-`,
                };
                yield common_conn.insertInvoiceHistory(history_data);
                yield this.insertAudit(req, 'update', content, invoice_created_by, 'INVOICES');
                return {
                    success: true,
                    message: 'Invoice airticket has been updated',
                };
            }));
        });
    }
}
exports.default = EditInvoiceAirticket;
//# sourceMappingURL=editInvoiceAirticket.js.map