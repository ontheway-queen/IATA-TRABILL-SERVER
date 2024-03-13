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
    let invoiceId;
    // create account
    test.only('POST /api/v1/invoic-hajj/post', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post('/api/v1/invoic-hajj/post')
            .send(invoicesTestData_1.postInvoiceHajj);
        const { success, data } = JSON.parse(response.text);
        expect(response.status).toBe(200);
        expect(success).toBe(true);
        expect(typeof data.invoice_id).toBe('number');
        invoiceId = data.invoice_id;
    }));
    test.only('GET (FOR EDIT) /api/v1/invoic-hajj/get-for-edit/:id', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get(`/api/v1/invoic-hajj/get-for-edit/${invoiceId}`);
        const { success } = JSON.parse(response.text);
        expect(response.status).toBe(200);
        expect(success).toBe(true);
    }));
    test.only('GET view /api/v1/invoic-hajj/view/:id', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get(`/api/v1/invoic-hajj/view/${invoiceId}`);
        const { success } = JSON.parse(response.text);
        expect(response.status).toBe(200);
        expect(success).toBe(true);
    }));
    test.only('GET ALL DATA /api/v1/invoic-hajj/all/31?trash=0&size=100&page=1', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get(`/api/v1/invoic-hajj/all/31?trash=0&size=100&page=1`);
        const { success, message, count } = JSON.parse(response.text);
        expect(response.status).toBe(200);
        expect(success).toBe(true);
        expect(message).toBe('All Invoices Hajj');
        expect(count > 0).toBe(true);
    }));
    test.only('PATCH /api/v1/invoic-hajj/edit/:id', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .patch(`/api/v1/invoic-hajj/edit/${invoiceId}`)
            .send(invoicesTestData_1.updateInvoiceHajj);
        const { success, data } = JSON.parse(response.text);
        expect(response.status).toBe(200);
        expect(success).toBe(true);
        expect(data).toBe('Invoice updated successfully...');
    }));
    test.only('DLETE /api/v1/invoic-hajj/delete/:id ', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .delete(`/api/v1/invoic-hajj/delete/${invoiceId}`)
            .send({
            invoice_has_deleted_by: 5,
        });
        const { success, data } = JSON.parse(response.text);
        expect(response.status).toBe(200);
        expect(success).toBe(true);
        expect(data).toBe('Invoice deleted successfully...');
    }));
});
//# sourceMappingURL=invoicehajj.test.js.map