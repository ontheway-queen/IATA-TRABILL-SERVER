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
const invoicesTestData_1 = require("../demoData/invoicesTestData");
const app = new app_1.default().app;
describe('INVOICES , Invoice ummrah', () => {
    let invoiceId = 2258;
    // create account
    test.only('POST /api/v1/invoice-ummrah', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post('/api/v1/invoice-ummrah')
            .send(invoicesTestData_1.portInvoiceUmmrah);
        const { success, data } = JSON.parse(response.text);
        expect(response.status).toBe(200);
        expect(success).toBe(true);
        expect(typeof data.invoice_id).toBe('number');
        invoiceId = data.invoice_id;
    }));
    test.only('GET /api/v1/invoice-ummrah/:id GET FOR EDIT', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get(`/api/v1/invoice-ummrah/${invoiceId}`);
        const { success, data } = JSON.parse(response.text);
        expect(response.status).toBe(200);
        expect(success).toBe(true);
    }));
    test.only('GET /api/v1/invoice-ummrah/view/:id GET VIEW', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get(`/api/v1/invoice-ummrah/view/${invoiceId}`);
        const { success } = JSON.parse(response.text);
        expect(response.status).toBe(200);
        expect(success).toBe(true);
    }));
    test.only('GET /api/v1/invoice-ummrah?size=100&page=1 get all invoice ummrah', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get('/api/v1/invoice-ummrah?size=100&page=1');
        const { text, status } = response;
        const { success, count } = JSON.parse(text);
        expect(status).toBe(200);
        expect(success).toBe(true);
        expect(typeof count).toBe('number');
    }));
    test.only('PATCH /api/v1/invoice-ummrah/:id', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .patch(`/api/v1/invoice-ummrah/${invoiceId}`)
            .send(invoicesTestData_1.portInvoiceUmmrah);
        const { success, data } = JSON.parse(response.text);
        expect(response.status).toBe(200);
        expect(success).toBe(true);
    }));
    //   test.only('VOID /api/v1/invoice-ummrah/void/:id', async () => {
    //     const response = await request(app)
    //       .delete(`/api/v1/invoice-ummrah/void/${invoiceId}`)
    //       .send({
    //         invoice_has_deleted_by: 5,
    //         void_charge: 300,
    //       });
    //     const { success } = JSON.parse(response.text);
    //     expect(response.status).toBe(200);
    //     expect(success).toBe(true);
    //   });
    //   test.only('VOID, SHOULD RETURN FALSE /api/v1/invoice-ummrah/void/:id', async () => {
    //     const response = await request(app)
    //       .delete(`/api/v1/invoice-ummrah/void/2257`)
    //       .send({
    //         invoice_has_deleted_by: 5,
    //         void_charge: 300,
    //       });
    //     const { success } = JSON.parse(response.text);
    //     expect(response.status).toBe(400);
    //     expect(success).toBe(false);
    //   });
    test.only('DELETE /api/v1/invoice-ummrah/:id', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .delete(`/api/v1/invoice-ummrah/${invoiceId}`)
            .send({
            invoice_has_deleted_by: 5,
        });
        const { success } = JSON.parse(response.text);
        expect(response.status).toBe(200);
        expect(success).toBe(true);
    }));
    test.only('DELETE , SHOULD RETURN SUCCESS FALSE /api/v1/invoice-ummrah/:id ', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .delete(`/api/v1/invoice-ummrah/${invoiceId}`)
            .send({
            invoice_has_deleted_by: 5,
        });
        const { success } = JSON.parse(response.text);
        expect(response.status).toBe(400);
        expect(success).toBe(false);
    }));
});
//# sourceMappingURL=invoiceummrah.test.js.map