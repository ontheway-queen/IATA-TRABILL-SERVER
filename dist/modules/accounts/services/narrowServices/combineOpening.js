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
class AddCombineOpeningBalanceService extends abstract_services_1.default {
    constructor() {
        super();
        this.addCombineOpeningBalance = (req) => __awaiter(this, void 0, void 0, function* () {
            const { combine_id, transaction_created_by, amount, date, note, transaction_type, } = req.body;
            return this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn_acc = this.models.accountsModel(req, trx);
                const trxn_conn = this.models.trxnModels(req, trx);
                const comTrxnBody = {
                    comtrxn_voucher_no: '',
                    comtrxn_type: transaction_type,
                    comtrxn_comb_id: combine_id,
                    comtrxn_particular_id: 41,
                    comtrxn_amount: amount,
                    comtrxn_note: note,
                    comtrxn_create_at: date,
                    comtrxn_user_id: transaction_created_by,
                };
                const op_comtrxn_id = yield trxn_conn.insertComTrxn(comTrxnBody);
                const openingBalData = {
                    op_acctype: 'COMBINED',
                    op_amount: amount,
                    op_trxn_type: transaction_type,
                    op_com_id: combine_id,
                    op_comtrxn_id,
                    op_note: note,
                    op_date: date,
                };
                const data = yield conn_acc.insertOpeningBal(openingBalData);
                const message = 'Combine opening balance has been added';
                yield this.insertAudit(req, 'create', message, transaction_created_by, 'ACCOUNTS');
                return {
                    success: true,
                    message: 'Combine Client Opening Balance Add Successfuly!',
                    data,
                };
            }));
        });
    }
}
exports.default = AddCombineOpeningBalanceService;
//# sourceMappingURL=combineOpening.js.map