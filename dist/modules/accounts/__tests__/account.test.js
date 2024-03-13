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
const app = new app_1.default().app;
describe('accounts', () => {
    describe.skip('create account', () => {
        describe('given all the invalid information', () => {
            const partialAccountPayload = {
                // acctype_id: 1,
                // account_created_by: 2,
                account_name: 'My new Account',
                account_number: 'PKC3652SDK14',
                account_bank_name: 'Eastern Bank Ltd',
                account_branch_name: 'Gulshan',
                opening_balance: '5000000',
            };
            it('should return an error response with 400 status code', () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, supertest_1.default)(app)
                    .post('/api/v1/accounts/create')
                    .send(partialAccountPayload)
                    .expect(400);
            }));
        });
        const accountPayload = {
            acctype_id: 1,
            account_created_by: 2,
            account_name: 'My new Account',
            account_number: 'PKC3652SDK14',
            account_bank_name: 'Eastern Bank Ltd',
            account_branch_name: 'Gulshan',
            opening_balance: '5000000',
        };
        describe('given all valid information', () => {
            test('should return a success response', () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, supertest_1.default)(app)
                    .post('/api/v1/accounts/create')
                    .send(accountPayload)
                    .expect(201);
            }));
        });
    });
    describe('get account', () => {
        describe('get all accounts', () => {
            describe('given account category id', () => {
                test('should return all the accounts belongs to that account category', () => __awaiter(void 0, void 0, void 0, function* () {
                    yield (0, supertest_1.default)(app).get('');
                }));
            });
        });
    });
});
//# sourceMappingURL=account.test.js.map