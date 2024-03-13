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
const app_1 = __importDefault(require("../../../../app/app"));
const payloads_1 = require("./payloads");
const app = new app_1.default().app;
expect.extend({
    nullOrAny(received, expected) {
        const pass = received === null || received.constructor === expected;
        return {
            pass,
            message: () => `expected null or instance of ${this.utils.printExpected(expected)}, but received ${this.utils.printReceived(received)}`,
        };
    },
});
describe('clients', () => {
    describe.skip('coroporate client', () => {
        describe.skip('given all necessary data to create a coroporate client', () => {
            it('should return a success responses', () => __awaiter(void 0, void 0, void 0, function* () {
                const { body } = yield (0, supertest_1.default)(app)
                    .post('/api/v1/client/create')
                    .send(payloads_1.corporateClientPayload)
                    .expect(201);
                expect(body).toEqual({
                    success: true,
                    message: expect.any(String),
                    data: {
                        category_prefix: expect.any(String),
                        client_entry_id: expect.any(String),
                        client_id: expect.any(Number),
                    },
                });
            }));
        });
        describe.skip('given partial data which is not sufficient to create a corporate client', () => {
            it('should return a `Bad Request` response', () => __awaiter(void 0, void 0, void 0, function* () {
                const { body } = yield (0, supertest_1.default)(app)
                    .post('/api/v1/client/create')
                    .send(payloads_1.partialCorporateClientPayload)
                    .expect(400);
                expect(body).toEqual({
                    success: false,
                    message: expect.any(String),
                    status: 400,
                    type: expect.any(String),
                });
            }));
        });
    });
    describe.skip('individual client', () => {
        describe('given all necessary data to create a individual client', () => {
            it('should return a success response', () => __awaiter(void 0, void 0, void 0, function* () {
                const { body } = yield (0, supertest_1.default)(app)
                    .post('/api/v1/client/create')
                    .send(payloads_1.individualClientPayload)
                    .expect(201);
                expect(body).toEqual({
                    success: true,
                    message: expect.any(String),
                    data: {
                        category_prefix: expect.any(String),
                        client_entry_id: expect.any(String),
                        client_id: expect.any(Number),
                    },
                });
            }));
        });
        describe.skip('given paratial data which is not sufficient to create an individual client', () => {
            it('should return a `Bad Request` response', () => __awaiter(void 0, void 0, void 0, function* () {
                const { body } = yield (0, supertest_1.default)(app)
                    .post('/api/v1/client/create')
                    .send(payloads_1.partialIndividualClientPayload)
                    .expect(400);
                expect(body).toEqual({
                    success: false,
                    message: expect.any(String),
                    status: 400,
                    type: 'Bad Request',
                });
            }));
        });
    });
    describe.skip('get routes', () => {
        describe('given a user whats to fetch all the clients', () => {
            it('should return all the clients which is not deleted', () => __awaiter(void 0, void 0, void 0, function* () {
                const { body } = yield (0, supertest_1.default)(app).get('/api/client/all').expect(200);
                body.data.forEach((item) => {
                    expect(item).toEqual(expect.objectContaining({
                        client_id: expect.any(Number),
                        client_name: expect.any(String),
                        email: expect.nullOrAny(String),
                        mobile: expect.any(String),
                        client_activity_status: expect.any(Number),
                        client_is_deleted: 0,
                        client_created_by_name: expect.any(String),
                        client_last_balance: expect.any(String),
                    }));
                });
            }));
            it('should return all the deleted clients', () => __awaiter(void 0, void 0, void 0, function* () {
                const { body } = yield (0, supertest_1.default)(app)
                    .get('/api/client/deleted-clients')
                    .expect(200);
                body.data.forEach((item) => {
                    expect(item).toEqual(expect.objectContaining({
                        client_id: expect.any(Number),
                        client_name: expect.any(String),
                        email: expect.nullOrAny(String),
                        mobile: expect.any(String),
                        client_activity_status: expect.any(Number),
                        client_is_deleted: 1,
                        client_created_by_name: expect.any(String),
                        client_last_balance: expect.any(String),
                    }));
                });
            }));
        });
        describe('given client id, by which a user wants to fetch all information of  a corporate client client', () => {
            it('should return a not found router error', () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, supertest_1.default)(app).get(`/api/clientssssss/${607}`).expect(404);
            }));
            it('should return an not found router error', () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, supertest_1.default)(app).get(`/api/client/${1}`).expect(400);
            }));
            it('should return a success response', () => __awaiter(void 0, void 0, void 0, function* () {
                const { body } = yield (0, supertest_1.default)(app).get(`/api/client/${607}`);
                const exp = {
                    category_title: expect.any(String),
                    client_activity_status: expect.any(Number),
                    client_address: expect.nullOrAny(String),
                    client_category_id: expect.any(Number),
                    client_created_date: expect.any(String),
                    client_designation: expect.nullOrAny(String),
                    client_family_members: expect.nullOrAny(Number),
                    client_gender: expect.nullOrAny(String),
                    client_id: expect.any(Number),
                    client_name: expect.any(String),
                    client_trade_license: expect.nullOrAny(String),
                    client_type: 'CORPORATE',
                    company_address: expect.nullOrAny(String),
                    company_contact_person: expect.arrayContaining([
                        expect.objectContaining({
                            company_contact_gender: expect.any(String),
                            company_contact_mobile: expect.any(String),
                            company_contact_person: expect.any(String),
                        }),
                    ]),
                    company_name: expect.any(String),
                    email: expect.nullOrAny(String),
                    mobile: expect.any(String),
                    source_title: expect.any(String),
                };
                expect(body.data).toEqual(expect.objectContaining(exp));
            }));
        });
    });
    describe.skip('delete routes', () => {
        describe('given an invlaid client id', () => {
            it('should return an error response with status code 400', () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, supertest_1.default)(app).delete('/api/client/:client_id').expect(400);
            }));
        });
        describe('given a client id which has some balance remaining', () => {
            it('should return an error response with status code 400', () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, supertest_1.default)(app).delete('/api/client/616').expect(400);
            }));
        });
        describe('given a client id which has already been deleted', () => {
            it('should return a error response', () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, supertest_1.default)(app).delete('/api/client/620').expect(400);
            }));
        });
        describe.skip('given a client id which has no remaining balance', () => {
            it('should return a success response', () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, supertest_1.default)(app).delete('/api/client/620').expect(200);
            }));
        });
        describe('given an invalid client id to restore a client', () => {
            it('should an error response', () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, supertest_1.default)(app).patch('/api/client/restore/:client_id').expect(400);
            }));
        });
        describe('given a client id which is not deleted to restore a client', () => {
            it('should an error response', () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, supertest_1.default)(app).patch('/api/client/restore/619').expect(400);
            }));
        });
        describe.skip('given a client id which is deleted to restore a client', () => {
            it('should an success response', () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, supertest_1.default)(app).patch('/api/client/restore/620').expect(200);
            }));
        });
    });
});
//# sourceMappingURL=client.test.js.map