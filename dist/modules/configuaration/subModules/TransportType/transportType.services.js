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
class TransportTypeServices extends abstract_services_1.default {
    constructor() {
        super();
        this.createTransportType = (req) => __awaiter(this, void 0, void 0, function* () {
            const id = yield this.models.configModel
                .TransportTypeModel(req)
                .insertTransportType(req.body);
            return {
                success: true,
                message: 'Transport type created successfully',
                data: { id },
            };
        });
        this.viewTransportTypes = (req) => __awaiter(this, void 0, void 0, function* () {
            const { page, size } = req.query;
            const data = yield this.models.configModel
                .TransportTypeModel(req)
                .viewTransportTypes(Number(page) || 1, Number(size) || 20);
            const count = yield this.models.configModel
                .TransportTypeModel(req)
                .countTransportType();
            return { success: true, count, data };
        });
        this.getAllTransportTypes = (req) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.models.configModel
                .TransportTypeModel(req)
                .getAllTransportTypes();
            return { success: true, data };
        });
        this.updateTransportType = (req) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            yield this.models.configModel
                .TransportTypeModel(req)
                .updateTransportType(req.body, id);
            return {
                success: true,
                message: 'Transport type updated successfully',
            };
        });
        this.deleteTransportType = (req) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { deleted_by } = req.body;
            yield this.models.configModel
                .TransportTypeModel(req)
                .deleteTransportType(id, deleted_by);
            return { success: true, message: 'Transport type has been deleted' };
        });
    }
}
exports.default = TransportTypeServices;
//# sourceMappingURL=transportType.services.js.map