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
const customError_1 = __importDefault(require("../../../../common/utils/errors/customError"));
class AddAdvanceReturn extends abstract_services_1.default {
    constructor() {
        super();
        this.addAdvanceReturn = (req) => __awaiter(this, void 0, void 0, function* () {
            const { cheque_number, cheque_withdraw_date, cheque_bank_name, advr_account_id, advr_amount, advr_combclient, advr_created_by, advr_note, advr_payment_date, advr_payment_type, advr_trxn_no, advr_trxn_charge, } = req.body;
            const { client_id, combined_id } = (0, common_helper_1.separateCombClientToId)(advr_combclient);
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.MoneyReceiptModels(req, trx);
                const conn_cl = this.models.clientModel(req, trx);
                const conn_acc = this.models.accountsModel(req, trx);
                const trxns = new Trxns_1.default(req, trx);
                const vouchar_no = yield this.generateVoucher(req, 'ADR');
                let trans_particular = 'ADVANCE RETURN';
                const cl_last_balance = yield conn_cl.selectClientLBalance(advr_combclient);
                const acc_last_balance = yield conn_acc.getAccountLastBalance(advr_account_id);
                if (cl_last_balance < advr_amount) {
                    throw new customError_1.default('If the client does not have an advance, how can you provide one?', 400, 'client does not have an advance');
                }
                if (acc_last_balance < advr_amount) {
                    throw new customError_1.default('Insufficient account balance.', 400, 'Insufficient balance');
                }
                let acc_trxn_id;
                let client_trxn_id;
                if (advr_payment_type !== 4) {
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
                    const AccTrxnBody = {
                        acctrxn_ac_id: advr_account_id,
                        acctrxn_type: 'DEBIT',
                        acctrxn_voucher: vouchar_no,
                        acctrxn_amount: advr_amount,
                        acctrxn_created_at: advr_payment_date,
                        acctrxn_created_by: advr_created_by,
                        acctrxn_note: advr_note,
                        acctrxn_particular_id: 32,
                        acctrxn_pay_type: accPayType,
                    };
                    acc_trxn_id = yield trxns.AccTrxnInsert(AccTrxnBody);
                    const clTrxnBody = {
                        ctrxn_type: 'DEBIT',
                        ctrxn_amount: advr_amount,
                        ctrxn_cl: advr_combclient,
                        ctrxn_voucher: vouchar_no,
                        ctrxn_particular_id: 32,
                        ctrxn_created_at: advr_payment_date,
                        ctrxn_note: advr_note,
                        ctrxn_pay_type: accPayType,
                    };
                    client_trxn_id = yield trxns.clTrxnInsert(clTrxnBody);
                }
                let advr_trxn_charge_id = null;
                if (advr_payment_type === 3 && advr_trxn_charge) {
                    const online_charge_trxn = {
                        charge_to_acc_id: advr_account_id,
                        charge_from_client_id: client_id,
                        charge_from_ccombined_id: combined_id,
                        charge_amount: advr_trxn_charge,
                        charge_purpose: trans_particular,
                        charge_note: advr_note,
                    };
                    advr_trxn_charge_id = yield this.models
                        .vendorModel(req, trx)
                        .insertOnlineTrxnCharge(online_charge_trxn);
                }
                // ================ @ ADVANCE RETURN @ ========================
                const advanceReturnData = {
                    advr_account_id,
                    advr_actransaction_id: acc_trxn_id,
                    advr_amount,
                    advr_client_id: client_id,
                    advr_combined_id: combined_id,
                    advr_created_by,
                    advr_ctrxn_id: client_trxn_id,
                    advr_note,
                    advr_payment_date,
                    advr_trxn_no,
                    advr_trxn_charge,
                    advr_trxn_charge_id,
                    advr_payment_type,
                    advr_vouchar_no: vouchar_no,
                };
                const advr_id = yield conn.insertAdvanceReturn(advanceReturnData);
                // ================ @ ADVANCE RETURN CHEQUE @ ========================
                if (advr_payment_type === 4) {
                    const advrChequeData = {
                        cheque_advr_id: advr_id,
                        cheque_bank_name,
                        cheque_number,
                        cheque_status: 'PENDING',
                        cheque_withdraw_date,
                    };
                    yield conn.insertAdvrCheque(advrChequeData);
                }
                yield this.updateVoucher(req, 'ADR');
                const message = `Advance has been return ${advr_amount}/-`;
                yield this.insertAudit(req, 'create', message, advr_created_by, 'MONEY_RECEIPT_ADVANCE_RETURN');
                return {
                    success: true,
                    message,
                    data: {
                        advr_id,
                    },
                };
            }));
        });
    }
}
exports.default = AddAdvanceReturn;
//# sourceMappingURL=AddAdvanceReturn.js.map