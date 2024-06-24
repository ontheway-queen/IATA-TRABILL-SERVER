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
class AddVendorServices extends abstract_services_1.default {
    constructor() {
        super();
        this.addVendor = (req) => __awaiter(this, void 0, void 0, function* () {
            const { vendor_address, vendor_registration_date, vendor_name, dailCode, number, vendor_email, vendor_opening_balance, vendor_opening_balance_pay_type, vendor_commission_rate, vendor_products_id, vendor_created_by, vendor_fixed_advance, vendor_credit_limit, vendor_bank_guarantee, vendor_start_date, vendor_end_date, } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.vendorModel(req, trx);
                const acc_conn = this.models.accountsModel(req, trx);
                const temp = number ? dailCode + '-' + number : undefined;
                //save vendor
                const vendorInfo = {
                    vendor_name,
                    vendor_email,
                    vendor_mobile: temp,
                    vendor_address,
                    vendor_registration_date,
                    vendor_created_by,
                    vendor_fixed_advance,
                    vendor_credit_limit,
                    vendor_bank_guarantee,
                    vendor_end_date,
                    vendor_start_date,
                };
                const vendor_id = yield conn.insertVendor(vendorInfo);
                //format existing vendor working categories, working countries and product data
                yield conn.formatVendorDetailForUpdate(vendor_id, vendor_created_by);
                //Save vendor products
                yield lib_1.default.insertProducts(conn, vendor_products_id, vendor_commission_rate, vendor_id);
                let vtrxn_type = (vendor_opening_balance_pay_type === null || vendor_opening_balance_pay_type === void 0 ? void 0 : vendor_opening_balance_pay_type.toLowerCase()) === 'due'
                    ? 'DEBIT'
                    : 'CREDIT';
                // @Save Vendor opening balance
                if (vendor_opening_balance) {
                    const VTrxnBody = {
                        comb_vendor: `vendor-${vendor_id}`,
                        vtrxn_amount: vendor_opening_balance,
                        vtrxn_created_at: (0, dayjs_1.default)().format('YYYY-MM-DD'),
                        vtrxn_note: '',
                        vtrxn_particular_id: 41,
                        vtrxn_type: vtrxn_type,
                        vtrxn_user_id: vendor_created_by,
                        vtrxn_voucher: '',
                    };
                    const vendor_trxn_id = yield new Trxns_1.default(req, trx).VTrxnInsert(VTrxnBody);
                    yield conn.updateVendorOpeningTrxnId(vendor_trxn_id, vendor_id);
                    const openingBalData = {
                        op_acctype: 'VENDOR',
                        op_amount: vendor_opening_balance,
                        op_trxn_type: vtrxn_type,
                        op_ven_id: vendor_id,
                        op_ventrxn_id: vendor_trxn_id,
                        op_note: '',
                        op_date: (0, dayjs_1.default)().format('YYYY-MM-DD'),
                    };
                    yield acc_conn.insertOpeningBal(openingBalData);
                }
                const message = `ADDED VENDOR, NAME ${vendor_name}`;
                yield this.insertAudit(req, 'create', message, vendor_created_by, 'VENDOR');
                return {
                    success: true,
                    message,
                    data: { vendor_id },
                };
            }));
        });
    }
}
exports.default = AddVendorServices;
//# sourceMappingURL=addVendor.js.map