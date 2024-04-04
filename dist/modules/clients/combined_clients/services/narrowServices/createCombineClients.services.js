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
const abstract_services_1 = __importDefault(require("../../../../../abstracts/abstract.services"));
const dayjs_1 = __importDefault(require("dayjs"));
const Trxns_1 = __importDefault(require("../../../../../common/helpers/Trxns"));
class CreateCombineClients extends abstract_services_1.default {
    constructor() {
        super();
        this.createCombineClient = (req) => __awaiter(this, void 0, void 0, function* () {
            const { combine_category_id, combine_name, combine_company_name, combine_gender, combine_email, combine_designation, combine_mobile, combine_address, combine_opening_balance, opening_balance_type, combine_create_by, combine_commission_rate, cproduct_product_id, combine_credit_limit, } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.combineClientModel(req, trx);
                const acc_conn = this.models.accountsModel(req, trx);
                const combine_entry_id = yield this.generateVoucher(req, 'CL');
                let combine_id;
                const combineClientInfo = {
                    combine_category_id: combine_category_id,
                    combine_entry_id,
                    combine_name: combine_name,
                    combine_company_name: combine_company_name,
                    combine_gender: combine_gender,
                    combine_email: combine_email,
                    combine_commission_rate,
                    combine_designation: combine_designation,
                    combine_mobile: combine_mobile,
                    combine_address: combine_address,
                    combine_opening_balance: Number((opening_balance_type === null || opening_balance_type === void 0 ? void 0 : opening_balance_type.toLocaleLowerCase()) === 'due'
                        ? '-'
                        : '' + combine_opening_balance) || 0,
                    combine_balance_type: opening_balance_type,
                    combine_create_by: combine_create_by,
                    combine_credit_limit: combine_credit_limit,
                };
                combine_id = yield conn.insertCombineClient(combineClientInfo);
                const comtransaction_type = (opening_balance_type === null || opening_balance_type === void 0 ? void 0 : opening_balance_type.toLocaleLowerCase()) === 'due'
                    ? 'DEBIT'
                    : 'CREDIT';
                if (combine_opening_balance) {
                    const clTrxnBody = {
                        ctrxn_type: comtransaction_type,
                        ctrxn_amount: Number(combine_opening_balance),
                        ctrxn_cl: `combined-${combine_id}`,
                        ctrxn_voucher: '',
                        ctrxn_particular_id: 11,
                        ctrxn_created_at: (0, dayjs_1.default)().format('YYYY-MM-DD'),
                        ctrxn_note: combine_designation,
                        ctrxn_particular_type: 'Opening balance',
                    };
                    const combine_trxn_id = yield new Trxns_1.default(req, trx).clTrxnInsert(clTrxnBody);
                    yield conn.updateCombineClientOpeningTrxnId(combine_trxn_id, combine_id);
                    const openingBalData = {
                        op_acctype: 'COMBINED',
                        op_amount: combine_opening_balance,
                        op_trxn_type: comtransaction_type,
                        op_com_id: combine_id,
                        op_comtrxn_id: combine_trxn_id,
                        op_note: combine_designation,
                        op_date: (0, dayjs_1.default)().format('YYYY-MM-DD'),
                    };
                    yield acc_conn.insertOpeningBal(openingBalData);
                }
                const combineproducts = cproduct_product_id === null || cproduct_product_id === void 0 ? void 0 : cproduct_product_id.map((item) => {
                    let cproduct_commission_rate = 0;
                    if (item === 106) {
                        cproduct_commission_rate = Number(combine_commission_rate);
                    }
                    return {
                        cproduct_combine_id: combine_id,
                        cproduct_product_id: item,
                        cproduct_commission_rate,
                    };
                });
                if (combineproducts === null || combineproducts === void 0 ? void 0 : combineproducts.length) {
                    yield conn.insertCombineClientProducts(combineproducts);
                }
                yield this.updateVoucher(req, 'CL');
                // insert audit
                const message = `Combine client has been created -${combine_name}-`;
                yield this.insertAudit(req, 'create', message, combine_create_by, 'ACCOUNTS');
                return {
                    success: true,
                    message: 'Combine client created successfully',
                };
            }));
        });
    }
}
exports.default = CreateCombineClients;
//# sourceMappingURL=createCombineClients.services.js.map