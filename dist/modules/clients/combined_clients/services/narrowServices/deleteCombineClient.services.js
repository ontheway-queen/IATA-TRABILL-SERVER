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
const customError_1 = __importDefault(require("../../../../../common/utils/errors/customError"));
class DeleteCombineClient extends abstract_services_1.default {
    constructor() {
        super();
        this.deleteCombineClient = (req) => __awaiter(this, void 0, void 0, function* () {
            const { combine_update_by } = req.body;
            const combine_id = req.params.id;
            if (!combine_id) {
                throw new customError_1.default('Empty combined id', 400, 'Please provide a combined id');
            }
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.combineClientModel(req, trx);
                const combine_info = yield conn.getCombineClientName(combine_id);
                const clientTrxnCount = yield conn.getTraxn(combine_id);
                if (clientTrxnCount === 0) {
                    yield conn.deleteCombineClients(combine_id, combine_update_by);
                }
                else {
                    throw new customError_1.default('Account has a valid transaction', 400, 'Bad Request');
                }
                // insert audit
                const message = `Combine client has been deleted -${combine_info}-`;
                yield this.insertAudit(req, 'delete', message, combine_update_by, 'ACCOUNTS');
                return {
                    success: true,
                    message: 'Combine client delete successfuly',
                };
            }));
        });
    }
}
exports.default = DeleteCombineClient;
//# sourceMappingURL=deleteCombineClient.services.js.map