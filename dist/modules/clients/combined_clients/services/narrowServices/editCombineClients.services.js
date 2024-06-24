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
const abstract_services_1 = __importDefault(require("../../../../../abstracts/abstract.services"));
const Trxns_1 = __importDefault(require("../../../../../common/helpers/Trxns"));
class EditCombineClient extends abstract_services_1.default {
    constructor() {
        super();
        this.editCombineClient = (req) => __awaiter(this, void 0, void 0, function* () {
            const { combine_category_id, combine_name, combine_company_name, combine_gender, combine_email, combine_designation, combine_mobile, combine_address, combine_client_status, combine_commission_rate, combine_opening_balance, opening_balance_type, cproduct_product_id, combine_update_by, combine_credit_limit, } = req.body;
            const combine_id = req.params.id;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.combineClientModel(req, trx);
                const combineClinetInfo = {
                    combine_category_id,
                    combine_name,
                    combine_company_name,
                    combine_gender,
                    combine_email,
                    combine_designation,
                    combine_opening_balance,
                    combine_mobile,
                    combine_address,
                    combine_update_by,
                    combine_client_status,
                    combine_commission_rate,
                    combine_credit_limit,
                };
                yield conn.updateCombineInformation(combine_id, combineClinetInfo);
                yield conn.deletePreviousProduct(combine_id);
                const combineproducts = cproduct_product_id === null || cproduct_product_id === void 0 ? void 0 : cproduct_product_id.map((item) => {
                    let cproduct_commission_rate = 0;
                    if (item === 106) {
                        cproduct_commission_rate = Number(combine_commission_rate);
                    }
                    return {
                        cproduct_combine_id: Number(combine_id),
                        cproduct_product_id: item,
                        cproduct_commission_rate,
                    };
                });
                if (combineproducts === null || combineproducts === void 0 ? void 0 : combineproducts.length) {
                    yield conn.insertCombineClientProducts(combineproducts);
                }
                const combine_info = yield conn.getCombineClientName(combine_id);
                const combine_trxn_id = yield conn.getCombineClientOpeningTrxnId(combine_id);
                const comtransaction_type = (opening_balance_type === null || opening_balance_type === void 0 ? void 0 : opening_balance_type.toLocaleLowerCase()) === 'due'
                    ? 'DEBIT'
                    : 'CREDIT';
                if (combine_trxn_id) {
                    const clTrxnBody = {
                        ctrxn_type: comtransaction_type,
                        ctrxn_amount: Number(combine_opening_balance),
                        ctrxn_cl: `combined-${combine_id}`,
                        ctrxn_voucher: '',
                        ctrxn_particular_id: 41,
                        ctrxn_created_at: (0, dayjs_1.default)().format('YYYY-MM-DD'),
                        ctrxn_note: combine_designation,
                        ctrxn_trxn_id: combine_trxn_id,
                    };
                    yield new Trxns_1.default(req, trx).clTrxnUpdate(clTrxnBody);
                }
                else if (combine_opening_balance) {
                    const clTrxnBody = {
                        ctrxn_type: comtransaction_type,
                        ctrxn_amount: Number(combine_opening_balance),
                        ctrxn_cl: `combined-${combine_id}`,
                        ctrxn_voucher: '',
                        ctrxn_particular_id: 41,
                        ctrxn_created_at: (0, dayjs_1.default)().format('YYYY-MM-DD'),
                        ctrxn_note: combine_designation,
                    };
                    const combine_trxn_id = yield new Trxns_1.default(req, trx).clTrxnInsert(clTrxnBody);
                    yield conn.updateCombineClientOpeningTrxnId(combine_trxn_id, combine_id);
                }
                // insert audit
                const message = `Combine client has been update -${combine_info}-`;
                yield this.insertAudit(req, 'update', message, combine_update_by, 'ACCOUNTS');
                return {
                    success: true,
                    message: 'Combine client update successfully',
                };
            }));
        });
    }
}
exports.default = EditCombineClient;
//# sourceMappingURL=editCombineClients.services.js.map