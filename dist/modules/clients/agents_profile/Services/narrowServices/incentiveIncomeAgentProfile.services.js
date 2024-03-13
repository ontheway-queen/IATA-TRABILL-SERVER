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
const Trxns_1 = __importDefault(require("../../../../../common/helpers/Trxns"));
class IncentiveIncomeAgentProfile extends abstract_services_1.default {
    constructor() {
        super();
        this.create = (req) => __awaiter(this, void 0, void 0, function* () {
            const { agent_id, account_id, type_id, amount, incentive_created_by, date, note, } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const agent_conn = this.models.agentProfileModel(req, trx);
                const acc_conn = this.models.accountsModel(req, trx);
                const vouchar_no = yield this.generateVoucher(req, 'ICI');
                const agentLBalance = yield agent_conn.getAgentLastBalance(agent_id);
                const updatedAgentLBalance = agentLBalance + Number(amount);
                const agentTransactionData = {
                    agtrxn_particular_id: 26,
                    agtrxn_type: 'DEBIT',
                    agtrxn_agent_id: agent_id,
                    agtrxn_amount: amount,
                    agtrxn_created_by: incentive_created_by,
                    agtrxn_particular_type: 'INCENTIVE_INCOME',
                    agtrxn_note: note,
                    agtrxn_voucher: '',
                    agtrxn_agency_id: req.agency_id,
                };
                const agent_trxn_id = yield agent_conn.insertAgentTransaction(agentTransactionData);
                const AccTrxnBody = {
                    acctrxn_ac_id: account_id,
                    acctrxn_type: 'CREDIT',
                    acctrxn_voucher: vouchar_no,
                    acctrxn_amount: amount,
                    acctrxn_created_at: date,
                    acctrxn_created_by: incentive_created_by,
                    acctrxn_note: note,
                    acctrxn_particular_id: 26,
                    acctrxn_particular_type: 'Agent profile',
                    acctrxn_pay_type: 'CASH',
                };
                const incentive_acctrxn_id = yield new Trxns_1.default(req, trx).AccTrxnInsert(AccTrxnBody);
                const incentiveInfo = {
                    incentive_vouchar_no: vouchar_no,
                    incentive_type: 'AGENT',
                    incentive_agent_id: agent_id,
                    incentive_agent_trxn_id: agent_trxn_id,
                    incentive_account_id: account_id,
                    incentive_actransaction_id: incentive_acctrxn_id,
                    incentive_trnxtype_id: 26,
                    incentive_account_category_id: type_id,
                    incentive_amount: amount,
                    incentive_created_by: incentive_created_by,
                    incentive_date: date,
                    incentive_note: note,
                };
                const incentive_id = yield acc_conn.addIncentiveInc(incentiveInfo);
                yield this.updateVoucher(req, 'ICI');
                const message = `Investment has been updated ${amount}/-`;
                yield this.insertAudit(req, 'update', message, incentive_created_by, 'OTHERS');
                return {
                    success: true,
                    message: 'Agent Incentive Income Created Successfully!',
                    incentive_id,
                };
            }));
        });
        this.editAgentIncentive = (req) => __awaiter(this, void 0, void 0, function* () {
            const { incentive_id } = req.params;
            const { agent_id, account_id, type_id, amount, incentive_created_by, date, note, } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const agent_conn = this.models.agentProfileModel(req, trx);
                const acc_conn = this.models.accountsModel(req, trx);
                const { prev_incentive_agent_trxn_id, prev_incentive_trxn_id } = yield acc_conn.viewPrevIncentiveInfo(incentive_id);
                const agentTransactionData = {
                    agtrxn_particular_id: 26,
                    agtrxn_type: 'DEBIT',
                    agtrxn_agent_id: agent_id,
                    agtrxn_amount: amount,
                    agtrxn_created_by: incentive_created_by,
                    agtrxn_particular_type: 'INCENTIVE_INCOME',
                    agtrxn_note: note,
                    agtrxn_agency_id: req.agency_id,
                    agtrxn_voucher: '',
                };
                const AccTrxnBody = {
                    acctrxn_ac_id: account_id,
                    acctrxn_type: 'CREDIT',
                    acctrxn_amount: amount,
                    acctrxn_created_at: date,
                    acctrxn_created_by: incentive_created_by,
                    acctrxn_note: note,
                    acctrxn_particular_id: 26,
                    acctrxn_particular_type: 'Money receipt',
                    acctrxn_pay_type: 'CASH',
                    trxn_id: prev_incentive_trxn_id,
                };
                const incentive_acctrxn_id = yield new Trxns_1.default(req, trx).AccTrxnUpdate(AccTrxnBody);
                const incentiveInfo = {
                    incentive_type: 'AGENT',
                    incentive_account_id: account_id,
                    incentive_actransaction_id: incentive_acctrxn_id,
                    incentive_agent_id: agent_id,
                    incentive_trnxtype_id: 26,
                    incentive_account_category_id: type_id,
                    incentive_amount: amount,
                    incentive_created_by: incentive_created_by,
                    incentive_date: date,
                    incentive_note: note,
                };
                const id = yield acc_conn.updateIncentiveIncome(incentive_id, incentiveInfo);
                const message = `Investment has been created ${amount}/-`;
                yield this.insertAudit(req, 'create', message, incentive_created_by, 'OTHERS');
                return {
                    success: true,
                    message: 'Incentive Income Edit Successfully!',
                    incentive_id: id,
                };
            }));
        });
        this.deleteIncentiveIncome = (req) => __awaiter(this, void 0, void 0, function* () {
            const { incentive_id } = req.params;
            const { incentive_deleted_by } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const agent_conn = this.models.agentProfileModel(req, trx);
                const acc_conn = this.models.accountsModel(req, trx);
                const trxns = new Trxns_1.default(req, trx);
                yield acc_conn.deleteIncentive(incentive_id, incentive_deleted_by);
                const { prev_incentive_agent_trxn_id, prev_incentive_amount, prev_incentive_trxn_id, } = yield acc_conn.viewPrevIncentiveInfo(incentive_id);
                yield trxns.deleteAccTrxn(prev_incentive_trxn_id);
                const message = `Investment has been deleted ${prev_incentive_amount}/-`;
                yield this.insertAudit(req, 'delete', message, incentive_deleted_by, 'OTHERS');
                return {
                    success: true,
                    message: 'Agent incentive deleted successfully!',
                };
            }));
        });
    }
}
exports.default = IncentiveIncomeAgentProfile;
//# sourceMappingURL=incentiveIncomeAgentProfile.services.js.map