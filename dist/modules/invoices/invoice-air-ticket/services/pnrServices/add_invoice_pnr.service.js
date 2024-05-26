"use strict";
// KBWTST
// AGVKZZ - VOID
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
const dayjs_1 = __importDefault(require("dayjs"));
const abstract_services_1 = __importDefault(require("../../../../../abstracts/abstract.services"));
const Trxns_1 = __importDefault(require("../../../../../common/helpers/Trxns"));
const common_helper_1 = require("../../../../../common/helpers/common.helper");
const invoice_helpers_1 = require("../../../../../common/helpers/invoice.helpers");
const customError_1 = __importDefault(require("../../../../../common/utils/errors/customError"));
const lib_1 = require("../../../../../common/utils/libraries/lib");
const pnr_lib_1 = require("../../../../../common/utils/libraries/pnr_lib");
const invoice_utils_1 = require("../../../utils/invoice.utils");
const pnr_details_service_1 = __importDefault(require("./pnr_details.service"));
class AddInvoiceWithPnr extends abstract_services_1.default {
    constructor() {
        super();
        this.addInvoiceWithPnr = (req) => __awaiter(this, void 0, void 0, function* () {
            const { invoice_combclient_id, invoice_walking_customer_name, invoice_discount, invoice_service_charge, invoice_pnr, } = req.body;
            const getPnrDetails = new pnr_details_service_1.default();
            const pnrData = yield getPnrDetails.pnrDetails(req, invoice_pnr);
            if (!pnrData.success) {
                return pnrData;
            }
            const pnrResponse = pnrData.data;
            if (!pnrResponse.invoice_sales_man_id) {
                throw new customError_1.default('SALES_MAIN_NOT_FOUND', 404, 'Sales man not found with pnr creation sign:' +
                    pnrResponse.creation_sign);
            }
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const conn = this.models.invoiceAirticketModel(req, trx);
                const pass_conn = this.models.passportModel(req, trx);
                const common_conn = this.models.CommonInvoiceModel(req, trx);
                const combined_conn = this.models.combineClientModel(req, trx);
                const trxns = new Trxns_1.default(req, trx);
                const invoice_note = 'THE INVOICE IS GENERATED AUTOMATICALLY.';
                // common invoice assets
                const invoice_no = yield this.generateVoucher(req, 'AIT');
                const route_name = pnrResponse === null || pnrResponse === void 0 ? void 0 : pnrResponse.ticket_details[0].route_sectors.join(',');
                const { client_id, combined_id } = (0, common_helper_1.separateCombClientToId)(invoice_combclient_id);
                const ticket_no = pnrResponse.ticket_details
                    .map((item) => item.airticket_ticket_no)
                    .join(',');
                const cl_preset_balance = yield combined_conn.getClientLastBalanceById(client_id, combined_id);
                let invoice_sub_total = 0;
                let invoice_total_profit = 0;
                let invoice_total_vendor_price = 0;
                pnrResponse.ticket_details.forEach((item) => {
                    invoice_sub_total += (0, lib_1.numRound)(item.airticket_gross_fare);
                    invoice_total_profit += (0, lib_1.numRound)(item.airticket_profit);
                    invoice_total_vendor_price += (0, lib_1.numRound)(item.airticket_purchase_price);
                });
                const invoice_net_total = invoice_sub_total -
                    (0, lib_1.numRound)(invoice_discount) +
                    (0, lib_1.numRound)(invoice_service_charge);
                // client transaction
                const invoice_info = {
                    invoice_net_total,
                    invoice_note,
                    invoice_sales_date: pnrResponse.invoice_sales_date,
                    invoice_combclient_id,
                    invoice_discount,
                };
                const utils = new invoice_utils_1.InvoiceUtils(invoice_info, common_conn);
                const clientTransId = yield utils.clientTrans(trxns, {
                    ctrxn_pnr: invoice_pnr,
                    ctrxn_route: route_name,
                    extra_particular: 'Add Invoice Air Ticket(PNR)',
                    invoice_no,
                    ticket_no,
                });
                // invoice information
                const invoiceData = Object.assign(Object.assign({}, clientTransId), { invoice_category_id: 1, invoice_client_id: client_id, invoice_combined_id: combined_id, invoice_net_total, invoice_no: invoice_no, invoice_sales_date: pnrResponse.invoice_sales_date, invoice_sales_man_id: pnrResponse.invoice_sales_man_id, invoice_sub_total,
                    invoice_note, invoice_created_by: req.user_id, invoice_client_previous_due: cl_preset_balance, invoice_walking_customer_name,
                    invoice_total_profit,
                    invoice_total_vendor_price });
                const invoice_id = yield common_conn.insertInvoicesInfo(invoiceData);
                // ADVANCE MR
                if (cl_preset_balance > 0) {
                    yield (0, invoice_helpers_1.addAdvanceMr)(common_conn, invoice_id, client_id, combined_id, invoice_net_total, cl_preset_balance);
                }
                const invoiceExtraAmount = {
                    extra_amount_invoice_id: invoice_id,
                    invoice_service_charge,
                    invoice_discount,
                };
                yield common_conn.insertInvoiceExtraAmount(invoiceExtraAmount);
                // await common_conn.insertInvoicePreData(invoicePreData);
                // ticket information
                for (const [index, ticket] of pnrResponse.ticket_details.entries()) {
                    // vendor transaction
                    const vtrxn_pax = ticket === null || ticket === void 0 ? void 0 : ticket.pax_passports.map((item) => item.passport_name).join(',');
                    const VTrxnBody = {
                        comb_vendor: ticket.airticket_comvendor,
                        vtrxn_amount: ticket.airticket_purchase_price,
                        vtrxn_created_at: pnrResponse.invoice_sales_date,
                        vtrxn_note: invoice_note,
                        vtrxn_particular_id: 146,
                        vtrxn_particular_type: 'INV AIR TICKET PURCHASE',
                        vtrxn_type: 'DEBIT',
                        vtrxn_user_id: req.user_id,
                        vtrxn_voucher: invoice_no,
                        vtrxn_pnr: invoice_pnr,
                        vtrxn_route: route_name,
                        vtrxn_pax,
                        vtrxn_airticket_no: ticket.airticket_ticket_no,
                    };
                    const airticket_vtrxn_id = yield trxns.VTrxnInsert(VTrxnBody);
                    const { combined_id, vendor_id } = (0, common_helper_1.separateCombClientToId)(ticket.airticket_comvendor);
                    const invoiceAirticketItems = {
                        airticket_purchase_price: ticket.airticket_purchase_price,
                        airticket_client_id: client_id,
                        airticket_combined_id: combined_id,
                        airticket_invoice_id: invoice_id,
                        airticket_sales_date: pnrResponse.invoice_sales_date,
                        airticket_vendor_id: vendor_id,
                        airticket_vendor_combine_id: combined_id,
                        airticket_vtrxn_id,
                        airticket_ticket_no: ticket.airticket_ticket_no,
                        airticket_total_taxes_commission: 0,
                        airticket_airline_id: ticket.airticket_airline_id,
                        airticket_ait: ticket.airticket_ait,
                        airticket_ait_from: 'Profit',
                        airticket_base_fare: ticket.airticket_base_fare,
                        airticket_profit: ticket.airticket_profit,
                        airticket_classes: ticket.airticket_classes,
                        airticket_client_price: ticket.airticket_client_price,
                        airticket_ticket_type: 'NEW TKT',
                        airticket_gross_fare: ticket.airticket_gross_fare,
                        airticket_commission_percent: ticket.airticket_commission_percent,
                        airticket_commission_percent_total: ticket.airticket_commission_percent_total,
                        airticket_tax: ticket.airticket_tax,
                        airticket_discount_type: 'amount',
                        airticket_journey_date: ticket.airticket_journey_date,
                        airticket_pnr: invoice_pnr,
                        airticket_gds_id: 'Sabre',
                        airticket_issue_date: ticket.airticket_issue_date,
                        airticket_segment: ticket.airticket_segment,
                        airticket_net_commssion: ticket.airticket_net_commssion,
                        airticket_bd_charge: ticket.BD,
                        airticket_ut_charge: ticket.UT,
                        airticket_e5_charge: ticket.E5,
                    };
                    const airticket_id = yield conn.insertInvoiceAirticketItem(invoiceAirticketItems);
                    // INSERT PAX PASSPORT INFO
                    if (ticket === null || ticket === void 0 ? void 0 : ticket.pax_passports) {
                        for (const passport of ticket === null || ticket === void 0 ? void 0 : ticket.pax_passports) {
                            const identityDocuments = passport === null || passport === void 0 ? void 0 : passport.identityDocuments;
                            if (identityDocuments &&
                                identityDocuments.documentType === 'PASSPORT') {
                                let passport_id = yield pass_conn.getPassIdByPassNo(identityDocuments.documentNumber);
                                if (!passport_id) {
                                    const PassportData = {
                                        passport_person_type: (0, pnr_lib_1.capitalize)(passport.passport_person_type),
                                        passport_passport_no: identityDocuments.documentNumber,
                                        passport_name: passport === null || passport === void 0 ? void 0 : passport.passport_name,
                                        passport_mobile_no: passport.passport_mobile_no,
                                        passport_date_of_birth: identityDocuments.birthDate &&
                                            (0, dayjs_1.default)(identityDocuments.birthDate).format('YYYY-MM-DD HH:mm:ss.SSS'),
                                        passport_date_of_expire: identityDocuments.expiryDate &&
                                            (0, dayjs_1.default)(identityDocuments.expiryDate).format('YYYY-MM-DD HH:mm:ss.SSS'),
                                        passport_email: passport.passport_email,
                                        passport_created_by: req.user_id,
                                    };
                                    passport_id = yield pass_conn.addPassport(PassportData);
                                }
                                yield common_conn.insertInvoiceAirticketPax(invoice_id, airticket_id, passport_id);
                            }
                            else {
                                yield common_conn.insertInvoiceAirticketPaxName(invoice_id, airticket_id, passport === null || passport === void 0 ? void 0 : passport.passport_name, (0, pnr_lib_1.capitalize)(passport.passport_person_type), passport.passport_mobile_no, passport.passport_email);
                            }
                        }
                    }
                    // airticket routes insert
                    const airticketRoutes = ticket.airticket_route_or_sector.map((airoute_route_sector_id) => {
                        return {
                            airoute_invoice_id: invoice_id,
                            airoute_airticket_id: airticket_id,
                            airoute_route_sector_id,
                        };
                    });
                    yield common_conn.insertAirticketRoute(airticketRoutes);
                    // flight details
                    // if (index === 0) {
                    const flightsDetails = (_a = ticket === null || ticket === void 0 ? void 0 : ticket.flight_details) === null || _a === void 0 ? void 0 : _a.map((item) => {
                        return Object.assign(Object.assign({}, item), { fltdetails_airticket_id: airticket_id, fltdetails_invoice_id: invoice_id });
                    });
                    yield conn.insertAirTicketFlightDetails(flightsDetails);
                }
                // }
                // invoice history
                const content = `INV AIR TICKET ADDED, VOUCHER ${invoice_no}, PNR ${invoice_pnr}, BDT ${invoice_net_total}/-`;
                // invoice history
                const history_data = {
                    history_activity_type: 'INVOICE_CREATED',
                    history_created_by: req.user_id,
                    history_invoice_id: invoice_id,
                    history_invoice_payment_amount: invoice_net_total,
                    invoicelog_content: content,
                };
                yield common_conn.insertInvoiceHistory(history_data);
                yield this.updateVoucher(req, 'AIT');
                // audit trail
                yield this.insertAudit(req, 'create', content, req.user_id, 'INVOICES');
                // response
                return {
                    success: true,
                    message: 'Invoice airticket has been added',
                    data: { invoice_id },
                };
            }));
        });
    }
}
exports.default = AddInvoiceWithPnr;
//# sourceMappingURL=add_invoice_pnr.service.js.map