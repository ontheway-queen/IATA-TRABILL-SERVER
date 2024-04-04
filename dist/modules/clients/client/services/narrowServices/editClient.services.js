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
const common_helper_1 = require("../../../../../common/helpers/common.helper");
class EditClientService extends abstract_services_1.default {
    constructor() {
        super();
        this.editClient = (req) => __awaiter(this, void 0, void 0, function* () {
            const { client_designation, client_created_by, opening_balance, opening_balance_type, client_address, client_category_id, client_credit_limit, client_email, client_gender, client_mobile, client_name, client_trade_license, client_type, client_walking_customer, client_source, } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.clientModel(req, trx);
                const trxns = new Trxns_1.default(req, trx);
                const { client_id } = (0, common_helper_1.separateCombClientToId)(req.params.client_id);
                const clientInfo = {
                    client_address,
                    client_category_id,
                    client_credit_limit,
                    client_email,
                    client_gender,
                    client_mobile,
                    client_name,
                    client_trade_license,
                    client_type,
                    client_updated_by: client_created_by,
                    client_designation,
                    client_walking_customer,
                    client_source,
                };
                yield conn.updateClient(client_id, clientInfo);
                if (opening_balance_type) {
                    const clTrxnId = yield conn.getClientOpeningTrxnInfo(client_id);
                    if (clTrxnId) {
                        const clTrxnBody = {
                            ctrxn_type: opening_balance_type,
                            ctrxn_amount: opening_balance,
                            ctrxn_cl: req.params.client_id,
                            ctrxn_particular_id: 11,
                            ctrxn_created_at: (0, dayjs_1.default)().format('YYYY-MM-DD'),
                            ctrxn_note: client_designation,
                            ctrxn_particular_type: 'Opening balance',
                            ctrxn_trxn_id: clTrxnId,
                        };
                        yield trxns.clTrxnUpdate(clTrxnBody);
                    }
                    else if (opening_balance) {
                        const clTrxnBody = {
                            ctrxn_type: opening_balance_type,
                            ctrxn_amount: opening_balance,
                            ctrxn_cl: req.params.client_id,
                            ctrxn_voucher: '',
                            ctrxn_particular_id: 11,
                            ctrxn_created_at: (0, dayjs_1.default)().format('YYYY-MM-DD'),
                            ctrxn_note: client_designation,
                            ctrxn_particular_type: 'Client opening balance ',
                        };
                        const clTrxnId = yield trxns.clTrxnInsert(clTrxnBody);
                        yield conn.updateClientOpeningTransactions(clTrxnId, client_id);
                    }
                }
                const message = `Client has been updated`;
                yield this.insertAudit(req, 'update', message, client_created_by, 'ACCOUNTS');
                return { success: true, message: 'Client updated successfully' };
            }));
        });
    }
}
exports.default = EditClientService;
//# sourceMappingURL=editClient.services.js.map