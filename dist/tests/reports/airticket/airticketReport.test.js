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
const app_1 = __importDefault(require("../../../app/app"));
/*/
npx jest --testPathPattern=airticketReport.test.ts
/*/
const app = new app_1.default().app;
describe('Report:Air ticket report test', () => {
    test.only('GET /api/v1/report/air-ticket-summary', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get('/api/v1/report/air-ticket-summary');
        const { text, status } = response;
        const { success, count, data } = JSON.parse(text);
        if (count < 20) {
            expect(data.length).toBe(count);
        }
        expect(status).toBe(200);
        expect(success).toBe(true);
        expect(typeof count).toBe('number');
    }));
    // GET SUMMARY WITH WRONG CLIENT ID
    test.only('GET GET SUMMARY WITH WRONG CLIENT ID', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get('/api/v1/report/air-ticket-summary?client=client-10101010');
        const { text, status } = response;
        const { success, count, data } = JSON.parse(text);
        expect(data.length).toBe(0);
        expect(count).toBe(0);
        expect(status).toBe(200);
        expect(success).toBe(true);
        expect(typeof count).toBe('number');
    }));
});
//# sourceMappingURL=airticketReport.test.js.map