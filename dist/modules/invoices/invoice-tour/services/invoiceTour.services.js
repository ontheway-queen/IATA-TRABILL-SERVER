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
const AddCostingInvoiceTour_1 = __importDefault(require("./narrowServices/AddCostingInvoiceTour"));
const AddInvoiceTour_1 = __importDefault(require("./narrowServices/AddInvoiceTour"));
const DeleteRestoreInvoiceTour_1 = __importDefault(require("./narrowServices/DeleteRestoreInvoiceTour"));
const EditInvoiceTour_1 = __importDefault(require("./narrowServices/EditInvoiceTour"));
class invoiceTourServices extends abstract_services_1.default {
    constructor() {
        super();
        // GET ALL
        this.getAllTourInvoices = (req) => __awaiter(this, void 0, void 0, function* () {
            const { page, size, search, from_date, to_date } = req.query;
            const conn = this.models.CommonInvoiceModel(req);
            const data = yield conn.getAllInvoices(4, Number(page) || 1, Number(size) || 20, search, from_date, to_date);
            return Object.assign({ success: true, message: 'All Invoices Tour Package' }, data);
        });
        this.getTourBillingInfo = (req) => __awaiter(this, void 0, void 0, function* () {
            const invoiceId = req.params.invoice_id;
            const conn = this.models.invoiceTourModels(req);
            const tourBilling = yield conn.getTourBilling(invoiceId);
            const tourFoods = yield conn.getTourFoods(invoiceId);
            const tourTransports = yield conn.getTourTransport(invoiceId);
            const tourAccms = yield conn.getTourAccm(invoiceId);
            const tourOtherTrans = yield conn.getTourOtherTrans(invoiceId);
            const tourGuide = yield conn.getTourGuide(invoiceId);
            const tourTicket = yield conn.getTourTicketInfo(invoiceId);
            const { invoice_combclient_id } = yield conn.getClientId(invoiceId);
            return {
                success: true,
                data: {
                    invoice_combclient_id,
                    tourBilling,
                    tourTransports: !tourTransports.length,
                    tourFoods: !tourFoods.length,
                    tourAccms: !tourAccms.length,
                    tourOtherTrans: !tourOtherTrans.length,
                    tourGuide: tourGuide ? !Object.keys(tourGuide).length : true,
                    tourTicket: tourTicket ? !Object.keys(tourTicket).length : true,
                },
            };
        });
        // GET FOR EDIT
        this.getForEdit = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.invoiceTourModels(req);
            const common_conn = this.models.CommonInvoiceModel(req);
            const invoiceId = req.params.invoice_id;
            const invoices = yield common_conn.getForEditInvoice(invoiceId);
            const invoiceTourExtraInfo = yield conn.getTourExtraInfo(invoiceId);
            const tourBilling = yield conn.getTourBilling(invoiceId);
            const tourFoods = yield conn.getTourFoods(invoiceId);
            const tourTransports = yield conn.getTourTransport(invoiceId);
            const tourAccms = yield conn.getTourAccm(invoiceId);
            const tourOtherTrans = yield conn.getTourOtherTrans(invoiceId);
            const tourGuide = yield conn.getTourGuide(invoiceId);
            const tourTicket = yield conn.getTourTicketInfo(invoiceId);
            return {
                success: true,
                data: Object.assign(Object.assign(Object.assign({}, invoices), invoiceTourExtraInfo), { tourBilling, tourFoods: tourFoods.length ? tourFoods : [{}], tourTransports: tourTransports.length ? tourTransports : [{}], tourAccms: tourAccms.length ? tourAccms : [{}], tourOtherTrans: tourOtherTrans.length ? tourOtherTrans : [{}], tourGuide,
                    tourTicket }),
            };
        });
        // VIEW INVOICE TOUR PACKAGE
        this.viewITourPackage = (req) => __awaiter(this, void 0, void 0, function* () {
            const common_conn = this.models.CommonInvoiceModel(req);
            const conn = this.models.invoiceTourModels(req);
            const invoiceId = req.params.invoice_id;
            const invoices = yield common_conn.getViewInvoiceInfo(invoiceId);
            const prepared_by = yield common_conn.getInvoicePreparedBy(invoiceId);
            const authorized_by = yield common_conn.getAuthorizedBySignature();
            const clientlBalance = yield conn.getInvoiceClientlBalance(invoiceId);
            const invoiceTourData = yield conn.viewTourInvoiceData(invoiceId);
            const refund = yield conn.getTourRefunds(invoiceId);
            return {
                success: true,
                data: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, invoices), { authorized_by,
                    prepared_by }), clientlBalance), invoiceTourData), { refund }),
            };
        });
        // ============= narrow services ==============
        this.addCostingTourPackage = new AddCostingInvoiceTour_1.default()
            .addCostingInvoiceTour;
        this.addInvoiceTour = new AddInvoiceTour_1.default().addInvoiceTour;
        this.editInvoiceTour = new EditInvoiceTour_1.default().editInvoiceTour;
        this.deleteResetInvoiceTour = new DeleteRestoreInvoiceTour_1.default()
            .deleteResetInvoiceTour;
        this.voidInvoiceTour = new DeleteRestoreInvoiceTour_1.default().voidInvoiceTour;
    }
}
exports.default = invoiceTourServices;
//# sourceMappingURL=invoiceTour.services.js.map