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
const lib_1 = require("../../../../common/utils/libraries/lib");
class EditMoneyReceipt extends abstract_services_1.default {
    constructor() {
        super();
        this.editMoneyReceipt = (req) => __awaiter(this, void 0, void 0, function* () {
            const receipt_id = req.params.id;
            const { receipt_combclient, receipt_payment_to, receipt_total_amount, receipt_total_discount, receipt_money_receipt_no, receipt_payment_type, receipt_payment_date, receipt_note, cheque_number, cheque_withdraw_date, cheque_bank_name, account_id, receipt_created_by, invoices, tickets, charge_amount, trans_no, receipt_walking_customer_name, received_by, } = req.body;
            const { client_id, combined_id } = (0, common_helper_1.separateCombClientToId)(receipt_combclient);
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.MoneyReceiptModels(req, trx);
                const common_conn = this.models.CommonInvoiceModel(req, trx);
                const vendor_conn = this.models.vendorModel(req, trx);
                const trxns = new Trxns_1.default(req, trx);
                const previousBillingData = yield conn.getPreviousPaidAmount(receipt_id);
                const receipt_payment_status = receipt_payment_type === 4 ? 'PENDING' : 'SUCCESS';
                let acc_trxn_id;
                let acc_transaction_amount = Number(receipt_total_amount);
                let client_trxn_id;
                let trans_particular = 'MONEY RECEIPT';
                const amount_after_discount = Number(receipt_total_amount) - Number(receipt_total_discount) || 0;
                const note = receipt_total_discount
                    ? `Paid ${receipt_total_amount} discount ${receipt_total_discount}, ${receipt_note || ''}`
                    : receipt_note || '';
                if (receipt_payment_type !== 4) {
                    let accPayType = (0, lib_1.getPaymentType)(receipt_payment_type);
                    const AccTrxnBody = {
                        acctrxn_ac_id: account_id,
                        acctrxn_type: 'CREDIT',
                        acctrxn_amount: amount_after_discount,
                        acctrxn_created_at: receipt_payment_date,
                        acctrxn_created_by: receipt_created_by,
                        acctrxn_note: note,
                        acctrxn_particular_id: 31,
                        acctrxn_pay_type: accPayType,
                        trxn_id: previousBillingData === null || previousBillingData === void 0 ? void 0 : previousBillingData.prevAccTrxnId,
                    };
                    acc_trxn_id = yield trxns.AccTrxnUpdate(AccTrxnBody);
                    const clTrxnBody = {
                        ctrxn_type: 'CREDIT',
                        ctrxn_amount: receipt_total_amount,
                        ctrxn_cl: receipt_combclient,
                        ctrxn_voucher: previousBillingData === null || previousBillingData === void 0 ? void 0 : previousBillingData.receipt_vouchar_no,
                        ctrxn_particular_id: 31,
                        ctrxn_created_at: receipt_payment_date,
                        ctrxn_note: note,
                        ctrxn_trxn_id: previousBillingData === null || previousBillingData === void 0 ? void 0 : previousBillingData.prevClTrxn,
                        ctrxn_pay_type: accPayType,
                        ctrxn_received_by: received_by,
                    };
                    client_trxn_id = yield trxns.clTrxnUpdate(clTrxnBody);
                }
                let receipt_trxn_charge_id = null;
                if (receipt_payment_type === 3 && charge_amount) {
                    if (previousBillingData === null || previousBillingData === void 0 ? void 0 : previousBillingData.receipt_trxn_charge_id) {
                        const online_charge_trxn = {
                            charge_to_acc_id: account_id,
                            charge_from_client_id: client_id,
                            charge_from_ccombined_id: combined_id,
                            charge_amount: charge_amount,
                            charge_purpose: trans_particular,
                            charge_note: receipt_note,
                        };
                        yield vendor_conn.updateOnlineTrxnCharge(online_charge_trxn, previousBillingData.receipt_trxn_charge_id);
                    }
                    else {
                        const online_charge_trxn = {
                            charge_to_acc_id: account_id,
                            charge_from_client_id: client_id,
                            charge_from_ccombined_id: combined_id,
                            charge_amount: charge_amount,
                            charge_purpose: trans_particular,
                            charge_note: receipt_note,
                        };
                        receipt_trxn_charge_id = yield vendor_conn.insertOnlineTrxnCharge(online_charge_trxn);
                    }
                }
                else if ((previousBillingData === null || previousBillingData === void 0 ? void 0 : previousBillingData.receipt_payment_type) === 3 &&
                    receipt_payment_type !== 3 &&
                    previousBillingData.receipt_trxn_charge_id) {
                    yield vendor_conn.deleteOnlineTrxnCharge(previousBillingData.receipt_trxn_charge_id);
                }
                // @RECEIPT_INFO
                const receiptInfo = {
                    receipt_client_id: client_id,
                    receipt_combined_id: combined_id,
                    receipt_actransaction_id: acc_trxn_id,
                    receipt_payment_to,
                    receipt_total_amount: acc_transaction_amount,
                    receipt_total_discount,
                    receipt_money_receipt_no,
                    receipt_payment_type,
                    receipt_payment_date,
                    receipt_ctrxn_id: client_trxn_id,
                    receipt_note,
                    receipt_updated_by: receipt_created_by,
                    receipt_payment_status,
                    receipt_trxn_charge: charge_amount,
                    receipt_trxn_no: trans_no,
                    receipt_trxn_charge_id,
                    receipt_walking_customer_name,
                    receipt_account_id: account_id,
                    receipt_received_by: received_by,
                };
                yield conn.updateMoneyReceipt(receiptInfo, receipt_id);
                // DELETE PREVIOUS INVOCIE CLIENT PAYMENT
                yield conn.deletePrevInvoiceClPay(receipt_id, receipt_created_by);
                yield conn.deletePrevMoneyReceiptChequeInfo(receipt_id, receipt_created_by);
                // @PAYMENT_TO_INVOICE
                if (receipt_payment_to === 'INVOICE') {
                    for (const invoice of invoices) {
                        const invoiceClientPaymentInfo = {
                            invclientpayment_moneyreceipt_id: receipt_id,
                            invclientpayment_invoice_id: invoice.invoice_id,
                            invclientpayment_client_id: client_id,
                            invclientpayment_combined_id: combined_id,
                            invclientpayment_cltrxn_id: client_trxn_id,
                            invclientpayment_amount: invoice.invoice_amount,
                            invclientpayment_date: receipt_payment_date,
                            invclientpayment_collected_by: receipt_created_by,
                        };
                        yield conn.insertInvoiceClPay(invoiceClientPaymentInfo);
                        // @HISTORY
                        const history_data = {
                            history_activity_type: 'INVOICE_PAYMENT_CREATED',
                            history_invoice_id: invoice.invoice_id,
                            history_created_by: receipt_created_by,
                            history_invoice_payment_amount: invoice.invoice_amount,
                            invoicelog_content: `Payment added to Invoice (Amount = ${invoice.invoice_amount})/-`,
                        };
                        yield common_conn.insertInvoiceHistory(history_data);
                    }
                }
                // @PAYMENT_TO_TICKET
                if (receipt_payment_to === 'TICKET') {
                    for (const ticket of tickets) {
                        const { invoice_amount, invoice_id, ticket_no } = ticket;
                        // @INVOICE_CLIENT_PAY
                        const invoiceClientPaymentInfo = {
                            invclientpayment_moneyreceipt_id: receipt_id,
                            invclientpayment_invoice_id: invoice_id,
                            invclientpayment_client_id: client_id,
                            invclientpayment_combined_id: combined_id,
                            invclientpayment_cltrxn_id: client_trxn_id,
                            invclientpayment_amount: invoice_amount,
                            invclientpayment_date: receipt_payment_date,
                            invclientpayment_collected_by: receipt_created_by,
                            invclientpayment_ticket_number: ticket_no,
                        };
                        yield conn.insertInvoiceClPay(invoiceClientPaymentInfo);
                        // @HISTORY
                        const history_data = {
                            history_activity_type: 'INVOICE_PAYMENT_UPDATED',
                            history_invoice_id: invoice_id,
                            history_created_by: receipt_created_by,
                            history_invoice_payment_amount: invoice_amount,
                            invoicelog_content: 'Money receipt has been updated',
                        };
                        yield common_conn.insertInvoiceHistory(history_data);
                    }
                }
                // @OVERALL_PAYMENT
                if (receipt_payment_to === 'OVERALL') {
                    const cl_duew = yield conn.getInvoicesIdAndAmount(client_id, combined_id);
                    let paidAmountNow = 0;
                    for (const item of cl_duew) {
                        const { invoice_id, total_due } = item;
                        const availabeAmount = Number(receipt_total_amount) - paidAmountNow;
                        const peyment_amount = availabeAmount >= total_due ? total_due : availabeAmount;
                        // @INVOICE_CLIENT_PAY
                        const invoiceClientPaymentInfo = {
                            invclientpayment_moneyreceipt_id: receipt_id,
                            invclientpayment_invoice_id: invoice_id,
                            invclientpayment_client_id: client_id,
                            invclientpayment_cltrxn_id: client_trxn_id,
                            invclientpayment_amount: peyment_amount,
                            invclientpayment_date: receipt_payment_date,
                            invclientpayment_collected_by: receipt_created_by,
                            invclientpayment_combined_id: combined_id,
                        };
                        yield conn.insertInvoiceClPay(invoiceClientPaymentInfo);
                        // @HISTORY
                        const history_data = {
                            history_activity_type: 'INVOICE_PAYMENT_UPDATED',
                            history_invoice_id: invoice_id,
                            history_created_by: receipt_created_by,
                            history_invoice_payment_amount: peyment_amount,
                            invoicelog_content: 'Money receipt has been updated',
                        };
                        yield common_conn.insertInvoiceHistory(history_data);
                        paidAmountNow += peyment_amount;
                        if (total_due >= availabeAmount) {
                            break;
                        }
                        else {
                            continue;
                        }
                    }
                }
                // @MONEY_RECEIPTS_CHEQUE_DETAILS
                if (receipt_payment_type === 4) {
                    const moneyReceiptChequeData = {
                        cheque_receipt_id: receipt_id,
                        cheque_number,
                        cheque_withdraw_date,
                        cheque_bank_name,
                        cheque_status: receipt_payment_status,
                    };
                    yield conn.insertMoneyReceiptChequeInfo(moneyReceiptChequeData);
                }
                yield this.insertAudit(req, 'update', `Money receipt has been updated, Voucher - ${receipt_payment_to}, Net - ${receipt_total_amount}/-`, receipt_created_by, 'MONEY_RECEIPT');
                return {
                    success: true,
                    data: 'Money receipt updated successfully...',
                };
            }));
        });
    }
}
exports.default = EditMoneyReceipt;
//# sourceMappingURL=EditMoneyReceipt.js.map