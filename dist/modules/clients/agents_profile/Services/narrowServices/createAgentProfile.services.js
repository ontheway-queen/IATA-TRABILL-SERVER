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
class CreateAgentProfile extends abstract_services_1.default {
    constructor() {
        super();
        this.createAgentProfile = (req) => __awaiter(this, void 0, void 0, function* () {
            const data = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.agentProfileModel(req, trx);
                const files = req.files;
                if (files && files.length) {
                    files.map((item) => {
                        if (item.fieldname === 'agent_image_copy') {
                            data.agent_image_copy = item.filename;
                        }
                        if (item.fieldname === 'agent_nid_front') {
                            data.agent_nid_front = item.filename;
                        }
                        if (item.fieldname === 'agent_nid_back') {
                            data.agent_nid_back = item.filename;
                        }
                    });
                }
                const agent_id = yield conn.createAgentProfile(data);
                // insert audit
                const message = `Agent profile -${data.agent_name}- has been created`;
                yield this.insertAudit(req, 'create', message, data.agent_created_by, 'ACCOUNTS');
                return {
                    success: true,
                    message: 'Create agent profile successfully',
                    data: agent_id[0],
                };
            }));
        });
    }
}
exports.default = CreateAgentProfile;
//# sourceMappingURL=createAgentProfile.services.js.map