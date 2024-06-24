"use strict";
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
class EditExistingCl extends abstract_services_1.default {
    constructor() {
        super();
        this.editExistingCl = (req) => __awaiter(this, void 0, void 0, function* () {
            const { invoice_combclient_id, invoice_sales_man_id, invoice_sales_date, invoice_due_date, airticket_ticket_no, airticket_penalties, airticket_fare_difference, airticket_commission_percent, airticket_ait, airticket_issue_date, airticket_classes, airticket_existing_airticket_id, airticket_client_price, airticket_purchase_price, airticket_profit, airticket_journey_date, airticket_return_date, invoice_note, invoice_no, comb_vendor, airticket_existing_invoiceid, airticket_tax, airticket_extra_fee, } = req.body;
            const invoice_id = Number(req.params.invoice_id);
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.reissueAirticket(req, trx);
                const common_conn = this.models.CommonInvoiceModel(req, trx);
                const trxns = new Trxns_1.default(req, trx);
                // TOOLS
                const prevInvCateId = yield conn.getExistingInvCateId(airticket_existing_invoiceid);
                const previousData = yield conn.getPreviousAirTicketData(prevInvCateId, airticket_existing_airticket_id);
                const { prevCtrxnId } = yield common_conn.getPreviousInvoices(invoice_id);
                const clTrxnBody = {
                    ctrxn_particular_id: 5,
                    ctrxn_note: invoice_note,
                    ctrxn_trxn_id: prevCtrxnId,
                    ctrxn_airticket_no: airticket_ticket_no,
                    ctrxn_type: 'DEBIT',
                    ctrxn_amount: airticket_client_price,
                    ctrxn_cl: invoice_combclient_id,
                    ctrxn_voucher: invoice_no,
                    ctrxn_created_at: invoice_sales_date,
                };
                yield trxns.clTrxnUpdate(clTrxnBody);
                const { client_id, combined_id } = (0, common_helper_1.separateCombClientToId)(invoice_combclient_id);
                const invoice_information = {
                    invoice_updated_by: req.user_id,
                    invoice_combined_id: combined_id,
                    invoice_client_id: client_id,
                    invoice_net_total: airticket_client_price,
                    invoice_sales_date,
                    invoice_due_date,
                    invoice_sales_man_id,
                    invoice_sub_total: airticket_client_price,
                    invoice_note,
                    invoice_total_profit: airticket_profit,
                    invoice_total_vendor_price: airticket_purchase_price,
                };
                common_conn.updateInvoiceInformation(invoice_id, invoice_information);
                const previousVendorBilling = yield conn.getReissuePrevVendors(invoice_id);
                yield trxns.deleteInvVTrxn(previousVendorBilling);
                // VENDOR TRANSACTIONS
                const VTrxnBody = {
                    vtrxn_user_id: req.user_id,
                    vtrxn_voucher: invoice_no,
                    vtrxn_airticket_no: airticket_ticket_no,
                    comb_vendor: comb_vendor,
                    vtrxn_amount: airticket_purchase_price,
                    vtrxn_created_at: invoice_sales_date,
                    vtrxn_note: invoice_note,
                    vtrxn_particular_id: 5,
                    vtrxn_type: 'DEBIT',
                };
                yield trxns.VTrxnInsert(VTrxnBody);
                const { combined_id: airticket_vendor_combine_id, vendor_id: airticket_vendor_id, } = (0, common_helper_1.separateCombClientToId)(comb_vendor);
                const reissueAirTicketItem = {
                    airticket_tax,
                    airticket_client_id: client_id,
                    airticket_combined_id: combined_id,
                    airticket_vendor_id,
                    airticket_vendor_combine_id,
                    airticket_invoice_id: invoice_id,
                    airticket_sales_date: invoice_sales_date,
                    airticket_profit,
                    airticket_journey_date,
                    airticket_return_date,
                    airticket_purchase_price,
                    airticket_client_price,
                    airticket_ticket_no,
                    airticket_existing_invoiceid,
                    airticket_penalties,
                    airticket_fare_difference,
                    airticket_commission_percent,
                    airticket_ait,
                    airticket_issue_date,
                    airticket_classes,
                    airticket_existing_airticket_id,
                    airticket_extra_fee,
                    airticket_after_reissue_client_price: Number(airticket_client_price || 0) +
                        Number(previousData.cl_price || 0) -
                        Number(airticket_penalties || 0),
                    airticket_after_reissue_purchase_price: Number(airticket_purchase_price || 0) +
                        Number(previousData.purchase || 0) -
                        Number(airticket_penalties || 0),
                    airticket_after_reissue_taxes: Number(airticket_tax || 0) + Number(previousData.taxes || 0),
                    airticket_after_reissue_profit: Number(airticket_profit || 0) +
                        Number(previousData.airticket_profit || 0),
                };
                yield conn.updateInvoiceReissueAirticket(invoice_id, reissueAirTicketItem);
                // UPDATE IS REISSUED
                yield conn.updateInvoiceIsReissued(airticket_existing_invoiceid, 1);
                yield conn.updateAirTicketIsReissued(prevInvCateId, airticket_existing_airticket_id, 1);
                // NEW HISTORY
                const new_history_data = {
                    history_activity_type: 'INVOICE_UPDATED',
                    history_created_by: req.user_id,
                    history_invoice_id: invoice_id,
                    invoicelog_content: 'Existing Air Ticket Reissued Updated!',
                    history_invoice_payment_amount: airticket_client_price,
                };
                yield common_conn.insertInvoiceHistory(new_history_data);
                // EXISTING HISTORY
                const existing_history_data = {
                    history_invoice_payment_amount: airticket_client_price,
                    history_activity_type: 'INVOICE_UPDATED',
                    history_created_by: req.user_id,
                    history_invoice_id: airticket_existing_invoiceid,
                    invoicelog_content: 'Reissue Updated!',
                };
                yield common_conn.insertInvoiceHistory(existing_history_data);
                const content = `Existing client invoice reissue has been updated, Voucher - ${invoice_no}, Net - ${airticket_client_price}/-`;
                yield this.insertAudit(req, 'update', content, req.user_id, 'INVOICES');
                return {
                    success: true,
                    data: 'Invoice existing client updated successfully...',
                };
            }));
        });
    }
}
exports.default = EditExistingCl;
//# sourceMappingURL=editInvoiceExistingReissue.js.map