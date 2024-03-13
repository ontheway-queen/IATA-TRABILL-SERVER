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
const AddInvoiceHajjServices_1 = __importDefault(require("./NarrowServices/AddInvoiceHajjServices"));
const DeleteInvoiceHajjServices_1 = __importDefault(require("./NarrowServices/DeleteInvoiceHajjServices"));
const EditInvoiceHajj_1 = __importDefault(require("./NarrowServices/EditInvoiceHajj"));
const abstract_services_1 = __importDefault(require("../../../../abstracts/abstract.services"));
const hajjRefund_services_1 = __importDefault(require("./NarrowServices/hajjRefund.services"));
class InvoiceHajjServices extends abstract_services_1.default {
    constructor() {
        super();
        this.getAllInvoices = (req) => __awaiter(this, void 0, void 0, function* () {
            const { page, size, search, from_date, to_date } = req.query;
            const conn = this.models.CommonInvoiceModel(req);
            const data = yield conn.getAllInvoices(31, Number(page) || 1, Number(size) || 20, search, from_date, to_date);
            return Object.assign({ success: true, message: 'All Invoices Hajj' }, data);
        });
        // VIEW INVOICE HAJJ
        this.viewInvoiceHajj = (req) => __awaiter(this, void 0, void 0, function* () {
            const invoice_id = Number(req.params.id);
            const common_conn = this.models.CommonInvoiceModel(req);
            const conn_receipt = this.models.MoneyReceiptModels(req);
            const conn = this.models.InvoiceHajjModels(req);
            // INVOICE DATA
            const invoice = yield common_conn.getViewInvoiceInfo(invoice_id);
            const haji_information = yield conn.getInvoiceHajjPilgrimsInfo(invoice_id);
            const hotel_information = yield conn.getHajiHotelInfo(invoice_id);
            const transport_information = yield conn.getHajiTransportInfo(invoice_id);
            const billing_information = yield conn.getInvoiceHajjBillingView(invoice_id);
            const payments = yield conn_receipt.getMoneyReceiptByInvoiceid(invoice_id);
            const routes = yield common_conn.getInvoiceRoutesName(invoice_id);
            return {
                success: true,
                data: Object.assign(Object.assign({}, invoice), { routes,
                    haji_information,
                    hotel_information,
                    transport_information,
                    billing_information,
                    payments }),
            };
        });
        this.getDataForEdit = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.InvoiceHajjModels(req);
            const common_conn = this.models.CommonInvoiceModel(req);
            const id = Number(req.params.id);
            const invoiceInfo = yield conn.getInvoiceHajjInfo(id);
            const pilgrims_information = yield conn.getInvoiceHajjPilgrimsInfo(id);
            const hotel_information = yield conn.getHajiHotelInfo(id);
            const transport_information = yield conn.getHajiTransportInfo(id);
            const billing_information = yield conn.getForEditHajiBilling(id);
            const invoice_hajj_routes = yield common_conn.getInvoiceRoutes(id);
            return {
                success: true,
                data: Object.assign(Object.assign({}, invoiceInfo), { invoice_hajj_routes, invoice_no_passenger: pilgrims_information.length, pilgrims_information,
                    hotel_information,
                    transport_information,
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
        this.getHajjInfo = (req) => __awaiter(this, void 0, void 0, function* () {
            const { invoice_id } = req.params;
            const conn = this.models.InvoiceHajjModels(req);
            const data = yield conn.getHajjInfo(invoice_id);
            return {
                success: true,
                data,
            };
        });
        this.getHajjInvoiceRefund = (req) => __awaiter(this, void 0, void 0, function* () {
            const { invoice_id } = req.params;
            const conn = this.models.InvoiceHajjModels(req);
            const refund = yield conn.getHajjInvoiceRefund(invoice_id);
            const refundItems = yield conn.getHajjInvoiceRefundItems(invoice_id);
            return {
                success: true,
                data: { refund, refundItems },
            };
        });
        // =============== narrow services ===================
        this.addInvoiceHajjServices = new AddInvoiceHajjServices_1.default()
            .addInvoiceHajjServices;
        this.editInvoiceHajj = new EditInvoiceHajj_1.default().editInvoiceHajj;
        this.deleteInvoiceHajj = new DeleteInvoiceHajjServices_1.default().deleteInvoiceHajj;
        this.voidInvoiceHajj = new DeleteInvoiceHajjServices_1.default().voidInvoiceHajj;
        this.createHajjRefund = new hajjRefund_services_1.default().hajjRefund;
    }
}
exports.default = InvoiceHajjServices;
//# sourceMappingURL=InvoiceHajj.Services.js.map