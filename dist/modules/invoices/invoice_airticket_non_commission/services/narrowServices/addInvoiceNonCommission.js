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
const moment_1 = __importDefault(require("moment"));
const CommonSmsSend_services_1 = __importDefault(require("../../../../smsSystem/utils/CommonSmsSend.services"));
const invoice_utils_1 = require("../../../utils/invoice.utils");
class AddInvoiceNonCommission extends abstract_services_1.default {
    constructor() {
        super();
        this.addInvoiceNonCommission = (req) => __awaiter(this, void 0, void 0, function* () {
            const { invoice_info, ticketInfo, money_receipt } = req.body;
            const { invoice_combclient_id, invoice_created_by, invoice_net_total, invoice_agent_com_amount, invoice_agent_id, invoice_discount, invoice_service_charge, invoice_vat, invoice_sales_date, invoice_due_date, invoice_sales_man_id, invoice_sub_total, invoice_note, invoice_total_profit, invoice_total_vendor_price, invoice_show_passport_details, invoice_show_prev_due, invoice_show_discount, invoice_walking_customer_name, invoice_reference, } = invoice_info;
            let total_profit = 0;
            for (const { ticket_details } of ticketInfo) {
                const vendor = ticket_details.airticket_comvendor;
                total_profit += ticket_details.airticket_profit;
                yield (0, invoice_helpers_1.ValidateClientAndVendor)(invoice_combclient_id, vendor);
            }
            // VALIDATE CLIENT AND VENDOR
            for (const ticket of ticketInfo) {
                const vendor = ticket.ticket_details.airticket_comvendor;
                yield (0, invoice_helpers_1.ValidateClientAndVendor)(invoice_combclient_id, vendor);
            }
            // VALIDATE MONEY RECEIPT AMOUNT
            (0, invoice_helpers_1.MoneyReceiptAmountIsValid)(money_receipt, invoice_net_total);
            // CLIENT AND COMBINED CLIENT
            const { invoice_client_id, invoice_combined_id } = yield (0, invoice_helpers_1.getClientOrCombId)(invoice_combclient_id);
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.invoiceNonCommission(req, trx);
                const common_conn = this.models.CommonInvoiceModel(req, trx);
                const combined_conn = this.models.combineClientModel(req, trx);
                const utils = new invoice_utils_1.InvoiceUtils(invoice_info, common_conn);
                const trxns = new Trxns_1.default(req, trx);
                const invoice_no = yield this.generateVoucher(req, 'ANC');
                const invoice_client_previous_due = yield combined_conn.getClientLastBalanceById(invoice_client_id, invoice_combined_id);
                const ctrxn_pnr = ticketInfo &&
                    ticketInfo.map((item) => item.ticket_details.airticket_pnr).join(', ');
                const ticket_no = ticketInfo[0] &&
                    ticketInfo
                        .map((item) => item.ticket_details.airticket_ticket_no)
                        .join(', ');
                const routes = ticketInfo &&
                    ticketInfo.map((item) => { var _a; return (_a = item === null || item === void 0 ? void 0 : item.ticket_details) === null || _a === void 0 ? void 0 : _a.airticket_route_or_sector; });
                const flattenedRoutes = [].concat(...routes);
                let ctrxn_route;
                if (flattenedRoutes.length > 0) {
                    ctrxn_route = yield common_conn.getRoutesInfo(flattenedRoutes);
                }
                const clientTransId = yield utils.clientTrans(trxns, invoice_no, ctrxn_pnr, ctrxn_route, ticket_no);
                const invoiceData = Object.assign(Object.assign({}, clientTransId), { invoice_category_id: 2, invoice_client_id,
                    invoice_net_total, invoice_no: invoice_no, invoice_combined_id,
                    invoice_sales_date,
                    invoice_due_date,
                    invoice_sales_man_id,
                    invoice_sub_total,
                    invoice_note,
                    invoice_created_by,
                    invoice_client_previous_due,
                    invoice_total_profit,
                    invoice_total_vendor_price,
                    invoice_walking_customer_name,
                    invoice_reference });
                const invoice_id = yield common_conn.insertInvoicesInfo(invoiceData);
                // ADVANCE MR
                if ((0, invoice_helpers_1.isEmpty)(req.body.money_receipt)) {
                    yield (0, invoice_helpers_1.addAdvanceMr)(common_conn, invoice_id, invoice_client_id, invoice_combined_id, invoice_net_total);
                }
                // AGENT TRANSACTION
                yield invoice_helpers_1.default.invoiceAgentTransactions(this.models.agentProfileModel(req, trx), req.agency_id, invoice_agent_id, invoice_id, invoice_no, invoice_created_by, invoice_agent_com_amount, 'CREATE', 92, 'AIR TICKET NON COMMISSION');
                const invoice_extra_ammount = {
                    extra_amount_invoice_id: invoice_id,
                    invoice_agent_com_amount,
                    invoice_agent_id,
                    invoice_discount,
                    invoice_service_charge,
                    invoice_vat,
                };
                yield common_conn.insertInvoiceExtraAmount(invoice_extra_ammount);
                const invoicePreData = {
                    invoice_show_discount,
                    airticket_invoice_id: invoice_id,
                    invoice_show_passport_details: invoice_show_passport_details || 0,
                    invoice_show_prev_due: invoice_show_prev_due || 0,
                };
                yield common_conn.insertInvoicePreData(invoicePreData);
                // invoice air ticket items
                for (const ticket of ticketInfo) {
                    const { flight_details, pax_passports, ticket_details } = ticket;
                    const { airticket_purchase_price, airticket_comvendor, airticket_route_or_sector, airticket_ticket_no, airticket_pnr } = ticket_details, restAirticketItem = __rest(ticket_details, ["airticket_purchase_price", "airticket_comvendor", "airticket_route_or_sector", "airticket_ticket_no", "airticket_pnr"]);
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
                        ticket_details.airticket_route_or_sector.length > 0) {
                        vtrxn_route = yield common_conn.getRoutesInfo(ticket_details.airticket_route_or_sector);
                    }
                    const vtrxn_pax = pax_passports
                        .map((item) => item.passport_name)
                        .join(',');
                    let vtrxn_particular_type = 'Invoice non-commission cost. \n';
                    if (restAirticketItem.airticket_journey_date) {
                        const inputDate = new Date(restAirticketItem.airticket_journey_date);
                        vtrxn_particular_type +=
                            'Journey date: ' + (0, moment_1.default)(inputDate).format('DD MMM YYYY');
                    }
                    // VENDOR TRANSACTIONS
                    const VTrxnBody = {
                        comb_vendor: airticket_comvendor,
                        vtrxn_amount: airticket_purchase_price,
                        vtrxn_created_at: invoice_sales_date,
                        vtrxn_note: invoice_note,
                        vtrxn_particular_id: 147,
                        vtrxn_particular_type,
                        vtrxn_pax,
                        vtrxn_type: airticket_vendor_combine_id ? 'CREDIT' : 'DEBIT',
                        vtrxn_user_id: invoice_created_by,
                        vtrxn_voucher: invoice_no,
                        vtrxn_pnr: airticket_pnr,
                        vtrxn_route: vtrxn_route,
                        vtrxn_airticket_no: airticket_ticket_no,
                    };
                    const airticket_vtrxn_id = yield trxns.VTrxnInsert(VTrxnBody);
                    const invoiceNonComAirticketItems = Object.assign(Object.assign({}, restAirticketItem), { airticket_purchase_price, airticket_client_id: invoice_client_id, airticket_combined_id: invoice_combined_id, airticket_invoice_id: invoice_id, airticket_sales_date: invoice_sales_date, airticket_vendor_id,
                        airticket_vendor_combine_id,
                        airticket_vtrxn_id,
                        airticket_ticket_no,
                        airticket_pnr });
                    const airticket_id = yield conn.insertInvoiceNonCommissionItems(invoiceNonComAirticketItems);
                    // INSERT PAX PASSPORT INFO
                    if (pax_passports.length) {
                        for (const passport of pax_passports) {
                            if (passport.passport_id) {
                                yield common_conn.insertInvoiceAirticketPax(invoice_id, airticket_id, passport.passport_id);
                            }
                            else if (passport.passport_name) {
                                yield common_conn.insertInvoiceAirticketPaxName(invoice_id, airticket_id, passport.passport_name, passport.passport_person_type, passport.passport_mobile_no, passport.passport_email);
                            }
                        }
                    }
                    // airticket routes insert
                    if (airticket_route_or_sector && airticket_route_or_sector.length) {
                        const airticketRoutes = airticket_route_or_sector.map((airoute_route_sector_id) => {
                            return {
                                airoute_invoice_id: invoice_id,
                                airoute_airticket_id: airticket_id,
                                airoute_route_sector_id,
                            };
                        });
                        yield common_conn.insertAirticketRoute(airticketRoutes);
                    }
                    if ((0, invoice_helpers_1.isNotEmpty)(flight_details[0])) {
                        const flightsDetails = flight_details === null || flight_details === void 0 ? void 0 : flight_details.map((item) => {
                            return Object.assign(Object.assign({}, item), { fltdetails_airticket_id: airticket_id, fltdetails_invoice_id: invoice_id });
                        });
                        yield conn.insertInvoiceNonComeFlightDetails(flightsDetails);
                    }
                }
                const history_data = {
                    history_activity_type: 'INVOICE_CREATED',
                    history_created_by: invoice_created_by,
                    history_invoice_id: invoice_id,
                    history_invoice_payment_amount: invoice_net_total,
                    invoicelog_content: 'Invoice airticket non comission  has been created',
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
                yield this.updateVoucher(req, 'ANC');
                const smsInvoiceDate = {
                    invoice_client_id: invoice_client_id,
                    invoice_combined_id: invoice_combined_id,
                    invoice_sales_date,
                    invoice_created_by,
                    invoice_id,
                };
                yield new CommonSmsSend_services_1.default().sendSms(req, smsInvoiceDate, trx);
                const message = `Invoice airticket non commission has been created, Voucher - ${invoice_no}, Net - ${invoice_net_total}/-`;
                yield this.insertAudit(req, 'create', message, invoice_created_by, 'INVOICES');
                return {
                    success: true,
                    message,
                    data: invoice_id,
                };
            }));
        });
    }
}
exports.default = AddInvoiceNonCommission;
//# sourceMappingURL=addInvoiceNonCommission.js.map