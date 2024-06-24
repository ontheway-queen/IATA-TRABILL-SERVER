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
class ChequeCollectionStatusUpdate extends abstract_services_1.default {
    constructor() {
        super();
        // UPDATE CHEQUE STATUS
        this.chequeCollectionStatusUpdate = (req) => __awaiter(this, void 0, void 0, function* () {
            const { account_id, chequeTable, cheque_status, client_id, date, note, amount, user_id, vendor_id, chequeId, } = req.body;
            // LOAN_CHEQUE || MONEY_RECEIPT || VENDOR_ADVR ||
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.NotificationModals(req, trx);
                let chequeMessage = '';
                //   LOAN CHEQUE
                if (chequeTable === 'LOAN_CHEQUE') {
                    if (cheque_status === 'DEPOSIT') {
                        const AccTrxnBody = {
                            acctrxn_ac_id: account_id,
                            acctrxn_type: 'DEBIT',
                            acctrxn_voucher: '',
                            acctrxn_amount: Number(amount),
                            acctrxn_created_at: date,
                            acctrxn_created_by: user_id,
                            acctrxn_note: note,
                            acctrxn_particular_id: 40,
                            acctrxn_pay_type: 'CASH',
                        };
                        yield new Trxns_1.default(req, trx).AccTrxnInsert(AccTrxnBody);
                        //   UPDATE CHEQUE TABLE
                        const data = {
                            lcheque_status: cheque_status,
                            lcheque_deposit_date: date,
                            lcheque_deposit_note: note,
                        };
                        yield conn.updateLChequeStatus(data, chequeId);
                        chequeMessage = `Loan cheque has been deposit ${amount}/-`;
                    }
                    else if (cheque_status === 'BOUNCE') {
                        const data = {
                            lcheque_status: cheque_status,
                            lcheque_bounce_date: date,
                            lcheque_bounce_note: note,
                        };
                        yield conn.updateLChequeStatus(data, chequeId);
                        chequeMessage = `Loan cheque has been bounce`;
                    }
                    else if (cheque_status === 'RETURN') {
                        const data = {
                            lcheque_status: cheque_status,
                            lcheque_return_date: date,
                            lcheque_return_note: note,
                        };
                        yield conn.updateLChequeStatus(data, chequeId);
                        chequeMessage = `Loan cheque has been return`;
                    }
                    return {
                        success: true,
                        message: 'Loan cheque status has been updated',
                    };
                }
                //   MONEY RECEIPT
                else if (chequeTable === 'MONEY_RECEIPT') {
                    if (cheque_status === 'DEPOSIT') {
                        // ================ @ TRANSACTIONS @ ==================
                        const AccTrxnBody = {
                            acctrxn_ac_id: account_id,
                            acctrxn_type: 'DEBIT',
                            acctrxn_voucher: '',
                            acctrxn_amount: Number(amount),
                            acctrxn_created_at: date,
                            acctrxn_created_by: user_id,
                            acctrxn_note: note,
                            acctrxn_particular_id: 31,
                            acctrxn_pay_type: 'CASH',
                        };
                        yield new Trxns_1.default(req, trx).AccTrxnInsert(AccTrxnBody);
                        const clTrxnBody = {
                            ctrxn_type: 'DEBIT',
                            ctrxn_amount: Number(amount),
                            ctrxn_cl: `client-${client_id}`,
                            ctrxn_voucher: '',
                            ctrxn_particular_id: 31,
                            ctrxn_created_at: date,
                            ctrxn_note: note,
                        };
                        yield new Trxns_1.default(req, trx).clTrxnInsert(clTrxnBody);
                        const data = {
                            cheque_status,
                            cheque_deposit_date: date,
                            cheque_deposit_note: note,
                        };
                        yield conn.updateMoneyReceiptCheque(data, chequeId);
                        chequeMessage = `Money receipt cheque has been deposit ${amount}/-`;
                    }
                    else if (cheque_status === 'BOUNCE') {
                        const data = {
                            cheque_status,
                            cheque_bounce_date: date,
                            cheque_bounce_note: note,
                        };
                        yield conn.updateMoneyReceiptCheque(data, chequeId);
                        chequeMessage = `Money receipt cheque has been bounce`;
                    }
                    else if (cheque_status === 'RETURN') {
                        const data = {
                            cheque_status,
                            cheque_return_date: date,
                            cheque_return_note: note,
                        };
                        yield conn.updateMoneyReceiptCheque(data, chequeId);
                    }
                    chequeMessage = `Money receipt cheque has been return`;
                    return {
                        success: true,
                        message: 'Money receipt cheque status has been updated',
                    };
                }
                // CLIENT REFUND
                else if (chequeTable === 'CLIENT_REFUND') {
                    if (cheque_status === 'DEPOSIT') {
                        // TRANSACTIONS
                        const clTrxnBody = {
                            ctrxn_type: 'CREDIT',
                            ctrxn_amount: Number(amount),
                            ctrxn_cl: `client-${client_id}`,
                            ctrxn_voucher: '',
                            ctrxn_particular_id: 50,
                            ctrxn_created_at: date,
                            ctrxn_note: note,
                        };
                        yield new Trxns_1.default(req, trx).clTrxnInsert(clTrxnBody);
                        const data = {
                            rcheque_status: cheque_status,
                            rcheque_deposit_date: date,
                            rcheque_deposit_note: note,
                        };
                        yield conn.updateClientRefundChequ(data, chequeId);
                        chequeMessage = `Client refund cheque has been deposit ${amount}/-`;
                    }
                    else if (cheque_status === 'BOUNCE') {
                        const data = {
                            rcheque_status: cheque_status,
                            rcheque_bounce_date: date,
                            rcheque_bounce_note: note,
                        };
                        yield conn.updateClientRefundChequ(data, chequeId);
                        chequeMessage = `Client refund cheque has been bounce`;
                    }
                    else if (cheque_status === 'RETURN') {
                        const data = {
                            rcheque_status: cheque_status,
                            rcheque_return_date: date,
                            rcheque_return_note: note,
                        };
                        yield conn.updateClientRefundChequ(data, chequeId);
                        chequeMessage = `Client refund cheque has been return`;
                    }
                    return {
                        success: true,
                        message: 'Client refund cheque has been updated',
                    };
                }
                // VENDOR REFUND
                else if (chequeTable === 'VENDOR_REFUND') {
                    if (cheque_status === 'DEPOSIT') {
                        const VTrxnBody = {
                            comb_vendor: `vendor-${vendor_id}`,
                            vtrxn_amount: Number(amount),
                            vtrxn_created_at: date,
                            vtrxn_note: note,
                            vtrxn_particular_id: 51,
                            vtrxn_type: 'CREDIT',
                            vtrxn_user_id: user_id,
                            vtrxn_voucher: '',
                        };
                        yield new Trxns_1.default(req, trx).VTrxnInsert(VTrxnBody);
                        const data = {
                            rcheque_status: cheque_status,
                            rcheque_deposit_date: date,
                            rcheque_deposit_note: note,
                        };
                        yield conn.updateVendorRefundChequ(data, chequeId);
                        chequeMessage = `Vendor refund cheque has been deposit ${amount}/-`;
                    }
                    else if (cheque_status === 'BOUNCE') {
                        const data = {
                            rcheque_status: cheque_status,
                            rcheque_bounce_date: date,
                            rcheque_bounce_note: note,
                        };
                        yield conn.updateVendorRefundChequ(data, chequeId);
                        chequeMessage = `Vendor refund cheque has been bounce`;
                    }
                    else if (cheque_status === 'RETURN') {
                        const data = {
                            rcheque_status: cheque_status,
                            rcheque_return_date: date,
                            rcheque_return_note: note,
                        };
                        yield conn.updateVendorRefundChequ(data, chequeId);
                        chequeMessage = `Vendor refund cheque has been return`;
                    }
                    return {
                        success: true,
                        message: 'Vendor refund cheque has been updated',
                    };
                }
                //   VENDOR ADVACE RETURN
                else if (chequeTable === 'VENDOR_ADVR') {
                    if (cheque_status === 'DEPOSIT') {
                        const VTrxnBody = {
                            comb_vendor: `vendor-${vendor_id}`,
                            vtrxn_amount: Number(amount),
                            vtrxn_created_at: date,
                            vtrxn_note: note,
                            vtrxn_particular_id: 43,
                            vtrxn_type: 'DEBIT',
                            vtrxn_user_id: user_id,
                            vtrxn_voucher: 'CHEQUE',
                        };
                        yield new Trxns_1.default(req, trx).VTrxnInsert(VTrxnBody);
                        const data = {
                            cheque_status,
                            cheque_deposit_date: date,
                            cheque_deposit_note: note,
                        };
                        yield conn.updateVendorAdvrChequeStatus(data, chequeId);
                        chequeMessage = `Vendor advance return cheque has been deposit ${amount}/-`;
                    }
                    else if (cheque_status === 'BOUNCE') {
                        const data = {
                            cheque_status,
                            cheque_bounce_date: date,
                            cheque_bounce_note: note,
                        };
                        yield conn.updateVendorAdvrChequeStatus(data, chequeId);
                        chequeMessage = `Vendor advance return cheque has been bounce`;
                    }
                    else if (cheque_status === 'RETURN') {
                        const data = {
                            cheque_status,
                            cheque_return_date: date,
                            cheque_return_note: note,
                        };
                        yield conn.updateVendorAdvrChequeStatus(data, chequeId);
                        chequeMessage = `Vendor advance return cheque has been return`;
                    }
                    yield this.insertAudit(req, 'delete', chequeMessage, user_id, 'CHEQUE');
                    return {
                        success: true,
                        message: 'Vendor advance return cheque has been updated',
                    };
                }
                else {
                    throw new customError_1.default('Please provide valid data', 400, 'Invalid data');
                }
            }));
        });
    }
}
exports.default = ChequeCollectionStatusUpdate;
//# sourceMappingURL=ChequeCollectionStatusUpdate.js.map