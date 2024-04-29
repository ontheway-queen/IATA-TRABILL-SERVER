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
class DeleteInvoiceOtehr extends abstract_services_1.default {
    constructor() {
        super();
        this.deleteInvoiceOther = (req, voidTran) => __awaiter(this, void 0, void 0, function* () {
            const invoice_id = Number(req.params.invoice_id);
            const { invoice_has_deleted_by } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.invoiceOtherModel(req, voidTran || trx);
                const common_conn = this.models.CommonInvoiceModel(req, voidTran || trx);
                const trxns = new Trxns_1.default(req, voidTran || trx);
                //  PREVIOUS VENDORS TRANSACTION
                const previousBillingInfo = yield conn.getPrevOtherBilling(invoice_id);
                const prevBillingInfo = previousBillingInfo === null || previousBillingInfo === void 0 ? void 0 : previousBillingInfo.map((item) => {
                    return {
                        combined_id: item.billing_combined_id,
                        vendor_id: item.billing_vendor_id,
                        prev_cost_price: item.total_cost_price,
                        prevTrxnId: item.prevTrxnId,
                    };
                });
                yield trxns.deleteInvVTrxn(prevBillingInfo);
                // DELETE PREVIOUS OTHER  INFO
                yield conn.deleteTicketInfo(invoice_id, invoice_has_deleted_by);
                yield conn.deleteHotelInfo(invoice_id, invoice_has_deleted_by);
                yield conn.deleteTransportInfo(invoice_id, invoice_has_deleted_by);
                yield conn.deleteBillingInfo(invoice_id, invoice_has_deleted_by);
                yield conn.deleteOtherPassport(invoice_id, invoice_has_deleted_by);
                yield common_conn.deleteInvoices(invoice_id, invoice_has_deleted_by);
                yield this.insertAudit(req, 'delete', `Invoice other has been deleted, id-${invoice_id}`, invoice_has_deleted_by, 'INVOICES');
                return {
                    success: true,
                    message: 'Invoice has been deleted',
                };
            }));
        });
        this.voidInvoiceOther = (req, voidTran) => __awaiter(this, void 0, void 0, function* () {
            const invoice_id = Number(req.params.invoice_id);
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.invoiceOtherModel(req, voidTran || trx);
                // DELETE PREVIOUS OTHER  INFO
                yield conn.deleteTicketInfo(invoice_id, req.user_id);
                yield conn.deleteHotelInfo(invoice_id, req.user_id);
                yield conn.deleteTransportInfo(invoice_id, req.user_id);
                yield conn.deleteBillingInfo(invoice_id, req.user_id);
                yield conn.deleteOtherPassport(invoice_id, req.user_id);
                return;
            }));
        });
    }
}
exports.default = DeleteInvoiceOtehr;
//# sourceMappingURL=deleteInvoiceOther.js.map