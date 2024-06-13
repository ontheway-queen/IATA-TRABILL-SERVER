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
class EditAgnetProfile extends abstract_services_1.default {
    constructor() {
        super();
        this.editAgentProfile = (req) => __awaiter(this, void 0, void 0, function* () {
            const agentId = req.params.id;
            const body = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.agentProfileModel(req, trx);
                const files = req.files;
                const { agent_image_copy, agent_nid_back, agent_nid_front } = yield conn.getPrevImages(agentId);
                if (files && files.length) {
                    files.map((item) => __awaiter(this, void 0, void 0, function* () {
                        if (item.fieldname === 'agent_image_copy') {
                            body.agent_image_copy = item.filename;
                            agent_image_copy &&
                                (yield this.manageFile.deleteFromCloud([agent_image_copy]));
                        }
                        if (item.fieldname === 'agent_nid_front') {
                            body.agent_nid_front = item.filename;
                            agent_nid_front &&
                                (yield this.manageFile.deleteFromCloud([agent_nid_front]));
                        }
                        if (item.fieldname === 'agent_nid_back') {
                            body.agent_nid_back = item.filename;
                            agent_nid_back &&
                                (yield this.manageFile.deleteFromCloud([agent_nid_back]));
                        }
                    }));
                }
                yield conn.editAgentProfile(agentId, body);
                const message = `Agent profile -${body.agent_name}- has been updated`;
                yield this.insertAudit(req, 'update', message, body.agent_updated_by, 'ACCOUNTS');
                return {
                    success: true,
                    message: 'Agent profile updated successfully',
                };
            }));
        });
    }
}
exports.default = EditAgnetProfile;
//# sourceMappingURL=editAgentProfile.services.js.map