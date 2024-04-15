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
const abstract_services_1 = __importDefault(require("../../../abstracts/abstract.services"));
const Trxns_1 = __importDefault(require("../../../common/helpers/Trxns"));
const common_helper_1 = require("../../../common/helpers/common.helper");
const invoice_helpers_1 = require("../../../common/helpers/invoice.helpers");
const CommonAddMoneyReceipt_1 = __importDefault(require("../../../common/services/CommonAddMoneyReceipt"));
const AddAdvanceReturn_1 = __importDefault(require("./NarrowServices/AddAdvanceReturn"));
const AddMoneyReceipt_1 = __importDefault(require("./NarrowServices/AddMoneyReceipt"));
const DeleteAdvanceReturn_1 = __importDefault(require("./NarrowServices/DeleteAdvanceReturn"));
const DeleteMoneyReceipt_1 = __importDefault(require("./NarrowServices/DeleteMoneyReceipt"));
const EditAdvanceReturn_1 = __importDefault(require("./NarrowServices/EditAdvanceReturn"));
const EditMoneyReceipt_1 = __importDefault(require("./NarrowServices/EditMoneyReceipt"));
class MoneyReceiptServices extends abstract_services_1.default {
    constructor() {
        super();
        /* *****************************************
        =============== Narrow Services =============
        ********************************************/
        this.addMoneyReceipt = new AddMoneyReceipt_1.default().addMoneyReceipt;
        this.editMoneyReceipt = new EditMoneyReceipt_1.default().editMoneyReceipt;
        this.deleteMoneyReceipt = new DeleteMoneyReceipt_1.default().deleteMoneyReceipt;
        this.agentCommissionReceiptAdd = (req) => __awaiter(this, void 0, void 0, function* () {
            const { account_id, receipt_agent_amount, receipt_agent_id, receipt_created_by, receipt_payment_date, receipt_payment_type, cheque_bank_name, cheque_number, cheque_withdraw_date, receipt_note, receipt_money_receipt_no, invoice_id, charge_amount, receipt_payment_to, receipt_trxn_no, } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const agent_conn = this.models.agentProfileModel(req, trx);
                const common_conn = this.models.CommonInvoiceModel(req, trx);
                const conn = this.models.MoneyReceiptModels(req, trx);
                const trxns = new Trxns_1.default(req, trx);
                const vouchar_no = yield this.generateVoucher(req, 'AGP');
                let receipt_actransaction_id;
                let receipt_agent_trxn_id;
                let receipt_id;
                if (receipt_payment_type !== 4) {
                    const agentLBalance = yield agent_conn.getAgentLastBalance(receipt_agent_id);
                    const updatedAgentLBalance = agentLBalance + Number(receipt_agent_amount);
                    const agentTransactionData = {
                        agtrxn_agency_id: req.agency_id,
                        agtrxn_voucher: vouchar_no,
                        agtrxn_created_by: receipt_created_by,
                        agtrxn_particular_id: 62,
                        agtrxn_type: 'CREDIT',
                        agtrxn_agent_id: receipt_agent_id,
                        agtrxn_amount: receipt_agent_amount,
                        agtrxn_particular_type: 'AGENT_COMMISSION',
                        agtrxn_note: receipt_note,
                    };
                    receipt_agent_trxn_id = yield agent_conn.insertAgentTransaction(agentTransactionData);
                    let accPayType;
                    if (receipt_payment_type === 1) {
                        accPayType = 'CASH';
                    }
                    else if (receipt_payment_type === 2) {
                        accPayType = 'BANK';
                    }
                    else if (receipt_payment_type === 3) {
                        accPayType = 'MOBILE BANKING';
                    }
                    else {
                        accPayType = 'CASH';
                    }
                    const AccTrxnBody = {
                        acctrxn_ac_id: account_id,
                        acctrxn_type: 'DEBIT',
                        acctrxn_voucher: vouchar_no,
                        acctrxn_amount: receipt_agent_amount,
                        acctrxn_created_at: receipt_payment_date,
                        acctrxn_created_by: receipt_created_by,
                        acctrxn_note: receipt_note,
                        acctrxn_particular_id: 62,
                        acctrxn_particular_type: 'Agent commission',
                        acctrxn_pay_type: accPayType,
                    };
                    receipt_actransaction_id = yield trxns.AccTrxnInsert(AccTrxnBody);
                }
                let receipt_trxn_charge_id = null;
                if (receipt_payment_type === 3 && charge_amount) {
                    const online_charge_trxn = {
                        charge_from_acc_id: account_id,
                        charge_amount: Number(charge_amount),
                        charge_purpose: 'Invoice agent commission',
                        charge_note: receipt_note,
                    };
                    receipt_trxn_charge_id = yield this.models
                        .vendorModel(req, trx)
                        .insertOnlineTrxnCharge(online_charge_trxn);
                }
                const receiptInfo = {
                    receipt_trnxtype_id: 62,
                    receipt_vouchar_no: vouchar_no,
                    receipt_note,
                    receipt_actransaction_id,
                    receipt_total_amount: receipt_agent_amount,
                    receipt_payment_type,
                    receipt_payment_date,
                    receipt_created_by,
                    receipt_payment_status: 'SUCCESS',
                    receipt_agent_amount,
                    receipt_agent_id,
                    receipt_agent_trxn_id,
                    receipt_payment_to,
                    receipt_invoice_id: invoice_id,
                    receipt_money_receipt_no,
                    receipt_client_id: null,
                    receipt_combined_id: null,
                    receipt_trxn_charge: charge_amount,
                    receipt_trxn_charge_id,
                    receipt_account_id: account_id,
                    receipt_trxn_no,
                };
                receipt_id = yield conn.insertMoneyReceipt(receiptInfo);
                if (receipt_payment_type == 4) {
                    const moneyReceiptChequeData = {
                        cheque_receipt_id: receipt_id,
                        cheque_number: cheque_number,
                        cheque_withdraw_date: cheque_withdraw_date,
                        cheque_bank_name: cheque_bank_name,
                        cheque_status: 'PENDING',
                    };
                    yield conn.insertMoneyReceiptChequeInfo(moneyReceiptChequeData);
                }
                if (invoice_id) {
                    const history_data = {
                        history_activity_type: 'INVOICE_AGENT_COMMISSION',
                        history_invoice_id: invoice_id,
                        history_created_by: receipt_created_by,
                        history_invoice_payment_amount: receipt_agent_amount,
                        invoicelog_content: `Payment added to Agent commission (Amount = ${receipt_agent_amount})/-`,
                    };
                    yield common_conn.insertInvoiceHistory(history_data);
                    yield conn.updateAgentAmountPaid(invoice_id, 1);
                }
                yield this.updateVoucher(req, 'AGP');
                yield this.insertAudit(req, 'create', `Agent commission has been added ${receipt_agent_amount}/-`, receipt_created_by, 'MONEY_RECEIPT');
                return {
                    success: true,
                    message: `Payment has been added to Agent commission (Amount = ${receipt_agent_amount})/-`,
                    data: { receipt_id },
                };
            }));
        });
        this.deleteAgentMoneyRecipt = (req) => __awaiter(this, void 0, void 0, function* () {
            const { receipt_id } = req.params;
            const { deleted_by } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.MoneyReceiptModels(req, trx);
                const agent_conn = this.models.agentProfileModel(req, trx);
                const common_conn = this.models.CommonInvoiceModel(req, trx);
                let previousData = yield conn.getPrevAgentCommissionInfo(receipt_id);
                let chequeInfo = yield conn.getMoneyReceiptChequeInfo(receipt_id);
                yield conn.deletePrevMoneyReceiptChequeInfo(receipt_id, deleted_by);
                yield conn.deleteMoneyreceipt(receipt_id, deleted_by);
                if ((previousData === null || previousData === void 0 ? void 0 : previousData.receipt_payment_type) !== 4 ||
                    ((previousData === null || previousData === void 0 ? void 0 : previousData.receipt_payment_type) === 4 &&
                        (chequeInfo === null || chequeInfo === void 0 ? void 0 : chequeInfo.cheque_status) === 'DEPOSIT')) {
                    yield new Trxns_1.default(req, trx).deleteAccTrxn(previousData === null || previousData === void 0 ? void 0 : previousData.prevAccTrxnId);
                }
                const history_data = {
                    history_activity_type: 'INVOICE_PAYMENT_DELETED',
                    history_invoice_id: previousData === null || previousData === void 0 ? void 0 : previousData.prevInvoiceId,
                    history_created_by: deleted_by,
                    history_invoice_payment_amount: previousData === null || previousData === void 0 ? void 0 : previousData.prevReceiptTotal,
                    invoicelog_content: `Payment deleted to Invoice (Amount = ${previousData === null || previousData === void 0 ? void 0 : previousData.prevReceiptTotal})/-`,
                };
                yield common_conn.insertInvoiceHistory(history_data);
                yield conn.updateAgentAmountPaid(previousData === null || previousData === void 0 ? void 0 : previousData.prevInvoiceId, 0);
                yield this.insertAudit(req, 'delete', `Money receipt has been deleted `, deleted_by, 'MONEY_RECEIPT');
                return { success: true, message: 'Agent Payment deleted successfully' };
            }));
        });
        // @VIEW_MONEY_RECEIPT
        this.viewMoneyReceipt = (req) => __awaiter(this, void 0, void 0, function* () {
            const id = Number(req.params.id);
            const conn = this.models.MoneyReceiptModels(req);
            const data = yield conn.getViewMoneyReceipt(id);
            return {
                success: true,
                data,
            };
        });
        this.viewMoneyReceiptDetails = (req) => __awaiter(this, void 0, void 0, function* () {
            const id = Number(req.params.receipt_id);
            const conn = this.models.MoneyReceiptModels(req);
            const data = yield conn.viewMoneyReceiptDetails(id);
            return {
                success: true,
                data,
            };
        });
        // @GET_INVOICE_DUE
        this.getInvoiceDue = (req) => __awaiter(this, void 0, void 0, function* () {
            const id = Number(req.params.id);
            const conn = this.models.MoneyReceiptModels(req);
            const data = yield conn.getInvoiceDue(id);
            return {
                success: true,
                data,
            };
        });
        // @GET_DATA_FOR_EDIT
        this.getDataForEdit = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.MoneyReceiptModels(req);
            const id = Number(req.params.id);
            const moneyReceipt = yield conn.getMoneyReceiptById(id);
            return {
                success: true,
                data: moneyReceipt,
            };
        });
        // view agent profile
        this.viewAgentCommission = (req) => __awaiter(this, void 0, void 0, function* () {
            const { receipt_id } = req.params;
            const conn = this.models.MoneyReceiptModels(req);
            const data = yield conn.viewAgentCommission(receipt_id);
            return {
                success: true,
                data,
            };
        });
        // view money receipts invoices
        this.viewMoneyReceiptsInvoices = (req) => __awaiter(this, void 0, void 0, function* () {
            const { receipt_id } = req.params;
            const conn = this.models.MoneyReceiptModels(req);
            const data = yield conn.viewMoneyReceiptsInvoices(receipt_id);
            return {
                success: true,
                data,
            };
        });
        //
        this.viewAgentInvoiceById = (req) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const conn = this.models.MoneyReceiptModels(req);
            const data = yield conn.viewAgentInvoiceById(id);
            return {
                success: true,
                data,
            };
        });
        //============================= @GET_ALL_MONEY_RECEIPT
        this.getAllMoneyReceipt = (req) => __awaiter(this, void 0, void 0, function* () {
            const { page, size, search, from_date, to_date } = req.query;
            const data = yield this.models
                .MoneyReceiptModels(req)
                .getAllMoneyReceipt(Number(page) || 1, Number(size) || 20, search, from_date, to_date);
            return Object.assign({ success: true, message: 'All Money Receipt' }, data);
        });
        this.getAllAgentMoneyReceipt = (req) => __awaiter(this, void 0, void 0, function* () {
            const { page, size, search, from_date, to_date } = req.query;
            const data = yield this.models
                .MoneyReceiptModels(req)
                .getAllAgentMoneyReceipt(Number(page) || 1, Number(size) || 20, search, from_date, to_date);
            return Object.assign({ success: true, message: 'All Agent Money Receipt' }, data);
        });
        this.getInvoiceAndTicketNoByClient = (req) => __awaiter(this, void 0, void 0, function* () {
            const client_id = req.params.clientId;
            const conn = this.models.MoneyReceiptModels(req);
            const { invoice_client_id, invoice_combined_id } = yield (0, invoice_helpers_1.getClientOrCombId)(client_id);
            const pay_to = req.params.payment_to;
            const client_lbalance = yield this.models
                .combineClientModel(req)
                .getClientLastBalanceById(invoice_client_id, invoice_combined_id);
            // ================= @PAY TO INVOICE=====================
            if (pay_to === 'INVOICE') {
                let money_receipt = [];
                const data = yield conn.getInvoiceByClientCombined(invoice_client_id, invoice_combined_id);
                money_receipt = data;
                return {
                    success: true,
                    data: { client_lbalance, money_receipt },
                };
            }
            else if (pay_to === 'TICKET') {
                let money_receipt = [];
                const data = yield conn.getSpecificTicketByClient(invoice_client_id, invoice_combined_id);
                money_receipt = data;
                return {
                    success: true,
                    data: { client_lbalance, money_receipt },
                };
            }
            return {
                success: true,
                data: { client_lbalance, money_receipt: [] },
            };
        });
        this.getInvoiceByClientCombinedForEdit = (req) => __awaiter(this, void 0, void 0, function* () {
            const client_id = req.params.clientId;
            const conn = this.models.MoneyReceiptModels(req);
            const { invoice_client_id, invoice_combined_id } = yield (0, invoice_helpers_1.getClientOrCombId)(client_id);
            const pay_to = req.params.payment_to;
            const client_lbalance = yield this.models
                .combineClientModel(req)
                .getClientLastBalanceById(Number(invoice_client_id), Number(invoice_combined_id));
            // ================= @PAY TO INVOICE=====================
            if (pay_to === 'INVOICE') {
                let money_receipt = [];
                const data = yield conn.getInvoiceByClientCombinedForEdit(invoice_client_id, invoice_combined_id);
                money_receipt = data;
                return {
                    success: true,
                    data: { client_lbalance, money_receipt },
                };
            }
            else if (pay_to === 'TICKET') {
                let money_receipt = [];
                const data = yield conn.getSpecificTicketByClientForEdit(invoice_client_id, invoice_combined_id);
                money_receipt = data;
                return {
                    success: true,
                    data: { client_lbalance, money_receipt },
                };
            }
            return {
                success: true,
                data: { client_lbalance, money_receipt: [] },
            };
        });
        // ADD_INVOICE_MONEY_RECEIPT
        this.addInvoiceMoneyReceipt = (req) => __awaiter(this, void 0, void 0, function* () {
            const invoice_id = Number(req.params.id);
            const { invoice_combclient_id, invoice_created_by } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { invoice_client_id, invoice_combined_id } = (0, invoice_helpers_1.getClientOrCombId)(invoice_combclient_id);
                // MONEY RECEIPT
                const moneyReceiptInvoice = {
                    invoice_client_id,
                    invoice_combined_id,
                    invoice_created_by,
                    invoice_id,
                };
                const data = yield new CommonAddMoneyReceipt_1.default().commonAddMoneyReceipt(req, moneyReceiptInvoice, trx);
                yield this.insertAudit(req, 'create', `Invoice money receipt has been added`, invoice_created_by, 'MONEY_RECEIPT');
                return {
                    success: true,
                    message: 'Invoice money receipt has been added',
                    data,
                };
            }));
        });
        // UPATE MONEY RECEIPT CHEQUE STATUS
        this.updateMoneyReceiptChequeStatus = (req) => __awaiter(this, void 0, void 0, function* () {
            const { comb_client, receipt_total_amount, created_by, invoice_id, account_id, receipt_id, payment_date, cheque_status, cheque_note, } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const { client_id, combined_id } = (0, common_helper_1.separateCombClientToId)(comb_client);
                const client_conn = this.models.clientModel(req);
                const combined_conn = this.models.combineClientModel(req);
                const trxns = new Trxns_1.default(req, trx);
                const conn_acc = this.models.accountsModel(req);
                const conn = this.models.MoneyReceiptModels(req);
                let chequeMessage = '';
                let chequeStatusData = {};
                if (cheque_status === 'BOUNCE') {
                    chequeStatusData = {
                        cheque_bounce_date: payment_date,
                        cheque_bounce_note: cheque_note,
                    };
                    chequeMessage = `Money receipt cheque has been bounced`;
                }
                else if (cheque_status === 'DEPOSIT') {
                    chequeStatusData = {
                        cheque_deposit_date: payment_date,
                        cheque_deposit_note: cheque_note,
                    };
                }
                else if (cheque_status === 'RETURN') {
                    chequeStatusData = {
                        cheque_return_date: payment_date,
                        cheque_return_note: cheque_note,
                    };
                    chequeMessage = `MONEY receipt cheque has been return`;
                }
                yield this.insertAudit(req, 'update', chequeMessage, created_by, 'MONEY_RECEIPT');
                yield conn.MoneyReceiptChequeStatus(chequeStatusData, receipt_id);
                if (['BOUNCE', 'RETURN'].includes(cheque_status)) {
                    return {
                        success: true,
                        message: 'Money receipt cheque has been bounced or returned',
                    };
                }
                const clTrxnBody = {
                    ctrxn_type: 'CREDIT',
                    ctrxn_amount: receipt_total_amount,
                    ctrxn_cl: comb_client,
                    ctrxn_voucher: '',
                    ctrxn_particular_id: 29,
                    ctrxn_created_at: payment_date,
                    ctrxn_note: cheque_note,
                    ctrxn_particular_type: 'Money receipt',
                };
                const clientTrxnId = yield trxns.clTrxnInsert(clTrxnBody);
                const AccTrxnBody = {
                    acctrxn_ac_id: account_id,
                    acctrxn_type: 'CREDIT',
                    acctrxn_voucher: '',
                    acctrxn_amount: receipt_total_amount,
                    acctrxn_created_at: payment_date,
                    acctrxn_created_by: created_by,
                    acctrxn_note: cheque_note,
                    acctrxn_particular_id: 2,
                    acctrxn_particular_type: 'Money receipt cheque',
                    acctrxn_pay_type: 'CASH',
                };
                yield trxns.AccTrxnInsert(AccTrxnBody);
                const invoiceClientPaymentInfo = {
                    invclientpayment_moneyreceipt_id: receipt_id,
                    invclientpayment_invoice_id: invoice_id,
                    invclientpayment_client_id: client_id,
                    invclientpayment_combined_id: combined_id,
                    invclientpayment_cltrxn_id: clientTrxnId,
                    invclientpayment_amount: receipt_total_amount,
                    invclientpayment_date: payment_date,
                    invclientpayment_collected_by: created_by,
                };
                yield conn.insertInvoiceClPay(invoiceClientPaymentInfo);
                yield this.insertAudit(req, 'update', `Money receipt has been deposit ${receipt_total_amount}/-`, created_by, 'MONEY_RECEIPT');
                return {
                    success: true,
                    message: 'Money receipt cheque has been deposit',
                };
            }));
        });
        this.viewChequeInfoById = (req) => __awaiter(this, void 0, void 0, function* () {
            const { cheque_id } = req.params;
            const conn = this.models.MoneyReceiptModels(req);
            const data = yield conn.viewChequeInfoById(cheque_id);
            return {
                success: true,
                data,
            };
        });
        // ===================== @ ADVANCE RETURN @ ===================
        this.addAdvanceReturn = new AddAdvanceReturn_1.default().addAdvanceReturn;
        this.editAdvanceReturn = new EditAdvanceReturn_1.default().editAdvanceReturn;
        this.deleteAdvanceReturn = new DeleteAdvanceReturn_1.default().deleteAdvanceReturn;
        this.getAllAdvanceReturn = (req) => __awaiter(this, void 0, void 0, function* () {
            const { page, size, search, from_date, to_date } = req.query;
            const conn = this.models.MoneyReceiptModels(req);
            const data = yield conn.getAllAdvr(Number(page) || 1, Number(size) || 20, search, from_date, to_date);
            return Object.assign({ success: true, message: 'All Advance Return' }, data);
        });
        this.getAdvrForEdit = (req) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const conn = this.models.MoneyReceiptModels(req);
            const data = yield conn.getAdvrForEdit(id);
            return {
                success: true,
                data,
            };
        });
        // get all agent invoice by id
        this.getAllAgentInvoiceById = (req) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.invoice_id;
            const conn = this.models.MoneyReceiptModels(req);
            const data = yield conn.getAllAgentInvoiceById(id);
            return {
                success: true,
                data,
            };
        });
        this.viewAllAgentInvoice = (req) => __awaiter(this, void 0, void 0, function* () {
            const { search } = req.query;
            const conn = this.models.MoneyReceiptModels(req);
            const data = yield conn.viewAllAgentInvoice(search);
            return {
                success: true,
                data,
            };
        });
    }
}
exports.default = MoneyReceiptServices;
//# sourceMappingURL=MoneyReceipt.Services.js.map