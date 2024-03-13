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
class ServicesClientCategories extends abstract_services_1.default {
    constructor() {
        super();
        this.createClientCategory = (req) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.models.configModel
                .clientCategoryModel(req)
                .createClientCategory(req.body);
            return { success: true, data: data };
        });
        this.getAllClientCategories = (req) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.models.configModel
                .clientCategoryModel(req)
                .getAllClientCategories();
            return { success: true, data };
        });
        this.getClientCategories = (req) => __awaiter(this, void 0, void 0, function* () {
            const { page, size } = req.query;
            const data = yield this.models.configModel
                .clientCategoryModel(req)
                .getClientCategories(Number(page) || 1, Number(size) || 20);
            const count = yield this.models.configModel
                .clientCategoryModel(req)
                .countClientCategory();
            return { success: true, count, data };
        });
        this.deleteClientCategoryById = (req) => __awaiter(this, void 0, void 0, function* () {
            const { category_id } = req.params;
            const { deleted_by } = req.body;
            return yield this.models.db.transaction((trx) => __awaiter(this, void 0, void 0, function* () {
                const conn = this.models.configModel.clientCategoryModel(req, trx);
                const clients = yield conn.clients(category_id);
                if (clients.length) {
                    throw new customError_1.default('Category can not be deleted, there are clients with this category', 400, 'Bad request');
                }
                else {
                    yield conn.deleteClientCategory(category_id, deleted_by);
                }
                return {
                    success: true,
                    message: `client category has been deleted`,
                };
            }));
        });
        /**
         * edit client category by id
         */
        this.editClientCategoryById = (req) => __awaiter(this, void 0, void 0, function* () {
            const { category_id } = req.params;
            const data = yield this.models.configModel
                .clientCategoryModel(req)
                .editClientCategory(req.body, category_id);
            if (data) {
                return {
                    success: true,
                    message: 'Client category updated successfully.',
                    data,
                };
            }
            else {
                throw new customError_1.default('Please provide a valid Id', 400, 'Bad request');
            }
        });
    }
}
exports.default = ServicesClientCategories;
//# sourceMappingURL=clientCategories.services.js.map