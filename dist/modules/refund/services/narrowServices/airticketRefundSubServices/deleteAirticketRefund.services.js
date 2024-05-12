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
class DeleteAirTicketRefund extends abstract_services_1.default {
    constructor() {
        super();
        /**
         * delete air ticket refund
         */
        this.delete = (req) => __awaiter(this, void 0, void 0, function* () {
            const { refund_id } = req.params;
            const { deleted_by } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.refundModel(req, trx);
                const trxns = new Trxns_1.default(req, trx);
                const { atrefund_invoice_id, atrefund_trxn_charge_id } = yield conn.getAirticketRefund(refund_id);
                // client trxn delete
                const airticketRefundClient = yield conn.getAirticketClientRefund(refund_id);
                if (atrefund_trxn_charge_id) {
                    yield this.models
                        .vendorModel(req, trx)
                        .deleteOnlineTrxnCharge(atrefund_trxn_charge_id);
                }
                for (const item of airticketRefundClient) {
                    const { crefund_ctrxnid, crefund_charge_ctrxnid, crefund_actransaction_id, } = item;
                    if (crefund_ctrxnid) {
                        yield trxns.deleteClTrxn(crefund_ctrxnid, item.comb_client);
                    }
                    if (crefund_charge_ctrxnid) {
                        yield trxns.deleteClTrxn(crefund_charge_ctrxnid, item.comb_client);
                    }
                    if (crefund_actransaction_id) {
                        yield trxns.deleteAccTrxn(crefund_actransaction_id);
                    }
                }
                // vendor trans delete
                const previousVendorRefundInfo = yield conn.getPreviousVendorRefundInfo(refund_id);
                for (const item of previousVendorRefundInfo) {
                    const { vrefund_vtrxn_id, vrefund_category_id, vrefund_charge_vtrxn_id, vrefund_acctrxn_id, vrefund_airticket_id, } = item;
                    if (vrefund_vtrxn_id) {
                        yield trxns.deleteVTrxn(vrefund_vtrxn_id, item.comb_vendor);
                    }
                    if (vrefund_charge_vtrxn_id) {
                        yield trxns.deleteVTrxn(vrefund_charge_vtrxn_id, item.comb_vendor);
                    }
                    if (vrefund_acctrxn_id) {
                        yield trxns.deleteAccTrxn(vrefund_acctrxn_id);
                    }
                    yield conn.updateAirticketItemIsRefund(vrefund_airticket_id, vrefund_category_id, 0);
                }
                yield conn.updateInvoiceAirticketIsRefund(atrefund_invoice_id, 0);
                yield conn.deleteAirTicketRefund(refund_id, deleted_by);
                yield this.insertAudit(req, 'delete', `DELETED  INVOICE AIR TICKET REFUND/:${refund_id}`, deleted_by, 'REFUND');
                return {
                    success: true,
                    message: 'Air ticket refund has been deleted',
                };
            }));
        });
    }
}
exports.default = DeleteAirTicketRefund;
//# sourceMappingURL=deleteAirticketRefund.services.js.map