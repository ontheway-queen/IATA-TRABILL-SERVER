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
const invoicetour_helpers_1 = __importDefault(require("../../utils/invoicetour.helpers"));
class AddCostingInvoiceTour extends abstract_services_1.default {
    constructor() {
        super();
        this.addCostingInvoiceTour = (req) => __awaiter(this, void 0, void 0, function* () {
            const { invoice_created_by } = req.body;
            const invoice_id = Number(req.params.invoice_id);
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.invoiceTourModels(req, trx);
                const common_conn = this.models.CommonInvoiceModel(req, trx);
                yield conn.deleteBillingOnly(invoice_id, invoice_created_by);
                // TOUR VENDOR COST BILLING INSERT
                yield invoicetour_helpers_1.default.addVendorCostBilling(req, conn, invoice_id, trx);
                const history_data = {
                    history_activity_type: 'INVOICE_PAYMENT_CREATED',
                    history_invoice_id: invoice_id,
                    history_created_by: invoice_created_by,
                    invoicelog_content: `Invoice costing has been added`,
                };
                yield common_conn.insertInvoiceHistory(history_data);
                const content = `Invoice tour costing has been added, inv-id:${invoice_id}`;
                yield this.insertAudit(req, 'create', content, invoice_created_by, 'INVOICES');
                return { success: true, message: 'Invoice tour costing has been added' };
            }));
        });
    }
}
exports.default = AddCostingInvoiceTour;
//# sourceMappingURL=AddCostingInvoiceTour.js.map