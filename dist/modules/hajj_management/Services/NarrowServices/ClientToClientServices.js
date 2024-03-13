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
const common_helper_1 = require("../../../../common/helpers/common.helper");
const customError_1 = __importDefault(require("../../../../common/utils/errors/customError"));
class ClientToClientServices extends abstract_services_1.default {
    constructor() {
        super();
        this.addClientToClient = (req) => __awaiter(this, void 0, void 0, function* () {
            const { ctransfer_combclient_from, ctransfer_combclient_to, ctransfer_created_by, ctransfer_job_name, ctransfer_charge, ctransfer_note, ctransfer_tracking_no, ctrcknumber_number, } = req.body;
            if (ctransfer_combclient_from === ctransfer_combclient_to) {
                throw new customError_1.default('Client transfer from and to must be diffrent', 400, 'Invalid client select');
            }
            const combclient_from = (0, common_helper_1.separateCombClientToId)(ctransfer_combclient_from);
            const combclient_to = (0, common_helper_1.separateCombClientToId)(ctransfer_combclient_to);
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.HajjiManagementModels(req, trx);
                const cltocl_data = {
                    ctransfer_client_from: combclient_from.client_id,
                    ctransfer_client_to: combclient_to.client_id,
                    ctransfer_combined_from: combclient_from.combined_id,
                    ctransfer_combined_to: combclient_to.combined_id,
                    ctransfer_created_by,
                    ctransfer_charge,
                    ctransfer_job_name,
                    ctransfer_note,
                    ctransfer_tracking_no,
                };
                const id = yield conn.insertClientToClient(cltocl_data);
                if (ctrcknumber_number) {
                    const clToclTransactionData = ctrcknumber_number.map((item) => {
                        return { ctrcknumber_ctransfer_id: id, ctrcknumber_number: item };
                    });
                    yield conn.insertClToClTransaction(clToclTransactionData);
                }
                const content = `Client to client hajj successfully transfer`;
                yield this.insertAudit(req, 'create', content, ctransfer_created_by, 'HAJJ_MGT');
                return {
                    success: true,
                    message: 'Client to client hajj transfer succeed',
                    data: id,
                };
            }));
        });
        this.updateClientToClient = (req) => __awaiter(this, void 0, void 0, function* () {
            const { ctransfer_combclient_from, ctransfer_combclient_to, ctransfer_created_by, ctransfer_job_name, ctransfer_note, ctransfer_charge, ctransfer_tracking_no, ctrcknumber_number, } = req.body;
            if (ctransfer_combclient_from === ctransfer_combclient_to) {
                throw new customError_1.default('Client transfer from and to must be different', 400, 'Invalid client select');
            }
            const combclient_from = (0, common_helper_1.separateCombClientToId)(ctransfer_combclient_from);
            const combclient_to = (0, common_helper_1.separateCombClientToId)(ctransfer_combclient_to);
            const id = Number(req.params.id);
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.HajjiManagementModels(req, trx);
                const cltocl_data = {
                    ctransfer_client_from: combclient_from.client_id,
                    ctransfer_client_to: combclient_to.client_id,
                    ctransfer_combined_from: combclient_from.combined_id,
                    ctransfer_combined_to: combclient_to.combined_id,
                    ctransfer_updated_by: ctransfer_created_by,
                    ctransfer_charge,
                    ctransfer_job_name,
                    ctransfer_note,
                    ctransfer_tracking_no,
                };
                yield conn.updateClientToClient(cltocl_data, id);
                // @Delete previous clToCl Transaction data
                yield conn.deleteClToClTransaction(id, ctransfer_created_by);
                if (ctrcknumber_number) {
                    const clToclTransactionData = ctrcknumber_number.map((item) => {
                        return { ctrcknumber_ctransfer_id: id, ctrcknumber_number: item };
                    });
                    yield conn.insertClToClTransaction(clToclTransactionData);
                }
                const content = `Client to client hajj transfer updated`;
                yield this.insertAudit(req, 'update', content, ctransfer_created_by, 'HAJJ_MGT');
                return {
                    success: true,
                    data: 'Client to client transfer update successfully...',
                };
            }));
        });
        this.deleteClientToClient = (req) => __awaiter(this, void 0, void 0, function* () {
            const id = Number(req.params.id);
            const { transfer_deleted_by } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.HajjiManagementModels(req, trx);
                const data = yield conn.deleteClientToClient(id, transfer_deleted_by);
                if (!data) {
                    throw new customError_1.default('Pleace provide an valid id', 400, 'Invalid Id');
                }
                yield conn.deleteClToClTransaction(id, transfer_deleted_by);
                const message = `Client to client hajj transfer deleted`;
                yield this.insertAudit(req, 'delete', message, transfer_deleted_by, 'HAJJ_MGT');
                return {
                    success: true,
                    data: 'Client to client transfer deleted successfully...',
                };
            }));
        });
        this.getAllClientToClient = (req) => __awaiter(this, void 0, void 0, function* () {
            const { page, size, trash } = req.query;
            const conn = this.models.HajjiManagementModels(req);
            const data = yield conn.getAllClientToClient(Number(page) || 1, Number(size) || 20);
            return Object.assign({ success: true, message: 'Client to client transfer' }, data);
        });
        this.getDetailsClientToClient = (req) => __awaiter(this, void 0, void 0, function* () {
            const id = Number(req.params.id);
            if (!id) {
                throw new customError_1.default('Please provide Id', 400, 'Empty Id');
            }
            const conn = this.models.HajjiManagementModels(req);
            const data = yield conn.getDetailsClientToClient(id);
            return {
                success: true,
                data,
            };
        });
        this.viewClientTransaction = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.HajjiManagementModels(req);
            const conn_client = this.models.clientModel(req);
            const id = Number(req.params.id);
            const data = yield conn.viewClientTransaction(id);
            const transfer_to_id = data.ctransfer_client_to;
            const transfer_to = yield conn_client.getClientName(transfer_to_id);
            data.transfer_to = transfer_to.client_name;
            return { success: true, data };
        });
    }
}
exports.default = ClientToClientServices;
//# sourceMappingURL=ClientToClientServices.js.map