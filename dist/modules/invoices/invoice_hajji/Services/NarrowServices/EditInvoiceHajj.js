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
const invoice_utils_1 = require("../../../utils/invoice.utils");
const CommonHajjDetailsInsert_1 = __importDefault(require("../commonServices/CommonHajjDetailsInsert"));
class EditInvoiceHajj extends abstract_services_1.default {
    constructor() {
        super();
        this.editInvoiceHajj = (req) => __awaiter(this, void 0, void 0, function* () {
            const { invoice_combclient_id, invoice_agent_id, invoice_net_total, invoice_sales_date, invoice_due_date, invoice_sales_man_id, invoice_sub_total, invoice_created_by, invoice_note, invoice_hajj_session, invoice_haji_group_id, invoice_service_charge, invoice_discount, invoice_agent_com_amount, invoice_client_previous_due, invoice_vat, invoice_hajj_routes, billing_information, pilgrims_information, invoice_no, invoice_reference, } = req.body;
            // VALIDATE CLIENT AND VENDOR
            const { invoice_total_profit, invoice_total_vendor_price } = yield (0, invoice_helpers_1.InvoiceClientAndVendorValidate)(billing_information, invoice_combclient_id);
            // CLIENT AND COMBINED CLIENT
            const { invoice_client_id, invoice_combined_id } = yield (0, invoice_helpers_1.getClientOrCombId)(invoice_combclient_id);
            const invoice_id = Number(req.params.id);
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const common_conn = this.models.CommonInvoiceModel(req, trx);
                const trxns = new Trxns_1.default(req, trx);
                const { prevCtrxnId, prevClChargeTransId } = yield common_conn.getPreviousInvoices(invoice_id);
                const ctrxn_pax = billing_information[0] &&
                    billing_information.map((item) => item.pax_name).join(' ,');
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
                const clientTransId = yield utils.updateClientTrans(trxns, {
                    prevClChargeTransId,
                    prevCtrxnId,
                    extra_particular: 'Hajj',
                    invoice_no,
                    ticket_no: ctrnx_ticket_no,
                    ctrxn_pax,
                    ctrxn_pnr,
                    ctrxn_route,
                    note,
                });
                const invoice_information = Object.assign(Object.assign({}, clientTransId), { invoice_client_id,
                    invoice_sub_total,
                    invoice_sales_man_id,
                    invoice_net_total,
                    invoice_client_previous_due,
                    invoice_haji_group_id,
                    invoice_sales_date,
                    invoice_due_date, invoice_updated_by: invoice_created_by, invoice_hajj_session: new Date(invoice_hajj_session).getFullYear(), invoice_note,
                    invoice_combined_id,
                    invoice_reference,
                    invoice_total_profit,
                    invoice_total_vendor_price });
                yield common_conn.updateInvoiceInformation(invoice_id, invoice_information);
                // AGENT TRANSACTIONS
                if (invoice_agent_id) {
                    yield invoice_helpers_1.default.invoiceAgentTransactions(this.models.agentProfileModel(req, trx), req.agency_id, invoice_agent_id, invoice_id, invoice_no, invoice_created_by, invoice_agent_com_amount, 'UPDATE', 105, 'INVOICE HAJJ');
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
                // common_invoice_billing
                yield new CommonHajjDetailsInsert_1.default().CommonHajjDetailsInsert(req, invoice_id, trx);
                // @Invoice History
                const history_data = {
                    history_activity_type: 'INVOICE_UPDATED',
                    history_created_by: invoice_created_by,
                    history_invoice_id: invoice_id,
                    history_invoice_payment_amount: invoice_net_total,
                    invoicelog_content: 'Invoice hajji has been updated',
                };
                yield common_conn.insertInvoiceHistory(history_data);
                yield this.insertAudit(req, 'update', `Invoice hajj has been updated, Voucher - ${invoice_no}, Net - ${invoice_net_total}/-`, invoice_created_by, 'INVOICES');
                return {
                    success: true,
                    data: 'Invoice updated successfully...',
                };
            }));
        });
    }
}
exports.default = EditInvoiceHajj;
//# sourceMappingURL=EditInvoiceHajj.js.map