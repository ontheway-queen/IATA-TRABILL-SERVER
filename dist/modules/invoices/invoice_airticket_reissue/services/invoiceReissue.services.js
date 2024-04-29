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
const addInvoiceExistingReissue_1 = __importDefault(require("./narrowServices/addInvoiceExistingReissue"));
const addInvoiceReissue_1 = __importDefault(require("./narrowServices/addInvoiceReissue"));
const deleteInvoiceReissue_1 = __importDefault(require("./narrowServices/deleteInvoiceReissue"));
const editInvoiceExistingReissue_1 = __importDefault(require("./narrowServices/editInvoiceExistingReissue"));
const editInvoiceReissue_1 = __importDefault(require("./narrowServices/editInvoiceReissue"));
const reisseuRefund_service_1 = __importDefault(require("./narrowServices/reisseuRefund.service"));
class ReissueAirticket extends abstract_services_1.default {
    constructor() {
        super();
        this.getAllInvoices = (req) => __awaiter(this, void 0, void 0, function* () {
            const { page, size, search, from_date, to_date } = req.query;
            const conn = this.models.CommonInvoiceModel(req);
            const data = yield conn.getAllInvoices(3, Number(page) || 1, Number(size) || 20, search, from_date, to_date);
            return Object.assign({ success: true, message: 'All Invoices Air ticket Reissue' }, data);
        });
        // VIEW INVOICE REISSUE
        this.viewInvoiceReissue = (req) => __awaiter(this, void 0, void 0, function* () {
            const invoice_id = req.params.invoice_id;
            const common_conn = this.models.CommonInvoiceModel(req);
            const conn = this.models.reissueAirticket(req);
            const invoice = yield common_conn.getViewInvoiceInfo(invoice_id);
            const refunds = yield this.models
                .refundModel(req)
                .getAirticketRefundItems(invoice_id);
            const pax_details = yield common_conn.getInvoiceAirTicketPaxDetails(invoice_id);
            const airticket_information = yield conn.getReissueAirticketInfo(invoice_id);
            const flights = yield conn.getFlightDetails(invoice_id);
            const reissued = yield common_conn.getReissuedItemByInvId(invoice_id);
            return {
                success: true,
                data: Object.assign(Object.assign({}, invoice), { reissued,
                    refunds,
                    airticket_information,
                    flights,
                    pax_details }),
            };
        });
        this.getExistingClientAirticket = (req) => __awaiter(this, void 0, void 0, function* () {
            const client = req.params.client_id;
            const conn = this.models.reissueAirticket(req);
            const data1 = yield conn.getExistingClientAirticket(client, 'trabill_invoice');
            const data2 = yield conn.getExistingClientAirticket(client, 'trabill_invoice_noncom');
            const data3 = yield conn.getExistingClientAirticket(client, 'trabill_invoice_reissue');
            const data = [...data1, ...data2, ...data3];
            return {
                success: true,
                data,
            };
        });
        this.getDataForEdit = (req) => __awaiter(this, void 0, void 0, function* () {
            const invoice_id = req.params.invoice_id;
            const conn = this.models.reissueAirticket(req);
            const common_conn = this.models.CommonInvoiceModel(req);
            const invoice_info = yield conn.getInvoiceReissueData(invoice_id);
            const airticketPrerequire = yield common_conn.getAirticketPrerequire(invoice_id);
            if (invoice_info.invoice_reissue_client_type === 'EXISTING') {
                const airTicketInfo = yield conn.getExistingClTicketInfo(invoice_id);
                const { invoice_combclient_id, invoice_sales_man_id, invoice_sales_date, invoice_no, invoice_note, invoice_due_date, } = invoice_info;
                const data = Object.assign(Object.assign({}, airTicketInfo), { invoice_combclient_id,
                    invoice_sales_man_id,
                    invoice_sales_date,
                    invoice_no,
                    invoice_note,
                    invoice_due_date });
                return {
                    success: true,
                    data,
                };
            }
            const ticketInfo = yield conn.getReissueAirticketsForEdit(invoice_id);
            return {
                success: true,
                data: {
                    invoice_info: Object.assign(Object.assign({}, invoice_info), airticketPrerequire),
                    ticketInfo,
                },
            };
        });
        this.getReissueTicketInfo = (req) => __awaiter(this, void 0, void 0, function* () {
            const invoice_id = req.params.invoice_id;
            const conn = this.models.reissueAirticket(req);
            const data = yield conn.getReissueTicketInfo(invoice_id);
            return {
                success: true,
                data,
            };
        });
        // ============= narrow services ==============
        this.addReissueAirticket = new addInvoiceReissue_1.default().addReissueAirticket;
        this.addExistingClient = new addInvoiceExistingReissue_1.default().addExistingClient;
        this.editReissueAirticket = new editInvoiceReissue_1.default().editReissueInvoice;
        this.editExistingCl = new editInvoiceExistingReissue_1.default().editExistingCl;
        this.deleteReissue = new deleteInvoiceReissue_1.default().deleteReissue;
        this.voidReissue = new deleteInvoiceReissue_1.default().voidReissue;
        this.reissueRefund = new reisseuRefund_service_1.default().reissueRefund;
        this.getReissueRefundInfo = new reisseuRefund_service_1.default().getReissueRefundInfo;
    }
}
exports.default = ReissueAirticket;
//# sourceMappingURL=invoiceReissue.services.js.map