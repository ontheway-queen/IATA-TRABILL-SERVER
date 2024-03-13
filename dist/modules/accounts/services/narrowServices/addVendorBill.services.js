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
const invoice_helpers_1 = require("../../../../common/helpers/invoice.helpers");
class AddVendorBillAdjustment extends abstract_services_1.default {
    constructor() {
        super();
        /**
         * add Vendor bill adjustment
         */
        this.vendorBillAdj = (req) => __awaiter(this, void 0, void 0, function* () {
            const { vendor_id, bill_type, bill_amount, bill_create_date, bill_created_by, bill_note, } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.accountsModel(req, trx);
                const vendor_conn = this.models.vendorModel(req, trx);
                const trxn_conn = this.models.trxnModels(req, trx);
                const voucher_no = (0, invoice_helpers_1.generateVoucherNumber)(7, 'VB');
                let trxType = 'CREDIT';
                if (bill_type === 'INCREASE') {
                    trxType = 'CREDIT';
                }
                if (bill_type === 'DECREASE') {
                    trxType = 'DEBIT';
                }
                const VTrxnBody = {
                    vtrxn_voucher: voucher_no,
                    vtrxn_type: trxType,
                    vtrxn_particular_type: 'Vendor bill adjustment',
                    vtrxn_amount: bill_amount,
                    vtrxn_particular_id: 126,
                    vtrxn_note: bill_note,
                    vtrxn_user_id: bill_created_by,
                    vtrxn_created_at: bill_create_date,
                    vtrxn_v_id: vendor_id,
                };
                const trxnId = yield trxn_conn.insertVTrxn(VTrxnBody);
                const vendorBillInfo = {
                    vbilladjust_vendor_id: vendor_id,
                    vbilladjust_type: bill_type,
                    vbilladjust_amount: bill_amount,
                    vbilladjust_create_date: bill_create_date,
                    vbilladjust_note: bill_note,
                    vbilladjust_vouchar_no: voucher_no,
                    vbilladjust_vtrxn_id: trxnId,
                    vbilladjust_created_by: bill_created_by,
                };
                yield conn.addVendorBill(vendorBillInfo);
                const message = `Vendor bill adjustment has been created ${bill_amount}/-`;
                yield this.insertAudit(req, 'create', message, bill_created_by, 'ACCOUNTS');
                return {
                    success: true,
                    message: 'Vendor bill adjusted successfully',
                };
            }));
        });
    }
}
exports.default = AddVendorBillAdjustment;
//# sourceMappingURL=addVendorBill.services.js.map