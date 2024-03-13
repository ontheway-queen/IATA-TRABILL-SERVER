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
npx jest --testPathPattern=dashboard.test.ts
/*/
describe('Dashboard data get', () => {
    // GET LOAN DETAILS
    test.only('GET /api/v1/dashboard/loan-details LOAN DETAILS', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get('/api/v1/dashboard/loan-details');
        const { text, status } = response;
        const { success } = JSON.parse(text);
        expect(status).toBe(200);
        expect(success).toBe(true);
    }));
    test.only('GET /api/v1/dashboard/acc-details ACCOUNT DETAILS', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get('/api/v1/dashboard/acc-details');
        const { text, status } = response;
        const { success } = JSON.parse(text);
        expect(status).toBe(200);
        expect(success).toBe(true);
    }));
    test.only('GET /api/v1/dashboard/acc-trans ACCOUNT TRANSACTION FROM DASHBOARD', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get('/api/v1/dashboard/acc-trans');
        const { text, status } = response;
        const { success } = JSON.parse(text);
        expect(status).toBe(200);
        expect(success).toBe(true);
    }));
});
//# sourceMappingURL=dashboard.test.js.map