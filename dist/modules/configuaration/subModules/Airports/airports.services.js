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
class ServicesAirports extends abstract_services_1.default {
    constructor() {
        super();
        this.createAirports = (req) => __awaiter(this, void 0, void 0, function* () {
            const insertBody = [];
            for (let i = 0; i < req.body.airport_info.length; i++) {
                insertBody.push(Object.assign(Object.assign({}, req.body.airport_info[i]), { airline_country_id: req.body.airline_country_id, airline_created_by: req.body.airline_created_by }));
            }
            const data = yield this.models.configModel
                .airportsModel(req)
                .createAirports(insertBody);
            return { success: true, data: data };
        });
        this.viewAirports = (req) => __awaiter(this, void 0, void 0, function* () {
            const { page, size } = req.query;
            const data = yield this.models.configModel
                .airportsModel(req)
                .viewAirports(Number(page) || 1, Number(size) || 20);
            const count = yield this.models.configModel
                .airportsModel(req)
                .countAirportsDataRow();
            return { success: true, count, data };
        });
        this.getAllAirports = (req) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.models.configModel
                .airportsModel(req)
                .getAllAirports();
            return { success: true, data };
        });
        this.getAirportById = (req) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const data = yield this.models.configModel
                .airportsModel(req)
                .getAirportById(id);
            return { success: true, data: data };
        });
        this.deleteAirportsById = (req) => __awaiter(this, void 0, void 0, function* () {
            const { airline_id } = req.params;
            const { deleted_by } = req.body;
            const data = yield this.models.configModel
                .airportsModel(req)
                .deleteAirport(airline_id, deleted_by);
            return { success: true, data };
        });
        this.editAirportsById = (req) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const data = yield this.models.configModel
                .airportsModel(req)
                .editAirport(req.body, id);
            if (data === 0) {
                throw new customError_1.default('Please provide a valid Id to update', 400, 'Update failed');
            }
            return { success: true, data };
        });
        this.viewAllCountries = (req) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.models.configModel
                .airportsModel(req)
                .getAllCountries();
            return { success: true, data };
        });
    }
}
exports.default = ServicesAirports;
//# sourceMappingURL=airports.services.js.map