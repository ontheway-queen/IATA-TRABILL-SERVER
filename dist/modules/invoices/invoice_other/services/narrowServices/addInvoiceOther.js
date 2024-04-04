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
const Trxns_1 = __importDefault(require("../../../../../common/helpers/Trxns"));
const common_helper_1 = require("../../../../../common/helpers/common.helper");
const invoice_helpers_1 = __importStar(require("../../../../../common/helpers/invoice.helpers"));
const CommonAddMoneyReceipt_1 = __importDefault(require("../../../../../common/services/CommonAddMoneyReceipt"));
const CommonSmsSend_services_1 = __importDefault(require("../../../../smsSystem/utils/CommonSmsSend.services"));
const invoice_utils_1 = require("../../../utils/invoice.utils");
class AddInvoiceOther extends abstract_services_1.default {
    constructor() {
        super();
        this.addInvoiceOtehr = (req) => __awaiter(this, void 0, void 0, function* () {
            const { invoice_net_total, invoice_combclient_id, invoice_created_by, invoice_note, invoice_sales_date, invoice_due_date, invoice_sales_man_id, invoice_sub_total, invoice_vat, invoice_service_charge, invoice_discount, invoice_agent_id, invoice_agent_com_amount, money_receipt, billing_information, hotel_information, ticketInfo, transport_information, passport_information, invoice_reference, } = req.body;
            // VALIDATE CLIENT AND VENDOR
            const { invoice_total_profit, invoice_total_vendor_price, pax_name } = yield (0, invoice_helpers_1.InvoiceClientAndVendorValidate)(billing_information, invoice_combclient_id);
            // VALIDATE MONEY RECEIPT AMOUNT
            (0, invoice_helpers_1.MoneyReceiptAmountIsValid)(money_receipt, invoice_net_total);
            // CLIENT AND COMBINED CLIENT
            const { invoice_client_id, invoice_combined_id } = (0, invoice_helpers_1.getClientOrCombId)(invoice_combclient_id);
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const conn = this.models.invoiceOtherModel(req, trx);
                const common_conn = this.models.CommonInvoiceModel(req, trx);
                const trxns = new Trxns_1.default(req, trx);
                const productsIds = billing_information.map((item) => item.billing_product_id);
                let productName = '';
                if (productsIds.length) {
                    productName = yield conn.getProductsName(productsIds);
                }
                const invoice_no = yield this.generateVoucher(req, 'IO');
                const ctrxn_ticket = ticketInfo.length > 0 &&
                    ticketInfo.map((item) => item.ticket_no).join(' ,');
                const ctrxn_pnr = ticketInfo.map((item) => item.ticket_pnr).join(', ');
                const utils = new invoice_utils_1.InvoiceUtils(req.body, common_conn);
                // CLIENT TRANSACTIONS
                const clientTransId = yield utils.clientTrans(trxns, invoice_no, ctrxn_pnr, (_a = ticketInfo[0]) === null || _a === void 0 ? void 0 : _a.ticket_route, ctrxn_ticket, productName);
                const invoieInfo = Object.assign(Object.assign({}, clientTransId), { invoice_client_id,
                    invoice_combined_id,
                    invoice_created_by,
                    invoice_net_total, invoice_no: invoice_no, invoice_note, invoice_category_id: 5, invoice_sales_date,
                    invoice_due_date,
                    invoice_sales_man_id,
                    invoice_sub_total,
                    invoice_total_profit,
                    invoice_total_vendor_price,
                    invoice_reference });
                const invoice_id = yield common_conn.insertInvoicesInfo(invoieInfo);
                // AGENT TRANSACTION
                yield invoice_helpers_1.default.invoiceAgentTransactions(this.models.agentProfileModel(req, trx), req.agency_id, invoice_agent_id, invoice_id, invoice_no, invoice_created_by, invoice_agent_com_amount, 'CREATE', 98, 'INVOICE OTHER');
                const invoiceExtraAmount = {
                    extra_amount_invoice_id: invoice_id,
                    invoice_vat,
                    invoice_service_charge,
                    invoice_discount,
                    invoice_agent_id,
                    invoice_agent_com_amount,
                };
                yield common_conn.insertInvoiceExtraAmount(invoiceExtraAmount);
                // PASSPORT INFORMATION
                if (passport_information && (0, invoice_helpers_1.isNotEmpty)(passport_information[0])) {
                    for (const passInfo of passport_information) {
                        const { passport_id } = passInfo;
                        yield conn.insertOtherInvoicePass({
                            other_pass_passport_id: passport_id,
                            other_pass_invoice_id: invoice_id,
                        });
                    }
                }
                // TICKET INFO
                if (ticketInfo && (0, invoice_helpers_1.isNotEmpty)(ticketInfo[0])) {
                    const ticketsInfo = yield Promise.all(ticketInfo === null || ticketInfo === void 0 ? void 0 : ticketInfo.map((item) => __awaiter(this, void 0, void 0, function* () {
                        return Object.assign(Object.assign({}, item), { ticket_invoice_id: invoice_id });
                    })));
                    yield conn.insertTicketInfo(ticketsInfo);
                }
                // HOTEL INFORMATION
                if ((0, invoice_helpers_1.isNotEmpty)(hotel_information) && hotel_information.length) {
                    const hotelInfo = hotel_information === null || hotel_information === void 0 ? void 0 : hotel_information.map((item) => {
                        return Object.assign(Object.assign({}, item), { hotel_check_in_date: item.hotel_check_in_date && (item === null || item === void 0 ? void 0 : item.hotel_check_in_date), hotel_check_out_date: item.hotel_check_in_date && (item === null || item === void 0 ? void 0 : item.hotel_check_out_date), hotel_invoice_id: invoice_id });
                    });
                    yield conn.insertHotelInfo(hotelInfo);
                }
                // TRANSPORT INFORMATION
                if ((0, invoice_helpers_1.isNotEmpty)(transport_information) && transport_information.length) {
                    const transportsData = transport_information === null || transport_information === void 0 ? void 0 : transport_information.map((item) => {
                        return Object.assign(Object.assign({}, item), { transport_other_invoice_id: invoice_id });
                    });
                    yield conn.insertTransportInfo(transportsData);
                }
                // BILLING INFO AND INVOICE COST DETAILS
                for (const billingInfo of billing_information) {
                    const { billing_comvendor, billing_cost_price, billing_quantity, billing_product_id, billing_profit, billing_unit_price, pax_name, billing_description, } = billingInfo;
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
                    if (billing_comvendor && billing_cost_price) {
                        const total_cost_price = billing_cost_price * billing_quantity;
                        const { combined_id, vendor_id } = (0, common_helper_1.separateCombClientToId)(billing_comvendor);
                        billingInfoData.billing_cost_price = billing_cost_price;
                        billingInfoData.billing_combined_id = combined_id;
                        billingInfoData.billing_vendor_id = vendor_id;
                        const productName = yield common_conn.getProductById(billingInfo.billing_product_id);
                        let vtrxn_particular_type = `Invoice other (${productName}). \n`;
                        // VENDOR TRANSACTIONS
                        const VTrxnBody = {
                            comb_vendor: billing_comvendor,
                            vtrxn_amount: total_cost_price,
                            vtrxn_created_at: invoice_sales_date,
                            vtrxn_note: billing_description,
                            vtrxn_particular_id: 150,
                            vtrxn_particular_type: vtrxn_particular_type,
                            vtrxn_pax: pax_name,
                            vtrxn_type: combined_id ? 'CREDIT' : 'DEBIT',
                            vtrxn_user_id: invoice_created_by,
                            vtrxn_voucher: invoice_no,
                            vtrxn_pnr: ctrxn_pnr,
                            vtrxn_airticket_no: ctrxn_ticket,
                        };
                        billingInfoData.billing_vtrxn_id = yield trxns.VTrxnInsert(VTrxnBody);
                    }
                    yield conn.insertBillingInfo(billingInfoData);
                }
                // MONEY RECEIPT
                const moneyReceiptInvoice = {
                    invoice_client_id,
                    invoice_combined_id,
                    invoice_created_by,
                    invoice_id,
                };
                yield new CommonAddMoneyReceipt_1.default().commonAddMoneyReceipt(req, moneyReceiptInvoice, trx);
                const history_data = {
                    history_activity_type: 'INVOICE_CREATED',
                    history_created_by: invoice_created_by,
                    history_invoice_id: invoice_id,
                    history_invoice_payment_amount: invoice_net_total,
                    invoicelog_content: 'Invoice other has been created',
                };
                yield common_conn.insertInvoiceHistory(history_data);
                yield this.updateVoucher(req, 'IO');
                const smsInvoiceDate = {
                    invoice_client_id: invoice_client_id,
                    invoice_combined_id: invoice_combined_id,
                    invoice_sales_date,
                    invoice_created_by,
                    invoice_id,
                };
                yield new CommonSmsSend_services_1.default().sendSms(req, smsInvoiceDate, trx);
                const message = `Invoice other has been created, Voucher - ${invoice_no}, Net - ${invoice_net_total}/-`;
                yield this.insertAudit(req, 'create', message, invoice_created_by, 'INVOICES');
                return {
                    success: true,
                    message,
                    data: { invoice_id },
                };
            }));
        });
    }
}
exports.default = AddInvoiceOther;
//# sourceMappingURL=addInvoiceOther.js.map