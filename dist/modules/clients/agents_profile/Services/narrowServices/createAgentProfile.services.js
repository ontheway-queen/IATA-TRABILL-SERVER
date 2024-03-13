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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
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
            const imageList = req.imgUrl;
            const { agent_image_copy, agent_nid_front, agent_nid_back } = data, othersInfo = __rest(data, ["agent_image_copy", "agent_nid_front", "agent_nid_back"]);
            const mergedImageObject = imageList.reduce((acc, image) => Object.assign(acc, image), {});
            const agentInfo = Object.assign(Object.assign({}, othersInfo), mergedImageObject);
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.agentProfileModel(req, trx);
                const agent_id = yield conn.createAgentProfile(agentInfo);
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