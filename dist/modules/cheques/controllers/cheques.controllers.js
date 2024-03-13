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
const abstract_controllers_1 = __importDefault(require("../../../abstracts/abstract.controllers"));
const cheques_services_1 = __importDefault(require("../services/cheques.services"));
const cheques_validators_1 = __importDefault(require("../validators/cheques.validators"));
class chequesControllers extends abstract_controllers_1.default {
    constructor() {
        super();
        this.services = new cheques_services_1.default();
        this.validator = new cheques_validators_1.default();
        this.getAllCheques = this.assyncWrapper.wrap(this.validator.readCheques, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.getAllCheques(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error('get all cheques...');
            }
        }));
        this.updateChequeStatus = this.assyncWrapper.wrap(this.validator.updateChequeStatus, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.services.updateChequeStatus(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
    }
}
exports.default = chequesControllers;
//# sourceMappingURL=cheques.controllers.js.map