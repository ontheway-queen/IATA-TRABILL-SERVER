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
const abstract_services_1 = __importDefault(require("../../../../abstracts/abstract.services"));
const Trxns_1 = __importDefault(require("../../../../common/helpers/Trxns"));
class AddAccountOpeningService extends abstract_services_1.default {
    constructor() {
        super();
        /**
         * add account opening balance
         */
        this.addAccountOpeningBalance = (req) => __awaiter(this, void 0, void 0, function* () {
            const { account_id, account_created_by, amount, date, note, transaction_type, } = req.body;
            return this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.accountsModel(req, trx);
                const trxns = new Trxns_1.default(req, trx);
                const AccTrxnBodyTo = {
                    acctrxn_ac_id: account_id,
                    acctrxn_type: transaction_type,
                    acctrxn_voucher: '',
                    acctrxn_amount: amount,
                    acctrxn_created_at: date,
                    acctrxn_created_by: account_created_by,
                    acctrxn_note: note,
                    acctrxn_particular_id: 11,
                    acctrxn_particular_type: 'Opening balance',
                    acctrxn_pay_type: 'CASH',
                };
                const op_acctrxn_id = yield trxns.AccTrxnInsert(AccTrxnBodyTo);
                const openingBalData = {
                    op_acctype: 'ACCOUNT',
                    op_amount: amount,
                    op_trxn_type: transaction_type,
                    op_acc_id: account_id,
                    op_acctrxn_id,
                    op_note: note,
                    op_date: date,
                };
                const data = yield conn.insertOpeningBal(openingBalData);
                const message = 'Account opening balance has been added';
                yield this.insertAudit(req, 'create', message, account_created_by, 'ACCOUNTS');
                return {
                    success: true,
                    message: 'Account opening balance added successfully',
                    data,
                };
            }));
        });
    }
}
exports.default = AddAccountOpeningService;
//# sourceMappingURL=accountOpening.services.js.map