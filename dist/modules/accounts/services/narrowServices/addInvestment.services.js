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
class AddInvestment extends abstract_services_1.default {
    constructor() {
        super();
        this.addInvestment = (req) => __awaiter(this, void 0, void 0, function* () {
            const { company_id, type_id, amount, investment_created_by, account_id, cheque_no, receipt_no, date, note, } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.accountsModel(req, trx);
                const trxns = new Trxns_1.default(req, trx);
                const vouchar_no = yield this.generateVoucher(req, 'IVT');
                const AccTrxnBody = {
                    acctrxn_ac_id: account_id,
                    acctrxn_type: 'CREDIT',
                    acctrxn_voucher: vouchar_no,
                    acctrxn_amount: amount,
                    acctrxn_created_at: date,
                    acctrxn_created_by: investment_created_by,
                    acctrxn_note: note,
                    acctrxn_particular_id: 36,
                    acctrxn_pay_type: 'CASH',
                };
                const acc_trxn_id = yield trxns.AccTrxnInsert(AccTrxnBody);
                const investmentInfo = {
                    investment_vouchar_no: vouchar_no,
                    investment_actransaction_id: acc_trxn_id,
                    investment_company_id: company_id,
                    investment_cheque_no: cheque_no,
                    investment_created_by: investment_created_by,
                    investment_created_date: date,
                    investment_receipt_no: receipt_no,
                    investment_note: note,
                };
                yield conn.addInvestments(investmentInfo);
                yield this.updateVoucher(req, 'IVT');
                const message = `Investment has been created ${amount}/-`;
                yield this.insertAudit(req, 'create', message, investment_created_by, 'OTHERS');
                return {
                    success: true,
                    message,
                };
            }));
        });
    }
}
exports.default = AddInvestment;
//# sourceMappingURL=addInvestment.services.js.map