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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app/app"));
const app = new app_1.default().app;
/*/
npx jest --testPathPattern=feedback.test.ts
/*/
describe('Feedback Add/List of Feedback', () => {
    let feedbackID;
    //Create feedback
    test.only('POST /api/v1/feedback creates an feedback', () => __awaiter(void 0, void 0, void 0, function* () {
        const newFeedback = {
            fd_agency_name: 'Agency Name Test',
            fd_subject: 'Subject Test',
            fd_message: 'Message Test',
            fd_user_experience: 'good',
            fd_customer_support: 'good',
            fd_software_update: 'good',
            fd_refer_other: '5',
            fd_most_useful_features: 'Invoice',
        };
        const response = yield (0, supertest_1.default)(app)
            .post('/api/v1/feedback')
            .send(newFeedback);
        const { text, status } = response;
        const { success, id } = JSON.parse(text);
        expect(success).toBe(true);
        expect(typeof id).toBe('number');
        feedbackID = id;
    }));
    // get all feedback
    test.only('GET /api/v1/feedback get all feedback', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get('/api/v1/feedback/?page=1&size=4');
        const { text, status } = response;
        const { success, count } = JSON.parse(text);
        expect(success).toBe(true);
        expect(typeof count).toBe('number');
    }));
    // delete feedback
    test.only('DELETE /api/v1/feedback/:id delete an account', () => __awaiter(void 0, void 0, void 0, function* () {
        const { text, status } = yield (0, supertest_1.default)(app).delete(`/api/v1/feedback/${feedbackID}`);
        const { success } = JSON.parse(text);
        expect(success).toBe(true);
    }));
});
//# sourceMappingURL=feedback.test.js.map