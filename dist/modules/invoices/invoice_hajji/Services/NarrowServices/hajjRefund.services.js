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
const abstract_services_1 = __importDefault(require("../../../../../abstracts/abstract.services"));
const Trxns_1 = __importDefault(require("../../../../../common/helpers/Trxns"));
const lib_1 = require("../../../../../common/utils/libraries/lib");
const invoice_helpers_1 = require("../../../../../common/helpers/invoice.helpers");
const common_helper_1 = require("../../../../../common/helpers/common.helper");
class HajjRefundServices extends abstract_services_1.default {
    constructor() {
        super();
        this.hajjRefund = (req) => __awaiter(this, void 0, void 0, function* () {
            const { client_refund_type, client_total_refund, refund_date, invoice_id, comb_client, vendor_refund_type, vendor_total_refund, client_payment_acc_id, client_payment_method, vendor_payment_acc_id, vendor_payment_method, billing_info, created_by, } = req.body;
            let totalSales = 0;
            let clientCharge = 0;
            let totalPurchase = 0;
            let vendorCharge = 0;
            for (const item of billing_info) {
                totalSales += item.billing_unit_price || 0;
                clientCharge += item.client_charge || 0;
                totalPurchase += item.billing_cost_price || 0;
                vendorCharge += item.vendor_charge || 0;
            }
            const clientContent = `Total sales price: ${totalSales}/-, Refund charge: ${clientCharge}/-`;
            const vendorContent = `Total purchase price: ${totalPurchase}/-, Refund charge: ${vendorCharge}/-`;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.InvoiceHajjModels(req, trx);
                const common_conn = this.models.CommonInvoiceModel(req, trx);
                const trxn = new Trxns_1.default(req, trx);
                const voucher_no = (0, invoice_helpers_1.generateVoucherNumber)(6, 'HR');
                const { combined_id, client_id } = (0, common_helper_1.separateCombClientToId)(comb_client);
                let refund_client_acc_trxn_id = null;
                let refund_ctrxn_id = null;
                let refund_vendor_acc_trxn_id = null;
                if (client_refund_type === 'Adjust') {
                    refund_ctrxn_id = yield trxn.clTrxnInsert({
                        ctrxn_amount: client_total_refund,
                        ctrxn_cl: comb_client,
                        ctrxn_created_at: refund_date,
                        ctrxn_particular_id: 8,
                        ctrxn_particular_type: 'Hajj Refund ' + client_refund_type,
                        ctrxn_voucher: voucher_no,
                        ctrxn_type: 'CREDIT',
                        ctrxn_user_id: created_by,
                        ctrxn_note: clientContent,
                    });
                }
                else {
                    refund_client_acc_trxn_id = yield trxn.AccTrxnInsert({
                        acctrxn_ac_id: client_payment_acc_id,
                        acctrxn_amount: client_total_refund,
                        acctrxn_created_at: refund_date,
                        acctrxn_created_by: created_by,
                        acctrxn_particular_id: 8,
                        acctrxn_particular_type: 'Client Refund Return',
                        acctrxn_pay_type: (0, lib_1.getPaymentType)(client_payment_method),
                        acctrxn_type: 'DEBIT',
                        acctrxn_voucher: voucher_no,
                        acctrxn_note: clientContent,
                    });
                }
                if (vendor_refund_type === 'Return') {
                    refund_vendor_acc_trxn_id = yield trxn.AccTrxnInsert({
                        acctrxn_ac_id: client_payment_acc_id,
                        acctrxn_amount: client_total_refund,
                        acctrxn_created_at: refund_date,
                        acctrxn_created_by: created_by,
                        acctrxn_particular_id: 7,
                        acctrxn_particular_type: 'Vendor Refund Return',
                        acctrxn_pay_type: (0, lib_1.getPaymentType)(client_payment_method),
                        acctrxn_type: 'CREDIT',
                        acctrxn_voucher: voucher_no,
                        acctrxn_note: vendorContent,
                    });
                }
                const refund_id = yield conn.createHajjRefund({
                    refund_client_acc_id: client_payment_acc_id,
                    refund_voucher_no: voucher_no,
                    refund_client_acc_trxn_id,
                    refund_client_id: client_id,
                    refund_combine_id: combined_id,
                    refund_client_payment_method: client_payment_method,
                    refund_client_total: client_total_refund,
                    refund_client_type: client_refund_type,
                    refund_created_by: created_by,
                    refund_ctrxn_id,
                    refund_invoice_id: invoice_id,
                    refund_org_agency: +req.agency_id,
                    refund_vendor_acc_id: vendor_payment_acc_id,
                    refund_vendor_acc_trxn_id,
                    refund_vendor_payment_method: vendor_payment_method,
                    refund_vendor_total: vendor_total_refund,
                    refund_vendor_type: vendor_refund_type,
                    refund_date,
                });
                const refundItemsInfo = [];
                for (const billing of billing_info) {
                    const { refund_quantity, vendor_charge, vendor_refund, comb_vendor, client_charge, client_refund, billing_cost_price, billing_id, billing_unit_price, } = billing;
                    const { vendor_id, combined_id } = (0, common_helper_1.separateCombClientToId)(comb_vendor);
                    let ritem_vtrx_id = null;
                    if (vendor_refund_type === 'Adjust') {
                        ritem_vtrx_id = yield trxn.VTrxnInsert({
                            vtrxn_amount: billing_cost_price,
                            vtrxn_created_at: refund_date,
                            vtrxn_particular_id: 7,
                            vtrxn_particular_type: 'Hajj Refund ' + client_refund_type,
                            vtrxn_type: 'CREDIT',
                            vtrxn_user_id: created_by,
                            vtrxn_voucher: voucher_no,
                            comb_vendor,
                            vtrxn_note: vendorContent,
                        });
                    }
                    const refundItem = {
                        ritem_billing_id: billing_id,
                        ritem_client_charge: client_charge,
                        ritem_client_refund: client_refund,
                        ritem_combine_id: combined_id,
                        ritem_vendor_id: vendor_id,
                        ritem_quantity: refund_quantity,
                        ritem_cost_price: billing_cost_price,
                        ritem_unit_price: billing_unit_price,
                        ritem_refund_id: refund_id,
                        ritem_vendor_charge: vendor_charge,
                        ritem_vendor_refund: vendor_refund,
                        ritem_vtrx_id,
                    };
                    // update billing remaining quantity;
                    yield conn.updateHajjBillingRemainingQuantity(billing_id, refund_quantity);
                    refundItemsInfo.push(refundItem);
                }
                if (refundItemsInfo.length)
                    yield conn.createHajjRefundItems(refundItemsInfo);
                const history_data = {
                    history_activity_type: 'INVOICE_REFUNDED',
                    history_created_by: created_by,
                    history_invoice_id: invoice_id,
                    invoicelog_content: 'Invoice Reissue Refunded. Voucher:' + voucher_no,
                };
                yield common_conn.insertInvoiceHistory(history_data);
                // update invoice is refund;
                yield conn.updateHajjInvoiceIsRefund(invoice_id, 1);
                yield this.insertAudit(req, 'create', 'Hajj refund has been created', created_by, 'HAJJ_MGT');
                return {
                    success: true,
                    message: 'Hajj Refund Created Successful!',
                    data: refund_id,
                };
            }));
        });
    }
}
exports.default = HajjRefundServices;
//# sourceMappingURL=hajjRefund.services.js.map