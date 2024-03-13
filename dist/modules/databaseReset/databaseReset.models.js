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
const abstract_models_1 = __importDefault(require("../../abstracts/abstract.models"));
const customError_1 = __importDefault(require("../../common/utils/errors/customError"));
class DatabaseResetModels extends abstract_models_1.default {
    constructor() {
        super(...arguments);
        this.resetDatabase = (tableName) => __awaiter(this, void 0, void 0, function* () {
            yield this.db.raw('SET FOREIGN_KEY_CHECKS = 0;');
            // delete all table data
            for (const talbe of tableName) {
                yield this.query()
                    .from(talbe)
                    .del()
                    .then(() => {
                    return this.db.raw(`ALTER TABLE ${this.database}.${talbe} AUTO_INCREMENT = 1`);
                });
            }
            yield this.db.raw('SET FOREIGN_KEY_CHECKS = 1;');
        });
        this.indexDatabase = () => __awaiter(this, void 0, void 0, function* () {
            yield this.db.raw('CREATE INDEX hajji_by_searching ON trabill_haji_informations (hajiinfo_tracking_number, hajiinfo_nid, hajiinfo_serial);');
        });
    }
    resetAllAgencyData(agency_id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!agency_id) {
                throw new customError_1.default('Please provice a valid agency ID', 500, 'Bad request');
            }
            return this.db.raw(`call ${this.database}.resetDatabase(${agency_id});`);
        });
    }
}
exports.default = DatabaseResetModels;
//# sourceMappingURL=databaseReset.models.js.map