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
class DeleteAirTicket extends abstract_services_1.default {
    constructor() {
        super();
        this.deleteAirTicket = (req, voidTran) => __awaiter(this, void 0, void 0, function* () {
            const invoice_id = Number(req.params.invoice_id);
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const common_conn = this.models.CommonInvoiceModel(req, voidTran || trx);
                const conn = this.models.invoiceAirticketModel(req, voidTran || trx);
                const trxns = new Trxns_1.default(req, voidTran || trx);
                const prevBillingInfo = yield conn.getPrevAirticketVendor(invoice_id);
                yield trxns.deleteInvVTrxn(prevBillingInfo);
                yield conn.deleteAirticketItems(invoice_id, req.user_id);
                yield common_conn.deleteInvoices(invoice_id, req.user_id);
                // @invoice history
                const content = `Invoice air ticket has been deleted`;
                yield this.insertAudit(req, 'delete', content, req.user_id, 'INVOICES');
                return {
                    success: true,
                    message: 'invoice has been deleted',
                };
            }));
        });
    }
}
exports.default = DeleteAirTicket;
//# sourceMappingURL=deleteAirTicket.js.map