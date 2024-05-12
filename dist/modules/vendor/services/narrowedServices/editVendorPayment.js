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
const Trxns_1 = __importDefault(require("../../../../common/helpers/Trxns"));
const common_helper_1 = require("../../../../common/helpers/common.helper");
class EditVendorPayment extends abstract_services_1.default {
    constructor() {
        super();
        this.editVendorPayment = (req) => __awaiter(this, void 0, void 0, function* () {
            const vpay_id = Number(req.params.id);
            const { account_id, created_by, cheque_no, has_refer_passport, note, payment_method_id, payment_amount, vpay_creadit_card_no, payment_date, vpay_receipt, vpaypass_passport_id, vpcheque_withdraw_date, vpcheque_bank_name, online_charge, vendor_ait, invoice_id, com_vendor, specific_inv_vendors, } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.vendorModel(req, trx);
                const trxns = new Trxns_1.default(req, trx);
                // previous transactions
                const { invoice_vendor_pay, vendor_pay_data } = yield conn.getPreviousPaymentAmount(vpay_id);
                yield conn.deleteInvoiceVendorPaymentPermanent(vpay_id, created_by);
                const { prevAccTrxnId, prevPayMethod, prevVendorTrxn, vpay_payment_to, vouchar_no, online_charge_id: prev_online_charge_id, } = vendor_pay_data;
                //  current transaction and update data
                const totalPayment = Number(payment_amount) + (vendor_ait | 0);
                let online_charge_id = null;
                if ([3, 5, 2].includes(payment_method_id) && online_charge) {
                    const { vendor_id, combined_id } = (0, common_helper_1.separateCombClientToId)(com_vendor);
                    if (prev_online_charge_id) {
                        yield conn.updateOnlineTrxnCharge({ charge_amount: online_charge, charge_purpose: 'Vendor Payment' }, prev_online_charge_id);
                    }
                    else {
                        const online_charge_trxn = {
                            charge_to_acc_id: account_id,
                            charge_from_vendor_id: vendor_id,
                            charge_from_vcombined_id: combined_id,
                            charge_amount: online_charge,
                            charge_purpose: 'Vendor Payment',
                            charge_note: note,
                        };
                        online_charge_id = yield conn.insertOnlineTrxnCharge(online_charge_trxn);
                    }
                }
                else if (![3, 5, 2].includes(payment_method_id) &&
                    [3, 5, 2].includes(prevPayMethod) &&
                    prev_online_charge_id) {
                    yield conn.deleteOnlineTrxnCharge(prev_online_charge_id);
                }
                const paymentData = {
                    vpay_invoice_id: invoice_id,
                    vpay_account_id: account_id,
                    created_by,
                    has_refer_passport,
                    note,
                    payment_amount,
                    vpay_creadit_card_no,
                    payment_date,
                    payment_method_id,
                    vpay_receipt_no: vpay_receipt,
                    online_charge,
                    vendor_ait,
                    vpay_payment_to,
                    online_charge_id,
                };
                const { combined_id, vendor_id } = (0, common_helper_1.separateCombClientToId)(com_vendor);
                let accPayType;
                if (payment_method_id === 1) {
                    accPayType = 'CASH';
                }
                else if (payment_method_id === 2) {
                    accPayType = 'BANK';
                }
                else if (payment_method_id === 3) {
                    accPayType = 'MOBILE BANKING';
                }
                else {
                    accPayType = 'CASH';
                }
                if (![4, 5].includes(prevPayMethod) &&
                    ![4, 5].includes(payment_method_id)) {
                    const AccTrxnBody = {
                        acctrxn_ac_id: account_id,
                        acctrxn_type: 'DEBIT',
                        acctrxn_voucher: vouchar_no,
                        acctrxn_amount: totalPayment,
                        acctrxn_created_at: payment_date,
                        acctrxn_created_by: created_by,
                        acctrxn_note: note,
                        acctrxn_particular_id: 1,
                        acctrxn_particular_type: 'Vendor payment',
                        acctrxn_pay_type: accPayType,
                        trxn_id: prevAccTrxnId,
                    };
                    yield trxns.AccTrxnUpdate(AccTrxnBody);
                }
                else {
                    if (![4, 5].includes(prevPayMethod)) {
                        yield trxns.deleteAccTrxn(prevAccTrxnId);
                    }
                    if (![4, 5].includes(payment_method_id)) {
                        const VTrxnBody = {
                            comb_vendor: com_vendor,
                            vtrxn_amount: payment_amount,
                            vtrxn_created_at: payment_date,
                            vtrxn_note: note,
                            vtrxn_particular_id: 1,
                            vtrxn_particular_type: 'vendor payment',
                            vtrxn_type: combined_id ? 'DEBIT' : 'CREDIT',
                            vtrxn_user_id: created_by,
                            vtrxn_voucher: vouchar_no,
                            vtrxn_pay_type: accPayType,
                        };
                        paymentData.vpay_vtrxn_id = yield trxns.VTrxnInsert(VTrxnBody);
                    }
                }
                if (vpay_payment_to === 'VENDOR') {
                    const VTrxnUpdateBody = {
                        comb_vendor: com_vendor,
                        vtrxn_amount: payment_amount,
                        vtrxn_created_at: payment_date,
                        vtrxn_note: note,
                        vtrxn_particular_id: 1,
                        vtrxn_particular_type: 'vendor payment',
                        vtrxn_type: combined_id ? 'DEBIT' : 'CREDIT',
                        vtrxn_user_id: created_by,
                        vtrxn_voucher: vouchar_no,
                        trxn_id: prevVendorTrxn,
                    };
                    yield trxns.VTrxnUpdate(VTrxnUpdateBody);
                }
                else if (vpay_payment_to === 'INVOICE') {
                    for (const item of invoice_vendor_pay) {
                        const { prevInvCombVendor, prevInvTrxnId } = item;
                        yield trxns.deleteVTrxn(prevInvTrxnId, prevInvCombVendor);
                    }
                    // delete previous invoice vendor payment
                    yield conn.deleteInvoiceVendorPaymentPermanent(vpay_id, created_by);
                    for (const item of specific_inv_vendors) {
                        const { comb_vendor_specific_invoice, specific_inv_amount: purchase_price, } = item;
                        const { vendor_id, combined_id } = (0, common_helper_1.separateCombClientToId)(comb_vendor_specific_invoice);
                        let vtrxn_id = null;
                        if ([1, 2, 3].includes(prevPayMethod)) {
                            const VTrxnBody = {
                                comb_vendor: comb_vendor_specific_invoice,
                                vtrxn_amount: purchase_price,
                                vtrxn_created_at: payment_date,
                                vtrxn_note: note,
                                vtrxn_particular_id: 1,
                                vtrxn_particular_type: 'vendor payment',
                                vtrxn_type: combined_id ? 'DEBIT' : 'CREDIT',
                                vtrxn_user_id: created_by,
                                vtrxn_voucher: vouchar_no,
                            };
                            vtrxn_id = yield trxns.VTrxnInsert(VTrxnBody);
                        }
                        else if (prevPayMethod === 4) {
                            const vpayChackDetails = {
                                vpcheque_amount: purchase_price,
                                vpcheque_cheque_no: cheque_no,
                                vpcheque_receipt_no: vpay_receipt,
                                vpcheque_vendor_id: vendor_id,
                                vpcheque_combined_id: combined_id,
                                vpcheque_vpay_id: vpay_id,
                                vpcheque_withdraw_date: vpcheque_withdraw_date && vpcheque_withdraw_date.slice(0, 10),
                                vpcheque_bank_name: vpcheque_bank_name,
                            };
                            yield conn.insertVendorPaymentCheque(vpayChackDetails);
                        }
                        const invVendorPaymentData = {
                            invendorpay_vpay_id: vpay_id,
                            invendorpay_vendor_id: vendor_id,
                            invendorpay_combined_id: combined_id,
                            invendorpay_vtrxn_id: vtrxn_id,
                            invendorpay_invoice_id: invoice_id,
                            invendorpay_amount: purchase_price,
                            invendorpay_created_by: created_by,
                        };
                        yield conn.insertInvoiceVendorPayment(invVendorPaymentData);
                    }
                }
                if (has_refer_passport === 'YES') {
                    const paymentPassportData = {
                        vpaypass_vpay_id: vpay_id,
                        vpaypass_passport_id,
                    };
                    yield conn.updateVendorPaymentPassport(paymentPassportData);
                }
                yield conn.updateVendorPayment(paymentData, vpay_id);
                const message = `UPDATED VENDOR PAY, VOUCHER ${vouchar_no}, BDT ${payment_amount}/-`;
                yield this.insertAudit(req, 'update', message, created_by, 'VENDOR_PAYMENT');
                return { success: true, message };
            }));
        });
    }
}
exports.default = EditVendorPayment;
//# sourceMappingURL=editVendorPayment.js.map