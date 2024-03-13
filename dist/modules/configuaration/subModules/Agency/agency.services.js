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
class ServicesAgency extends abstract_services_1.default {
    constructor() {
        super();
        this.createAgency = (req) => __awaiter(this, void 0, void 0, function* () {
            const agency_id = yield this.models.configModel
                .agencyModel(req)
                .createAgency(req.body);
            return { success: true, data: { agency_id } };
        });
        this.updateAgency = (req) => __awaiter(this, void 0, void 0, function* () {
            const { agency_id } = req.params;
            const data = yield this.models.configModel
                .agencyModel(req)
                .updateAgency(req.body, agency_id);
            if (data === 0) {
                throw new customError_1.default('Please provide a valid Id to update', 400, 'Update failed');
            }
            return { success: true, data };
        });
        this.viewAgencies = (req) => __awaiter(this, void 0, void 0, function* () {
            const { page, size } = req.query;
            const data = yield this.models.configModel
                .agencyModel(req)
                .viewAgencies(Number(page) || 1, Number(size) || 20);
            const count = yield this.models.configModel
                .agencyModel(req)
                .countAgencysDataRow();
            return { success: true, count, data };
        });
        this.getAgencies = (req) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.models.configModel.agencyModel(req).getAgencies();
            return { success: true, data };
        });
        this.deleteAgency = (req) => __awaiter(this, void 0, void 0, function* () {
            const { agency_id } = req.params;
            const { delete_by } = req.body;
            const data = yield this.models.configModel
                .agencyModel(req)
                .deleteAgencies(agency_id, delete_by);
            return { success: true, data };
        });
    }
}
exports.default = ServicesAgency;
//# sourceMappingURL=agency.services.js.map