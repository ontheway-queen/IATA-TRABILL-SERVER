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
const invoice_utils_1 = require("../../../utils/invoice.utils");
const invoicetour_helpers_1 = __importDefault(require("../../utils/invoicetour.helpers"));
class EditInvoiceTour extends abstract_services_1.default {
    constructor() {
        super();
        this.editInvoiceTour = (req) => __awaiter(this, void 0, void 0, function* () {
            const { invoice_net_total, invoice_reference, invoice_sub_total, invoice_combclient_id, itour_day, itour_from_date, itour_to_date, itour_group_id, itour_night, invoice_sales_date, invoice_due_date, invoice_sales_man_id, invoice_client_previous_due, invoice_vat, invoice_discount, invoice_agent_com_amount, invoice_agent_id, invoice_service_charge, invoice_created_by, invoice_note, tourBilling, invoice_no, ticket_route, ticket_pnr, ticket_no, } = req.body;
            // CLIENT AND COMBINED CLIENT
            const { invoice_client_id, invoice_combined_id } = yield (0, invoice_helpers_1.getClientOrCombId)(invoice_combclient_id);
            const invoice_id = Number(req.params.invoice_id);
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.invoiceTourModels(req, trx);
                const common_conn = this.models.CommonInvoiceModel(req, trx);
                const trxns = new Trxns_1.default(req, trx);
                const { prevCtrxnId, prevClChargeTransId } = yield common_conn.getPreviousInvoices(invoice_id);
                const ctrxn_pax = tourBilling
                    .map((item) => item.billing_pax_name)
                    .join(' ,');
                let ctrxn_route;
                if (ticket_route) {
                    ctrxn_route = yield common_conn.getRoutesInfo(ticket_route);
                }
                const productsIds = tourBilling.map((item) => item.billing_product_id);
                let note = '';
                if (productsIds.length) {
                    note = yield common_conn.getProductsName(productsIds);
                }
                // CLIENT TRANSACTIONS
                const utils = new invoice_utils_1.InvoiceUtils(req.body, common_conn);
                const clientTransId = yield utils.updateClientTrans(trxns, {
                    prevClChargeTransId,
                    prevCtrxnId,
                    invoice_no,
                    ctrxn_pnr: ticket_pnr,
                    ctrxn_route,
                    tr_type: 17,
                    dis_tr_type: 18,
                    ticket_no,
                    note,
                });
                if (invoice_agent_id) {
                    // AGENT TRANSACTION
                    yield invoice_helpers_1.default.invoiceAgentTransactions(this.models.agentProfileModel(req, trx), req.agency_id, invoice_agent_id, invoice_id, invoice_no, invoice_created_by, invoice_agent_com_amount, 'UPDATE', 101, 'TOUR PACKAGE');
                }
                else {
                    yield invoice_helpers_1.default.deleteAgentTransactions(this.models.agentProfileModel(req, trx), invoice_id, invoice_created_by);
                }
                // TOUR VENDOR COST BILLING INSERT
                yield invoicetour_helpers_1.default.addVendorCostBilling(req, conn, invoice_id, trx);
                const { totalCost, totalSales, totalProfit } = tourBilling.reduce((acc, billing) => {
                    var _a;
                    const { totalCost, totalSales, totalProfit } = acc;
                    return {
                        totalCost: totalCost + billing.billing_cost_price,
                        totalSales: totalSales + billing.billing_total_sales,
                        totalProfit: totalProfit + ((_a = billing.billing_profit) !== null && _a !== void 0 ? _a : 0),
                    };
                }, { totalCost: 0, totalSales: 0, totalProfit: 0 });
                // UPDATE TOUR INVOICES
                const invoiceData = Object.assign(Object.assign({}, clientTransId), { invoice_client_id,
                    invoice_sales_man_id,
                    invoice_sales_date,
                    invoice_due_date, invoice_updated_by: invoice_created_by, invoice_net_total,
                    invoice_sub_total,
                    invoice_note,
                    invoice_combined_id, invoice_total_profit: totalProfit, invoice_total_vendor_price: totalCost, invoice_client_previous_due,
                    invoice_reference });
                yield common_conn.updateInvoiceInformation(invoice_id, invoiceData);
                const invoiceExtraAmount = {
                    extra_amount_invoice_id: invoice_id,
                    invoice_vat,
                    invoice_service_charge,
                    invoice_discount,
                    invoice_agent_id,
                    invoice_agent_com_amount,
                };
                yield common_conn.updateInvoiceExtraAmount(invoiceExtraAmount, invoice_id);
                const invoiceTourItemData = {
                    itour_day,
                    itour_from_date,
                    itour_to_date,
                    itour_group_id,
                    itour_night,
                    itour_invoice_id: invoice_id,
                };
                yield conn.updateInvoiceTourItem(invoiceTourItemData, invoice_id);
                // @HISTORY
                const history_data = {
                    history_activity_type: 'INVOICE_UPDATED',
                    history_invoice_id: invoice_id,
                    history_created_by: invoice_created_by,
                    invoicelog_content: `Invoice tour package has been updated`,
                };
                yield common_conn.insertInvoiceHistory(history_data);
                yield this.insertAudit(req, 'update', `Invoice tour has been updated, Voucher - ${invoice_no}, Net - ${invoice_net_total}/-`, invoice_created_by, 'INVOICES');
                return {
                    success: true,
                    message: 'Invoice tour package has been updated',
                };
            }));
        });
    }
}
exports.default = EditInvoiceTour;
//# sourceMappingURL=EditInvoiceTour.js.map