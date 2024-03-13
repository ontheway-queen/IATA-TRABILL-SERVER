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
const axios_1 = __importDefault(require("axios"));
const abstract_services_1 = __importDefault(require("../../../../abstracts/abstract.services"));
const Trxns_1 = __importDefault(require("../../../../common/helpers/Trxns"));
const common_helper_1 = require("../../../../common/helpers/common.helper");
const customError_1 = __importDefault(require("../../../../common/utils/errors/customError"));
const lib_1 = require("../../../../common/utils/libraries/lib");
const addInvoiceAirticket_1 = __importDefault(require("./narrowServices/addInvoiceAirticket"));
const deleteAirTicket_1 = __importDefault(require("./narrowServices/deleteAirTicket"));
const editInvoiceAirticket_1 = __importDefault(require("./narrowServices/editInvoiceAirticket"));
const sendMail_services_1 = __importDefault(require("./narrowServices/sendMail.services"));
class InvoiceAirticketService extends abstract_services_1.default {
    constructor() {
        super();
        // GET PNR DETAILS
        this.pnrDetails = (req) => __awaiter(this, void 0, void 0, function* () {
            const pnrId = req.params.pnr;
            const apiUrl = `http://192.168.0.235:9008/api/v1/btob/flight/booking-details/${pnrId}`;
            try {
                const response = yield axios_1.default.get(apiUrl);
                const data = response.data;
                if (data.success) {
                    return data;
                }
                return { success: true, data: [] };
            }
            catch (error) {
                throw new customError_1.default('PNR details not found!', 404, error.message);
            }
        });
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
        this.viewCommonInvoiceDetails = (req) => __awaiter(this, void 0, void 0, function* () {
            const invoice_id = req.params.invoice_id;
            const conn = this.models.invoiceAirticketModel(req);
            const common_conn = this.models.CommonInvoiceModel(req);
            const data = yield common_conn.getViewInvoiceInfo(invoice_id);
            const pax_details = yield common_conn.getInvoiceAirTicketPaxDetails(invoice_id);
            const flights = yield conn.getAirTicketFlights(invoice_id);
            const airticket_information = yield conn.getViewAirticketItems(invoice_id);
            const taxes_commission = yield conn.selectAirTicketAirlineCommissions(invoice_id);
            const reissued = yield common_conn.getReissuedItemByInvId(invoice_id);
            const refunds = yield this.models
                .refundModel(req)
                .getAirticketRefundItems(invoice_id);
            const tax_refund = yield conn.viewAirTicketTaxRefund(invoice_id);
            return {
                success: true,
                data: Object.assign(Object.assign({}, data), { reissued,
                    refunds,
                    pax_details,
                    flights,
                    airticket_information,
                    tax_refund,
                    taxes_commission }),
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
        this.getInvoiceAcitivity = (req) => __awaiter(this, void 0, void 0, function* () {
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
        this.addAirTicketTax = (req) => __awaiter(this, void 0, void 0, function* () {
            const { refund_invoice_id, comb_client, ticket_info, client_refund_type, vendor_refund_type, client_pay_type, vendor_pay_type, client_account_id, vendor_account_id, client_total_tax_refund, vendor_total_tax_refund, refund_date, } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.invoiceAirticketModel(req, trx);
                const trxns = new Trxns_1.default(req, trx);
                const { client_id, combined_id } = (0, common_helper_1.separateCombClientToId)(comb_client);
                let refund_c_trxn_id = null;
                let client_account_trxn_id = null;
                let vendor_account_trxn_id = null;
                const clAccPayType = (0, lib_1.getPaymentType)(client_pay_type);
                const VAccPayType = (0, lib_1.getPaymentType)(vendor_pay_type);
                // CLIENT TRANSACTION
                if (client_refund_type === 'Adjust') {
                    const clTrxnBody = {
                        ctrxn_type: 'CREDIT',
                        ctrxn_amount: client_total_tax_refund,
                        ctrxn_cl: comb_client,
                        ctrxn_particular_id: 108,
                        ctrxn_created_at: refund_date,
                        ctrxn_note: '',
                        ctrxn_particular_type: 'AIR TICKET TAX REFUND',
                        ctrxn_user_id: req.user_id,
                        ctrxn_pay_type: clAccPayType,
                    };
                    refund_c_trxn_id = yield trxns.clTrxnInsert(clTrxnBody);
                }
                else {
                    const ACTrxnBody = {
                        acctrxn_ac_id: client_account_id,
                        acctrxn_type: 'DEBIT',
                        acctrxn_amount: client_total_tax_refund,
                        acctrxn_created_at: refund_date,
                        acctrxn_created_by: req.user_id,
                        acctrxn_note: 'Client Refund',
                        acctrxn_particular_id: 108,
                        acctrxn_particular_type: 'AIR TICKET TAX REFUND',
                        acctrxn_pay_type: clAccPayType,
                    };
                    client_account_trxn_id = yield trxns.AccTrxnInsert(ACTrxnBody);
                    const clTrxnBody = {
                        ctrxn_type: 'CREDIT',
                        ctrxn_amount: 0,
                        ctrxn_cl: comb_client,
                        ctrxn_particular_id: 108,
                        ctrxn_created_at: refund_date,
                        ctrxn_note: `Money return : ${client_total_tax_refund}/-`,
                        ctrxn_particular_type: 'AIR TICKET TAX REFUND',
                        ctrxn_user_id: req.user_id,
                        ctrxn_pay_type: clAccPayType,
                    };
                    refund_c_trxn_id = yield trxns.clTrxnInsert(clTrxnBody);
                }
                // ACCOUNT TRANSACTION FOR VENDOR
                if (vendor_refund_type === 'Return') {
                    const ACTrxnBody = {
                        acctrxn_ac_id: vendor_account_id,
                        acctrxn_type: 'CREDIT',
                        acctrxn_amount: vendor_total_tax_refund,
                        acctrxn_created_at: refund_date,
                        acctrxn_created_by: req.user_id,
                        acctrxn_note: 'Vendor Refund',
                        acctrxn_particular_id: 108,
                        acctrxn_particular_type: 'AIR TICKET TAX REFUND',
                        acctrxn_pay_type: VAccPayType,
                    };
                    vendor_account_trxn_id = yield trxns.AccTrxnInsert(ACTrxnBody);
                }
                const refundData = {
                    refund_invoice_id,
                    refund_agency_id: req.agency_id,
                    refund_client_id: client_id,
                    refund_combined_id: combined_id,
                    refund_c_trxn_id,
                    client_refund_type,
                    vendor_refund_type,
                    client_pay_type,
                    vendor_pay_type,
                    client_account_id,
                    vendor_account_id,
                    client_account_trxn_id,
                    vendor_account_trxn_id,
                    client_total_tax_refund,
                    vendor_total_tax_refund,
                };
                const refund_id = yield conn.insertAirTicketTaxRefund(refundData);
                // VENDOR TRANSACTION
                for (const item of ticket_info) {
                    const { vendor_id, combined_id } = (0, common_helper_1.separateCombClientToId)(item.comb_vendor);
                    const VTrxnBody = {
                        comb_vendor: item.comb_vendor,
                        vtrxn_amount: vendor_refund_type === 'Adjust' ? item.refund_tax_amount : 0,
                        vtrxn_created_at: refund_date,
                        vtrxn_note: vendor_refund_type === 'Adjust'
                            ? ''
                            : `Money return : ${item.refund_tax_amount}/-`,
                        vtrxn_particular_id: 108,
                        vtrxn_particular_type: 'AIR TICKET TAX REFUND',
                        vtrxn_type: 'CREDIT',
                        vtrxn_user_id: req.user_id,
                    };
                    const refund_v_trxn_id = yield trxns.VTrxnInsert(VTrxnBody);
                    const refundItemData = {
                        refund_airticket_id: item.airticket_id,
                        refund_combined_id: combined_id,
                        refund_id,
                        refund_tax_amount: item.refund_tax_amount,
                        refund_vendor_id: vendor_id,
                        refund_v_trxn_id,
                    };
                    yield conn.insertAirTicketTaxRefundItem(refundItemData);
                    // update air ticket refund
                    yield conn.updateAirTicketItemRefund(item.airticket_id);
                }
                // UPDATE INVOICE REFUND
                yield conn.updateInvoiceRefund(refund_invoice_id);
                return { success: true, msg: 'Invoice air ticket tax refunded!' };
            }));
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
        // ============= narrow services ==============
        this.addInvoiceAirticket = new addInvoiceAirticket_1.default().addInvoiceAirTicket;
        this.editInvoiceAirticket = new editInvoiceAirticket_1.default().editInvoiceAirTicket;
        this.deleteInvoiceAirTicket = new deleteAirTicket_1.default().deleteAirTicket;
        this.voidInvoiceAirticket = new deleteAirTicket_1.default().voidAirticket;
        this.sendEmail = new sendMail_services_1.default().sendEmail;
    }
}
exports.default = InvoiceAirticketService;
//# sourceMappingURL=invoiceAirticket.services.js.map