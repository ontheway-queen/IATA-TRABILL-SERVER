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
const app_1 = __importDefault(require("../../app/app"));
const supertest_1 = __importDefault(require("supertest"));
const app = new app_1.default().app;
describe('Airticket refund action', () => {
    let refundId;
    test.only('POST /api/v1/refund/air-ticket-refund', () => __awaiter(void 0, void 0, void 0, function* () {
        const newRefund = {
            vouchar_no: 'AT_REF_1684044196',
            comb_client: 'client-2',
            invoice_id: 79,
            created_by: 5,
            date: '2023-05-14',
            profit: 400,
            client_refund_info: {
                crefund_payment_type: 'ADJUST',
                payment_method: 1,
                crefund_account_id: 1,
                crefund_date: '2023-05-14',
                crefund_total_amount: 125000,
                crefund_charge_amount: 100,
                trxn_charge_amount: 140,
                crefund_return_amount: 124900,
                withdraw_date: '2023-05-14',
            },
            vendor_refund_info: [
                {
                    airticket_invoice_id: 79,
                    invoice_category_id: 1,
                    airticket_id: 12,
                    airticket_vendor_id: 'vendor-2',
                    airticket_ticket_no: '001',
                    combined_last_balance: '-103775.00',
                    combine_name: 'Sefat Alam Comb',
                    client_charge: 100,
                    vrefund_charge_amount: 200,
                    vrefund_payment_type: 'ADJUST',
                    payment_method: 1,
                    trxn_charge_amount: 123,
                    vrefund_account_id: 1,
                    advance_amount: 113175,
                    vrefund_return_amount: 113175,
                    vrefund_date: '2023-05-14',
                    vrefund_total_amount: 113375,
                    vrefund_adjust: null,
                    withdraw_date: '2023-05-14',
                },
            ],
        };
        const { status, text } = yield (0, supertest_1.default)(app)
            .post('/api/v1/refund/air-ticket-refund')
            .send(newRefund);
        const { success, message, refund_id } = JSON.parse(text);
        refundId = refund_id;
        expect(typeof refund_id).toBe('number');
        expect(status).toBe(201);
        expect(success).toBe(true);
    }));
    test.only('GET /api/v1/refund/air-ticket-refund get all airticket refund', () => __awaiter(void 0, void 0, void 0, function* () {
        const { status, text } = yield (0, supertest_1.default)(app).get(`/api/v1/refund/air-ticket-refund?trash=0&page=1&size=100`);
        const { success, count } = JSON.parse(text);
        expect(status).toBe(200);
        expect(success).toBe(true);
        expect(typeof count).toBe('number');
    }));
    test.only('GET /api/v1/refund/air-ticket-refund get all with search airticket refund', () => __awaiter(void 0, void 0, void 0, function* () {
        const { status, text } = yield (0, supertest_1.default)(app).get(`/api/v1/refund/air-ticket-refund?trash=0&page=1&size=100&from_date=2023-01-01&to_date=2024-12-12&search=AR-REF`);
        const { success, count } = JSON.parse(text);
        expect(status).toBe(200);
        expect(success).toBe(true);
        expect(typeof count).toBe('number');
    }));
    const deleted_by = {
        atrefund_is_deleted: 5,
    };
    test.only('GET /api/v1/refund/air-ticket-refund/:refund_id get as refund', () => __awaiter(void 0, void 0, void 0, function* () {
        const { status, text } = yield (0, supertest_1.default)(app).get(`/api/v1/refund/air-ticket-refund/${refundId}`);
        const { success } = JSON.parse(text);
        expect(status).toBe(200);
        expect(success).toBe(true);
    }));
    test.only('DELETE /api/v1/refund/air-ticket-refund/:refund_id', () => __awaiter(void 0, void 0, void 0, function* () {
        const { status, text } = yield (0, supertest_1.default)(app)
            .delete(`/api/v1/refund/air-ticket-refund/${refundId}`)
            .send(deleted_by);
        const { success, message } = JSON.parse(text);
        expect(status).toBe(200);
        expect(success).toBe(true);
        expect(message).toBe('Airticket refund has been deleted');
    }));
});
//# sourceMappingURL=airticketRefund.test.js.map