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
const abstract_services_1 = __importDefault(require("../../../../abstracts/abstract.services"));
const Trxns_1 = __importDefault(require("../../../../common/helpers/Trxns"));
const customError_1 = __importDefault(require("../../../../common/utils/errors/customError"));
const addInvoiceVisa_1 = __importDefault(require("./narrowServices/addInvoiceVisa"));
const deleteinvoicevisa_services_1 = __importDefault(require("./narrowServices/deleteinvoicevisa.services"));
const editInvoiceVisa_1 = __importDefault(require("./narrowServices/editInvoiceVisa"));
class InvoiceVisaServices extends abstract_services_1.default {
    constructor() {
        super();
        this.getListOfInvoiceVisa = (req) => __awaiter(this, void 0, void 0, function* () {
            const { page, size, search, from_date, to_date } = req.query;
            const conn = this.models.invoiceVisaModel(req);
            const data = yield conn.getAllInvoiceVisa(Number(page) || 1, Number(size) || 20, search, from_date, to_date);
            return Object.assign({ success: true, message: 'All Invoices Visa' }, data);
        });
        this.getForEdit = (req) => __awaiter(this, void 0, void 0, function* () {
            const invoice_id = req.params.invoice_id;
            const conn = this.models.invoiceVisaModel(req);
            const common_conn = this.models.CommonInvoiceModel(req);
            const invoice = yield common_conn.getForEditInvoice(invoice_id);
            const billing_information = yield conn.getBillingInfo(invoice_id);
            const data = { invoice, billing_information, passportInfo: [] };
            const passportInfo = yield conn.getVisaPassport(invoice_id);
            return {
                success: true,
                message: 'invoice visa',
                data: Object.assign(Object.assign({}, data), { passportInfo }),
            };
        });
        this.updateBillingStatus = (req) => __awaiter(this, void 0, void 0, function* () {
            const billing_id = req.params.billing_id;
            const status = req.query.status;
            const { created_by } = req.body;
            const isApproved = status === 'Approved' ? true : false;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.invoiceVisaModel(req, trx);
                const trxns = new Trxns_1.default(req, trx);
                const common_conn = this.models.CommonInvoiceModel(req, trx);
                const prevBillingInfo = yield conn.getPrevBilling(billing_id);
                for (const billing of prevBillingInfo) {
                    if (!billing.combined_id && !billing.vendor_id) {
                        throw new customError_1.default('Invoice visa cannot update without vendor!', 400, 'Bad Request');
                    }
                }
                if (prevBillingInfo[0].billing_status === 'Approved') {
                    throw new customError_1.default('Approved visa cannot edit or update!', 400, 'Bad Request');
                }
                const [billing_info] = yield conn.getPrevBillingByBillingId(billing_id);
                const { combined_id, prev_cost_price, vendor_id, invoice_sales_date, prev_sales_price, comb_client, comb_vendor, invoice_id, } = billing_info;
                const { prevCtrxnId, prevInvoiceNo, prevInvoiceNote } = yield common_conn.getPreviousInvoices(invoice_id);
                const approvedAmount = yield conn.getPrevBillingApprovedAmount(invoice_id);
                yield this.insertAudit(req, 'update', `Invoice visa status updated as ${status}`, created_by, 'INVOICES');
                if (isApproved) {
                    if (!prevCtrxnId) {
                        const clTrxnBody = {
                            ctrxn_type: 'DEBIT',
                            ctrxn_amount: prev_sales_price,
                            ctrxn_cl: comb_client,
                            ctrxn_voucher: prevInvoiceNo,
                            ctrxn_particular_id: 96,
                            ctrxn_created_at: (0, dayjs_1.default)().format('YYYY-MM-DD'),
                            ctrxn_note: prevInvoiceNote,
                            ctrxn_particular_type: 'invoice visa ',
                            ctrxn_user_id: created_by,
                        };
                        const invoice_cltrxn_id = yield trxns.clTrxnInsert(clTrxnBody);
                        yield conn.updateInvoiceClientTrxn(invoice_cltrxn_id, invoice_id);
                    }
                    else {
                        const clTrxnBody = {
                            ctrxn_type: 'DEBIT',
                            ctrxn_amount: approvedAmount + prev_sales_price,
                            ctrxn_cl: comb_client,
                            ctrxn_voucher: prevInvoiceNo,
                            ctrxn_particular_id: 97,
                            ctrxn_created_at: invoice_sales_date,
                            ctrxn_note: prevInvoiceNote,
                            ctrxn_particular_type: 'invoice visa',
                            ctrxn_trxn_id: prevCtrxnId,
                        };
                        yield trxns.clTrxnUpdate(clTrxnBody);
                    }
                    let billing_vtrxn_id = null;
                    // VENDOR TRANSACTIIONS
                    const VTrxnBody = {
                        comb_vendor: comb_vendor,
                        vtrxn_amount: prev_cost_price,
                        vtrxn_created_at: invoice_sales_date,
                        vtrxn_note: prevInvoiceNote,
                        vtrxn_particular_id: 149,
                        vtrxn_particular_type: 'Invoice visa',
                        vtrxn_type: combined_id ? 'CREDIT' : 'DEBIT',
                        vtrxn_user_id: created_by,
                        vtrxn_voucher: prevInvoiceNo,
                    };
                    billing_vtrxn_id = yield trxns.VTrxnInsert(VTrxnBody);
                    yield conn.updateBillingStatus(status, billing_vtrxn_id, billing_id);
                    return { success: true, message: 'Invoice visa has been approved' };
                }
                else {
                    yield conn.updateBillingStatus(status, null, billing_id);
                    return { success: true, message: 'Invoice visa has been rejected' };
                }
            }));
        });
        this.viewInvoiceVisa = (req) => __awaiter(this, void 0, void 0, function* () {
            const invoice_id = req.params.invoice_id;
            const common_conn = this.models.CommonInvoiceModel(req);
            const conn = this.models.invoiceVisaModel(req);
            // INVOICE DATA
            const invoice = yield common_conn.getViewInvoiceInfo(invoice_id);
            const passport_information = yield conn.getPassportInfo(invoice_id);
            const billing_information = yield conn.getViewBillingInfo(invoice_id);
            return {
                success: true,
                data: Object.assign(Object.assign({}, invoice), { passport_information, billing_information }),
            };
        });
        // ============= narrow services ==============
        this.addInvoiceVisa = new addInvoiceVisa_1.default().addInvoiceVisa;
        this.editInvoiceVisa = new editInvoiceVisa_1.default().editInvoiceVisa;
        this.deleteInvoiceVisa = new deleteinvoicevisa_services_1.default().deleteInvoiceVisa;
        this.voidInvoiceVisa = new deleteinvoicevisa_services_1.default().voidInvoiceVisa;
    }
}
exports.default = InvoiceVisaServices;
//# sourceMappingURL=invoiceVisa.services.js.map