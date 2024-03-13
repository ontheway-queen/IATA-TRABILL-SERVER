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
class DeleteAgentProfile extends abstract_services_1.default {
    constructor() {
        super();
        this.deleteAgentProfile = (req) => __awaiter(this, void 0, void 0, function* () {
            const { agent_deleted_by } = req.body;
            const agentId = req.params.id;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.agentProfileModel(req, trx);
                // const agnetTransactions = await conn.getAgentTransactions(agentId);
                /*       if (agnetTransactions[0]) {
                        throw new CustomError(
                          "Agent have some transactions you can't delete the agent",
                          400,
                          'Bad Request'
                        );
                      } */
                yield conn.deleteAgentProfile(agentId, agent_deleted_by);
                const message = `Agent profile has been deleted`;
                yield this.insertAudit(req, 'delete', message, agent_deleted_by, 'ACCOUNTS');
                return {
                    success: true,
                    message: 'Delete agent profile successfully',
                };
            }));
        });
    }
}
exports.default = DeleteAgentProfile;
//# sourceMappingURL=deleteAgentProfile.services.js.map