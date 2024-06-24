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
class AddNonInvoice extends abstract_services_1.default {
    constructor() {
        super();
        this.addNonInvoice = (req) => __awaiter(this, void 0, void 0, function* () {
            const { company_id, type_id, account_id, amount, noninvoice_created_by, cheque_no, receipt_no, date, note, } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.accountsModel(req, trx);
                const trxns = new Trxns_1.default(req, trx);
                const vouchar_no = yield this.generateVoucher(req, 'NII');
                const AccTrxnBody = {
                    acctrxn_ac_id: account_id,
                    acctrxn_type: 'CREDIT',
                    acctrxn_voucher: vouchar_no,
                    acctrxn_amount: amount,
                    acctrxn_created_at: date,
                    acctrxn_created_by: noninvoice_created_by,
                    acctrxn_note: note,
                    acctrxn_particular_id: 35,
                    acctrxn_pay_type: 'CASH',
                };
                const acc_trxn_id = yield trxns.AccTrxnInsert(AccTrxnBody);
                const nonInvoiceincomeInfo = {
                    nonincome_vouchar_no: vouchar_no,
                    nonincome_actransaction_id: acc_trxn_id,
                    nonincome_amount: amount,
                    nonincome_company_id: company_id,
                    nonincome_cheque_no: cheque_no,
                    nonincome_created_by: noninvoice_created_by,
                    nonincome_created_date: date,
                    nonincome_receipt_no: receipt_no,
                    nonincome_note: note,
                };
                yield conn.addNonInvoice(nonInvoiceincomeInfo);
                yield this.updateVoucher(req, 'NII');
                const message = `Non invoice income has been added ${amount}/-`;
                yield this.insertAudit(req, 'create', message, noninvoice_created_by, 'INVOICES');
                return {
                    success: true,
                    message: 'Non invoice created successfully',
                };
            }));
        });
    }
}
exports.default = AddNonInvoice;
//# sourceMappingURL=addNonInvoice.services.js.map