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
const customError_1 = __importDefault(require("../../../../common/utils/errors/customError"));
const AddInvoiceHajjPre_Services_1 = __importDefault(require("./NarrowServices/AddInvoiceHajjPre.Services"));
const DeleteInvoiceHajjPreReg_1 = __importDefault(require("./NarrowServices/DeleteInvoiceHajjPreReg"));
const EditInvoiceHajjPreReg_1 = __importDefault(require("./NarrowServices/EditInvoiceHajjPreReg"));
class InvoiceHajjPreRegServices extends abstract_services_1.default {
    constructor() {
        super();
        this.getAllInvoices = (req) => __awaiter(this, void 0, void 0, function* () {
            const { page, size, search, from_data, to_date } = req.query;
            const conn = this.models.CommonInvoiceModel(req);
            const data = yield conn.getAllInvoices(30, Number(page) || 1, Number(size) || 20, search, from_data, to_date);
            return Object.assign({ success: true, message: 'All Invoices Hajj Pre Reg' }, data);
        });
        // VIEW INVOICE HAJJ PRE REG
        this.viewInvoiceHajjPreReg = (req) => __awaiter(this, void 0, void 0, function* () {
            const invoice_id = req.params.id;
            const common_conn = this.models.CommonInvoiceModel(req);
            const conn_receipt = this.models.MoneyReceiptModels(req);
            const conn = this.models.invoiceHajjPre(req);
            // INVOICE DATA
            const invoice = yield common_conn.getViewInvoiceInfo(invoice_id);
            const haji_information = yield conn.getPreHajiInfo(invoice_id);
            const invoiceDue = yield conn_receipt.getInvoiceDue(invoice_id);
            const billing_information = yield conn.getHajiBillingInfos(invoice_id);
            return {
                success: true,
                data: Object.assign(Object.assign(Object.assign({}, invoiceDue), invoice), { haji_information,
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
        // GET_FOR_EDIT
        this.getDetailsById = (req) => __awaiter(this, void 0, void 0, function* () {
            const invoice_id = Number(req.params.invoice_id);
            const conn = this.models.invoiceHajjPre(req);
            const common_conn = this.models.CommonInvoiceModel(req);
            const invoice = yield common_conn.getForEditInvoice(invoice_id);
            const haji_information = yield conn.getPreHajiInfo(invoice_id);
            const billing_information = yield conn.getForEditBillingInfo(invoice_id);
            return {
                success: true,
                data: Object.assign(Object.assign({}, invoice), { haji_information, billing_information }),
            };
        });
        this.hajiInformationHajjiManagement = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.invoiceHajjPre(req);
            const haji_information = yield conn.getHajiInformationForHajjiManagement();
            return {
                success: true,
                data: haji_information,
            };
        });
        this.hajiInfoByTrackingNo = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.invoiceHajjPre(req);
            const tracking_no = req.params.id;
            if (!tracking_no) {
                throw new customError_1.default('Please provide  valid Tracking Number', 400, 'Invalid Tracking Number');
            }
            const haji_information = yield conn.getHajiInfoByTrackingNo(tracking_no);
            return {
                success: true,
                data: haji_information,
            };
        });
        this.hajiInfoSerialIsUnique = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.invoiceHajjPre(req);
            const { data_for, value } = req.body;
            const data = yield conn.getAllTrackingAndSerialNo(data_for, value);
            return {
                success: true,
                data,
                message: data
                    ? `${data_for} no. is already exist`
                    : `${data_for} no. is unique`,
            };
        });
        this.updateHajjiInfoStatus = (req) => __awaiter(this, void 0, void 0, function* () {
            const { invoice_id } = req.params;
            const { status } = req.query;
            const { updated_by } = req.body;
            const conn = this.models.invoiceHajjPre(req);
            yield conn.updateHajjiInfoStatus(invoice_id, status, updated_by);
            return {
                success: true,
                message: 'Hajji info status updated successfully!',
            };
        });
        this.getAllHajiPreRegInfos = (req) => __awaiter(this, void 0, void 0, function* () {
            const { page, size, month } = req.query;
            const conn = this.models.invoiceHajjPre(req);
            const data = yield conn.getAllHajiPreRegInfos(Number(page) || 1, Number(size) || 20, String(month));
            const count = yield conn.countAllHajiPreRegInfosDataRow(String(month));
            return { success: true, count, data };
        });
        // =============== narrow services ===================
        this.addInvoiceHajjPre = new AddInvoiceHajjPre_Services_1.default().addInvoiceHajjPre;
        this.editInvoiceHajjPre = new EditInvoiceHajjPreReg_1.default().editInvoiceHajjPre;
        this.deleteInvoiceHajjPre = new DeleteInvoiceHajjPreReg_1.default()
            .deleteInvoiceHajjPre;
        this.voidHajjPreReg = new DeleteInvoiceHajjPreReg_1.default().voidHajjPreReg;
    }
}
exports.default = InvoiceHajjPreRegServices;
//# sourceMappingURL=InvoiceHajjPreReg.Services.js.map