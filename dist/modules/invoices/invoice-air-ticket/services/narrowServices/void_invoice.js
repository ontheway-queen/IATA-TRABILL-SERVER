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
const deleteInvoiceOther_1 = __importDefault(require("../../../invoice_other/services/narrowServices/deleteInvoiceOther"));
class VoidInvoice extends abstract_services_1.default {
    constructor() {
        super();
        // VOID INVOICES
        this.voidInvoice = (req) => __awaiter(this, void 0, void 0, function* () {
            const invoice_id = Number(req.params.invoice_id);
            const body = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const common_conn = this.models.CommonInvoiceModel(req, trx);
                const trxns = new Trxns_1.default(req, trx);
                const { invoice_category_id } = yield common_conn.getPreviousInvoices(invoice_id);
                const content = `VOUCHER ${body.invoice_no} BDT ${body.net_total}/- CHARGE BDT ${body.client_charge || 0}/-`;
                const ticket_nos = body.invoice_vendors
                    .map((item) => item.airticket_ticket_no)
                    .join(',');
                // CLIENT TRANSACTION
                const clientNetTotalTrans = {
                    ctrxn_type: 'CREDIT',
                    ctrxn_amount: body.net_total,
                    ctrxn_cl: body.comb_client,
                    ctrxn_voucher: body.invoice_no,
                    ctrxn_particular_id: 114,
                    ctrxn_created_at: body.invoice_void_date,
                    ctrxn_note: content,
                    ctrxn_particular_type: 'TKT VOID',
                    ctrxn_airticket_no: ticket_nos,
                };
                yield trxns.clTrxnInsert(clientNetTotalTrans);
                const voidChargeClTrans = {
                    ctrxn_type: 'DEBIT',
                    ctrxn_amount: body.client_charge || 0,
                    ctrxn_cl: body.comb_client,
                    ctrxn_voucher: body.invoice_no,
                    ctrxn_particular_id: 161,
                    ctrxn_created_at: body.invoice_void_date,
                    ctrxn_note: '',
                    ctrxn_particular_type: 'TKT VOID CHARGE',
                    ctrxn_airticket_no: ticket_nos,
                };
                let void_charge_ctrxn_id = null;
                if (body.client_charge) {
                    void_charge_ctrxn_id = yield trxns.clTrxnInsert(voidChargeClTrans);
                }
                // delete invoice;
                if (invoice_category_id === 1) {
                    // air ticket
                    yield this.models
                        .invoiceAirticketModel(req, trx)
                        .deleteAirticketItems(invoice_id, req.user_id);
                }
                else if (invoice_category_id === 2) {
                    // non commission
                    yield this.models
                        .invoiceNonCommission(req, trx)
                        .deleteNonCommissionItems(invoice_id, req.user_id);
                }
                else if (invoice_category_id === 3) {
                    // reissue
                    yield this.models
                        .reissueAirticket(req, trx)
                        .deleteAirticketReissueItems(invoice_id, req.user_id);
                }
                else if (invoice_category_id === 5) {
                    // others
                    new deleteInvoiceOther_1.default().voidInvoiceOther(req, trx);
                }
                // UPDATED VOID INFORMATION
                yield common_conn.updateIsVoid(invoice_id, body.client_charge || 0, void_charge_ctrxn_id, body.invoice_void_date);
                //   VENDOR TRANSACTIONS
                for (const item of body.invoice_vendors) {
                    const { vendor_id } = (0, common_helper_1.separateCombClientToId)(item.comb_vendor);
                    if (item.vendor_charge) {
                        const vendorPurchaseVoidTrans = {
                            comb_vendor: item.comb_vendor,
                            vtrxn_amount: item.cost_price,
                            vtrxn_created_at: body.invoice_void_date,
                            vtrxn_note: `TKT ${item.airticket_ticket_no} BDT ${item.cost_price}/- CHARGE BDT ${item.vendor_charge}/-`,
                            vtrxn_particular_id: 1,
                            vtrxn_particular_type: 'TKT VOID',
                            vtrxn_type: vendor_id ? 'CREDIT' : 'DEBIT',
                            vtrxn_user_id: req.user_id,
                            vtrxn_voucher: body.invoice_no,
                            vtrxn_airticket_no: item.airticket_ticket_no,
                        };
                        yield trxns.VTrxnInsert(vendorPurchaseVoidTrans);
                        const vendorVoidCharge = {
                            comb_vendor: item.comb_vendor,
                            vtrxn_amount: item.vendor_charge,
                            vtrxn_created_at: body.invoice_void_date,
                            vtrxn_note: ``,
                            vtrxn_particular_id: 1,
                            vtrxn_particular_type: 'TKT VOID CHARGE',
                            vtrxn_type: vendor_id ? 'DEBIT' : 'CREDIT',
                            vtrxn_user_id: req.user_id,
                            vtrxn_airticket_no: item.airticket_ticket_no,
                            vtrxn_voucher: body.invoice_no,
                        };
                        yield trxns.VTrxnInsert(vendorVoidCharge);
                    }
                }
                yield this.insertAudit(req, 'delete', content, req.user_id, 'INVOICES');
                return { success: true, message: content };
            }));
        });
    }
}
exports.default = VoidInvoice;
//# sourceMappingURL=void_invoice.js.map