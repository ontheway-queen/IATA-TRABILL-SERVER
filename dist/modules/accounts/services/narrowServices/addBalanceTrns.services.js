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
const customError_1 = __importDefault(require("../../../../common/utils/errors/customError"));
class AddBalanceTrasnfer extends abstract_services_1.default {
    constructor() {
        super();
        this.addBTransfer = (req) => __awaiter(this, void 0, void 0, function* () {
            const { transfer_from_id, transfer_to_id, transfer_amount, transfer_created_by, transfer_charge, transfer_date, transfer_note, } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.accountsModel(req, trx);
                const trxns = new Trxns_1.default(req, trx);
                const voucher_no = yield this.generateVoucher(req, 'BT');
                let lastBalance_from = yield conn.getAccountLastBalance(transfer_from_id);
                lastBalance_from = Number(lastBalance_from);
                if (lastBalance_from > 0 && lastBalance_from >= transfer_amount) {
                    lastBalance_from = lastBalance_from - transfer_amount;
                    const AccTrxnBody = {
                        acctrxn_ac_id: transfer_from_id,
                        acctrxn_type: 'DEBIT',
                        acctrxn_voucher: voucher_no,
                        acctrxn_amount: transfer_amount,
                        acctrxn_created_at: transfer_date,
                        acctrxn_created_by: transfer_created_by,
                        acctrxn_note: transfer_note,
                        acctrxn_particular_id: 34,
                        acctrxn_pay_type: 'CASH',
                    };
                    const from_acc_trxn_id = yield trxns.AccTrxnInsert(AccTrxnBody);
                    // Balance transfer Online transaction fee
                    let btransfer_actransaction_id = null;
                    if (transfer_charge) {
                        const AccTrxnChargeBody = {
                            acctrxn_ac_id: transfer_from_id,
                            acctrxn_type: 'DEBIT',
                            acctrxn_voucher: voucher_no,
                            acctrxn_amount: transfer_charge,
                            acctrxn_created_at: transfer_date,
                            acctrxn_created_by: transfer_created_by,
                            acctrxn_note: transfer_note,
                            acctrxn_particular_id: 60,
                            acctrxn_pay_type: 'CASH',
                        };
                        btransfer_actransaction_id = yield trxns.AccTrxnInsert(AccTrxnChargeBody);
                    }
                    const AccTrxnBodyTo = {
                        acctrxn_ac_id: transfer_to_id,
                        acctrxn_type: 'CREDIT',
                        acctrxn_voucher: voucher_no,
                        acctrxn_amount: transfer_amount,
                        acctrxn_created_at: transfer_date,
                        acctrxn_created_by: transfer_created_by,
                        acctrxn_note: transfer_note,
                        acctrxn_particular_id: 34,
                        acctrxn_pay_type: 'CASH',
                    };
                    const to_acc_trxn_id = yield trxns.AccTrxnInsert(AccTrxnBodyTo);
                    let btransfer_charge_id = null;
                    if (transfer_charge && transfer_charge > 0) {
                        const online_charge_trxn = {
                            charge_from_acc_id: transfer_from_id,
                            charge_to_acc_id: transfer_to_id,
                            charge_amount: transfer_charge,
                            charge_purpose: `Balance Transfer Account To Account`,
                            charge_note: transfer_note,
                        };
                        btransfer_charge_id = yield this.models
                            .vendorModel(req, trx)
                            .insertOnlineTrxnCharge(online_charge_trxn);
                    }
                    const balanceTInfo = {
                        btransfer_from_account_id: transfer_from_id,
                        btransfer_from_acc_trxn_id: from_acc_trxn_id,
                        btransfer_to_account_id: transfer_to_id,
                        btransfer_to_acc_trxn_id: to_acc_trxn_id,
                        btransfer_vouchar_no: voucher_no,
                        btransfer_amount: transfer_amount,
                        btransfer_charge: transfer_charge,
                        btransfer_charge_id,
                        btransfer_created_by: transfer_created_by,
                        btransfer_date: transfer_date,
                        btransfer_note: transfer_note,
                        btransfer_actransaction_id,
                    };
                    const data = yield conn.addBalanceTransfer(balanceTInfo);
                    yield this.updateVoucher(req, 'BT');
                    const message = `Account balance has been transfer ${transfer_amount}/-`;
                    yield this.insertAudit(req, 'create', message, transfer_created_by, 'ACCOUNTS');
                    return {
                        success: true,
                        message: 'Balance Transfer created successfully',
                        data,
                    };
                }
                else {
                    throw new customError_1.default('Insufficient balance', 400, 'Bad request');
                }
            }));
        });
    }
}
exports.default = AddBalanceTrasnfer;
//# sourceMappingURL=addBalanceTrns.services.js.map