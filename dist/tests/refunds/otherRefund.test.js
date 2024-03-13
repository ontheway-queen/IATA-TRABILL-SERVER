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
const app_1 = __importDefault(require("../../app/app"));
const app = new app_1.default().app;
describe('Other Refund Actions', () => {
    let refundId;
    test.only('POST /api/v1/refund/other-refund Create Other Refund', () => __awaiter(void 0, void 0, void 0, function* () {
        const newRefund = {
            comb_client: 'combined-1',
            voucher_no: 'OTHER_REF_1683689405',
            created_by: 5,
            invoice_id: 89,
            client_refund_info: {
                crefund_payment_type: 'ADJUST',
                payment_type_id: 1,
                trxn_charge_amount: 140,
                account_id: 1,
                date: '2023-05-10',
                crefund_note: 'Abcd',
                total_refund_amount: 24000,
                total_refund_charge: 120,
                total_return_amount: 25200,
            },
            vendor_refund_info: [
                {
                    vrefund_bill_id: 40,
                    comb_vendor_id: 'vendor-6',
                    vrefund_product_id: 106,
                    vrefund_quantity: 1,
                    billing_remaining_quantity: 5,
                    vrefund_charge: 400,
                    payment_method: 1,
                    trxn_charge_amount: 230,
                    vrefund_account_id: 3,
                    vrefund_amount: 1000,
                    vrefund_return_amount: 500,
                    vrefund_payment_type: 'ADJUST',
                    vrefund_invoice_category_id: 5,
                    vrefund_date: '2023-05-10',
                },
            ],
        };
        const response = yield (0, supertest_1.default)(app)
            .post('/api/v1/refund/other-refund')
            .send(newRefund);
        const { success, message, refund_id } = JSON.parse(response.text);
        expect(response.status).toBe(201);
        expect(success).toBe(true);
        // expect(typeof data.refund_id).toBe('number');
        refundId = refund_id;
    }));
    test.only('GET /api/v1/refund/other-refund get all other refunds', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get('/api/v1/refund/other-refund?trash=0&page=1&size=10');
        const text = response.text;
        const { success, count } = JSON.parse(text);
        expect(response.statusCode).toBe(200);
        expect(success).toBe(true);
        expect(typeof count).toBe('number');
    }));
    test.only('GET /api/v1/refund/other-refund get all other refunds with search', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get('/api/v1/refund/other-refund?trash=0&page=1&size=100&from_date=2023-01-01&to_date=2023-12-12&search=OTHER-REF');
        const text = response.text;
        const { success, count } = JSON.parse(text);
        expect(response.statusCode).toBe(200);
        expect(success).toBe(true);
        expect(typeof count).toBe('number');
    }));
    test.only('GET /api/v1/refund/other-refund/:refund_id Get an single refund', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get(`/api/v1/refund/other-refund/${refundId}`);
        const { success } = JSON.parse(response.text);
        expect(response.status).toBe(200);
        expect(success).toBe(true);
    }));
    const deleted_by = { refund_deleted_by: 5 };
    test.only('DELETE /api/v1/refund/other-refund/:refund_id', () => __awaiter(void 0, void 0, void 0, function* () {
        const { status, text } = yield (0, supertest_1.default)(app)
            .delete(`/api/v1/refund/other-refund/${refundId}`)
            .send(deleted_by);
        const { success, message } = JSON.parse(text);
        expect(status).toBe(200);
        expect(success).toBe(true);
        expect(message).toBe('Other refund deleted successfully');
    }));
});
//# sourceMappingURL=otherRefund.test.js.map