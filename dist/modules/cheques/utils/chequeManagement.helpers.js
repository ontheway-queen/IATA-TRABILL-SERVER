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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const Trxns_1 = __importDefault(require("../../../common/helpers/Trxns"));
class ChequeManagementHelpers {
}
_a = ChequeManagementHelpers;
/**
 * update money receipt advanced return
 * @param body
 * @param conn
 * @param account_conn
 * @param client_conn
 * @param combined_conn
 */
ChequeManagementHelpers.moneyReceiptAdvrChequeStatus = (req, conn, trx) => __awaiter(void 0, void 0, void 0, function* () {
    const { account_id, cheque_amount, cheque_id, cheque_note, cheque_status, comb_client, date, user_id, } = req.body;
    const trxns = new Trxns_1.default(req, trx);
    let data;
    const { advr_vouchar_no } = yield conn.getAdvChequeInfo(cheque_id);
    if (cheque_status === 'DEPOSIT') {
        const AccTrxnBody = {
            acctrxn_ac_id: account_id,
            acctrxn_type: 'DEBIT',
            acctrxn_voucher: advr_vouchar_no,
            acctrxn_amount: cheque_amount,
            acctrxn_created_at: date,
            acctrxn_created_by: user_id,
            acctrxn_note: cheque_note,
            acctrxn_particular_id: 32,
            acctrxn_pay_type: 'CASH',
        };
        const account_trxn_id = yield trxns.AccTrxnInsert(AccTrxnBody);
        const clTrxnBody = {
            ctrxn_type: 'DEBIT',
            ctrxn_amount: cheque_amount,
            ctrxn_cl: comb_client,
            ctrxn_voucher: advr_vouchar_no,
            ctrxn_particular_id: 32,
            ctrxn_created_at: date,
            ctrxn_note: cheque_note,
        };
        const client_trxn_id = yield trxns.clTrxnInsert(clTrxnBody);
        const advanceReturnInfo = {
            advr_account_id: account_id,
            advr_actransaction_id: account_trxn_id,
            advr_ctrxn_id: client_trxn_id,
        };
        yield conn.updateAdvrChequeAccountClientInfo(advanceReturnInfo, cheque_id);
        data = {
            cheque_deposit_date: date,
            cheque_deposit_note: cheque_note,
        };
    }
    else if (cheque_status === 'BOUNCE') {
        data = {
            cheque_bounce_date: date,
            cheque_bounce_note: cheque_note,
        };
    }
    else if (cheque_status === 'RETURN') {
        data = {
            cheque_return_date: date,
            cheque_return_note: cheque_note,
        };
    }
    yield conn.updateAdvrChequeStatus(Object.assign(Object.assign({}, data), { cheque_status }), cheque_id);
    return `Money receipt cheque ${cheque_status.toLocaleLowerCase()}`;
});
/**
 * UPDATE EXPENSE CHEQUE STATUS
 * @param body
 * @param conn
 * @param account_conn
 * @param client_conn
 * @param combined_conn
 * @returns
 */
ChequeManagementHelpers.expenseChequeStatus = (req, conn, trx) => __awaiter(void 0, void 0, void 0, function* () {
    const { account_id, cheque_amount, cheque_id, cheque_note, cheque_status, date, user_id, } = req.body;
    const trxns = new Trxns_1.default(req, trx);
    const { expense_vouchar_no } = yield conn.getExpenseInfoForCheque(cheque_id);
    let data;
    if (cheque_status === 'DEPOSIT') {
        const AccTrxnBody = {
            acctrxn_ac_id: account_id,
            acctrxn_type: 'DEBIT',
            acctrxn_voucher: expense_vouchar_no,
            acctrxn_amount: cheque_amount,
            acctrxn_created_at: date,
            acctrxn_created_by: user_id,
            acctrxn_note: cheque_note,
            acctrxn_particular_id: 39,
            acctrxn_pay_type: 'CASH',
        };
        const account_trxn_id = yield trxns.AccTrxnInsert(AccTrxnBody);
        const expenseAccountUpdateInfo = {
            expense_accounts_id: account_id,
            expense_acctrxn_id: account_trxn_id,
        };
        yield conn.updateExpenseAccoutInfo(expenseAccountUpdateInfo, cheque_id);
        data = {
            expcheque_deposit_date: date,
            expcheque_deposit_note: cheque_note,
        };
    }
    else if (cheque_status === 'BOUNCE') {
        data = {
            expcheque_bounce_date: date,
            expcheque_bounce_note: cheque_note,
        };
    }
    else if (cheque_status === 'RETURN') {
        data = {
            expcheque_return_date: date,
            expcheque_return_note: cheque_note,
        };
    }
    yield conn.updateExpenceChequeStatus(Object.assign(Object.assign({}, data), { expcheque_status: cheque_status }), cheque_id);
    return `Money receipt cheque ${cheque_status.toLocaleLowerCase()}`;
});
/**
 * Loan cheque status update
 * @param body
 * @param conn
 * @param account_conn
 * @returns
 */
ChequeManagementHelpers.loanChequeStatusUpdate = (req, conn, trx) => __awaiter(void 0, void 0, void 0, function* () {
    const { account_id, cheque_amount, cheque_id, cheque_note, cheque_status, date, user_id, } = req.body;
    const trxns = new Trxns_1.default(req, trx);
    let data;
    if (cheque_status === 'DEPOSIT') {
        const infos = yield conn.singleLoanCheque(cheque_id);
        if (infos && ['TAKING', 'GIVING'].includes(infos.loan_type)) {
            const AccTrxnBody = {
                acctrxn_ac_id: account_id,
                acctrxn_type: infos.loan_type === 'TAKING' ? 'CREDIT' : 'DEBIT',
                acctrxn_voucher: infos.loan_vouchar_no,
                acctrxn_amount: cheque_amount,
                acctrxn_created_at: date,
                acctrxn_created_by: user_id,
                acctrxn_note: cheque_note,
                acctrxn_particular_id: infos.loan_type === 'TAKING' ? 52 : 53,
                acctrxn_pay_type: 'CASH',
            };
            const account_trxn_id = yield trxns.AccTrxnInsert(AccTrxnBody);
            const loan_account_update_info = {
                loan_account_id: account_id,
                loan_actransaction_id: account_trxn_id,
            };
            yield conn.updateLoanAccountInfo(loan_account_update_info, cheque_id);
        }
        data = {
            lcheque_deposit_date: date,
            lcheque_deposit_note: cheque_note,
        };
    }
    else if (cheque_status === 'BOUNCE') {
        data = {
            lcheque_bounce_date: date,
            lcheque_bounce_note: cheque_note,
        };
    }
    else {
        data = {
            lcheque_return_date: date,
            lcheque_return_note: cheque_note,
        };
    }
    yield conn.loanChequeUpdate(Object.assign(Object.assign({}, data), { lcheque_status: cheque_status }), cheque_id);
    return `Loan cheque update to ${cheque_status.toLocaleLowerCase()}`;
});
/**
 * Loan payment cheque status update
 * @param body
 * @param conn
 * @param account_conn
 * @returns
 */
ChequeManagementHelpers.loanPaymentChequeStatus = (req, conn, trx) => __awaiter(void 0, void 0, void 0, function* () {
    const { account_id, cheque_amount, cheque_id, cheque_note, cheque_status, date, user_id, } = req.body;
    const trxns = new Trxns_1.default(req, trx);
    const { payment_vouchar_no } = yield conn.getLoanPaymentInfoForChq(cheque_id);
    let data;
    if (cheque_status === 'DEPOSIT') {
        const AccTrxnBody = {
            acctrxn_ac_id: account_id,
            acctrxn_type: 'DEBIT',
            acctrxn_voucher: payment_vouchar_no,
            acctrxn_amount: cheque_amount,
            acctrxn_created_at: date,
            acctrxn_created_by: user_id,
            acctrxn_note: cheque_note,
            acctrxn_particular_id: 54,
            acctrxn_pay_type: 'CASH',
        };
        const account_trxn_id = yield trxns.AccTrxnInsert(AccTrxnBody);
        const loan_payment_info = {
            payment_actransaction_id: account_trxn_id,
            payment_account_id: account_id,
        };
        yield conn.updateLoanPaymentAccountInfo(loan_payment_info, cheque_id);
        data = {
            lpcheque_deposit_date: date,
            lpcheque_deposit_note: cheque_note,
        };
    }
    else if (cheque_status === 'BOUNCE') {
        data = {
            lpcheque_bounce_date: date,
            lpcheque_bounce_note: cheque_note,
        };
    }
    else {
        data = {
            lpcheque_return_date: date,
            lpcheque_return_note: cheque_note,
        };
    }
    yield conn.updateLPayChequeStatus(Object.assign(Object.assign({}, data), { lpcheque_status: cheque_status }), cheque_id);
    return `Loan payment cheque update to ${cheque_status.toLocaleLowerCase()}`;
});
/**
 * Loan received cheque status update
 * @param body
 * @param conn
 * @param account_conn
 * @returns
 */
ChequeManagementHelpers.loanReceivedChequeStatus = (req, conn, trx) => __awaiter(void 0, void 0, void 0, function* () {
    const { account_id, cheque_amount, cheque_id, cheque_note, cheque_status, date, user_id, } = req.body;
    const trxns = new Trxns_1.default(req, trx);
    const { received_vouchar_no } = yield conn.getLoanReciveInfoForChq(cheque_id);
    let data;
    if (cheque_status === 'DEPOSIT') {
        const AccTrxnBody = {
            acctrxn_ac_id: account_id,
            acctrxn_type: 'DEBIT',
            acctrxn_voucher: received_vouchar_no,
            acctrxn_amount: cheque_amount,
            acctrxn_created_at: date,
            acctrxn_created_by: user_id,
            acctrxn_note: cheque_note,
            acctrxn_particular_id: 55,
            acctrxn_pay_type: 'CASH',
        };
        const account_trxn_id = yield trxns.AccTrxnInsert(AccTrxnBody);
        const loan_receive_info = {
            received_actransaction_id: account_trxn_id,
            received_account_id: account_id,
        };
        yield conn.updateLoanReceiveAccountInfo(loan_receive_info, cheque_id);
        data = {
            lrcheque_deposit_date: date,
            lrcheque_deposit_note: cheque_note,
        };
    }
    else if (cheque_status === 'BOUNCE') {
        data = {
            lrcheque_bounce_date: date,
            lrcheque_bounce_note: cheque_note,
        };
    }
    else {
        data = {
            lrcheque_return_date: date,
            lrcheque_return_note: cheque_note,
        };
    }
    yield conn.updateLReceiveChequeStatus(Object.assign(Object.assign({}, data), { lrcheque_status: cheque_status }), cheque_id);
    return `Loan received cheque status update to ${cheque_status.toLocaleLowerCase()}`;
});
/**
 * Money receipt cheque status update
 * @param body
 * @param conn
 * @param client_conn
 * @param combined_conn
 * @param account_conn
 * @returns
 */
ChequeManagementHelpers.moneyReceiptChequeUpdate = (req, conn, trx, agent_conn) => __awaiter(void 0, void 0, void 0, function* () {
    const { account_id, cheque_amount, cheque_id, cheque_note, cheque_status, comb_client, date, user_id, } = req.body;
    const trxns = new Trxns_1.default(req, trx);
    let data;
    let receipt_agent_trxn_id;
    if (cheque_status === 'DEPOSIT') {
        const chequeInfo = yield conn.getMoneyReceiptChequeInfo(cheque_id);
        if (chequeInfo.prevAgentId) {
            const agentTransactionData = {
                agtrxn_particular_id: 62,
                agtrxn_type: 'CREDIT',
                agtrxn_agent_id: chequeInfo.prevAgentId,
                agtrxn_amount: cheque_amount,
                agtrxn_created_by: user_id,
                agtrxn_particular_type: 'AGENT_COMMISSION',
                agtrxn_agency_id: req.agency_id,
                agtrxn_note: '',
                agtrxn_voucher: '',
            };
            receipt_agent_trxn_id = yield agent_conn.insertAgentTransaction(agentTransactionData);
        }
        const AccTrxnBody = {
            acctrxn_ac_id: account_id,
            acctrxn_type: 'CREDIT',
            acctrxn_voucher: chequeInfo.receipt_vouchar_no,
            acctrxn_amount: cheque_amount,
            acctrxn_created_at: date,
            acctrxn_created_by: user_id,
            acctrxn_note: cheque_note,
            acctrxn_particular_id: 31,
            acctrxn_pay_type: 'CASH',
        };
        const account_trxn_id = yield trxns.AccTrxnInsert(AccTrxnBody);
        const clTrxnBody = {
            ctrxn_type: 'CREDIT',
            ctrxn_amount: cheque_amount,
            ctrxn_cl: comb_client,
            ctrxn_voucher: chequeInfo.receipt_vouchar_no,
            ctrxn_particular_id: 31,
            ctrxn_created_at: date,
            ctrxn_note: cheque_note,
        };
        const client_trxn_id = yield trxns.clTrxnInsert(clTrxnBody);
        const moneyReceiptAccountInfo = {
            receipt_actransaction_id: account_trxn_id,
            receipt_ctrxn_id: client_trxn_id,
            receipt_agent_trxn_id,
        };
        yield conn.updateMoneyReceiptAccountInfo(moneyReceiptAccountInfo, cheque_id);
        data = {
            cheque_deposit_date: date,
            cheque_deposit_note: cheque_note,
        };
    }
    else if (cheque_status === 'BOUNCE') {
        data = {
            cheque_bounce_date: date,
            cheque_bounce_note: cheque_note,
        };
    }
    else {
        data = {
            cheque_return_date: date,
            cheque_return_note: cheque_note,
        };
    }
    yield conn.updateMoneyReceiptCheque(Object.assign(Object.assign({}, data), { cheque_status }), cheque_id);
    return `Money receipt cheque status update to ${cheque_status.toLocaleLowerCase()}`;
});
/**
 * Payroll cheque status update
 * @param body
 * @param conn
 * @param account_conn
 * @returns
 */
ChequeManagementHelpers.payrollChequeUpdate = (req, conn, trx) => __awaiter(void 0, void 0, void 0, function* () {
    const { account_id, cheque_amount, cheque_id, cheque_note, cheque_status, date, user_id, } = req.body;
    const trxns = new Trxns_1.default(req, trx);
    const { payroll_vouchar_no } = yield conn.getPayrollInfoForChq(cheque_id);
    let data;
    if (cheque_status === 'DEPOSIT') {
        const AccTrxnBody = {
            acctrxn_ac_id: account_id,
            acctrxn_type: 'DEBIT',
            acctrxn_voucher: payroll_vouchar_no,
            acctrxn_amount: cheque_amount,
            acctrxn_created_at: date,
            acctrxn_created_by: user_id,
            acctrxn_note: cheque_note,
            acctrxn_particular_id: 38,
            acctrxn_pay_type: 'CASH',
        };
        const account_trxn_id = yield trxns.AccTrxnInsert(AccTrxnBody);
        const payrollAccountInfo = {
            payroll_account_id: account_id,
            payroll_acctrxn_id: account_trxn_id,
        };
        yield conn.updatePayrollAccountInfo(payrollAccountInfo, cheque_id);
        data = {
            pcheque_deposit_date: data,
            pcheque_deposit_note: cheque_note,
        };
    }
    else if (cheque_status === 'BOUNCE') {
        data = {
            pcheque_bounce_date: date,
            pcheque_bounce_note: cheque_note,
        };
    }
    else {
        data = {
            pcheque_return_date: date,
            pcheque_return_note: date,
        };
    }
    yield conn.updatePayrollCheque(Object.assign(Object.assign({}, data), { pcheque_status: cheque_status }), cheque_id);
    return `Payroll cheque status update to ${cheque_status.toLocaleLowerCase()}`;
});
/**
 * Vendor advance return cheque status update
 * @param body
 * @param conn
 * @param account_conn
 * @param vendor_conn
 * @param combined_conn
 * @returns
 */
ChequeManagementHelpers.vendorAdvanceRetrundCheque = (req, conn, trx) => __awaiter(void 0, void 0, void 0, function* () {
    const { account_id, cheque_amount, cheque_id, cheque_note, cheque_status, comb_vendor, date, user_id, } = req.body;
    const trxns = new Trxns_1.default(req, trx);
    const { advr_vouchar_no } = yield conn.getVAdvrInfoForChq(cheque_id);
    let data;
    if (cheque_status === 'DEPOSIT') {
        const AccTrxnBody = {
            acctrxn_ac_id: account_id,
            acctrxn_type: 'CREDIT',
            acctrxn_voucher: advr_vouchar_no,
            acctrxn_amount: cheque_amount,
            acctrxn_created_at: date,
            acctrxn_created_by: user_id,
            acctrxn_note: cheque_note,
            acctrxn_particular_id: 43,
            acctrxn_pay_type: 'CASH',
        };
        const account_trxn_id = yield trxns.AccTrxnInsert(AccTrxnBody);
        const VTrxnBody = {
            comb_vendor: comb_vendor,
            vtrxn_amount: cheque_amount,
            vtrxn_created_at: date,
            vtrxn_note: cheque_note,
            vtrxn_particular_id: 43,
            vtrxn_type: 'DEBIT',
            vtrxn_user_id: user_id,
            vtrxn_voucher: advr_vouchar_no,
        };
        const vendor_trxn_id = yield trxns.VTrxnInsert(VTrxnBody);
        const vendorAdvrAccountInfo = {
            advr_vtrxn_id: vendor_trxn_id,
            advr_account_id: account_id,
            advr_actransaction_id: account_trxn_id,
        };
        yield conn.updateVendorAdvrAccountInfo(vendorAdvrAccountInfo, cheque_id);
        data = {
            cheque_deposit_date: date,
            cheque_deposit_note: cheque_note,
        };
    }
    else if (cheque_status === 'BOUNCE') {
        data = {
            cheque_bounce_date: date,
            cheque_bounce_note: cheque_note,
        };
    }
    else {
        data = {
            cheque_return_date: date,
            cheque_return_note: cheque_note,
        };
    }
    yield conn.updateVendorAdvrCheque(Object.assign(Object.assign({}, data), { cheque_status }), cheque_id);
    return `Vendor advance return cheque status update to ${cheque_status.toLocaleLowerCase()}`;
});
/**
 * Vendor payment cheque status update
 * @param body
 * @param conn
 * @param account_conn
 * @param vendor_conn
 * @param combined_conn
 * @returns
 */
ChequeManagementHelpers.vendorPaymentCheque = (req, conn, trx) => __awaiter(void 0, void 0, void 0, function* () {
    const { account_id, cheque_amount, cheque_id, cheque_note, cheque_status, comb_vendor, date, user_id, } = req.body;
    const trxns = new Trxns_1.default(req, trx);
    let data;
    if (cheque_status === 'DEPOSIT') {
        const AccTrxnBody = {
            acctrxn_ac_id: account_id,
            acctrxn_type: 'DEBIT',
            acctrxn_voucher: '',
            acctrxn_amount: cheque_amount,
            acctrxn_created_at: date,
            acctrxn_created_by: user_id,
            acctrxn_note: cheque_note,
            acctrxn_particular_id: 42,
            acctrxn_pay_type: 'CASH',
        };
        const account_trxn_id = yield trxns.AccTrxnInsert(AccTrxnBody);
        const VTrxnBody = {
            comb_vendor: comb_vendor,
            vtrxn_amount: cheque_amount,
            vtrxn_created_at: date,
            vtrxn_note: cheque_note,
            vtrxn_particular_id: 42,
            vtrxn_type: 'CREDIT',
            vtrxn_user_id: user_id,
            vtrxn_voucher: '',
        };
        const vendor_trxn_id = yield trxns.VTrxnInsert(VTrxnBody);
        const vendorPaymentAccountInfo = {
            vpay_account_id: account_id,
            vpay_acctrxn_id: account_trxn_id,
            vpay_vtrxn_id: vendor_trxn_id,
        };
        yield conn.updateVendorPaymentAccountInfo(vendorPaymentAccountInfo, cheque_id);
        data = {
            vpcheque_deposit_date: date,
            vpcheque_deposit_note: cheque_note,
        };
    }
    else if (cheque_status === 'BOUNCE') {
        data = {
            vpcheque_bounce_date: date,
            vpcheque_bounce_note: cheque_note,
        };
    }
    else {
        data = {
            vpcheque_return_date: date,
            vpcheque_return_note: cheque_note,
        };
    }
    yield conn.updateVendorPaymentCheque(Object.assign(Object.assign({}, data), { vpcheque_status: cheque_status }), cheque_id);
    return `Vendor payment cheque status update to ${cheque_status.toLocaleLowerCase()}`;
});
exports.default = ChequeManagementHelpers;
//# sourceMappingURL=chequeManagement.helpers.js.map