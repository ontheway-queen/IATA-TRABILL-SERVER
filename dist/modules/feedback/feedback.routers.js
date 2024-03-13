"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_routers_1 = __importDefault(require("../../abstracts/abstract.routers"));
const feedback_controller_1 = __importDefault(require("./feedback.controller"));
class FeedbackRouter extends abstract_routers_1.default {
    constructor() {
        super();
        this.controllers = new feedback_controller_1.default();
        this.callRouter();
    }
    callRouter() {
        this.routers
            .route('/')
            .post(this.controllers.createFeedback)
            .get(this.controllers.getFeedbacks);
    }
}
exports.default = FeedbackRouter;
//# sourceMappingURL=feedback.routers.js.map