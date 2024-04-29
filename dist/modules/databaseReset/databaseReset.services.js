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
const abstract_services_1 = __importDefault(require("../../abstracts/abstract.services"));
const customError_1 = __importDefault(require("../../common/utils/errors/customError"));
class DatabaseResetServices extends abstract_services_1.default {
    constructor() {
        super();
        this.resetDatabase = (req) => __awaiter(this, void 0, void 0, function* () {
            const { agency_id } = req.params;
            const pass = req.query.pass;
            const { deleted_by } = req.body;
            if (pass !== '668252') {
                throw new customError_1.default('Please provide currect password', 400, 'Incorrect password');
            }
            const conn = this.models.DatabaseResetModels(req);
            yield conn.resetAllAgencyData(agency_id);
            return {
                success: true,
                message: 'Delete Agency Data Successfuly!',
            };
        });
        this.indexDatabase = (req) => __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.default = DatabaseResetServices;
//# sourceMappingURL=databaseReset.services.js.map