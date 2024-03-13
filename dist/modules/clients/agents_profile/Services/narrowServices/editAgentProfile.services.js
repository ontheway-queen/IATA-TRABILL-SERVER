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
class EditAgnetProfile extends abstract_services_1.default {
    constructor() {
        super();
        this.RecruitContainer = 'recruitmentcon';
        this.editAgentProfile = (req) => __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const imageList = req.imgUrl;
            const agentId = req.params.id;
            const initialMergedImageObject = {
                agent_image_copy: '',
                agent_nid_front: '',
                agent_nid_back: '',
            };
            const { agent_image_copy, agent_nid_front, agent_nid_back } = body, othersInfo = __rest(body, ["agent_image_copy", "agent_nid_front", "agent_nid_back"]);
            const mergedImageObject = imageList.reduce((acc, image) => Object.assign(acc, image), initialMergedImageObject);
            const updatedDataFromBody = {
                agent_image_copy: mergedImageObject.agent_image_copy || agent_image_copy,
                agent_nid_front: mergedImageObject.agent_nid_front || agent_nid_front,
                agent_nid_back: mergedImageObject.agent_nid_back || agent_nid_back,
            };
            const AgentDataWithImage = Object.assign(Object.assign({}, othersInfo), updatedDataFromBody);
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.agentProfileModel(req, trx);
                if (mergedImageObject === null || mergedImageObject === void 0 ? void 0 : mergedImageObject.agent_image_copy) {
                    const ImgURL = yield conn.getPreviousImage(agentId, 'agent_image_copy');
                    if (ImgURL) {
                        yield this.deleteFile.delete_image(ImgURL, this.RecruitContainer);
                    }
                }
                if (mergedImageObject === null || mergedImageObject === void 0 ? void 0 : mergedImageObject.agent_nid_front) {
                    const ImgURL = yield conn.getPreviousImage(agentId, 'agent_nid_front');
                    if (ImgURL) {
                        yield this.deleteFile.delete_image(ImgURL, this.RecruitContainer);
                    }
                }
                if (mergedImageObject === null || mergedImageObject === void 0 ? void 0 : mergedImageObject.agent_nid_back) {
                    const ImgURL = yield conn.getPreviousImage(agentId, 'agent_nid_back');
                    if (ImgURL) {
                        yield this.deleteFile.delete_image(ImgURL, this.RecruitContainer);
                    }
                }
                yield conn.editAgentProfile(agentId, AgentDataWithImage);
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