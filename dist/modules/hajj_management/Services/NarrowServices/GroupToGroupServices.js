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
const customError_1 = __importDefault(require("../../../../common/utils/errors/customError"));
class GroupToGroupServices extends abstract_services_1.default {
    constructor() {
        super();
        this.addGroupToGroup = (req) => __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const ctrcknumber_numbers = body.ctrcknumber_number;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.HajjiManagementModels(req, trx);
                delete body.ctrcknumber_number;
                const id = yield conn.insertGroupToGroup(body);
                if (ctrcknumber_numbers) {
                    for (const grouptr_number of ctrcknumber_numbers) {
                        const clToclTransactionData = {
                            grouptr_gtransfer_id: id,
                            grouptr_number,
                        };
                        yield conn.insertGroupTransactionTrackingNo(clToclTransactionData);
                    }
                }
                yield this.insertAudit(req, 'create', `Group to group transfer created`, body.gtransfer_created_by, 'HAJJ_MGT');
                return {
                    success: true,
                    message: 'Hajji has been transfer group to group',
                    data: id,
                };
            }));
        });
        this.updateGroupToGroup = (req) => __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const id = Number(req.params.id);
            const ctrcknumber_numbers = body.ctrcknumber_number;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.HajjiManagementModels(req, trx);
                delete body.ctrcknumber_number;
                yield conn.updateGroupToGroup(body, id);
                yield conn.deleteGroupTransTracking(id);
                if (ctrcknumber_numbers) {
                    for (const grouptr_number of ctrcknumber_numbers) {
                        const clToclTransactionData = {
                            grouptr_gtransfer_id: id,
                            grouptr_number,
                        };
                        yield conn.insertGroupTransactionTrackingNo(clToclTransactionData);
                    }
                }
                const message = 'Group to group transfer update successfully...';
                yield this.insertAudit(req, 'update', message, body.gtransfer_created_by, 'HAJJ_MGT');
                return {
                    success: true,
                    data: 'Group to group transfer update successfully...',
                };
            }));
        });
        this.getAllGroupTransaction = (req) => __awaiter(this, void 0, void 0, function* () {
            const { page, size } = req.query;
            const conn = this.models.HajjiManagementModels(req);
            const data = yield conn.getAllGroupToGroupTransfer(Number(page) || 1, Number(size) || 20);
            return Object.assign({ success: true, message: 'Group to group transfer' }, data);
        });
        this.viewGroupTransfer = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.HajjiManagementModels(req);
            const conn_group = this.models.configModel.groupModel(req);
            const id = Number(req.params.id);
            const data = yield conn.viewGroupTransfer(id);
            const transfer_to_id = data.gtransfer_to;
            const transfer_to = yield conn_group.getGroupName(transfer_to_id);
            data.transfer_to = transfer_to;
            return { success: true, message: 'View group transfer data', data };
        });
        this.deleteGroupTransaction = (req) => __awaiter(this, void 0, void 0, function* () {
            const id = Number(req.params.id);
            const { deleted_by } = req.body;
            if (!id) {
                throw new customError_1.default('Pleace provide an id', 400, 'Id is empty');
            }
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.HajjiManagementModels(req, trx);
                const data = yield conn.deleteGroupTransaction(id, deleted_by);
                if (!data) {
                    throw new customError_1.default('Pleace provide an valid id', 400, 'Invalid Id');
                }
                yield conn.deleteGroupTransTracking(id);
                yield this.insertAudit(req, 'delete', `Group to group transfer deleted`, deleted_by, 'HAJJ_MGT');
                return {
                    success: true,
                    data: 'Group to group transfer deleted successfully...',
                };
            }));
        });
        this.getDetailsGroupTransactioon = (req) => __awaiter(this, void 0, void 0, function* () {
            const id = Number(req.params.id);
            const conn = this.models.HajjiManagementModels(req);
            const data = yield conn.getDetailsGroupTransaction(id);
            return {
                success: true,
                data,
            };
        });
    }
}
exports.default = GroupToGroupServices;
//# sourceMappingURL=GroupToGroupServices.js.map