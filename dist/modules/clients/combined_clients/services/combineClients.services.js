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
const createCombineClients_services_1 = __importDefault(require("./narrowServices/createCombineClients.services"));
const deleteCombineClient_services_1 = __importDefault(require("./narrowServices/deleteCombineClient.services"));
const editCombineClients_services_1 = __importDefault(require("./narrowServices/editCombineClients.services"));
class CombineClientsServices extends abstract_services_1.default {
    constructor() {
        super();
        this.getAllCombines = (req) => __awaiter(this, void 0, void 0, function* () {
            const { trash, page, size, search } = req.query;
            const conn = this.models.combineClientModel(req);
            const data = yield conn.getAllCombines(Number(trash) || 0, Number(page) || 1, Number(size) || 20, search);
            const count = yield conn.countCombineDataRow(Number(trash) || 0, search);
            return { success: true, count, data };
        });
        this.viewAllCombine = (req) => __awaiter(this, void 0, void 0, function* () {
            const { search } = req.query;
            const conn = this.models.combineClientModel(req);
            const data = yield conn.viewAllCombine(search);
            return { success: true, data };
        });
        this.getCombineClientExcelReport = (req) => __awaiter(this, void 0, void 0, function* () {
            const conn = this.models.combineClientModel(req);
            const clients = yield conn.getCombineClientExcelReport();
            return { success: true, clientsData: clients };
        });
        this.getCombineForEdit = (req) => __awaiter(this, void 0, void 0, function* () {
            const { combine_id } = req.params;
            const conn = this.models.combineClientModel(req);
            const data = yield conn.getSingleCombinedClient(combine_id);
            const cproduct_product_id = yield conn.getCombinePrevProductsId(combine_id);
            return { success: true, data: Object.assign(Object.assign({}, data), { cproduct_product_id }) };
        });
        this.updateClientStatus = (req) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { combine_client_status, updated_by } = req.body;
            const conn = this.models.combineClientModel(req);
            const data = yield conn.updateClientStatus(id, combine_client_status);
            const message = `Combine client status updated as -${combine_client_status === 1 ? 'Active' : 'Inactive'}-`;
            yield this.insertAudit(req, 'create', message, updated_by, 'ACCOUNTS');
            return {
                success: true,
                message: 'Combined client active status has been updated ',
            };
        });
        this.createCombineClients = new createCombineClients_services_1.default().createCombineClient;
        this.editCombineClients = new editCombineClients_services_1.default().editCombineClient;
        this.deleteCombineClients = new deleteCombineClient_services_1.default().deleteCombineClient;
    }
}
exports.default = CombineClientsServices;
//# sourceMappingURL=combineClients.services.js.map