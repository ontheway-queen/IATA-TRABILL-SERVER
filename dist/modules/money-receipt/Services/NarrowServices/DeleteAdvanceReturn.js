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
class DeleteAdvanceReturn extends abstract_services_1.default {
    constructor() {
        super();
        this.deleteAdvanceReturn = (req) => __awaiter(this, void 0, void 0, function* () {
            const { advr_deleted_by } = req.body;
            const advr_id = req.params.id;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.MoneyReceiptModels(req, trx);
                const trxns = new Trxns_1.default(req, trx);
                const previous_billing = yield conn.getPrevAdvrIfo(advr_id);
                const { prevAmoun, prevClientId, advr_actransaction_id, advr_ctrxn_id, advr_trxn_charge_id, } = previous_billing;
                yield trxns.deleteAccTrxn(advr_actransaction_id);
                if (prevClientId) {
                    yield trxns.deleteClTrxn(advr_ctrxn_id, prevClientId);
                }
                if (advr_trxn_charge_id) {
                    yield this.models
                        .vendorModel(req, trx)
                        .deleteOnlineTrxnCharge(advr_trxn_charge_id);
                }
                yield conn.deleteAdvanceReturn(1, advr_deleted_by, advr_id);
                yield this.insertAudit(req, 'delete', `Advance return has been deleted, advr-id:${advr_id} ${prevAmoun}/-`, advr_deleted_by, 'MONEY_RECEIPT_ADVANCE_RETURN');
                return {
                    success: true,
                    data: 'Advance return has been deleted',
                };
            }));
        });
    }
}
exports.default = DeleteAdvanceReturn;
//# sourceMappingURL=DeleteAdvanceReturn.js.map