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
class ServicesRoomTypes extends abstract_services_1.default {
    constructor() {
        super();
        this.createRoomType = (req) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.models.configModel
                .roomTypeModel(req)
                .createRoomType(req.body);
            return {
                success: true,
                data: { rtype_id: data },
            };
        });
        this.viewRoomTypes = (req) => __awaiter(this, void 0, void 0, function* () {
            const { page, size } = req.query;
            const data = yield this.models.configModel
                .roomTypeModel(req)
                .viewRoomTypes(Number(page), Number(size) || 20);
            const count = yield this.models.configModel
                .roomTypeModel(req)
                .countRoomTypeDataRow();
            return { success: true, count, data };
        });
        this.getAllRoomTypes = (req) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.models.configModel
                .roomTypeModel(req)
                .getAllRoomTypes();
            return { success: true, data };
        });
        this.editRoomType = (req) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const data = yield this.models.configModel
                .roomTypeModel(req)
                .editRoomType(req.body, id);
            if (data) {
                return {
                    success: true,
                    data,
                };
            }
            else {
                throw new customError_1.default('Please provide a valid Id', 400, 'Bad request');
            }
        });
        this.deleteRoomType = (req) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const data = yield this.models.configModel
                .roomTypeModel(req)
                .deleteRoomType(id);
            return { success: true, data };
        });
    }
}
exports.default = ServicesRoomTypes;
//# sourceMappingURL=roomTypes.services.js.map