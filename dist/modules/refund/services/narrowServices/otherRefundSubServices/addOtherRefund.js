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
class AddOtherRefund extends abstract_services_1.default {
    constructor() {
        super();
        this.add = (req) => __awaiter(this, void 0, void 0, function* () {
            const { comb_client, vendor_refund_info, client_refund_info, date, note, created_by, invoice_id, } = req.body;
            const { crefund_payment_type, payment_type_id, trxn_charge_amount, account_id, crefund_date, total_refund_amount, total_refund_charge, total_return_amount, } = client_refund_info;
            const other_vouchar_number = (0, invoice_helpers_1.generateVoucherNumber)(7, 'OTHER-REF');
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.refundModel(req, trx);
                const vendor_conn = this.models.vendorModel(req, trx);
                const trxns = new Trxns_1.default(req, trx);
                const { invoice_payment } = yield conn.getInvoiceDuePayment(invoice_id);
                const { client_id, combined_id } = (0, common_helper_1.separateCombClientToId)(comb_client);
                const { pax_name, airticket_route, ticket_no, ticket_pnr } = yield conn.getOthrRefundInfo(invoice_id);
                let refund_charge_id = null;
                if (payment_type_id === 3 && trxn_charge_amount) {
                    const online_charge_trxn = {
                        charge_from_acc_id: account_id,
                        charge_to_client_id: client_id,
                        charge_to_combined_id: combined_id,
                        charge_amount: trxn_charge_amount,
                        charge_purpose: `Invoice Other Refund Client`,
                    };
                    refund_charge_id = yield vendor_conn.insertOnlineTrxnCharge(online_charge_trxn);
                }
                const refundInfo = {
                    refund_client_id: client_id,
                    refund_combined_id: combined_id,
                    refund_invoice_id: invoice_id,
                    refund_vouchar_number: other_vouchar_number,
                    refund_created_by: created_by,
                    refund_status: 1,
                    refund_date: date,
                    refund_charge_amount: trxn_charge_amount,
                    refund_charge_id,
                    refund_note: note,
                };
                const refund_id = yield conn.refundOther(refundInfo);
                let crefund_ctrxnid = null;
                let crefund_charge_ctrxnid = null;
                let crefund_actransaction_id = null;
                if (crefund_payment_type === 'ADJUST') {
                    const ctrxn_note = `REFUND TOTAL ${total_refund_amount}/- \nREFUND CHARGE ${total_refund_charge}\nRETURN AMOUNT ${total_return_amount}/-`;
                    const clTrxnBody = {
                        ctrxn_type: 'CREDIT',
                        ctrxn_amount: total_refund_amount,
                        ctrxn_cl: comb_client,
                        ctrxn_voucher: other_vouchar_number,
                        ctrxn_particular_id: 110,
                        ctrxn_created_at: date,
                        ctrxn_note,
                        ctrxn_particular_type: 'OTHER REFUND(ADJUST)',
                        ctrxn_airticket_no: ticket_no,
                        ctrxn_pax: pax_name,
                        ctrxn_pnr: ticket_pnr,
                        ctrxn_route: airticket_route,
                    };
                    const clChargeTrxnBody = {
                        ctrxn_type: 'DEBIT',
                        ctrxn_amount: total_refund_charge,
                        ctrxn_cl: comb_client,
                        ctrxn_voucher: other_vouchar_number,
                        ctrxn_particular_id: 110,
                        ctrxn_created_at: date,
                        ctrxn_note: '',
                        ctrxn_particular_type: 'OTHER REFUND(CHARGE)',
                        ctrxn_airticket_no: ticket_no,
                        ctrxn_pax: pax_name,
                        ctrxn_pnr: ticket_pnr,
                        ctrxn_route: airticket_route,
                    };
                    crefund_ctrxnid = yield trxns.clTrxnInsert(clTrxnBody);
                    crefund_charge_ctrxnid = yield trxns.clTrxnInsert(clChargeTrxnBody);
                }
                // MONEY RETURN
                else {
                    if (payment_type_id !== 4) {
                        let return_amount = 0;
                        let client_adjust_amount = 0;
                        if (invoice_payment >= total_refund_amount) {
                            return_amount = total_return_amount;
                        }
                        else if (invoice_payment < total_refund_amount) {
                            return_amount = invoice_payment - total_refund_charge;
                            client_adjust_amount = total_refund_amount - invoice_payment;
                        }
                        let accPayType = (0, lib_1.getPaymentType)(payment_type_id);
                        if (return_amount > 0) {
                            const ACTrxnBody = {
                                acctrxn_ac_id: account_id,
                                acctrxn_type: 'DEBIT',
                                acctrxn_amount: return_amount,
                                acctrxn_voucher: other_vouchar_number,
                                acctrxn_created_at: date,
                                acctrxn_created_by: created_by,
                                acctrxn_note: note,
                                acctrxn_particular_id: 110,
                                acctrxn_particular_type: 'OTHER REFUND(MONEY RETURN)',
                                acctrxn_pay_type: accPayType,
                            };
                            crefund_actransaction_id = yield trxns.AccTrxnInsert(ACTrxnBody);
                        }
                        let ctrxn_note = `REFUND TOTAL ${total_refund_amount}/- \nREFUND CHARGE ${total_refund_charge}\nRETURN AMOUNT ${return_amount}/-`;
                        if (client_adjust_amount) {
                            ctrxn_note += `\nAdjust amount : ${client_adjust_amount}/-`;
                        }
                        const clTrxnBody = {
                            ctrxn_type: 'CREDIT',
                            ctrxn_amount: client_adjust_amount,
                            ctrxn_cl: comb_client,
                            ctrxn_voucher: other_vouchar_number,
                            ctrxn_particular_id: 110,
                            ctrxn_created_at: date,
                            ctrxn_note,
                            ctrxn_particular_type: 'OTHER REFUND(MONEY RETURN)',
                            ctrxn_airticket_no: ticket_no,
                            ctrxn_pax: pax_name,
                            ctrxn_pnr: ticket_pnr,
                            ctrxn_route: airticket_route,
                            ctrxn_pay_type: accPayType,
                        };
                        crefund_ctrxnid = yield trxns.clTrxnInsert(clTrxnBody);
                    }
                    else {
                        // for cheque...
                    }
                }
                // insert refund to client
                const refundOtherClient = {
                    crefund_refund_id: refund_id,
                    crefund_invoice_id: invoice_id,
                    crefund_client_id: client_id,
                    crefund_combined_id: combined_id,
                    crefund_account_id: account_id,
                    crefund_actransaction_id: crefund_actransaction_id,
                    crefund_ctrxnid: crefund_ctrxnid,
                    crefund_charge_ctrxnid: crefund_charge_ctrxnid,
                    crefund_charge_amount: total_refund_charge,
                    crefund_total_amount: total_refund_amount,
                    crefund_return_amount: total_return_amount,
                    crefund_vouchar_number: other_vouchar_number,
                    crefund_payment_type,
                    crefund_moneyreturn_type: payment_type_id,
                    crefund_moneyreturn_account_id: account_id,
                    crefund_date: date,
                };
                yield conn.refundOtherClient(refundOtherClient);
                const otherClientRefund = [];
                for (const item of vendor_refund_info) {
                    const { vrefund_bill_id, comb_vendor_id, vrefund_product_id, vrefund_quantity, billing_remaining_quantity, vrefund_charge, payment_method, trxn_charge_amount, vrefund_account_id, vrefund_amount, vrefund_return_amount, vrefund_payment_type, vrefund_invoice_category_id, vrefund_date, } = item;
                    if (!vrefund_quantity) {
                        continue;
                    }
                    yield conn.updateAirticketItemIsRefund(vrefund_bill_id, 4, 1);
                    const { vendor_id, combined_id: combinedId } = (0, common_helper_1.separateCombClientToId)(comb_vendor_id);
                    let vrefund_vtrxn_id = null;
                    let vrefund_acctrxn_id = null;
                    if (vrefund_payment_type === 'ADJUST') {
                        let vendorRefundTrxnNote = `TOTAL FARE ${vrefund_amount}/- 
          REFUND CHARGE ${vrefund_charge}/-
          ADJUST AMOUNT ${vrefund_return_amount}/-`;
                        const VTrxnBody = {
                            comb_vendor: comb_vendor_id,
                            vtrxn_amount: vrefund_return_amount,
                            vtrxn_created_at: date,
                            vtrxn_note: vendorRefundTrxnNote,
                            vtrxn_particular_id: 110,
                            vtrxn_particular_type: 'OTHER REFUND(ADJUST)',
                            vtrxn_type: 'CREDIT',
                            vtrxn_user_id: created_by,
                            vtrxn_voucher: other_vouchar_number,
                            vtrxn_airticket_no: ticket_no,
                            vtrxn_pax: pax_name,
                            vtrxn_pnr: ticket_pnr,
                            vtrxn_route: airticket_route,
                        };
                        vrefund_vtrxn_id = yield trxns.VTrxnInsert(VTrxnBody);
                    }
                    else {
                        if (payment_method !== 4) {
                            let accPayType = (0, lib_1.getPaymentType)(payment_method);
                            const ACTrxnBody = {
                                acctrxn_ac_id: vrefund_account_id,
                                acctrxn_type: 'CREDIT',
                                acctrxn_amount: vrefund_return_amount,
                                acctrxn_created_at: date,
                                acctrxn_voucher: other_vouchar_number,
                                acctrxn_created_by: created_by,
                                acctrxn_note: note,
                                acctrxn_particular_id: 110,
                                acctrxn_particular_type: 'VENDOR OTHER REFUND(MONEY RETURN)',
                                acctrxn_pay_type: accPayType,
                            };
                            vrefund_acctrxn_id = yield trxns.AccTrxnInsert(ACTrxnBody);
                            let vendorRefundTrxnNote = `Net total : ${vrefund_amount}/- 
            Return amount : ${vrefund_return_amount}/-
            Refund charge : ${vrefund_charge}/-`;
                            const VTrxnBody = {
                                comb_vendor: comb_vendor_id,
                                vtrxn_amount: vrefund_return_amount,
                                vtrxn_created_at: date,
                                vtrxn_note: vendorRefundTrxnNote,
                                vtrxn_particular_id: 110,
                                vtrxn_particular_type: 'OTHER REFUND(MONEY RETURN)',
                                vtrxn_type: 'CREDIT',
                                vtrxn_user_id: created_by,
                                vtrxn_voucher: other_vouchar_number,
                                vtrxn_airticket_no: ticket_no,
                                vtrxn_pax: pax_name,
                                vtrxn_pnr: ticket_pnr,
                                vtrxn_route: airticket_route,
                            };
                            vrefund_vtrxn_id = yield trxns.VTrxnInsert(VTrxnBody);
                        }
                        else {
                            // for cheque...
                        }
                    }
                    const remaining_quantity = billing_remaining_quantity - vrefund_quantity;
                    yield conn.updateRemainingQty(invoice_id, vrefund_invoice_category_id, remaining_quantity);
                    const refundOtherVendor = Object.assign(Object.assign(Object.assign({ vrefund_refund_id: refund_id }, (vendor_id && { vrefund_vendor_id: vendor_id })), (combined_id && {
                        vrefund_vendor_combined_id: combinedId,
                    })), { vrefund_vtrxn_id: vrefund_vtrxn_id, 
                        // vrefund_charge_vtrxn_id: vrefund_charge_vtrxn_id as number,
                        vrefund_payment_type, vrefund_account_id: vrefund_account_id, vrefund_acctrxn_id: vrefund_acctrxn_id, vrefund_moneyreturn_type: payment_method, vrefund_moneyreturn_account_id: account_id, vrefund_invoice_id: invoice_id, vrefund_product_id: vrefund_product_id, vrefund_quantity: vrefund_quantity, vrefund_charge: vrefund_charge, vrefund_amount: vrefund_amount, vrefund_return_amount, vrefund_client_refund_amount: total_refund_amount, vrefund_client_refund_charge: total_refund_charge, vrefund_vouchar_number: other_vouchar_number, vrefund_bill_id,
                        vrefund_invoice_category_id,
                        vrefund_date });
                    otherClientRefund.push(refundOtherVendor);
                }
                if (otherClientRefund.length) {
                    yield conn.refundOtherVendor(otherClientRefund);
                }
                yield conn.updateInvoiceIsRefund(invoice_id, 1);
                yield this.insertAudit(req, 'delete', `REFUNDED INVOICE OTHER, VOUCHER ${other_vouchar_number}, BDT ${total_refund_amount}/-, RETURN BDT ${total_return_amount}/-`, created_by, 'REFUND');
                return {
                    success: true,
                    message: 'Other refund has been created successfully',
                    refund_id,
                };
            }));
        });
    }
}
exports.default = AddOtherRefund;
//# sourceMappingURL=addOtherRefund.js.map