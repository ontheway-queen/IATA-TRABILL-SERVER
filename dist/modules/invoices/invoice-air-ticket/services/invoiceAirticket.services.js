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
const addInvoiceAirticket_1 = __importDefault(require("./narrowServices/addInvoiceAirticket"));
const addInvoiceInfo_services_1 = __importDefault(require("./narrowServices/addInvoiceInfo.services"));
const air_ticket_tax_refund_1 = __importDefault(require("./narrowServices/air_ticket_tax_refund"));
const deleteAirTicket_1 = __importDefault(require("./narrowServices/deleteAirTicket"));
const editInvoiceAirticket_1 = __importDefault(require("./narrowServices/editInvoiceAirticket"));
const importIur_1 = __importDefault(require("./narrowServices/importIur"));
const sendMail_services_1 = __importDefault(require("./narrowServices/sendMail.services"));
const void_invoice_1 = __importDefault(require("./narrowServices/void_invoice"));
const add_invoice_pnr_service_1 = __importDefault(require("./pnrServices/add_invoice_pnr.service"));
const pnr_details_service_1 = __importDefault(require("./pnrServices/pnr_details.service"));
class InvoiceAirticketService extends abstract_services_1.default {
    constructor() {
        super();
        this.getAllInvoices = (req) => __awaiter(this, void 0, void 0, function* () {
            const { page, size, search, from_date, to_date } = req.query;
            const conn = this.models.CommonInvoiceModel(req);
            const data = yield conn.getAllInvoices(1, Number(page) || 1, Number(size) || 20, search, from_date, to_date);
            return Object.assign({ success: true, message: 'All Invoices Airticket' }, data);
        });
        // get data for edit
        this.getDataForEdit = (req) => __awaiter(this, void 0, void 0, function* () {
            const invoice_id = Number(req.params.invoice_id);
            const conn = this.models.invoiceAirticketModel(req);
            const common_conn = this.models.CommonInvoiceModel(req);
            const invoice_info = yield common_conn.getForEditInvoice(invoice_id);
            const airticketPrerequre = yield common_conn.getAirticketPrerequire(invoice_id);
            const ticketInfo = yield conn.getAirticketItems(invoice_id);
            return {
                success: true,
                data: {
                    invoice_info: Object.assign(Object.assign({}, invoice_info), airticketPrerequre),
                    ticketInfo,
                },
            };
        });
        // VIEW INVOICE AIR TICKET BY:ID
        this.viewInvoice = (req) => __awaiter(this, void 0, void 0, function* () {
            const invoice_id = req.params.invoice_id;
            const conn = this.models.invoiceAirticketModel(req);
            const common_conn = this.models.CommonInvoiceModel(req);
            const invoice_summary = yield common_conn.getViewInvoiceInfo(invoice_id);
            const prepared_by = yield common_conn.getInvoicePreparedBy(invoice_id);
            const authorized_by = yield common_conn.getAuthorizedBySignature();
            const pax_details = yield common_conn.getInvoiceAirTicketPaxDetails(invoice_id);
            const flights = yield conn.getAirTicketFlights(invoice_id);
            const billing_info = yield conn.getAirTicketBilling(invoice_id);
            return {
                success: true,
                data: Object.assign(Object.assign({}, invoice_summary), { billing_info,
                    authorized_by,
                    prepared_by,
                    pax_details,
                    flights }),
            };
        });
        this.viewInvoiceDetails = (req) => __awaiter(this, void 0, void 0, function* () {
            const invoice_id = req.params.invoice_id;
            const conn = this.models.invoiceAirticketModel(req);
            const common_conn = this.models.CommonInvoiceModel(req);
            const airticket_information = yield conn.getViewAirticketItems(invoice_id);
            const reissued = yield common_conn.getReissuedItemByInvId(invoice_id);
            const tax_refund = yield conn.viewAirTicketTaxRefund(invoice_id);
            const refunds = yield this.models
                .refundModel(req)
                .getAirticketRefundItems(invoice_id);
            return {
                success: true,
                data: {
                    reissued,
                    refunds,
                    airticket_information,
                    tax_refund,
                },
            };
        });
        this.getClientDue = (req) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.models
                .CommonInvoiceModel(req)
                .getClientDue(req.params.id);
            return {
                success: true,
                data,
            };
        });
        this.getAllInvoicesNumAndId = (req) => __awaiter(this, void 0, void 0, function* () {
            const common_conn = this.models.CommonInvoiceModel(req);
            const data = yield common_conn.getAllInvoiceNomAndId();
            return {
                success: true,
                data,
            };
        });
        this.getInvoiceActivity = (req) => __awaiter(this, void 0, void 0, function* () {
            const id = Number(req.params.id);
            const data = yield this.models
                .invoiceAirticketModel(req)
                .getInvoiceActivity(id);
            return { success: true, data };
        });
        this.isTicketAlreadyExist = (req) => __awaiter(this, void 0, void 0, function* () {
            const ticket = req.params.ticket;
            const data = yield this.models
                .invoiceAirticketModel(req)
                .isTicketNumberExist(ticket);
            return {
                success: true,
                data,
                message: data ? 'Ticket already exist' : 'Ticket no. is unique',
            };
        });
        // AIR TICKET CUSTOM REPORT
        this.airTicketCustomReport = (req) => __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const { page, size, from_date, to_date } = req.query;
            const conn = this.models.invoiceAirticketModel(req);
            const fieldKays = body.fields.map((item) => item.key);
            const data = yield conn.selectCustomAirTicketReport(fieldKays, page, size, from_date, to_date);
            const count = yield conn.selectCustomAirTicketReportCount(from_date, to_date);
            return { success: true, message: 'Air ticket custom report', count, data };
        });
        // AIR TICKET TAX REFUND
        this.selectAirTicketTax = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.invoiceAirticketModel(req);
            const invoiceId = req.params.invoice_id;
            const data = yield conn.selectAirTicketTax(invoiceId);
            return { success: true, data };
        });
        this.getInvoiceInfoForVoid = (req) => __awaiter(this, void 0, void 0, function* () {
            const { invoice_id } = req.params;
            const conn = this.models.invoiceAirticketModel(req);
            const data = yield conn.getInvoiceInfoForVoid(invoice_id);
            return {
                success: true,
                data,
            };
        });
        this.getInvoiceDiscount = (req) => __awaiter(this, void 0, void 0, function* () {
            const { invoice_id } = req.params;
            const conn = this.models.CommonInvoiceModel(req);
            const data = yield conn.getInvoiceDiscount(invoice_id);
            return {
                success: true,
                data,
            };
        });
        // INVOICE CLIENT PAYMENT
        this.getInvoiceClientPayment = (req) => __awaiter(this, void 0, void 0, function* () {
            const { invoice_id } = req.params;
            const conn = this.models.invoiceAirticketModel(req);
            const data = yield conn.getInvoiceClientPayment(invoice_id);
            return {
                success: true,
                data,
            };
        });
        this.getInvoiceInfo = (req) => __awaiter(this, void 0, void 0, function* () {
            const { invoice_id } = req.params;
            const data = yield this.models
                .invoiceAirticketModel(req)
                .getInvoiceInfo(invoice_id);
            return {
                success: true,
                data,
            };
        });
        // ============= narrow services ==============
        this.pnrDetails = new pnr_details_service_1.default().pnrDetails;
        this.addInvoiceAirticket = new addInvoiceAirticket_1.default().addInvoiceAirTicket;
        this.editInvoiceAirticket = new editInvoiceAirticket_1.default().editInvoiceAirTicket;
        this.deleteInvoiceAirTicket = new deleteAirTicket_1.default().deleteAirTicket;
        this.voidInvoiceAirticket = new void_invoice_1.default().voidInvoice;
        this.addAirTicketTax = new air_ticket_tax_refund_1.default().addAirTicketTax;
        this.addInvoiceWithPnr = new add_invoice_pnr_service_1.default().addInvoiceWithPnr;
        this.sendEmail = new sendMail_services_1.default().sendEmail;
        this.addInvoiceInfo = new addInvoiceInfo_services_1.default().add;
        this.deleteInvoiceInfo = new addInvoiceInfo_services_1.default().delete;
        this.createInvoiceIUR = new importIur_1.default().create;
    }
}
exports.default = InvoiceAirticketService;
//# sourceMappingURL=invoiceAirticket.services.js.map