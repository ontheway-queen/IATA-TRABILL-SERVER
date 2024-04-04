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
const Trxns_1 = __importDefault(require("../../../../../common/helpers/Trxns"));
const CommonAddMoneyReceipt_1 = __importDefault(require("../../../../../common/services/CommonAddMoneyReceipt"));
const CommonSmsSend_services_1 = __importDefault(require("../../../../smsSystem/utils/CommonSmsSend.services"));
const invoicetour_helpers_1 = __importDefault(require("../../utils/invoicetour.helpers"));
class AddInvoiceTour extends abstract_services_1.default {
    constructor() {
        super();
        this.addInvoiceTour = (req) => __awaiter(this, void 0, void 0, function* () {
            const { invoice_net_total, invoice_sub_total, invoice_combclient_id, itour_day, itour_from_date, itour_to_date, itour_group_id, itour_night, invoice_sales_date, invoice_due_date, invoice_sales_man_id, invoice_vat, invoice_discount, invoice_agent_com_amount, invoice_agent_id, invoice_service_charge, invoice_created_by, invoice_note, tourBilling, invoice_reference, ticket_no, ticket_pnr, ticket_route, money_receipt, } = req.body;
            (0, invoice_helpers_1.MoneyReceiptAmountIsValid)(money_receipt, invoice_net_total);
            const { invoice_client_id, invoice_combined_id } = yield (0, invoice_helpers_1.getClientOrCombId)(invoice_combclient_id);
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.invoiceTourModels(req, trx);
                const conn_vendor = this.models.vendorModel(req, trx);
                const common_conn = this.models.CommonInvoiceModel(req, trx);
                const combined_conn = this.models.combineClientModel(req, trx);
                const trxns = new Trxns_1.default(req, trx);
                const invoice_no = yield this.generateVoucher(req, 'ITP');
                const invoice_client_previous_due = yield this.models
                    .MoneyReceiptModels(req)
                    .invoiceDueByClient(invoice_client_id, invoice_combined_id);
                const ctrxn_pax = tourBilling
                    .map((item) => item.billing_pax_name)
                    .join(' ,');
                let ctrxn_route;
                if (ticket_route) {
                    ctrxn_route = yield common_conn.getRoutesInfo(ticket_route);
                }
                const clTrxnBody = {
                    ctrxn_type: 'DEBIT',
                    ctrxn_amount: invoice_net_total,
                    ctrxn_cl: invoice_combclient_id,
                    ctrxn_voucher: invoice_no,
                    ctrxn_particular_id: 100,
                    ctrxn_created_at: invoice_sales_date,
                    ctrxn_note: invoice_note,
                    ctrxn_particular_type: 'Invoice tour create',
                    ctrxn_pax,
                    ctrxn_pnr: ticket_pnr,
                    ctrxn_route: ctrxn_route,
                    ctrxn_airticket_no: ticket_no,
                };
                const invoice_cltrxn_id = yield trxns.clTrxnInsert(clTrxnBody);
                const { totalProfit, totalCost } = tourBilling.reduce((acc, billing) => {
                    var _a;
                    const { totalCost, totalSales, totalProfit } = acc;
                    return {
                        totalCost: totalCost + billing.billing_cost_price,
                        totalSales: totalSales + billing.billing_total_sales,
                        totalProfit: totalProfit + ((_a = billing.billing_profit) !== null && _a !== void 0 ? _a : 0),
                    };
                }, { totalCost: 0, totalSales: 0, totalProfit: 0 });
                const invoiceData = {
                    invoice_client_id,
                    invoice_combined_id,
                    invoice_sales_man_id,
                    invoice_sales_date,
                    invoice_due_date,
                    invoice_no: invoice_no,
                    invoice_total_profit: totalProfit,
                    invoice_created_by,
                    invoice_client_previous_due,
                    invoice_category_id: 4,
                    invoice_net_total,
                    invoice_sub_total,
                    invoice_note,
                    invoice_cltrxn_id,
                    invoice_reference,
                    invoice_total_vendor_price: totalCost,
                };
                const invoice_id = yield common_conn.insertInvoicesInfo(invoiceData);
                // AGENT TRANSACTION
                yield invoice_helpers_1.default.invoiceAgentTransactions(this.models.agentProfileModel(req, trx), req.agency_id, invoice_agent_id, invoice_id, invoice_no, invoice_created_by, invoice_agent_com_amount, 'CREATE', 100, 'TOUR PACKAGE');
                // TOUR VENDOR COST BILLING INSERT
                yield invoicetour_helpers_1.default.addVendorCostBilling(req, conn, conn_vendor, combined_conn, invoice_id, trx);
                const invoiceExtraAmount = {
                    extra_amount_invoice_id: invoice_id,
                    invoice_vat,
                    invoice_service_charge,
                    invoice_discount,
                    invoice_agent_id,
                    invoice_agent_com_amount,
                };
                yield common_conn.insertInvoiceExtraAmount(invoiceExtraAmount);
                const invoiceTourItemData = {
                    itour_day,
                    itour_from_date,
                    itour_to_date,
                    itour_group_id,
                    itour_night,
                    itour_invoice_id: invoice_id,
                };
                yield conn.insertInvoiceTourItem(invoiceTourItemData);
                // @HISTORY
                const history_data = {
                    history_activity_type: 'INVOICE_CREATED',
                    history_invoice_id: invoice_id,
                    history_created_by: invoice_created_by,
                    invoicelog_content: `Invoice tour has been created`,
                };
                yield common_conn.insertInvoiceHistory(history_data);
                yield this.updateVoucher(req, 'ITP');
                // MOENY RECEIPT
                const moneyReceiptInvoice = {
                    invoice_client_id,
                    invoice_combined_id,
                    invoice_created_by,
                    invoice_id,
                };
                yield new CommonAddMoneyReceipt_1.default().commonAddMoneyReceipt(req, moneyReceiptInvoice, trx);
                const smsInvoiceDate = {
                    invoice_client_id: invoice_client_id,
                    invoice_combined_id: invoice_combined_id,
                    invoice_sales_date,
                    invoice_created_by,
                    invoice_id,
                };
                yield new CommonSmsSend_services_1.default().sendSms(req, smsInvoiceDate, trx);
                yield this.insertAudit(req, 'create', `Invoice tour has been created, Voucher - ${invoice_no}, Net - ${invoice_net_total}/-`, invoice_created_by, 'INVOICES');
                return {
                    success: true,
                    message: 'Invoice tour package has been created',
                    data: { invoice_id },
                };
            }));
        });
    }
}
exports.default = AddInvoiceTour;
//# sourceMappingURL=AddInvoiceTour.js.map