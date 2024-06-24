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
const dayjs_1 = __importDefault(require("dayjs"));
const abstract_services_1 = __importDefault(require("../../../../abstracts/abstract.services"));
const Trxns_1 = __importDefault(require("../../../../common/helpers/Trxns"));
const lib_1 = __importDefault(require("../../utils/lib"));
class EditVendorService extends abstract_services_1.default {
    constructor() {
        super();
        this.editVendor = (req) => __awaiter(this, void 0, void 0, function* () {
            const { vendor_address, vendor_registration_date, vendor_name, dailCode, vendor_opening_balance, vendor_opening_balance_pay_type, number, vendor_commission_rate, vendor_email, vendor_fixed_advance, vendor_credit_limit, vendor_updated_by, vendor_products_id, vendor_bank_guarantee, vendor_start_date, vendor_end_date, } = req.body;
            const temp = number ? dailCode + '-' + number : null;
            const mail = vendor_email ? vendor_email : null;
            const vendor_id = Number(req.params.id);
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.vendorModel(req, trx);
                const trxns = new Trxns_1.default(req, trx);
                //edit vendor table
                const vendorInfo = {
                    vendor_name,
                    vendor_email: mail,
                    vendor_mobile: temp,
                    vendor_address,
                    vendor_registration_date,
                    vendor_updated_by,
                    vendor_fixed_advance,
                    vendor_credit_limit,
                    vendor_bank_guarantee,
                    vendor_start_date,
                    vendor_end_date,
                };
                yield conn.updateVendor(vendorInfo, vendor_id);
                const vendor_opening_trxn_id = yield conn.getVendorOpeningTrxnId(vendor_id);
                let vtrxn_type = (vendor_opening_balance_pay_type === null || vendor_opening_balance_pay_type === void 0 ? void 0 : vendor_opening_balance_pay_type.toLowerCase()) === 'due'
                    ? 'DEBIT'
                    : 'CREDIT';
                const VTrxnBody = {
                    comb_vendor: `vendor-${vendor_id}`,
                    vtrxn_amount: vendor_opening_balance,
                    vtrxn_created_at: (0, dayjs_1.default)().format('YYYY-MM-DD'),
                    vtrxn_note: '',
                    vtrxn_particular_id: 34,
                    vtrxn_type: vtrxn_type,
                    vtrxn_user_id: vendor_updated_by,
                    vtrxn_voucher: '',
                    trxn_id: vendor_opening_trxn_id,
                };
                if (vendor_opening_trxn_id) {
                    yield trxns.VTrxnUpdate(VTrxnBody);
                }
                else if (vendor_opening_balance) {
                    const vendor_trxn_id = yield trxns.VTrxnInsert(VTrxnBody);
                    yield conn.updateVendorOpeningTrxnId(vendor_trxn_id, vendor_id);
                }
                //format existing vendor working categories, working countries and product data
                yield conn.formatVendorDetailForUpdate(vendor_id, vendor_updated_by);
                yield lib_1.default.insertProducts(conn, vendor_products_id, vendor_commission_rate, vendor_id);
                const message = `UPDATED VENDOR, NAME ${vendor_name}`;
                yield this.insertAudit(req, 'update', message, vendor_updated_by, 'VENDOR');
                return { success: true, message };
            }));
        });
    }
}
exports.default = EditVendorService;
//# sourceMappingURL=editVendor.js.map