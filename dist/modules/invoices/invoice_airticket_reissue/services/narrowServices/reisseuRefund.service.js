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
const invoice_helpers_1 = require("../../../../../common/helpers/invoice.helpers");
const lib_1 = require("../../../../../common/utils/libraries/lib");
const common_helper_1 = require("./../../../../../common/helpers/common.helper");
class ReissueRefundService extends abstract_services_1.default {
    constructor() {
        super();
        this.reissueRefund = (req) => __awaiter(this, void 0, void 0, function* () {
            const { comb_client, invoice_id, client_total_refund, client_payment_method, vendor_refund_type, client_refund_type, total_vendor_refund, vendor_payment_method, vendor_payment_acc_id, client_payment_acc_id, created_by, ticket_info, refund_date, } = req.body;
            const { client_id, combined_id } = (0, common_helper_1.separateCombClientToId)(comb_client);
            let totalSales = 0;
            let clientCharge = 0;
            let totalPurchase = 0;
            let vendorCharge = 0;
            for (const item of ticket_info) {
                totalSales += item.airticket_client_price || 0;
                clientCharge += item.client_charge || 0;
                totalPurchase += item.airticket_purchase_price || 0;
                vendorCharge += item.vendor_charge || 0;
            }
            const clientContent = `Total sales price: ${totalSales}/-, Refund charge: ${clientCharge}/-`;
            const vendorContent = `Total purchase price: ${totalPurchase}/-, Refund charge: ${vendorCharge}/-`;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.reissueAirticket(req, trx);
                const common_conn = this.models.CommonInvoiceModel(req, trx);
                const trxns = new Trxns_1.default(req, trx);
                const voucher = (0, invoice_helpers_1.generateVoucherNumber)(4, 'RRF');
                // TRANSACTIONs
                let refund_client_trx_id = null;
                let refund_client_account_trx_id = null;
                let refund_vendor_account_trx_id = null;
                if (client_refund_type == 'Adjust') {
                    const clTrxnBody = {
                        ctrxn_type: 'CREDIT',
                        ctrxn_amount: client_total_refund,
                        ctrxn_cl: comb_client,
                        ctrxn_voucher: voucher,
                        ctrxn_particular_id: 19,
                        ctrxn_created_at: refund_date,
                        ctrxn_note: clientContent,
                    };
                    refund_client_trx_id = yield trxns.clTrxnInsert(clTrxnBody);
                }
                else {
                    const AccTrxnBody = {
                        acctrxn_ac_id: client_payment_acc_id,
                        acctrxn_type: 'DEBIT',
                        acctrxn_voucher: voucher,
                        acctrxn_amount: client_total_refund,
                        acctrxn_created_at: refund_date,
                        acctrxn_created_by: created_by,
                        acctrxn_note: clientContent,
                        acctrxn_particular_id: 20,
                        acctrxn_pay_type: (0, lib_1.getPaymentType)(client_payment_method),
                    };
                    refund_vendor_account_trx_id = yield trxns.AccTrxnInsert(AccTrxnBody);
                }
                // VENDOR ACCOUNT TRANS
                if (vendor_refund_type === 'Return') {
                    const AccTrxnBody = {
                        acctrxn_ac_id: vendor_payment_acc_id,
                        acctrxn_type: 'CREDIT',
                        acctrxn_voucher: voucher,
                        acctrxn_amount: total_vendor_refund,
                        acctrxn_created_at: refund_date,
                        acctrxn_created_by: created_by,
                        acctrxn_note: vendorContent,
                        acctrxn_particular_id: 20,
                        acctrxn_pay_type: (0, lib_1.getPaymentType)(client_payment_method),
                    };
                    refund_client_account_trx_id = yield trxns.AccTrxnInsert(AccTrxnBody);
                }
                // REISSUE REFUND
                const refundData = {
                    refund_org_agency: req.agency_id,
                    refund_client_id: client_id,
                    refund_combined_id: combined_id,
                    refund_client_trx_id,
                    refund_invoice_id: invoice_id,
                    refund_client_total: client_total_refund,
                    refund_client_type: client_refund_type,
                    refund_client_payment_method: client_payment_method,
                    refund_client_account_id: client_payment_acc_id,
                    refund_client_account_trx_id,
                    refund_vendor_total: total_vendor_refund,
                    refund_vendor_type: vendor_refund_type,
                    refund_vendor_payment_method: vendor_payment_method,
                    refund_vendor_account_id: vendor_payment_acc_id,
                    refund_vendor_account_trx_id,
                    refund_created_by: created_by,
                    refund_voucher: voucher,
                    refund_date,
                };
                const refund_id = yield conn.insertReissueRefund(refundData);
                // REFUND ITEM
                const refundDateItems = [];
                for (const item of ticket_info) {
                    const { combined_id: ritem_combined_id, vendor_id } = (0, common_helper_1.separateCombClientToId)(item.comb_vendor);
                    let ritem_vendor_trx_id = null;
                    // VENDOR TRANSACTION
                    if (vendor_refund_type === 'Adjust') {
                        const VTrxnBody = {
                            comb_vendor: item.comb_vendor,
                            vtrxn_amount: item.vendor_refund,
                            vtrxn_created_at: refund_date,
                            vtrxn_note: `Purchase price ${item.airticket_purchase_price}/-, Charge ${item.vendor_charge}/-`,
                            vtrxn_particular_id: 19,
                            vtrxn_type: 'CREDIT',
                            vtrxn_user_id: created_by,
                            vtrxn_voucher: voucher,
                        };
                        ritem_vendor_trx_id = yield trxns.VTrxnInsert(VTrxnBody);
                    }
                    const refundItem = {
                        ritem_refund_id: refund_id,
                        ritem_airticket_item_id: item.airticket_id,
                        ritem_vendor_id: vendor_id,
                        ritem_combined_id,
                        ritem_vendor_trx_id,
                        ritem_sales: item.airticket_client_price,
                        ritem_client_charge: item.client_charge,
                        ritem_client_refund: item.client_refund,
                        ritem_purchase: item.airticket_purchase_price,
                        ritem_vendor_charge: item.vendor_charge,
                        ritem_vendor_refund: item.vendor_refund,
                    };
                    refundDateItems.push(refundItem);
                    yield conn.reissueItemRefundUpdate(item.airticket_id);
                }
                yield conn.insertReissueRefundItem(refundDateItems);
                // UPDATE INVOICE IS REFUND
                yield conn.updateInvoiceIsRefund(invoice_id);
                // INVOICE HISTORY INSERT
                const history_data = {
                    history_activity_type: 'INVOICE_REFUNDED',
                    history_created_by: created_by,
                    history_invoice_id: invoice_id,
                    invoicelog_content: 'Invoice Reissue Refunded. Voucher:' + voucher,
                };
                yield common_conn.insertInvoiceHistory(history_data);
                // AUDIT
                this.insertAudit(req, 'create', 'Invoice Reissue Refunded. Voucher:' + voucher, created_by, 'REFUND');
                return {
                    success: true,
                    message: 'Reissue Refund Created Successfully! Voucher:' + voucher,
                };
            }));
        });
        this.getReissueRefundInfo = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.reissueAirticket(req);
            const invoiceId = req.params.invoice_id;
            const refundData = yield conn.getReissueRefundData(invoiceId);
            const refundItems = yield conn.getReissueRefundItems(invoiceId);
            return {
                success: true,
                data: {
                    refundData,
                    refundItems,
                },
            };
        });
    }
}
exports.default = ReissueRefundService;
//# sourceMappingURL=reisseuRefund.service.js.map