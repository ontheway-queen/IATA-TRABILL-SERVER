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
class ServicesDesignations extends abstract_services_1.default {
    constructor() {
        super();
        this.createDesignation = (req) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.models.configModel
                .designationModel(req)
                .createDesignation(req.body);
            return {
                success: true,
                data: { designation_id: data },
            };
        });
        this.viewDesignations = (req) => __awaiter(this, void 0, void 0, function* () {
            const { page, size } = req.query;
            const data = yield this.models.configModel
                .designationModel(req)
                .viewDesignations(Number(page) || 0, Number(size) || 20);
            const count = yield this.models.configModel
                .designationModel(req)
                .countDesignationsDataRow();
            return { success: true, count, data };
        });
        this.getAllDesignations = (req) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.models.configModel
                .designationModel(req)
                .getAllDesignations();
            return { success: true, data };
        });
        this.deleteDesignation = (req) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { deleted_by } = req.body;
            const data = yield this.models.configModel
                .designationModel(req)
                .deleteDesignation(id, deleted_by);
            return { success: true, data };
        });
        /**
         * edit designation by id
         */
        this.editDesignation = (req) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const data = yield this.models.configModel
                .designationModel(req)
                .editDesignation(req.body, id);
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
    }
}
exports.default = ServicesDesignations;
//# sourceMappingURL=designations.services.js.map