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
const addInvoiceNonCommission_1 = __importDefault(require("./narrowServices/addInvoiceNonCommission"));
const deleteInvoiceNonCom_1 = __importDefault(require("./narrowServices/deleteInvoiceNonCom"));
const editInvoiceNonCommission_1 = __importDefault(require("./narrowServices/editInvoiceNonCommission"));
class InvoiceNonCommission extends abstract_services_1.default {
    constructor() {
        super();
        this.getAllInvoices = (req) => __awaiter(this, void 0, void 0, function* () {
            const { page, size, search, from_date, to_date } = req.query;
            const conn = this.models.CommonInvoiceModel(req);
            const data = yield conn.getAllInvoices(2, Number(page) || 1, Number(size) || 20, search, from_date, to_date);
            return Object.assign({ success: true, message: 'All Invoices Air Ticket Non Commission' }, data);
        });
        // VIEW INVOICE NON COMMISSION
        this.viewNonCommission = (req) => __awaiter(this, void 0, void 0, function* () {
            const invoice_id = req.params.id;
            const common_conn = this.models.CommonInvoiceModel(req);
            const conn = this.models.invoiceNonCommission(req);
            const data = yield common_conn.getViewInvoiceInfo(invoice_id);
            const prepared_by = yield common_conn.getInvoicePreparedBy(invoice_id);
            const authorized_by = yield common_conn.getAuthorizedBySignature();
            const airticket_information = yield conn.getViewAirticketNonCom(invoice_id);
            const pax_details = yield common_conn.getInvoiceAirTicketPaxDetails(invoice_id);
            const flights = yield conn.getFlightDetails(invoice_id);
            const reissued = yield common_conn.getReissuedItemByInvId(invoice_id);
            const refunds = yield this.models
                .refundModel(req)
                .getAirticketRefundItems(invoice_id);
            return {
                success: true,
                data: Object.assign(Object.assign({}, data), { authorized_by,
                    prepared_by,
                    reissued,
                    refunds,
                    airticket_information,
                    flights,
                    pax_details }),
            };
        });
        this.getDataForEdit = (req) => __awaiter(this, void 0, void 0, function* () {
            const invoice_id = Number(req.params.invoice_id);
            const conn = this.models.invoiceNonCommission(req);
            const common_conn = this.models.CommonInvoiceModel(req);
            const invoice_info = yield common_conn.getForEditInvoice(invoice_id);
            const airticketPrerequre = yield common_conn.getAirticketPrerequire(invoice_id);
            const ticketInfo = yield conn.getNonComTickets(invoice_id);
            return {
                success: true,
                data: {
                    invoice_info: Object.assign(Object.assign({}, invoice_info), airticketPrerequre),
                    ticketInfo,
                },
            };
        });
        // ============= narrow services ==============
        this.addInvoiceNonCommission = new addInvoiceNonCommission_1.default()
            .addInvoiceNonCommission;
        this.editInvoiceNonCommission = new editInvoiceNonCommission_1.default()
            .editInvoiceNonCommission;
        this.deleteNonComInvoice = new deleteInvoiceNonCom_1.default().deleteNonComInvoice;
    }
}
exports.default = InvoiceNonCommission;
//# sourceMappingURL=invoiceNonCommission.services.js.map