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
const abstract_services_1 = __importDefault(require("../../../../../abstracts/abstract.services"));
const Trxns_1 = __importDefault(require("../../../../../common/helpers/Trxns"));
const common_helper_1 = require("../../../../../common/helpers/common.helper");
const invoice_helpers_1 = __importStar(require("../../../../../common/helpers/invoice.helpers"));
const CommonAddMoneyReceipt_1 = __importDefault(require("../../../../../common/services/CommonAddMoneyReceipt"));
const CommonSmsSend_services_1 = __importDefault(require("../../../../smsSystem/utils/CommonSmsSend.services"));
const invoice_utils_1 = require("../../../utils/invoice.utils");
class AddInvoiceHajjpre extends abstract_services_1.default {
    constructor() {
        super();
        this.addInvoiceHajjPre = (req) => __awaiter(this, void 0, void 0, function* () {
            const { billing_information, haji_information, invoice_combclient_id, invoice_net_total, invoice_sales_date, invoice_due_date, invoice_sales_man_id, invoice_sub_total, invoice_created_by, invoice_note, invoice_vat, invoice_discount, invoice_haji_group_id, invoice_agent_com_amount, invoice_agent_id, invoice_service_charge, invoice_reference, money_receipt, } = req.body;
            // VALIDATE CLIENT AND VENDOR
            const { invoice_total_profit, invoice_total_vendor_price } = yield (0, invoice_helpers_1.InvoiceClientAndVendorValidate)(billing_information, invoice_combclient_id);
            // VALIDATE MONEY RECEIPT AMOUNT
            (0, invoice_helpers_1.MoneyReceiptAmountIsValid)(money_receipt, invoice_net_total);
            // CLIENT AND COMBINED CLIENT
            const { client_id: invoice_client_id, combined_id: invoice_combined_id } = (0, common_helper_1.separateCombClientToId)(invoice_combclient_id);
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.invoiceHajjPre(req, trx);
                const common_conn = this.models.CommonInvoiceModel(req, trx);
                const trxns = new Trxns_1.default(req, trx);
                const invoice_no = yield this.generateVoucher(req, 'IHP');
                const productsIds = billing_information.map((item) => item.billing_product_id);
                let note = '';
                if (productsIds.length) {
                    note = yield common_conn.getProductsName(productsIds);
                }
                // CLIENT TRANSACTIONS
                const utils = new invoice_utils_1.InvoiceUtils(req.body, common_conn);
                const clientTransId = yield utils.clientTrans(trxns, {
                    invoice_no,
                    tr_type: 13,
                    dis_tr_type: 14,
                    note,
                });
                // ============= invoice information
                const invoice_information = Object.assign(Object.assign({}, clientTransId), { invoice_client_id, invoice_no: invoice_no, invoice_sub_total, invoice_category_id: 30, invoice_sales_man_id,
                    invoice_net_total,
                    invoice_combined_id,
                    invoice_sales_date,
                    invoice_due_date,
                    invoice_created_by,
                    invoice_note,
                    invoice_haji_group_id,
                    invoice_total_profit,
                    invoice_total_vendor_price,
                    invoice_reference });
                const invoice_id = yield common_conn.insertInvoicesInfo(invoice_information);
                // AGENT TRANSACTION
                yield invoice_helpers_1.default.invoiceAgentTransactions(this.models.agentProfileModel(req, trx), req.agency_id, invoice_agent_id, invoice_id, invoice_no, invoice_created_by, invoice_agent_com_amount, 'CREATE', 102, 'HAJJ PRE REGISTRATION');
                const invoice_extra_ammount = {
                    extra_amount_invoice_id: invoice_id,
                    invoice_agent_com_amount,
                    invoice_agent_id,
                    invoice_service_charge,
                    invoice_discount,
                    invoice_vat,
                };
                yield common_conn.insertInvoiceExtraAmount(invoice_extra_ammount);
                for (const haji_info of haji_information) {
                    const insertedHajiInfo = {
                        hajiinfo_dob: haji_info.hajiinfo_dob,
                        hajiinfo_gender: haji_info.hajiinfo_gender,
                        hajiinfo_mobile: haji_info.hajiinfo_mobile,
                        hajiinfo_name: haji_info.hajiinfo_name,
                        hajiinfo_nid: haji_info.hajiinfo_nid,
                        hajiinfo_serial: haji_info.hajiinfo_serial,
                        hajiinfo_tracking_number: haji_info.hajiinfo_tracking_number,
                        hajiinfo_created_by: invoice_created_by,
                    };
                    const haji_info_haji_id = yield conn.insertHajiInfo(insertedHajiInfo);
                    const invoiceHajjPreInfo = {
                        haji_info_haji_id,
                        haji_info_invoice_id: invoice_id,
                        haji_info_maharam: haji_info.haji_info_maharam,
                        haji_info_possible_year: haji_info.haji_info_possible_year,
                        haji_info_reg_year: haji_info.haji_info_reg_year,
                        haji_info_vouchar_no: haji_info.haji_info_vouchar_no,
                        haji_info_created_by: invoice_created_by,
                    };
                    yield conn.insertHajiPreReg(invoiceHajjPreInfo);
                }
                // BILLING INFO AND INVOICE COST DETAILS
                for (const billingInfo of billing_information) {
                    const { billing_comvendor, billing_cost_price, billing_quantity, billing_product_id, billing_profit, billing_unit_price, pax_name, billing_description, } = billingInfo;
                    const total_cost_price = Number(billing_cost_price) * billing_quantity;
                    // CHECK IS VENDOR OR COMBINED
                    const { combined_id, vendor_id } = (0, common_helper_1.separateCombClientToId)(billing_comvendor);
                    const VTrxnBody = {
                        comb_vendor: billing_comvendor,
                        vtrxn_amount: total_cost_price,
                        vtrxn_created_at: invoice_sales_date,
                        vtrxn_note: billing_description,
                        vtrxn_particular_id: 13,
                        vtrxn_pax: pax_name,
                        vtrxn_type: combined_id ? 'CREDIT' : 'DEBIT',
                        vtrxn_user_id: invoice_created_by,
                        vtrxn_voucher: invoice_no,
                    };
                    const billing_vtrxn_id = yield trxns.VTrxnInsert(VTrxnBody);
                    const billing_subtotal = billing_quantity * billing_unit_price;
                    const billingInfoData = {
                        billing_invoice_id: invoice_id,
                        billing_sales_date: invoice_sales_date,
                        billing_vendor_id: vendor_id,
                        billing_combined_id: combined_id,
                        billing_cost_price,
                        billing_quantity,
                        billing_remaining_quantity: billing_quantity,
                        billing_subtotal,
                        billing_product_id,
                        billing_profit,
                        billing_unit_price,
                        pax_name,
                        billing_description,
                        billing_vtrxn_id,
                    };
                    yield conn.insertHajiBillingInfo(billingInfoData);
                }
                // MONEY RECEIPT
                const moneyReceiptInvoice = {
                    invoice_client_id,
                    invoice_combined_id,
                    invoice_created_by,
                    invoice_id,
                };
                yield new CommonAddMoneyReceipt_1.default().commonAddMoneyReceipt(req, moneyReceiptInvoice, trx);
                // @Invoic History
                const history_data = {
                    history_activity_type: 'INVOICE_CREATED',
                    history_created_by: invoice_created_by,
                    history_invoice_id: invoice_id,
                    history_invoice_payment_amount: invoice_net_total,
                    invoicelog_content: 'Invoice hajj pre registration has been created',
                };
                yield common_conn.insertInvoiceHistory(history_data);
                yield this.updateVoucher(req, 'IHP');
                const smsInvoiceDate = {
                    invoice_client_id: invoice_client_id,
                    invoice_combined_id: invoice_combined_id,
                    invoice_sales_date,
                    invoice_created_by,
                    invoice_id,
                };
                yield new CommonSmsSend_services_1.default().sendSms(req, smsInvoiceDate, trx);
                yield this.insertAudit(req, 'create', `Invoice hajj pre registration has been created, Voucher - ${invoice_no}, Net - ${invoice_net_total}/-`, invoice_created_by, 'INVOICES');
                return {
                    success: true,
                    message: 'Invoice hajj pre registration has been created',
                    data: { invoice_id },
                };
            }));
        });
    }
}
exports.default = AddInvoiceHajjpre;
//# sourceMappingURL=AddInvoiceHajjPre.Services.js.map