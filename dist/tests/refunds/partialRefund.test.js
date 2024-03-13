"use strict";
/*
Create partial refund test script
@Author MD Sabbir <sabbir.m360ict@gmail.com>
*/
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
// npx jest --testPathPattern=tests/refunds/partialRefund.test.ts
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../app/app"));
const app = new app_1.default().app;
describe('Partial Refund Actions', () => {
    let refundId;
    test.only('POST /api/v1/refund/persial-refund create partial refund', () => __awaiter(void 0, void 0, void 0, function* () {
        const newRefund = {
            invoice_id: 16632,
            comb_client: 'client-16472',
            created_by: 5,
            prfnd_account_id: 1376,
            prfnd_charge_amount: 1,
            prfnd_return_amount: 200,
            prfnd_total_amount: 500,
            prfnd_profit_amount: 432,
            date: '2023-10-12',
            note: 'Oo yeahhhhhh',
            prfnd_payment_method: 1,
            prfnd_payment_type: 'ADJUST',
            vendor_refund_info: [
                {
                    vprfnd_airticket_id: 5163,
                    vprfnd_account_id: 1376,
                    vprfnd_payment_method: 1,
                    vprfnd_payment_type: 'ADJUST',
                    vprfnd_charge_amount: 50,
                    vprfnd_return_amount: 450,
                    vprfnd_total_amount: 500,
                    comb_vendor: 'vendor-2592',
                },
            ],
        };
        const { status, text } = yield (0, supertest_1.default)(app)
            .post(`/api/v1/refund/persial-refund`)
            .send(newRefund);
        const { success, refund_id } = JSON.parse(text);
        refundId = refund_id;
        expect(status).toBe(201);
        expect(success).toBe(true);
    }));
    test.only('GET /api/v1/refund/persial-refund Get All Refunds', () => __awaiter(void 0, void 0, void 0, function* () {
        const { status, text } = yield (0, supertest_1.default)(app).get('/api/v1/refund/persial-refund?page=1&size=200');
        const { success, count } = JSON.parse(text);
        expect(status).toBe(200);
        expect(success).toBe(true);
        expect(typeof count).toBe('number');
    }));
    test.only('GET /api/v1/refund/persial-refund/:refund_id Get Single Refund', () => __awaiter(void 0, void 0, void 0, function* () {
        const { status, text } = yield (0, supertest_1.default)(app).get(`/api/v1/refund/persial-refund/${refundId}`);
        const { success, data } = JSON.parse(text);
        expect(status).toBe(200);
        expect(success).toBe(true);
        expect(data === null || data === void 0 ? void 0 : data.prfnd_id).toBe(refundId);
    }));
    test.only('DELETE /api/v1/refund/persial-refund/:refund_id Delete Refund', () => __awaiter(void 0, void 0, void 0, function* () {
        const { status, text } = yield (0, supertest_1.default)(app)
            .delete(`/api/v1/refund/persial-refund/${refundId}`)
            .send({ deleted_by: 5 });
        const { success, message } = JSON.parse(text);
        expect(status).toBe(200);
        expect(success).toBe(true);
        expect(message).toBe('Persial refund deleted successfuly');
    }));
});
//# sourceMappingURL=partialRefund.test.js.map