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
class EditAdvanceReturn extends abstract_services_1.default {
    constructor() {
        super();
        this.editAdvanceReturn = (req) => __awaiter(this, void 0, void 0, function* () {
            const { advance_amount, account_id, bank_name, cheque_no, advr_created_by, date, note, comb_vendor, advr_payment_type, transaction_charge, trans_no, vpcheque_withdraw_date, } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.vendorModel(req, trx);
                const trxns = new Trxns_1.default(req, trx);
                const { vendor_id, combined_id } = (0, common_helper_1.separateCombClientToId)(comb_vendor);
                const advr_id = Number(req.params.id);
                //   get previous account_id and return_amount
                const { prevVendorTrxnId, prevPayType, prevAccTrxnId, prev_voucher_no, prev_transaction_charge_id, } = yield conn.getAdvancePrevAccId(advr_id);
                let advr_actransaction_id = null;
                let advr_vtrxn_id = null;
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
                        acctrxn_voucher: prev_voucher_no,
                        acctrxn_amount: Number(advance_amount),
                        acctrxn_created_at: date,
                        acctrxn_created_by: advr_created_by,
                        acctrxn_note: note,
                        acctrxn_particular_id: 33,
                        acctrxn_particular_type: 'Vendor advance return',
                        acctrxn_pay_type: accPayType,
                    };
                    // VENDOR TRANSACTIONS
                    const VTrxnBody = {
                        comb_vendor: comb_vendor,
                        vtrxn_amount: Number(advance_amount) - (transaction_charge || 0),
                        vtrxn_created_at: date,
                        vtrxn_note: note,
                        vtrxn_particular_id: 33,
                        vtrxn_particular_type: 'Vendor advance return',
                        vtrxn_type: 'DEBIT',
                        vtrxn_user_id: advr_created_by,
                        vtrxn_voucher: prev_voucher_no,
                        vtrxn_pay_type: accPayType,
                    };
                    if (prevPayType !== 4) {
                        advr_actransaction_id = yield trxns.AccTrxnUpdate(Object.assign(Object.assign({}, AccTrxnBody), { trxn_id: prevAccTrxnId }));
                        advr_vtrxn_id = yield trxns.VTrxnUpdate(Object.assign(Object.assign({}, VTrxnBody), { trxn_id: prevVendorTrxnId }));
                    }
                    else {
                        advr_actransaction_id = yield trxns.AccTrxnInsert(AccTrxnBody);
                        advr_vtrxn_id = yield trxns.VTrxnInsert(VTrxnBody);
                    }
                }
                let transaction_charge_id = null;
                if (advr_payment_type === 3 && transaction_charge) {
                    if (prev_transaction_charge_id) {
                        yield conn.updateOnlineTrxnCharge({
                            charge_amount: transaction_charge,
                            charge_purpose: 'Vendor advance return',
                        }, prev_transaction_charge_id);
                    }
                    else {
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
                }
                else if (advr_payment_type !== 3 &&
                    prevPayType === 3 &&
                    prev_transaction_charge_id) {
                    yield conn.deleteOnlineTrxnCharge(prev_transaction_charge_id);
                }
                const updatedAdvanceReturn = {
                    advr_actransaction_id,
                    advr_amount: Number(advance_amount),
                    advr_payment_date: date,
                    advr_note: note,
                    advr_payment_type,
                    transaction_charge,
                    transaction_charge_id,
                    trans_no,
                    advr_account_id: account_id,
                    advr_updated_by: advr_created_by,
                    advr_combined_id: combined_id,
                    advr_vtrxn_id,
                    advr_vendor_id: vendor_id,
                };
                const data = yield conn.updateAdvanceReturn(updatedAdvanceReturn, advr_id);
                //  ======= advance return cheque data
                if (advr_payment_type === 4) {
                    const updateAdvanceReturnData = {
                        cheque_advr_id: data,
                        cheque_bank_name: bank_name,
                        cheque_number: cheque_no,
                        cheque_status: 'PENDING',
                        cheque_return_note: note,
                        cheque_vendor_id: vendor_id,
                        cheque_deposit_date: vpcheque_withdraw_date && vpcheque_withdraw_date.slice(0, 10),
                    };
                    yield conn.updateAdvanceReturnCheque(updateAdvanceReturnData, advr_id);
                }
                // insert audit
                const message = `UPDATED VENDOR ADVANCE RETURN, VOUCHER ${prev_voucher_no}, BDT ${advance_amount}/-`;
                yield this.insertAudit(req, 'update', message, advr_created_by, 'VENDOR_ADVANCE_RETURN');
                return {
                    success: true,
                    message: 'Advance return updated successfully',
                };
            }));
        });
    }
}
exports.default = EditAdvanceReturn;
//# sourceMappingURL=editAdvanceReturn.js.map