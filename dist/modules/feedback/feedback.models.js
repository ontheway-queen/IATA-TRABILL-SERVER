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
const abstract_models_1 = __importDefault(require("../../abstracts/abstract.models"));
class FeedbackModel extends abstract_models_1.default {
    constructor() {
        super(...arguments);
        this.createFeedback = (body) => __awaiter(this, void 0, void 0, function* () {
            const [feedback] = yield this.query()
                .insert(Object.assign(Object.assign({}, body), { fd_agency_id: this.org_agency }))
                .into('trabill_agency_feedback');
            return feedback;
        });
        this.getFeedbacks = (page, size, search) => __awaiter(this, void 0, void 0, function* () {
            const offset = (page - 1) * size;
            const data = yield this.query()
                .select('fd_id', 'fd_created_date', 'orgInfo.org_name as agency_name', 'orgInfo.org_owner_email as agency_email', 'orgInfo.org_address1 as agency_address', 'orgInfo.org_mobile_number as agency_mobile_no', 'fd_agency_name', 'fd_subject', 'fd_message', 'fd_user_experience', 'fd_customer_support', 'fd_software_update', 'fd_satisfied', 'fd_refer_other', 'fd_most_useful_features')
                .from('trabill_agency_feedback')
                .modify((value) => {
                if (search) {
                    value.where('orgInfo.org_name', 'like', `%${search}%`);
                }
            })
                .leftJoin('trabill_agency_organization_information as orgInfo', {
                org_id: 'fd_agency_id',
            })
                .limit(size)
                .offset(offset)
                .orderBy('fd_id', 'desc');
            const [{ row_count }] = yield this.query()
                .select(this.db.raw('count(*) as row_count'))
                .from('trabill_agency_feedback')
                .leftJoin('trabill_agency_organization_information as orgInfo', {
                org_id: 'fd_agency_id',
            })
                .modify((value) => {
                if (search) {
                    value.where('orgInfo.org_name', 'like', `%${search}%`);
                }
            });
            return { count: row_count, data };
        });
    }
}
exports.default = FeedbackModel;
//# sourceMappingURL=feedback.models.js.map