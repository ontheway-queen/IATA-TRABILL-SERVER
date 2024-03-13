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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_services_1 = __importDefault(require("../../../../abstracts/abstract.services"));
const AddInvoiceummrah_1 = __importDefault(require("./NarrowServices/AddInvoiceummrah"));
const DeleteInvoiceUmmrah_1 = __importDefault(require("./NarrowServices/DeleteInvoiceUmmrah"));
const EditInvoiceUmmrah_1 = __importDefault(require("./NarrowServices/EditInvoiceUmmrah"));
const ummrahRefund_services_1 = __importDefault(require("./NarrowServices/ummrahRefund.services"));
class InvoiceUmmrahServices extends abstract_services_1.default {
    constructor() {
        super();
        this.getAllInvoices = (req) => __awaiter(this, void 0, void 0, function* () {
            const { page, size, search, from_date, to_date } = req.query;
            const conn = this.models.CommonInvoiceModel(req);
            const data = yield conn.getAllInvoices(26, Number(page) || 1, Number(size) || 20, search, from_date, to_date);
            return Object.assign({ success: true, message: 'All Invoices Air ticket' }, data);
        });
        // VIEW INVOICE UMRAH
        this.viewInvoiceUmmah = (req) => __awaiter(this, void 0, void 0, function* () {
            const invoice_id = Number(req.params.invoice_id);
            const common_conn = this.models.CommonInvoiceModel(req);
            const conn = this.models.InvoiceUmmarhModels(req);
            const invoice = yield common_conn.getViewInvoiceInfo(invoice_id);
            const passenger_info = yield conn.viewIUmmrahPassengerInfos(invoice_id);
            const hotel_information = yield conn.getIUHotelInfos(invoice_id);
            const billing_information = yield common_conn.getViewBillingInfo(invoice_id, 'trabill_invoice_umrah_billing_infos');
            return {
                success: true,
                data: Object.assign(Object.assign({}, invoice), { passenger_info,
                    hotel_information,
                    billing_information }),
            };
        });
        this.getDataForEdit = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.InvoiceUmmarhModels(req);
            const common_conn = this.models.CommonInvoiceModel(req);
            const invoice_id = Number(req.params.invoice_id);
            const invoiceInfo = yield common_conn.getForEditInvoice(invoice_id);
            const passenget_info = yield conn.getIUmmrahPassengerInfos(invoice_id);
            const hotel_information = yield conn.getIUHotelInfos(invoice_id);
            const billing_information = yield conn.getForEditBilling(invoice_id);
            return {
                success: true,
                data: Object.assign(Object.assign({}, invoiceInfo), { invoice_no_passenger: passenget_info.length, passenget_info,
                    hotel_information,
                    billing_information }),
            };
        });
        this.getPreRegistrationReports = (req) => __awaiter(this, void 0, void 0, function* () {
            var _a, e_1, _b, _c;
            const conn = this.models.invoiceHajjPre(req);
            const year = req.params.year;
            const data = yield conn.getPreRegistrationReports(year);
            const newData = [];
            try {
                for (var _d = true, data_1 = __asyncValues(data), data_1_1; data_1_1 = yield data_1.next(), _a = data_1_1.done, !_a;) {
                    _c = data_1_1.value;
                    _d = false;
                    try {
                        const item = _c;
                        const haji_group_id = item.invoice_haji_group_id;
                        const hajiGroupData = yield conn.getHajiGroupName(haji_group_id);
                        newData.push(Object.assign(Object.assign({}, item), hajiGroupData));
                    }
                    finally {
                        _d = true;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (!_d && !_a && (_b = data_1.return)) yield _b.call(data_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return { success: true, data: newData };
        });
        this.getBillingInfo = (req) => __awaiter(this, void 0, void 0, function* () {
            const invoiceId = req.params.invoice_id;
            const conn = this.models.InvoiceUmmarhModels(req);
            const data = yield conn.getBillingInfo(invoiceId);
            return {
                success: true,
                data,
            };
        });
        this.getUmmrahRefund = (req) => __awaiter(this, void 0, void 0, function* () {
            const invoiceId = req.params.invoice_id;
            const conn = this.models.InvoiceUmmarhModels(req);
            const refund = yield conn.getUmmrahRefund(invoiceId);
            const refundItems = yield conn.getUmmrahRefundItems(invoiceId);
            return {
                success: true,
                data: { refund, refundItems },
            };
        });
        // =============== narrow services ===================
        this.postInvoiceUmmrah = new AddInvoiceummrah_1.default().postInvoiceUmmrah;
        this.editInvoiceUmmrah = new EditInvoiceUmmrah_1.default().editInvoiceUmmrah;
        this.deleteInvoiceUmmrah = new DeleteInvoiceUmmrah_1.default().deleteInvoiceUmmrah;
        this.voidInvoiceUmmrah = new DeleteInvoiceUmmrah_1.default().voidInvoiceUmmrah;
        this.createUmmrahRefund = new ummrahRefund_services_1.default().refund;
    }
}
exports.default = InvoiceUmmrahServices;
//# sourceMappingURL=InvoiceUmmrah.Services.js.map