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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_services_1 = __importDefault(require("../../../../../abstracts/abstract.services"));
const common_helper_1 = require("../../../../../common/helpers/common.helper");
const invoice_helpers_1 = __importStar(require("../../../../../common/helpers/invoice.helpers"));
const Trxns_1 = __importDefault(require("../../../../../common/helpers/Trxns"));
const invoice_utils_1 = require("../../../utils/invoice.utils");
class EditInvoiceOther extends abstract_services_1.default {
    constructor() {
        super();
        this.editInvoiceOther = (req) => __awaiter(this, void 0, void 0, function* () {
            const { invoice_net_total, invoice_combclient_id, invoice_created_by, invoice_note, invoice_sales_date, invoice_due_date, invoice_sales_man_id, invoice_sub_total, invoice_vat, invoice_service_charge, invoice_discount, invoice_agent_id, invoice_agent_com_amount, billing_information, hotel_information, ticketInfo, transport_information, passport_information, invoice_no, invoice_reference, } = req.body;
            // VALIDATE CLIENT AND VENDOR
            const { invoice_total_profit, invoice_total_vendor_price, pax_name } = yield (0, invoice_helpers_1.InvoiceClientAndVendorValidate)(billing_information, invoice_combclient_id);
            // CLIENT AND COMBINED CLIENT
            const { invoice_client_id, invoice_combined_id } = (0, invoice_helpers_1.getClientOrCombId)(invoice_combclient_id);
            const invoice_id = Number(req.params.id);
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const conn = this.models.invoiceOtherModel(req, trx);
                const common_conn = this.models.CommonInvoiceModel(req, trx);
                const trxns = new Trxns_1.default(req, trx);
                const productsIds = billing_information.map((item) => item.billing_product_id);
                let note = '';
                if (productsIds.length) {
                    note = yield common_conn.getProductsName(productsIds);
                }
                const { prevCtrxnId, prevClChargeTransId } = yield common_conn.getPreviousInvoices(invoice_id);
                const ctrxn_ticket = ticketInfo === null || ticketInfo === void 0 ? void 0 : ticketInfo.map((item) => item.ticket_no).join(' ,');
                const ctrxn_pnr = ticketInfo === null || ticketInfo === void 0 ? void 0 : ticketInfo.map((item) => item.ticket_pnr).join(', ');
                const utils = new invoice_utils_1.InvoiceUtils(req.body, common_conn);
                // CLIENT TRANSACTIONS
                const clientTransId = yield utils.updateClientTrans(trxns, {
                    prevClChargeTransId,
                    prevCtrxnId,
                    ctrxn_pnr: ctrxn_pnr,
                    extra_particular: 'Air Ticket',
                    invoice_no,
                    ticket_no: ctrxn_ticket,
                    note,
                    ctrxn_route: ticketInfo && ((_a = ticketInfo[0]) === null || _a === void 0 ? void 0 : _a.ticket_route),
                });
                // UPDATE INVOICE INFORMATION
                const invoiceInfo = Object.assign(Object.assign({}, clientTransId), { invoice_client_id,
                    invoice_combined_id,
                    invoice_net_total,
                    invoice_note,
                    invoice_sales_date,
                    invoice_due_date,
                    invoice_sales_man_id,
                    invoice_sub_total, invoice_updated_by: invoice_created_by, invoice_reference,
                    invoice_total_profit,
                    invoice_total_vendor_price });
                yield common_conn.updateInvoiceInformation(invoice_id, invoiceInfo);
                if (invoice_agent_id) {
                    // AGENT TRANSACTION
                    yield invoice_helpers_1.default.invoiceAgentTransactions(this.models.agentProfileModel(req, trx), req.agency_id, invoice_agent_id, invoice_id, invoice_no, invoice_created_by, invoice_agent_com_amount, 'UPDATE', 99, 'INVOICE OTHER ');
                }
                else {
                    yield invoice_helpers_1.default.deleteAgentTransactions(this.models.agentProfileModel(req, trx), invoice_id, invoice_created_by);
                }
                const invoiceExtraAmount = {
                    extra_amount_invoice_id: invoice_id,
                    invoice_vat,
                    invoice_service_charge,
                    invoice_discount,
                    invoice_agent_id,
                    invoice_agent_com_amount,
                };
                yield common_conn.updateInvoiceExtraAmount(invoiceExtraAmount, invoice_id);
                // PASSPORT INFORMATION
                if ((0, invoice_helpers_1.isNotEmpty)(passport_information && passport_information[0]) &&
                    (passport_information === null || passport_information === void 0 ? void 0 : passport_information.length)) {
                    for (const passportInfo of passport_information) {
                        const { passport_id, is_deleted, other_pass_id } = passportInfo;
                        if (is_deleted !== 1 && passport_id) {
                            if (!other_pass_id) {
                                yield conn.insertOtherInvoicePass({
                                    other_pass_invoice_id: invoice_id,
                                    other_pass_passport_id: passport_id,
                                });
                            }
                            else {
                                yield conn.updateOtherInvoicePass({
                                    other_pass_invoice_id: invoice_id,
                                    other_pass_passport_id: passport_id,
                                }, other_pass_id);
                            }
                        }
                        else {
                            yield conn.deleteSingleOtherPassport(other_pass_id, invoice_created_by);
                        }
                    }
                }
                //  TICKETS
                if ((0, invoice_helpers_1.isNotEmpty)(ticketInfo)) {
                    const ticketDetails = [];
                    for (const ticket of ticketInfo) {
                        const { ticket_id, ticket_airline_id, ticket_journey_date, ticket_no, ticket_pnr, ticket_reference_no, ticket_return_date, ticket_is_deleted, ticket_route, } = ticket;
                        const ticket_details = {
                            ticket_invoice_id: invoice_id,
                            ticket_airline_id,
                            ticket_journey_date,
                            ticket_no,
                            ticket_pnr,
                            ticket_reference_no,
                            ticket_return_date,
                            ticket_route,
                        };
                        if (ticket_is_deleted !== 1) {
                            if (!ticket_id) {
                                ticketDetails.push(ticket_details);
                            }
                            else {
                                yield conn.updateTicketInfo(ticket_details, ticket_id);
                            }
                        }
                        else {
                            yield conn.deleteSingleTicket(ticket_id, invoice_created_by);
                        }
                    }
                    if (ticketDetails === null || ticketDetails === void 0 ? void 0 : ticketDetails.length) {
                        yield conn.insertTicketInfo(ticketDetails);
                    }
                }
                //  HOTEL INFORMATION
                if ((0, invoice_helpers_1.isNotEmpty)(hotel_information)) {
                    for (const item of hotel_information) {
                        const hotelId = item === null || item === void 0 ? void 0 : item.hotel_id;
                        const hotelDetails = {
                            hotel_invoice_id: invoice_id,
                            hotel_name: item.hotel_name,
                            hotel_reference_no: item.hotel_reference_no,
                            hotel_room_type_id: item.hotel_room_type_id,
                            hotel_check_in_date: item.hotel_check_in_date,
                            hotel_check_out_date: item.hotel_check_out_date,
                        };
                        if (hotelId && item.is_deleted) {
                            yield conn.deleteSingleHotelInfo(hotelId, invoice_created_by);
                        }
                        else if (hotelId) {
                            yield conn.updatetHotelInfo(hotelDetails, hotelId);
                        }
                        else {
                            yield conn.insertHotelInfo(hotelDetails);
                        }
                    }
                }
                // NEW TRANSPORT INFORMATION
                if ((0, invoice_helpers_1.isNotEmpty)(transport_information)) {
                    const transportDetails = [];
                    for (const transport_info of transport_information) {
                        const { transport_id, transport_reference_no, transport_type_id, transport_pickup_place, transport_pickup_time, transport_dropoff_place, transport_dropoff_time, transport_is_deleted, } = transport_info;
                        const transport_details = {
                            transport_type_id,
                            transport_reference_no,
                            transport_other_invoice_id: invoice_id,
                            transport_pickup_time,
                            transport_pickup_place,
                            transport_dropoff_time,
                            transport_dropoff_place,
                        };
                        if (transport_is_deleted !== 1) {
                            if (!transport_id) {
                                transportDetails.push(transport_details);
                            }
                            else {
                                yield conn.updateTransportInfo(transport_details, transport_id);
                            }
                        }
                        else {
                            yield conn.deleteSingleTransportInfo(transport_id, invoice_created_by);
                        }
                    }
                    if (transportDetails === null || transportDetails === void 0 ? void 0 : transportDetails.length) {
                        yield conn.insertTransportInfo(transportDetails);
                    }
                }
                // BILLING INFO AND INVOICE COST DETAILS
                for (const billingInfo of billing_information) {
                    const { billing_id, billing_comvendor, billing_cost_price, billing_quantity, billing_product_id, billing_profit, billing_unit_price, pax_name, billing_description, is_deleted, } = billingInfo;
                    const billing_subtotal = billing_unit_price * billing_quantity;
                    const billingInfoData = {
                        billing_invoice_id: invoice_id,
                        billing_sales_date: invoice_sales_date,
                        billing_remaining_quantity: billing_quantity,
                        billing_quantity,
                        billing_subtotal,
                        billing_product_id,
                        billing_profit,
                        billing_unit_price,
                        pax_name,
                        billing_description,
                    };
                    let VTrxnBody = null;
                    if (billing_comvendor && billing_cost_price) {
                        const { combined_id, vendor_id } = (0, common_helper_1.separateCombClientToId)(billing_comvendor);
                        billingInfoData.billing_cost_price = billing_cost_price;
                        billingInfoData.billing_combined_id = combined_id;
                        billingInfoData.billing_vendor_id = vendor_id;
                        const total_cost_price = billing_cost_price * billing_quantity;
                        const productName = yield common_conn.getProductById(billingInfo.billing_product_id);
                        let vtrxn_particular_type = `Invoice other (${productName}). \n`;
                        VTrxnBody = {
                            comb_vendor: billing_comvendor,
                            vtrxn_amount: total_cost_price,
                            vtrxn_created_at: invoice_sales_date,
                            vtrxn_note: billing_description,
                            vtrxn_particular_id: 150,
                            vtrxn_particular_type,
                            vtrxn_pax: pax_name,
                            vtrxn_type: combined_id ? 'CREDIT' : 'DEBIT',
                            vtrxn_user_id: invoice_created_by,
                            vtrxn_voucher: invoice_no,
                            vtrxn_pnr: ctrxn_pnr,
                        };
                    }
                    // BILLING IS NOR DELETED
                    if (is_deleted !== 1) {
                        // add new billing info
                        if (!billing_id) {
                            if (VTrxnBody) {
                                billingInfoData.billing_vtrxn_id = yield trxns.VTrxnInsert(VTrxnBody);
                            }
                            yield conn.insertBillingInfo(billingInfoData);
                        }
                        // update previous billing info
                        else {
                            const { prevTrxnId, prevComvendor } = yield conn.getPreviousSingleBilling(billing_id);
                            if (prevTrxnId && VTrxnBody) {
                                yield trxns.VTrxnUpdate(Object.assign(Object.assign({}, VTrxnBody), { trxn_id: prevTrxnId }));
                            }
                            else if (prevTrxnId && !VTrxnBody) {
                                billingInfoData.billing_vtrxn_id = null;
                                billingInfoData.billing_combined_id = null;
                                billingInfoData.billing_vendor_id = null;
                                billingInfoData.billing_cost_price = 0;
                                yield trxns.deleteVTrxn(prevTrxnId, prevComvendor);
                            }
                            else if (VTrxnBody) {
                                billingInfoData.billing_vtrxn_id = yield trxns.VTrxnInsert(VTrxnBody);
                            }
                            yield conn.updateBillingInfo(billingInfoData, billing_id);
                        }
                    }
                    // BILLING IS DELETED
                    else {
                        const previousBillingInfo = yield conn.getPreviousBillingInfo(billing_id);
                        yield conn.deleteOtherSingleBillingInfo(billing_id, invoice_created_by);
                        yield trxns.deleteInvVTrxn(previousBillingInfo);
                    }
                }
                // LOGS
                const history_data = {
                    history_activity_type: 'INVOICE_UPDATED',
                    history_created_by: invoice_created_by,
                    history_invoice_id: invoice_id,
                    history_invoice_payment_amount: invoice_net_total,
                    invoicelog_content: 'Invoice other has been updated',
                };
                yield common_conn.insertInvoiceHistory(history_data);
                yield this.insertAudit(req, 'update', `Invoice other has been updated, Voucher - ${invoice_no}, Net - ${invoice_net_total}/-`, invoice_created_by, 'INVOICES');
                return {
                    success: true,
                    message: 'Invoice other has been updated',
                };
            }));
        });
    }
}
exports.default = EditInvoiceOther;
//# sourceMappingURL=editInvoiceOther.js.map