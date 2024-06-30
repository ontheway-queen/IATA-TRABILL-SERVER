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
const CommonAddMoneyReceipt_1 = __importDefault(require("../../../../../common/services/CommonAddMoneyReceipt"));
const lib_1 = require("../../../../../common/utils/libraries/lib");
const CommonSmsSend_services_1 = __importDefault(require("../../../../smsSystem/utils/CommonSmsSend.services"));
const invoice_utils_1 = require("../../../utils/invoice.utils");
class AddInvoiceAirticket extends abstract_services_1.default {
    constructor() {
        super();
        this.addInvoiceAirTicket = (req) => __awaiter(this, void 0, void 0, function* () {
            const { invoice_info, ticketInfo, money_receipt } = req.body;
            const { invoice_combclient_id, invoice_created_by, invoice_net_total, invoice_sales_date, invoice_due_date, invoice_sales_man_id, invoice_sub_total, invoice_note, invoice_vat, invoice_service_charge, invoice_discount, invoice_agent_id, invoice_agent_com_amount, invoice_show_discount, invoice_show_passport_details, invoice_show_prev_due, invoice_show_unit, invoice_walking_customer_name, invoice_reference, } = invoice_info;
            let invoice_total_profit = 0;
            let invoice_total_vendor_price = 0;
            for (const { ticket_details } of ticketInfo) {
                const vendor = ticket_details.airticket_comvendor;
                invoice_total_profit += ticket_details.airticket_profit;
                invoice_total_vendor_price += ticket_details.airticket_purchase_price;
                yield (0, invoice_helpers_1.ValidateClientAndVendor)(invoice_combclient_id, vendor);
            }
            (0, invoice_helpers_1.MoneyReceiptAmountIsValid)(money_receipt, invoice_net_total);
            const { invoice_client_id, invoice_combined_id } = (0, invoice_helpers_1.getClientOrCombId)(invoice_combclient_id);
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.invoiceAirticketModel(req, trx);
                const common_conn = this.models.CommonInvoiceModel(req, trx);
                const combined_conn = this.models.combineClientModel(req, trx);
                const trxns = new Trxns_1.default(req, trx);
                const utils = new invoice_utils_1.InvoiceUtils(invoice_info, common_conn);
                const invoice_no = yield this.generateVoucher(req, 'AIT');
                const cl_preset_balance = yield combined_conn.getClientLastBalanceById(invoice_client_id, invoice_combined_id);
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
                const clientTransId = yield utils.clientTrans(trxns, {
                    ctrxn_pnr: (0, lib_1.uniqueArrJoin)(ctrxn_pnr),
                    tr_type: 1,
                    dis_tr_type: 2,
                    ctrxn_route,
                    invoice_no,
                    ticket_no,
                });
                const invoiceData = Object.assign(Object.assign({}, clientTransId), { invoice_category_id: 1, invoice_client_id,
                    invoice_net_total, invoice_no: invoice_no, invoice_combined_id,
                    invoice_sales_date,
                    invoice_due_date,
                    invoice_sales_man_id,
                    invoice_sub_total,
                    invoice_note,
                    invoice_created_by, invoice_client_previous_due: cl_preset_balance, invoice_walking_customer_name,
                    invoice_reference,
                    invoice_total_profit,
                    invoice_total_vendor_price, invoice_reissue_client_type: 'MANUAL' });
                const invoice_id = yield common_conn.insertInvoicesInfo(invoiceData);
                // ADVANCE MR
                if (cl_preset_balance > 0) {
                    yield (0, invoice_helpers_1.addAdvanceMr)(common_conn, invoice_id, invoice_client_id, invoice_combined_id, invoice_net_total, cl_preset_balance);
                }
                // AGENT TRANSACTION
                yield invoice_helpers_1.default.invoiceAgentTransactions(this.models.agentProfileModel(req, trx), req.agency_id, invoice_agent_id, invoice_id, invoice_no, invoice_created_by, invoice_agent_com_amount, 'CREATE', 1, 'INVOICE AIR TICKET');
                const invoiceExtraAmount = {
                    extra_amount_invoice_id: invoice_id,
                    invoice_vat,
                    invoice_service_charge,
                    invoice_discount,
                    invoice_agent_id,
                    invoice_agent_com_amount,
                };
                yield common_conn.insertInvoiceExtraAmount(invoiceExtraAmount);
                const invoicePreData = {
                    airticket_invoice_id: invoice_id,
                    invoice_show_discount,
                    invoice_show_passport_details,
                    invoice_show_prev_due,
                    invoice_show_unit,
                };
                yield common_conn.insertInvoicePreData(invoicePreData);
                for (const ticket of ticketInfo) {
                    const { flight_details, pax_passports, ticket_details, taxes_commission, total_taxes_commission, } = ticket;
                    const pax_names = pax_passports === null || pax_passports === void 0 ? void 0 : pax_passports.map((item) => item === null || item === void 0 ? void 0 : item.passport_name).join(',');
                    const { airticket_comvendor, airticket_route_or_sector, airticket_purchase_price, airticket_ticket_no } = ticket_details, restAirticketData = __rest(ticket_details, ["airticket_comvendor", "airticket_route_or_sector", "airticket_purchase_price", "airticket_ticket_no"]);
                    let airticket_vendor_combine_id = null;
                    let airticket_vendor_id = null;
                    if (airticket_comvendor) {
                        const { combined_id, vendor_id } = (0, common_helper_1.separateCombClientToId)(airticket_comvendor);
                        airticket_vendor_combine_id = combined_id;
                        airticket_vendor_id = vendor_id;
                    }
                    let vtrxn_route;
                    if (ticket_details.airticket_route_or_sector &&
                        ticket_details.airticket_route_or_sector.length > 0) {
                        vtrxn_route = yield common_conn.getRoutesInfo(ticket_details.airticket_route_or_sector);
                    }
                    // VENDOR TRANSACTIONS
                    const VTrxnBody = {
                        comb_vendor: airticket_comvendor,
                        vtrxn_amount: airticket_purchase_price,
                        vtrxn_created_at: invoice_sales_date,
                        vtrxn_note: invoice_note,
                        vtrxn_particular_id: 1,
                        vtrxn_type: airticket_vendor_combine_id ? 'CREDIT' : 'DEBIT',
                        vtrxn_user_id: invoice_created_by,
                        vtrxn_voucher: invoice_no,
                        vtrxn_pnr: ticket_details.airticket_pnr,
                        vtrxn_route: vtrxn_route,
                        vtrxn_pax: pax_names,
                        vtrxn_airticket_no: airticket_ticket_no,
                    };
                    const airticket_vtrxn_id = yield trxns.VTrxnInsert(VTrxnBody);
                    const invoiceAirticketItems = Object.assign(Object.assign({}, restAirticketData), { airticket_purchase_price, airticket_client_id: invoice_client_id, airticket_combined_id: invoice_combined_id, airticket_invoice_id: invoice_id, airticket_sales_date: invoice_sales_date, airticket_vendor_id,
                        airticket_vendor_combine_id,
                        airticket_vtrxn_id,
                        airticket_ticket_no, airticket_total_taxes_commission: total_taxes_commission });
                    const airticket_id = yield conn.insertInvoiceAirticketItem(invoiceAirticketItems);
                    // INSERT PAX PASSPORT INFO
                    if (pax_passports === null || pax_passports === void 0 ? void 0 : pax_passports.length) {
                        for (const passport of pax_passports) {
                            if (passport.passport_id) {
                                yield common_conn.insertInvoiceAirticketPax(invoice_id, airticket_id, passport.passport_id);
                            }
                            else if (passport === null || passport === void 0 ? void 0 : passport.passport_name) {
                                yield common_conn.insertInvoiceAirticketPaxName(invoice_id, airticket_id, passport === null || passport === void 0 ? void 0 : passport.passport_name, passport.passport_mobile_no, passport.passport_email, passport.passport_person_type);
                            }
                        }
                    }
                    // airticket routes insert
                    if ((0, invoice_helpers_1.isNotEmpty)(airticket_route_or_sector)) {
                        const airticketRoutes = airticket_route_or_sector.map((airoute_route_sector_id) => {
                            return {
                                airoute_invoice_id: invoice_id,
                                airoute_airticket_id: airticket_id,
                                airoute_route_sector_id,
                            };
                        });
                        yield common_conn.insertAirticketRoute(airticketRoutes);
                    }
                    // flight details
                    if (flight_details && (0, invoice_helpers_1.isNotEmpty)(flight_details[0])) {
                        const flightsDetails = flight_details === null || flight_details === void 0 ? void 0 : flight_details.map((item) => {
                            return Object.assign(Object.assign({}, item), { fltdetails_airticket_id: airticket_id, fltdetails_invoice_id: invoice_id });
                        });
                        yield conn.insertAirTicketFlightDetails(flightsDetails);
                    }
                    // TAXES COMMISSION
                    if (taxes_commission && (0, invoice_helpers_1.isNotEmpty)(taxes_commission[0])) {
                        const taxesCommission = taxes_commission === null || taxes_commission === void 0 ? void 0 : taxes_commission.map((item) => {
                            return Object.assign(Object.assign({}, item), { airline_airticket_id: airticket_id, airline_invoice_id: invoice_id });
                        });
                        yield conn.insertAirTicketAirlineCommissions(taxesCommission);
                    }
                }
                const content = `INV AIR TICKET ADDED, VOUCHER ${invoice_no}, BDT ${invoice_net_total}/-`;
                // invoice history
                const history_data = {
                    history_activity_type: 'INVOICE_CREATED',
                    history_created_by: invoice_created_by,
                    history_invoice_id: invoice_id,
                    history_invoice_payment_amount: invoice_net_total,
                    invoicelog_content: content,
                };
                yield common_conn.insertInvoiceHistory(history_data);
                // MONEY RECEIPT
                const moneyReceiptInvoice = {
                    invoice_client_id,
                    invoice_combined_id,
                    invoice_created_by,
                    invoice_id,
                };
                yield new CommonAddMoneyReceipt_1.default().commonAddMoneyReceipt(req, moneyReceiptInvoice, trx);
                yield this.updateVoucher(req, 'AIT');
                const smsInvoiceDate = {
                    invoice_client_id: invoice_client_id,
                    invoice_combined_id: invoice_combined_id,
                    invoice_sales_date,
                    invoice_created_by,
                    invoice_id,
                };
                yield new CommonSmsSend_services_1.default().sendSms(req, smsInvoiceDate, trx);
                yield this.insertAudit(req, 'create', content, invoice_created_by, 'INVOICES');
                return {
                    success: true,
                    message: 'Invoice airticket has been added',
                    data: { invoice_id },
                };
            }));
        });
    }
}
exports.default = AddInvoiceAirticket;
//# sourceMappingURL=addInvoiceAirticket.js.map