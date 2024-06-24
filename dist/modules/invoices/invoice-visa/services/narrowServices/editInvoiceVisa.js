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
const InsertVisaBilling_1 = __importDefault(require("../commonServices/InsertVisaBilling"));
class EditInvoiceVisa extends abstract_services_1.default {
    constructor() {
        super();
        this.editInvoiceVisa = (req) => __awaiter(this, void 0, void 0, function* () {
            const invoice_id = req.params.invoice_id;
            const { invoice_sales_man_id, invoice_sub_total, invoice_created_by, invoice_net_total, invoice_discount, invoice_vat, invoice_service_charge, invoice_agent_id, invoice_agent_com_amount, invoice_combclient_id, invoice_sales_date, invoice_due_date, invoice_note, billing_information, invoice_no, invoice_reference, passport_information, } = req.body;
            const { invoice_client_id, invoice_combined_id } = yield (0, invoice_helpers_1.getClientOrCombId)(invoice_combclient_id);
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const common_conn = this.models.CommonInvoiceModel(req, trx);
                const trxns = new Trxns_1.default(req, trx);
                let invoice_total_profit = 0;
                let invoice_total_vendor_price = 0;
                for (const item of billing_information) {
                    invoice_total_profit += item.billing_profit;
                    invoice_total_vendor_price +=
                        Number(item.billing_cost_price || 0) *
                            Number(item.billing_quantity | 0);
                }
                let ctrxn_pax_name = null;
                if (passport_information.length) {
                    const passport_id = passport_information.map((item) => item.passport_id);
                    ctrxn_pax_name = yield common_conn.getPassportName(passport_id);
                }
                let approvedSum = 0;
                billing_information.forEach((item) => {
                    if (item.billing_status === 'Approved' && item.is_deleted !== 1) {
                        approvedSum += item.billing_subtotal;
                    }
                });
                if (approvedSum && approvedSum > 0) {
                    const { prevCtrxnId } = yield common_conn.getPreviousInvoices(invoice_id);
                    const productsIds = billing_information.map((item) => item.billing_product_id);
                    let note = '';
                    if (productsIds.length) {
                        note = yield common_conn.getProductsName(productsIds);
                    }
                    const clTrxnBody = {
                        ctrxn_type: 'DEBIT',
                        ctrxn_amount: invoice_net_total,
                        ctrxn_cl: invoice_combclient_id,
                        ctrxn_voucher: invoice_no,
                        ctrxn_particular_id: 9,
                        ctrxn_created_at: invoice_sales_date,
                        ctrxn_note: invoice_note || note,
                        ctrxn_pax: ctrxn_pax_name,
                    };
                    if (prevCtrxnId) {
                        yield trxns.clTrxnUpdate(Object.assign(Object.assign({}, clTrxnBody), { ctrxn_trxn_id: prevCtrxnId }));
                    }
                    else {
                        const client_trxn_id = yield trxns.clTrxnInsert(clTrxnBody);
                        yield common_conn.updateInvoiceClTrxn(client_trxn_id, invoice_id);
                    }
                    if (invoice_agent_id) {
                        // AGENT TRANSACTION
                        yield invoice_helpers_1.default.invoiceAgentTransactions(this.models.agentProfileModel(req, trx), req.agency_id, invoice_agent_id, invoice_id, invoice_no, invoice_created_by, invoice_agent_com_amount, 'UPDATE', 97, 'INVOICE VISA');
                    }
                    else {
                        yield invoice_helpers_1.default.deleteAgentTransactions(this.models.agentProfileModel(req, trx), invoice_id, invoice_created_by);
                    }
                }
                // INVOICE INFORMATION UPDATE
                const invoice_information = {
                    invoice_client_id,
                    invoice_sub_total,
                    invoice_sales_man_id,
                    invoice_net_total,
                    invoice_sales_date,
                    invoice_due_date,
                    invoice_updated_by: invoice_created_by,
                    invoice_note,
                    invoice_combined_id,
                    invoice_reference,
                    invoice_total_profit,
                    invoice_total_vendor_price,
                };
                yield common_conn.updateInvoiceInformation(invoice_id, invoice_information);
                const invoiceExtraAmount = {
                    extra_amount_invoice_id: invoice_id,
                    invoice_vat,
                    invoice_service_charge,
                    invoice_discount,
                    invoice_agent_id,
                    invoice_agent_com_amount,
                };
                yield common_conn.updateInvoiceExtraAmount(invoiceExtraAmount, invoice_id);
                const commonVisaData = {
                    invoice_client_id,
                    invoice_combined_id,
                    invoice_created_by,
                    invoice_id: invoice_id,
                };
                yield new InsertVisaBilling_1.default().insertVisaBilling(req, commonVisaData, trx);
                // Invoice history
                const history_data = {
                    history_activity_type: 'INVOICE_UPDATED',
                    history_invoice_id: invoice_id,
                    history_invoice_payment_amount: invoice_net_total,
                    history_created_by: invoice_created_by,
                    invoicelog_content: 'Invoice visa has been updated',
                };
                yield common_conn.insertInvoiceHistory(history_data);
                yield this.insertAudit(req, 'update', `Invoice visa has been updated, Voucher - ${invoice_no}, Net - ${invoice_net_total}/-`, invoice_created_by, 'INVOICES');
                return {
                    success: true,
                    message: 'Invoice visa has been updated',
                };
            }));
        });
    }
}
exports.default = EditInvoiceVisa;
//# sourceMappingURL=editInvoiceVisa.js.map