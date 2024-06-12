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
const abstract_services_1 = __importDefault(require("../../abstracts/abstract.services"));
const Trxns_1 = __importDefault(require("../helpers/Trxns"));
const invoice_helpers_1 = require("../helpers/invoice.helpers");
const lib_1 = require("../utils/libraries/lib");
class CommonAddMoneyReceipt extends abstract_services_1.default {
    constructor() {
        super();
        this.commonAddMoneyReceipt = (req, invoices, trx) => __awaiter(this, void 0, void 0, function* () {
            const { money_receipt } = req.body;
            if ((0, invoice_helpers_1.isEmpty)(money_receipt) || !(money_receipt === null || money_receipt === void 0 ? void 0 : money_receipt.receipt_total_amount)) {
                return;
            }
            const { invoice_client_id, invoice_combined_id, invoice_created_by, invoice_id, } = invoices;
            const combClient = invoice_client_id
                ? 'client-' + invoice_client_id
                : 'combined-' + invoice_combined_id;
            const { receipt_total_amount, receipt_payment_type, account_id, receipt_money_receipt_no, receipt_note, receipt_payment_date, cheque_number, cheque_withdraw_date, cheque_bank_name, charge_amount, receipt_total_discount, receipt_trxn_no, } = money_receipt;
            return yield this.models.db.transaction(() => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.MoneyReceiptModels(req, trx);
                const common_conn = this.models.CommonInvoiceModel(req, trx);
                const trxns = new Trxns_1.default(req, trx);
                const receipt_vouchar_no = yield this.generateVoucher(req, 'MR');
                const receipt_payment_status = receipt_payment_type === 4 ? 'PENDING' : 'SUCCESS';
                // @RECEIPT_ID
                let receipt_actransaction_id;
                let client_trxn_id = null;
                const amount_after_discount = Number(receipt_total_amount) - (Number(receipt_total_discount) || 0);
                const note = receipt_total_discount
                    ? `Paid ${receipt_total_amount} discount ${receipt_total_discount}, ${receipt_note || ''}`
                    : receipt_note || '';
                if (receipt_payment_type !== 4) {
                    let accPayType = (0, lib_1.getPaymentType)(receipt_payment_type);
                    const AccTrxnBody = {
                        acctrxn_ac_id: account_id,
                        acctrxn_type: 'CREDIT',
                        acctrxn_voucher: receipt_vouchar_no,
                        acctrxn_amount: amount_after_discount,
                        acctrxn_created_at: receipt_payment_date,
                        acctrxn_created_by: invoice_created_by,
                        acctrxn_note: note,
                        acctrxn_particular_id: 2,
                        acctrxn_particular_type: 'Money receipt',
                        acctrxn_pay_type: accPayType,
                    };
                    receipt_actransaction_id = yield trxns.AccTrxnInsert(AccTrxnBody);
                    const clTrxnBody = {
                        ctrxn_type: 'CREDIT',
                        ctrxn_amount: receipt_total_amount,
                        ctrxn_cl: combClient,
                        ctrxn_voucher: receipt_vouchar_no,
                        ctrxn_particular_id: 29,
                        ctrxn_created_at: receipt_payment_date,
                        ctrxn_note: note,
                        ctrxn_particular_type: 'Money Receipt',
                    };
                    client_trxn_id = yield trxns.clTrxnInsert(clTrxnBody);
                }
                let receipt_trxn_charge_id = null;
                if (receipt_payment_type === 3 && charge_amount) {
                    const online_charge_trxn = {
                        charge_to_acc_id: account_id,
                        charge_from_client_id: invoice_client_id,
                        charge_from_ccombined_id: invoice_combined_id,
                        charge_amount: charge_amount,
                        charge_purpose: 'Invoice money receipt',
                        charge_note: receipt_note,
                    };
                    receipt_trxn_charge_id = yield this.models
                        .vendorModel(req, trx)
                        .insertOnlineTrxnCharge(online_charge_trxn);
                }
                const receiptInfo = {
                    receipt_trnxtype_id: 2,
                    receipt_vouchar_no,
                    receipt_client_id: invoice_client_id,
                    receipt_combined_id: invoice_combined_id,
                    receipt_actransaction_id,
                    receipt_payment_to: 'INVOICE',
                    receipt_invoice_id: invoice_id,
                    receipt_total_amount: Number(receipt_total_amount),
                    receipt_total_discount,
                    receipt_money_receipt_no,
                    receipt_payment_type,
                    receipt_payment_date,
                    receipt_ctrxn_id: client_trxn_id,
                    receipt_note,
                    receipt_created_by: invoice_created_by,
                    receipt_payment_status,
                    receipt_trxn_charge: charge_amount,
                    receipt_trxn_charge_id,
                    receipt_account_id: account_id,
                    receipt_trxn_no,
                    receipt_received_by: null,
                };
                const receipt_id = yield conn.insertMoneyReceipt(receiptInfo);
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
                else {
                    const invoiceClientPaymentInfo = {
                        invclientpayment_moneyreceipt_id: receipt_id,
                        invclientpayment_invoice_id: invoice_id,
                        invclientpayment_client_id: invoice_client_id,
                        invclientpayment_combined_id: invoice_combined_id,
                        invclientpayment_cltrxn_id: client_trxn_id,
                        invclientpayment_amount: receipt_total_amount,
                        invclientpayment_date: receipt_payment_date,
                        invclientpayment_collected_by: invoice_created_by,
                    };
                    yield conn.insertInvoiceClPay(invoiceClientPaymentInfo);
                }
                const history_data = {
                    history_activity_type: 'INVOICE_PAYMENT_CREATED',
                    history_invoice_id: invoice_id,
                    history_created_by: invoice_created_by,
                    history_invoice_payment_amount: receipt_total_amount,
                    invoicelog_content: `Payment added to Invoice (Amount = ${receipt_total_amount})/-`,
                };
                yield common_conn.insertInvoiceHistory(history_data);
                const audit_content = `Payment added to Invoice (Amount = ${receipt_total_amount})/-`;
                yield this.insertAudit(req, 'update', audit_content, invoice_created_by, 'MONEY_RECEIPT');
                yield this.updateVoucher(req, 'MR');
                return receipt_id;
            }));
        });
    }
}
exports.default = CommonAddMoneyReceipt;
//# sourceMappingURL=CommonAddMoneyReceipt.js.map