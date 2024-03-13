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
describe('API Endpoints for invoice airitckets', () => {
    let invoiceid;
    describe('POST /api/v1/invoice-air-ticket', () => {
        it('should create a invoice airticket', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app)
                .post('/api/v1/invoice-air-ticket')
                .send(invoicesTestData_1.postInvoiceAirticket);
            const { success, data, message } = JSON.parse(response.text);
            expect(response.status).toBe(200);
            expect(success).toBe(true);
            expect(message).toBe('Invoice airticket has been added');
            invoiceid = data.invoice_id;
        }));
    });
    it('should return a list of airtickets', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get('/api/v1/invoice-air-ticket');
        const { success, message } = JSON.parse(response.text);
        expect(response.status).toBe(200);
        expect(success).toBe(true);
        expect(message).toBe('All Invoices Airticket');
    }));
    describe('TEST ALL API WITH ID FOR INVOICE AIRTICKET', () => {
        it('should return a single invoice for edit', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app).get(`/api/v1/invoice-air-ticket/${invoiceid}`);
            const { success } = JSON.parse(response.text);
            expect(response.status).toBe(200);
            expect(success).toBe(true);
        }));
    });
});
//# sourceMappingURL=invoiceAirticket.test.js.map