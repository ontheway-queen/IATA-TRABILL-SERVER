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
const common_helper_1 = require("../../../../../common/helpers/common.helper");
const invoice_helpers_1 = require("../../../../../common/helpers/invoice.helpers");
const lib_1 = require("../../../../../common/utils/libraries/lib");
class AirTicketTaxRefund extends abstract_services_1.default {
    constructor() {
        super();
        this.addAirTicketTax = (req) => __awaiter(this, void 0, void 0, function* () {
            const { refund_invoice_id, invoice_category_id, comb_client, ticket_info, client_refund_type, vendor_refund_type, client_pay_type, vendor_pay_type, client_account_id, vendor_account_id, client_total_tax_refund, vendor_total_tax_refund, refund_date, } = req.body;
            const profit = vendor_total_tax_refund - client_total_tax_refund;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.invoiceAirticketModel(req, trx);
                const trxns = new Trxns_1.default(req, trx);
                const { client_id, combined_id } = (0, common_helper_1.separateCombClientToId)(comb_client);
                const refund_voucher = (0, invoice_helpers_1.generateVoucherNumber)(4, 'TRF');
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
                        ctrxn_particular_id: 25,
                        ctrxn_created_at: refund_date,
                        ctrxn_note: '',
                        ctrxn_pay_type: clAccPayType,
                        ctrxn_voucher: refund_voucher,
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
                        acctrxn_particular_id: 25,
                        acctrxn_pay_type: clAccPayType,
                        acctrxn_voucher: refund_voucher,
                    };
                    client_account_trxn_id = yield trxns.AccTrxnInsert(ACTrxnBody);
                    const clTrxnBody = {
                        ctrxn_type: 'CREDIT',
                        ctrxn_amount: 0,
                        ctrxn_cl: comb_client,
                        ctrxn_particular_id: 25,
                        ctrxn_created_at: refund_date,
                        ctrxn_note: `Money return : ${client_total_tax_refund}/-`,
                        ctrxn_pay_type: clAccPayType,
                        ctrxn_voucher: refund_voucher,
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
                        acctrxn_particular_id: 26,
                        acctrxn_pay_type: VAccPayType,
                        acctrxn_voucher: refund_voucher,
                    };
                    vendor_account_trxn_id = yield trxns.AccTrxnInsert(ACTrxnBody);
                }
                const refundData = {
                    refund_date,
                    refund_profit: profit,
                    refund_invoice_id,
                    refund_voucher,
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
                        vtrxn_created_at: refund_date,
                        vtrxn_particular_id: 25,
                        vtrxn_type: 'CREDIT',
                        vtrxn_user_id: req.user_id,
                        vtrxn_voucher: refund_voucher,
                        vtrxn_airticket_no: item.airticket_ticket_no,
                        vtrxn_amount: vendor_refund_type === 'Adjust' ? item.refund_tax_amount : 0,
                        vtrxn_note: vendor_refund_type === 'Adjust'
                            ? ''
                            : `Money return : ${item.refund_tax_amount}/-`,
                    };
                    const refund_v_trxn_id = yield trxns.VTrxnInsert(VTrxnBody);
                    const refundItemData = {
                        refund_airticket_id: item.airticket_id,
                        refund_combined_id: combined_id,
                        refund_id,
                        refund_tax_amount: item.refund_tax_amount,
                        refund_vendor_id: vendor_id,
                        refund_v_trxn_id,
                        refund_inv_category_id: invoice_category_id,
                    };
                    yield conn.insertAirTicketTaxRefundItem(refundItemData);
                    // update air ticket refund
                    yield conn.updateAirTicketItemRefund(item.airticket_id, +invoice_category_id);
                }
                // UPDATE INVOICE REFUND
                yield conn.updateInvoiceRefund(refund_invoice_id);
                return { success: true, msg: 'Invoice air ticket tax refunded!' };
            }));
        });
    }
}
exports.default = AirTicketTaxRefund;
//# sourceMappingURL=air_ticket_tax_refund.js.map