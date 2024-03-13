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
class AddIncentiveService extends abstract_services_1.default {
    constructor() {
        super();
        this.addIncentiveIncomeService = (req) => __awaiter(this, void 0, void 0, function* () {
            const { vendor_id, type_id, account_id, adjust_with_bill, amount, incentive_created_by, date, note, } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.accountsModel(req, trx);
                const trxn_conn = this.models.trxnModels(req, trx);
                const trxns = new Trxns_1.default(req, trx);
                const vouchar_no = yield this.generateVoucher(req, 'ICI');
                const incentiveInfo = {
                    incentive_vouchar_no: vouchar_no,
                    incentive_type: 'VENDOR',
                    incentive_vendor_id: +vendor_id,
                    incentive_account_id: account_id,
                    incentive_adjust_bill: adjust_with_bill,
                    incentive_trnxtype_id: 124,
                    incentive_account_category_id: type_id,
                    incentive_amount: +amount,
                    incentive_created_by: incentive_created_by,
                    incentive_date: date,
                    incentive_note: note,
                };
                if (adjust_with_bill === 'YES') {
                    const VTrxnBody = {
                        vtrxn_voucher: vouchar_no,
                        vtrxn_type: 'CREDIT',
                        vtrxn_particular_type: 'Incentive income',
                        vtrxn_amount: amount,
                        vtrxn_particular_id: 124,
                        vtrxn_note: note,
                        vtrxn_user_id: incentive_created_by,
                        vtrxn_created_at: date,
                        vtrxn_v_id: vendor_id,
                    };
                    const vbilladjust_vtrxn_id = yield trxn_conn.insertVTrxn(VTrxnBody);
                    incentiveInfo.incentive_vtrxn_id = vbilladjust_vtrxn_id;
                    const vendorBillInfo = {
                        vbilladjust_vendor_id: vendor_id,
                        vbilladjust_type: 'INCREASE',
                        vbilladjust_amount: amount,
                        vbilladjust_create_date: date,
                        vbilladjust_note: note,
                        vbilladjust_vtrxn_id,
                        vbilladjust_created_by: incentive_created_by,
                    };
                    yield conn.addVendorBill(vendorBillInfo);
                }
                else {
                    const AccTrxnBodyTo = {
                        acctrxn_ac_id: account_id,
                        acctrxn_type: 'CREDIT',
                        acctrxn_voucher: vouchar_no,
                        acctrxn_amount: amount,
                        acctrxn_created_at: date,
                        acctrxn_created_by: incentive_created_by,
                        acctrxn_note: note,
                        acctrxn_particular_id: 26,
                        acctrxn_particular_type: 'Incentive income',
                        acctrxn_pay_type: 'CASH',
                    };
                    const incentive_acctrxn_id = yield trxns.AccTrxnInsert(AccTrxnBodyTo);
                    incentiveInfo.incentive_actransaction_id = incentive_acctrxn_id;
                }
                const data = yield conn.addIncentiveInc(incentiveInfo);
                yield this.updateVoucher(req, 'ICI');
                const message = `Vendor incentive has been created ${amount}/-`;
                yield this.insertAudit(req, 'create', message, incentive_created_by, 'OTHERS');
                return {
                    success: true,
                    message: 'Incentive income added successfully',
                    data,
                };
            }));
        });
    }
}
exports.default = AddIncentiveService;
//# sourceMappingURL=incentiveIncome.services.js.map