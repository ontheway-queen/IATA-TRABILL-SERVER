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
const abstract_services_1 = __importDefault(require("../../abstracts/abstract.services"));
class feedbackServices extends abstract_services_1.default {
    constructor() {
        super(...arguments);
        this.createFeedback = (req) => __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const conn = this.models.feedbackModels(req);
            const data = yield conn.createFeedback(body);
            const message = 'Feedback has been created';
            return {
                success: true,
                message: message,
                id: data,
            };
        });
        this.getFeedbacks = (req) => __awaiter(this, void 0, void 0, function* () {
            const { page, size, search } = req.query;
            const conn = this.models.feedbackModels(req);
            const data = yield conn.getFeedbacks(Number(page) || 1, Number(size) || 20, search);
            const message = 'All Feedback list';
            return Object.assign({ success: true, message: message }, data);
        });
    }
}
exports.default = feedbackServices;
//# sourceMappingURL=feedback.services.js.map