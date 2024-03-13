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
class AddAdvanceReturn extends abstract_services_1.default {
    constructor() {
        super();
        this.addAdvanceReturn = (req) => __awaiter(this, void 0, void 0, function* () {
            const { advance_amount, account_id, bank_name, cheque_no, advr_created_by, date, note, comb_vendor, advr_payment_type, transaction_charge, trans_no, vpcheque_withdraw_date, } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.vendorModel(req, trx);
                const { vendor_id, combined_id } = (0, common_helper_1.separateCombClientToId)(comb_vendor);
                const advr_vouchar_no = (0, invoice_helpers_1.generateVoucherNumber)(7, 'ADVR');
                let advr_actransaction_id = null;
                let advr_vtrxn_id = null;
                // PAYMENT METHOD
                let accPayType;
                if (advr_payment_type === 1) {
                    accPayType = 'CASH';
                }
                else if (advr_payment_type === 2) {
                    accPayType = 'BANK';
                }
                else if (advr_payment_type === 3) {
                    accPayType = 'MOBILE BANKING';
                }
                else {
                    accPayType = 'CASH';
                }
                if (advr_payment_type !== 4) {
                    // ACCOUNT TRANSACTIONS
                    const AccTrxnBody = {
                        acctrxn_ac_id: account_id,
                        acctrxn_type: 'CREDIT',
                        acctrxn_voucher: advr_vouchar_no,
                        acctrxn_amount: Number(advance_amount),
                        acctrxn_created_at: date,
                        acctrxn_created_by: advr_created_by,
                        acctrxn_note: note,
                        acctrxn_particular_id: 32,
                        acctrxn_particular_type: 'Advance return',
                        acctrxn_pay_type: accPayType,
                    };
                    advr_actransaction_id = yield new Trxns_1.default(req, trx).AccTrxnInsert(AccTrxnBody);
                    // VENDOR TRANSACTIONS
                    const VTrxnBody = {
                        comb_vendor: comb_vendor,
                        vtrxn_amount: Number(advance_amount) - (transaction_charge || 0),
                        vtrxn_created_at: date,
                        vtrxn_note: note,
                        vtrxn_particular_id: 32,
                        vtrxn_particular_type: 'Advance return',
                        vtrxn_type: 'DEBIT',
                        vtrxn_user_id: advr_created_by,
                        vtrxn_voucher: advr_vouchar_no,
                        vtrxn_pay_type: accPayType,
                    };
                    advr_vtrxn_id = yield new Trxns_1.default(req, trx).VTrxnInsert(VTrxnBody);
                }
                let transaction_charge_id = null;
                if (advr_payment_type === 3 && transaction_charge) {
                    const online_charge_trxn = {
                        charge_from_acc_id: account_id,
                        charge_to_vendor_id: vendor_id,
                        charge_to_vcombined_id: combined_id,
                        charge_amount: transaction_charge,
                        charge_purpose: 'Vendor advance return',
                        charge_note: note,
                    };
                    transaction_charge_id = yield conn.insertOnlineTrxnCharge(online_charge_trxn);
                }
                const advanceReturnData = {
                    advr_vouchar_no: String(advr_vouchar_no),
                    advr_vendor_id: vendor_id,
                    advr_combined_id: combined_id,
                    advr_vtrxn_id,
                    advr_actransaction_id,
                    advr_amount: Number(advance_amount),
                    advr_payment_date: date,
                    advr_note: note,
                    advr_created_by,
                    advr_payment_type,
                    transaction_charge,
                    transaction_charge_id,
                    trans_no,
                    advr_account_id: account_id,
                };
                const data = yield conn.insertAdvanceReturn(advanceReturnData);
                //  ======= advance return cheque data
                if (advr_payment_type === 4) {
                    const addAdvanceReturnChqueData = {
                        cheque_advr_id: data,
                        cheque_bank_name: bank_name,
                        cheque_number: cheque_no,
                        cheque_return_note: note,
                        cheque_vendor_id: vendor_id,
                        cheque_status: 'PENDING',
                        cheque_withdraw_date: vpcheque_withdraw_date && vpcheque_withdraw_date.slice(0, 10),
                    };
                    yield conn.insetAdvanceReturnCheque(addAdvanceReturnChqueData);
                }
                // insert audit
                const message = 'Advance return created successfully';
                yield this.insertAudit(req, 'update', message, advr_created_by, 'VENDOR_ADVANCE_RETURN');
                return {
                    success: true,
                    message,
                    data,
                };
            }));
        });
    }
}
exports.default = AddAdvanceReturn;
//# sourceMappingURL=addAdvanceReturn.js.map