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
const dayjs_1 = __importDefault(require("dayjs"));
const abstract_services_1 = __importDefault(require("../../../../../abstracts/abstract.services"));
const Trxns_1 = __importDefault(require("../../../../../common/helpers/Trxns"));
const customError_1 = __importDefault(require("../../../../../common/utils/errors/customError"));
class DeleteReissue extends abstract_services_1.default {
    constructor() {
        super();
        this.deleteReissue = (req, voidTran) => __awaiter(this, void 0, void 0, function* () {
            const invoice_id = Number(req.params.invoice_id);
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const common_conn = this.models.CommonInvoiceModel(req, voidTran || trx);
                const conn = this.models.reissueAirticket(req, voidTran || trx);
                const previousVendorBilling = yield conn.getReissuePrevVendors(invoice_id);
                yield conn.deleteReissueFlightDetails(invoice_id, req.user_id);
                yield conn.deleteAirticketReissue(invoice_id, req.user_id);
                yield common_conn.deleteInvoices(invoice_id, req.user_id);
                yield new Trxns_1.default(req, voidTran || trx).deleteInvVTrxn(previousVendorBilling);
                // UPDATE PREVIOUS INVOICE IS NOT REISSUED
                for (const item of previousVendorBilling) {
                    const prevInvCateId = yield conn.getExistingInvCateId(item.ex_inv_id);
                    yield conn.updateInvoiceIsReissued(item.ex_inv_id, 0);
                    yield conn.updateAirTicketIsReissued(prevInvCateId, item.ex_airticket_id, 0);
                }
                yield this.insertAudit(req, 'delete', `Air ticket reissue has been deleted!`, req.user_id, 'INVOICES');
                return {
                    success: true,
                    data: 'Invoice deleted successfully',
                };
            }));
        });
        this.voidReissue = (req, voidTrx) => __awaiter(this, void 0, void 0, function* () {
            const common_conn = this.models.CommonInvoiceModel(req);
            const invoice_id = Number(req.params.invoice_id);
            const invoiceHasMr = yield common_conn.hasInvoiceMoneyReceipt(req.params.invoice_id);
            if (invoiceHasMr) {
                throw new customError_1.default('Regrettably, we are unable to void this invoice at the moment due to client has already payment!', 400, 'Unable to void');
            }
            const { void_charge, invoice_has_deleted_by } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const trxns = new Trxns_1.default(req, voidTrx || trx);
                const { comb_client, prevInvoiceNo } = yield common_conn.getPreviousInvoices(invoice_id);
                const clTrxnBody = {
                    ctrxn_type: 'DEBIT',
                    ctrxn_amount: void_charge,
                    ctrxn_cl: comb_client,
                    ctrxn_voucher: prevInvoiceNo,
                    ctrxn_particular_id: 161,
                    ctrxn_created_at: (0, dayjs_1.default)().format('YYYY-MM-DD'),
                    ctrxn_note: '',
                    ctrxn_particular_type: 'reissue void',
                };
                yield trxns.clTrxnInsert(clTrxnBody);
                yield this.deleteReissue(req, voidTrx || trx);
                yield this.insertAudit(req, 'delete', 'Invoice reissue has been voided', invoice_has_deleted_by, 'INVOICES');
                return { success: true, message: 'Invoice reissue has been voided' };
            }));
        });
    }
}
exports.default = DeleteReissue;
//# sourceMappingURL=deleteInvoiceReissue.js.map