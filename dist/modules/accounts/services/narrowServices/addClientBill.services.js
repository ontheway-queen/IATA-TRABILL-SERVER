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
const common_helper_1 = require("../../../../common/helpers/common.helper");
const invoice_helpers_1 = require("../../../../common/helpers/invoice.helpers");
const Trxns_1 = __importDefault(require("../../../../common/helpers/Trxns"));
class AddClientBillAdjustment extends abstract_services_1.default {
    constructor() {
        super();
        this.clientBillAdj = (req) => __awaiter(this, void 0, void 0, function* () {
            const { bill_client_id, bill_type, bill_amount, bill_create_date, bill_created_by, bill_note, } = req.body;
            const { client_id, combined_id } = (0, common_helper_1.separateCombClientToId)(bill_client_id);
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.accountsModel(req, trx);
                const trxns = new Trxns_1.default(req, trx);
                const voucher_no = (0, invoice_helpers_1.generateVoucherNumber)(7, 'CB');
                let trxn_type = bill_type === 'INCREASE' ? 'CREDIT' : 'DEBIT';
                const clTrxnBody = {
                    ctrxn_type: trxn_type,
                    ctrxn_amount: bill_amount,
                    ctrxn_cl: bill_client_id,
                    ctrxn_voucher: voucher_no,
                    ctrxn_particular_id: 126,
                    ctrxn_created_at: bill_create_date,
                    ctrxn_note: bill_note,
                    ctrxn_particular_type: 'Client Bill Adjustment',
                };
                const cbilladjust_ctrxn_id = yield trxns.clTrxnInsert(clTrxnBody);
                const clientBillInfo = {
                    cbilladjust_ctrxn_id,
                    cbilladjust_client_id: client_id,
                    cbilladjust_combined_id: combined_id,
                    cbilladjust_type: bill_type,
                    cbilladjust_amount: bill_amount,
                    cbilladjust_create_date: bill_create_date,
                    cbilladjust_created_by: bill_created_by,
                    cbilladjust_note: bill_note,
                    cbilladjust_vouchar_no: voucher_no,
                };
                const cbilladjust_id = yield conn.addClientBill(clientBillInfo);
                const message = `Client bill adjust has been created ${bill_amount}/-`;
                yield this.insertAudit(req, 'create', message, bill_created_by, 'ACCOUNTS');
                return {
                    success: true,
                    message: 'Client bill adjusted successfully',
                    data: { cbilladjust_id },
                };
            }));
        });
    }
}
exports.default = AddClientBillAdjustment;
//# sourceMappingURL=addClientBill.services.js.map