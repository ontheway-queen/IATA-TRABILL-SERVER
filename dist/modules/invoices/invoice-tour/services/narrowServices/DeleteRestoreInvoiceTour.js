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
class DeleteResetInvoiceTour extends abstract_services_1.default {
    constructor() {
        super();
        this.deleteResetInvoiceTour = (req, voidTran) => __awaiter(this, void 0, void 0, function* () {
            const invoice_id = Number(req.params.invoice_id);
            const { invoice_has_deleted_by } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const common_conn = this.models.CommonInvoiceModel(req, voidTran || trx);
                const conn = this.models.invoiceTourModels(req, voidTran || trx);
                const trxns = new Trxns_1.default(req, voidTran || trx);
                const previousBilling = yield conn.getPrevBillingCost(invoice_id);
                yield conn.deletePrevBillingCost(invoice_id, invoice_has_deleted_by);
                yield common_conn.deleteInvoices(invoice_id, invoice_has_deleted_by);
                yield trxns.deleteInvVTrxn(previousBilling);
                const content = `Invoice tour has been deleted, inv-id:${invoice_id}`;
                yield this.insertAudit(req, 'create', content, invoice_has_deleted_by, 'INVOICES');
                return {
                    success: true,
                    data: 'Invoice cost has been deleted',
                };
            }));
        });
        this.voidInvoiceTour = (req) => __awaiter(this, void 0, void 0, function* () {
            const common_conn = this.models.CommonInvoiceModel(req);
            const invoice_id = Number(req.params.invoice_id);
            const { void_charge, invoice_has_deleted_by } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const trxns = new Trxns_1.default(req, trx);
                const { comb_client, prevInvoiceNo } = yield common_conn.getPreviousInvoices(invoice_id);
                const clTrxnBody = {
                    ctrxn_type: 'DEBIT',
                    ctrxn_amount: void_charge,
                    ctrxn_cl: comb_client,
                    ctrxn_voucher: prevInvoiceNo,
                    ctrxn_particular_id: 56,
                    ctrxn_created_at: (0, dayjs_1.default)().format('YYYY-MM-DD'),
                    ctrxn_note: '',
                };
                yield trxns.clTrxnInsert(clTrxnBody);
                yield this.deleteResetInvoiceTour(req, trx);
                yield this.insertAudit(req, 'delete', 'Invoice tour pakckage has been voided', invoice_has_deleted_by, 'INVOICES');
                return {
                    success: true,
                    message: 'Invoice tour pakckage has been voided',
                };
            }));
        });
    }
}
exports.default = DeleteResetInvoiceTour;
//# sourceMappingURL=DeleteRestoreInvoiceTour.js.map