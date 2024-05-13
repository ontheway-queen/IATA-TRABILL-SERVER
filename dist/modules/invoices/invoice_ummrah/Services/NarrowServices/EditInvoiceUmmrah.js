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
const invoice_helpers_1 = __importStar(require("../../../../../common/helpers/invoice.helpers"));
const common_helper_1 = require("../../../../../common/helpers/common.helper");
const Trxns_1 = __importDefault(require("../../../../../common/helpers/Trxns"));
const invoice_utils_1 = require("../../../utils/invoice.utils");
class EditInvoiceUmmrah extends abstract_services_1.default {
    constructor() {
        super();
        this.editInvoiceUmmrah = (req) => __awaiter(this, void 0, void 0, function* () {
            const { billing_information, invoice_combclient_id, invoice_net_total, invoice_sales_date, invoice_due_date, invoice_sales_man_id, invoice_sub_total, invoice_created_by, invoice_note, invoice_discount, invoice_haji_group_id, hotel_information, passenget_info, invoice_service_charge, invoice_client_previous_due, invoice_vat, invoice_agent_com_amount, invoice_agent_id, invoice_no, invoice_reference, } = req.body;
            // VALIDATE CLIENT AND VENDOR
            const { invoice_total_profit, invoice_total_vendor_price } = yield (0, invoice_helpers_1.InvoiceClientAndVendorValidate)(billing_information, invoice_combclient_id);
            // CLIENT AND COMBINED CLIENT
            const { invoice_client_id, invoice_combined_id } = yield (0, invoice_helpers_1.getClientOrCombId)(invoice_combclient_id);
            const invoice_id = Number(req.params.invoice_id);
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c, _d, _e;
                const conn = this.models.InvoiceUmmarhModels(req, trx);
                const common_conn = this.models.CommonInvoiceModel(req, trx);
                const trxns = new Trxns_1.default(req, trx);
                const { prevCtrxnId, prevClChargeTransId } = yield common_conn.getPreviousInvoices(invoice_id);
                const ctrxn_pnr = passenget_info[0] &&
                    passenget_info.map((item) => item.ticket_pnr).join(', ');
                const tickets_no = passenget_info
                    .map((item) => item.ticket_no)
                    .join(', ');
                const routes = passenget_info &&
                    passenget_info.map((item) => item.ticket_route);
                const flattenedRoutes = [].concat(...routes);
                let ctrxn_route;
                if (flattenedRoutes.length > 0) {
                    ctrxn_route = yield common_conn.getRoutesInfo(flattenedRoutes);
                }
                let note = '';
                const productsIds = billing_information.map((item) => item.billing_product_id);
                if (productsIds.length) {
                    note = yield common_conn.getProductsName(productsIds);
                }
                // CLIENT TRANSACTIONS
                const utils = new invoice_utils_1.InvoiceUtils(req.body, common_conn);
                const clientTransId = yield utils.updateClientTrans(trxns, {
                    prevClChargeTransId,
                    prevCtrxnId,
                    invoice_no,
                    ctrxn_pnr,
                    ctrxn_route,
                    extra_particular: 'Ummrah Package',
                    note,
                    ticket_no: tickets_no,
                });
                const invoice_information = Object.assign(Object.assign({}, clientTransId), { invoice_client_id,
                    invoice_combined_id,
                    invoice_sub_total,
                    invoice_sales_man_id,
                    invoice_net_total,
                    invoice_client_previous_due,
                    invoice_haji_group_id,
                    invoice_sales_date,
                    invoice_due_date, invoice_updated_by: invoice_created_by, invoice_note,
                    invoice_reference,
                    invoice_total_profit,
                    invoice_total_vendor_price });
                yield common_conn.updateInvoiceInformation(invoice_id, invoice_information);
                // AGENT TRANSACTION
                if (invoice_agent_id) {
                    yield invoice_helpers_1.default.invoiceAgentTransactions(this.models.agentProfileModel(req, trx), req.agency_id, invoice_agent_id, invoice_id, invoice_no, invoice_created_by, invoice_agent_com_amount, 'UPDATE', 107, 'INVOICE UMMRAH');
                }
                else {
                    yield invoice_helpers_1.default.deleteAgentTransactions(this.models.agentProfileModel(req, trx), invoice_id, invoice_created_by);
                }
                const invoiceExtraAmount = {
                    extra_amount_invoice_id: invoice_id,
                    invoice_vat,
                    invoice_discount,
                    invoice_service_charge,
                    invoice_agent_id,
                    invoice_agent_com_amount,
                };
                yield common_conn.updateInvoiceExtraAmount(invoiceExtraAmount, invoice_id);
                // NEW BILLING INFO
                for (const item of billing_information) {
                    const billingId = item === null || item === void 0 ? void 0 : item.billing_id;
                    const billing_subtotal = item.billing_quantity * item.billing_unit_price;
                    const billingData = {
                        billing_invoice_id: invoice_id,
                        billing_sales_date: invoice_sales_date,
                        billing_remaining_quantity: item.billing_quantity,
                        billing_cost_price: item.billing_cost_price,
                        billing_quantity: item.billing_quantity,
                        billing_subtotal: billing_subtotal,
                        billing_product_id: item.billing_product_id,
                        billing_profit: item.billing_profit,
                        billing_unit_price: item.billing_unit_price,
                        pax_name: item.pax_name,
                        billing_description: item.billing_description,
                    };
                    let VTrxnBody = null;
                    if (item.billing_comvendor && item.billing_cost_price) {
                        const { combined_id, vendor_id } = (0, common_helper_1.separateCombClientToId)(item.billing_comvendor);
                        const billing_total_cost = item.billing_cost_price * item.billing_quantity;
                        billingData.billing_vendor_id = vendor_id;
                        billingData.billing_combined_id = combined_id;
                        VTrxnBody = {
                            comb_vendor: item.billing_comvendor,
                            vtrxn_amount: billing_total_cost,
                            vtrxn_created_at: invoice_sales_date,
                            vtrxn_note: item.billing_description,
                            vtrxn_particular_id: 31,
                            vtrxn_particular_type: 'Invoice umrah update',
                            vtrxn_pax: item.pax_name,
                            vtrxn_type: combined_id ? 'CREDIT' : 'DEBIT',
                            vtrxn_user_id: invoice_created_by,
                            vtrxn_voucher: invoice_no,
                            vtrxn_airticket_no: tickets_no,
                            vtrxn_pnr: ctrxn_pnr,
                            vtrxn_route: ctrxn_route,
                        };
                    }
                    // DELETE BILLING INFO
                    if (billingId) {
                        const previousBilling = yield conn.getUmrahBillingInfo(billingId);
                        if (item.is_deleted) {
                            yield conn.deleteIUSingleBilling(billingId, invoice_created_by);
                            yield trxns.deleteInvVTrxn(previousBilling);
                        }
                        else if (VTrxnBody) {
                            if ((_a = previousBilling[0]) === null || _a === void 0 ? void 0 : _a.prevTrxnId) {
                                yield trxns.VTrxnUpdate(Object.assign(Object.assign({}, VTrxnBody), { trxn_id: (_b = previousBilling[0]) === null || _b === void 0 ? void 0 : _b.prevTrxnId }));
                                billingData.billing_vtrxn_id = (_c = previousBilling[0]) === null || _c === void 0 ? void 0 : _c.prevTrxnId;
                            }
                            else {
                                billingData.billing_vtrxn_id = yield trxns.VTrxnInsert(VTrxnBody);
                            }
                        }
                        else {
                            yield trxns.deleteInvVTrxn(previousBilling);
                            billingData.billing_vendor_id = null;
                            billingData.billing_combined_id = null;
                            billingData.billing_vtrxn_id = null;
                            billingData.billing_cost_price = 0;
                        }
                        yield conn.updateIUBillingInfo(billingData, billingId);
                    }
                    else {
                        if (VTrxnBody) {
                            billingData.billing_vtrxn_id = yield trxns.VTrxnInsert(VTrxnBody);
                        }
                        yield conn.insertIUBillingInfos(billingData);
                    }
                }
                // ================== @PASSENGER_INFORMATION ==================
                if ((0, invoice_helpers_1.isNotEmpty)(passenget_info)) {
                    for (const item of passenget_info) {
                        const passengerId = item === null || item === void 0 ? void 0 : item.passenger_id;
                        const ummrahPassengerData = {
                            passenger_invoice_id: invoice_id,
                            passenger_passport_id: item.passenger_passport_id,
                            passenger_tracking_number: item.passenger_tracking_number,
                            ticket_pnr: item.ticket_pnr,
                            ticket_airline_id: item.ticket_airline_id,
                            ticket_no: item.ticket_no,
                            ticket_reference_no: item.ticket_reference_no,
                            ticket_journey_date: item.ticket_journey_date,
                            ticket_return_date: item.ticket_return_date,
                        };
                        if (item.is_delete && passengerId) {
                            yield conn.deleteUmmrahPassenger(passengerId, invoice_created_by);
                        }
                        else if (passengerId) {
                            yield conn.deleteUmmrahPassengerRoutes(passengerId, invoice_created_by);
                            yield conn.updateUmmrahPassengerInfo(ummrahPassengerData, passengerId);
                            const ummrahPassengerRoutes = (_d = item === null || item === void 0 ? void 0 : item.ticket_route) === null || _d === void 0 ? void 0 : _d.map((airportId) => {
                                return {
                                    iu_passenger_id: passengerId,
                                    iu_airport_id: airportId,
                                };
                            });
                            if (ummrahPassengerRoutes) {
                                yield conn.insertUmmrahPassengerRoutes(ummrahPassengerRoutes);
                            }
                        }
                        else {
                            const passenger_id = yield conn.insertUmmrahPassengerInfo(ummrahPassengerData);
                            const ummrahPassengerRoutes = (_e = item === null || item === void 0 ? void 0 : item.ticket_route) === null || _e === void 0 ? void 0 : _e.map((item) => {
                                return { iu_passenger_id: passenger_id, iu_airport_id: item };
                            });
                            if (ummrahPassengerRoutes) {
                                yield conn.insertUmmrahPassengerRoutes(ummrahPassengerRoutes);
                            }
                        }
                    }
                }
                if ((0, invoice_helpers_1.isNotEmpty)(hotel_information)) {
                    for (const item of hotel_information) {
                        const hotelId = item.hotel_id;
                        const hotelInfo = {
                            hotel_invoice_id: invoice_id,
                            hotel_check_in_date: item.hotel_check_in_date,
                            hotel_check_out_date: item.hotel_check_out_date,
                            hotel_name: item.hotel_name,
                            hotel_reference_no: item.hotel_reference_no,
                            hotel_room_type_id: item.hotel_room_type_id,
                        };
                        if (hotelId && item.is_deleted) {
                            yield conn.deleteIUHotelInfo(hotelId, invoice_created_by);
                        }
                        else if (hotelId) {
                            yield conn.updateIUHotelInfo(hotelInfo, hotelId);
                        }
                        else {
                            yield conn.insertIUHotelInfos(hotelInfo);
                        }
                    }
                }
                // @Invoic History
                const history_data = {
                    history_activity_type: 'INVOICE_UPDATED',
                    history_created_by: invoice_created_by,
                    history_invoice_id: invoice_id,
                    history_invoice_payment_amount: invoice_net_total,
                    invoicelog_content: 'Invoice ummrah has beeen updated',
                };
                yield common_conn.insertInvoiceHistory(history_data);
                yield this.insertAudit(req, 'update', `Invoice ummrah has been updated, Voucher - ${invoice_no}, Net - ${invoice_net_total}/-`, invoice_created_by, 'INVOICES');
                return {
                    success: true,
                    data: 'Invoice Updated SuccessFully...',
                };
            }));
        });
    }
}
exports.default = EditInvoiceUmmrah;
//# sourceMappingURL=EditInvoiceUmmrah.js.map