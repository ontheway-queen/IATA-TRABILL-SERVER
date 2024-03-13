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
const abstract_services_1 = __importDefault(require("../../../../abstracts/abstract.services"));
const Trxns_1 = __importDefault(require("../../../../common/helpers/Trxns"));
class DeleteMoneyReceipt extends abstract_services_1.default {
    constructor() {
        super();
        this.deleteMoneyReceipt = (req) => __awaiter(this, void 0, void 0, function* () {
            const receipt_id = Number(req.params.id);
            const { receipt_deleted_by } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.MoneyReceiptModels(req, trx);
                const common_conn = this.models.CommonInvoiceModel(req, trx);
                const trxns = new Trxns_1.default(req, trx);
                const previousBillingData = yield conn.getPreviousPaidAmount(receipt_id);
                const getClientPayTrxnId = yield conn.getPrevInvoiceClPay(receipt_id);
                yield conn.deletePrevMoneyReceiptChequeInfo(receipt_id, receipt_deleted_by);
                yield conn.deleteMoneyreceipt(receipt_id, receipt_deleted_by);
                if (previousBillingData) {
                    const { prevClTrxn, prevCombClient, prevAccTrxnId } = previousBillingData;
                    yield conn.deletePrevInvoiceClPay(receipt_id, receipt_deleted_by);
                    yield conn.deletePrevMoneyReceiptChequeInfo(receipt_id, receipt_deleted_by);
                    if (prevClTrxn) {
                        yield trxns.deleteClTrxn(prevClTrxn, prevCombClient);
                    }
                    if (getClientPayTrxnId && getClientPayTrxnId.prevClTrxnId) {
                        yield trxns.deleteClTrxn(getClientPayTrxnId.prevClTrxnId, getClientPayTrxnId.comb_client);
                    }
                    if (previousBillingData === null || previousBillingData === void 0 ? void 0 : previousBillingData.receipt_trxn_charge_id) {
                        yield this.models
                            .vendorModel(req, trx)
                            .deleteOnlineTrxnCharge(previousBillingData === null || previousBillingData === void 0 ? void 0 : previousBillingData.receipt_trxn_charge_id);
                    }
                    yield trxns.deleteAccTrxn(prevAccTrxnId);
                }
                // delete money receipt
                const invoice = yield conn.getInvoicesByMoneyReceiptId(receipt_id);
                if (invoice === null || invoice === void 0 ? void 0 : invoice.invoice_id) {
                    const history_data = {
                        history_activity_type: 'INVOICE_PAYMENT_DELETED',
                        history_invoice_id: invoice.invoice_id,
                        history_created_by: receipt_deleted_by,
                        history_invoice_payment_amount: invoice.invoice_amount,
                        invoicelog_content: `Payment deleted to Invoice (Amount = ${invoice.invoice_amount})/-`,
                    };
                    yield common_conn.insertInvoiceHistory(history_data);
                }
                yield this.insertAudit(req, 'delete', `Moeny receipt has been deleted , mr-id:${receipt_id}`, receipt_deleted_by, 'MONEY_RECEIPT');
                return {
                    success: true,
                    data: 'Money receipt deleted successfully...',
                };
            }));
        });
    }
}
exports.default = DeleteMoneyReceipt;
//# sourceMappingURL=DeleteMoneyReceipt.js.map