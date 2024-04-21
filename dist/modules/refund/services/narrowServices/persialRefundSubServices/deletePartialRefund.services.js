"use strict";
/*
Partial Refund update service
@Author MD Sabbir <sabbir.m360ict@gmail.com>
*/
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
class DeletePartialRefund extends abstract_services_1.default {
    constructor() {
        super();
        this.delete = (req) => __awaiter(this, void 0, void 0, function* () {
            const { refund_id } = req.params;
            const { deleted_by } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.refundModel(req, trx);
                const trxns = new Trxns_1.default(req, trx);
                const { prfnd_invoice_id, prfnd_vouchar_number } = yield conn.getPersialRfndInvoiceId(refund_id);
                const { invoice_category_id } = yield conn.getInvoiceInfo(prfnd_invoice_id);
                const { prfnd_actrxn_id, prfnd_charge_trxn_id, prfnd_trxn_id, comb_client, } = yield conn.getPersialRfndInfo(refund_id);
                if (prfnd_actrxn_id) {
                    yield trxns.deleteAccTrxn(prfnd_actrxn_id);
                }
                if (prfnd_trxn_id) {
                    yield trxns.deleteClTrxn(prfnd_trxn_id, comb_client);
                }
                if (prfnd_charge_trxn_id) {
                    yield trxns.deleteClTrxn(prfnd_charge_trxn_id, comb_client);
                }
                const persialVendorRefundInfo = yield conn.getPersialRefundVendorInfo(refund_id);
                for (const refund_info of persialVendorRefundInfo) {
                    const { vprfnd_actrxn_id, vprfnd_charge_trxn_id, vprfnd_trxn_id, comb_vendor, vprfnd_airticket_id, } = refund_info;
                    yield conn.updateAirticketItemIsRefund(vprfnd_airticket_id, invoice_category_id, 0);
                    if (vprfnd_actrxn_id) {
                        yield trxns.deleteAccTrxn(vprfnd_actrxn_id);
                    }
                    if (vprfnd_charge_trxn_id) {
                        yield trxns.deleteVTrxn(vprfnd_charge_trxn_id, comb_vendor);
                    }
                    if (vprfnd_trxn_id) {
                        yield trxns.deleteVTrxn(vprfnd_trxn_id, comb_vendor);
                    }
                }
                yield conn.DeletePartialRefund(refund_id, deleted_by);
                yield conn.deletePartialVendorRefund(refund_id, deleted_by);
                yield conn.updateInvoiceAirticketIsRefund(prfnd_invoice_id, 0);
                const audit_content = `Persial refund deleted voucher no: ${prfnd_vouchar_number}`;
                yield this.insertAudit(req, 'delete', audit_content, deleted_by, 'REFUND');
                return { success: true, message: 'Persial refund deleted successfuly' };
            }));
        });
    }
}
exports.default = DeletePartialRefund;
//# sourceMappingURL=deletePartialRefund.services.js.map