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
const addInvoiceOther_1 = __importDefault(require("./narrowServices/addInvoiceOther"));
const deleteInvoiceOther_1 = __importDefault(require("./narrowServices/deleteInvoiceOther"));
const editInvoiceOther_1 = __importDefault(require("./narrowServices/editInvoiceOther"));
class InivoiceOther extends abstract_services_1.default {
    constructor() {
        super();
        // GET ALL
        this.getAllInvoiceOther = (req) => __awaiter(this, void 0, void 0, function* () {
            const { page, size, search, from_date, to_date } = req.query;
            const conn = this.models.invoiceOtherModel(req);
            const data = yield conn.getAllInvoiceOtherList(search, from_date, to_date, Number(page), size);
            return Object.assign({ success: true, message: 'All invoices others' }, data);
        });
        // VIEW INVOICE OTHERS
        this.viewInvoiceOther = (req) => __awaiter(this, void 0, void 0, function* () {
            const invoice_id = req.params.id;
            const conn = this.models.invoiceOtherModel(req);
            const common_conn = this.models.CommonInvoiceModel(req);
            const invoice = yield common_conn.getViewInvoiceInfo(invoice_id);
            const passport_information = yield conn.getInvoiceOtherPassInfo(invoice_id);
            const ticket_information = yield conn.getInvoiceTicketInfo(invoice_id);
            const hotel_information = yield conn.getInvoiceHotelInfo(invoice_id);
            const transport_information = yield conn.getInvoiceTransportInfo(invoice_id);
            const billing_information = yield conn.getInvoiceBillingInfo(invoice_id);
            const refunds = yield this.models
                .refundModel(req)
                .getOtherRefundItems(invoice_id);
            return {
                success: true,
                data: Object.assign(Object.assign({}, invoice), { refunds,
                    passport_information,
                    ticket_information,
                    hotel_information,
                    transport_information,
                    billing_information }),
            };
        });
        this.getTransportType = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.invoiceOtherModel(req);
            const data = yield conn.getTransportType();
            return { success: true, data };
        });
        this.getForEdit = (req) => __awaiter(this, void 0, void 0, function* () {
            const invoice_id = req.params.id;
            const conn = this.models.invoiceOtherModel(req);
            const common_conn = this.models.CommonInvoiceModel(req);
            const invoice = yield common_conn.getForEditInvoice(invoice_id);
            const ticketInfo = yield conn.getInvoiceTicketInfo(invoice_id);
            const hotel_information = yield conn.getInvoiceHotel(invoice_id);
            const transport_information = yield conn.getInvoiceTransportInfo(invoice_id);
            const billing_information = yield conn.getInvoiceBilling(invoice_id);
            const passport_information = yield conn.getInvoiceOtherPass(invoice_id);
            return {
                success: true,
                data: Object.assign(Object.assign({}, invoice), { passport_information,
                    ticketInfo,
                    hotel_information,
                    transport_information,
                    billing_information }),
            };
        });
        this.getAllInvoiceOthersByClientId = (req) => __awaiter(this, void 0, void 0, function* () {
            const clientId = Number(req.params.id);
            const conn = this.models.invoiceOtherModel(req);
            const invoiceOthers = yield conn.getRefundOthersInfo(clientId);
            return {
                success: true,
                data: invoiceOthers,
            };
        });
        // ============= narrow services ==============
        this.postInvoiceOther = new addInvoiceOther_1.default().addInvoiceOther;
        this.editInvoiceOther = new editInvoiceOther_1.default().editInvoiceOther;
        this.deleteInvoiceOther = new deleteInvoiceOther_1.default().deleteInvoiceOther;
        this.voidInvoiceOther = new deleteInvoiceOther_1.default().voidInvoiceOther;
    }
}
exports.default = InivoiceOther;
//# sourceMappingURL=invoiceOther.services.js.map