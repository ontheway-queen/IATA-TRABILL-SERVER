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
const common_helper_1 = require("../../../../../common/helpers/common.helper");
const deleteTourPackRefund_1 = __importDefault(require("../../../../refund/services/narrowServices/tourPackRefundSubServices/deleteTourPackRefund"));
const deleteinvoicevisa_services_1 = __importDefault(require("../../../invoice-visa/services/narrowServices/deleteinvoicevisa.services"));
const deleteInvoiceNonCom_1 = __importDefault(require("../../../invoice_airticket_non_commission/services/narrowServices/deleteInvoiceNonCom"));
const deleteInvoiceReissue_1 = __importDefault(require("../../../invoice_airticket_reissue/services/narrowServices/deleteInvoiceReissue"));
const DeleteInvoiceHajjPreReg_1 = __importDefault(require("../../../invoice_hajj_pre_reg/Services/NarrowServices/DeleteInvoiceHajjPreReg"));
const DeleteInvoiceHajjServices_1 = __importDefault(require("../../../invoice_hajji/Services/NarrowServices/DeleteInvoiceHajjServices"));
const deleteInvoiceOther_1 = __importDefault(require("../../../invoice_other/services/narrowServices/deleteInvoiceOther"));
const DeleteInvoiceUmmrah_1 = __importDefault(require("../../../invoice_ummrah/Services/NarrowServices/DeleteInvoiceUmmrah"));
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
        this.voidInvoice = (req) => __awaiter(this, void 0, void 0, function* () {
            const invoice_id = Number(req.params.invoice_id);
            const { client_charge, invoice_vendors } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const common_conn = this.models.CommonInvoiceModel(req, trx);
                const trxns = new Trxns_1.default(req, trx);
                const { comb_client, prevInvoiceNo, invoice_category_id } = yield common_conn.getPreviousInvoices(invoice_id);
                yield common_conn.updateIsVoid(invoice_id, client_charge || 0);
                const clTrxnBody = {
                    ctrxn_type: 'DEBIT',
                    ctrxn_amount: client_charge || 0,
                    ctrxn_cl: comb_client,
                    ctrxn_voucher: prevInvoiceNo,
                    ctrxn_particular_id: 161,
                    ctrxn_created_at: (0, dayjs_1.default)().format('YYYY-MM-DD'),
                    ctrxn_note: '',
                    ctrxn_particular_type: 'invoice void charge',
                };
                let void_charge_ctrxn_id = 0;
                if (client_charge && client_charge > 0) {
                    void_charge_ctrxn_id = yield trxns.clTrxnInsert(clTrxnBody);
                }
                // delete invoice;
                if (invoice_category_id === 1) {
                    yield this.deleteAirTicket(req, trx);
                }
                else if (invoice_category_id === 2) {
                    yield new deleteInvoiceNonCom_1.default().deleteNonComInvoice(req, trx);
                }
                else if (invoice_category_id === 3) {
                    yield new deleteInvoiceReissue_1.default().deleteReissue(req, trx);
                }
                else if (invoice_category_id === 4) {
                    yield new deleteTourPackRefund_1.default().delete(req, trx);
                }
                else if (invoice_category_id === 5) {
                    yield new deleteInvoiceOther_1.default().deleteInvoiceOther(req, trx);
                }
                else if (invoice_category_id === 10) {
                    yield new deleteinvoicevisa_services_1.default().deleteInvoiceVisa(req, trx);
                }
                else if (invoice_category_id === 26) {
                    yield new DeleteInvoiceUmmrah_1.default().deleteInvoiceUmmrah(req, trx);
                }
                else if (invoice_category_id === 30) {
                    yield new DeleteInvoiceHajjPreReg_1.default().deleteInvoiceHajjPre(req, trx);
                }
                else if (invoice_category_id === 31) {
                    yield new DeleteInvoiceHajjServices_1.default().deleteInvoiceHajj(req, trx);
                }
                const { combined_id } = (0, common_helper_1.separateCombClientToId)(comb_client);
                for (const info of invoice_vendors) {
                    if (info.vendor_charge) {
                        const VTrxnBody = {
                            comb_vendor: info.comb_vendor,
                            vtrxn_amount: info.vendor_charge,
                            vtrxn_created_at: (0, dayjs_1.default)().format('YYYY-MM-DD'),
                            vtrxn_note: '',
                            vtrxn_particular_id: 1,
                            vtrxn_particular_type: 'Vendor Payment',
                            vtrxn_type: combined_id ? 'DEBIT' : 'CREDIT',
                            vtrxn_user_id: req.user_id,
                        };
                        yield trxns.VTrxnInsert(VTrxnBody);
                    }
                }
                yield this.insertAudit(req, 'delete', 'Invoice has been voided!', req.user_id, 'INVOICES');
                return { success: true, message: 'Invoice has been voided!' };
            }));
        });
    }
}
exports.default = DeleteAirTicket;
//# sourceMappingURL=deleteAirTicket.js.map