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
class DeleteTourPackRefund extends abstract_services_1.default {
    constructor() {
        super();
        this.delete = (req, voidTrx) => __awaiter(this, void 0, void 0, function* () {
            const { refund_id } = req.params;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.refundModel(req, voidTrx || trx);
                const common_conn = this.models.CommonInvoiceModel(req, trx);
                const mr_conn = this.models.MoneyReceiptModels(req, trx);
                const vendor_conn = this.models.vendorModel(req, voidTrx || trx);
                const trxns = new Trxns_1.default(req, voidTrx || trx);
                const { refund_invoice_id, refund_charge_id } = yield conn.getTourRefund(refund_id);
                yield conn.updateInvoiceIsRefund(refund_invoice_id, 0);
                const tourRefundClient = yield conn.getTourClientRefund(refund_id);
                const vendorRefundInfo = yield conn.getTourVendorRefund(refund_id);
                if (refund_charge_id) {
                    yield vendor_conn.deleteOnlineTrxnCharge(refund_charge_id);
                }
                yield conn.deleteRefundTour(refund_id, req.user_id);
                const { crefund_ctrxnid, crefund_charge_ctrxnid, crefund_actransaction_id, } = tourRefundClient;
                if (crefund_ctrxnid) {
                    yield trxns.deleteClTrxn(crefund_ctrxnid, tourRefundClient.comb_client);
                }
                if (crefund_charge_ctrxnid) {
                    yield trxns.deleteClTrxn(crefund_charge_ctrxnid, tourRefundClient.comb_client);
                }
                if (crefund_actransaction_id) {
                    yield trxns.deleteAccTrxn(crefund_actransaction_id);
                }
                for (const item of vendorRefundInfo) {
                    const { vrefund_vtrxn_id, vrefund_charge_vtrxn_id, vrefund_acctrxn_id, } = item;
                    yield conn.updateAirticketItemIsRefund(refund_invoice_id, 5, 0);
                    if (vrefund_vtrxn_id) {
                        yield trxns.deleteVTrxn(vrefund_vtrxn_id, item.comb_vendor);
                    }
                    if (vrefund_charge_vtrxn_id) {
                        yield trxns.deleteVTrxn(vrefund_charge_vtrxn_id, item.comb_vendor);
                    }
                    if (vrefund_acctrxn_id) {
                        yield trxns.deleteAccTrxn(vrefund_acctrxn_id);
                    }
                }
                const message = `DELETED REFUND TOUR PACKAGE/:${refund_id}`;
                // delete inv cl pay
                yield mr_conn.deleteInvClPayByRfId('TOUR', +refund_id, tourRefundClient.crefund_client_id, tourRefundClient.crefund_combined_id);
                const history_data = {
                    history_activity_type: 'INVOICE_REFUNDED',
                    history_invoice_id: refund_invoice_id,
                    history_created_by: req.user_id,
                    invoicelog_content: `DELETE INVOICE REFUND`,
                };
                yield common_conn.insertInvoiceHistory(history_data);
                yield this.insertAudit(req, 'update', message, req.user_id, 'INVOICES');
                return {
                    success: true,
                    message,
                };
            }));
        });
    }
}
exports.default = DeleteTourPackRefund;
//# sourceMappingURL=deleteTourPackRefund.js.map