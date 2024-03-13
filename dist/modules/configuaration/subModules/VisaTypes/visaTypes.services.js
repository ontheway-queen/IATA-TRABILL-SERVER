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
class ServicesVisaTypes extends abstract_services_1.default {
    constructor() {
        super();
        this.createVisaType = (req) => __awaiter(this, void 0, void 0, function* () {
            const visaId = yield this.models.configModel
                .visaTypeModel(req)
                .createVisaType(req.body);
            return {
                success: true,
                message: 'Visa type created successfully',
                data: { type_id: visaId },
            };
        });
        this.viewVisaType = (req) => __awaiter(this, void 0, void 0, function* () {
            const { page, size } = req.query;
            const data = yield this.models.configModel
                .visaTypeModel(req)
                .viewVisaType(page, size);
            const count = yield this.models.configModel
                .visaTypeModel(req)
                .countVisaTypeDataRow();
            return { success: true, count, data: data };
        });
        this.getAllVisaType = (req) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.models.configModel
                .visaTypeModel(req)
                .getAllVisaType();
            return { success: true, data: data };
        });
        this.editVisaType = (req) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const visaTypes = yield this.models.configModel
                .visaTypeModel(req)
                .editVisaType(req.body, id);
            if (visaTypes) {
                return {
                    success: true,
                    message: 'visa type updated successfully',
                    data: visaTypes,
                };
            }
            else {
                throw new customError_1.default('Please provide a valid Id', 400, 'Bad request');
            }
        });
        this.deleteVisaType = (req) => __awaiter(this, void 0, void 0, function* () {
            const { type_id } = req.params;
            const data = yield this.models.configModel
                .visaTypeModel(req)
                .deleteVisaType(type_id);
            return { success: true, data };
        });
    }
}
exports.default = ServicesVisaTypes;
//# sourceMappingURL=visaTypes.services.js.map