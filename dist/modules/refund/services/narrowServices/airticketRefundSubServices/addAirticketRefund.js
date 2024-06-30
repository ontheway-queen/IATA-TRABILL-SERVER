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
class AddAirTicketRefund extends abstract_services_1.default {
    constructor() {
        super();
        this.addAirTicketRefund = (req) => __awaiter(this, void 0, void 0, function* () {
            const { client_refund_info, vendor_refund_info, invoice_id, comb_client, created_by, adjust_discount, date, note, } = req.body;
            const totalVReturnAmount = vendor_refund_info.reduce((total, item) => total + Number(item.vrefund_return_amount || 0), 0);
            const crefund_profit = totalVReturnAmount -
                Number(client_refund_info.crefund_return_amount || 0);
            const { client_id, combined_id } = (0, common_helper_1.separateCombClientToId)(comb_client);
            const voucher_number = (0, invoice_helpers_1.generateVoucherNumber)(4, 'ARF');
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.refundModel(req, trx);
                const mr_conn = this.models.MoneyReceiptModels(req, trx);
                const common_conn = this.models.CommonInvoiceModel(req, trx);
                const vendor_conn = this.models.vendorModel(req, trx);
                const air_tkt_conn = this.models.invoiceAirticketModel(req, trx);
                const trxns = new Trxns_1.default(req, trx);
                const { invoice_payment } = yield conn.getInvoiceDuePayment(invoice_id);
                const { crefund_charge_amount, crefund_payment_type, crefund_total_amount, payment_method, crefund_return_amount, crefund_account_id, trxn_charge_amount, crefund_note, } = client_refund_info;
                // get air ticket info
                let airtickerPnr = [];
                let airticketRoute = [];
                let passportName = [];
                let airticketNo = [];
                let return_vendor_price = 0;
                let return_client_price = 0;
                let return_profit = 0;
                // Assuming vendor_refund_info is an array
                yield Promise.all(vendor_refund_info.map((item) => __awaiter(this, void 0, void 0, function* () {
                    const { airticket_pnr, airticket_routes, passport_name, airticket_ticket_no, airticket_client_price, airticket_purchase_price, } = yield conn.getAitRefundInfo(item.airticket_id, item.invoice_category_id);
                    airtickerPnr = airtickerPnr.concat(airticket_pnr);
                    airticketRoute = airticketRoute.concat(airticket_routes);
                    passportName = passportName.concat(passport_name);
                    airticketNo = airticketNo.concat(airticket_ticket_no);
                    return_vendor_price += (0, lib_1.numRound)(airticket_client_price);
                    return_client_price += (0, lib_1.numRound)(airticket_purchase_price);
                    return_profit +=
                        (0, lib_1.numRound)(airticket_client_price) -
                            (0, lib_1.numRound)(airticket_purchase_price);
                })));
                const previousInv = yield air_tkt_conn.getInvoiceData(invoice_id);
                // UPDATED VOID INFORMATION
                const invInfo = {
                    invoice_id,
                    invoice_sub_total: (0, lib_1.numRound)(previousInv.invoice_sub_total) - return_client_price,
                    invoice_discount: (0, lib_1.numRound)(previousInv.invoice_discount) - (0, lib_1.numRound)(adjust_discount),
                    invoice_net_total: (0, lib_1.numRound)(previousInv.invoice_net_total) - (0, lib_1.numRound)(adjust_discount),
                    invoice_total_vendor_price: (0, lib_1.numRound)(previousInv.invoice_total_vendor_price) -
                        return_vendor_price,
                    invoice_total_profit: (0, lib_1.numRound)(previousInv.invoice_total_profit) - return_profit,
                };
                yield common_conn.updateIsVoid(invInfo);
                let atrefund_trxn_charge_id = null;
                // TRANSACTION CHARGE FOR MOBILE BANKING
                if (payment_method === 3 && trxn_charge_amount) {
                    const online_charge_trxn = {
                        charge_from_acc_id: crefund_account_id,
                        charge_to_client_id: client_id,
                        charge_to_combined_id: combined_id,
                        charge_amount: trxn_charge_amount,
                        charge_purpose: `Invoice Air Ticket Refund Client`,
                        charge_note: note,
                    };
                    atrefund_trxn_charge_id = yield vendor_conn.insertOnlineTrxnCharge(online_charge_trxn);
                }
                const refundInfo = {
                    atrefund_invoice_id: invoice_id,
                    atrefund_client_id: client_id,
                    atrefund_combined_id: combined_id,
                    atrefund_created_by: created_by,
                    atrefund_date: date,
                    atrefund_vouchar_number: voucher_number,
                    atrefund_trxn_charge: trxn_charge_amount,
                    atrefund_trxn_charge_id,
                    atrefund_note: note,
                };
                const refund_id = yield conn.insertAirTicketRefund(refundInfo);
                // ============ client refund
                let crefund_ctrxnid = null;
                let crefund_charge_ctrxnid = null;
                let crefund_actransaction_id = null;
                const cl_return_amount = (0, lib_1.numRound)(crefund_total_amount) - (0, lib_1.numRound)(crefund_charge_amount);
                if (crefund_payment_type === 'ADJUST') {
                    const ctrxn_note = `REFUND TOTAL ${crefund_total_amount}/- \nREFUND CHARGE ${crefund_charge_amount}/-\nRETURN AMOUNT ${cl_return_amount}/-`;
                    const clTrxnBody = {
                        ctrxn_type: 'CREDIT',
                        ctrxn_amount: crefund_total_amount,
                        ctrxn_cl: comb_client,
                        ctrxn_voucher: voucher_number,
                        ctrxn_particular_id: 19,
                        ctrxn_created_at: date,
                        ctrxn_note,
                        ctrxn_pnr: airtickerPnr.join(', '),
                        ctrxn_airticket_no: airticketNo.join(', '),
                        ctrxn_pax: passportName.join(', '),
                        ctrxn_route: airticketRoute.join(', '),
                    };
                    crefund_ctrxnid = yield trxns.clTrxnInsert(clTrxnBody);
                    const clRefundChargeTrxnBody = {
                        ctrxn_type: 'DEBIT',
                        ctrxn_amount: crefund_charge_amount,
                        ctrxn_cl: comb_client,
                        ctrxn_voucher: voucher_number,
                        ctrxn_particular_id: 19,
                        ctrxn_created_at: date,
                        ctrxn_note: 'CHARGE',
                        ctrxn_pnr: airtickerPnr.join(', '),
                        ctrxn_airticket_no: airticketNo.join(', '),
                        ctrxn_pax: passportName.join(', '),
                        ctrxn_route: airticketRoute.join(', '),
                    };
                    if (crefund_charge_amount > 0) {
                        crefund_charge_ctrxnid = yield trxns.clTrxnInsert(clRefundChargeTrxnBody);
                    }
                    // INVOICE CLIENT PAYMENT
                    const cl_due = yield mr_conn.getInvoicesIdAndAmount(client_id, combined_id);
                    let paidAmountNow = 0;
                    for (const item of cl_due) {
                        const { invoice_id, total_due } = item;
                        const availableAmount = cl_return_amount - paidAmountNow;
                        const payment_amount = availableAmount >= total_due ? total_due : availableAmount;
                        const invClPay = {
                            invclientpayment_moneyreceipt_id: null,
                            invclientpayment_amount: payment_amount,
                            invclientpayment_invoice_id: invoice_id,
                            invclientpayment_client_id: client_id,
                            invclientpayment_combined_id: combined_id,
                            invclientpayment_purpose: voucher_number,
                            invclientpayment_rf_type: 'AIT',
                            invclientpayment_rf_id: refund_id,
                        };
                        yield common_conn.insertAdvanceMr(invClPay);
                        paidAmountNow += payment_amount;
                        if (total_due >= availableAmount) {
                            break;
                        }
                        else {
                            continue;
                        }
                    }
                }
                // MONEY RETURN
                else {
                    if (payment_method !== 4) {
                        let return_amount = 0;
                        let client_adjust_amount = 0;
                        // FULL PAYMENT OR FULL MONEY RECEIPT
                        if (invoice_payment >= crefund_total_amount) {
                            return_amount = crefund_return_amount;
                        }
                        // HAVE INVOICE DUE
                        else if (invoice_payment < crefund_total_amount) {
                            return_amount = invoice_payment - crefund_charge_amount;
                            client_adjust_amount = crefund_total_amount - invoice_payment;
                        }
                        let accPayType = (0, lib_1.getPaymentType)(payment_method);
                        let clientRefundTrxnNote = `Net total : ${crefund_total_amount}/- 
          Money return : ${return_amount}/-
          Refund charge : ${crefund_charge_amount}/-`;
                        if (client_adjust_amount) {
                            clientRefundTrxnNote += `\nAdjust amount : ${client_adjust_amount}/-`;
                        }
                        if (return_amount > 0) {
                            const ACTrxnBody = {
                                acctrxn_ac_id: crefund_account_id,
                                acctrxn_type: 'DEBIT',
                                acctrxn_voucher: voucher_number,
                                acctrxn_amount: return_amount,
                                acctrxn_created_at: date,
                                acctrxn_created_by: created_by,
                                acctrxn_note: clientRefundTrxnNote || crefund_note,
                                acctrxn_particular_id: 20,
                                acctrxn_pay_type: accPayType,
                            };
                            crefund_actransaction_id = yield trxns.AccTrxnInsert(ACTrxnBody);
                        }
                        const clTrxnBody = {
                            ctrxn_type: 'CREDIT',
                            ctrxn_amount: client_adjust_amount,
                            ctrxn_cl: comb_client,
                            ctrxn_voucher: voucher_number,
                            ctrxn_particular_id: 20,
                            ctrxn_created_at: date,
                            ctrxn_note: clientRefundTrxnNote,
                            ctrxn_pnr: airtickerPnr.join(', '),
                            ctrxn_airticket_no: airticketNo.join(', '),
                            ctrxn_pax: passportName.join(', '),
                            ctrxn_route: airticketRoute.join(', '),
                            ctrxn_pay_type: accPayType,
                        };
                        crefund_ctrxnid = yield trxns.clTrxnInsert(clTrxnBody);
                    }
                    else {
                        // create here for cheque...
                    }
                }
                const airticketClientRefund = {
                    crefund_charge_amount,
                    crefund_date: date,
                    crefund_payment_type,
                    crefund_total_amount,
                    crefund_client_id: client_id,
                    crefund_combined_id: combined_id,
                    crefund_ctrxnid,
                    crefund_charge_ctrxnid,
                    crefund_return_amount,
                    crefund_actransaction_id,
                    crefund_account_id,
                    crefund_refund_id: refund_id,
                    crefund_profit,
                };
                yield conn.insertAirticketClientRefund(airticketClientRefund);
                // airticket vendor refund
                const airticketVendorRefunds = [];
                for (const item of vendor_refund_info) {
                    const { vrefund_account_id, airticket_id, airticket_combvendor, vrefund_total_amount, vrefund_charge_amount, vrefund_payment_type, vrefund_return_amount, invoice_category_id, payment_method, } = item;
                    const { vendor_id, combined_id } = (0, common_helper_1.separateCombClientToId)(airticket_combvendor);
                    const { airticket_pnr, airticket_routes, passport_name, airticket_ticket_no, } = yield conn.getAitRefundInfo(item.airticket_id, item.invoice_category_id);
                    let vrefund_vtrxn_id = null;
                    let vrefund_charge_vtrxn_id = null;
                    let vrefund_acctrxn_id = null;
                    if (vrefund_payment_type === 'ADJUST') {
                        let vendorRefundTrxnNote = `Net total : ${vrefund_total_amount}/- 
          Adjust amount : ${vrefund_return_amount}/-
          Refund charge : ${vrefund_charge_amount}/-`;
                        const VTrxnBody = {
                            comb_vendor: airticket_combvendor,
                            vtrxn_amount: vrefund_total_amount,
                            vtrxn_created_at: date,
                            vtrxn_note: vendorRefundTrxnNote,
                            vtrxn_particular_id: 19,
                            vtrxn_type: 'CREDIT',
                            vtrxn_user_id: created_by,
                            vtrxn_voucher: voucher_number,
                            vtrxn_airticket_no: airticket_ticket_no,
                            vtrxn_pax: passport_name,
                            vtrxn_pnr: airticket_pnr,
                            vtrxn_route: airticket_routes,
                        };
                        vrefund_vtrxn_id = yield trxns.VTrxnInsert(VTrxnBody);
                        const vRefundChargeTrxnBody = {
                            comb_vendor: airticket_combvendor,
                            vtrxn_amount: vrefund_charge_amount,
                            vtrxn_created_at: date,
                            vtrxn_note: 'CHARGE',
                            vtrxn_particular_id: 19,
                            vtrxn_type: 'DEBIT',
                            vtrxn_user_id: created_by,
                            vtrxn_voucher: voucher_number,
                            vtrxn_airticket_no: airticket_ticket_no,
                            vtrxn_pax: passport_name,
                            vtrxn_pnr: airticket_pnr,
                            vtrxn_route: airticket_routes,
                        };
                        vrefund_charge_vtrxn_id = yield trxns.VTrxnInsert(vRefundChargeTrxnBody);
                    }
                    // VENDOR MONEY RETURN
                    else {
                        if (payment_method !== 4) {
                            const total_vendor_pay = yield conn.getInvoiceVendorPaymentByVendor(invoice_id, vendor_id, combined_id);
                            let vendor_return_amount = 0;
                            let vendor_adjust_amount = 0;
                            // FULL PAYMENT
                            if (total_vendor_pay >= vrefund_total_amount) {
                                vendor_return_amount = vrefund_return_amount;
                            }
                            // HAVE INVOICE DUE
                            else if (total_vendor_pay < vrefund_total_amount) {
                                vendor_return_amount = total_vendor_pay - vrefund_charge_amount;
                                vendor_adjust_amount = vrefund_total_amount - total_vendor_pay;
                            }
                            let accPayType = (0, lib_1.getPaymentType)(payment_method);
                            let vendorRefundTrxnNote = `Net total : ${vrefund_total_amount}/- 
            Return amount : ${vrefund_return_amount}/-
            Refund charge : ${vrefund_charge_amount}/-`;
                            if (vendor_adjust_amount) {
                                vendorRefundTrxnNote += `\nAdjust amount : ${vendor_adjust_amount}/-`;
                            }
                            const ACTrxnBody = {
                                acctrxn_ac_id: crefund_account_id,
                                acctrxn_type: 'CREDIT',
                                acctrxn_amount: vendor_return_amount,
                                acctrxn_created_at: date,
                                acctrxn_voucher: voucher_number,
                                acctrxn_created_by: created_by,
                                acctrxn_note: vendorRefundTrxnNote,
                                acctrxn_particular_id: 20,
                                acctrxn_pay_type: accPayType,
                            };
                            vrefund_acctrxn_id = yield trxns.AccTrxnInsert(ACTrxnBody);
                            const VTrxnBody = {
                                comb_vendor: airticket_combvendor,
                                vtrxn_amount: vendor_adjust_amount,
                                vtrxn_created_at: date,
                                vtrxn_note: vendorRefundTrxnNote,
                                vtrxn_particular_id: 20,
                                vtrxn_type: 'CREDIT',
                                vtrxn_user_id: created_by,
                                vtrxn_voucher: voucher_number,
                                vtrxn_airticket_no: airticket_ticket_no,
                                vtrxn_pax: passport_name,
                                vtrxn_pnr: airticket_pnr,
                                vtrxn_route: airticket_routes,
                                vtrxn_pay_type: accPayType,
                            };
                            vrefund_vtrxn_id = yield trxns.VTrxnInsert(VTrxnBody);
                        }
                        else {
                            // cheque create for vendor return amount...
                        }
                    }
                    // update invoice is refund
                    yield conn.updateAirticketItemIsRefund(airticket_id, invoice_category_id, 1);
                    const airticketVendorRefund = {
                        vrefund_refund_id: refund_id,
                        vrefund_airticket_id: airticket_id,
                        vrefund_category_id: invoice_category_id,
                        vrefund_charge_amount,
                        vrefund_created_by: created_by,
                        vrefund_date: date,
                        vrefund_payment_type,
                        vrefund_return_amount,
                        vrefund_total_amount,
                        vrefund_vendor_combined_id: combined_id,
                        vrefund_vendor_id: vendor_id,
                        vrefund_vtrxn_id,
                        vrefund_charge_vtrxn_id,
                        vrefund_account_id,
                        vrefund_acctrxn_id,
                        vrefund_tkt_cl_discount: item.adjust_client_discount,
                    };
                    airticketVendorRefunds.push(airticketVendorRefund);
                }
                yield conn.updateInvoiceAirticketIsRefund(invoice_id, 1);
                if (airticketClientRefund) {
                    yield conn.insertVendorRefundInfo(airticketVendorRefunds);
                }
                // invoice history
                const history_data = {
                    history_activity_type: 'INVOICE_REFUNDED',
                    history_invoice_id: invoice_id,
                    history_created_by: req.user_id,
                    invoicelog_content: `REFUND INVOICE VOUCHER ${voucher_number} RETURN BDT ${cl_return_amount}/-`,
                };
                yield common_conn.insertInvoiceHistory(history_data);
                // insert audit
                const audit_content = `REFUNDED AIR TICKET, VOUCHER ${voucher_number}, BDT ${crefund_total_amount}/-, RETURN BDT ${crefund_return_amount}/-`;
                yield this.insertAudit(req, 'create', audit_content, created_by, 'REFUND');
                return {
                    success: true,
                    message: audit_content,
                    refund_id,
                };
            }));
        });
    }
}
exports.default = AddAirTicketRefund;
//# sourceMappingURL=addAirticketRefund.js.map