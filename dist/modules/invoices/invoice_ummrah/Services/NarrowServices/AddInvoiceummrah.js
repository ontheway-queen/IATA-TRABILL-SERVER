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
const CommonAddMoneyReceipt_1 = __importDefault(require("../../../../../common/services/CommonAddMoneyReceipt"));
const CommonSmsSend_services_1 = __importDefault(require("../../../../smsSystem/utils/CommonSmsSend.services"));
const invoice_utils_1 = require("../../../utils/invoice.utils");
class AddInvoiceUmmrah extends abstract_services_1.default {
    constructor() {
        super();
        this.postInvoiceUmmrah = (req) => __awaiter(this, void 0, void 0, function* () {
            const { billing_information, invoice_combclient_id, invoice_net_total, invoice_sales_date, invoice_due_date, invoice_sales_man_id, invoice_sub_total, invoice_created_by, invoice_note, invoice_discount, invoice_haji_group_id, hotel_information, passenget_info, invoice_service_charge, invoice_client_previous_due, invoice_vat, invoice_agent_com_amount, invoice_agent_id, money_receipt, invoice_reference, } = req.body;
            // VALIDATE CLIENT AND VENDOR
            const { invoice_total_profit, invoice_total_vendor_price } = yield (0, invoice_helpers_1.InvoiceClientAndVendorValidate)(billing_information, invoice_combclient_id);
            // VALIDATE MONEY RECEIPT AMOUNT
            (0, invoice_helpers_1.MoneyReceiptAmountIsValid)(money_receipt, invoice_net_total);
            // CLIENT AND COMBINED CLIENT
            const { invoice_client_id, invoice_combined_id } = yield (0, invoice_helpers_1.getClientOrCombId)(invoice_combclient_id);
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const conn = this.models.InvoiceUmmarhModels(req, trx);
                const common_conn = this.models.CommonInvoiceModel(req, trx);
                const trxns = new Trxns_1.default(req, trx);
                const invoice_no = yield this.generateVoucher(req, 'IU');
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
                const productsIds = billing_information.map((item) => item.billing_product_id);
                let note = '';
                if (productsIds.length) {
                    note = yield common_conn.getProductsName(productsIds);
                }
                // CLIENT TRANSACTIONS
                const utils = new invoice_utils_1.InvoiceUtils(req.body, common_conn);
                const clientTransId = yield utils.clientTrans(trxns, {
                    invoice_no,
                    ctrxn_pnr,
                    ctrxn_route,
                    extra_particular: 'Ummrah Package',
                    note,
                    ticket_no: tickets_no,
                });
                const invoice_information = Object.assign(Object.assign({}, clientTransId), { invoice_client_id,
                    invoice_combined_id, invoice_no: invoice_no, invoice_sub_total, invoice_category_id: 26, invoice_sales_man_id,
                    invoice_net_total,
                    invoice_client_previous_due,
                    invoice_haji_group_id,
                    invoice_sales_date,
                    invoice_due_date,
                    invoice_created_by,
                    invoice_note,
                    invoice_total_profit,
                    invoice_total_vendor_price,
                    invoice_reference });
                const invoice_id = yield common_conn.insertInvoicesInfo(invoice_information);
                // AGENT TRANSACTION
                yield invoice_helpers_1.default.invoiceAgentTransactions(this.models.agentProfileModel(req, trx), req.agency_id, invoice_agent_id, invoice_id, invoice_no, invoice_created_by, invoice_agent_com_amount, 'CREATE', 106, 'INVOICE UMMRAH');
                const invoice_extra_ammount = {
                    extra_amount_invoice_id: invoice_id,
                    invoice_discount,
                    invoice_vat,
                    invoice_agent_com_amount,
                    invoice_agent_id,
                    invoice_service_charge,
                };
                yield common_conn.insertInvoiceExtraAmount(invoice_extra_ammount);
                if ((0, invoice_helpers_1.isNotEmpty)(passenget_info) &&
                    (passenget_info === null || passenget_info === void 0 ? void 0 : passenget_info.length) &&
                    (0, invoice_helpers_1.isNotEmpty)(passenget_info[0])) {
                    for (const item of passenget_info) {
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
                        const passenger_id = yield conn.insertUmmrahPassengerInfo(ummrahPassengerData);
                        const ummrahPassengerRoutes = (_a = item === null || item === void 0 ? void 0 : item.ticket_route) === null || _a === void 0 ? void 0 : _a.map((item) => {
                            return { iu_passenger_id: passenger_id, iu_airport_id: item };
                        });
                        if (ummrahPassengerRoutes) {
                            yield conn.insertUmmrahPassengerRoutes(ummrahPassengerRoutes);
                        }
                    }
                }
                if ((0, invoice_helpers_1.isNotEmpty)(hotel_information)) {
                    const IUHotelInfos = hotel_information === null || hotel_information === void 0 ? void 0 : hotel_information.map((item) => {
                        return Object.assign(Object.assign({}, item), { hotel_invoice_id: invoice_id });
                    });
                    yield conn.insertIUHotelInfos(IUHotelInfos);
                }
                for (const item of billing_information) {
                    const { billing_comvendor, billing_cost_price, billing_quantity, billing_product_id, billing_profit, billing_unit_price, pax_name, billing_description, } = item;
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
                    if (billing_cost_price && billing_comvendor) {
                        const billing_total_cost = billing_cost_price * billing_quantity;
                        const { combined_id, vendor_id } = (0, common_helper_1.separateCombClientToId)(billing_comvendor);
                        billingInfoData.billing_combined_id = combined_id;
                        billingInfoData.billing_vendor_id = vendor_id;
                        const VTrxnBody = {
                            comb_vendor: billing_comvendor,
                            vtrxn_amount: billing_total_cost,
                            vtrxn_created_at: invoice_sales_date,
                            vtrxn_note: billing_description,
                            vtrxn_particular_id: 106,
                            vtrxn_particular_type: 'Invoice ummrah create',
                            vtrxn_pax: pax_name,
                            vtrxn_type: combined_id ? 'CREDIT' : 'DEBIT',
                            vtrxn_user_id: invoice_created_by,
                            vtrxn_voucher: invoice_no,
                            vtrxn_airticket_no: tickets_no,
                            vtrxn_pnr: ctrxn_pnr,
                            vtrxn_route: ctrxn_route,
                        };
                        billingInfoData.billing_vtrxn_id = yield trxns.VTrxnInsert(VTrxnBody);
                    }
                    yield conn.insertIUBillingInfos(billingInfoData);
                }
                // MONEY RECEIPT
                const moneyReceiptInvoice = {
                    invoice_client_id,
                    invoice_combined_id,
                    invoice_created_by,
                    invoice_id,
                };
                yield new CommonAddMoneyReceipt_1.default().commonAddMoneyReceipt(req, moneyReceiptInvoice, trx);
                // @Invoic History
                const history_data = {
                    history_activity_type: 'INVOICE_CREATED',
                    history_created_by: invoice_created_by,
                    history_invoice_id: invoice_id,
                    history_invoice_payment_amount: invoice_net_total,
                    invoicelog_content: 'Invoice ummrah has been created',
                };
                yield common_conn.insertInvoiceHistory(history_data);
                yield this.updateVoucher(req, 'IU');
                const smsInvoiceDate = {
                    invoice_client_id: invoice_client_id,
                    invoice_combined_id: invoice_combined_id,
                    invoice_sales_date,
                    invoice_created_by,
                    invoice_id,
                };
                yield new CommonSmsSend_services_1.default().sendSms(req, smsInvoiceDate, trx);
                yield this.insertAudit(req, 'create', `Invoice ummrah has been created, Voucher - ${invoice_no}, Net - ${invoice_net_total}/-`, invoice_created_by, 'INVOICES');
                return {
                    success: true,
                    message: 'Invoice ummrah has been created',
                    data: { invoice_id },
                };
            }));
        });
    }
}
exports.default = AddInvoiceUmmrah;
//# sourceMappingURL=AddInvoiceummrah.js.map