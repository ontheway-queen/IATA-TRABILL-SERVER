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
const abstract_controllers_1 = __importDefault(require("../../abstracts/abstract.controllers"));
const databaseReset_Validators_1 = __importDefault(require("./databaseReset.Validators"));
const databaseReset_services_1 = __importDefault(require("./databaseReset.services"));
class DatabaseResetControllers extends abstract_controllers_1.default {
    constructor() {
        super();
        this.validator = new databaseReset_Validators_1.default();
        this.services = new databaseReset_services_1.default();
        this.databaseReset = this.assyncWrapper.wrap(this.validator.database, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.resetDatabase(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                throw new Error('Thare was an error in invoice post');
            }
        }));
    }
}
exports.default = DatabaseResetControllers;
//# sourceMappingURL=databaseReset.controllers.js.map