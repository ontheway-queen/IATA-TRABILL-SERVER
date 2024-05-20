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
class DeleteOtherRefund extends abstract_services_1.default {
    constructor() {
        super();
        /**
         * Delete Client refund
         */
        this.deleteOtherRefund = (req, voidTrx) => __awaiter(this, void 0, void 0, function* () {
            const { refund_id } = req.params;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.refundModel(req, voidTrx || trx);
                const vendor_conn = this.models.vendorModel(req, voidTrx || trx);
                const common_conn = this.models.CommonInvoiceModel(req, trx);
                const mr_conn = this.models.MoneyReceiptModels(req, trx);
                const trxns = new Trxns_1.default(req, voidTrx || trx);
                const { refund_invoice_id, refund_charge_id } = yield conn.getOtherRefundInvoice(refund_id);
                yield conn.updateInvoiceIsRefund(refund_invoice_id, 0);
                if (refund_charge_id) {
                    yield vendor_conn.deleteOnlineTrxnCharge(refund_charge_id);
                }
                // client trans delete
                const prevData = yield conn.getOtherClientRefundInfo(refund_id);
                if (prevData.crefund_ctrxnid) {
                    yield trxns.deleteClTrxn(prevData.crefund_ctrxnid, prevData.comb_client);
                }
                if (prevData.crefund_charge_ctrxnid) {
                    yield trxns.deleteClTrxn(prevData.crefund_charge_ctrxnid, prevData.comb_client);
                }
                if (prevData.crefund_actransaction_id) {
                    yield trxns.deleteAccTrxn(prevData.crefund_actransaction_id);
                }
                // delete vendor transaction
                const otherRefundVendor = yield conn.getOtherVendorRefundInfo(refund_id);
                for (const item of otherRefundVendor) {
                    yield conn.updateAirticketItemIsRefund(item.vrefund_invoice_id, 4, 1);
                    if (item.vrefund_vtrxn_id) {
                        yield trxns.deleteVTrxn(item.vrefund_vtrxn_id, item.comb_vendor);
                    }
                    if (item.vrefund_charge_vtrxn_id) {
                        yield trxns.deleteVTrxn(item.vrefund_charge_vtrxn_id, item.comb_vendor);
                    }
                    if (item.vrefund_acctrxn_id) {
                        yield trxns.deleteAccTrxn(item.vrefund_acctrxn_id);
                    }
                }
                const { billing_remaining_quantity } = yield conn.getReminingQuantity(refund_invoice_id);
                const vrefund_quantity = yield conn.getOtherRefundQuantity(refund_id);
                const remaining_quantity = billing_remaining_quantity + vrefund_quantity;
                yield conn.updateRemainingQty(refund_invoice_id, 1, remaining_quantity);
                // delete inv cl pay
                yield mr_conn.deleteInvClPayByRfId('OTHER', +refund_id, prevData.crefund_client_id, prevData.crefund_combined_id);
                const history_data = {
                    history_activity_type: 'INVOICE_REFUNDED',
                    history_invoice_id: refund_invoice_id,
                    history_created_by: req.user_id,
                    invoicelog_content: `DELETE INVOICE REFUND`,
                };
                yield common_conn.insertInvoiceHistory(history_data);
                yield conn.deleteOtherRefund(refund_id, req.user_id);
                yield this.insertAudit(req, 'delete', `DELETED OTHER REFUND/:${refund_id}`, req.user_id, 'REFUND');
                return {
                    success: true,
                    message: 'Other refund deleted successfully',
                };
            }));
        });
    }
}
exports.default = DeleteOtherRefund;
//# sourceMappingURL=deleteOtherRefund.js.map