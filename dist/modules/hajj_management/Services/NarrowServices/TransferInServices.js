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
class TransferInServices extends abstract_services_1.default {
    constructor() {
        super();
        this.addTransferIn = (req) => __awaiter(this, void 0, void 0, function* () {
            const { haji_informations, transfer_charge, transfer_agent_id, transfer_created_by, } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.HajjiManagementModels(req, trx);
                const transferInData = {
                    transfer_agent_id,
                    transfer_charge,
                    transfer_type: 'IN',
                    transfer_created_by,
                };
                const transfertrack_transfer_id = yield conn.insertHajiTransfer(transferInData);
                for (const item of haji_informations) {
                    const transferTrackingNo = {
                        transfertrack_tracking_no: item.transfertrack_tracking_no,
                        transfertrack_passport_id: item.transfertrack_passport_id,
                        transfertrack_maharam_id: item.transfertrack_maharam_id,
                        transfertrack_transfer_id,
                    };
                    yield conn.insertHajiTransferTrackingNo(transferTrackingNo);
                }
                const message = `Hajj transfer in has been created`;
                yield this.insertAudit(req, 'create', message, transfer_created_by, 'HAJJ_MGT');
                return { success: true, data: transfertrack_transfer_id };
            }));
        });
        this.updateTransferIn = (req) => __awaiter(this, void 0, void 0, function* () {
            const { haji_informations, transfer_charge, transfer_agent_id, transfer_created_by, } = req.body;
            const id = Number(req.params.id);
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.HajjiManagementModels(req, trx);
                const transferInData = {
                    transfer_agent_id,
                    transfer_charge,
                    transfer_type: 'IN',
                    transfer_created_by,
                };
                yield conn.updateHajiTransfer(transferInData, id);
                // ============ delete previous hajiInfo
                yield conn.deleteHajiTransferTrackingNo(id, transfer_created_by);
                for (const item of haji_informations) {
                    const transferTrackingNo = Object.assign(Object.assign({}, item), { transfertrack_transfer_id: id });
                    yield conn.insertHajiTransferTrackingNo(transferTrackingNo);
                }
                const message = `Hajj transfer in has been updated`;
                yield this.insertAudit(req, 'update', message, transfer_created_by, 'HAJJ_MGT');
                return { success: true, data: 'Updated successfully...' };
            }));
        });
        this.deleteTransferIn = (req) => __awaiter(this, void 0, void 0, function* () {
            const id = Number(req.params.id);
            const { deleted_by } = req.body;
            if (!id) {
                throw new customError_1.default('Please provide  a id', 400, 'Invalid Id');
            }
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.HajjiManagementModels(req, trx);
                yield conn.updateDeleteHajiTransfer(id, deleted_by);
                const message = `Hajj transfer in has been deleted`;
                yield this.insertAudit(req, 'create', message, deleted_by, 'HAJJ_MGT');
                return {
                    success: true,
                    data: 'Data deleted successfully...',
                };
            }));
        });
        this.getAllHajiTransfer = (req) => __awaiter(this, void 0, void 0, function* () {
            const { trash, page, size } = req.query;
            const conn = this.models.HajjiManagementModels(req);
            const transaction_type = req.params.type.toUpperCase();
            if (!['IN', 'OUT'].includes(transaction_type)) {
                throw new customError_1.default('Provide a valid transaction type', 400, 'Invalid Type');
            }
            const data = [];
            const items = yield conn.getAllHajiTransfer(transaction_type, Number(page) || 1, Number(size) || 20);
            const count = yield conn.countHajTransDataRow(transaction_type);
            for (const item of items) {
                const haji_info = yield conn.getTotalhaji(item.transfer_id);
                data.push(Object.assign(Object.assign({}, item), { haji_info }));
            }
            return {
                success: true,
                count: count.row_count,
                data,
            };
        });
        this.getDataForEdit = (req) => __awaiter(this, void 0, void 0, function* () {
            const id = Number(req.params.id);
            const conn = this.models.HajjiManagementModels(req);
            const data = yield conn.getHajiTransferForEdit(id);
            return {
                success: true,
                data,
            };
        });
        // =================== transfer out add update
        this.addTransferOut = (req) => __awaiter(this, void 0, void 0, function* () {
            const { haji_informations, transfer_charge, transfer_agent_id, transfer_created_by, } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.HajjiManagementModels(req, trx);
                const transferInData = {
                    transfer_charge,
                    transfer_agent_id,
                    transfer_type: 'OUT',
                    transfer_created_by,
                };
                const transfertrack_transfer_id = yield conn.insertHajiTransfer(transferInData);
                for (const item of haji_informations) {
                    const transferTrackingNo = Object.assign(Object.assign({}, item), { transfertrack_transfer_id });
                    yield conn.insertHajiTransferTrackingNo(transferTrackingNo);
                }
                const message = `Hajj transfer out has been created`;
                yield this.insertAudit(req, 'create', message, transfer_created_by, 'HAJJ_MGT');
                return {
                    success: true,
                    message: 'Haji transfer out created successful',
                    data: transfertrack_transfer_id,
                };
            }));
        });
        this.updateTransferOut = (req) => __awaiter(this, void 0, void 0, function* () {
            const { haji_informations, transfer_charge, transfer_agent_id, transfer_created_by, } = req.body;
            const id = Number(req.params.id);
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.HajjiManagementModels(req, trx);
                const transferInData = {
                    transfer_charge,
                    transfer_agent_id,
                    transfer_type: 'OUT',
                    transfer_created_by,
                };
                yield conn.updateHajiTransfer(transferInData, id);
                // ============ delete previous hajiInfo
                yield conn.deleteHajiTransferTrackingNo(id, transfer_created_by);
                for (const item of haji_informations) {
                    const transferTrackingNo = Object.assign(Object.assign({}, item), { transfertrack_transfer_id: id });
                    yield conn.insertHajiTransferTrackingNo(transferTrackingNo);
                }
                const message = `Hajj transfer out has been updated`;
                yield this.insertAudit(req, 'update', message, transfer_created_by, 'HAJJ_MGT');
                return { success: true, data: 'Updated successfully...' };
            }));
        });
    }
}
exports.default = TransferInServices;
//# sourceMappingURL=TransferInServices.js.map