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
const common_helper_1 = require("../../../../../common/helpers/common.helper");
const invoice_helpers_1 = __importStar(require("../../../../../common/helpers/invoice.helpers"));
const Trxns_1 = __importDefault(require("../../../../../common/helpers/Trxns"));
class EditInvoiceHajjpre extends abstract_services_1.default {
    constructor() {
        super();
        this.editInvoiceHajjPre = (req) => __awaiter(this, void 0, void 0, function* () {
            const { billing_information, haji_information, invoice_combclient_id, invoice_net_total, invoice_sales_date, invoice_due_date, invoice_sales_man_id, invoice_sub_total, invoice_vat, invoice_created_by, invoice_note, invoice_discount, invoice_haji_group_id, invoice_service_charge, invoice_agent_id, invoice_agent_com_amount, invoice_no, invoice_reference, } = req.body;
            // VALIDATE CLIENT AND VENDOR
            const { invoice_total_profit, invoice_total_vendor_price } = yield (0, invoice_helpers_1.InvoiceClientAndVendorValidate)(billing_information, invoice_combclient_id);
            const { invoice_client_id, invoice_combined_id } = yield (0, invoice_helpers_1.getClientOrCombId)(invoice_combclient_id);
            const invoice_id = Number(req.params.invoice_id);
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.invoiceHajjPre(req, trx);
                const common_conn = this.models.CommonInvoiceModel(req, trx);
                const trxns = new Trxns_1.default(req, trx);
                const { prevCtrxnId } = yield common_conn.getPreviousInvoices(invoice_id);
                const ctrxn_pax = billing_information
                    .map((item) => item.pax_name)
                    .join(' ,');
                const clTrxnBody = {
                    ctrxn_type: 'DEBIT',
                    ctrxn_amount: invoice_net_total,
                    ctrxn_cl: invoice_combclient_id,
                    ctrxn_voucher: invoice_no,
                    ctrxn_particular_id: 103,
                    ctrxn_created_at: invoice_sales_date,
                    ctrxn_note: invoice_note,
                    ctrxn_particular_type: 'Invoice hajj pre reg update',
                    ctrxn_pax,
                    ctrxn_trxn_id: prevCtrxnId,
                };
                yield trxns.clTrxnUpdate(clTrxnBody);
                const invoice_information = {
                    invoice_sub_total,
                    invoice_sales_man_id,
                    invoice_net_total,
                    invoice_sales_date,
                    invoice_due_date,
                    invoice_updated_by: invoice_created_by,
                    invoice_note,
                    invoice_client_id,
                    invoice_combined_id,
                    invoice_haji_group_id,
                    invoice_reference,
                    invoice_total_profit, invoice_total_vendor_price
                };
                yield common_conn.updateInvoiceInformation(invoice_id, invoice_information);
                // AGENT TRANSACTION
                if (invoice_agent_id) {
                    yield invoice_helpers_1.default.invoiceAgentTransactions(this.models.agentProfileModel(req, trx), req.agency_id, invoice_agent_id, invoice_id, invoice_no, invoice_created_by, invoice_agent_com_amount, 'UPDATE', 103, 'INVOICE HAJJ PRE REGISTRATION');
                }
                else {
                    yield invoice_helpers_1.default.deleteAgentTransactions(this.models.agentProfileModel(req, trx), invoice_id, invoice_created_by);
                }
                const invoiceExtraAmount = {
                    extra_amount_invoice_id: invoice_id,
                    invoice_vat,
                    invoice_discount,
                    invoice_service_charge,
                    invoice_agent_id,
                    invoice_agent_com_amount,
                };
                yield common_conn.updateInvoiceExtraAmount(invoiceExtraAmount, invoice_id);
                // ================== @Haji Information ==================
                for (const haji_info of haji_information) {
                    const { hajiinfo_id, hajiinfo_dob, hajiinfo_gender, hajiinfo_mobile, hajiinfo_name, hajiinfo_nid, hajiinfo_serial, hajiinfo_tracking_number, haji_info_maharam, haji_info_possible_year, haji_info_reg_year, haji_info_vouchar_no, hajiinfo_is_deleted, } = haji_info;
                    if (hajiinfo_is_deleted !== 1) {
                        if (!hajiinfo_id) {
                            const insertedHajiInfo = {
                                hajiinfo_dob,
                                hajiinfo_gender,
                                hajiinfo_mobile,
                                hajiinfo_name,
                                hajiinfo_nid,
                                hajiinfo_serial,
                                hajiinfo_tracking_number,
                                hajiinfo_created_by: invoice_created_by,
                            };
                            const haji_info_haji_id = yield conn.insertHajiInfo(insertedHajiInfo);
                            const invoiceHajjPreInfo = {
                                haji_info_haji_id,
                                haji_info_invoice_id: invoice_id,
                                haji_info_maharam,
                                haji_info_possible_year,
                                haji_info_reg_year,
                                haji_info_vouchar_no,
                                haji_info_created_by: invoice_created_by,
                            };
                            yield conn.insertHajiPreReg(invoiceHajjPreInfo);
                        }
                        else {
                            const insertedHajiInfo = {
                                hajiinfo_dob,
                                hajiinfo_gender,
                                hajiinfo_mobile,
                                hajiinfo_name,
                                hajiinfo_nid,
                                hajiinfo_serial,
                                hajiinfo_tracking_number,
                                hajiinfo_created_by: invoice_created_by,
                            };
                            yield conn.updateHajiInfo(insertedHajiInfo, hajiinfo_id);
                            const invoiceHajjPreInfo = {
                                haji_info_haji_id: hajiinfo_id,
                                haji_info_invoice_id: invoice_id,
                                haji_info_maharam,
                                haji_info_possible_year,
                                haji_info_reg_year,
                                haji_info_vouchar_no,
                                haji_info_created_by: invoice_created_by,
                            };
                            yield conn.updateHajiPreReg(invoiceHajjPreInfo, hajiinfo_id);
                        }
                    }
                    else {
                        yield conn.deleteHajiPreRegInfo(hajiinfo_id, invoice_created_by);
                        yield conn.deletePrevHajiInfo(hajiinfo_id, invoice_created_by);
                    }
                }
                // BILLING
                for (const billingInfo of billing_information) {
                    const { billing_id, billing_comvendor, billing_cost_price, billing_quantity, billing_product_id, billing_profit, billing_unit_price, pax_name, billing_description, is_deleted, } = billingInfo;
                    const total_cost_price = Number(billing_cost_price) * billing_quantity;
                    const billing_subtotal = billing_quantity * billing_unit_price;
                    const { combined_id, vendor_id } = (0, common_helper_1.separateCombClientToId)(billing_comvendor);
                    const VTrxnBody = {
                        comb_vendor: billing_comvendor,
                        vtrxn_amount: total_cost_price,
                        vtrxn_created_at: invoice_sales_date,
                        vtrxn_note: billing_description,
                        vtrxn_particular_id: 153,
                        vtrxn_particular_type: 'Invoice hajj pre reg update',
                        vtrxn_pax: pax_name,
                        vtrxn_type: combined_id ? 'CREDIT' : 'DEBIT',
                        vtrxn_user_id: invoice_created_by,
                        vtrxn_voucher: invoice_no,
                    };
                    if (is_deleted !== 1) {
                        if (!billing_id) {
                            const billing_vtrxn_id = yield trxns.VTrxnInsert(VTrxnBody);
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
                        else {
                            const [{ prevTrxnId, prevComvendor }] = yield conn.getPreRegBillingInfo(billing_id);
                            yield trxns.VTrxnUpdate(Object.assign(Object.assign({}, VTrxnBody), { trxn_id: prevTrxnId }));
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
                            };
                            yield conn.updateHajiBillingInfo(billingInfoData, billing_id);
                        }
                    }
                    else {
                        const previousBillingInfo = yield conn.getPreRegBillingInfo(billing_id);
                        yield conn.deleteSingleHajiPreReg(billing_id, invoice_created_by);
                        yield trxns.deleteInvVTrxn(previousBillingInfo);
                    }
                }
                // @Invoic History
                const history_data = {
                    history_activity_type: 'INVOICE_UPDATED',
                    history_created_by: invoice_created_by,
                    history_invoice_id: invoice_id,
                    history_invoice_payment_amount: invoice_net_total,
                    invoicelog_content: 'Invoice hajj pre registration has been updated',
                };
                yield common_conn.insertInvoiceHistory(history_data);
                yield this.insertAudit(req, 'update', `Invoice hajj has been updated, Voucher - ${invoice_no}, Net - ${invoice_net_total}/-`, invoice_created_by, 'INVOICES');
                return {
                    success: true,
                    message: 'Invoice hajj pre registration has been updated',
                };
            }));
        });
    }
}
exports.default = EditInvoiceHajjpre;
//# sourceMappingURL=EditInvoiceHajjPreReg.js.map