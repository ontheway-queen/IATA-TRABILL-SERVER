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
class AddInvoiceInfo extends abstract_services_1.default {
    constructor() {
        super();
        this.add = (req) => __awaiter(this, void 0, void 0, function* () {
            const { infos, ti_invoice_id, ti_invoice_total_due, ti_net_total, ti_sub_total, ti_total_discount, ti_total_payment, } = req.body;
            const { user_id, agency_id } = req;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.invoiceAirticketModel(req, trx);
                const common_conn = this.models.CommonInvoiceModel(req, trx);
                const { prev_inv_net_total } = yield common_conn.getPreviousInvoices(ti_invoice_id);
                const ti_id = yield conn.insertInvoiceInfo({
                    ti_created_by: user_id,
                    ti_invoice_id,
                    ti_invoice_total_due,
                    ti_net_total,
                    ti_org_agency: agency_id,
                    ti_sub_total,
                    ti_total_discount,
                    ti_total_payment,
                });
                if (infos && infos.length) {
                    for (const info of infos) {
                        yield conn.insertInvoiceInfoItems(Object.assign(Object.assign({}, info), { tii_created_by: user_id, tii_org_agency: agency_id, tii_ti_id: ti_id, tii_invoice_id: ti_invoice_id }));
                    }
                }
                // invoice history
                const content = `EDITED INVOICE CREATED NET TOTAL CHANGE ${prev_inv_net_total}/- to ${ti_net_total}/-`;
                const history_data = {
                    history_activity_type: 'INVOICE_CREATED',
                    history_created_by: req.user_id,
                    history_invoice_id: ti_invoice_id,
                    history_invoice_payment_amount: ti_net_total,
                    invoicelog_content: content,
                };
                yield common_conn.insertInvoiceHistory(history_data);
                yield this.insertAudit(req, 'create', 'Invoice edited info created', user_id, 'INVOICES');
                return {
                    success: true,
                    message: 'Add Invoice fake info successfully',
                    code: 201,
                };
            }));
        });
        this.delete = (req) => __awaiter(this, void 0, void 0, function* () {
            const { invoice_id } = req.params;
            const { user_id } = req;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.invoiceAirticketModel(req, trx);
                yield conn.deleteInvoiceInfo(invoice_id);
                yield conn.deleteInvoiceInfoItems(invoice_id);
                yield this.insertAudit(req, 'create', 'Invoice duplicate info created', user_id, 'INVOICES');
                return {
                    success: true,
                    message: 'Add Invoice info successfully',
                    code: 201,
                };
            }));
        });
    }
}
exports.default = AddInvoiceInfo;
//# sourceMappingURL=addInvoiceInfo.services.js.map