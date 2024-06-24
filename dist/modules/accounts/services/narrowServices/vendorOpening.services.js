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
class AddVendorOpeningService extends abstract_services_1.default {
    constructor() {
        super();
        /**
         * add client opening balance
         */
        this.addVendorOpeningBalance = (req) => __awaiter(this, void 0, void 0, function* () {
            const { amount, vendor_id, transaction_created_by, date, note, transaction_type, } = req.body;
            return this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn_acc = this.models.accountsModel(req, trx);
                const trxn_conn = this.models.trxnModels(req, trx);
                const VTrxnBody = {
                    vtrxn_voucher: '',
                    vtrxn_type: transaction_type,
                    vtrxn_amount: amount,
                    vtrxn_particular_id: 41,
                    vtrxn_note: note,
                    vtrxn_user_id: transaction_created_by,
                    vtrxn_created_at: date,
                    vtrxn_v_id: vendor_id,
                };
                const op_ventrxn_id = yield trxn_conn.insertVTrxn(VTrxnBody);
                const openingBalData = {
                    op_acctype: 'VENDOR',
                    op_amount: amount,
                    op_trxn_type: transaction_type,
                    op_ven_id: vendor_id,
                    op_ventrxn_id,
                    op_note: note,
                    op_date: date,
                };
                const data = yield conn_acc.insertOpeningBal(openingBalData);
                const message = 'Vendor opening balance has been added';
                yield this.insertAudit(req, 'create', message, transaction_created_by, 'ACCOUNTS');
                return {
                    success: true,
                    message: 'Vendor opening balance added successfully!',
                    data,
                };
            }));
        });
    }
}
exports.default = AddVendorOpeningService;
//# sourceMappingURL=vendorOpening.services.js.map