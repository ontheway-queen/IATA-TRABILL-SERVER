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
exports.addAdvanceMr = exports.ValidateCreditLimit = exports.generateVoucherNumber = exports.MoneyReceiptAmountIsValid = exports.InvoiceClientAndVendorValidate = exports.ValidateClientAndVendor = exports.getClientOrCombId = exports.isEmpty = exports.isNotEmpty = exports._ = void 0;
const customError_1 = __importDefault(require("../utils/errors/customError"));
class InvoiceHelpers {
}
_a = InvoiceHelpers;
InvoiceHelpers.invoiceAgentTransactions = (models, agtrxn_agency_id, agent_id, invoice_id, invoice_no, user_id, commission_amount, transaction, agtransaction_trnxtype_id, particular, note) => __awaiter(void 0, void 0, void 0, function* () {
    if (!agent_id || !commission_amount || Number(commission_amount) === 0) {
        return;
    }
    const agent_last_balance = yield models.getAgentLastBalance(agent_id);
    const agentTransactionData = {
        agtrxn_agency_id,
        agtrxn_invoice_id: invoice_id,
        agtrxn_agent_id: agent_id,
        agtrxn_voucher: invoice_no,
        agtrxn_particular_id: agtransaction_trnxtype_id,
        agtrxn_particular_type: particular || 'INVOICE',
        agtrxn_type: 'DEBIT',
        agtrxn_amount: commission_amount,
        agtrxn_note: note || '',
        agtrxn_created_by: user_id,
    };
    if (transaction === 'CREATE') {
        yield models.insertAgentTransaction(agentTransactionData);
        return;
    }
    else if (transaction === 'UPDATE') {
        yield models.updateAgentTransaction(agentTransactionData);
        return;
    }
    else if (transaction === 'DELETE') {
        yield models.deleteAgentTransaction(invoice_id, user_id);
    }
});
InvoiceHelpers.deleteAgentTransactions = (models, invoice_id, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    yield models.deleteAgentTransaction(invoice_id, user_id);
});
exports.default = InvoiceHelpers;
exports._ = require('lodash');
const isNotEmpty = (data) => {
    return !exports._.isEmpty(data);
};
exports.isNotEmpty = isNotEmpty;
const isEmpty = (data) => {
    return exports._.isEmpty(data);
};
exports.isEmpty = isEmpty;
// CHECK IS CLIENT OR COMBINED ACCOUNT AND RETURN THOSE VALUE
const getClientOrCombId = (invoice_combclient_id) => {
    const clientCom = invoice_combclient_id.split('-');
    const client_type = clientCom[0];
    if (!['client', 'combined'].includes(client_type)) {
        throw new customError_1.default('Client type must be client or combined', 400, 'Invalid type');
    }
    let invoice_client_id = null;
    let invoice_combined_id = null;
    if (client_type === 'client') {
        invoice_client_id = Number(clientCom[1]);
    }
    else {
        invoice_combined_id = Number(clientCom[1]);
    }
    return { invoice_client_id, invoice_combined_id };
};
exports.getClientOrCombId = getClientOrCombId;
const ValidateClientAndVendor = (vendor, client) => __awaiter(void 0, void 0, void 0, function* () {
    if (vendor === client) {
        throw new customError_1.default('Vendor and client can not be same combined', 400, 'bad request');
    }
});
exports.ValidateClientAndVendor = ValidateClientAndVendor;
const InvoiceClientAndVendorValidate = (vendors, client) => __awaiter(void 0, void 0, void 0, function* () {
    let invoice_total_vendor_price = 0;
    let invoice_total_profit = 0;
    let pax_name = '';
    for (const item of vendors) {
        const vendor = item.billing_comvendor;
        // IF QUANTITY AND COST PRICE EXIST
        if (item.billing_quantity && item.billing_cost_price) {
            invoice_total_vendor_price +=
                item.billing_cost_price * item.billing_quantity;
        }
        // IF QUANTITY AND PROFIT EXIST
        if (item.billing_profit && item.billing_quantity) {
            invoice_total_profit += item.billing_profit * item.billing_quantity;
        }
        // IF PAX NAME EXISTS
        if (item.pax_name) {
            pax_name += item.pax_name;
        }
        if (vendor === client) {
            throw new customError_1.default('Vendor and client can not be same combined', 400, 'bad request');
        }
    }
    return { invoice_total_vendor_price, invoice_total_profit, pax_name };
});
exports.InvoiceClientAndVendorValidate = InvoiceClientAndVendorValidate;
// INVOICE MONEY RECEIPT CHECK VALIDATOR
const MoneyReceiptAmountIsValid = (money_receipt, invoice_net_total) => {
    let receipt_total_amount = 0;
    if (money_receipt) {
        receipt_total_amount = money_receipt.receipt_total_amount;
    }
    if (receipt_total_amount > invoice_net_total) {
        throw new customError_1.default('Money receipt amount cannot be more than invoice net total', 400, 'Invalid amount');
    }
};
exports.MoneyReceiptAmountIsValid = MoneyReceiptAmountIsValid;
const generateVoucherNumber = (length, title) => {
    let result = '';
    const characters = '0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return title ? title + '-' + result : result;
};
exports.generateVoucherNumber = generateVoucherNumber;
const ValidateCreditLimit = (vendor_id) => __awaiter(void 0, void 0, void 0, function* () {
    // throw new CustomError(
    //   'Vendor and client can not be same combined',
    //   400,
    //   'bad request'
    // );
    return true;
});
exports.ValidateCreditLimit = ValidateCreditLimit;
// ADD ADVANCE MONEY RECEIPT
const addAdvanceMr = (common_conn, inv_id, cl_id, com_id, net_total, advance_amount) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield common_conn.getAdvanceMrById(cl_id, com_id);
    let need_to_payment = Number(net_total);
    let able_to_payment = Number(advance_amount);
    if (data === null || data === void 0 ? void 0 : data.length) {
        for (const item of data) {
            if (need_to_payment === 0) {
                break;
            }
            const payment_amount = need_to_payment > item.payable_amount
                ? item.payable_amount
                : need_to_payment;
            const invClPay = {
                invclientpayment_moneyreceipt_id: item.receipt_id,
                invclientpayment_amount: payment_amount,
                invclientpayment_invoice_id: inv_id,
                invclientpayment_client_id: cl_id,
                invclientpayment_combined_id: com_id,
            };
            yield common_conn.insertAdvanceMr(invClPay);
            need_to_payment -= Number(payment_amount);
            able_to_payment -= Number(payment_amount);
        }
    }
    const clHaveAdvance = able_to_payment > need_to_payment ? need_to_payment : able_to_payment;
    if (clHaveAdvance > 0) {
        const invClPay = {
            invclientpayment_moneyreceipt_id: null,
            invclientpayment_amount: clHaveAdvance,
            invclientpayment_invoice_id: inv_id,
            invclientpayment_client_id: cl_id,
            invclientpayment_combined_id: com_id,
            invclientpayment_purpose: 'ADVANCE PAY',
        };
        yield common_conn.insertAdvanceMr(invClPay);
    }
});
exports.addAdvanceMr = addAdvanceMr;
//# sourceMappingURL=invoice.helpers.js.map