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
const abstract_services_1 = __importDefault(require("../../../../../abstracts/abstract.services"));
const common_helper_1 = require("../../../../../common/helpers/common.helper");
const Trxns_1 = __importDefault(require("../../../../../common/helpers/Trxns"));
class IncentiveIncomeClientServices extends abstract_services_1.default {
    constructor() {
        super();
        this.addIncentiveIncomeClient = (req) => __awaiter(this, void 0, void 0, function* () {
            const { comb_client, account_id, adjust_with_bill, type_id, amount, incentive_created_by, date, note, } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const acc_conn = this.models.accountsModel(req, trx);
                const trxns = new Trxns_1.default(req, trx);
                const vouchar_no = yield this.generateVoucher(req, 'ICI');
                const { client_id, combined_id } = (0, common_helper_1.separateCombClientToId)(comb_client);
                let ctrxn_id;
                let incentive_acctrxn_id;
                if (adjust_with_bill === 'YES') {
                    const clTrxnBody = {
                        ctrxn_type: 'CREDIT',
                        ctrxn_amount: amount,
                        ctrxn_cl: comb_client,
                        ctrxn_voucher: vouchar_no,
                        ctrxn_particular_id: 26,
                        ctrxn_created_at: date,
                        ctrxn_note: note,
                        ctrxn_particular_type: 'Incentive income',
                    };
                    ctrxn_id = yield trxns.clTrxnInsert(clTrxnBody);
                    const clientBillInfo = {
                        cbilladjust_client_id: client_id,
                        cbilladjust_combined_id: combined_id,
                        cbilladjust_type: 'INCREASE',
                        cbilladjust_amount: amount,
                        cbilladjust_create_date: date,
                        cbilladjust_created_by: incentive_created_by,
                        cbilladjust_note: note,
                        cbilladjust_ctrxn_id: ctrxn_id,
                    };
                    yield acc_conn.addClientBill(clientBillInfo);
                }
                else {
                    const AccTrxnBody = {
                        acctrxn_ac_id: account_id,
                        acctrxn_type: 'CREDIT',
                        acctrxn_voucher: vouchar_no,
                        acctrxn_amount: amount,
                        acctrxn_created_at: date,
                        acctrxn_created_by: incentive_created_by,
                        acctrxn_note: note,
                        acctrxn_particular_id: 26,
                        acctrxn_particular_type: 'Incentive income detail',
                        acctrxn_pay_type: 'CASH',
                    };
                    incentive_acctrxn_id = yield new Trxns_1.default(req, trx).AccTrxnInsert(AccTrxnBody);
                }
                const incentiveInfo = {
                    incentive_vouchar_no: vouchar_no,
                    incentive_type: 'COMB_CLIENT',
                    incentive_client_id: client_id,
                    incentive_combine_id: combined_id,
                    incentive_ctrxn_id: ctrxn_id,
                    incentive_account_id: account_id,
                    incentive_actransaction_id: incentive_acctrxn_id,
                    incentive_adjust_bill: adjust_with_bill,
                    incentive_trnxtype_id: 26,
                    incentive_account_category_id: type_id,
                    incentive_amount: amount,
                    incentive_created_by: incentive_created_by,
                    incentive_date: date,
                    incentive_note: note,
                };
                const incentive_id = yield acc_conn.addIncentiveInc(incentiveInfo);
                yield this.updateVoucher(req, 'ICI');
                const message = `Investment has been created ${amount}/-`;
                yield this.insertAudit(req, 'create', message, incentive_created_by, 'OTHERS');
                return {
                    success: true,
                    message: 'Add client incentive income successfully!',
                    incentive_id,
                };
            }));
        });
        this.editIncentiveIncomeCombClient = (req) => __awaiter(this, void 0, void 0, function* () {
            const { incentive_id } = req.params;
            const { comb_client, type_id, account_id, adjust_with_bill, amount, incentive_created_by, date, note, } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const acc_conn = this.models.accountsModel(req, trx);
                const { client_id, combined_id } = (0, common_helper_1.separateCombClientToId)(comb_client);
                const { prev_incentive_acc_id, prev_incentive_adjust_bill, prev_incentive_amount, prev_incentive_trxn_id, prev_incentive_comb_client, prev_incentive_ctrxn_id, prev_voucher_no, } = yield acc_conn.viewPrevIncentiveInfo(incentive_id);
                let ctrxn_id;
                let incentive_acctrxn_id;
                const updateCombClientBalance = () => __awaiter(this, void 0, void 0, function* () {
                    const clTrxnBody = {
                        ctrxn_type: 'CREDIT',
                        ctrxn_amount: amount,
                        ctrxn_cl: comb_client,
                        ctrxn_voucher: prev_voucher_no,
                        ctrxn_particular_id: 26,
                        ctrxn_created_at: date,
                        ctrxn_note: note,
                        ctrxn_particular_type: 'Opening balance',
                        ctrxn_trxn_id: prev_incentive_ctrxn_id,
                    };
                    ctrxn_id = yield new Trxns_1.default(req, trx).clTrxnUpdate(clTrxnBody);
                });
                const updateAccountBalance = () => __awaiter(this, void 0, void 0, function* () {
                    const AccTrxnBody = {
                        acctrxn_ac_id: account_id,
                        acctrxn_type: 'CREDIT',
                        acctrxn_amount: amount,
                        acctrxn_created_at: date,
                        acctrxn_created_by: incentive_created_by,
                        acctrxn_note: note,
                        acctrxn_particular_id: 26,
                        acctrxn_particular_type: 'Incentive income client',
                        acctrxn_pay_type: 'CASH',
                        trxn_id: prev_incentive_trxn_id,
                    };
                    incentive_acctrxn_id = yield new Trxns_1.default(req, trx).AccTrxnUpdate(AccTrxnBody);
                });
                if (adjust_with_bill === prev_incentive_adjust_bill) {
                    if (adjust_with_bill === 'YES') {
                        yield updateCombClientBalance();
                    }
                    else {
                        yield updateAccountBalance();
                    }
                }
                else {
                    if (adjust_with_bill === 'YES') {
                        yield updateCombClientBalance();
                    }
                    else {
                        yield updateAccountBalance();
                    }
                }
                const incentiveInfo = {
                    incentive_type: 'COMB_CLIENT',
                    incentive_client_id: client_id,
                    incentive_combine_id: combined_id,
                    incentive_ctrxn_id: ctrxn_id,
                    incentive_account_id: account_id,
                    incentive_actransaction_id: incentive_acctrxn_id,
                    incentive_adjust_bill: adjust_with_bill,
                    incentive_trnxtype_id: 26,
                    incentive_account_category_id: type_id,
                    incentive_amount: amount,
                    incentive_created_by: incentive_created_by,
                    incentive_date: date,
                    incentive_note: note,
                };
                const id = yield acc_conn.updateIncentiveIncome(incentive_id, incentiveInfo);
                const message = `Investment has been updated ${amount}/-`;
                yield this.insertAudit(req, 'update', message, incentive_created_by, 'OTHERS');
                return {
                    success: true,
                    message: 'Client & combined incentive income edit successfully!',
                    incentive_id: id,
                };
            }));
        });
        this.deleteIncentiveIncomeCombClient = (req) => __awaiter(this, void 0, void 0, function* () {
            const { incentive_id } = req.params;
            const { incentive_deleted_by } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const acc_conn = this.models.accountsModel(req, trx);
                const trxns = new Trxns_1.default(req, trx);
                const { prev_incentive_adjust_bill, prev_incentive_amount, prev_incentive_trxn_id, prev_incentive_comb_client, prev_incentive_ctrxn_id, } = yield acc_conn.viewPrevIncentiveInfo(incentive_id);
                yield acc_conn.deleteIncentive(incentive_id, incentive_deleted_by);
                if (prev_incentive_adjust_bill == 'YES') {
                    yield trxns.deleteClTrxn(prev_incentive_ctrxn_id, prev_incentive_comb_client);
                }
                else {
                    yield new Trxns_1.default(req, trx).deleteAccTrxn(prev_incentive_trxn_id);
                }
                const message = `Investment has been deleted ${prev_incentive_amount}/-`;
                yield this.insertAudit(req, 'delete', message, incentive_deleted_by, 'OTHERS');
                return {
                    success: true,
                    message: 'Incentive income deleted successfully!',
                };
            }));
        });
    }
}
exports.default = IncentiveIncomeClientServices;
//# sourceMappingURL=incentiveIncomeClient.services.js.map