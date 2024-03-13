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
class ServicesAirlines extends abstract_services_1.default {
    constructor() {
        super();
        this.createAirlines = (req) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.models.configModel
                .airlineModel(req)
                .createAirlines(req.body);
            return { success: true, data: { airline_id: data } };
        });
        this.updateAirline = (req) => __awaiter(this, void 0, void 0, function* () {
            const { airline_id } = req.params;
            const data = yield this.models.configModel
                .airlineModel(req)
                .updateAirlines(req.body, airline_id);
            if (data === 0) {
                throw new customError_1.default('Please provide a valid Id to update', 400, 'Update failed');
            }
            return { success: true, data };
        });
        this.deleteAirLines = (req) => __awaiter(this, void 0, void 0, function* () {
            const { airline_id } = req.params;
            const { deleted_by } = req.body;
            const data = yield this.models.configModel
                .airlineModel(req)
                .deleteAirline(airline_id, deleted_by);
            return { success: true, data };
        });
        this.viewAirlines = (req) => __awaiter(this, void 0, void 0, function* () {
            const { page, size } = req.query;
            const data = yield this.models.configModel
                .airlineModel(req)
                .viewAirlines(Number(page) || 1, Number(size) || 20);
            const count = yield this.models.configModel
                .airlineModel(req)
                .countAirliensDataRow();
            return { success: true, count, data };
        });
        this.getAirlines = (req) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.models.configModel.airlineModel(req).getAirlines();
            return { success: true, data };
        });
    }
}
exports.default = ServicesAirlines;
//# sourceMappingURL=airlines.services.js.map