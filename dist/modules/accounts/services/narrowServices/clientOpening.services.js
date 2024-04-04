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
class AddClientOpeningService extends abstract_services_1.default {
    constructor() {
        super();
        /**
         * add client opening balance
         */
        this.addClientOpeningBalance = (req) => __awaiter(this, void 0, void 0, function* () {
            const { amount, client_id, transaction_created_by, transaction_type, note, date, } = req.body;
            return this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn_acc = this.models.accountsModel(req, trx);
                const trxn_conn = this.models.trxnModels(req, trx);
                const clTrxnBody = {
                    ctrxn_amount: amount,
                    ctrxn_cl_id: client_id,
                    ctrxn_created_at: date,
                    ctrxn_note: note,
                    ctrxn_particular_id: 12,
                    ctrxn_particular_type: 'Client opening balance',
                    ctrxn_type: transaction_type,
                    ctrxn_voucher: '',
                };
                const op_cltrxn_id = yield trxn_conn.insertClTrxn(clTrxnBody);
                const openingBalData = {
                    op_acctype: 'CLIENT',
                    op_amount: amount,
                    op_trxn_type: transaction_type,
                    op_cl_id: client_id,
                    op_cltrxn_id,
                    op_note: note,
                    op_date: date,
                };
                const data = yield conn_acc.insertOpeningBal(openingBalData);
                const message = 'Client opening balance has been added ' +
                    note +
                    ` amount - ${amount}/- , opening balance id-${data}`;
                yield this.insertAudit(req, 'create', message, transaction_created_by, 'ACCOUNTS');
                return {
                    success: true,
                    message: 'Client opening balance added successfully!',
                    data,
                };
            }));
        });
    }
}
exports.default = AddClientOpeningService;
//# sourceMappingURL=clientOpening.services.js.map