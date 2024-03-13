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
const abstract_controllers_1 = __importDefault(require("../../../../abstracts/abstract.controllers"));
const mahram_services_1 = __importDefault(require("./mahram.services"));
const mahram_validators_1 = __importDefault(require("./mahram.validators"));
class ControllersMahram extends abstract_controllers_1.default {
    constructor() {
        super(...arguments);
        this.servicesMahram = new mahram_services_1.default();
        this.validator = new mahram_validators_1.default();
        this.createControllerMahram = this.assyncWrapper.wrap(this.validator.createMahram, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesMahram.T_createMahram(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.updateControllerMahram = this.assyncWrapper.wrap(this.validator.editMahram, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesMahram.T_updateMahram(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.viewMahrams = this.assyncWrapper.wrap(this.validator.readMahram, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesMahram.viewMahrams(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.getAllMahrams = this.assyncWrapper.wrap([], (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesMahram.getAllMahrams(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else {
                this.error();
            }
        }));
        this.deleteControllerMahram = this.assyncWrapper.wrap(this.validator.deleteMahram, (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.servicesMahram.T_deleteMahram(req);
            if (data.success) {
                res.status(200).json(data);
            }
            else
                this.error();
        }));
    }
}
exports.default = ControllersMahram;
//# sourceMappingURL=mahram.controllers.js.map