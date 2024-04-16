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
const abstract_services_1 = __importDefault(require("../../../abstracts/abstract.services"));
const common_helper_1 = require("../../../common/helpers/common.helper");
const addAirticketRefund_1 = __importDefault(require("./narrowServices/airticketRefundSubServices/addAirticketRefund"));
const deleteAirticketRefund_services_1 = __importDefault(require("./narrowServices/airticketRefundSubServices/deleteAirticketRefund.services"));
const addOtherRefund_1 = __importDefault(require("./narrowServices/otherRefundSubServices/addOtherRefund"));
const deleteOtherRefund_1 = __importDefault(require("./narrowServices/otherRefundSubServices/deleteOtherRefund"));
const addPersialRefund_services_1 = __importDefault(require("./narrowServices/persialRefundSubServices/addPersialRefund.services"));
const deletePersialRefund_services_1 = __importDefault(require("./narrowServices/persialRefundSubServices/deletePersialRefund.services"));
const addTourPackRefund_1 = __importDefault(require("./narrowServices/tourPackRefundSubServices/addTourPackRefund"));
const deleteTourPackRefund_1 = __importDefault(require("./narrowServices/tourPackRefundSubServices/deleteTourPackRefund"));
class RefundServices extends abstract_services_1.default {
    constructor() {
        super();
        this.getTicketNo = (req) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const conn = this.models.refundModel(req);
            const data = yield conn.getAllTicketNoClient(id);
            return { success: true, data };
        });
        this.airTicketInfos = (req) => __awaiter(this, void 0, void 0, function* () {
            const { ticket_no, invoice_id } = req.body;
            const conn = this.models.refundModel(req);
            const data = yield conn.airTicketInfos(ticket_no, invoice_id);
            return { success: true, data };
        });
        this.getAllAirTicketRefund = (req) => __awaiter(this, void 0, void 0, function* () {
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.refundModel(req, trx);
                const { page, size, search, from_date, to_date } = req.query;
                const data = yield conn.getAllAirticketRefund(Number(page) || 1, Number(size) || 20, search, from_date, to_date);
                const count = yield conn.countAitRefDataRow(search, from_date, to_date);
                return {
                    success: true,
                    message: 'All air ticket refund',
                    count: count.row_count,
                    data,
                };
            }));
        });
        // need to change
        this.getRefundDescription = (req) => __awaiter(this, void 0, void 0, function* () {
            const { refund_id } = req.params;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.refundModel(req, trx);
                const data = yield conn.getAirticketVendorRefund(refund_id);
                return { success: true, data };
            }));
        });
        // need to change
        this.singleATRefund = (req) => __awaiter(this, void 0, void 0, function* () {
            const { refund_id } = req.params;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.refundModel(req, trx);
                const items = yield conn.getAirticketRefundById(refund_id);
                const refund_info = yield conn.viewAirticketVendorRefund(refund_id);
                return { success: true, data: Object.assign(Object.assign({}, items), { refund_info }) };
            }));
        });
        this.invoiceOtherByClient = (req) => __awaiter(this, void 0, void 0, function* () {
            const { client_id } = req.params;
            const { client_id: clientId, combined_id } = (0, common_helper_1.separateCombClientToId)(client_id);
            const conn = this.models.refundModel(req);
            const data = yield conn.getInvoiceOtherByClient(clientId, combined_id);
            return { success: true, data };
        });
        this.getBillingInfo = (req) => __awaiter(this, void 0, void 0, function* () {
            const { invoice_id } = req.params;
            const conn = this.models.refundModel(req);
            const category_id = yield conn.getCategoryId(invoice_id);
            const data = yield conn.getBillingInfo(invoice_id, category_id);
            return {
                success: true,
                data: { billing_info: data, invoice_category_id: category_id },
            };
        });
        this.getRefundInfoVendor = (req) => __awaiter(this, void 0, void 0, function* () {
            const { vendor_id } = req.params;
            const conn = this.models.refundModel(req);
            const data = yield conn.getVendorInfo(vendor_id);
            return { success: true, data };
        });
        this.getAllRefunds = (req) => __awaiter(this, void 0, void 0, function* () {
            return this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { trash, page, size, search, from_date, to_date } = req.query;
                const data = [];
                const conn = this.models.refundModel(req, trx);
                const items = yield conn.getAllOtherRefund(Number(page) || 1, Number(size) || 20, search, from_date, to_date);
                for (const item of items) {
                    const vendor_info = yield conn.getAllOtherRefundVendor(item.refund_id);
                    data.push(Object.assign(Object.assign({}, item), { vendor_info }));
                }
                const count = yield conn.countOtrRefDataRow(search, from_date, to_date);
                return {
                    success: true,
                    message: 'All Other Refunds',
                    count: count.row_count,
                    data,
                };
            }));
        });
        this.singleOtherRefund = (req) => __awaiter(this, void 0, void 0, function* () {
            const { refund_id } = req.params;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.refundModel(req, trx);
                const client_refund_info = yield conn.getRefundOtherClient(refund_id);
                const vendor_refund_info = yield conn.getRefundOtherVendor(refund_id);
                return {
                    success: true,
                    data: { client_refund_info, vendor_refund_info },
                };
            }));
        });
        this.invoiceOtherByVendor = (req) => __awaiter(this, void 0, void 0, function* () {
            const { vendor_id } = req.params;
            const conn = this.models.refundModel(req);
            const data = yield conn.getInvoiceOtherByVendor(vendor_id);
            return { success: true, data };
        });
        this.getTourInvoice = (req) => __awaiter(this, void 0, void 0, function* () {
            const comb_client = req.params.client;
            const conn = this.models.refundModel(req);
            const { client_id, combined_id } = (0, common_helper_1.separateCombClientToId)(comb_client);
            const data = yield conn.getTourInvoice(client_id, combined_id);
            return { success: true, data };
        });
        this.getAllTourPackRefund = (req) => __awaiter(this, void 0, void 0, function* () {
            const { trash, page, size, search, from_date, to_date } = req.query;
            const conn = this.models.refundModel(req);
            const data = yield conn.getAllTourPackRefund(Number(trash) || 0, Number(page) || 1, Number(size) || 20, search, from_date, to_date);
            const count = yield conn.countTurRefDataRow(Number(trash) || 0, search, from_date, to_date);
            return {
                success: true,
                message: 'All Tour Refunds',
                count: count.row_count,
                data,
            };
        });
        this.viewTourForEdit = (req) => __awaiter(this, void 0, void 0, function* () {
            const { refund_id } = req.params;
            let data = [];
            const conn = this.models.refundModel(req);
            const items = yield conn.viewTourForEdit(refund_id);
            for (const item of items) {
                const vendor_info = yield conn.getAllTourRefundVendor(item.refund_id);
                data.push(Object.assign(Object.assign({}, item), { vendor_info }));
            }
            return {
                success: true,
                data,
            };
        });
        this.getPersialRefundTickets = (req) => __awaiter(this, void 0, void 0, function* () {
            const { comb_client } = req.params;
            const { client_id, combined_id } = (0, common_helper_1.separateCombClientToId)(comb_client);
            const conn = this.models.refundModel(req);
            const data = yield conn.getPersialRefundTickets(client_id, combined_id);
            return { success: true, data };
        });
        this.getPersialRefundTicketsByInvoice = (req) => __awaiter(this, void 0, void 0, function* () {
            const { invoice_id } = req.params;
            const conn = this.models.refundModel(req);
            const data = yield conn.getPersialRefundTicketsByInvoice(invoice_id);
            return { success: true, data };
        });
        this.getPersialRefund = (req) => __awaiter(this, void 0, void 0, function* () {
            const { page, size, search, from_date, to_date } = req.query;
            const conn = this.models.refundModel(req);
            const data = yield conn.getPersialRefund(Number(page || 1), Number(size || 20), search, from_date, to_date);
            return Object.assign({ success: true }, data);
        });
        this.getSinglePersialRefund = (req) => __awaiter(this, void 0, void 0, function* () {
            const { refund_id } = req.params;
            const conn = this.models.refundModel(req);
            const data = yield conn.getSinglePersialRefund(refund_id);
            return { success: true, data };
        });
        this.getPertialAirticketInfo = (req) => __awaiter(this, void 0, void 0, function* () {
            const { airticket_id, invoice_id } = req.body;
            const conn = this.models.refundModel(req);
            const data = yield conn.getPertialAirticketInfo(airticket_id, invoice_id);
            return { success: true, data };
        });
        this.addAirTicketRefund = new addAirticketRefund_1.default().addAirTicketRefund;
        this.deleteAirticketRefund = new deleteAirticketRefund_services_1.default().delete;
        this.addOtherRefund = new addOtherRefund_1.default().add;
        this.deleteOtherRefund = new deleteOtherRefund_1.default().deleteOtherRefund;
        this.addTourPackRefund = new addTourPackRefund_1.default().add;
        this.delteTourPackRefund = new deleteTourPackRefund_1.default().delete;
        this.addPersialRefund = new addPersialRefund_services_1.default().add;
        this.deletePersialRefund = new deletePersialRefund_services_1.default().delete;
    }
}
exports.default = RefundServices;
//# sourceMappingURL=refund.services.js.map