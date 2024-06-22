"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_routers_1 = __importDefault(require("../../../../abstracts/abstract.routers"));
const agent_profile_controllers_1 = __importDefault(require("../Controllers/agent_profile.controllers"));
class AgentProfileRoutes extends abstract_routers_1.default {
    constructor() {
        super();
        this.controllers = new agent_profile_controllers_1.default();
        this.callRouter();
    }
    callRouter() {
        this.routers.patch('/activity/:agent_id', this.controllers.updateAgentsStatus);
        this.routers.post('/create', this.uploader.cloudUploadRaw(this.fileFolder.TRABILL_FILE), this.controllers.createAgentProfile);
        this.routers.get('/agents', this.controllers.getAllAgents);
        this.routers
            .route('/agent/:id')
            .get(this.controllers.getAgentById)
            .patch(this.uploader.cloudUploadRaw(this.fileFolder.TRABILL_FILE), this.controllers.editEgentProfile)
            .delete(this.controllers.deleteAgentProfiles);
        this.routers.get('/get-all', this.controllers.viewAgents);
        this.routers.get('/view_all', this.controllers.viewAllAgents);
        // Incetive Income Agent
        this.routers
            .route('/incentive')
            .post(this.controllers.createAgentIncentiveIncome)
            .get(this.controllers.getAgentIncentive);
        this.routers
            .route('/incentive/:incentive_id')
            .patch(this.controllers.editAgentIncentive)
            .get(this.controllers.getAgentIncentiveById)
            .delete(this.controllers.deleteIncentiveIncome);
        this.routers.post('/check-location', this.controllers.getLocation);
    }
}
exports.default = AgentProfileRoutes;
//# sourceMappingURL=agent_profile.routers.js.map