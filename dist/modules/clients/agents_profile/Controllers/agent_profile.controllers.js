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
const abstract_controllers_1 = __importDefault(require("../../../../abstracts/abstract.controllers"));
const agent_profile_services_1 = __importDefault(require("../Services/agent_profile.services"));
const agent_profile_validators_1 = __importDefault(require("../Validators/agent_profile.validators"));
class AgentProfileControllers extends abstract_controllers_1.default {
    constructor() {
        super();
        this.services = new agent_profile_services_1.default();
        this.validator = new agent_profile_validators_1.default();
        this.updateAgentsStatus = this.assyncWrapper.wrap(this.validator.updateAgentStatus, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.updateAgentsStatus(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('update agent status...');
            }
        }));
        this.createAgentProfile = this.assyncWrapper.wrap(this.validator.createAgentProfile, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.createAgentProfiles(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Create agent profile...');
            }
        }));
        this.getAllAgents = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAllAgent(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Get all agents...');
            }
        }));
        this.viewAllAgents = this.assyncWrapper.wrap(this.validator.readAllAgents, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.viewAllAgents(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Get all agents...');
            }
        }));
        this.getAgentById = this.assyncWrapper.wrap(this.validator.readAllAgents, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAgentById(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Get agent by Id...');
            }
        }));
        this.editEgentProfile = this.assyncWrapper.wrap(this.validator.updateAgentProfile, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.editAgentProfiles(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Edit agent profile...');
            }
        }));
        this.deleteAgentProfiles = this.assyncWrapper.wrap(this.validator.deleteAgentProfile, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.deleteAgentProfiles(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('Delete agent profile...');
            }
        }));
        this.viewAgents = this.assyncWrapper.wrap(this.validator.readAllAgents, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.viewAgents(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('');
            }
        }));
        this.createAgentIncentiveIncome = this.assyncWrapper.wrap(this.validator.createAgentIncentive, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.createAgentIncentiveIncome(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('');
            }
        }));
        this.editAgentIncentive = this.assyncWrapper.wrap(this.validator.editAgentIncentive, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.editAgentIncentive(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('');
            }
        }));
        this.getAgentIncentive = this.assyncWrapper.wrap(this.validator.readAgentIncentive, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAgentIncentive(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('');
            }
        }));
        this.getAgentIncentiveById = this.assyncWrapper.wrap(this.validator.readAgentIncentive, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAgentIncentiveById(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('');
            }
        }));
        this.deleteIncentiveIncome = this.assyncWrapper.wrap(this.validator.deleteAgentIncentive, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.deleteIncentiveIncome(req);
            if (data.success) {
                res.status(200).send(data);
            }
            else {
                this.error('');
            }
        }));
        this.getLocation = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getLocation(req);
            res.status(200).json(data);
        }));
    }
}
exports.default = AgentProfileControllers;
//# sourceMappingURL=agent_profile.controllers.js.map