"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const invoice_helpers_1 = __importStar(require("../../../common/helpers/invoice.helpers"));
const CommonAddMoneyReceipt_1 = __importDefault(require("../../../common/services/CommonAddMoneyReceipt"));
const customError_1 = __importDefault(require("../../../common/utils/errors/customError"));
const quotationHelper_1 = __importDefault(require("../utils/quotationHelper"));
class QuotationServices extends abstract_services_1.default {
    constructor() {
        super();
        /**
         * Select product category
         */
        this.products = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.quotationModel(req);
            const products = yield conn.products();
            return { success: true, data: products };
        });
        /**
         * Create quotation
         */
        this.addQuotation = (req) => __awaiter(this, void 0, void 0, function* () {
            const { client_id, q_number, date, bill_info, note, sub_total, discount, net_total, created_by, } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.quotationModel(req, trx);
                const { invoice_client_id, invoice_combined_id } = (0, invoice_helpers_1.getClientOrCombId)(client_id);
                const quotationInfo = {
                    quotation_client_id: invoice_client_id,
                    quotation_combined_id: invoice_combined_id,
                    quotation_no: q_number,
                    quotation_date: date,
                    quotation_note: note,
                    quotation_discount_total: discount,
                    quotation_net_total: net_total,
                    quotation_created_by: created_by,
                };
                const quotationId = yield conn.insertQuotation(quotationInfo);
                const billInfo = quotationHelper_1.default.parseBillInfo(bill_info, sub_total, quotationId);
                yield conn.insertBillInfo(billInfo);
                const message = `ADDED QUOTATION, VOUCHER ${q_number}`;
                yield this.insertAudit(req, 'create', message, created_by, 'QUOTATION');
                return {
                    success: true,
                    message: 'Quotation created successfully',
                    data: { quotationId },
                };
            }));
        });
        this.allQuotations = (req) => __awaiter(this, void 0, void 0, function* () {
            const { page, size, search, from_date, to_date } = req.query;
            const conn = this.models.quotationModel(req);
            const data = yield conn.viewQuotations(Number(page) || 1, Number(size) || 20, search, from_date, to_date);
            return Object.assign({ success: true }, data);
        });
        this.singleQuotation = (req) => __awaiter(this, void 0, void 0, function* () {
            const { quotation_id } = req.params;
            const conn = this.models.quotationModel(req);
            const data = yield conn.viewQuotation(+quotation_id);
            return { success: true, data };
        });
        this.confirmationQuotation = (req) => __awaiter(this, void 0, void 0, function* () {
            const { invoice_net_total, invoice_combclient_id, invoice_created_by, invoice_note, invoice_sales_date, invoice_due_date, invoice_sales_man_id, invoice_sub_total, invoice_vat, invoice_service_charge, invoice_discount, invoice_agent_id, invoice_agent_com_amount, money_receipt, billing_information, invoice_reference, } = req.body;
            const { invoice_total_profit, invoice_total_vendor_price } = yield (0, invoice_helpers_1.InvoiceClientAndVendorValidate)(billing_information, invoice_combclient_id);
            (0, invoice_helpers_1.MoneyReceiptAmountIsValid)(money_receipt, invoice_net_total);
            const { invoice_client_id, invoice_combined_id } = yield (0, invoice_helpers_1.getClientOrCombId)(invoice_combclient_id);
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.invoiceOtherModel(req, trx);
                const common_conn = this.models.CommonInvoiceModel(req, trx);
                const qu_conn = this.models.quotationModel(req, trx);
                const trxns = new Trxns_1.default(req, trx);
                const quotationId = req.params.quotation_id;
                const invoice_no = yield this.generateVoucher(req, 'QT');
                const clTrxnBody = {
                    ctrxn_type: 'DEBIT',
                    ctrxn_amount: invoice_net_total,
                    ctrxn_cl: invoice_combclient_id,
                    ctrxn_voucher: invoice_no,
                    ctrxn_particular_id: 145,
                    ctrxn_created_at: invoice_sales_date,
                    ctrxn_note: invoice_note,
                    ctrxn_particular_type: 'Confirm Quotation Invoice',
                };
                const invoice_cltrxn_id = yield trxns.clTrxnInsert(clTrxnBody);
                const invoieInfo = {
                    invoice_client_id,
                    invoice_combined_id,
                    invoice_created_by,
                    invoice_net_total,
                    invoice_no: invoice_no,
                    invoice_note,
                    invoice_category_id: 5,
                    invoice_sales_date,
                    invoice_due_date,
                    invoice_sales_man_id,
                    invoice_sub_total,
                    invoice_cltrxn_id,
                    invoice_total_profit,
                    invoice_total_vendor_price,
                    invoice_reference,
                };
                const invoice_id = yield common_conn.insertInvoicesInfo(invoieInfo);
                // AGENT TRANSACTION
                yield invoice_helpers_1.default.invoiceAgentTransactions(this.models.agentProfileModel(req, trx), req.agency_id, invoice_agent_id, invoice_id, invoice_no, invoice_created_by, invoice_agent_com_amount, 'CREATE', 145, 'QUOTATION');
                const invoiceExtraAmount = {
                    extra_amount_invoice_id: invoice_id,
                    invoice_vat,
                    invoice_service_charge,
                    invoice_discount,
                    invoice_agent_id,
                    invoice_agent_com_amount,
                };
                yield common_conn.insertInvoiceExtraAmount(invoiceExtraAmount);
                for (const billingInfo of billing_information) {
                    const { billing_comvendor, billing_cost_price, billing_quantity, billing_product_id, billing_profit, billing_unit_price, pax_name, billing_description, } = billingInfo;
                    const billing_subtotal = billing_unit_price * billing_quantity;
                    const total_cost_price = Number(billing_cost_price) * billing_quantity;
                    const { combined_id, vendor_id } = (0, common_helper_1.separateCombClientToId)(billing_comvendor);
                    const VTrxnBody = {
                        comb_vendor: billing_comvendor,
                        vtrxn_amount: total_cost_price,
                        vtrxn_created_at: invoice_sales_date,
                        vtrxn_note: invoice_note,
                        vtrxn_particular_id: 154,
                        vtrxn_particular_type: 'Confirm Quotation Invoice',
                        vtrxn_type: 'DEBIT',
                        vtrxn_user_id: invoice_created_by,
                        vtrxn_voucher: invoice_no,
                    };
                    const billing_vtrxn_id = yield trxns.VTrxnInsert(VTrxnBody);
                    const billingInfoData = {
                        billing_invoice_id: invoice_id,
                        billing_sales_date: invoice_sales_date,
                        billing_remaining_quantity: billing_quantity,
                        billing_vendor_id: vendor_id,
                        billing_combined_id: combined_id,
                        billing_cost_price,
                        billing_quantity,
                        billing_subtotal,
                        billing_product_id,
                        billing_profit,
                        billing_unit_price,
                        pax_name,
                        billing_vtrxn_id,
                        billing_description,
                    };
                    yield conn.insertBillingInfo(billingInfoData);
                }
                const moneyReceiptInvoice = {
                    invoice_client_id,
                    invoice_combined_id,
                    invoice_created_by,
                    invoice_id,
                };
                yield new CommonAddMoneyReceipt_1.default().commonAddMoneyReceipt(req, moneyReceiptInvoice, trx);
                yield qu_conn.confirmQuotation(quotationId);
                yield this.updateVoucher(req, 'QT');
                const message = `ADDED QUOTATION, VOUCHER ${invoice_no}, BDT ${invoice_net_total}/-`;
                yield this.insertAudit(req, 'create', message, invoice_created_by, 'INVOICES');
                return {
                    success: true,
                    message,
                    data: { invoice_id },
                };
            }));
        });
        this.billInfos = (req) => __awaiter(this, void 0, void 0, function* () {
            const { quotation_id } = req.params;
            const conn = this.models.quotationModel(req);
            const data = yield conn.viewBillInfos(+quotation_id);
            return { success: true, data };
        });
        this.editQuotation = (req) => __awaiter(this, void 0, void 0, function* () {
            const { quotation_id } = req.params;
            const { client_id, q_number, date, bill_info, note, sub_total, discount, net_total, updated_by, } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.quotationModel(req, trx);
                const { invoice_client_id, invoice_combined_id } = (0, invoice_helpers_1.getClientOrCombId)(client_id);
                const quotationInfo = {
                    quotation_client_id: invoice_client_id,
                    quotation_combined_id: invoice_combined_id,
                    quotation_no: q_number,
                    quotation_date: date,
                    quotation_note: note,
                    quotation_discount_total: discount,
                    quotation_net_total: net_total,
                    quotation_updated_by: updated_by,
                };
                yield conn.updateQuotation(+quotation_id, quotationInfo);
                const billInfo = quotationHelper_1.default.parseBillInfo(bill_info, sub_total, +quotation_id);
                yield conn.deleteBillInfo(+quotation_id, updated_by);
                yield conn.insertBillInfo(billInfo);
                const message = `UPDATED QUOTATION/:${quotation_id}`;
                yield this.insertAudit(req, 'update', message, updated_by, 'QUOTATION');
                return {
                    success: true,
                    message: 'Quotation edited successfully',
                };
            }));
        });
        this.deleteQuotation = (req) => __awaiter(this, void 0, void 0, function* () {
            const { quotation_id } = req.params;
            const { quotation_deleted_by } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.quotationModel(req, trx);
                const deleted = yield conn.deleteQuotation(+quotation_id, quotation_deleted_by);
                if (!deleted) {
                    throw new customError_1.default('Please provide a valid id to delete a quotation', 400, 'Invalid quotation id');
                }
                yield conn.deleteBillInfo(+quotation_id, quotation_deleted_by);
                const message = `DELETED QUOTATION/:${quotation_id}`;
                yield this.insertAudit(req, 'delete', message, quotation_deleted_by, 'QUOTATION');
                return {
                    success: true,
                    message: 'Quotation deleted successfully',
                };
            }));
        });
    }
}
exports.default = QuotationServices;
//# sourceMappingURL=quotation.services.js.map