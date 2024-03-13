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
npx jest --testPathPattern=accounts.test.ts
/*/
describe('Account Add/List of Accounts', () => {
    let newAccId;
    // create account
    test.only('POST /api/v1/accounts/create creates an account', () => __awaiter(void 0, void 0, void 0, function* () {
        const newAccount = {
            account_acctype_id: 1,
            account_name: 'Account From Jest',
            account_created_by: 5,
            opening_balance: 200,
            account_number: '01705511718',
            account_bank_name: 'Test Bank',
            account_branch_name: 'Hello Branch',
        };
        const response = yield (0, supertest_1.default)(app)
            .post('/api/v1/accounts/create')
            .send(newAccount);
        const { success, data } = JSON.parse(response.text);
        expect(response.status).toBe(201);
        expect(success).toBe(true);
        expect(typeof data.account_id).toBe('number');
        newAccId = data.account_id;
    }));
    // get all accounts
    test.only('GET /api/v1/accounts get all account', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get('/api/v1/accounts/all?page=1&size=4');
        const { text, status } = response;
        const { success, count } = JSON.parse(text);
        expect(status).toBe(200);
        expect(success).toBe(true);
        expect(typeof count).toBe('number');
    }));
    // update account
    test.only('PATCH /api/v1/accounts/edit/:id update an account ', () => __awaiter(void 0, void 0, void 0, function* () {
        const newAccount = {
            account_acctype_id: 1,
            account_name: 'UpdatedAcc From Jest',
            account_updated_by: 5,
            opening_balance: 200,
        };
        const response = yield (0, supertest_1.default)(app)
            .patch(`/api/v1/accounts/edit/${newAccId}`)
            .send(newAccount);
        const { text, status } = response;
        const { success } = JSON.parse(text);
        expect(status).toBe(200);
        expect(success).toBe(true);
    }));
    // get single account
    test.only('GET /api/v1/accounts/single-account/:id get an single account', () => __awaiter(void 0, void 0, void 0, function* () {
        const { text, status } = yield (0, supertest_1.default)(app).get(`/api/v1/accounts/single-account/${newAccId}`);
        const { success } = JSON.parse(text);
        expect(status).toBe(200);
        expect(success).toBe(true);
    }));
    // get account statements
    test.only('GET /api/v1/accounts/account-statement/:id get account statements', () => __awaiter(void 0, void 0, void 0, function* () {
        const { text, status } = yield (0, supertest_1.default)(app).get(`/api/v1/accounts/account-statement/${newAccId}`);
        const { success } = JSON.parse(text);
        expect(status).toBe(200);
        expect(success).toBe(true);
    }));
    // get account history
    test.only('GET /api/v1/accounts/transaction-history/:id get account history', () => __awaiter(void 0, void 0, void 0, function* () {
        const { text, status } = yield (0, supertest_1.default)(app).get(`/api/v1/accounts/transaction-history/${newAccId}`);
        const { success } = JSON.parse(text);
        expect(status).toBe(200);
        expect(success).toBe(true);
    }));
    // get account category
    test.only('GET /api/v1/accounts/account-category get an single account', () => __awaiter(void 0, void 0, void 0, function* () {
        const { text, status } = yield (0, supertest_1.default)(app).get(`/api/v1/accounts/account-category`);
        const { success } = JSON.parse(text);
        expect(status).toBe(200);
        expect(success).toBe(true);
    }));
    // get account balance status
    test.only('GET /api/v1/accounts/balance-status get account balance status', () => __awaiter(void 0, void 0, void 0, function* () {
        const { text, status } = yield (0, supertest_1.default)(app).get(`/api/v1/accounts/balance-status`);
        const { success } = JSON.parse(text);
        expect(status).toBe(200);
        expect(success).toBe(true);
    }));
    describe('Account Opening Balance', () => {
        let openingBalId;
        // account opening balance
        test.only('POST /api/v1/accounts/account-opening account opening balance add', () => __awaiter(void 0, void 0, void 0, function* () {
            const newAccount = {
                type_id: 1,
                account_id: newAccId,
                transaction_type: 'CREDIT',
                amount: 10000,
                account_created_by: 5,
                date: '2023-09-29',
            };
            const response = yield (0, supertest_1.default)(app)
                .post('/api/v1/accounts/account-opening')
                .send(newAccount);
            const { success, data } = JSON.parse(response.text);
            openingBalId = data;
            expect(response.status).toBe(200);
            expect(success).toBe(true);
        }));
        // CLIENT opening balance
        test.only('POST /api/v1/accounts/client-opening CLIENT opening balance add', () => __awaiter(void 0, void 0, void 0, function* () {
            const newAccount = {
                amount: 5000,
                client_id: 36230,
                transaction_type: 'CREDIT',
                transaction_created_by: 5,
                date: '2023-09-29',
            };
            const response = yield (0, supertest_1.default)(app)
                .post('/api/v1/accounts/client-opening')
                .send(newAccount);
            const { success } = JSON.parse(response.text);
            expect(response.status).toBe(200);
            expect(success).toBe(true);
        }));
        // VENDOR opening balance
        test.only('POST /api/v1/accounts/vendor-opening VENDOR opening balance add', () => __awaiter(void 0, void 0, void 0, function* () {
            const newAccount = {
                amount: 5000,
                vendor_id: 4992,
                transaction_type: 'CREDIT',
                transaction_created_by: 5,
            };
            const response = yield (0, supertest_1.default)(app)
                .post('/api/v1/accounts/vendor-opening')
                .send(newAccount);
            const { success } = JSON.parse(response.text);
            expect(response.status).toBe(200);
            expect(success).toBe(true);
        }));
        // COMBINED opening balance
        test.only('POST /api/v1/accounts/combine-opening COMBINED opening balance add', () => __awaiter(void 0, void 0, void 0, function* () {
            const newAccount = {
                combine_id: 1477,
                transaction_created_by: 5,
                amount: 2000,
                transaction_type: 'CREDIT',
                date: '2023-04-26',
            };
            const response = yield (0, supertest_1.default)(app)
                .post('/api/v1/accounts/combine-opening')
                .send(newAccount);
            const { success } = JSON.parse(response.text);
            expect(response.status).toBe(200);
            expect(success).toBe(true);
        }));
        // get all OPENING BALANCE
        test.only('GET /api/v1/accounts/opening-balance?page=1&size=10 get all OPENING BALANCE', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app).get('/api/v1/accounts/opening-balance?page=1&size=10');
            const { text, status } = response;
            const { success, count } = JSON.parse(text);
            expect(status).toBe(200);
            expect(success).toBe(true);
            expect(typeof count).toBe('number');
        }));
        // delete OPENING BALANCE
        test.only('DELETE /api/v1/accounts/opening-balance/:id delete an OPENING BALANCE', () => __awaiter(void 0, void 0, void 0, function* () {
            const body = {
                delete_by: 5,
            };
            const { text, status } = yield (0, supertest_1.default)(app)
                .delete(`/api/v1/accounts/opening-balance/${openingBalId}`)
                .send(body);
            const { success } = JSON.parse(text);
            expect(status).toBe(200);
            expect(success).toBe(true);
        }));
    });
    describe('Account Balance Transfer', () => {
        let openingBalId;
        test.only('POST /api/v1/accounts/balance-transfer account balance transfer add', () => __awaiter(void 0, void 0, void 0, function* () {
            const newAccount = {
                transfer_from_id: 2429,
                transfer_to_id: newAccId,
                transfer_amount: 10,
                transfer_date: '2023-09-29',
                transfer_created_by: 5,
            };
            const response = yield (0, supertest_1.default)(app)
                .post('/api/v1/accounts/balance-transfer')
                .send(newAccount);
            const { success, data } = JSON.parse(response.text);
            openingBalId = data;
            expect(response.status).toBe(200);
            expect(success).toBe(true);
        }));
        // get all OPENING BALANCE
        test.only('GET /api/v1/accounts/balance-transfer get all BALANCE TRANSFER', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app).get('/api/v1/accounts/balance-transfer');
            const { text, status } = response;
            const { success, count } = JSON.parse(text);
            expect(status).toBe(200);
            expect(success).toBe(true);
            expect(typeof count).toBe('number');
        }));
        test.only('GET /api/v1/accounts/transferable-accounts', () => __awaiter(void 0, void 0, void 0, function* () {
            const { text, status } = yield (0, supertest_1.default)(app).get('/api/v1/accounts/transferable-accounts');
            const { success, data } = JSON.parse(text);
            expect(status).toBe(200);
            expect(success).toBe(true);
            expect(data.length > 0).toBe(true);
        }));
        // delete OPENING BALANCE
        test.only('DELETE /api/v1/accounts/balance-transfer/:id delete an OPENING BALANCE', () => __awaiter(void 0, void 0, void 0, function* () {
            const body = {
                created_by: 5,
            };
            const { text, status } = yield (0, supertest_1.default)(app)
                .patch(`/api/v1/accounts/balance-transfer/${openingBalId}`)
                .send(body);
            const { success } = JSON.parse(text);
            expect(status).toBe(200);
            expect(success).toBe(true);
        }));
        // delete account
        test.only('DELETE /api/v1/accounts/:id delete an account', () => __awaiter(void 0, void 0, void 0, function* () {
            const body = {
                delete_by: 5,
            };
            const { text, status } = yield (0, supertest_1.default)(app)
                .delete(`/api/v1/accounts/${newAccId}`)
                .send(body);
            const { success } = JSON.parse(text);
            expect(status).toBe(200);
            expect(success).toBe(true);
        }));
    });
});
//# sourceMappingURL=accounts.test.js.map