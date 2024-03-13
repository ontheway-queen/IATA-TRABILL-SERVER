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
const abstract_controllers_1 = __importDefault(require("../../abstracts/abstract.controllers"));
const feedback_services_1 = __importDefault(require("./feedback.services"));
const feedback_validators_1 = __importDefault(require("./feedback.validators"));
class FeedbackController extends abstract_controllers_1.default {
    constructor() {
        super(...arguments);
        this.services = new feedback_services_1.default();
        this.validator = new feedback_validators_1.default();
        this.createFeedback = this.assyncWrapper.wrap(this.validator.createFeedback, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.createFeedback(req);
            if (data.success) {
                res.status(201).json(data);
            }
            else {
                this.error('Create Feedback');
            }
        }));
        this.getFeedbacks = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getFeedbacks(req);
            if (data.success) {
                res.status(201).json(data);
            }
            else {
                this.error('Get all feedback');
            }
        }));
    }
}
exports.default = FeedbackController;
//# sourceMappingURL=feedback.controller.js.map