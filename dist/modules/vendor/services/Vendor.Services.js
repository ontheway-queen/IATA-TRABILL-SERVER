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
const Trxns_1 = __importDefault(require("../../../common/helpers/Trxns"));
const common_helper_1 = require("../../../common/helpers/common.helper");
const customError_1 = __importDefault(require("../../../common/utils/errors/customError"));
const addAdvanceReturn_1 = __importDefault(require("./narrowedServices/addAdvanceReturn"));
const addVendor_1 = __importDefault(require("./narrowedServices/addVendor"));
const addVendorPayment_1 = __importDefault(require("./narrowedServices/addVendorPayment"));
const editAdvanceReturn_1 = __importDefault(require("./narrowedServices/editAdvanceReturn"));
const editVendor_1 = __importDefault(require("./narrowedServices/editVendor"));
const editVendorPayment_1 = __importDefault(require("./narrowedServices/editVendorPayment"));
class ServicesVendor extends abstract_services_1.default {
    constructor() {
        super();
        // INVOICE INFO BY VENDOR
        this.getInvoiceVendors = (req) => __awaiter(this, void 0, void 0, function* () {
            const { invoice_id } = req.params;
            const conn = this.models.vendorModel(req);
            const data = yield conn.getInvoiceVendors(invoice_id);
            return { success: true, data };
        });
        // GET VENDOR PAYMENT FOR EDIT
        this.getVendorPayForEditById = (req) => __awaiter(this, void 0, void 0, function* () {
            const id = Number(req.params.id);
            const conn = this.models.vendorModel(req);
            const vendor_payment = yield conn.getVendorPayForEditById(id);
            const specific_inv_vendors = yield conn.getInvoiceVendorInfo(id);
            const data = Object.assign(Object.assign({}, vendor_payment), { specific_inv_vendors });
            return { success: true, data };
        });
        // all vendor excel report
        this.getVendorExcelReport = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.vendorModel(req);
            const vendor = yield conn.getVendorExcelReport();
            const data = vendor.map((item, index) => {
                const status = item.status === 1 ? 'Active' : 'Inactive';
                return Object.assign(Object.assign({ SL: index + 1 }, item), { status: status });
            });
            return { success: true, data };
        });
        this.getVendorInvoiceDue = (req) => __awaiter(this, void 0, void 0, function* () {
            const invoice_id = req.params.invoice_id;
            const conn = this.models.vendorModel(req);
            const vendor_due = yield conn.getVendorInvoiceDue(invoice_id);
            const billing_info = yield conn.getInvoiceBilling(invoice_id);
            return { success: true, data: { vendor_due, billing_info } };
        });
        this.vendorLastBalance = (req) => __awaiter(this, void 0, void 0, function* () {
            const comb_vendor = req.params.vendor;
            const { combined_id, vendor_id } = (0, common_helper_1.separateCombClientToId)(comb_vendor);
            if (vendor_id) {
                const data = yield this.models
                    .vendorModel(req)
                    .getVendorLastBalance(vendor_id);
                return { success: true, data };
            }
            else {
                const data = yield this.models
                    .combineClientModel(req)
                    .getCombinedLastBalance(combined_id);
                return { success: true, data: data.client_last_balance };
            }
        });
        this.getAllVendorsAndCombined = (req) => __awaiter(this, void 0, void 0, function* () {
            const { search } = req.query;
            const conn = this.models.vendorModel(req);
            const data = yield conn.getAllVendorsAndCombined(search);
            return { success: true, data };
        });
        this.getAllVendors = (req) => __awaiter(this, void 0, void 0, function* () {
            const { size, page, search } = req.query;
            const conn = this.models.vendorModel(req);
            const data = yield conn.getAllVendors(Number(page) || 1, Number(size) || 20, search);
            return Object.assign({ success: true }, data);
        });
        this.getVendorById = (req) => __awaiter(this, void 0, void 0, function* () {
            const id = Number(req.params.id);
            const conn = this.models.vendorModel(req);
            const vendor = yield conn.getVendorById(id);
            const vendor_commission_rate = yield conn.getVendorCommission(id);
            const vendor_products = yield conn.getVendorProductName(id);
            const data = Object.assign(Object.assign(Object.assign({}, vendor), { vendor_products }), vendor_commission_rate);
            if (vendor) {
                return { success: true, data };
            }
            else {
                throw new customError_1.default('Please provide a valid id', 400, 'Invalid Id');
            }
        });
        this.getForEdit = (req) => __awaiter(this, void 0, void 0, function* () {
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.vendorModel(req, trx);
                const id = req.params.id;
                const vendor = yield conn.getForEdit(id);
                const vendor_products = yield conn.getVendorProduct(id);
                const vendor_commission_rate = yield conn.getVendorCommission(id);
                const data = Object.assign(Object.assign(Object.assign({}, vendor), { vendor_products }), vendor_commission_rate);
                return {
                    success: true,
                    data,
                };
            }));
        });
        this.updateVendorStatusById = (req) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const { vendor_activity_status, updated_by } = req.body;
            const conn = this.models.vendorModel(req);
            const data = yield conn.updateVendorStatus(vendor_activity_status, id);
            const message = `Vendor status has been updated`;
            yield this.insertAudit(req, 'update', message, updated_by, 'VENDOR');
            return { success: true, data };
        });
        this.deleteVendor = (req) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            if (!id) {
                throw new customError_1.default('Please provide vendor id', 400, 'Empty vendor id');
            }
            const { vendor_deleted_by } = req.body;
            const conn = this.models.vendorModel(req);
            const vendorTrxn = yield conn.getTraxn(id);
            if (vendorTrxn === 0) {
                yield conn.deleteVendor(id, vendor_deleted_by);
            }
            else {
                throw new customError_1.default('Account has a valid transaction', 400, 'Bad Request');
            }
            const message = `Vendor status has been deleted`;
            yield this.insertAudit(req, 'delete', message, vendor_deleted_by, 'VENDOR');
            return { success: true, message };
        });
        //   ==================== advance returns ============================
        this.getAdvanceReturn = (req) => __awaiter(this, void 0, void 0, function* () {
            const { page, size } = req.query;
            const conn = this.models.vendorModel(req);
            const data = yield conn.getAdvanceReturn(Number(page) || 1, Number(size) || 20);
            return Object.assign({ success: true }, data);
        });
        this.deleteAdvanceReturn = (req) => __awaiter(this, void 0, void 0, function* () {
            const id = Number(req.params.id);
            const { deleted_by } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.vendorModel(req, trx);
                yield conn.deleteAdvanceReturn(id, deleted_by);
                yield conn.deleteAdvrCheque(id, deleted_by);
                const { prevCombVendor, prevVendorTrxnId, prevPayType, prevAccTrxnId, prev_return_amount, prev_transaction_charge_id, } = yield conn.getAdvancePrevAccId(id);
                if (prevPayType !== 4) {
                    // ACCOUNT TRANSACTION
                    yield new Trxns_1.default(req, trx).deleteAccTrxn(prevAccTrxnId);
                    // VENDOR TRANSACTION
                    yield new Trxns_1.default(req, trx).deleteVTrxn(prevVendorTrxnId, prevCombVendor);
                }
                if (prev_transaction_charge_id) {
                    yield conn.deleteOnlineTrxnCharge(prev_transaction_charge_id);
                }
                // insert audit
                const message = `Vendor advance return has been deleted ${prev_return_amount}/-`;
                yield this.insertAudit(req, 'delete', message, deleted_by, 'VENDOR_ADVANCE_RETURN');
                return {
                    success: true,
                    message,
                };
            }));
        });
        this.getVendorPayments = (req) => __awaiter(this, void 0, void 0, function* () {
            const { page, size, search, from_date, to_date } = req.query;
            const conn = this.models.vendorModel(req);
            const vendorsPayment = yield conn.getVendorPayments(Number(page) || 1, Number(size) || 20, search, from_date, to_date);
            let data = [];
            for (const item of vendorsPayment) {
                const getInvoiceVendors = yield conn.getVendorInvoicePayment(item.vpay_id);
                const invoice_vendors = Object.assign({ getInvoiceVendors }, item);
                data.push(invoice_vendors);
            }
            const count = yield conn.countVPaymentsDataRow(search, from_date, to_date);
            return { success: true, count, data };
        });
        this.getAllVendorsAndCombinedByProductId = (req) => __awaiter(this, void 0, void 0, function* () {
            const product_id = req.params.product_id;
            const conn = this.models.vendorModel(req);
            const data = yield conn.getAllVendorsAndCombinedByProductId(product_id);
            return { success: true, data };
        });
        this.getCountryCode = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.vendorModel(req);
            const data = yield conn.getCountryCode();
            return { success: true, data };
        });
        this.getPrevPayBalance = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.vendorModel(req);
            const data = yield conn.getPreviousPaymentAmount(Number(req.params.id));
            return { success: true, data };
        });
        // DELETE VENDOR PAYMENT
        this.deleteVendorPayment = (req) => __awaiter(this, void 0, void 0, function* () {
            const vpay_id = Number(req.params.id);
            const { updated_by } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.vendorModel(req, trx);
                const trxns = new Trxns_1.default(req, trx);
                const { invoice_vendor_pay, vendor_pay_data } = yield conn.getPreviousPaymentAmount(vpay_id);
                const { prevAccTrxnId, prevPayMethod, previousPaymentAmount, prevCombVendor, prevVendorTrxn, vpay_payment_to, has_refer_passport, online_charge_id, } = vendor_pay_data;
                if (has_refer_passport === 'YES') {
                    yield conn.deleteVendorPaymentPassport(vpay_id, updated_by);
                }
                if (prevPayMethod === 4) {
                    yield conn.deleteVendorPaymentCheque(vpay_id, updated_by);
                }
                yield conn.deleteInvoiceVendorPaymentPermanent(vpay_id, updated_by);
                yield conn.deleteVendorPayment(vpay_id, updated_by);
                if (online_charge_id) {
                    yield conn.deleteOnlineTrxnCharge(online_charge_id);
                }
                if (prevAccTrxnId) {
                    yield trxns.deleteAccTrxn(prevAccTrxnId);
                }
                if (prevVendorTrxn) {
                    yield trxns.deleteVTrxn(prevVendorTrxn, prevCombVendor);
                }
                if (prevPayMethod !== 4) {
                    if (vpay_payment_to === 'INVOICE') {
                        for (const item of invoice_vendor_pay) {
                            const { prevInvCombVendor, prevInvTrxnId } = item;
                            yield trxns.deleteVTrxn(prevInvTrxnId, prevInvCombVendor);
                        }
                    }
                }
                const message = `Vendor payment deleted ${previousPaymentAmount}/-`;
                yield this.insertAudit(req, 'delete', message, updated_by, 'VENDOR_PAYMENT');
                return { success: true, message };
            }));
        });
        this.getPaymentMethod = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.vendorModel(req);
            const data = yield conn.getPaymentMethod();
            return { success: true, data };
        });
        this.getNonPaidVendorInvoice = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.vendorModel(req);
            const data = yield conn.getNonPaidVendorInvoice();
            return {
                success: true,
                data,
            };
        });
        this.getNonPaidVendorInvoiceForEdit = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.vendorModel(req);
            const data = yield conn.getNonPaidVendorInvoiceForEdit();
            return {
                success: true,
                data,
            };
        });
        this.viewVendorPayment = (req) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const conn = this.models.vendorModel(req);
            const data = yield conn.viewVendorPayment(id);
            return { success: true, data };
        });
        this.viewVendorPaymentDetails = (req) => __awaiter(this, void 0, void 0, function* () {
            const id = Number(req.params.id);
            const conn = this.models.vendorModel(req);
            const data = yield conn.viewVendorPaymentDetails(id);
            return { success: true, data };
        });
        this.getAdvanceReturnForEdit = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.vendorModel(req);
            const id = Number(req.params.id);
            const data = yield conn.getAdvanceReturnForEdit(id);
            return { success: true, data };
        });
        this.getAdvanceReturnDetails = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.vendorModel(req);
            const id = Number(req.params.id);
            const data = yield conn.getAdvanceReturnDetails(id);
            return { success: true, data };
        });
        this.getVendorPaymentCheque = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.vendorModel(req);
            const data = yield conn.getVendorPaymentCheque();
            return { success: true, data };
        });
        // ================== @GET_ALL_VENDOR_ADVR_CHEQUE_STATUS
        this.getVendorAdvrCheque = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.vendorModel(req);
            const data = yield conn.getVendorAdvrCheque(req.query.status);
            return { success: true, data };
        });
        // ================== @GET_ALL_VENDOR_PAY_CHEQUE_STATUS
        this.allVendorPaymentChecque = (req) => __awaiter(this, void 0, void 0, function* () {
            const { status } = req.query;
            const conn = this.models.vendorModel(req);
            const data = yield conn.allVendorPaymentChecque(status);
            return { success: true, data };
        });
        // ===================== @UPDATE_VENDOR_PAY_CHEQUE_STATUS
        this.getInvoiceByVendorId = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.vendorModel(req);
            const comb_vendor = req.params.comb_vendor;
            if (!comb_vendor) {
                throw new customError_1.default('Please provide vendor as params', 400, 'Empty vendor');
            }
            const { vendor_id, combined_id } = (0, common_helper_1.separateCombClientToId)(comb_vendor);
            const data = yield conn.getInvoiceByVendorId(vendor_id, combined_id);
            return { success: true, data };
        });
        this.viewAllVendors = (req) => __awaiter(this, void 0, void 0, function* () {
            const { search } = req.query;
            const conn = this.models.vendorModel(req);
            const data = yield conn.viewAllVendors(search);
            return { success: true, data };
        });
        this.addVendor = new addVendor_1.default().addVendor;
        this.editVendor = new editVendor_1.default().editVendor;
        this.addVendorPayment = new addVendorPayment_1.default().addVendorPayment;
        this.editVendorPayment = new editVendorPayment_1.default().editVendorPayment;
        this.addAdvanceReturn = new addAdvanceReturn_1.default().addAdvanceReturn;
        this.editAdvanceReturn = new editAdvanceReturn_1.default().editAdvanceReturn;
    }
}
exports.default = ServicesVendor;
//# sourceMappingURL=Vendor.Services.js.map