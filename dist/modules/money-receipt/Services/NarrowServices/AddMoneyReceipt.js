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
const CommonSmsSend_services_1 = __importDefault(require("../../../smsSystem/utils/CommonSmsSend.services"));
const lib_1 = require("../../../../common/utils/libraries/lib");
class AddMoneyReceipt extends abstract_services_1.default {
    constructor() {
        super();
        this.addMoneyReceipt = (req) => __awaiter(this, void 0, void 0, function* () {
            const { receipt_combclient, receipt_payment_to, receipt_total_amount, receipt_money_receipt_no, receipt_payment_type, receipt_payment_date, receipt_note, cheque_number, cheque_withdraw_date, cheque_bank_name, account_id, receipt_created_by, invoices, tickets, charge_amount, receipt_total_discount, trans_no, receipt_walking_customer_name, } = req.body;
            const { client_id, combined_id } = (0, common_helper_1.separateCombClientToId)(receipt_combclient);
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.MoneyReceiptModels(req, trx);
                const common_conn = this.models.CommonInvoiceModel(req, trx);
                const trxns = new Trxns_1.default(req, trx);
                const receipt_vouchar_no = yield this.generateVoucher(req, 'MR');
                const receipt_payment_status = receipt_payment_type === 4 ? 'PENDING' : 'SUCCESS';
                // @RECEIPT_ID
                let receipt_actransaction_id;
                let client_trxn_id = null;
                let online_charge_purpuse = 'Money receipt';
                const amount_after_discount = Number(receipt_total_amount) - Number(receipt_total_discount) || 0;
                const note = receipt_total_discount
                    ? `Paid ${receipt_total_amount} discount ${receipt_total_discount}, ${receipt_note || ''}`
                    : receipt_note || '';
                const accPayType = (0, lib_1.getPaymentType)(+receipt_payment_type);
                if (receipt_payment_type !== 4) {
                    const AccTrxnBody = {
                        acctrxn_ac_id: account_id,
                        acctrxn_type: 'CREDIT',
                        acctrxn_voucher: receipt_vouchar_no,
                        acctrxn_amount: amount_after_discount,
                        acctrxn_created_at: receipt_payment_date,
                        acctrxn_created_by: receipt_created_by,
                        acctrxn_note: note,
                        acctrxn_particular_id: 2,
                        acctrxn_particular_type: 'Money receipt',
                        acctrxn_pay_type: accPayType,
                    };
                    receipt_actransaction_id = yield trxns.AccTrxnInsert(AccTrxnBody);
                    const clTrxnBody = {
                        ctrxn_type: 'CREDIT',
                        ctrxn_amount: receipt_total_amount,
                        ctrxn_cl: receipt_combclient,
                        ctrxn_voucher: receipt_vouchar_no,
                        ctrxn_particular_id: 114,
                        ctrxn_created_at: receipt_payment_date,
                        ctrxn_note: note,
                        ctrxn_particular_type: 'Money Receipt',
                        ctrxn_pay_type: accPayType,
                    };
                    client_trxn_id = yield trxns.clTrxnInsert(clTrxnBody);
                }
                let receipt_trxn_charge_id = null;
                if (receipt_payment_type === 3 && charge_amount) {
                    const online_charge_trxn = {
                        charge_to_acc_id: account_id,
                        charge_from_client_id: client_id,
                        charge_from_ccombined_id: combined_id,
                        charge_amount: charge_amount,
                        charge_purpose: online_charge_purpuse,
                        charge_note: receipt_note,
                    };
                    receipt_trxn_charge_id = yield this.models
                        .vendorModel(req, trx)
                        .insertOnlineTrxnCharge(online_charge_trxn);
                }
                const receiptInfo = {
                    receipt_trnxtype_id: 2,
                    receipt_vouchar_no,
                    receipt_client_id: client_id,
                    receipt_combined_id: combined_id,
                    receipt_actransaction_id,
                    receipt_payment_to,
                    receipt_total_amount: Number(receipt_total_amount),
                    receipt_total_discount,
                    receipt_money_receipt_no,
                    receipt_payment_type,
                    receipt_payment_date,
                    receipt_ctrxn_id: client_trxn_id,
                    receipt_note,
                    receipt_account_id: account_id,
                    receipt_created_by,
                    receipt_payment_status,
                    receipt_trxn_charge: charge_amount,
                    receipt_trxn_charge_id,
                    receipt_trxn_no: trans_no,
                    receipt_walking_customer_name,
                };
                const receipt_id = yield conn.insertMoneyReceipt(receiptInfo);
                // money receipt to invoice
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
                        const history_data = {
                            history_activity_type: 'INVOICE_PAYMENT_CREATED',
                            history_invoice_id: invoice.invoice_id,
                            history_created_by: receipt_created_by,
                            history_invoice_payment_amount: invoice.invoice_amount,
                            invoicelog_content: `Payment added to Invoice (Amount = ${invoice.invoice_amount})/-`,
                        };
                        yield common_conn.insertInvoiceHistory(history_data);
                        online_charge_purpuse = 'Money receipt to specific invoice';
                    }
                }
                // money receipt to ticket
                else if (receipt_payment_to === 'TICKET') {
                    for (const ticket of tickets) {
                        const { invoice_amount, invoice_id, ticket_no } = ticket;
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
                        const history_data = {
                            history_activity_type: 'INVOICE_PAYMENT_CREATED',
                            history_invoice_id: invoice_id,
                            history_created_by: receipt_created_by,
                            history_invoice_payment_amount: invoice_amount,
                            invoicelog_content: 'Money receipt hass been deleted',
                        };
                        yield common_conn.insertInvoiceHistory(history_data);
                        online_charge_purpuse = 'Money receipt to specific ticket';
                    }
                }
                // money receipt to overall
                else if (receipt_payment_to === 'OVERALL') {
                    const cl_due = yield conn.getInvoicesIdAndAmount(client_id, combined_id);
                    let paidAmountNow = 0;
                    for (const item of cl_due) {
                        const { invoice_id, total_due } = item;
                        const availableAmount = Number(receipt_total_amount) - paidAmountNow;
                        const payment_amount = availableAmount >= total_due ? total_due : availableAmount;
                        const invoiceClientPaymentInfo = {
                            invclientpayment_moneyreceipt_id: receipt_id,
                            invclientpayment_invoice_id: invoice_id,
                            invclientpayment_client_id: client_id,
                            invclientpayment_cltrxn_id: client_trxn_id,
                            invclientpayment_amount: payment_amount,
                            invclientpayment_date: receipt_payment_date,
                            invclientpayment_collected_by: receipt_created_by,
                            invclientpayment_combined_id: combined_id,
                        };
                        yield conn.insertInvoiceClPay(invoiceClientPaymentInfo);
                        const history_data = {
                            history_activity_type: 'INVOICE_PAYMENT_CREATED',
                            history_invoice_id: invoice_id,
                            history_created_by: receipt_created_by,
                            history_invoice_payment_amount: payment_amount,
                            invoicelog_content: `CLIENT PAYMENT FOR OVERALL BDT ${payment_amount}/-`,
                        };
                        yield common_conn.insertInvoiceHistory(history_data);
                        paidAmountNow += payment_amount;
                        if (total_due >= availableAmount) {
                            break;
                        }
                        else {
                            continue;
                        }
                    }
                    online_charge_purpuse = 'Money receipt to overall';
                }
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
                const smsInvoiceDate = {
                    invoice_client_id: client_id,
                    invoice_combined_id: combined_id,
                    invoice_sales_date: receipt_payment_date,
                    invoice_created_by: receipt_created_by,
                    receipt_id,
                };
                yield new CommonSmsSend_services_1.default().sendSms(req, smsInvoiceDate, trx);
                yield this.insertAudit(req, 'create', `ADDED MONEY RECEIPT ,VOUCHER ${receipt_vouchar_no}, BDT ${receipt_total_amount}/- `, receipt_created_by, 'MONEY_RECEIPT');
                yield this.updateVoucher(req, 'MR');
                return {
                    success: true,
                    data: {
                        message: 'Money Receipt Added Successfully...',
                        receipt_id,
                    },
                };
            }));
        });
    }
}
exports.default = AddMoneyReceipt;
//# sourceMappingURL=AddMoneyReceipt.js.map