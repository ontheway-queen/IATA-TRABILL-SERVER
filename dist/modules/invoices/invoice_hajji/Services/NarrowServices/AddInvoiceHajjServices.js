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
const invoice_helpers_1 = __importStar(require("../../../../../common/helpers/invoice.helpers"));
const CommonAddMoneyReceipt_1 = __importDefault(require("../../../../../common/services/CommonAddMoneyReceipt"));
const CommonSmsSend_services_1 = __importDefault(require("../../../../smsSystem/utils/CommonSmsSend.services"));
const invoice_utils_1 = require("../../../utils/invoice.utils");
const CommonHajjDetailsInsert_1 = __importDefault(require("../commonServices/CommonHajjDetailsInsert"));
class AddInvoiceHajjServices extends abstract_services_1.default {
    constructor() {
        super();
        this.addInvoiceHajjServices = (req) => __awaiter(this, void 0, void 0, function* () {
            const { invoice_combclient_id, invoice_agent_id, invoice_net_total, invoice_sales_date, invoice_due_date, invoice_sales_man_id, invoice_sub_total, invoice_created_by, invoice_note, invoice_hajj_session, invoice_haji_group_id, invoice_service_charge, invoice_discount, invoice_agent_com_amount, invoice_client_previous_due, invoice_vat, hajj_total_pax, billing_information, invoice_hajj_routes, pilgrims_information, money_receipt, invoice_reference, } = req.body;
            // VALIDATE CLIENT AND VENDOR
            const { invoice_total_profit, invoice_total_vendor_price } = yield (0, invoice_helpers_1.InvoiceClientAndVendorValidate)(billing_information, invoice_combclient_id);
            // VALIDATE MONEY RECEIPT AMOUNT
            (0, invoice_helpers_1.MoneyReceiptAmountIsValid)(money_receipt, invoice_net_total);
            // CLIENT AND COMBINED CLIENT
            const { invoice_client_id, invoice_combined_id } = (0, invoice_helpers_1.getClientOrCombId)(invoice_combclient_id);
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const common_conn = this.models.CommonInvoiceModel(req, trx);
                const trxns = new Trxns_1.default(req, trx);
                const invoice_no = yield this.generateVoucher(req, 'IH');
                // CLIENT COMBINED TRANSACTIONS
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
                const productsIds = billing_information.map((item) => item.billing_product_id);
                let note = '';
                if (productsIds.length) {
                    note = yield common_conn.getProductsName(productsIds);
                }
                // CLIENT TRANSACTIONS
                const utils = new invoice_utils_1.InvoiceUtils(req.body, common_conn);
                const clientTransId = yield utils.clientTrans(trxns, {
                    tr_type: 11,
                    dis_tr_type: 12,
                    invoice_no,
                    ticket_no: ctrnx_ticket_no,
                    ctrxn_pnr,
                    ctrxn_route,
                    note,
                });
                const invoice_information = Object.assign(Object.assign({}, clientTransId), { invoice_client_id, invoice_no: invoice_no, invoice_sub_total, invoice_category_id: 31, invoice_sales_man_id,
                    invoice_net_total,
                    invoice_client_previous_due,
                    invoice_haji_group_id,
                    invoice_sales_date,
                    invoice_due_date,
                    invoice_created_by, invoice_hajj_session: new Date(invoice_hajj_session).getFullYear(), invoice_note,
                    invoice_combined_id,
                    invoice_total_profit,
                    invoice_total_vendor_price,
                    invoice_reference });
                const invoice_id = yield common_conn.insertInvoicesInfo(invoice_information);
                // AGENT TRANSACTION
                yield invoice_helpers_1.default.invoiceAgentTransactions(this.models.agentProfileModel(req, trx), req.agency_id, invoice_agent_id, invoice_id, invoice_no, invoice_created_by, invoice_agent_com_amount, 'CREATE', 104, 'INVOICE HAJJ');
                const invoiceExtraAmount = {
                    extra_amount_invoice_id: invoice_id,
                    invoice_vat,
                    invoice_service_charge,
                    invoice_discount,
                    invoice_agent_id,
                    invoice_agent_com_amount,
                    hajj_total_pax,
                };
                yield common_conn.insertInvoiceExtraAmount(invoiceExtraAmount);
                // air ticket routes insert
                if (invoice_hajj_routes === null || invoice_hajj_routes === void 0 ? void 0 : invoice_hajj_routes.length) {
                    const airticketRoutes = invoice_hajj_routes.map((airoute_route_sector_id) => {
                        return {
                            airoute_invoice_id: invoice_id,
                            airoute_route_sector_id,
                        };
                    });
                    yield common_conn.insertAirticketRoute(airticketRoutes);
                }
                yield new CommonHajjDetailsInsert_1.default().CommonHajjDetailsInsert(req, invoice_id, trx);
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
                    invoicelog_content: 'Invoice hajji has been created',
                };
                yield common_conn.insertInvoiceHistory(history_data);
                yield this.updateVoucher(req, 'IH');
                const smsInvoiceDate = {
                    invoice_client_id: invoice_client_id,
                    invoice_combined_id: invoice_combined_id,
                    invoice_sales_date,
                    invoice_created_by,
                    invoice_id,
                };
                yield new CommonSmsSend_services_1.default().sendSms(req, smsInvoiceDate, trx);
                yield this.insertAudit(req, 'create', `Invoice hajj has been created, Voucher - ${invoice_no}, Net - ${invoice_net_total}/-`, invoice_created_by, 'INVOICES');
                return {
                    success: true,
                    message: 'Invoice hajj has been created',
                    data: { invoice_id },
                };
            }));
        });
    }
}
exports.default = AddInvoiceHajjServices;
//# sourceMappingURL=AddInvoiceHajjServices.js.map