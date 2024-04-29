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
const moment_1 = __importDefault(require("moment"));
const abstract_models_1 = __importDefault(require("../../../../abstracts/abstract.models"));
const customError_1 = __importDefault(require("../../../../common/utils/errors/customError"));
class AgentProfileModels extends abstract_models_1.default {
    constructor() {
        super(...arguments);
        this.getPreviousImage = (id, ImgName) => __awaiter(this, void 0, void 0, function* () {
            const [previous_image] = yield this.query()
                .select(ImgName)
                .from('trabill_agents_profile')
                .where('agent_id', id);
            return previous_image[ImgName];
        });
        this.getAgentLastBalance = (agentId) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .from('trabill_agents_profile')
                .select('agent_last_balance')
                .where('agent_id', agentId);
            if (!data.length) {
                throw new customError_1.default('Please provide valid agent ID', 400, 'Bad request');
            }
            return Number(data[0].agent_last_balance);
        });
        this.insertAgentTransaction = (data) => __awaiter(this, void 0, void 0, function* () {
            const id = yield this.query().insert(data).into('trxn.agent_trxn');
            return id[0];
        });
        this.updateAgentTransaction = (data) => __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .insert(data)
                .onConflict(['agtrxn_invoice_id'])
                .merge(data)
                .into('trxn.agent_trxn');
        });
        this.deleteAgentTransaction = (invoiceId, agtrxn_deleted_by) => __awaiter(this, void 0, void 0, function* () {
            yield this.query()
                .update({ agtrxn_is_deleted: 1, agtrxn_deleted_by })
                .into('trxn.agent_trxn')
                .where('agtrxn_invoice_id', invoiceId)
                .andWhere('agtrxn_agency_id', this.org_agency);
        });
    }
    createAgentProfile(agent) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .insert(Object.assign(Object.assign({}, agent), { agent_org_agency: this.org_agency }))
                .into('trabill_agents_profile');
            return data;
        });
    }
    getAllAgent() {
        return __awaiter(this, void 0, void 0, function* () {
            const agents = yield this.query()
                .select('*')
                .from('view_all_agents_profile')
                .where('agent_is_deleted', 0)
                .andWhere('agent_org_agency', this.org_agency);
            return agents;
        });
    }
    viewAgents(page, size, search, from_date, to_date) {
        return __awaiter(this, void 0, void 0, function* () {
            search && search.toLowerCase();
            const page_number = (page - 1) * size;
            from_date
                ? (from_date = (0, moment_1.default)(new Date(from_date)).format('YYYY-MM-DD'))
                : null;
            to_date ? (to_date = (0, moment_1.default)(new Date(to_date)).format('YYYY-MM-DD')) : null;
            const data = yield this.query()
                .select('*')
                .from('view_all_agents_profile')
                .where('agent_org_agency', this.org_agency)
                .andWhere((builder) => {
                builder.where('agent_org_agency', this.org_agency).modify((event) => {
                    if (search && search !== 'all') {
                        event
                            .andWhereRaw(`agent_name LIKE ?`, `%${search}%`)
                            .orWhereRaw(`agent_mobile LIKE ?`, `%${search}%`)
                            .orWhereRaw(`view_all_agents_profile.agent_email LIKE ?`, `%${search}%`);
                    }
                    if (from_date && to_date) {
                        event.andWhereRaw(`DATE_FORMAT(agent_create_date, '%Y-%m-%d') BETWEEN ? AND ?`, [from_date, to_date]);
                    }
                });
            })
                .andWhere('agent_org_agency', this.org_agency)
                .limit(size)
                .offset(page_number);
            const [{ row_count }] = yield this.query()
                .select(this.db.raw(`count(*) as row_count`))
                .from('view_all_agents_profile')
                .where('agent_is_deleted', 0)
                .andWhere((builder) => {
                builder.where('agent_org_agency', this.org_agency).modify((event) => {
                    if (search && search !== 'all') {
                        event
                            .andWhereRaw(`LOWER(agent_name) LIKE ?`, [`%${search}%`])
                            .orWhereRaw(`LOWER(agent_mobile) LIKE ?`, [`%${search}%`])
                            .orWhereRaw(`LOWER(view_all_agents_profile.agent_email) LIKE ?`, [
                            `%${search}%`,
                        ]);
                    }
                    if (from_date && to_date) {
                        event.andWhereRaw(`DATE_FORMAT(agent_create_date, '%Y-%m-%d') BETWEEN ? AND ?`, [from_date, to_date]);
                    }
                });
            })
                .andWhere('agent_org_agency', this.org_agency);
            return { count: row_count, data };
        });
    }
    viewAllAgents(search) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select('agent_id', 'agent_name', 'agent_last_balance')
                .from('trabill_agents_profile')
                .where('agent_org_agency', this.org_agency)
                .andWhere('agent_is_deleted', 0)
                .modify((event) => {
                if (search) {
                    event.andWhereILike('agent_name', `%${search}%`);
                }
                else {
                    event.orderBy('agent_create_date', 'desc').limit(20);
                }
            })
                .andWhere('agent_activity_status', 1);
            return data;
        });
    }
    getAllAgentById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select('agent_id', 'agent_name', 'agent_email', 'agent_mobile', 'agent_commission_rate', 'agent_last_balance', 'agent_activity_status', 'agent_address', 'agent_nid_no', 'agent_image_copy', 'agent_nid_front', 'agent_nid_back', 'agent_date_of_birth', 'agent_op_balance_type', 'agent_op_amount', this.db.raw(`CASE WHEN agent_activity_status = 1 THEN 'Active' WHEN agent_activity_status = 0 THEN 'Inactive' ELSE NULL END as agent_activity`), 'agent_is_deleted')
                .from('trabill_agents_profile')
                .where('agent_id', id);
            return data;
        });
    }
    editAgentProfile(id, agent) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .into('trabill_agents_profile')
                .update(agent)
                .where('agent_id', id);
            if (data === 0) {
                throw new customError_1.default('Please provide a valid id', 400, 'invalid id');
            }
        });
    }
    deleteAgentProfile(id, agent_deleted_by) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .into('trabill_agents_profile')
                .update({ agent_is_deleted: 1, agent_deleted_by })
                .where('agent_id', id)
                .andWhere('agent_org_agency', this.org_agency);
            if (data) {
                return data;
            }
            else {
                throw new customError_1.default(`You can't delete this agent profile`, 400, `Bad request`);
            }
        });
    }
    updateAgentsStatus(agent_id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.query()
                .update('agent_activity_status', status === 'active' ? 1 : 0)
                .into('trabill_agents_profile')
                .where('agent_id', agent_id);
        });
    }
    getAgentIncentive(page, size) {
        return __awaiter(this, void 0, void 0, function* () {
            const page_number = (page - 1) * size;
            const data = yield this.query()
                .select('incentive_id', 'account_name', 'agent_name', 'incentive_amount', 'incentive_created_date', 'incentive_note', this.db.raw(`CONCAT(user_first_name,' ',user_last_name) as created_by`), 'agent_create_date', 'incentive_is_deleted', 'incentive_vouchar_no')
                .from('trabill_incentive_income_details')
                .leftJoin('trabill_accounts', { account_id: 'incentive_account_id' })
                .leftJoin('trabill_agents_profile', { agent_id: 'incentive_agent_id' })
                .leftJoin('trabill_users', { user_id: 'agent_created_by' })
                .where('incentive_is_deleted', 0)
                .andWhere('incentive_type', 'AGENT')
                .andWhere('incentive_org_agency', this.org_agency)
                .limit(size)
                .offset(page_number);
            const [{ row_count }] = yield this.query()
                .select(this.db.raw(`COUNT(*) as row_count`))
                .from('trabill_incentive_income_details')
                .where('incentive_is_deleted', 0)
                .andWhere('incentive_type', 'AGENT')
                .andWhere('incentive_org_agency', this.org_agency);
            return { count: row_count, data };
        });
    }
    getAgentIncentiveById(incentive_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.query()
                .select('incentive_id', 'incentive_agent_id as agent_id', 'agent_name', 'incentive_account_id', 'account_name', 'account_branch_name', 'incentive_adjust_bill', 'incentive_amount', this.db.raw(`CASE WHEN incentive_account_category_id = 1 THEN 'Cash' WHEN incentive_account_category_id = 2 THEN 'Bank' WHEN incentive_account_category_id = 3 THEN 'Mobile Banking' WHEN incentive_account_category_id = 4 THEN 'Cheque' ELSE NULL END AS transaction_type`), this.db.raw(`concat(user_first_name,' ',user_last_name) as created_by`), 'incentive_is_deleted', 'incentive_trnxtype_id as type_id', 'trxntype_name', 'incentive_account_category_id', 'incentive_created_date', 'incentive_note')
                .from('trabill_incentive_income_details')
                .leftJoin('trabill_accounts', {
                'trabill_accounts.account_id': 'incentive_account_id',
            })
                .leftJoin('trabill_agents_profile', { agent_id: 'incentive_agent_id' })
                .leftJoin('trabill_transaction_type', {
                trxntype_id: 'incentive_trnxtype_id',
            })
                .leftJoin('trabill_users', { user_id: 'incentive_created_by' })
                .where('incentive_type', 'AGENT')
                .andWhere('incentive_id', incentive_id);
            return data;
        });
    }
}
exports.default = AgentProfileModels;
//# sourceMappingURL=agent_profile.models.js.map