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
class DeleteInvoiceUmmrah extends abstract_services_1.default {
    constructor() {
        super();
        this.deleteInvoiceUmmrah = (req, voidTran) => __awaiter(this, void 0, void 0, function* () {
            const invoice_id = Number(req.params.invoice_id);
            const { invoice_has_deleted_by } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const common_conn = this.models.CommonInvoiceModel(req, voidTran || trx);
                const conn = this.models.InvoiceUmmarhModels(req, voidTran || trx);
                const trxns = new Trxns_1.default(req, voidTran || trx);
                const previousBillingInfo = yield conn.getPrevIUBilling(invoice_id);
                yield conn.deleteUmmrahRoutesByInvoiceId(invoice_id, req.user_id);
                yield conn.deleteIUHotelInfosByInvoiceId(invoice_id, req.user_id);
                yield conn.deleteIUBillingInfos(invoice_id, req.user_id);
                yield conn.deletePassengerInfo(invoice_id, req.user_id);
                yield common_conn.deleteInvoices(invoice_id, req.user_id);
                yield trxns.deleteInvVTrxn(previousBillingInfo);
                yield this.insertAudit(req, 'delete', `Invoice ummrah has been deleted`, req.user_id, 'INVOICES');
                return {
                    success: true,
                    data: 'Invoice deleted successfully...',
                };
            }));
        });
        this.voidInvoiceUmmrah = (req) => __awaiter(this, void 0, void 0, function* () {
            const common_conn = this.models.CommonInvoiceModel(req);
            const invoice_id = Number(req.params.invoice_id);
            const invoiceHasMr = yield common_conn.hasInvoiceMoneyReceipt(req.params.invoice_id);
            if (invoiceHasMr) {
                throw new customError_1.default('Regrettably, we are unable to void this invoice at the moment due to client has already payment!', 400, 'Unable to void');
            }
            const { void_charge, invoice_has_deleted_by } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const trxns = new Trxns_1.default(req, trx);
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
                    ctrxn_user_id: invoice_has_deleted_by,
                };
                yield trxns.clTrxnInsert(clTrxnBody);
                yield this.deleteInvoiceUmmrah(req, trx);
                yield common_conn.transferInvoiceInfoToVoid(invoice_id, void_charge);
                yield this.insertAudit(req, 'delete', `Invoice airticket has been voided, inv-id:${invoice_id}`, invoice_has_deleted_by, 'INVOICES');
                return { success: true, message: 'Invoice airticket has been voided' };
            }));
        });
    }
}
exports.default = DeleteInvoiceUmmrah;
//# sourceMappingURL=DeleteInvoiceUmmrah.js.map