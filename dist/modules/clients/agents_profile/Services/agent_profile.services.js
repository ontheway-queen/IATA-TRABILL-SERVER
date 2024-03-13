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
const createAgentProfile_services_1 = __importDefault(require("./narrowServices/createAgentProfile.services"));
const deleteAgentProfile_services_1 = __importDefault(require("./narrowServices/deleteAgentProfile.services"));
const editAgentProfile_services_1 = __importDefault(require("./narrowServices/editAgentProfile.services"));
const incentiveIncomeAgentProfile_services_1 = __importDefault(require("./narrowServices/incentiveIncomeAgentProfile.services"));
const node_fetch_1 = __importDefault(require("node-fetch"));
class AgentProfileServices extends abstract_services_1.default {
    constructor() {
        super();
        /**
         * update agent activity status
         */
        this.updateAgentsStatus = (req) => __awaiter(this, void 0, void 0, function* () {
            const agent_id = req.params.agent_id;
            const { status, created_by } = req.body;
            const conn = this.models.agentProfileModel(req);
            const data = yield conn.updateAgentsStatus(agent_id, status);
            const message = 'Agent has been updated';
            yield this.insertAudit(req, 'update', message, created_by, 'ACCOUNTS');
            return {
                success: true,
                data,
                message: 'Agent status updated successfully!',
            };
        });
        this.getAllAgent = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.agentProfileModel(req);
            const data = yield conn.getAllAgent();
            return { success: true, data };
        });
        this.viewAllAgents = (req) => __awaiter(this, void 0, void 0, function* () {
            const { search } = req.query;
            const conn = this.models.agentProfileModel(req);
            const data = yield conn.viewAllAgents(search);
            return { success: true, data };
        });
        this.getAgentById = (req) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const conn = this.models.agentProfileModel(req);
            const data = yield conn.getAllAgentById(id);
            return { success: true, data };
        });
        this.viewAgents = (req) => __awaiter(this, void 0, void 0, function* () {
            const { page, size, search, from_date, to_date } = req.query;
            const conn = this.models.agentProfileModel(req);
            const data = yield conn.viewAgents(Number(page) || 1, Number(size) || 20, search, from_date, to_date);
            return Object.assign({ success: true }, data);
        });
        this.getAgentIncentive = (req) => __awaiter(this, void 0, void 0, function* () {
            const { trash, page, size } = req.query;
            const conn = this.models.agentProfileModel(req);
            const data = yield conn.getAgentIncentive(Number(page) || 1, Number(size) || 20);
            return Object.assign({ success: true }, data);
        });
        this.getAgentIncentiveById = (req) => __awaiter(this, void 0, void 0, function* () {
            const { incentive_id } = req.params;
            const conn = this.models.agentProfileModel(req);
            const data = yield conn.getAgentIncentiveById(incentive_id);
            return {
                success: true,
                data,
            };
        });
        this.getLocation = (req) => __awaiter(this, void 0, void 0, function* () {
            const fetch_data = yield (0, node_fetch_1.default)(`https://ipapi.co/${req.ip}/json/`);
            return fetch_data.body;
        });
        this.createAgentProfiles = new createAgentProfile_services_1.default().createAgentProfile;
        this.editAgentProfiles = new editAgentProfile_services_1.default().editAgentProfile;
        this.deleteAgentProfiles = new deleteAgentProfile_services_1.default().deleteAgentProfile;
        this.createAgentIncentiveIncome = new incentiveIncomeAgentProfile_services_1.default().create;
        this.editAgentIncentive = new incentiveIncomeAgentProfile_services_1.default()
            .editAgentIncentive;
        this.deleteIncentiveIncome = new incentiveIncomeAgentProfile_services_1.default()
            .deleteIncentiveIncome;
    }
}
exports.default = AgentProfileServices;
//# sourceMappingURL=agent_profile.services.js.map