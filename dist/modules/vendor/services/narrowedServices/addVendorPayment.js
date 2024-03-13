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
const invoice_helpers_1 = require("../../../../common/helpers/invoice.helpers");
class AddVendorPayment extends abstract_services_1.default {
    constructor() {
        super();
        this.addVendorPayment = (req) => __awaiter(this, void 0, void 0, function* () {
            const { account_id, created_by, cheque_no, has_refer_passport, note, payment_method_id, payment_amount, vpay_creadit_card_no, payment_date, vpay_receipt, vpaypass_passport_id, vpcheque_withdraw_date, vpcheque_bank_name, online_charge, vendor_ait, invoice_id, vpay_payment_to, specific_inv_vendors, com_vendor, } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.vendorModel(req, trx);
                const trxns = new Trxns_1.default(req, trx);
                let vpay_acctrxn_id = null;
                let online_charge_purpuse = 'Vendor payments';
                const vouchar_no = (0, invoice_helpers_1.generateVoucherNumber)(7, 'VP');
                const totalPayment = Number(payment_amount) + (vendor_ait | 0) + (online_charge | 0);
                // PAYMENT METHOD
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
                if (![4, 5].includes(payment_method_id)) {
                    const AccTrxnBody = {
                        acctrxn_ac_id: account_id,
                        acctrxn_type: 'DEBIT',
                        acctrxn_voucher: vouchar_no,
                        acctrxn_amount: totalPayment,
                        acctrxn_created_at: payment_date,
                        acctrxn_created_by: created_by,
                        acctrxn_note: note,
                        acctrxn_particular_id: 1,
                        acctrxn_particular_type: 'Vendor Payment',
                        acctrxn_pay_type: accPayType,
                    };
                    vpay_acctrxn_id = yield trxns.AccTrxnInsert(AccTrxnBody);
                }
                let online_charge_id = null;
                if ([3, 5, 2].includes(payment_method_id) && online_charge) {
                    const { vendor_id, combined_id } = (0, common_helper_1.separateCombClientToId)(com_vendor);
                    const online_charge_trxn = {
                        charge_to_acc_id: account_id,
                        charge_from_vendor_id: vendor_id,
                        charge_from_vcombined_id: combined_id,
                        charge_amount: online_charge,
                        charge_purpose: online_charge_purpuse,
                        charge_note: note,
                    };
                    online_charge_id = yield conn.insertOnlineTrxnCharge(online_charge_trxn);
                }
                const paymentData = {
                    vpay_invoice_id: invoice_id,
                    vpay_account_id: account_id,
                    vpay_acctrxn_id,
                    created_by,
                    has_refer_passport,
                    note,
                    payment_amount,
                    vpay_creadit_card_no,
                    payment_date,
                    payment_method_id,
                    vouchar_no,
                    vpay_receipt_no: vpay_receipt,
                    online_charge,
                    vendor_ait,
                    vpay_payment_to,
                    online_charge_id,
                };
                const { combined_id, vendor_id } = (0, common_helper_1.separateCombClientToId)(com_vendor);
                (paymentData.vpay_vendor_id = vendor_id),
                    (paymentData.vpay_combined_id = combined_id);
                if (vpay_payment_to === 'VENDOR' &&
                    [1, 2, 3].includes(payment_method_id)) {
                    // VENDOR TRANSACTIONS
                    const VTrxnBody = {
                        comb_vendor: com_vendor,
                        vtrxn_amount: payment_amount,
                        vtrxn_created_at: payment_date,
                        vtrxn_note: note,
                        vtrxn_particular_id: 1,
                        vtrxn_particular_type: 'Vendor Payment',
                        vtrxn_type: combined_id ? 'DEBIT' : 'CREDIT',
                        vtrxn_user_id: created_by,
                        vtrxn_voucher: vouchar_no,
                        vtrxn_pay_type: accPayType,
                    };
                    paymentData.vpay_vtrxn_id = yield trxns.VTrxnInsert(VTrxnBody);
                }
                const vpay_id = yield conn.insertVendorPayment(paymentData);
                if (payment_method_id === 4) {
                    const vpayChackDetails = {
                        vpcheque_amount: payment_amount,
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
                online_charge_purpuse = 'Vendor payment to specific vendor';
                if (vpay_payment_to === 'INVOICE') {
                    online_charge_purpuse = 'Vendor payment to specific invoice';
                    for (const item of specific_inv_vendors) {
                        const { comb_vendor_specific_invoice: comb_vendor, specific_inv_amount: purchase_price, } = item;
                        const { vendor_id, combined_id } = (0, common_helper_1.separateCombClientToId)(comb_vendor);
                        let vtrxn_id;
                        if ([1, 2, 3].includes(payment_method_id)) {
                            // VENDOR TRANSACTIONS
                            const VTrxnBody = {
                                comb_vendor,
                                vtrxn_amount: purchase_price,
                                vtrxn_created_at: payment_date,
                                vtrxn_note: note,
                                vtrxn_particular_id: 1,
                                vtrxn_particular_type: 'Vendor Payment',
                                vtrxn_type: combined_id ? 'DEBIT' : 'CREDIT',
                                vtrxn_user_id: created_by,
                                vtrxn_voucher: vouchar_no,
                            };
                            vtrxn_id = yield trxns.VTrxnInsert(VTrxnBody);
                        }
                        else {
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
                    yield conn.insertVendorPaymentPassport(paymentPassportData);
                }
                // insert audit
                const message = `Payment added to Vendor (acc_last_balance = ${payment_amount})/-`;
                yield this.insertAudit(req, 'create', message, created_by, 'VENDOR_PAYMENT');
                return { success: true, message, vpay_id };
            }));
        });
    }
}
exports.default = AddVendorPayment;
//# sourceMappingURL=addVendorPayment.js.map